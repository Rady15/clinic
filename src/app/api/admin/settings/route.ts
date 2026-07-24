import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminAuth, successResponse, errorResponse } from '@/lib/admin-auth';

export async function GET(_request: NextRequest) {
  const authError = await adminAuth(_request);
  if (authError) return authError;
  try {
    const settings = await db.siteSetting.findMany({ orderBy: { group: 'asc' } });
    // Group by group
    const grouped: Record<string, typeof settings> = {};
    for (const s of settings) {
      if (!grouped[s.group]) grouped[s.group] = [];
      grouped[s.group].push(s);
    }
    return successResponse({ settings, grouped });
  } catch { return errorResponse('Failed to fetch'); }
}

export async function POST(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const data = await request.json();
    const item = await db.siteSetting.create({ data });
    return successResponse(item, 201);
  } catch { return errorResponse('Failed to create'); }
}

export async function PUT(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const data = await request.json();
    // Support batch update (array of {id, value})
    if (Array.isArray(data)) {
      const results = await Promise.all(
        data.map(({ id, value }: { id: string; value: string }) =>
          db.siteSetting.update({ where: { id }, data: { value } })
        )
      );
      return successResponse(results);
    }
    const { id, ...updateData } = data;
    if (!id) return errorResponse('ID required', 400);
    const item = await db.siteSetting.update({ where: { id }, data: updateData });
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
    await db.siteSetting.delete({ where: { id } });
    return successResponse({ success: true });
  } catch { return errorResponse('Failed to delete'); }
}
