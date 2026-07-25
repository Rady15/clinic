'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, RefreshCw, Upload, Search } from 'lucide-react';

export interface Column {
  key: string;
  label: string;
  type?: 'text' | 'image' | 'badge' | 'switch' | 'number' | 'price';
}

interface CrudManagerProps {
  title: string;
  apiPath: string;
  columns: Column[];
  fields: FieldConfig[];
  transformData?: (data: any) => any;
  renderActions?: (item: any, onEdit: (item: any) => void, onDelete: (id: string) => void) => React.ReactNode;
}

interface FieldConfig {
  key: string;
  label: string;
  labelEn?: string;
  type: 'text' | 'textarea' | 'number' | 'image' | 'select' | 'switch' | 'json';
  placeholder?: string;
  placeholderEn?: string;
  options?: { label: string; value: string }[];
}

function ImageUploader({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', label);

      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `خطأ في الرفع (${res.status})`);
      }

      if (data.url) {
        onChange(data.url);
      } else {
        throw new Error('لم يتم إرجاع رابط الصورة');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'خطأ غير معروف';
      console.error('Upload error:', err);
      setError(msg);
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-3">
        {value && (
          <img src={value} alt="" className="w-16 h-16 object-cover rounded-lg border" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        <Button type="button" variant="outline" size="sm" disabled={uploading} className="gap-1" onClick={() => inputRef.current?.click()}>
          <Upload className="h-3 w-3" />
          {uploading ? 'جاري الرفع...' : 'رفع صورة'}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange('')}>
            حذف
          </Button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{error}</p>
      )}
      <input type="hidden" value={value} />
    </div>
  );
}

function DualField({ field, value, onChange }: { field: FieldConfig; value: any; onChange: (v: any) => void }) {
  const arKey = field.key;
  const enKey = field.key.replace('Ar', 'En');
  const arValue = typeof value === 'object' ? value?.[arKey] ?? '' : value;
  const enValue = typeof value === 'object' ? value?.[enKey] ?? '' : '';

  if (field.key.endsWith('En')) return null; // Skip English keys, handled by dual

  return (
    <Tabs defaultValue="ar" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="ar" className="flex-1">عربي</TabsTrigger>
        <TabsTrigger value="en" className="flex-1">English</TabsTrigger>
      </TabsList>
      <TabsContent value="ar">
        {field.type === 'textarea' ? (
          <Textarea value={arValue} onChange={(e) => onChange({ [arKey]: e.target.value })} placeholder={field.placeholder} rows={3} />
        ) : (
          <Input value={arValue} onChange={(e) => onChange({ [arKey]: e.target.value })} placeholder={field.placeholder} />
        )}
      </TabsContent>
      <TabsContent value="en">
        {field.type === 'textarea' ? (
          <Textarea value={enValue} onChange={(e) => onChange({ [enKey]: e.target.value })} placeholder={field.placeholderEn || field.placeholder} rows={3} />
        ) : (
          <Input value={enValue} onChange={(e) => onChange({ [enKey]: e.target.value })} placeholder={field.placeholderEn || field.placeholder} />
        )}
      </TabsContent>
    </Tabs>
  );
}

