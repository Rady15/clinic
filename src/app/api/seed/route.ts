import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'clinic-admin-fallback-secret-change-me';

function verifyAdminToken(token: string): boolean {
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

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const admin = await db.admin.findFirst({ where: { username: 'admin' } });
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await seedDatabase();
    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
