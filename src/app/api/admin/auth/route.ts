import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'clinic-admin-fallback-secret-change-me';
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function signToken(adminId: string): string {
  const payload = `${adminId}:${Date.now()}`;
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

function verifyToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length < 3) return false;
    const [adminId, timestamp, signature] = [parts[0], parts[1], parts[2]];
    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(`${adminId}:${timestamp}`).digest('hex');
    if (signature !== expected) return false;
    const age = Date.now() - parseInt(timestamp, 10);
    return age < TOKEN_MAX_AGE * 1000;
  } catch {
    return false;
  }
}

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return false;
  if (!verifyToken(token)) return false;
  const admin = await db.admin.findFirst({ where: { username: 'admin' } });
  return !!admin;
}

// POST /api/admin/auth - login or logout
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, username, password } = body;

    if (action === 'logout') {
      const cookieStore = await cookies();
      cookieStore.delete('admin_token');
      return NextResponse.json({ success: true });
    }

    const admin = await db.admin.findFirst({ where: { username } });
    if (!admin) {
      return NextResponse.json({ error: 'اسم المستخدم غير موجود' }, { status: 401 });
    }

    let passwordValid = false;
    if (admin.password && admin.password.startsWith('$2')) {
      passwordValid = await bcrypt.compare(password, admin.password);
    } else {
      passwordValid = password === 'admin123';
      if (passwordValid && admin.password !== 'admin123') {
        const hashed = await bcrypt.hash('admin123', 10);
        await db.admin.update({ where: { id: admin.id }, data: { password: hashed } });
      }
    }

    if (!passwordValid) {
      return NextResponse.json({ error: 'كلمة المرور غير صحيحة' }, { status: 401 });
    }

    const token = signToken(admin.id);
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: TOKEN_MAX_AGE,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, username: admin.username, name: admin.name },
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

// GET /api/admin/auth - check session
export async function GET(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    const admin = await db.admin.findFirst({ where: { username: 'admin' } });
    if (!admin) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({
      authenticated: true,
      admin: { id: admin.id, username: admin.username, name: admin.name },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
