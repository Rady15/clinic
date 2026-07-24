'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Check, X, Clock } from 'lucide-react';

export default function BookingManager() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`);
      setBookings(await res.json());
    } catch {
      toast({ title: 'خطأ', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        toast({ title: 'تم تحديث الحالة' });
        loadData();
      }
    } catch {
      toast({ title: 'خطأ', variant: 'destructive' });
    }
  };

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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-800">الحجوزات ({bookings.length})</h2>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="pending">قيد الانتظار</SelectItem>
              <SelectItem value="confirmed">مؤكد</SelectItem>
              <SelectItem value="cancelled">ملغي</SelectItem>
              <SelectItem value="completed">مكتمل</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadData} variant="outline" size="sm"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></Button>
        </div>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-right p-3">الاسم</th>
                  <th className="text-right p-3">الهاتف</th>
                  <th className="text-right p-3">البريد</th>
                  <th className="text-right p-3">القسم</th>
                  <th className="text-right p-3">التاريخ</th>
                  <th className="text-right p-3">الوقت</th>
                  <th className="text-right p-3">الحالة</th>
                  <th className="text-right p-3">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={8} className="text-center p-8 text-gray-400">لا توجد حجوزات</td></tr>
                ) : bookings.map((b) => (
                  <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-medium">{b.name}</td>
                    <td className="p-3">{b.phone}</td>
                    <td className="p-3 text-gray-500">{b.email || '-'}</td>
                    <td className="p-3">{b.department}</td>
                    <td className="p-3">{b.date}</td>
                    <td className="p-3">{b.time}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[b.status] || ''}`}>
                        {statusLabels[b.status] || b.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {b.status !== 'confirmed' && b.status !== 'completed' && (
                          <Button variant="ghost" size="sm" onClick={() => updateStatus(b.id, 'confirmed')} title="تأكيد">
                            <Check className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
                        {b.status !== 'completed' && (
                          <Button variant="ghost" size="sm" onClick={() => updateStatus(b.id, 'completed')} title="مكتمل">
                            <Clock className="h-4 w-4 text-blue-500" />
                          </Button>
                        )}
                        {b.status !== 'cancelled' && (
                          <Button variant="ghost" size="sm" onClick={() => updateStatus(b.id, 'cancelled')} title="إلغاء">
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
