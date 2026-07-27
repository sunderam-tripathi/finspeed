// Invited-access verification for the distributor portal (WEB-040).
//
// The steward sets DISTRIBUTOR_ACCESS_HASH (format: scrypt$N$r$p$salt$hash,
// base64url salt and hash) via scripts/set-distributor-access.mjs. Dealer IDs
// are not yet account-linked — this verifies one invitation passphrase, which
// is the honest step available while dealer accounts do not exist as a
// business fact. Fail-closed by design: an unconfigured deployment refuses
// access rather than silently opening the preview.
import { scryptSync, timingSafeEqual } from 'node:crypto';

const ENV_KEY = 'DISTRIBUTOR_ACCESS_HASH';

export function accessConfiguration(env) {
  // The literal `process.env.DISTRIBUTOR_ACCESS_HASH` matters: Next.js inlines
  // only literal references into the server bundle at build time, and the
  // Amplify compute runtime does not receive .env.production (it lives outside
  // the deployed .next artifact). A dynamic `env[ENV_KEY]` lookup silently
  // resolved to undefined in production — WEB-040 build log 413. Tests still
  // inject an explicit env object.
  const raw = env ? env[ENV_KEY] : process.env.DISTRIBUTOR_ACCESS_HASH;
  if (!raw) return { configured: false };
  const parts = raw.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return { configured: false, malformed: true };
  const [, nStr, rStr, pStr] = parts;
  const N = Number(nStr); const r = Number(rStr); const p = Number(pStr);
  if (![N, r, p].every((v) => Number.isInteger(v) && v > 0)) return { configured: false, malformed: true };
  try {
    const salt = Buffer.from(parts[4], 'base64url');
    const hash = Buffer.from(parts[5], 'base64url');
    if (salt.length < 16 || hash.length < 32) return { configured: false, malformed: true };
    return { configured: true, N, r, p, salt, hash };
  } catch {
    return { configured: false, malformed: true };
  }
}

export function verifyAccessPassphrase(passphrase, env) {
  // Pass `env` through undefined so accessConfiguration takes the inlinable
  // literal path in production (see the note there); tests inject explicitly.
  const config = accessConfiguration(env);
  if (!config.configured) return { ok: false, configured: false };
  if (typeof passphrase !== 'string' || passphrase.length === 0 || passphrase.length > 256) {
    return { ok: false, configured: true };
  }
  const derived = scryptSync(passphrase, config.salt, config.hash.length, {
    N: config.N, r: config.r, p: config.p,
  });
  return { ok: timingSafeEqual(derived, config.hash), configured: true };
}
