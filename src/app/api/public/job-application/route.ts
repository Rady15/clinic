import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const application = await db.jobApplication.create({
      data: {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        message: data.message || '',
        fileName: data.fileName || '',
        fileUrl: data.fileUrl || '',
      },
    });
    return NextResponse.json(application, { status: 201 });
  } catch (e) {
    console.error('Job application error:', e);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
