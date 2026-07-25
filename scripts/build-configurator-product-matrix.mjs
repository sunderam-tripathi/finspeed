#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { CONFIGURATOR_MATRIX_PROFILES } from './configurator-matrix-profiles.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const PUBLIC_ROOT = path.join(REPO_ROOT, 'apps', 'web', 'public');
const args = process.argv.slice(2);
const productArg = args.indexOf('--product');
const productId = productArg >= 0 ? args[productArg + 1] : null;
const profile = CONFIGURATOR_MATRIX_PROFILES[productId];

if (!profile) {
  const choices = Object.keys(CONFIGURATOR_MATRIX_PROFILES).join(', ');
  throw new Error(`Use --product with one of: ${choices}`);
}

const PROOF_ROOT = path.join(REPO_ROOT, 'specs', 'proofs', 'web', 'WEB-035', profile.matrixId);
const MASTER_ROOT = path.join(PROOF_ROOT, 'masters');
const OUT_ROOT = path.join(PUBLIC_ROOT, 'assets', 'configurator', 'v1', productId, 'side-r');
const MATRIX_ROOT = path.join(OUT_ROOT, 'matrix');
const CANVAS = { width: 1600, height: 1067 };
const WIDTHS = [480, 960, 1600];
// A configurator must not make one bicycle jump larger or smaller when the
// customer changes model or hardware. Normalise from the bicycle's horizontal
// envelope first, then use height only as a safety ceiling for unusually tall
// geometry. The 84% width and 94% baseline match the public canvas contract;
// the latter keeps tall city handlebars large while retaining 6% top safety.
const TARGET_WIDTH = 0.84;
const MAX_TARGET_HEIGHT = 0.88;
const TARGET_BASELINE = 0.94;
const BRAKES = ['power', 'disc'];
const FORKS = ['rigid', 'front'];
const DRIVETRAINS = ['single', '21'];
const CARRIERS = ['none', 'carrier'];

function relRepo(absolute) {
  return path.relative(REPO_ROOT, absolute).split(path.sep).join('/');
}

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
  const hue2rgb = (p, q, value) => {
    let next = value;
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

function inPaintRegion(x, y, info, regions) {
  if (!regions?.length) return true;
  const nx = x / info.width;
  const ny = y / info.height;
  return regions.some(([left, top, right, bottom]) => (
    nx >= left && nx <= right && ny >= top && ny <= bottom
  ));
}

function isPaint(r, g, b, a, x, y, info) {
  if (a < 24 || !inPaintRegion(x, y, info, profile.paint.regions)) return false;
  const { h, s, l } = rgbToHsl(r, g, b);
  const hueMatch = profile.paint.hueRanges?.some(([min, max]) => h >= min && h <= max);
  if (hueMatch) {
    return s >= (profile.paint.minS ?? 0) && l >= (profile.paint.minL ?? 0) && l <= (profile.paint.maxL ?? 1);
  }
  const neutral = profile.paint.neutral;
  return Boolean(neutral && s <= neutral.maxS && l >= neutral.minL && l <= neutral.maxL);
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
    const pixel = offset / 4;
    const x = pixel % info.width;
    const y = Math.floor(pixel / info.width);
    const r = out[offset];
    const g = out[offset + 1];
    const b = out[offset + 2];
    const a = out[offset + 3];
    if (!isChromaFringe(r, g, b, a) || isPaint(r, g, b, a, x, y, info)) continue;
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
      if (data[(y * info.width + x) * 4 + 3] <= 32) continue;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }
  if (right < 0) throw new Error('No opaque subject pixels found');
  return { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1 };
}

