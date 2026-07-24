'use client';

import CrudManager, { Column } from './CrudManager';

const columns: Column[] = [
  { key: 'nameAr', label: 'الاسم (عربي)' },
  { key: 'logo', label: 'الشعار', type: 'image' },
  { key: 'isActive', label: 'الحالة', type: 'switch' },
];

const fields = [
  { key: 'nameAr', label: 'الاسم (عربي)', type: 'text' as const },
  { key: 'nameEn', label: 'الاسم (إنجليزي)', type: 'text' as const },
  { key: 'logo', label: 'insurance', type: 'image' as const },
  { key: 'order', label: 'الترتيب', type: 'number' as const },
  { key: 'isActive', label: 'فعال', type: 'switch' as const },
];

export default function InsuranceManager() {
  return <CrudManager title="شركات التأمين" apiPath="/api/admin/insurance" columns={columns} fields={fields} />;
}
