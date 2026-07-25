import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { cookies } from 'next/headers';

const ADMIN_TOKEN = 'clinic-admin-token-2024';

async function verifyUploadAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get('admin_token')?.value === ADMIN_TOKEN;
}

export async function POST(request: NextRequest) {
  try {
    if (!await verifyUploadAuth()) {
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
    const pathname = `${folder}/${filename}`;

    const blob = await put(pathname, file, {
      access: 'public',
    });

    return NextResponse.json({ url: blob.url, filename });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
