#!/usr/bin/env node

import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { CONFIGURATOR_MATRIX_PROFILES } from './configurator-matrix-profiles.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const PLAN_PATH = path.join(REPO_ROOT, 'specs', 'proofs', 'web', 'WEB-035', 'configurator-matrix-master-plan.json');
const REPORT_PATH = path.join(REPO_ROOT, 'specs', 'proofs', 'web', 'WEB-035', 'configurator-matrix-master-fidelity.json');
const CANVAS = { width: 800, height: 533 };
const TARGET_WIDTH = 0.84;
const TARGET_BASELINE = 0.876;

const args = process.argv.slice(2);
const productArg = args.indexOf('--product');
const requestedProduct = productArg >= 0 ? args[productArg + 1] : null;

function absolute(repoRelative) {
  return path.join(REPO_ROOT, ...repoRelative.split('/'));
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function rgbToHsl(r, g, b) {
  const rp = r / 255;
  const gp = g / 255;
  const bp = b / 255;
  const max = Math.max(rp, gp, bp);
  const min = Math.min(rp, gp, bp);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === rp) h = (gp - bp) / d + (gp < bp ? 6 : 0);
  else if (max === gp) h = (bp - rp) / d + 2;
  else h = (rp - gp) / d + 4;
  return { h: h * 60, s, l };
}

function inPaintRegion(x, y, info, regions) {
  if (!regions?.length) return true;
  const nx = x / info.width;
  const ny = y / info.height;
  return regions.some(([left, top, right, bottom]) => (
    nx >= left && nx <= right && ny >= top && ny <= bottom
  ));
}

function isPaint(profile, r, g, b, a, x, y, info) {
  if (a < 24 || !inPaintRegion(x, y, info, profile.paint.regions)) return false;
  const { h, s, l } = rgbToHsl(r, g, b);
  const hueMatch = profile.paint.hueRanges?.some(([min, max]) => h >= min && h <= max);
  if (hueMatch) {
    return s >= (profile.paint.minS ?? 0) && l >= (profile.paint.minL ?? 0) && l <= (profile.paint.maxL ?? 1);
  }
  const neutral = profile.paint.neutral;
  return Boolean(neutral && s <= neutral.maxS && l >= neutral.minL && l <= neutral.maxL);
}

async function alphaBounds(sourcePath) {
  const image = sharp(sourcePath, { limitInputPixels: false }).ensureAlpha();
  const metadata = await image.metadata();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  let left = info.width;
  let top = info.height;
  let right = -1;
  let bottom = -1;
  let alphaMin = 255;
  let alphaMax = 0;
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const alpha = data[(y * info.width + x) * 4 + 3];
      alphaMin = Math.min(alphaMin, alpha);
      alphaMax = Math.max(alphaMax, alpha);
      if (alpha <= 32) continue;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }
  if (right < 0) throw new Error(`No opaque subject pixels in ${sourcePath}`);
  return {
    metadata,
    alphaMin,
    alphaMax,
    left,
    top,
    right,
    bottom,
    width: right - left + 1,
    height: bottom - top + 1,
  };
}

