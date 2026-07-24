import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const rating = await db.rating.create({
      data: {
        name: data.name || '',
        email: data.email || '',
        department: data.department || '',
        cleanliness: data.cleanliness || 0,
        staffFriendly: data.staffFriendly || 0,
        staffCoop: data.staffCoop || 0,
        comment: data.comment || '',
      },
    });
    return NextResponse.json(rating, { status: 201 });
  } catch (e) {
    console.error('Rating error:', e);
    return NextResponse.json({ error: 'Failed to submit rating' }, { status: 500 });
  }
}
