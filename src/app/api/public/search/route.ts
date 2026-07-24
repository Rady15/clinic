import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';

    const results: Record<string, unknown[]> = { services: [], doctors: [] };

    if (!q.trim()) return NextResponse.json(results);

    if (type === 'all' || type === 'services') {
      results.services = await db.service.findMany({
        where: {
          isActive: true,
          OR: [
            { nameAr: { contains: q } },
            { nameEn: { contains: q } },
            { descriptionAr: { contains: q } },
          ],
        },
        take: 20,
        include: { category: true },
      });
    }

    if (type === 'all' || type === 'doctors') {
      results.doctors = await db.doctor.findMany({
        where: {
          isActive: true,
          OR: [
            { nameAr: { contains: q } },
            { nameEn: { contains: q } },
            { specialtyAr: { contains: q } },
            { departmentAr: { contains: q } },
          ],
        },
        take: 20,
      });
    }

    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ services: [], doctors: [] }, { status: 500 });
  }
}
