import { NextResponse } from 'next/server';
import { mintSessionToken } from '@/server/distributor-session';
import { verifyAccessPassphrase } from '@/server/distributor-access';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

// WEB-040: sessions are granted only against the steward-managed invitation
// passphrase. Dealer IDs remain unlinked to accounts — per-dealer credential
// verification attaches here once dealer accounts exist as a business fact.
// Fail-closed: a deployment without DISTRIBUTOR_ACCESS_HASH refuses access.
export async function POST(request: Request) {
  let passphrase = '';
  try {
    const body = await request.json();
    passphrase = typeof body?.passphrase === 'string' ? body.passphrase : '';
  } catch {
    passphrase = '';
  }

  const result = verifyAccessPassphrase(passphrase);
  if (!result.configured) {
    return NextResponse.json(
      { error: 'Distributor access is not configured on this deployment.' },
      { status: 503, headers: NO_STORE },
    );
  }
  if (!result.ok) {
    // Constant small delay blunts online guessing without an external store;
    // per-instance only — recorded as an accepted limitation in the proof.
    await new Promise((resolve) => setTimeout(resolve, 300));
    return NextResponse.json(
      { error: 'That access passphrase was not recognised.' },
      { status: 401, headers: NO_STORE },
    );
  }
  const { token, expiresAt } = mintSessionToken();
  return NextResponse.json({ token, expiresAt }, { headers: NO_STORE });
}
