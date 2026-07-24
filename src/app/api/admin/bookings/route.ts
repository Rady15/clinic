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
    const bookings = await db.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(bookings);
  } catch { return errorResponse('Failed to fetch'); }
}

export async function PUT(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    if (!id) return errorResponse('ID required', 400);
    const booking = await db.booking.update({ where: { id }, data: updateData });
    return successResponse(booking);
  } catch { return errorResponse('Failed to update'); }
}
