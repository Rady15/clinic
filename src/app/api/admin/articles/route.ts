import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminAuth, successResponse, errorResponse } from '@/lib/admin-auth';

export async function GET(_request: NextRequest) {
  const authError = await adminAuth(_request);
  if (authError) return authError;
  try {
    const articles = await db.article.findMany({ orderBy: { createdAt: 'desc' } });
    return successResponse(articles);
  } catch (e) {
    return errorResponse('Failed to fetch articles');
  }
}

export async function POST(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const data = await request.json();
    const article = await db.article.create({ data });
    return successResponse(article, 201);
  } catch (e) {
    return errorResponse('Failed to create article');
  }
}

export async function PUT(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    if (!id) return errorResponse('ID required', 400);
    const article = await db.article.update({ where: { id }, data: updateData });
    return successResponse(article);
  } catch (e) {
    return errorResponse('Failed to update article');
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return errorResponse('ID required', 400);
    await db.article.delete({ where: { id } });
    return successResponse({ success: true });
  } catch (e) {
    return errorResponse('Failed to delete article');
  }
}
