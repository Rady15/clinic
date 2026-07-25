'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';
import CurrencySymbol from '@/components/ui/currency-symbol';

interface OrderData {
  id: string;
  name: string;
  email: string;
  phone: string;
  total: number;
  subtotal: number;
  tax: number;
  status: string;
  paymentStatus: string;
  items: { nameAr: string; nameEn: string; price: number; quantity: number }[];
  createdAt: string;
}

export default function OrderManager() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`);
      setOrders(await res.json());
    } catch {
      toast({ title: 'خطأ', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const paymentColors: Record<string, string> = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-800">الطلبات ({orders.length})</h2>
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
                  <th className="text-right p-3">رقم الطلب</th>
                  <th className="text-right p-3">العميل</th>
                  <th className="text-right p-3">الهاتف</th>
                  <th className="text-right p-3">البريد</th>
                  <th className="text-right p-3">الإجمالي</th>
                  <th className="text-right p-3">حالة الدفع</th>
                  <th className="text-right p-3">الحالة</th>
                  <th className="text-right p-3">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={8} className="text-center p-8 text-gray-400">لا توجد طلبات</td></tr>
                ) : orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-medium">{order.id.slice(0, 8)}...</td>
                    <td className="p-3">{order.name}</td>
                    <td className="p-3">{order.phone}</td>
                    <td className="p-3 text-gray-500">{order.email || '-'}</td>
                    <td className="p-3">{order.total.toLocaleString()} <CurrencySymbol className="h-4 w-auto inline-block" /></td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentColors[order.paymentStatus] || ''}`}>
                        {order.paymentStatus === 'paid' ? 'مدفوع' : order.paymentStatus === 'pending' ? 'قيد الانتظار' : 'فشل'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ''}`}>
                        {order.status === 'confirmed' ? 'مؤكد' : order.status === 'pending' ? 'قيد الانتظار' : order.status === 'cancelled' ? 'ملغي' : 'مكتمل'}
                      </span>
                    </td>
                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</td>
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
