import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminAuth, successResponse, errorResponse } from '@/lib/admin-auth';

export async function GET(_request: NextRequest) {
  const authError = await adminAuth(_request);
  if (authError) return authError;
  try {
    const items = await db.rating.findMany({ orderBy: { createdAt: 'desc' } });
    return successResponse(items);
  } catch { return errorResponse('Failed to fetch'); }
}
