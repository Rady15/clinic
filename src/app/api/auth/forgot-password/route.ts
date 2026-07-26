import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db } from '@/lib/db';

const resetTokens = new Map<string, { userId: string; expires: number }>();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: true, message: 'تم إرسال رابط إعادة التعيين إذا كان البريد مسجلاً' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    resetTokens.set(token, { userId: user.id, expires: Date.now() + 60 * 60 * 1000 });

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رابط إعادة التعيين',
      resetUrl: `/account?resetToken=${token}`,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) {
      return NextResponse.json({ error: 'الرمز وكلمة المرور مطلوبان' }, { status: 400 });
    }

    const resetData = resetTokens.get(token);
    if (!resetData || resetData.expires < Date.now()) {
      return NextResponse.json({ error: 'الرمز غير صالح أو منتهي الصلاحية' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await db.user.update({ where: { id: resetData.userId }, data: { password: hashed } });
    resetTokens.delete(token);

    return NextResponse.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}