async function normaliseMaster(sourcePath) {
  const input = sharp(sourcePath, { limitInputPixels: false }).ensureAlpha();
  const bounds = await alphaBounds(input.clone());
  const targetWidthScale = (CANVAS.width * TARGET_WIDTH) / bounds.width;
  const heightSafetyScale = (CANVAS.height * MAX_TARGET_HEIGHT) / bounds.height;
  const scale = Math.min(targetWidthScale, heightSafetyScale);
  const resizedWidth = Math.round(bounds.width * scale);
  const resizedHeight = Math.round(bounds.height * scale);
  const subjectWidth = resizedWidth / CANVAS.width;
  if (subjectWidth < 0.82 || subjectWidth > 0.86) {
    throw new Error(
      `${relRepo(sourcePath)} cannot satisfy the canonical 84% subject width without exceeding the height safety limit`,
    );
  }
  const left = Math.round((CANVAS.width - resizedWidth) / 2);
  const top = Math.round(CANVAS.height * TARGET_BASELINE - resizedHeight);
  const subject = await input
    .extract({ left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height })
    .resize(resizedWidth, resizedHeight)
    .png()
    .toBuffer();
  return sharp({
    create: { width: CANVAS.width, height: CANVAS.height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  }).composite([{
    input: subject,
    left,
    top,
  }]).png().toBuffer();
}

async function tintFinish(buffer, finish) {
  if (!finish.tint) return buffer;
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  for (let offset = 0; offset < out.length; offset += 4) {
    const pixel = offset / 4;
    const x = pixel % info.width;
    const y = Math.floor(pixel / info.width);
    const r = out[offset];
    const g = out[offset + 1];
    const b = out[offset + 2];
    const a = out[offset + 3];
    if (!isPaint(r, g, b, a, x, y, info)) continue;
    const original = rgbToHsl(r, g, b);
    const nextL = clamp(original.l * finish.tint.lScale + finish.tint.lOffset);
    const [nr, ng, nb] = hslToRgb(finish.tint.h, clamp(finish.tint.s), nextL);
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
      if (alpha <= 32) continue;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
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
  const composites = await Promise.all(records.map(async (record, index) => ({
    input: await sharp(record.buffer)
      .resize(thumbWidth, thumbHeight, { fit: 'contain' })
      .flatten({ background: record.theme === 'dark' ? '#080a0b' : '#f4f1ec' })
      .webp({ quality: 86 })
      .toBuffer(),
    left: (index % columns) * (thumbWidth + gap),
    top: Math.floor(index / columns) * (thumbHeight + gap),
  })));
  const outPath = path.join(PROOF_ROOT, filename);
  await sharp({
    create: {
      width: columns * thumbWidth + (columns - 1) * gap,
      height: rows * thumbHeight + (rows - 1) * gap,
      channels: 3,
      background: '#101214',
    },
  }).composite(composites).jpeg({ quality: 88 }).toFile(outPath);
  return relRepo(outPath);
}

function hardwareKey(fit, brakes, fork, drivetrain, carrier) {
  return [fit.token, brakes, fork, drivetrain, carrier].filter(Boolean).join('-');
}

function stockSource(fit, brakes, fork, drivetrain, carrier) {
  return profile.stock.find((candidate) => (
    candidate.wheel === fit.wheel
    && candidate.brakes === brakes
    && candidate.fork === fork
    && candidate.drivetrain === drivetrain
    && candidate.carrier === carrier
  ))?.source;
}

function masterPath(fit, brakes, fork, drivetrain, carrier) {
  const stock = stockSource(fit, brakes, fork, drivetrain, carrier);
  return path.join(REPO_ROOT, stock || `specs/proofs/web/WEB-035/${profile.matrixId}/masters/${hardwareKey(fit, brakes, fork, drivetrain, carrier)}-cutout.png`);
}

function variantKey(fit, brakes, fork, drivetrain, finish, carrier) {
  return [profile.assetPrefix, fit.token, brakes, fork, drivetrain, finish, carrier]
    .filter(Boolean)
    .join('-');
}

async function assertMastersPresent() {
  const missing = [];
  for (const fit of profile.fits) {
    for (const brakes of BRAKES) {
      for (const fork of FORKS) {
        for (const drivetrain of DRIVETRAINS) {
          for (const carrier of CARRIERS) {
            const sourcePath = masterPath(fit, brakes, fork, drivetrain, carrier);
            try {
              await access(sourcePath);
            } catch {
              missing.push(relRepo(sourcePath));
            }
          }
        }
      }
    }
  }
  if (missing.length) {
    throw new Error(`${profile.productName} is missing ${missing.length} hardware masters:\n${missing.join('\n')}`);
  }
}

async function main() {
  await assertMastersPresent();
  await mkdir(MATRIX_ROOT, { recursive: true });
  await mkdir(MASTER_ROOT, { recursive: true });

  const inventory = {
    schemaVersion: 1,
    productId,
    id: profile.matrixId,
    generatedAt: new Date().toISOString(),
    canvas: CANVAS,
    dimensions: {
      ...(profile.fits.length > 1 ? { fit: profile.fits.map((fit) => fit.wheel) } : {}),
      brakes: BRAKES,
      fork: FORKS,
      drivetrain: DRIVETRAINS,
      finish: profile.finishes.map((finish) => finish.id),
      carrier: CARRIERS,
      themes: ['light', 'dark'],
      widths: WIDTHS,
    },
    variants: [],
  };
  const contact = [];

  for (const fit of profile.fits) {
    for (const brakes of BRAKES) {
      for (const fork of FORKS) {
        for (const drivetrain of DRIVETRAINS) {
          for (const carrier of CARRIERS) {
            const sourcePath = masterPath(fit, brakes, fork, drivetrain, carrier);
            const normalised = await normaliseMaster(sourcePath);
            for (const finish of profile.finishes) {
              const variant = variantKey(fit, brakes, fork, drivetrain, finish.id, carrier);
              const lightBuffer = await cleanChromaFringe(await tintFinish(normalised, finish));
              const darkBuffer = await sharp(lightBuffer).modulate({ brightness: 1.06, saturation: 1.04 }).png().toBuffer();
              const assets = [];
              for (const width of WIDTHS) {
                assets.push(await writeWebp(lightBuffer, 'light', variant, width));
                assets.push(await writeWebp(darkBuffer, 'dark', variant, width));
              }
              inventory.variants.push({
                variant,
                sourceMaster: relRepo(sourcePath),
                stateCriteria: {
                  ...(profile.fits.length > 1 ? { fitWheel: fit.wheel } : {}),
                  components: {
                    brakes: brakes === 'power' ? 'power-brake' : 'disc-brake',
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
  }

  const inventoryPath = path.join(MATRIX_ROOT, `${profile.matrixId}.inventory.json`);
  await writeFile(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`);
  await copyFile(inventoryPath, path.join(PROOF_ROOT, `${profile.matrixId}.inventory.json`));
  const contactSheet = await writeContactSheet(contact, `${profile.matrixId}-catalog-contact-sheet.jpg`);
  const generationRecord = {
    schemaVersion: 1,
    imageGenerationMode: 'built-in image_gen edits with local chroma-key removal; deterministic Sharp finish, theme and responsive derivation',
    productId,
    matrixId: profile.matrixId,
    promptSetSummary: [
      `Generate ${profile.productName} side-profile product masters on a flat chroma-key background while preserving the exact frame geometry, wheel size, FINSPEED branding and requested mechanical combination.`,
      'Disc and power-brake states, rigid and suspension forks, single and 21-speed drivetrains, and carrier states must be visibly accurate.',
      'Finish variants are deterministic colour derivatives from accepted masters rather than separate ImageGen guesses.',
    ],
    sourceMasters: [...new Set(inventory.variants.map((variant) => variant.sourceMaster))],
    outputInventory: relRepo(inventoryPath),
    proofInventory: `specs/proofs/web/WEB-035/${profile.matrixId}/${profile.matrixId}.inventory.json`,
    contactSheets: [contactSheet],
  };
  await writeFile(path.join(PROOF_ROOT, 'generation-record.json'), `${JSON.stringify(generationRecord, null, 2)}\n`);
  console.log(`Generated ${inventory.variants.length} ${profile.productName} variants and ${inventory.variants.length * WIDTHS.length * 2} assets.`);
  console.log(`Inventory: ${relPublic(inventoryPath)}`);
  console.log(`Proof contact sheet: ${contactSheet}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
