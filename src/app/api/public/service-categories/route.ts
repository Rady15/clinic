import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const categories = await db.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: { _count: { select: { services: true } } },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
