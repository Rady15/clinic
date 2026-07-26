'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';
import { User, Lock, Mail, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { signIn, useSession } from 'next-auth/react';

type View = 'login' | 'register' | 'forgot' | 'reset';

function AccountPageInner() {
  const { setCurrentPage } = useNavigationStore();
  const { locale } = useLanguageStore();
  const { data: session } = useSession();
  const { toast } = useToast();

  const [view, setView] = useState<View>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [resetToken, setResetToken] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (session) setCurrentPage('dashboard');
  }, [session, setCurrentPage]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('resetToken');
    if (token) { setResetToken(token); setView('reset'); }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn('credentials', { email: form.email, password: form.password, redirect: false });
      if (res?.error) {
        toast({ title: locale === 'en' ? 'Login failed' : 'فشل تسجيل الدخول', description: locale === 'en' ? 'Invalid email or password' : 'البريد الإلكتروني أو كلمة المرور غير صحيحة', variant: 'destructive' });
      } else {
        toast({ title: locale === 'en' ? 'Welcome back!' : 'مرحباً بعودتك!' });
        setCurrentPage('dashboard');
      }
    } catch {
      toast({ title: 'حدث خطأ', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ title: locale === 'en' ? 'Passwords do not match' : 'كلمتا المرور غير متطابقتين', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: locale === 'en' ? 'Account created!' : 'تم إنشاء الحساب!' });
        setView('login');
        setForm({ name: '', email: form.email, password: '', confirmPassword: '' });
      } else {
        toast({ title: data.error || 'خطأ', variant: 'destructive' });
      }
    } catch { toast({ title: 'حدث خطأ', variant: 'destructive' }); }
    finally { setLoading(false); }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (data.resetUrl) {
        setResetToken(data.resetUrl.split('resetToken=')[1]);
        setView('reset');
        toast({ title: locale === 'en' ? 'Reset link ready' : 'رابط إعادة التعيين جاهز' });
      } else {
        setSuccessMsg(locale === 'en' ? 'Check your email for the reset link' : 'تحقق من بريدك الإلكتروني لرابط إعادة التعيين');
      }
    } catch { toast({ title: 'حدث خطأ', variant: 'destructive' }); }
    finally { setLoading(false); }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ title: locale === 'en' ? 'Passwords do not match' : 'كلمتا المرور غير متطابقتين', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: locale === 'en' ? 'Password changed!' : 'تم تغيير كلمة المرور!' });
        setView('login');
        setForm({ name: '', email: '', password: '', confirmPassword: '' });
      } else {
        toast({ title: data.error || 'خطأ', variant: 'destructive' });
      }
    } catch { toast({ title: 'حدث خطأ', variant: 'destructive' }); }
    finally { setLoading(false); }
  };

  const handleGoogleLogin = () => { signIn('google', { callbackUrl: '/' }); };

  const titles: Record<View, string> = {
    login: locale === 'en' ? 'Login' : 'تسجيل الدخول',
    register: locale === 'en' ? 'New Account' : 'حساب جديد',
    forgot: locale === 'en' ? 'Forgot Password' : 'استرجاع كلمة المرور',
    reset: locale === 'en' ? 'Reset Password' : 'إعادة تعيين كلمة المرور',
  };

  const views: { key: View; label: string }[] = [
    { key: 'login', label: locale === 'en' ? 'Login' : 'تسجيل الدخول' },
    { key: 'register', label: locale === 'en' ? 'New Account' : 'حساب جديد' },
    { key: 'forgot', label: locale === 'en' ? 'Forgot Password' : 'نسيت كلمة المرور' },
  ];

  return (
    <main className="bg-gray-50 min-h-screen flex items-center justify-center py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#6DB3D7] rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-xl">C9</span>
          </div>
          <h2 className="text-2xl font-bold text-[#2C3E50]">{titles[view]}</h2>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          {views.map(v => (
            <button key={v.key} onClick={() => { setView(v.key); setSuccessMsg(''); setForm({ name: '', email: '', password: '', confirmPassword: '' }); }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${view === v.key ? 'bg-white text-[#6DB3D7] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {v.label}
            </button>
          ))}
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl mb-4 text-sm">
            <CheckCircle className="w-4 h-4 shrink-0" /> {successMsg}
          </div>
        )}

        {/* LOGIN */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">{locale === 'en' ? 'Email or Username' : 'البريد الإلكتروني أو اسم المستخدم'} *</label>
              <div className="relative">
                <Input type="text" placeholder={locale === 'en' ? 'Enter email or username' : 'أدخل البريد الإلكتروني أو اسم المستخدم'} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="h-11 pr-10 rounded-xl" required />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7F8C8D]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">{t('header.password', locale)} *</label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} placeholder={locale === 'en' ? 'Enter password' : 'أدخل كلمة المرور'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="h-11 pr-10 pl-10 rounded-xl" required />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7F8C8D]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7F8C8D] hover:text-[#333]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#7F8C8D] cursor-pointer">
                <input type="checkbox" className="rounded" /> {t('header.remember', locale)}
              </label>
              <button type="button" onClick={() => setView('forgot')} className="text-[#6DB3D7] hover:underline">{t('header.forgot', locale)}</button>
            </div>
            <Button type="submit" className="w-full bg-[#6DB3D7] hover:bg-[#5DADE2] text-white h-12 font-semibold rounded-xl" disabled={loading}>
              {loading ? '...' : t('header.loginBtn', locale)}
            </Button>
          </form>
        )}

        {/* REGISTER */}
        {view === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">{locale === 'en' ? 'Full Name' : 'الاسم الكامل'} *</label>
              <div className="relative">
                <Input placeholder={locale === 'en' ? 'Enter your name' : 'أدخل اسمك'} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-11 pr-10 rounded-xl" required />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7F8C8D]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">{t('booking.email', locale)} *</label>
              <div className="relative">
                <Input type="email" placeholder={locale === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="h-11 pr-10 rounded-xl" required />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7F8C8D]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">{t('header.password', locale)} *</label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} placeholder={locale === 'en' ? 'Enter password' : 'أدخل كلمة المرور'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="h-11 pr-10 pl-10 rounded-xl" required />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7F8C8D]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7F8C8D] hover:text-[#333]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">{locale === 'en' ? 'Confirm Password' : 'تأكيد كلمة المرور'} *</label>
              <Input type="password" placeholder={locale === 'en' ? 'Re-enter password' : 'أعد كتابة كلمة المرور'} value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} className="h-11 rounded-xl" required />
            </div>
            <Button type="submit" className="w-full bg-[#6DB3D7] hover:bg-[#5DADE2] text-white h-12 font-semibold rounded-xl" disabled={loading}>
              {loading ? '...' : (locale === 'en' ? 'Create Account' : 'إنشاء حساب')}
            </Button>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {view === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <p className="text-sm text-[#7F8C8D] text-center">
              {locale === 'en' ? 'Enter your email to receive a reset link' : 'أدخل بريدك الإلكتروني لتستلم رابط إعادة التعيين'}
            </p>
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">{t('booking.email', locale)} *</label>
              <div className="relative">
                <Input type="email" placeholder={locale === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="h-11 pr-10 rounded-xl" required />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7F8C8D]" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#6DB3D7] hover:bg-[#5DADE2] text-white h-12 font-semibold rounded-xl" disabled={loading}>
              {loading ? '...' : (locale === 'en' ? 'Send Reset Link' : 'إرسال رابط إعادة التعيين')}
            </Button>
          </form>
        )}

        {/* RESET PASSWORD */}
        {view === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">{t('header.password', locale)} *</label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} placeholder={locale === 'en' ? 'New password' : 'كلمة المرور الجديدة'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="h-11 pr-10 pl-10 rounded-xl" required />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7F8C8D]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7F8C8D] hover:text-[#333]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">{locale === 'en' ? 'Confirm Password' : 'تأكيد كلمة المرور'} *</label>
              <Input type="password" placeholder={locale === 'en' ? 'Re-enter password' : 'أعد كتابة كلمة المرور'} value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} className="h-11 rounded-xl" required />
            </div>
            <Button type="submit" className="w-full bg-[#6DB3D7] hover:bg-[#5DADE2] text-white h-12 font-semibold rounded-xl" disabled={loading}>
              {loading ? '...' : (locale === 'en' ? 'Reset Password' : 'إعادة تعيين كلمة المرور')}
            </Button>
          </form>
        )}

        {/* Google Login */}
        {view === 'login' && (
          <>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-[#7F8C8D]">{locale === 'en' ? 'OR' : 'أو'}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <button onClick={handleGoogleLogin} type="button" className="w-full border border-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm text-[#333]">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              {locale === 'en' ? 'Continue with Google' : 'التسجيل بحساب جوجل'}
            </button>
          </>
        )}

        {/* Toggle login/register */}
        {(view === 'login' || view === 'register') && (
          <p className="text-center text-sm text-[#7F8C8D] mt-6">
            {view === 'login' ? t('header.noAccount', locale) : (locale === 'en' ? 'Already have an account?' : 'لديك حساب بالفعل؟')}{' '}
            <button onClick={() => { setView(view === 'login' ? 'register' : 'login'); setForm({ name: '', email: form.email, password: '', confirmPassword: '' }); }}
              className="text-[#6DB3D7] font-semibold hover:underline">
              {view === 'login' ? t('header.newAccount', locale) : t('header.loginBtn', locale)}
            </button>
          </p>
        )}

        {/* Back to login from forgot/reset */}
        {(view === 'forgot' || view === 'reset') && (
          <p className="text-center text-sm text-[#7F8C8D] mt-6">
            <button onClick={() => { setView('login'); setForm({ name: '', email: '', password: '', confirmPassword: '' }); }} className="text-[#6DB3D7] font-semibold hover:underline flex items-center gap-1 mx-auto">
              <ArrowRight className="w-4 h-4" /> {locale === 'en' ? 'Back to Login' : 'العودة لتسجيل الدخول'}
            </button>
          </p>
        )}
      </motion.div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-6 h-6 border-4 border-[#6DB3D7] border-t-transparent rounded-full" /></div>}>
      <AccountPageInner />
    </Suspense>
  );
}