export default function CrudManager({ title, apiPath, columns, fields, transformData, renderActions }: CrudManagerProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiPath);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log(`Loaded ${apiPath} data:`, data);
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(`Error loading ${apiPath}:`, error);
      toast({ title: 'خطأ في تحميل البيانات', description: error instanceof Error ? error.message : 'خطأ غير معروف', variant: 'destructive' });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [apiPath, toast]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async (data: any) => {
    try {
      const url = editingItem ? apiPath : apiPath;
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem ? { ...data, id: editingItem.id } : data;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await res.json();

      if (res.ok) {
        toast({ title: editingItem ? 'تم التحديث بنجاح' : 'تم الإنشاء بنجاح' });
        setDialogOpen(false);
        setEditingItem(null);
        loadData();
      } else {
        toast({ title: 'خطأ', description: result.error || 'حدث خطأ', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطأ في الحفظ', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${apiPath}?id=${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'تم الحذف بنجاح' });
        loadData();
      } else {
        toast({ title: 'خطأ في الحذف', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطأ في الحذف', variant: 'destructive' });
    }
    setDeleteId(null);
  };

  const filteredItems = items.filter((item) => {
    if (!search) return true;
    return columns.some((col) => {
      const val = item[col.key];
      return val && String(val).toLowerCase().includes(search.toLowerCase());
    });
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="بحث..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 w-48"
            />
          </div>
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => { setEditingItem(null); setDialogOpen(true); }} className="bg-[#6DB3D7] hover:bg-[#5DADE2] gap-1" size="sm">
            <Plus className="h-4 w-4" />
            إضافة
          </Button>
        </div>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-right p-3 text-gray-600 font-medium">#</th>
                  {columns.map((col) => (
                    <th key={col.key} className="text-right p-3 text-gray-600 font-medium">{col.label}</th>
                  ))}
                  <th className="text-right p-3 text-gray-600 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 2} className="text-center p-8 text-gray-400">
                      {loading ? 'جاري التحميل...' : 'لا توجد بيانات'}
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 text-gray-400">{idx + 1}</td>
                      {columns.map((col) => (
                        <td key={col.key} className="p-3">
                          {col.type === 'image' && item[col.key] ? (
                            <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                              <img 
                                src={item[col.key]} 
                                alt="" 
                                className="w-full h-full object-cover" 
                                onError={(e) => { 
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-off"><path d="m21 21-6-6m-5.5-5.5-4-4"/><path d="M4 16.5V21h4.5l9.5-9.5-4.5-4.5L4 16.5Z"/><path d="M17.5 6.5 13 2"/></svg>';
                                  }
                                }} 
                              />
                            </div>
                          ) : col.type === 'switch' ? (
                            <Badge variant={item[col.key] ? 'default' : 'secondary'}>
                              {item[col.key] ? 'فعال' : 'معطل'}
                            </Badge>
                          ) : col.type === 'price' ? (
                            <span className="font-medium">{item[col.key]} ﷼</span>
                          ) : col.type === 'badge' ? (
                            <Badge variant="outline">{item[col.key]}</Badge>
                          ) : (
                            <span className="text-gray-700 max-w-[200px] truncate block">{item[col.key]}</span>
                          )}
                        </td>
                      ))}
                      <td className="p-3">
                        {renderActions ? (
                          renderActions(item, (i) => { setEditingItem(i); setDialogOpen(true); }, () => setDeleteId(item.id))
                        ) : (
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); setDialogOpen(true); }}>
                              <Pencil className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setDeleteId(item.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingItem(null); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'تعديل' : 'إضافة'} {title}</DialogTitle>
          </DialogHeader>
          <ItemForm
            fields={fields}
            initialData={editingItem || transformData?.(null) || {}}
            onSave={handleSave}
            loading={loading}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ItemForm({ fields, initialData, onSave, loading }: { fields: FieldConfig[]; initialData: Record<string, any>; onSave: (data: any) => void; loading: boolean }) {
  const [data, setData] = useState<Record<string, any>>({ ...initialData });

  const updateField = (key: string, value: any) => {
    setData((prev) => {
      // إذا كان المفتاح يحتوي على كائنة (مثل في الحالة ثنائية اللغة)
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return { ...prev, ...value };
      }
      // إذا كان قيمة عادية
      return { ...prev, [key]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          {field.type === 'image' ? (
            <ImageUploader
              value={data[field.key] || ''}
              onChange={(v) => updateField(field.key, v)}
              label={field.label}
            />
          ) : field.type === 'switch' ? (
            <div className="space-y-2">
              <Label>{field.label}</Label>
              <div className="flex items-center gap-3">
                <Switch
                  checked={data[field.key] ?? false}
                  onCheckedChange={(v) => updateField(field.key, v)}
                />
                <span className="text-sm text-gray-600">
                  {data[field.key] ? 'فعال' : 'معطل'}
                </span>
              </div>
            </div>
          ) : field.type === 'select' ? (
            <div className="space-y-1">
              <Label>{field.label}</Label>
              <Select value={data[field.key] || ''} onValueChange={(v) => updateField(field.key, v)}>
                <SelectTrigger><SelectValue placeholder="اختر..." /></SelectTrigger>
                <SelectContent>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : field.type === 'json' ? (
            <div className="space-y-1">
              <Label>{field.label}</Label>
              <Textarea
                value={typeof data[field.key] === 'string' ? data[field.key] : JSON.stringify(data[field.key] || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateField(field.key, parsed);
                  } catch {
                    updateField(field.key, e.target.value);
                  }
                }}
                rows={3}
              />
            </div>
          ) : field.key.endsWith('Ar') ? (
            <DualField field={field} value={data} onChange={(v) => updateField(field.key, v)} />
          ) : field.key.endsWith('En') ? null : (
            <div className="space-y-1">
              <Label>{field.label}</Label>
              {field.type === 'textarea' ? (
                <Textarea value={data[field.key] || ''} onChange={(e) => updateField(field.key, e.target.value)} placeholder={field.placeholder} rows={3} />
              ) : (
                <Input
                  type={field.type === 'number' ? 'number' : 'text'}
                  value={data[field.key] || ''}
                  onChange={(e) => updateField(field.key, field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          )}
        </div>
      ))}
      <DialogFooter>
        <Button type="submit" className="bg-[#6DB3D7] hover:bg-[#5DADE2]" disabled={loading}>
          {loading ? 'جاري الحفظ...' : 'حفظ'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export { ImageUploader, DualField };
