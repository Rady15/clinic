'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AccountPage() {
  const { setCurrentPage } = useNavigationStore();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', email: '', confirmPassword: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo - just show success
    alert('هذه نسخة تجريبية - تسجيل الدخول غير متاح');
  };

  return (
    <main className="bg-gray-50 min-h-screen flex items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md mx-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#6DB3D7] rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-xl">C9</span>
          </div>
          <h2 className="text-2xl font-bold text-[#2C3E50]">{isLogin ? 'تسجيل الدخول' : 'حساب جديد'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">
              {isLogin ? 'اسم المستخدم أو البريد الإلكتروني' : 'اسم المستخدم'}
            </label>
            <div className="relative">
              <Input
                placeholder={isLogin ? 'أدخل بريدك الإلكتروني' : 'أدخل اسم المستخدم'}
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
              <label className="block text-sm font-medium text-[#333] mb-1">البريد الإلكتروني</label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
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
            <label className="block text-sm font-medium text-[#333] mb-1">كلمة المرور</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="أدخل كلمة المرور"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="h-11 pr-10 pl-10 rounded-xl"
                required
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7F8C8D]" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7F8C8D] hover:text-[#333]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">تأكيد كلمة المرور</label>
              <Input
                type="password"
                placeholder="أعد كتابة كلمة المرور"
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
                تذكرني
              </label>
              <button type="button" className="text-[#6DB3D7] hover:underline">
                استرجاع كلمة المرور؟
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#6DB3D7] hover:bg-[#5DADE2] text-white h-12 font-semibold rounded-xl"
          >
            {isLogin ? 'تسجيل دخول' : 'إنشاء حساب'}
          </Button>
        </form>

        <p className="text-center text-sm text-[#7F8C8D] mt-6">
          {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#6DB3D7] font-semibold hover:underline"
          >
            {isLogin ? 'حساب جديد' : 'تسجيل الدخول'}
          </button>
        </p>
      </motion.div>
    </main>
  );
}
