import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

const ADMIN_TOKEN = 'clinic-admin-token-2024';

function verifyAdmin(req: NextRequest): boolean {
  const token = req.cookies.get('admin_token')?.value;
  return token === ADMIN_TOKEN;
}

async function getAdmin() {
  return await db.admin.findFirst({ where: { username: 'admin' } });
}

// POST /api/admin/auth - login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, username, password } = body;

    // Logout
    if (action === 'logout') {
      const cookieStore = await cookies();
      cookieStore.delete('admin_token');
      return NextResponse.json({ success: true });
    }

    // Login
    const admin = await db.admin.findFirst({ where: { username } });
    if (!admin) {
      return NextResponse.json({ error: 'اسم المستخدم غير موجود' }, { status: 401 });
    }

    // Simple password comparison (admin123)
    if (password !== 'admin123') {
      return NextResponse.json({ error: 'كلمة المرور غير صحيحة' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set('admin_token', ADMIN_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
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

// GET /api/admin/auth/me - check auth
export async function GET(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    const admin = await getAdmin();
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
