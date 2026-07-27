// WEB-040 invited-access verification contract.
import assert from 'node:assert/strict';
import test from 'node:test';
import { randomBytes, scryptSync } from 'node:crypto';

import { accessConfiguration, verifyAccessPassphrase } from '../../server/distributor-access.js';

function hashFor(passphrase, { N = 16384, r = 8, p = 1 } = {}) {
  const salt = randomBytes(16);
  const hash = scryptSync(passphrase, salt, 32, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${salt.toString('base64url')}$${hash.toString('base64url')}`;
}

test('an unconfigured environment fails closed', () => {
  const result = verifyAccessPassphrase('anything', {});
  assert.equal(result.ok, false);
  assert.equal(result.configured, false);
});

test('malformed configuration is treated as unconfigured, never as open', () => {
  for (const bad of ['plaintext', 'scrypt$0$8$1$AAAA$BBBB', 'scrypt$16384$8$1$short$short', 'bcrypt$x$y$z$w']) {
    const result = verifyAccessPassphrase('anything', { DISTRIBUTOR_ACCESS_HASH: bad });
    assert.equal(result.ok, false, bad);
    assert.equal(result.configured, false, bad);
    assert.equal(accessConfiguration({ DISTRIBUTOR_ACCESS_HASH: bad }).configured, false, bad);
  }
});

test('the correct passphrase verifies and wrong ones are rejected', () => {
  const env = { DISTRIBUTOR_ACCESS_HASH: hashFor('correct horse battery staple') };
  assert.deepEqual(verifyAccessPassphrase('correct horse battery staple', env), { ok: true, configured: true });
  for (const wrong of ['wrong', '', 'correct horse battery stapl', 'CORRECT HORSE BATTERY STAPLE', 'a'.repeat(300)]) {
    const result = verifyAccessPassphrase(wrong, env);
    assert.equal(result.ok, false, JSON.stringify(wrong.slice(0, 20)));
    assert.equal(result.configured, true);
  }
});

test('the committed dev hash verifies exactly the well-known preview passphrase', () => {
  const env = { DISTRIBUTOR_ACCESS_HASH: 'scrypt$16384$8$1$Zmluc3BlZWQtZGV2LXByZQ$x65US9uga_xLKxytyfAhVT_i7ZPVkOBp6J1KVhkoiGY' };
  assert.equal(verifyAccessPassphrase('preview', env).ok, true);
  assert.equal(verifyAccessPassphrase('Preview', env).ok, false);
});
