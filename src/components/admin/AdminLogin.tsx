'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock, User, LogIn } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('admin_name', data.admin.name || 'Admin');
        toast({ title: 'تم تسجيل الدخول بنجاح', description: `مرحباً ${data.admin.name}` });
        onLogin();
      } else {
        toast({ title: 'خطأ', description: data.error || 'فشل تسجيل الدخول', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في الاتصال', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6DB3D7]/20 to-[#5DADE2]/20 p-4" dir="rtl">
      <Card className="w-full max-w-md shadow-xl border-[#6DB3D7]/20">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-[#6DB3D7] rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-gray-800">لوحة التحكم</CardTitle>
          <p className="text-gray-500 mt-1">تسجيل دخول المدير</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="pr-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="pr-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#6DB3D7] hover:bg-[#5DADE2]" disabled={loading}>
              {loading ? 'جاري تسجيل الدخول...' : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  تسجيل الدخول
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
