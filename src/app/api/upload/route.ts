import { NextRequest, NextResponse } from 'next/server';
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
