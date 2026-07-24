import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const articles = await db.article.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
