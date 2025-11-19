import { NextResponse } from 'next/server';
import { DEALERS } from '@/data/dealers';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({ dealers: DEALERS });
}
