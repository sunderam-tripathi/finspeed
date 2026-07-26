#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const MANIFEST_PATH = path.join(REPO_ROOT, 'apps', 'web', 'public', 'assets', 'configurator', 'manifest.json');
const INVENTORY_PATH = '/assets/configurator/v1/mako-shark/side-r/matrix/mako-exhaustive-r01.inventory.json';

const MATRIX_ID = 'mako-exhaustive-r01';

function matrixSelectionEntry() {
  return {
    status: 'available',
    matrixId: MATRIX_ID,
    assets: [],
  };
}

const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
const mako = manifest.products.find((product) => product.productId === 'mako-shark');
if (!mako) throw new Error('mako-shark product not found in configurator manifest');

manifest.visualMatrices = (manifest.visualMatrices || []).filter((matrix) => matrix.id !== MATRIX_ID);
manifest.visualMatrices.push({
  id: MATRIX_ID,
  productId: 'mako-shark',
  status: 'available',
  authorityTier: 'C',
  provenanceStatus: 'ai-assisted-exhaustive-component-preview-product-owner-review-required',
  role: 'poster',
  canvasConformance: 'canonical',
  sourceSkuIds: ['mako-shark-27-5-geared'],
  inventoryPath: INVENTORY_PATH,
  generationRecord: 'specs/proofs/web/WEB-035/mako-exhaustive-r01/generation-record.json',
  dimensions: {
    brakes: ['power-brake', 'disc-brake'],
    fork: ['rigid-fork', 'front-suspension'],
    drivetrain: ['single-speed', '21-speed'],
    finish: ['catalog-finish', 'graphite-request', 'deep-blue-request', 'signal-red-request', 'pearl-silver-request'],
    accessories: ['none', 'ibc-carrier'],
    themes: ['light', 'dark'],
    widths: [480, 960, 1600],
  },
});

mako.selectionDependent = {
  fit: matrixSelectionEntry(),
  brakes: matrixSelectionEntry(),
  fork: matrixSelectionEntry(),
  drivetrain: matrixSelectionEntry(),
  finish: matrixSelectionEntry(),
  accessories: matrixSelectionEntry(),
};

await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Registered ${MATRIX_ID} in ${path.relative(REPO_ROOT, MANIFEST_PATH)}`);
