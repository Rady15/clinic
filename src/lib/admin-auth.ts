import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import crypto from 'crypto';

const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'clinic-admin-fallback-secret-change-me';

function verifyToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length < 3) return false;
    const [adminId, timestamp, signature] = [parts[0], parts[1], parts[2]];
    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(`${adminId}:${timestamp}`).digest('hex');
    return signature === expected;
  } catch {
    return false;
  }
}

export async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return false;
  if (!verifyToken(token)) return false;
  const admin = await db.admin.findFirst({ where: { username: 'admin' } });
  return !!admin;
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
