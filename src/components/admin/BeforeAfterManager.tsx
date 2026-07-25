'use client';

import CrudManager, { Column } from './CrudManager';

const columns: Column[] = [
  { key: 'doctorNameAr', label: 'اسم الطبيب (عربي)' },
  { key: 'treatmentAr', label: 'العلاج' },
  { key: 'categoryAr', label: 'التصنيف' },
  { key: 'beforeImage', type: 'image', label: 'قبل' },
  { key: 'afterImage', type: 'image', label: 'بعد' },
  { key: 'dividerPosition', type: 'badge', label: 'موضع الفاصل' },
  { key: 'isActive', type: 'switch', label: 'الحالة' },
];

const fields = [
  { key: 'doctorNameAr', label: 'اسم الطبيب (عربي)', type: 'text' as const },
  { key: 'doctorNameEn', label: 'اسم الطبيب (إنجليزي)', type: 'text' as const },
  { key: 'treatmentAr', label: 'العلاج (عربي)', type: 'text' as const },
  { key: 'treatmentEn', label: 'العلاج (إنجليزي)', type: 'text' as const },
  { key: 'categoryAr', label: 'التصنيف (عربي)', type: 'text' as const },
  { key: 'categoryEn', label: 'التصنيف (إنجليزي)', type: 'text' as const },
  { key: 'branchAr', label: 'الفرع (عربي)', type: 'text' as const },
  { key: 'branchEn', label: 'الفرع (إنجليزي)', type: 'text' as const },
  { key: 'beforeImage', label: 'صورة قبل', type: 'image' as const },
  { key: 'afterImage', label: 'صورة بعد', type: 'image' as const },
  { key: 'dividerPosition', label: 'موضع الفاصل (%)', type: 'number' as const, placeholder: '50 (الافتراضي)' },
  { key: 'order', label: 'الترتيب', type: 'number' as const },
  { key: 'isActive', label: 'فعال', type: 'switch' as const },
];

export default function BeforeAfterManager() {
  return (
    <CrudManager
      title="قصص النجاح (قبل وبعد)"
      apiPath="/api/admin/before-after-cases"
      columns={columns}
      fields={fields}
    />
  );
}

