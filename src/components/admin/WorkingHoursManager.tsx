'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Save, RefreshCw } from 'lucide-react';

export default function WorkingHoursManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/working-hours');
      setItems(await res.json());
    } catch {
      toast({ title: 'خطأ', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (id: string, key: string, value: any) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: value } : i));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(items.map(item =>
        fetch('/api/admin/working-hours', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        })
      ));
      toast({ title: 'تم حفظ ساعات العمل' });
    } catch {
      toast({ title: 'خطأ', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">ساعات العمل</h2>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline" size="sm"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></Button>
          <Button onClick={handleSave} className="bg-[#6DB3D7] hover:bg-[#5DADE2] gap-1" size="sm" disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        </div>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg ${!item.isActive ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
              <div className="flex-1 flex items-center gap-3 min-w-0">
                <span className="font-medium text-gray-800 w-24 flex-shrink-0">{item.dayAr}</span>
                <span className="text-gray-400 text-sm w-24 flex-shrink-0">{item.dayEn}</span>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-gray-500">من</Label>
                <Input
                  type="time"
                  value={item.from || ''}
                  onChange={(e) => updateField(item.id, 'from', e.target.value)}
                  className="w-32"
                  disabled={!item.isActive}
                />
                <Label className="text-xs text-gray-500">إلى</Label>
                <Input
                  type="time"
                  value={item.to || ''}
                  onChange={(e) => updateField(item.id, 'to', e.target.value)}
                  className="w-32"
                  disabled={!item.isActive}
                />
              </div>
              <Switch
                checked={item.isActive ?? true}
                onCheckedChange={(v) => updateField(item.id, 'isActive', v)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
