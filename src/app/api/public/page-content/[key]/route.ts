import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const content = await db.pageContent.findUnique({ where: { pageKey: key } });
    return NextResponse.json(content || null);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
