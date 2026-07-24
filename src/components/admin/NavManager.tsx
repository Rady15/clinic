'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';

export default function NavManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/nav-items');
      setItems(await res.json());
    } catch {
      toast({ title: 'خطأ', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSave = async (data: any) => {
    try {
      const res = await fetch('/api/admin/nav-items', {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem ? { ...data, id: editingItem.id } : data),
      });
      if (res.ok) { toast({ title: editingItem ? 'تم التحديث' : 'تم الإنشاء' }); setDialogOpen(false); setEditingItem(null); loadData(); }
      else toast({ title: 'خطأ', variant: 'destructive' });
    } catch {
      toast({ title: 'خطأ', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/nav-items?id=${id}`, { method: 'DELETE' });
      if (res.ok) { toast({ title: 'تم الحذف' }); loadData(); }
    } catch {
      toast({ title: 'خطأ', variant: 'destructive' });
    }
  };

  const topItems = items.filter(i => !i.parentId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">إدارة القائمة</h2>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline" size="sm"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></Button>
          <Button onClick={() => { setEditingItem(null); setDialogOpen(true); }} className="bg-[#6DB3D7] hover:bg-[#5DADE2] gap-1" size="sm">
            <Plus className="h-4 w-4" /> إضافة عنصر
          </Button>
        </div>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-4">
          {topItems.map(item => (
            <div key={item.id} className="border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded">
                {item.children?.length > 0 && (
                  <button onClick={() => toggleExpand(item.id)} className="p-1">
                    {expanded.has(item.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                )}
                <div className="flex-1">
                  <span className="font-medium">{item.labelAr}</span>
                  <span className="text-gray-400 text-xs mr-2">({item.page})</span>
                </div>
                <Badge variant={item.isActive ? 'default' : 'secondary'}>{item.isActive ? 'فعال' : 'معطل'}</Badge>
                <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); setDialogOpen(true); }}><Pencil className="h-3 w-3" /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="h-3 w-3 text-red-500" /></Button>
              </div>
              {expanded.has(item.id) && item.children?.map(child => (
                <div key={child.id} className="flex items-center gap-2 p-2 pr-10 hover:bg-gray-50 rounded">
                  <span className="text-sm">{child.labelAr}</span>
                  <span className="text-gray-400 text-xs">({child.page})</span>
                  <div className="flex-1" />
                  <Button variant="ghost" size="sm" onClick={() => { setEditingItem(child); setDialogOpen(true); }}><Pencil className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(child.id)}><Trash2 className="h-3 w-3 text-red-500" /></Button>
                </div>
              ))}
              {expanded.has(item.id) && (
                <button
                  onClick={() => { setEditingItem({ parentId: item.id }); setDialogOpen(true); }}
                  className="p-2 pr-10 text-xs text-[#6DB3D7] hover:underline"
                >
                  + إضافة عنصر فرعي
                </button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); setEditingItem(null); }} dir="rtl">
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem?.id ? 'تعديل' : 'إضافة'} عنصر</DialogTitle>
          </DialogHeader>
          <NavForm item={editingItem || {}} onSave={handleSave} parentItems={topItems} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NavForm({ item, onSave, parentItems }: { item: any; onSave: (data: any) => void; parentItems: any[] }) {
  const [data, setData] = useState({ ...item });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(data); }} className="space-y-4">
      <div className="space-y-2">
        <Label>الاسم (عربي)</Label>
        <Input value={data.labelAr || ''} onChange={(e) => setData({ ...data, labelAr: e.target.value })} required />
      </div>
      <div className="space-y-2">
        <Label>الاسم (إنجليزي)</Label>
        <Input value={data.labelEn || ''} onChange={(e) => setData({ ...data, labelEn: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>الصفحة</Label>
        <Select value={data.page || ''} onValueChange={(v) => setData({ ...data, page: v })}>
          <SelectTrigger><SelectValue placeholder="اختر الصفحة" /></SelectTrigger>
          <SelectContent>
            {['home', 'about', 'services', 'offers', 'doctors', 'news', 'contact', 'jobs', 'booking', 'rating', 'cart', 'account'].map(p => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>العنصر الأب (اختياري)</Label>
        <Select value={data.parentId || 'none'} onValueChange={(v) => setData({ ...data, parentId: v === 'none' ? null : v })}>
          <SelectTrigger><SelectValue placeholder="بدون أب" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">بدون أب (عنصر رئيسي)</SelectItem>
            {parentItems.filter(p => p.id !== data.id).map(p => (
              <SelectItem key={p.id} value={p.id}>{p.labelAr}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>الترتيب</Label>
        <Input type="number" value={data.order || 0} onChange={(e) => setData({ ...data, order: parseInt(e.target.value) || 0 })} />
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={data.isActive ?? true} onCheckedChange={(v) => setData({ ...data, isActive: v })} />
        <Label>فعال</Label>
      </div>
      <DialogFooter>
        <Button type="submit" className="bg-[#6DB3D7] hover:bg-[#5DADE2]">حفظ</Button>
      </DialogFooter>
    </form>
  );
}
