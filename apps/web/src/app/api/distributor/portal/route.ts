import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/server/distributor-session';
import { distributorPortalData } from '@/server/distributor-portal-data';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authorization = request.headers.get('authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!verifySessionToken(token)) {
    return NextResponse.json(
      { error: 'A distributor session is required.' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } },
    );
  }
  return NextResponse.json(
    { portal: distributorPortalData },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
