'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ImageUploader } from './CrudManager';
import { Save, RefreshCw, Plus, Trash2 } from 'lucide-react';

interface CtaButton {
  textAr: string;
  textEn: string;
  link: string;
  icon: string;
}

interface CtaBannerConfig {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  bgColor: string;
  buttons: CtaButton[];
  isActive: boolean;
}

const defaultConfig: CtaBannerConfig = {
  titleAr: 'ابتسم الآن وادفع لاحقا',
  titleEn: 'Smile Now, Pay Later',
  descriptionAr: 'استمتع بخدماتنا وادفع على أقساط مريحة مع تمارا',
  descriptionEn: 'Enjoy our services and pay in easy installments with Tamara',
  image: '',
  bgColor: '#6DB3D7',
  buttons: [
    { textAr: 'تصفح الخدمات', textEn: 'Browse Services', link: 'services', icon: '' },
  ],
  isActive: true,
};

export default function CtaBannerManager() {
  const [config, setConfig] = useState<CtaBannerConfig>(defaultConfig);
  const [settingId, setSettingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadConfig(); }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      const settings = data.settings || [];
      const existing = settings.find((s: any) => s.key === 'cta_banner');
      if (existing) {
        setSettingId(existing.id);
        try {
          setConfig(JSON.parse(existing.value));
        } catch {}
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
      if (settingId) {
        const res = await fetch('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: settingId, value: JSON.stringify(config) }),
        });
        if (res.ok) toast({ title: 'تم الحفظ' });
        else toast({ title: 'خطأ', variant: 'destructive' });
      } else {
        const res = await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: 'cta_banner',
            value: JSON.stringify(config),
            label: 'بانر الدفع بالتقسيط',
            type: 'json',
            group: 'appearance',
          }),
        });
        if (res.ok) {
          const item = await res.json();
          setSettingId(item.id);
          toast({ title: 'تم الحفظ' });
        } else toast({ title: 'خطأ', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطأ', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const addButton = () => {
    setConfig(prev => ({
      ...prev,
      buttons: [...prev.buttons, { textAr: '', textEn: '', link: '', icon: '' }],
    }));
  };

  const updateButton = (index: number, field: keyof CtaButton, value: string) => {
    setConfig(prev => ({
      ...prev,
      buttons: prev.buttons.map((btn, i) => i === index ? { ...btn, [field]: value } : btn),
    }));
  };

  const removeButton = (index: number) => {
    setConfig(prev => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin w-6 h-6 border-4 border-[#6DB3D7] border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">بانر الدفع بالتقسيط</h2>
        <div className="flex gap-2">
          <Button onClick={loadConfig} variant="outline" size="sm"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></Button>
          <Button onClick={handleSave} className="bg-[#6DB3D7] hover:bg-[#5DADE2] gap-1" size="sm" disabled={saving}>
            <Save className="h-4 w-4" /> حفظ
          </Button>
        </div>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-6 space-y-6">
          {/* Background */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>لون الخلفية</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={config.bgColor} onChange={(e) => setConfig(prev => ({ ...prev, bgColor: e.target.value }))} className="w-10 h-10 rounded border cursor-pointer" />
                <Input value={config.bgColor} onChange={(e) => setConfig(prev => ({ ...prev, bgColor: e.target.value }))} placeholder="#6DB3D7" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>الحالة</Label>
              <div className="flex items-center gap-3 pt-2">
                <Switch checked={config.isActive} onCheckedChange={(v) => setConfig(prev => ({ ...prev, isActive: v }))} />
                <span className="text-sm text-gray-600">{config.isActive ? 'فعال' : 'معطل'}</span>
              </div>
            </div>
          </div>

          <ImageUploader value={config.image} onChange={(v) => setConfig(prev => ({ ...prev, image: v }))} label="cta-banner" />

          {/* Arabic / English content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">عربي</h4>
              <div className="space-y-2">
                <Label>العنوان</Label>
                <Input value={config.titleAr} onChange={(e) => setConfig(prev => ({ ...prev, titleAr: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea value={config.descriptionAr} onChange={(e) => setConfig(prev => ({ ...prev, descriptionAr: e.target.value }))} rows={2} />
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">English</h4>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={config.titleEn} onChange={(e) => setConfig(prev => ({ ...prev, titleEn: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={config.descriptionEn} onChange={(e) => setConfig(prev => ({ ...prev, descriptionEn: e.target.value }))} rows={2} />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-700">الأزرار</h4>
              <Button onClick={addButton} variant="outline" size="sm" className="gap-1"><Plus className="h-3 w-3" /> إضافة زر</Button>
            </div>
            {config.buttons.map((btn, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">زر {idx + 1}</span>
                  <button onClick={() => removeButton(idx)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input value={btn.textAr} onChange={(e) => updateButton(idx, 'textAr', e.target.value)} placeholder="نص الزر (عربي)" />
                  <Input value={btn.textEn} onChange={(e) => updateButton(idx, 'textEn', e.target.value)} placeholder="Button text (EN)" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input value={btn.link} onChange={(e) => updateButton(idx, 'link', e.target.value)} placeholder="الرابط (booking, services, https://...)" />
                  <ImageUploader value={btn.icon} onChange={(v) => updateButton(idx, 'icon', v)} label={`btn-icon-${idx}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>معاينة</Label>
            <div className="rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ background: `linear-gradient(to left, ${config.bgColor}, ${config.bgColor}dd)` }}>
              <div className="text-center md:text-right">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{config.titleAr || '...'}</h3>
                <p className="text-white/80 text-sm">{config.descriptionAr || '...'}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {config.buttons.map((btn, idx) => (
                  <div key={idx} className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1">
                    {btn.icon && <img src={btn.icon} alt="" className="w-4 h-4" />}
                    {btn.textAr || '...'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
