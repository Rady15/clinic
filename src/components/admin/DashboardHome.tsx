'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Stethoscope, UserCog, Calendar, Newspaper, MessageSquare, Briefcase, Star, Clock } from 'lucide-react';

interface Stats {
  services: number;
  doctors: number;
  bookings: number;
  articles: number;
  messages: number;
  jobApplications: number;
  ratings: number;
}

export default function DashboardHome() {
  const [stats, setStats] = useState<Stats>({ services: 0, doctors: 0, bookings: 0, articles: 0, messages: 0, jobApplications: 0, ratings: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const { toast } = useToast();

  const loadStats = useCallback(async () => {
    try {
      const [services, doctors, bookings, articles, messages, jobs, ratings] = await Promise.all([
        fetch('/api/admin/services').then(r => r.json()).then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
        fetch('/api/admin/doctors').then(r => r.json()).then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
        fetch('/api/admin/bookings').then(r => r.json()).then(d => Array.isArray(d) ? d : []).catch(() => []),
        fetch('/api/admin/articles').then(r => r.json()).then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
        fetch('/api/admin/contact-messages').then(r => r.json()).then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
        fetch('/api/admin/job-applications').then(r => r.json()).then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
        fetch('/api/admin/ratings').then(r => r.json()).then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
      ]);
      setStats({
        services: services as number,
        doctors: doctors as number,
        bookings: (bookings as any[]).length,
        articles: articles as number,
        messages: messages as number,
        jobApplications: jobs as number,
        ratings: ratings as number,
      });
      setRecentBookings((bookings as any[]).slice(0, 5));
    } catch {
      toast({ title: 'خطأ في تحميل الإحصائيات', variant: 'destructive' });
    }
  }, [toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStats();
  }, [loadStats]);

  const statCards = [
    { label: 'الخدمات', value: stats.services, icon: Stethoscope, color: 'bg-blue-500' },
    { label: 'الأطباء', value: stats.doctors, icon: UserCog, color: 'bg-green-500' },
    { label: 'الحجوزات', value: stats.bookings, icon: Calendar, color: 'bg-orange-500' },
    { label: 'المقالات', value: stats.articles, icon: Newspaper, color: 'bg-purple-500' },
    { label: 'الرسائل', value: stats.messages, icon: MessageSquare, color: 'bg-pink-500' },
    { label: 'طلبات التوظيف', value: stats.jobApplications, icon: Briefcase, color: 'bg-yellow-500' },
    { label: 'التقييمات', value: stats.ratings, icon: Star, color: 'bg-teal-500' },
    { label: 'ساعات العمل', value: '7 أيام', icon: Clock, color: 'bg-indigo-500' },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };
  const statusLabels: Record<string, string> = {
    pending: 'قيد الانتظار',
    confirmed: 'مؤكد',
    cancelled: 'ملغي',
    completed: 'مكتمل',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">مرحباً بك في لوحة التحكم</h1>
        <p className="text-gray-500 mt-1">إدارة محتوى الموقع والعمليات اليومية</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                  <p className="text-sm text-gray-500">{card.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">آخر الحجوزات</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-gray-400 text-center py-8">لا توجد حجوزات حتى الآن</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right p-3 text-gray-600 font-medium">الاسم</th>
                    <th className="text-right p-3 text-gray-600 font-medium">الهاتف</th>
                    <th className="text-right p-3 text-gray-600 font-medium">القسم</th>
                    <th className="text-right p-3 text-gray-600 font-medium">التاريخ</th>
                    <th className="text-right p-3 text-gray-600 font-medium">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-medium">{b.name}</td>
                      <td className="p-3 text-gray-600">{b.phone}</td>
                      <td className="p-3 text-gray-600">{b.department}</td>
                      <td className="p-3 text-gray-600">{b.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[b.status] || ''}`}>
                          {statusLabels[b.status] || b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
