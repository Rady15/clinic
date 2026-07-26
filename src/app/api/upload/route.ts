import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized - Please login to admin first' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'png';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`;
    const base64 = buffer.toString('base64');
    const url = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({ url, filename });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
