import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const message = await db.contactMessage.create({
      data: {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        subject: data.subject || '',
        message: data.message || '',
      },
    });
    return NextResponse.json(message, { status: 201 });
  } catch (e) {
    console.error('Contact error:', e);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
