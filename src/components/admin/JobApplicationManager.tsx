'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Briefcase, FileDown } from 'lucide-react';

export default function JobApplicationManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/job-applications');
      setItems(await res.json());
    } catch {
      toast({ title: 'خطأ', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: string) => {
    try {
      await fetch('/api/admin/job-applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: true }),
      });
      loadData();
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, isRead: true } : null);
    } catch {
      toast({ title: 'خطأ', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          طلبات التوظيف
          {items.filter(i => !i.isRead).length > 0 && <Badge className="mr-2">{items.filter(i => !i.isRead).length} جديدة</Badge>}
        </h2>
        <Button onClick={loadData} variant="outline" size="sm"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="lg:w-96 border-gray-200 flex-shrink-0">
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-center text-gray-400 p-8">لا توجد طلبات</p>
              ) : items.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setSelected(item); if (!item.isRead) markRead(item.id); }}
                  className={`w-full text-right p-3 border-b border-gray-100 hover:bg-gray-50 ${selected?.id === item.id ? 'bg-[#6DB3D7]/10' : ''} ${!item.isRead ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    {!item.isRead && <div className="w-2 h-2 bg-[#6DB3D7] rounded-full flex-shrink-0" />}
                    <span className={`flex-1 truncate ${!item.isRead ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
                    <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">{item.email}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {selected ? (
          <Card className="flex-1 border-gray-200">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{selected.name}</h3>
                {!selected.isRead && (
                  <Button onClick={() => markRead(selected.id)} variant="outline" size="sm">تم القراءة</Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">البريد:</span> <span className="font-medium">{selected.email}</span>
                </div>
                {selected.phone && (
                  <div>
                    <span className="text-gray-500">الهاتف:</span> <span className="font-medium">{selected.phone}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">التاريخ:</span> <span>{new Date(selected.createdAt).toLocaleString('ar-SA')}</span>
                </div>
              </div>
              {selected.message && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selected.message}</p>
                </div>
              )}
              {selected.fileUrl && (
                <a href={selected.fileUrl} download className="inline-flex items-center gap-2 text-[#6DB3D7] hover:underline">
                  <FileDown className="h-4 w-4" />
                  {selected.fileName || 'تحميل الملف'}
                </a>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="flex-1 text-center text-gray-400 py-12">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>اختر طلب للعرض</p>
          </div>
        )}
      </div>
    </div>
  );
}
