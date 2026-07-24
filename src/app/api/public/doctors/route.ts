import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const doctors = await db.doctor.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(doctors);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
