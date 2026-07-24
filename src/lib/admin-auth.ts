import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_TOKEN = 'clinic-admin-token-2024';

export async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get('admin_token')?.value === ADMIN_TOKEN;
}

export async function adminAuth(req: NextRequest): Promise<NextResponse | null> {
  const isAuth = await verifyAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export function successResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}
