import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const item = await db.promoPopup.findFirst({ where: { isActive: true } });
    return NextResponse.json(item || null);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
