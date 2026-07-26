'use client';

import CrudManager, { Column } from './CrudManager';

const columns: Column[] = [
  { key: 'titleAr', label: 'العنوان (عربي)' },
  { key: 'image', label: 'الصورة', type: 'image' },
  { key: 'bgColor', label: 'لون الخلفية' },
  { key: 'order', label: 'الترتيب', type: 'number' },
  { key: 'isActive', label: 'الحالة', type: 'switch' },
];

const fields = [
  { key: 'titleAr', label: 'العنوان (عربي)', type: 'text' as const },
  { key: 'titleEn', label: 'العنوان (إنجليزي)', type: 'text' as const },
  { key: 'subtitleAr', label: 'العنوان الفرعي (عربي)', type: 'text' as const },
  { key: 'subtitleEn', label: 'العنوان الفرعي (إنجليزي)', type: 'text' as const },
  { key: 'descriptionAr', label: 'الوصف (عربي)', type: 'textarea' as const },
  { key: 'descriptionEn', label: 'الوصف (إنجليزي)', type: 'textarea' as const },
  { key: 'ctaTextAr', label: 'نص الزر الأساسي (عربي)', type: 'text' as const },
  { key: 'ctaTextEn', label: 'نص الزر الأساسي (إنجليزي)', type: 'text' as const },
  { key: 'ctaLink', label: 'رابط الزر الأساسي', type: 'text' as const },
  { key: 'ctaButtons', label: 'أزرار إضافية (JSON)\nمثال:\n[{"textAr":"احجز موعدك","textEn":"Book Now","link":"booking","icon":""}]', type: 'json' as const },
  { key: 'image', label: 'صورة البانر', type: 'image' as const },
  { key: 'bgColor', label: 'لون الخلفية', type: 'text' as const, placeholder: '#6DB3D7' },
  { key: 'order', label: 'الترتيب', type: 'number' as const },
  { key: 'isActive', label: 'فعال', type: 'switch' as const },
];

export default function BannerManager() {
  return <CrudManager title="البنرات" apiPath="/api/admin/banners" columns={columns} fields={fields} />;
}
