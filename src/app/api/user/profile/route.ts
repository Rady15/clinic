import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, phone: true, image: true, role: true, createdAt: true },
  });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { name, phone } = body;
  const user = await db.user.update({
    where: { email: session.user.email },
    data: { ...(name && { name }), ...(phone && { phone }) },
    select: { id: true, name: true, email: true, phone: true, image: true, role: true },
  });
  return NextResponse.json(user);
}
