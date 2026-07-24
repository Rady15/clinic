'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Star } from 'lucide-react';

export default function RatingManager() {
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/ratings');
      setRatings(await res.json());
    } catch {
      toast({ title: 'خطأ', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">التقييمات ({ratings.length})</h2>
        <Button onClick={loadData} variant="outline" size="sm"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></Button>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-right p-3">الاسم</th>
                  <th className="text-right p-3">البريد</th>
                  <th className="text-right p-3">القسم</th>
                  <th className="text-right p-3">النظافة</th>
                  <th className="text-right p-3">لطف الموظفين</th>
                  <th className="text-right p-3">التعاون</th>
                  <th className="text-right p-3">التعليق</th>
                  <th className="text-right p-3">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {ratings.length === 0 ? (
                  <tr><td colSpan={8} className="text-center p-8 text-gray-400">لا توجد تقييمات</td></tr>
                ) : ratings.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-medium">{r.name}</td>
                    <td className="p-3 text-gray-500">{r.email || '-'}</td>
                    <td className="p-3">{r.department || '-'}</td>
                    <td className="p-3">{renderStars(r.cleanliness)}</td>
                    <td className="p-3">{renderStars(r.staffFriendly)}</td>
                    <td className="p-3">{renderStars(r.staffCoop)}</td>
                    <td className="p-3 max-w-[200px] truncate">{r.comment || '-'}</td>
                    <td className="p-3 text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString('ar-SA')}</td>
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
