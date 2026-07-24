'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ImageUploader } from './CrudManager';
import { Save, RefreshCw, Plus } from 'lucide-react';

export default function PageContentManager() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/page-content');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0) setSelected(data[0].id);
    } catch {
      toast({ title: 'خطأ', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const current = items.find(i => i.id === selected);

  const updateField = (key: string, value: any) => {
    setItems(prev => prev.map(i => i.id === selected ? { ...i, [key]: value } : i));
  };

  const handleSave = async () => {
    if (!current) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/page-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(current),
      });
      if (res.ok) toast({ title: 'تم الحفظ' });
      else toast({ title: 'خطأ', variant: 'destructive' });
    } catch {
      toast({ title: 'خطأ', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    const key = prompt('أدخل معرف الصفحة (pageKey):');
    if (!key) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/page-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageKey: key }),
      });
      if (res.ok) {
        const newItem = await res.json();
        setItems(prev => [...prev, newItem]);
        setSelected(newItem.id);
        toast({ title: 'تم الإنشاء' });
      }
    } catch {
      toast({ title: 'خطأ', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">محتوى الصفحات</h2>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline" size="sm"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></Button>
          <Button onClick={handleCreate} variant="outline" size="sm" className="gap-1"><Plus className="h-4 w-4" /> إضافة صفحة</Button>
          <Button onClick={handleSave} className="bg-[#6DB3D7] hover:bg-[#5DADE2] gap-1" size="sm" disabled={saving || !current}>
            <Save className="h-4 w-4" /> حفظ
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-48 flex lg:flex-col gap-2 overflow-x-auto">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${selected === item.id ? 'bg-[#6DB3D7] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {item.pageKey}
            </button>
          ))}
        </div>

        {current ? (
          <Card className="flex-1 border-gray-200">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>معرف الصفحة</Label>
                <Input value={current.pageKey} disabled className="bg-gray-50" />
              </div>

              <ImageUploader value={current.image || ''} onChange={(v) => updateField('image', v)} label="page" />

              <Tabs defaultValue="ar">
                <TabsList className="w-full">
                  <TabsTrigger value="ar" className="flex-1">عربي</TabsTrigger>
                  <TabsTrigger value="en" className="flex-1">English</TabsTrigger>
                </TabsList>
                <TabsContent value="ar" className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>العنوان (عربي)</Label>
                    <Input value={current.titleAr || ''} onChange={(e) => updateField('titleAr', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>المحتوى (عربي)</Label>
                    <Textarea value={current.contentAr || ''} onChange={(e) => updateField('contentAr', e.target.value)} rows={10} />
                  </div>
                </TabsContent>
                <TabsContent value="en" className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>العنوان (إنجليزي)</Label>
                    <Input value={current.titleEn || ''} onChange={(e) => updateField('titleEn', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>المحتوى (إنجليزي)</Label>
                    <Textarea value={current.contentEn || ''} onChange={(e) => updateField('contentEn', e.target.value)} rows={10} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <div className="flex-1 text-center text-gray-400 py-12">اختر صفحة للتعديل</div>
        )}
      </div>
    </div>
  );
}
