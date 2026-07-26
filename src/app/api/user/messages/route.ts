import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const messages = await db.contactMessage.findMany({
    where: { email: session.user.email },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(messages);
}
