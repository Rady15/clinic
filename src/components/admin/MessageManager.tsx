'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Mail, MailOpen } from 'lucide-react';

export default function MessageManager() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contact-messages');
      setMessages(await res.json());
    } catch {
      toast({ title: 'خطأ', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: string) => {
    try {
      await fetch('/api/admin/contact-messages', {
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

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          الرسائل {unreadCount > 0 && <Badge className="mr-2">{unreadCount} جديدة</Badge>}
        </h2>
        <Button onClick={loadData} variant="outline" size="sm"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="lg:w-96 border-gray-200 flex-shrink-0">
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-center text-gray-400 p-8">لا توجد رسائل</p>
              ) : messages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => { setSelected(msg); if (!msg.isRead) markRead(msg.id); }}
                  className={`w-full text-right p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${selected?.id === msg.id ? 'bg-[#6DB3D7]/10' : ''} ${!msg.isRead ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    {!msg.isRead && <div className="w-2 h-2 bg-[#6DB3D7] rounded-full flex-shrink-0" />}
                    <span className={`flex-1 truncate ${!msg.isRead ? 'font-bold' : 'font-medium'}`}>{msg.name}</span>
                    <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">{msg.subject || msg.message}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {selected ? (
          <Card className="flex-1 border-gray-200">
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold">{selected.subject || 'بدون عنوان'}</h3>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                  <span>{selected.name}</span>
                  <span>{selected.email}</span>
                  {selected.phone && <span>{selected.phone}</span>}
                </div>
                <p className="text-xs text-gray-400 mt-1">{new Date(selected.createdAt).toLocaleString('ar-SA')}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{selected.message}</p>
              </div>
              {!selected.isRead && (
                <Button onClick={() => markRead(selected.id)} variant="outline" size="sm" className="gap-1">
                  <MailOpen className="h-4 w-4" /> تم القراءة
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="flex-1 text-center text-gray-400 py-12">
            <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>اختر رسالة لعرضها</p>
          </div>
        )}
      </div>
    </div>
  );
}
