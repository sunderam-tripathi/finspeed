// WEB-039 boundary contract: dealer prices, margins, and portal records live
// server-side only. This test fails if the data leaks back into the client
// module or, when a production build is present, into any client chunk.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(HERE, '../../..');
const CLIENT_MODULE = path.join(HERE, 'distributor.js');
const CLIENT_CHUNKS = path.join(WEB_ROOT, '.next', 'static');

// Strings that exist only in the server-side portal dataset. The sign-in
// placeholder deliberately shows ravi@ravistores.in client-side, so that
// address is NOT a valid sentinel.
const SENTINELS = ['AABCR1234F', 'INV-8967', 'TK-3421', 'Neha Verma', 'dp: 3300'];

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else yield full;
  }
}

test('the client distributor module exports presentation helpers only', () => {
  const source = readFileSync(CLIENT_MODULE, 'utf8');
  for (const sentinel of SENTINELS) {
    assert.equal(source.includes(sentinel), false, `client module contains server data sentinel "${sentinel}"`);
  }
  assert.equal(/\bdp\s*:/.test(source), false, 'client module carries dealer price fields');
  assert.equal(/\bmargin\s*:/.test(source), false, 'client module carries margin fields');
});

test('no client chunk in the production build carries portal data', (t) => {
  if (!existsSync(CLIENT_CHUNKS)) {
    t.skip('no production build output at .next/static — run `npm run build -w web` first (CI builds before unit tests)');
    return;
  }
  const chunks = [...walk(CLIENT_CHUNKS)].filter((file) => file.endsWith('.js'));
  assert.ok(chunks.length > 0, 'expected client chunks in .next/static');
  for (const chunk of chunks) {
    const body = readFileSync(chunk, 'utf8');
    for (const sentinel of SENTINELS) {
      assert.equal(body.includes(sentinel), false, `${path.relative(WEB_ROOT, chunk)} contains "${sentinel}"`);
    }
  }
});
