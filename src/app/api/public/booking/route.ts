import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const booking = await db.booking.create({
      data: {
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        department: data.department || '',
        doctorId: data.doctorId || '',
        date: data.date || '',
        time: data.time || '',
        notes: data.notes || '',
        status: 'pending',
      },
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (e) {
    console.error('Booking error:', e);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
