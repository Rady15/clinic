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

interface SettingGroup {
  name: string;
  label: string;
  settings: any[];
}

export default function SettingsManager() {
  const [groups, setGroups] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.grouped) {
        setGroups(data.grouped);
      }
    } catch {
      toast({ title: 'خطأ في تحميل الإعدادات', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (id: string, value: string) => {
    setGroups(prev => {
      const newGroups: Record<string, any[]> = {};
      for (const key of Object.keys(prev)) {
        newGroups[key] = prev[key].map(s => s.id === id ? { ...s, value } : s);
      }
      return newGroups;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const allSettings = Object.values(groups).flat();
      const updates = allSettings.map(s => ({ id: s.id, value: s.value }));
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        toast({ title: 'تم حفظ جميع الإعدادات' });
      } else {
        toast({ title: 'خطأ في الحفظ', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطأ', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const groupLabels: Record<string, string> = {
    general: 'الإعدادات العامة',
    contact: 'معلومات الاتصال',
    social: 'التواصل الاجتماعي',
    appearance: 'المظهر',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">الإعدادات العامة</h2>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={handleSave} className="bg-[#6DB3D7] hover:bg-[#5DADE2] gap-1" size="sm" disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? 'جاري الحفظ...' : 'حفظ الكل'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" dir="rtl">
        <TabsList className="flex-wrap h-auto gap-1">
          {Object.keys(groups).map(key => (
            <TabsTrigger key={key} value={key}>
              {groupLabels[key] || key}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(groups).map(([groupKey, settings]) => (
          <TabsContent key={groupKey} value={groupKey}>
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>{groupLabels[groupKey] || groupKey}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.map((setting: any) => (
                  <div key={setting.id} className="space-y-2">
                    <Label className="text-sm">{setting.label}</Label>
                    {setting.type === 'textarea' ? (
                      <Textarea
                        value={setting.value || ''}
                        onChange={(e) => updateSetting(setting.id, e.target.value)}
                        rows={3}
                      />
                    ) : setting.type === 'boolean' ? (
                      <Switch
                        checked={setting.value === 'true'}
                        onCheckedChange={(v) => updateSetting(setting.id, v ? 'true' : 'false')}
                      />
                    ) : setting.type === 'image' ? (
                      <ImageUploader
                        value={setting.value || ''}
                        onChange={(v) => updateSetting(setting.id, v)}
                        label="settings"
                      />
                    ) : (
                      <Input
                        value={setting.value || ''}
                        onChange={(e) => updateSetting(setting.id, e.target.value)}
                        placeholder={setting.label}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
