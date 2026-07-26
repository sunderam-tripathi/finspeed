#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const PROOF_ROOT = path.join(REPO_ROOT, 'specs', 'proofs', 'web', 'WEB-035', 'mako-exhaustive-r01');
const PUBLIC_ROOT = path.join(REPO_ROOT, 'apps', 'web', 'public');
const OUT_ROOT = path.join(PUBLIC_ROOT, 'assets', 'configurator', 'v1', 'mako-shark', 'side-r');
const MATRIX_ROOT = path.join(OUT_ROOT, 'matrix');
const CANONICAL_STOCK = path.join(
  REPO_ROOT,
  'apps',
  'web',
  'public',
  'assets',
  'configurator',
  'v1',
  'mako-shark',
  'side-r',
  'light',
  'poster',
  'mako-shark-27-5-geared-r01-w1600.webp',
);

const CANVAS = { width: 1600, height: 1067 };
const WIDTHS = [480, 960, 1600];
const TARGET_WIDTH = 0.84;
const TARGET_BASELINE = 0.94;

const BRAKES = ['power', 'disc'];
const FORKS = ['rigid', 'front'];
const DRIVETRAINS = ['single', '21'];
const CARRIERS = ['none', 'carrier'];
const FINISHES = [
  { id: 'catalog', optionId: 'catalog-finish', label: 'Catalog finish', tint: null },
  { id: 'graphite', optionId: 'graphite-request', label: 'Graphite', tint: { h: 205, s: 0.08, lScale: 0.36, lOffset: 0.02 } },
  { id: 'blue', optionId: 'deep-blue-request', label: 'Deep blue', tint: { h: 207, s: 0.48, lScale: 0.58, lOffset: 0.04 } },
  { id: 'red', optionId: 'signal-red-request', label: 'Signal red', tint: { h: 358, s: 0.66, lScale: 0.66, lOffset: 0.03 } },
  { id: 'silver', optionId: 'pearl-silver-request', label: 'Pearl silver', tint: { h: 55, s: 0.08, lScale: 0.9, lOffset: 0.08 } },
];

function relPublic(absolute) {
  return `/${path.relative(PUBLIC_ROOT, absolute).split(path.sep).join('/')}`;
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex').toUpperCase();
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
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

function hslToRgb(h, s, l) {
  const hp = (((h % 360) + 360) % 360) / 360;
  if (s === 0) {
    const grey = Math.round(l * 255);
    return [grey, grey, grey];
  }
  const hue2rgb = (p, q, t) => {
    let next = t;
    if (next < 0) next += 1;
    if (next > 1) next -= 1;
    if (next < 1 / 6) return p + (q - p) * 6 * next;
    if (next < 1 / 2) return q;
    if (next < 2 / 3) return p + (q - p) * (2 / 3 - next) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, hp + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, hp) * 255),
    Math.round(hue2rgb(p, q, hp - 1 / 3) * 255),
  ];
}

function isMakoPaint(r, g, b, a) {
  if (a < 24) return false;
  const { h, s, l } = rgbToHsl(r, g, b);
  const cyanPaint = h >= 130 && h <= 190 && s > 0.12 && l > 0.25;
  const lightMintHighlight = h >= 95 && h <= 180 && s > 0.08 && l > 0.48 && g > r && g >= b * 0.8;
  return cyanPaint || lightMintHighlight;
}

function isChromaFringe(r, g, b, a) {
  if (a < 24) return false;
  const { h, s, l } = rgbToHsl(r, g, b);
  const magenta = h >= 250 && h <= 330 && s > 0.22 && l > 0.12;
  const keyGreen = h >= 95 && h <= 125 && s > 0.42 && g > r * 1.25 && g > b * 1.2;
  return magenta || keyGreen;
}

async function cleanChromaFringe(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  for (let offset = 0; offset < out.length; offset += 4) {
    const r = out[offset];
    const g = out[offset + 1];
    const b = out[offset + 2];
    const a = out[offset + 3];
    if (!isChromaFringe(r, g, b, a) || isMakoPaint(r, g, b, a)) continue;
    const neutral = Math.round((Math.max(r, g, b) * 0.28) + (Math.min(r, g, b) * 0.72));
    out[offset] = neutral;
    out[offset + 1] = neutral;
    out[offset + 2] = neutral;
  }
  return sharp(out, { raw: info }).png().toBuffer();
}

async function alphaBounds(image) {
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width;
  let top = info.height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (data[(y * info.width + x) * 4 + 3] > 32) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  if (right < 0) throw new Error('No opaque subject pixels found');
  return { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1 };
}

