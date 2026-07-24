'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';
import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AccountPage() {
  const { setCurrentPage } = useNavigationStore();
  const { locale } = useLanguageStore();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', email: '', confirmPassword: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(locale === 'en' ? 'This is a demo version - login is not available' : 'هذه نسخة تجريبية - تسجيل الدخول غير متاح');
  };

  return (
    <main className="bg-gray-50 min-h-screen flex items-center justify-center py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#6DB3D7] rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-xl">C9</span>
          </div>
          <h2 className="text-2xl font-bold text-[#2C3E50]">
            {isLogin ? (locale === 'en' ? 'Login' : 'تسجيل الدخول') : (locale === 'en' ? 'New Account' : 'حساب جديد')}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">
              {isLogin ? t('header.username', locale) : (locale === 'en' ? 'Username' : 'اسم المستخدم')}
            </label>
            <div className="relative">
              <Input
                placeholder={isLogin ? (locale === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني') : (locale === 'en' ? 'Enter username' : 'أدخل اسم المستخدم')}
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="h-11 pr-10 rounded-xl"
                required
              />
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7F8C8D]" />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">{t('booking.email', locale)}</label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder={locale === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="h-11 pr-10 rounded-xl"
                  required
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7F8C8D]" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">{t('header.password', locale)}</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={locale === 'en' ? 'Enter password' : 'أدخل كلمة المرور'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="h-11 pr-10 pl-10 rounded-xl"
                required
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7F8C8D]" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7F8C8D] hover:text-[#333]">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">{locale === 'en' ? 'Confirm Password' : 'تأكيد كلمة المرور'}</label>
              <Input
                type="password"
                placeholder={locale === 'en' ? 'Re-enter password' : 'أعد كتابة كلمة المرور'}
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                className="h-11 rounded-xl"
                required
              />
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#7F8C8D] cursor-pointer">
                <input type="checkbox" className="rounded" />
                {t('header.remember', locale)}
              </label>
              <button type="button" className="text-[#6DB3D7] hover:underline">{t('header.forgot', locale)}</button>
            </div>
          )}

          <Button type="submit" className="w-full bg-[#6DB3D7] hover:bg-[#5DADE2] text-white h-12 font-semibold rounded-xl">
            {isLogin ? t('header.loginBtn', locale) : (locale === 'en' ? 'Create Account' : 'إنشاء حساب')}
          </Button>
        </form>

        <p className="text-center text-sm text-[#7F8C8D] mt-6">
          {isLogin ? t('header.noAccount', locale) : (locale === 'en' ? 'Already have an account?' : 'لديك حساب بالفعل؟')}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-[#6DB3D7] font-semibold hover:underline">
            {isLogin ? t('header.newAccount', locale) : t('header.loginBtn', locale)}
          </button>
        </p>
      </motion.div>
    </main>
  );
}
