import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminAuth, successResponse, errorResponse } from '@/lib/admin-auth';

export async function GET(_request: NextRequest) {
  const authError = await adminAuth(_request);
  if (authError) return authError;
  try {
    const items = await db.navItem.findMany({
      orderBy: [{ order: 'asc' }, { labelAr: 'asc' }],
      include: { children: { orderBy: { order: 'asc' } } },
    });
    return successResponse(items);
  } catch { return errorResponse('Failed to fetch'); }
}

export async function POST(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const data = await request.json();
    const item = await db.navItem.create({ data });
    return successResponse(item, 201);
  } catch { return errorResponse('Failed to create'); }
}

export async function PUT(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    if (!id) return errorResponse('ID required', 400);
    const item = await db.navItem.update({ where: { id }, data: updateData });
    return successResponse(item);
  } catch { return errorResponse('Failed to update'); }
}

export async function DELETE(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return errorResponse('ID required', 400);
    await db.navItem.delete({ where: { id } });
    return successResponse({ success: true });
  } catch { return errorResponse('Failed to delete'); }
}
