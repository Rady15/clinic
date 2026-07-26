import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    let name = '', email = '', phone = '', message = '', fileName = '', fileUrl = '';

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = (formData.get('name') as string) || '';
      email = (formData.get('email') as string) || '';
      phone = (formData.get('phone') as string) || '';
      message = (formData.get('message') as string) || '';
      const file = formData.get('file') as File | null;
      if (file && file.size > 0) {
        fileName = file.name;
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString('base64');
        const mime = file.type || 'application/octet-stream';
        fileUrl = `data:${mime};base64,${base64}`;
      }
    } else {
      const data = await request.json();
      name = data.name || '';
      email = data.email || '';
      phone = data.phone || '';
      message = data.message || '';
      fileName = data.fileName || '';
      fileUrl = data.fileUrl || '';
    }

    const application = await db.jobApplication.create({
      data: { name, email, phone, message, fileName, fileUrl },
    });
    return NextResponse.json(application, { status: 201 });
  } catch (e) {
    console.error('Job application error:', e);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
