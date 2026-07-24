import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const offer = searchParams.get('offer');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = { isActive: true };
    if (categoryId) Object.assign(where, { categoryId });
    if (offer === 'true') Object.assign(where, { isOffer: true });
    if (featured === 'true') Object.assign(where, { isFeatured: true });
    if (search) {
      Object.assign(where, {
        OR: [
          { nameAr: { contains: search } },
          { nameEn: { contains: search } },
        ],
      });
    }

    const services = await db.service.findMany({
      where,
      include: { category: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
