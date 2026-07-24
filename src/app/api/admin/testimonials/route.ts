import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminAuth, successResponse, errorResponse } from '@/lib/admin-auth';

export async function GET(_request: NextRequest) {
  const authError = await adminAuth(_request);
  if (authError) return authError;
  try {
    const testimonials = await db.testimonial.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
    return successResponse(testimonials);
  } catch (e) {
    return errorResponse('Failed to fetch testimonials');
  }
}

export async function POST(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const data = await request.json();
    const testimonial = await db.testimonial.create({ data });
    return successResponse(testimonial, 201);
  } catch (e) {
    return errorResponse('Failed to create testimonial');
  }
}

export async function PUT(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    if (!id) return errorResponse('ID required', 400);
    const testimonial = await db.testimonial.update({ where: { id }, data: updateData });
    return successResponse(testimonial);
  } catch (e) {
    return errorResponse('Failed to update testimonial');
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return errorResponse('ID required', 400);
    await db.testimonial.delete({ where: { id } });
    return successResponse({ success: true });
  } catch (e) {
    return errorResponse('Failed to delete testimonial');
  }
}
