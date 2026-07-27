// Client access to the distributor portal dataset (WEB-039).
// The dataset itself lives server-side; these calls are the only way the
// portal obtains dealer pricing. Sessions are in-memory by design — a reload
// returns to sign-in, matching the portal's honest preview semantics.

export async function openPortalSession(passphrase) {
  const response = await fetch('/api/distributor/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passphrase }),
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    const error = new Error(detail.error || `session request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  const { token } = await response.json();
  if (!token) throw new Error('session response carried no token');
  return token;
}

export async function fetchPortal(token) {
  const response = await fetch('/api/distributor/portal', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 401) {
    const error = new Error('portal session expired');
    error.expired = true;
    throw error;
  }
  if (!response.ok) throw new Error(`portal request failed (${response.status})`);
  const { portal } = await response.json();
  return portal;
}
