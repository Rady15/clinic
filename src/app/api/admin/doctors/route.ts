import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminAuth, successResponse, errorResponse } from '@/lib/admin-auth';

export async function GET(_request: NextRequest) {
  const authError = await adminAuth(_request);
  if (authError) return authError;
  try {
    const doctors = await db.doctor.findMany({ orderBy: { order: 'asc' } });
    return successResponse(doctors);
  } catch (e) {
    return errorResponse('Failed to fetch doctors');
  }
}

export async function POST(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const data = await request.json();
    const doctor = await db.doctor.create({ data });
    return successResponse(doctor, 201);
  } catch (e) {
    return errorResponse('Failed to create doctor');
  }
}

export async function PUT(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    if (!id) return errorResponse('ID required', 400);
    const doctor = await db.doctor.update({ where: { id }, data: updateData });
    return successResponse(doctor);
  } catch (e) {
    return errorResponse('Failed to update doctor');
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await adminAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return errorResponse('ID required', 400);
    await db.doctor.delete({ where: { id } });
    return successResponse({ success: true });
  } catch (e) {
    return errorResponse('Failed to delete doctor');
  }
}
