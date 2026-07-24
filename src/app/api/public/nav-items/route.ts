import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const items = await db.navItem.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { order: 'asc' },
      include: { children: { where: { isActive: true }, orderBy: { order: 'asc' } } },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
