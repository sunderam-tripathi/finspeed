#!/usr/bin/env node

import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { CONFIGURATOR_MATRIX_PROFILES } from './configurator-matrix-profiles.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const OUT_PATH = path.join(REPO_ROOT, 'specs', 'proofs', 'web', 'WEB-035', 'configurator-matrix-master-plan.json');
const BRAKES = ['power', 'disc'];
const FORKS = ['rigid', 'front'];
const DRIVETRAINS = ['single', '21'];
const CARRIERS = ['none', 'carrier'];

function relRepo(absolute) {
  return path.relative(REPO_ROOT, absolute).split(path.sep).join('/');
}

function key(fit, brakes, fork, drivetrain, carrier) {
  return [fit.token, brakes, fork, drivetrain, carrier].filter(Boolean).join('-');
}

function stateDistance(source, requested) {
  return ['brakes', 'fork', 'drivetrain', 'carrier']
    .reduce((score, field) => score + (source[field] === requested[field] ? 0 : 1), 0);
}

function nearestSource(profile, requested) {
  return profile.stock
    .filter((source) => source.wheel === requested.fit.wheel)
    .sort((a, b) => stateDistance(a, requested) - stateDistance(b, requested))[0];
}

async function preparedAiSource(profile, source) {
  const sourcePath = path.join(REPO_ROOT, source.source);
  const sourceFamily = path.basename(path.dirname(sourcePath));
  const aiInputPath = path.join(
    REPO_ROOT,
    'specs',
    'proofs',
    'web',
    'WEB-035',
    profile.matrixId,
    'ai-inputs',
    `${sourceFamily}-white.png`,
  );
  if (!(await exists(aiInputPath))) {
    await mkdir(path.dirname(aiInputPath), { recursive: true });
    await sharp(sourcePath)
      .flatten({ background: '#ffffff' })
      .png()
      .toFile(aiInputPath);
  }
  return aiInputPath;
}

function prompt(profile, requested, sourcePath) {
  const brakeText = requested.brakes === 'disc'
    ? 'front and rear mechanical disc-brake rotors and calipers'
    : 'front and rear rim/power-brake calipers with no disc rotors';
  const forkText = requested.fork === 'front'
    ? 'a catalog-realistic front suspension fork'
    : 'a catalog-realistic rigid fork with no suspension stanchions';
  const drivetrainText = requested.drivetrain === '21'
    ? 'a 21-speed 3 x 7 drivetrain with triple front chainrings, rear cassette, derailleurs and shifters'
    : 'a clean single-speed drivetrain with one front chainring and one rear cog, with no derailleurs';
  const carrierText = requested.carrier === 'carrier'
    ? 'the Finspeed IBC frame-mounted rear carrier installed accurately'
    : 'no rear carrier';
  return [
    'Use case: precise-object-edit',
    'Asset type: exhaustive bicycle configurator product master',
    `Input image: edit target at ${sourcePath}`,
    `Primary request: change only the mechanical setup of this exact ${profile.productName} to show ${brakeText}, ${forkText}, ${drivetrainText}, and ${carrierText}.`,
    `Subject: the exact Finspeed ${profile.productName}, ${requested.fit.wheel} wheel size, unchanged frame geometry and catalog finish.`,
    'Composition: exact side-right product profile, complete bicycle fully visible, centred, identical scale and camera angle to the source, generous even padding.',
    'Background: one perfectly flat solid #ff00ff chroma-key field with no floor plane, shadow, gradient, reflection, texture or lighting variation.',
    'Constraints: preserve the frame silhouette, tube geometry, wheel diameter, tyre proportions, saddle, handlebar, mudguards when present, FINSPEED wordmark spelling and placement, decals, paint, and all components not explicitly changed.',
    'Avoid: invented frame tubes, warped wheels, duplicated spokes, impossible chain routing, extra components, missing pedals, clipped bicycle, perspective drift, rider, props, text outside the bicycle, watermark.',
  ].join('\n');
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

const products = [{
  productId: 'mako-shark',
  productName: 'Mako Shark',
  matrixId: 'mako-exhaustive-r01',
  required: 16,
  present: 16,
  missing: 0,
}];
let required = 16;
let present = 16;
const missing = [];
const masters = [];

for (const profile of Object.values(CONFIGURATOR_MATRIX_PROFILES)) {
  const product = { productId: profile.productId, productName: profile.productName, matrixId: profile.matrixId, required: 0, present: 0, missing: 0 };
  for (const fit of profile.fits) {
    for (const brakes of BRAKES) {
      for (const fork of FORKS) {
        for (const drivetrain of DRIVETRAINS) {
          for (const carrier of CARRIERS) {
            required += 1;
            product.required += 1;
            const requested = { fit, brakes, fork, drivetrain, carrier };
            const stock = profile.stock.find((candidate) => (
              candidate.wheel === fit.wheel
              && candidate.brakes === brakes
              && candidate.fork === fork
              && candidate.drivetrain === drivetrain
              && candidate.carrier === carrier
            ));
            const outputPath = stock
              ? path.join(REPO_ROOT, stock.source)
              : path.join(REPO_ROOT, 'specs', 'proofs', 'web', 'WEB-035', profile.matrixId, 'masters', `${key(fit, brakes, fork, drivetrain, carrier)}-cutout.png`);
            const source = stock || nearestSource(profile, requested);
            const master = {
              id: `${profile.productId}__${key(fit, brakes, fork, drivetrain, carrier)}`,
              productId: profile.productId,
              productName: profile.productName,
              matrixId: profile.matrixId,
              fitWheel: fit.wheel,
              components: { brakes, fork, drivetrain, carrier },
              canonicalSourcePath: profile.auditSources?.[fit.wheel] || source.source,
              outputPath: relRepo(outputPath),
              stock: Boolean(stock),
              present: await exists(outputPath),
            };
            masters.push(master);
            if (master.present) {
              present += 1;
              product.present += 1;
              continue;
            }
            product.missing += 1;
            const aiSourcePath = await preparedAiSource(profile, source);
            const chromaPath = outputPath.replace(/-cutout\.png$/, '-chroma-source.png');
            missing.push({
              ...master,
              sourcePath: relRepo(aiSourcePath),
              chromaSourcePath: relRepo(chromaPath),
              prompt: prompt(profile, requested, relRepo(aiSourcePath)),
            });
          }
        }
      }
    }
  }
  products.push(product);
}

const plan = {
  schemaVersion: 2,
  generatedAt: new Date().toISOString(),
  masterContract: {
    required,
    present,
    missing: missing.length,
    derivedFinishChoices: 5,
    themes: 2,
    responsiveWidths: 3,
  },
  products,
  masters,
  queue: missing,
};

await mkdir(path.dirname(OUT_PATH), { recursive: true });
await writeFile(OUT_PATH, `${JSON.stringify(plan, null, 2)}\n`);
console.log(JSON.stringify({ output: relRepo(OUT_PATH), ...plan.masterContract, products }, null, 2));
