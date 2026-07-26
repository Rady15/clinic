import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Check User table first
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true, image: true },
    });
    if (user) {
      return NextResponse.json(user);
    }

    // Also check by name (admin may have logged in with username)
    const userByName = await db.user.findFirst({
      where: { name: email },
      select: { id: true, name: true, email: true, role: true, image: true },
    });
    if (userByName) {
      return NextResponse.json(userByName);
    }

    // Check Admin table — return role: 'admin' for any known admin
    const admin = await db.admin.findFirst({
      where: { OR: [{ username: email }, { name: email }] },
      select: { id: true, name: true, username: true },
    });
    if (admin) {
      return NextResponse.json({
        id: admin.id,
        name: admin.name,
        email: `${admin.username}@admin.local`,
        role: 'admin',
        image: null,
      });
    }

    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
