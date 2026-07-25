import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminAuth, successResponse, errorResponse } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const where: Record<string, unknown> = {};
    if (status && status !== 'all') Object.assign(where, { status });
    const orders = await db.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
    return successResponse(orders);
  } catch { return errorResponse('Failed to fetch'); }
}
