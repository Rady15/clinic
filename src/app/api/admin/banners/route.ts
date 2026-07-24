import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminAuth, successResponse, errorResponse } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const banners = await db.banner.findMany({ orderBy: { order: 'asc' } });
    return successResponse(banners);
  } catch (e) {
    return errorResponse('Failed to fetch banners');
  }
}

export async function POST(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const data = await request.json();
    const banner = await db.banner.create({ data });
    return successResponse(banner, 201);
  } catch (e) {
    return errorResponse('Failed to create banner');
  }
}

export async function PUT(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    if (!id) return errorResponse('ID required', 400);
    const banner = await db.banner.update({ where: { id }, data: updateData });
    return successResponse(banner);
  } catch (e) {
    return errorResponse('Failed to update banner');
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return errorResponse('ID required', 400);
    await db.banner.delete({ where: { id } });
    return successResponse({ success: true });
  } catch (e) {
    return errorResponse('Failed to delete banner');
  }
}
