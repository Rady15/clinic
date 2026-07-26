'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ImageUploader } from './CrudManager';
import { Save, RefreshCw, Plus, Trash2, GripVertical } from 'lucide-react';

interface ImageBanner {
  id: string;
  image: string;
  position: string;
  fullWidth: boolean;
  ctaEnabled: boolean;
  ctaTextAr: string;
  ctaTextEn: string;
  ctaLink: string;
  order: number;
  isActive: boolean;
}

const POSITION_OPTIONS = [
  { value: 'after_hero', label: 'بعد السلايدر الرئيسي' },
  { value: 'after_info_strip', label: 'بعد شريط المعلومات' },
  { value: 'after_services_grid', label: 'بعد شبكة الخدمات' },
  { value: 'after_cta_banner', label: 'بعد بانر الدفع بالتقسيط' },
  { value: 'after_premium_services', label: 'بعد الخدمات المميزة' },
  { value: 'after_doctors', label: 'بعد الأطباء' },
  { value: 'after_testimonials', label: 'بعد آراء العملاء' },
  { value: 'after_before_after', label: 'بعد قبل وبعد' },
  { value: 'after_videos', label: 'بعد الفيديوهات' },
  { value: 'after_blog', label: 'بعد المدونة' },
  { value: 'after_cta_contact', label: 'بعد بانر التواصل' },
  { value: 'after_insurance', label: 'بعد شركات التأمين' },
];

const createNewBanner = (): ImageBanner => ({
  id: '',
  image: '',
  position: 'after_hero',
  fullWidth: false,
  ctaEnabled: false,
  ctaTextAr: '',
  ctaTextEn: '',
  ctaLink: '',
  order: 0,
  isActive: true,
});

