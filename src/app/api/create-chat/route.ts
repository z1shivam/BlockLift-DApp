import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function GET() {
  const uuid = randomUUID();
  return NextResponse.json({ uuid }, { status: 200 });
}