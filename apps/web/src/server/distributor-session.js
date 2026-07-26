// Distributor portal session tokens (WEB-039).
//
// The sign-in remains an honest preview — credentials are not verified, so a
// token is minted for any session request. This module is therefore a data
// boundary and the single seam where real credential verification attaches
// later, not access control. The secret is per-boot by design: portal sessions
// are in-memory on the client and drop on reload, so tokens need not survive a
// server restart; a request that straddles instances re-establishes its
// session via the client's 401 retry.
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const SECRET = randomBytes(32);
const SESSION_TTL_MS = 4 * 60 * 60 * 1000;

function sign(payload) {
  return createHmac('sha256', SECRET).update(payload).digest('hex');
}

export function mintSessionToken(now = Date.now()) {
  const expiresAt = now + SESSION_TTL_MS;
  const payload = String(expiresAt);
  return { token: `${payload}.${sign(payload)}`, expiresAt };
}

export function verifySessionToken(token, now = Date.now()) {
  if (typeof token !== 'string') return false;
  const separator = token.indexOf('.');
  if (separator <= 0) return false;
  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || expiresAt <= now) return false;
  const expected = Buffer.from(sign(payload), 'hex');
  const provided = Buffer.from(signature, 'hex');
  if (expected.length !== provided.length || provided.length === 0) return false;
  return timingSafeEqual(expected, provided);
}
