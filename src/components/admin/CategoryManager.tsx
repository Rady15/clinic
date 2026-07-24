'use client';

import CrudManager, { Column } from './CrudManager';

const columns: Column[] = [
  { key: 'nameAr', label: 'الاسم (عربي)' },
  { key: 'slug', label: 'المعرف' },
  { key: 'icon', label: 'الأيقونة' },
  { key: 'image', label: 'الصورة', type: 'image' },
  { key: 'isActive', label: 'الحالة', type: 'switch' },
];

const fields = [
  { key: 'nameAr', label: 'الاسم (عربي)', type: 'text' as const },
  { key: 'nameEn', label: 'الاسم (إنجليزي)', type: 'text' as const },
  { key: 'slug', label: 'المعرف (slug)', type: 'text' as const },
  { key: 'icon', label: 'الأيقونة', type: 'text' as const },
  { key: 'image', label: 'category', type: 'image' as const },
  { key: 'order', label: 'الترتيب', type: 'number' as const },
  { key: 'isActive', label: 'فعال', type: 'switch' as const },
];

export default function CategoryManager() {
  return <CrudManager title="تصنيفات الخدمات" apiPath="/api/admin/service-categories" columns={columns} fields={fields} />;
}
