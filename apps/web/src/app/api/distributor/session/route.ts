import { NextResponse } from 'next/server';
import { mintSessionToken } from '@/server/distributor-session';

export const dynamic = 'force-dynamic';

// Preview semantics, stated in the portal UI: credentials are not verified and
// no live dealer account is opened, so a session is granted to any caller.
// This handler is the single seam where real credential verification attaches
// once dealer accounts exist; until then the token only moves the dataset off
// the client bundle and behind an observable request boundary.
export async function POST() {
  const { token, expiresAt } = mintSessionToken();
  return NextResponse.json(
    { token, expiresAt },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
