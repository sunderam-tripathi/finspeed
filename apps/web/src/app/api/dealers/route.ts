import { NextResponse } from 'next/server';
import { DEALERS } from '@/data/dealers';

export async function GET() {
  return NextResponse.json({ dealers: DEALERS });
}
