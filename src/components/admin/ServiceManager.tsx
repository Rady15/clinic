'use client';

import { useEffect, useState } from 'react';
import CrudManager, { Column } from './CrudManager';

const columns: Column[] = [
  { key: 'nameAr', label: 'الاسم (عربي)' },
  { key: 'categoryId', label: 'التصنيف' },
  { key: 'price', label: 'السعر', type: 'price' },
  { key: 'image', label: 'الصورة', type: 'image' },
  { key: 'isOffer', label: 'عرض', type: 'badge' },
  { key: 'isFeatured', label: 'مميز', type: 'switch' },
  { key: 'isActive', label: 'الحالة', type: 'switch' },
];

export default function ServiceManager() {
  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    fetch('/api/admin/service-categories')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategoryOptions(data.map((c: any) => ({ label: c.nameAr, value: c.id })));
        }
      })
      .catch(() => {});
  }, []);

  const fields = [
    { key: 'nameAr', label: 'اسم الخدمة (عربي)', type: 'text' as const },
    { key: 'nameEn', label: 'اسم الخدمة (إنجليزي)', type: 'text' as const },
    { key: 'descriptionAr', label: 'الوصف (عربي)', type: 'textarea' as const },
    { key: 'descriptionEn', label: 'الوصف (إنجليزي)', type: 'textarea' as const },
    { key: 'price', label: 'السعر', type: 'number' as const },
    { key: 'originalPrice', label: 'السعر الأصلي', type: 'number' as const },
    { key: 'image', label: 'service', type: 'image' as const },
    { key: 'badge', label: 'الشارة', type: 'text' as const, placeholder: '-50%' },
    { key: 'isOffer', label: 'عرض خاص', type: 'switch' as const },
    { key: 'isFeatured', label: 'مميز', type: 'switch' as const },
    { key: 'isActive', label: 'فعال', type: 'switch' as const },
    { key: 'categoryId', label: 'التصنيف', type: 'select' as const, options: categoryOptions },
    { key: 'subcategoryAr', label: 'التصنيف الفرعي (عربي)', type: 'text' as const },
    { key: 'subcategoryEn', label: 'التصنيف الفرعي (إنجليزي)', type: 'text' as const },
    { key: 'order', label: 'الترتيب', type: 'number' as const },
  ];

  return <CrudManager title="الخدمات" apiPath="/api/admin/services" columns={columns} fields={fields} />;
}