async function normaliseMaster(sourcePath) {
  const input = sharp(sourcePath, { limitInputPixels: false }).ensureAlpha();
  const bounds = await alphaBounds(input.clone());
  const scale = (CANVAS.width * TARGET_WIDTH) / bounds.width;
  const resizedWidth = Math.round((await input.metadata()).width * scale);
  const resizedHeight = Math.round((await input.metadata()).height * scale);
  const cropLeft = Math.round(bounds.left * scale);
  const cropBottom = Math.round(bounds.bottom * scale);
  const left = Math.round((CANVAS.width - bounds.width * scale) / 2 - cropLeft);
  const top = Math.round(CANVAS.height * TARGET_BASELINE - cropBottom);

  return sharp({
    create: {
      width: CANVAS.width,
      height: CANVAS.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{
      input: await input.resize(resizedWidth, resizedHeight).png().toBuffer(),
      left,
      top,
    }])
    .png()
    .toBuffer();
}

async function tintFinish(buffer, finish) {
  if (!finish.tint) return buffer;
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  for (let offset = 0; offset < out.length; offset += 4) {
    const r = out[offset];
    const g = out[offset + 1];
    const b = out[offset + 2];
    const a = out[offset + 3];
    if (!isMakoPaint(r, g, b, a)) continue;
    const original = rgbToHsl(r, g, b);
    const nextL = clamp(original.l * finish.tint.lScale + finish.tint.lOffset);
    const nextS = clamp(finish.tint.s);
    const [nr, ng, nb] = hslToRgb(finish.tint.h, nextS, nextL);
    out[offset] = nr;
    out[offset + 1] = ng;
    out[offset + 2] = nb;
  }
  return sharp(out, { raw: info }).png().toBuffer();
}

async function assetMetrics(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let alphaMin = 255;
  let alphaMax = 0;
  let left = info.width;
  let top = info.height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const alpha = data[(y * info.width + x) * 4 + 3];
      alphaMin = Math.min(alphaMin, alpha);
      alphaMax = Math.max(alphaMax, alpha);
      if (alpha > 32) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  return {
    subjectThreshold: 32,
    alphaMin,
    alphaMax,
    subjectBounds: {
      leftSafetyPercent: Number(((left / info.width) * 100).toFixed(4)),
      rightSafetyPercent: Number((((info.width - right - 1) / info.width) * 100).toFixed(4)),
      topSafetyPercent: Number(((top / info.height) * 100).toFixed(4)),
      baselinePercent: Number(((bottom / info.height) * 100).toFixed(4)),
      subjectWidthPercent: Number((((right - left + 1) / info.width) * 100).toFixed(4)),
      subjectHeightPercent: Number((((bottom - top + 1) / info.height) * 100).toFixed(4)),
    },
  };
}

async function writeWebp(buffer, theme, variant, width) {
  const height = Math.round(width * 2 / 3);
  const outPath = path.join(OUT_ROOT, theme, 'poster', `${variant}-r01-w${width}.webp`);
  await mkdir(path.dirname(outPath), { recursive: true });
  const output = await sharp(buffer)
    .resize(width, height, { fit: 'contain' })
    .webp({ quality: theme === 'dark' ? 88 : 92, alphaQuality: 100, effort: 4 })
    .toBuffer();
  await writeFile(outPath, output);
  return {
    path: relPublic(outPath),
    width,
    height,
    theme,
    alphaMode: 'transparent',
    sha256: sha256(output),
    pixelMetrics: await assetMetrics(output),
  };
}

async function writeContactSheet(records, filename) {
  const thumbWidth = 400;
  const thumbHeight = 267;
  const gap = 16;
  const columns = 4;
  const rows = Math.ceil(records.length / columns);
  const composites = [];
  for (const [index, record] of records.entries()) {
    const row = Math.floor(index / columns);
    const col = index % columns;
    composites.push({
      input: await sharp(record.buffer)
        .resize(thumbWidth, thumbHeight, { fit: 'contain' })
        .flatten({ background: record.theme === 'dark' ? '#080a0b' : '#f4f1ec' })
        .webp({ quality: 86 })
        .toBuffer(),
      left: col * (thumbWidth + gap),
      top: row * (thumbHeight + gap),
    });
  }
  const outPath = path.join(PROOF_ROOT, filename);
  await sharp({
    create: {
      width: columns * thumbWidth + (columns - 1) * gap,
      height: rows * thumbHeight + (rows - 1) * gap,
      channels: 3,
      background: '#101214',
    },
  }).composite(composites).jpeg({ quality: 88 }).toFile(outPath);
  return path.relative(REPO_ROOT, outPath).split(path.sep).join('/');
}

function masterPath(brake, fork, drivetrain, carrier) {
  if (brake === 'disc' && fork === 'front' && drivetrain === '21' && carrier === 'none') {
    return CANONICAL_STOCK;
  }
  const sourceBrake = brake === 'power' ? 'pwr' : brake;
  return path.join(PROOF_ROOT, `${sourceBrake}-${fork}-${drivetrain}-${carrier}-cutout.png`);
}

async function main() {
  await mkdir(MATRIX_ROOT, { recursive: true });

  const inventory = {
    schemaVersion: 1,
    productId: 'mako-shark',
    id: 'mako-exhaustive-r01',
    generatedAt: new Date().toISOString(),
    canvas: CANVAS,
    dimensions: {
      brakes: BRAKES,
      fork: FORKS,
      drivetrain: DRIVETRAINS,
      finish: FINISHES.map((finish) => finish.id),
      carrier: CARRIERS,
      themes: ['light', 'dark'],
      widths: WIDTHS,
    },
    variants: [],
  };

  const contact = [];

  for (const brake of BRAKES) {
    for (const fork of FORKS) {
      for (const drivetrain of DRIVETRAINS) {
        for (const carrier of CARRIERS) {
          const sourcePath = masterPath(brake, fork, drivetrain, carrier);
          const normalised = await normaliseMaster(sourcePath);
          for (const finish of FINISHES) {
            const variant = `mako-${brake}-${fork}-${drivetrain}-${finish.id}-${carrier}`;
          const lightBuffer = await cleanChromaFringe(await tintFinish(normalised, finish));
            const darkBuffer = await sharp(lightBuffer)
              .modulate({ brightness: 1.06, saturation: 1.04 })
              .png()
              .toBuffer();
            const assets = [];
            for (const width of WIDTHS) {
              assets.push(await writeWebp(lightBuffer, 'light', variant, width));
              assets.push(await writeWebp(darkBuffer, 'dark', variant, width));
            }
            inventory.variants.push({
              variant,
              sourceMaster: path.relative(REPO_ROOT, sourcePath).split(path.sep).join('/'),
              stateCriteria: {
                components: {
                  brakes: brake === 'power' ? 'power-brake' : 'disc-brake',
                  fork: fork === 'rigid' ? 'rigid-fork' : 'front-suspension',
                  drivetrain: drivetrain === 'single' ? 'single-speed' : '21-speed',
                },
                finishId: finish.optionId,
                accessories: carrier === 'carrier' ? ['ibc-carrier'] : [],
              },
              assets,
            });
            if (finish.id === 'catalog') {
              contact.push({ theme: 'light', buffer: lightBuffer });
              contact.push({ theme: 'dark', buffer: darkBuffer });
            }
          }
        }
      }
    }
  }

  const inventoryPath = path.join(MATRIX_ROOT, 'mako-exhaustive-r01.inventory.json');
  await writeFile(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`);
  await copyFile(inventoryPath, path.join(PROOF_ROOT, 'mako-exhaustive-r01.inventory.json'));

  const contactSheet = await writeContactSheet(contact, 'mako-exhaustive-catalog-contact-sheet.jpg');
  const finishRecords = [];
  for (const variant of inventory.variants
    .filter((candidate) => candidate.variant.includes('-disc-front-21-') && candidate.variant.endsWith('-none'))) {
    for (const asset of variant.assets.filter((candidate) => candidate.width === 1600)) {
      finishRecords.push({
        theme: asset.theme,
        buffer: await readFile(path.join(PUBLIC_ROOT, asset.path.replace(/^\//, ''))),
      });
    }
  }
  const finishSheet = await writeContactSheet(finishRecords, 'mako-exhaustive-finish-contact-sheet.jpg');

  const generationRecord = {
    schemaVersion: 1,
    imageGenerationMode: 'built-in image_gen with local chroma-key removal; deterministic Sharp resizing and finish tinting',
    promptSetSummary: [
      'Generate Mako Shark side-profile product masters on flat chroma-key background while preserving the exact frame geometry, FINSPEED branding, side-right camera angle, and requested mechanical combination.',
      'Disc brake variants: keep visible front and rear disc rotors/calipers; change only fork, drivetrain, and carrier state as requested.',
      'Power brake variants: show rim/power brake hardware instead of disc rotors; keep the same Mako Shark frame identity and angle.',
      'Carrier variants: add or remove only the IBC frame-mounted rear carrier; preserve all other components.',
      'Finish variants are deterministic color derivatives from accepted masters, not separate ImageGen guesses.',
    ],
    sourceMasters: inventory.variants
      .filter((variant, index, list) => list.findIndex((candidate) => candidate.sourceMaster === variant.sourceMaster) === index)
      .map((variant) => variant.sourceMaster),
    outputInventory: 'apps/web/public/assets/configurator/v1/mako-shark/side-r/matrix/mako-exhaustive-r01.inventory.json',
    proofInventory: 'specs/proofs/web/WEB-035/mako-exhaustive-r01/mako-exhaustive-r01.inventory.json',
    contactSheets: [contactSheet, finishSheet].filter(Boolean),
  };
  await writeFile(path.join(PROOF_ROOT, 'generation-record.json'), `${JSON.stringify(generationRecord, null, 2)}\n`);

  console.log(`Generated ${inventory.variants.length} Mako variants and ${inventory.variants.length * WIDTHS.length * 2} image assets.`);
  console.log(`Inventory: ${relPublic(inventoryPath)}`);
  console.log(`Proof contact sheet: ${contactSheet}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