export default function ImageBannerManager() {
  const [banners, setBanners] = useState<ImageBanner[]>([]);
  const [settingId, setSettingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => { loadBanners(); }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      const settings = data.settings || [];
      const existing = settings.find((s: any) => s.key === 'home_image_banners');
      if (existing) {
        setSettingId(existing.id);
        try { setBanners(JSON.parse(existing.value)); } catch { setBanners([]); }
      }
    } catch {
      toast({ title: 'خطأ في تحميل البيانات', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = JSON.stringify(banners);
      if (settingId) {
        const res = await fetch('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: settingId, value: payload }),
        });
        if (res.ok) toast({ title: 'تم الحفظ' });
        else toast({ title: 'خطأ', variant: 'destructive' });
      } else {
        const res = await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: 'home_image_banners',
            value: payload,
            label: 'بانرات الصور للصفحة الرئيسية',
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
    } catch { toast({ title: 'خطأ', variant: 'destructive' }); }
    finally { setSaving(false); }
  };

  const addBanner = () => {
    setBanners(prev => [...prev, createNewBanner()]);
    setEditingIndex(banners.length);
  };

  const updateBanner = (index: number, field: keyof ImageBanner, value: any) => {
    setBanners(prev => prev.map((b, i) => i === index ? { ...b, [field]: value } : b));
  };

  const removeBanner = (index: number) => {
    setBanners(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
    else if (editingIndex !== null && editingIndex > index) setEditingIndex(editingIndex - 1);
  };

  const moveBanner = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;
    setBanners(prev => {
      const arr = [...prev];
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return arr;
    });
    if (editingIndex === index) setEditingIndex(newIndex);
    else if (editingIndex === newIndex) setEditingIndex(index);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin w-6 h-6 border-4 border-[#6DB3D7] border-t-transparent rounded-full" /></div>;
  }

  const editing = editingIndex !== null ? banners[editingIndex] : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">بانرات الصور للصفحة الرئيسية</h2>
        <div className="flex gap-2">
          <Button onClick={loadBanners} variant="outline" size="sm"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></Button>
          <Button onClick={addBanner} variant="outline" size="sm" className="gap-1"><Plus className="h-3 w-3" /> بانر جديد</Button>
          <Button onClick={handleSave} className="bg-[#6DB3D7] hover:bg-[#5DADE2] gap-1" size="sm" disabled={saving}>
            <Save className="h-4 w-4" /> حفظ
          </Button>
        </div>
      </div>

      {/* Banner List */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          {banners.length === 0 ? (
            <p className="text-center text-gray-400 py-8">لا توجد بانرات بعد. اضغط "بانر جديد" للإضافة.</p>
          ) : (
            <div className="space-y-2">
              {banners.map((banner, idx) => (
                <div key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${editingIndex === idx ? 'border-[#6DB3D7] bg-[#EBF5FB]/50' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setEditingIndex(editingIndex === idx ? null : idx)}
                >
                  <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                  <div className="flex gap-1 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); moveBanner(idx, 'up'); }} disabled={idx === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs">▲</button>
                    <button onClick={(e) => { e.stopPropagation(); moveBanner(idx, 'down'); }} disabled={idx === banners.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs">▼</button>
                  </div>
                  {banner.image && <img src={banner.image} alt="" className="w-16 h-10 object-cover rounded" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{POSITION_OPTIONS.find(p => p.value === banner.position)?.label || banner.position}</p>
                    <p className="text-xs text-gray-400">ترتيب: {banner.order} | {banner.fullWidth ? 'عرض كامل' : 'عرض عادي'} | {banner.ctaEnabled ? 'مع CTA' : 'بدون CTA'}</p>
                  </div>
                  <Switch checked={banner.isActive} onCheckedChange={(v) => updateBanner(idx, 'isActive', v)} onClick={(e) => e.stopPropagation()} />
                  <button onClick={(e) => { e.stopPropagation(); removeBanner(idx); }} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Form */}
      {editing && editingIndex !== null && (
        <Card className="border-[#6DB3D7]">
          <CardContent className="p-6 space-y-5">
            <h3 className="font-semibold text-gray-700">تعديل البانر #{editingIndex + 1}</h3>

            <ImageUploader value={editing.image} onChange={(v) => updateBanner(editingIndex, 'image', v)} label={`img-banner-${editingIndex}`} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>الموضع</Label>
                <select value={editing.position} onChange={(e) => updateBanner(editingIndex, 'position', e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm">
                  {POSITION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>الترتيب</Label>
                <Input type="number" value={editing.order} onChange={(e) => updateBanner(editingIndex, 'order', parseInt(e.target.value) || 0)} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>العرض</Label>
                <div className="flex items-center gap-3 pt-2">
                  <Switch checked={editing.fullWidth} onCheckedChange={(v) => updateBanner(editingIndex, 'fullWidth', v)} />
                  <span className="text-sm text-gray-600">{editing.fullWidth ? 'عرض كامل' : 'عرض عادي'}</span>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch checked={editing.ctaEnabled} onCheckedChange={(v) => updateBanner(editingIndex, 'ctaEnabled', v)} />
                <Label>إظهار زر CTA</Label>
              </div>
              {editing.ctaEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
                  <Input value={editing.ctaTextAr} onChange={(e) => updateBanner(editingIndex, 'ctaTextAr', e.target.value)} placeholder="نص الزر (عربي)" />
                  <Input value={editing.ctaTextEn} onChange={(e) => updateBanner(editingIndex, 'ctaTextEn', e.target.value)} placeholder="Button text (EN)" />
                  <Input value={editing.ctaLink} onChange={(e) => updateBanner(editingIndex, 'ctaLink', e.target.value)} placeholder="الرابط (booking, services, https://...)" className="md:col-span-2" />
                </div>
              )}
            </div>

            {/* Preview */}
            {editing.image && (
              <div className="space-y-2">
                <Label>معاينة</Label>
                <div className={`relative rounded-xl overflow-hidden ${editing.fullWidth ? '' : 'max-w-3xl'}`}>
                  <img src={editing.image} alt="" className="w-full h-48 object-cover" />
                  {editing.ctaEnabled && (
                    <div className="absolute bottom-4 right-4 bg-white/90 px-4 py-2 rounded-lg text-sm font-bold text-[#2C3E50] backdrop-blur-sm">
                      {editing.ctaTextAr || 'نص الزر'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
