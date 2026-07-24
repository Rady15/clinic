import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminAuth, successResponse, errorResponse } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const include = { category: true };
    const where: Record<string, unknown> = categoryId ? { categoryId } : {};
    const services = await db.service.findMany({
      where,
      include,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return successResponse(services);
  } catch (e) {
    return errorResponse('Failed to fetch services');
  }
}

export async function POST(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const data = await request.json();
    const service = await db.service.create({
      data: {
        nameAr: data.nameAr || '',
        nameEn: data.nameEn || '',
        descriptionAr: data.descriptionAr || '',
        descriptionEn: data.descriptionEn || '',
        price: data.price || 0,
        originalPrice: data.originalPrice || null,
        image: data.image || '',
        badge: data.badge || '',
        isOffer: data.isOffer || false,
        isFeatured: data.isFeatured || false,
        isActive: data.isActive ?? true,
        categoryId: data.categoryId,
        subcategoryAr: data.subcategoryAr || '',
        subcategoryEn: data.subcategoryEn || '',
        order: data.order || 0,
      },
    });
    return successResponse(service, 201);
  } catch (e) {
    return errorResponse('Failed to create service');
  }
}

export async function PUT(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    if (!id) return errorResponse('ID required', 400);
    const service = await db.service.update({ where: { id }, data: updateData });
    return successResponse(service);
  } catch (e) {
    return errorResponse('Failed to update service');
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return errorResponse('ID required', 400);
    await db.service.delete({ where: { id } });
    return successResponse({ success: true });
  } catch (e) {
    return errorResponse('Failed to delete service');
  }
}
