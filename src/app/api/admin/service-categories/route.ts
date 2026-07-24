import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminAuth, successResponse, errorResponse } from '@/lib/admin-auth';

export async function GET(_request: NextRequest) {
  const authError = await adminAuth(_request);
  if (authError) return authError;
  try {
    const categories = await db.serviceCategory.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { services: true } } },
    });
    return successResponse(categories);
  } catch (e) {
    return errorResponse('Failed to fetch categories');
  }
}

export async function POST(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const data = await request.json();
    const category = await db.serviceCategory.create({ data });
    return successResponse(category, 201);
  } catch (e) {
    return errorResponse('Failed to create category');
  }
}

export async function PUT(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    if (!id) return errorResponse('ID required', 400);
    const category = await db.serviceCategory.update({ where: { id }, data: updateData });
    return successResponse(category);
  } catch (e) {
    return errorResponse('Failed to update category');
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return errorResponse('ID required', 400);
    await db.serviceCategory.delete({ where: { id } });
    return successResponse({ success: true });
  } catch (e) {
    return errorResponse('Failed to delete category');
  }
}
