import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { cookies } from 'next/headers';

const ADMIN_TOKEN = 'clinic-admin-token-2024';

async function verifyUploadAuth(req: NextRequest): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get('admin_token')?.value === ADMIN_TOKEN;
}

export async function POST(request: NextRequest) {
  try {
    if (!await verifyUploadAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized - Please login to admin first' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('image') as File | null;
      const folder = (formData.get('folder') as string) || 'general';

      if (!file) {
        return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
      }

      const ext = file.name.split('.').pop() || 'png';
      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);

      const url = `/uploads/${folder}/${filename}`;
      return NextResponse.json({ url, filename });
    }

    const body = await request.json();
    const { image, folder = 'general' } = body;

    if (!image) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }

    const matches = image.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
    }

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const url = `/uploads/${folder}/${filename}`;
    return NextResponse.json({ url, filename });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