async function normalised(sourcePath, bounds) {
  const input = sharp(sourcePath, { limitInputPixels: false }).ensureAlpha();
  const scale = (CANVAS.width * TARGET_WIDTH) / bounds.width;
  const resizedWidth = Math.round(bounds.width * scale);
  const resizedHeight = Math.round(bounds.height * scale);
  const left = Math.round((CANVAS.width - resizedWidth) / 2);
  const top = Math.round(CANVAS.height * TARGET_BASELINE - resizedHeight);
  const buffer = await sharp({
    create: { width: CANVAS.width, height: CANVAS.height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  }).composite([{
    input: await input.extract({
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
    }).resize(resizedWidth, resizedHeight).png().toBuffer(),
    left,
    top,
  }]).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return buffer;
}

function paintMetrics(profile, source, candidate) {
  let sourceCount = 0;
  let candidateCount = 0;
  let intersection = 0;
  let union = 0;
  for (let offset = 0; offset < source.data.length; offset += 4) {
    const pixel = offset / 4;
    const x = pixel % source.info.width;
    const y = Math.floor(pixel / source.info.width);
    const sourcePaint = isPaint(
      profile,
      source.data[offset],
      source.data[offset + 1],
      source.data[offset + 2],
      source.data[offset + 3],
      x,
      y,
      source.info,
    );
    const candidatePaint = isPaint(
      profile,
      candidate.data[offset],
      candidate.data[offset + 1],
      candidate.data[offset + 2],
      candidate.data[offset + 3],
      x,
      y,
      candidate.info,
    );
    if (sourcePaint) sourceCount += 1;
    if (candidatePaint) candidateCount += 1;
    if (sourcePaint && candidatePaint) intersection += 1;
    if (sourcePaint || candidatePaint) union += 1;
  }
  return {
    sourcePixels: sourceCount,
    candidatePixels: candidateCount,
    overlap: sourceCount ? Number((intersection / sourceCount).toFixed(4)) : 1,
    iou: union ? Number((intersection / union).toFixed(4)) : 1,
    areaRatio: sourceCount ? Number((candidateCount / sourceCount).toFixed(4)) : 1,
  };
}

const plan = JSON.parse(await readFile(PLAN_PATH, 'utf8'));
const records = [];
const auditEntries = Array.isArray(plan.masters)
  ? plan.masters.filter((entry) => !entry.stock)
  : plan.queue;

for (const entry of auditEntries) {
  if (requestedProduct && entry.productId !== requestedProduct) continue;
  const outputPath = absolute(entry.outputPath);
  if (!(await exists(outputPath))) continue;
  const profile = CONFIGURATOR_MATRIX_PROFILES[entry.productId];
  const canonicalPath = absolute(entry.canonicalSourcePath);
  const [sourceBounds, candidateBounds] = await Promise.all([
    alphaBounds(canonicalPath),
    alphaBounds(outputPath),
  ]);
  const [source, candidate] = await Promise.all([
    normalised(canonicalPath, sourceBounds),
    normalised(outputPath, candidateBounds),
  ]);
  const paint = paintMetrics(profile, source, candidate);
  const aspectDelta = Math.abs(
    (candidateBounds.width / candidateBounds.height) - (sourceBounds.width / sourceBounds.height),
  );
  const safety = {
    left: candidateBounds.left / candidateBounds.metadata.width,
    right: (candidateBounds.metadata.width - candidateBounds.right - 1) / candidateBounds.metadata.width,
    top: candidateBounds.top / candidateBounds.metadata.height,
    bottom: (candidateBounds.metadata.height - candidateBounds.bottom - 1) / candidateBounds.metadata.height,
  };
  const paintAuditIsVisualOnly = profile.paintAuditMode === 'visual-only';
  const checks = {
    transparent: candidateBounds.alphaMin === 0 && candidateBounds.alphaMax === 255,
    resolution: candidateBounds.metadata.width >= 1024 && candidateBounds.metadata.height >= 682,
    unclipped: Object.values(safety).every((value) => value >= 0.005),
    aspect: aspectDelta <= 0.18,
    paintOverlap: paintAuditIsVisualOnly || paint.overlap >= (profile.minPaintOverlap ?? 0.6),
    paintArea: paintAuditIsVisualOnly || (paint.areaRatio >= 0.55 && paint.areaRatio <= 1.8),
  };
  records.push({
    id: entry.id,
    productId: entry.productId,
    outputPath: entry.outputPath,
    canonicalSourcePath: entry.canonicalSourcePath,
    candidate: {
      width: candidateBounds.metadata.width,
      height: candidateBounds.metadata.height,
      alphaMin: candidateBounds.alphaMin,
      alphaMax: candidateBounds.alphaMax,
      safety,
    },
    aspectDelta: Number(aspectDelta.toFixed(4)),
    paint,
    paintAuditMode: profile.paintAuditMode ?? 'automated',
    paintOverlapThreshold: profile.minPaintOverlap ?? 0.6,
    checks,
    passed: Object.values(checks).every(Boolean),
  });
}

const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  product: requestedProduct || 'all',
  audited: records.length,
  passed: records.filter((record) => record.passed).length,
  failed: records.filter((record) => !record.passed).length,
  note: 'Automated checks verify canvas, alpha, clipping, silhouette aspect and catalog-paint overlap. Wordmark and component accuracy still require contact-sheet review.',
  records,
};

await mkdir(path.dirname(REPORT_PATH), { recursive: true });
await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ report: path.relative(REPO_ROOT, REPORT_PATH), audited: report.audited, passed: report.passed, failed: report.failed }, null, 2));
if (report.failed) process.exitCode = 1;
