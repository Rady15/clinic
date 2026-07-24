'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ImageUploader } from './CrudManager';
import { Save, RefreshCw } from 'lucide-react';

export default function PromoPopupManager() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/promo-popup');
      const items = await res.json();
      if (Array.isArray(items) && items.length > 0) {
        setData(items[0]);
      }
    } catch {
      toast({ title: 'خطأ في تحميل البيانات', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/promo-popup', {
        method: data.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast({ title: 'تم الحفظ بنجاح' });
        loadData();
      } else {
        toast({ title: 'خطأ في الحفظ', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطأ في الحفظ', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: any) => {
    setData((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">النافذة المنبثقة</h2>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={handleSave} className="bg-[#6DB3D7] hover:bg-[#5DADE2] gap-1" size="sm" disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        </div>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-6 space-y-4">
          <ImageUploader value={data.image || ''} onChange={(v) => updateField('image', v)} label="promo" />

          <Tabs defaultValue="ar">
            <TabsList className="w-full">
              <TabsTrigger value="ar" className="flex-1">عربي</TabsTrigger>
              <TabsTrigger value="en" className="flex-1">English</TabsTrigger>
            </TabsList>
            <TabsContent value="ar" className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>العنوان (عربي)</Label>
                <Input value={data.titleAr || ''} onChange={(e) => updateField('titleAr', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>الوصف (عربي)</Label>
                <Textarea value={data.descriptionAr || ''} onChange={(e) => updateField('descriptionAr', e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>نص الزر (عربي)</Label>
                <Input value={data.ctaTextAr || ''} onChange={(e) => updateField('ctaTextAr', e.target.value)} />
              </div>
            </TabsContent>
            <TabsContent value="en" className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>العنوان (إنجليزي)</Label>
                <Input value={data.titleEn || ''} onChange={(e) => updateField('titleEn', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>الوصف (إنجليزي)</Label>
                <Textarea value={data.descriptionEn || ''} onChange={(e) => updateField('descriptionEn', e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>نص الزر (إنجليزي)</Label>
                <Input value={data.ctaTextEn || ''} onChange={(e) => updateField('ctaTextEn', e.target.value)} />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label>رابط الزر</Label>
            <Input value={data.ctaLink || ''} onChange={(e) => updateField('ctaLink', e.target.value)} placeholder="#offers" />
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={data.isActive ?? true} onCheckedChange={(v) => updateField('isActive', v)} />
            <Label>فعال</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
