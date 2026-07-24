import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminAuth, successResponse, errorResponse } from '@/lib/admin-auth';

export async function GET(_request: NextRequest) {
  const authError = await adminAuth(_request);
  if (authError) return authError;
  try {
    const items = await db.jobApplication.findMany({ orderBy: { createdAt: 'desc' } });
    return successResponse(items);
  } catch { return errorResponse('Failed to fetch'); }
}

export async function PUT(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    if (!id) return errorResponse('ID required', 400);
    const item = await db.jobApplication.update({ where: { id }, data: updateData });
    return successResponse(item);
  } catch { return errorResponse('Failed to update'); }
}
