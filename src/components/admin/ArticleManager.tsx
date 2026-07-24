'use client';

import CrudManager, { Column } from './CrudManager';

const columns: Column[] = [
  { key: 'titleAr', label: 'العنوان (عربي)' },
  { key: 'author', label: 'الكاتب' },
  { key: 'tagAr', label: 'التصنيف' },
  { key: 'readTime', label: 'وقت القراءة' },
  { key: 'image', label: 'الصورة', type: 'image' },
  { key: 'isActive', label: 'الحالة', type: 'switch' },
];

const fields = [
  { key: 'titleAr', label: 'العنوان (عربي)', type: 'text' as const },
  { key: 'titleEn', label: 'العنوان (إنجليزي)', type: 'text' as const },
  { key: 'excerptAr', label: 'المقتطف (عربي)', type: 'textarea' as const },
  { key: 'excerptEn', label: 'المقتطف (إنجليزي)', type: 'textarea' as const },
  { key: 'contentAr', label: 'المحتوى (عربي)', type: 'textarea' as const },
  { key: 'contentEn', label: 'المحتوى (إنجليزي)', type: 'textarea' as const },
  { key: 'image', label: 'article', type: 'image' as const },
  { key: 'tagAr', label: 'التصنيف (عربي)', type: 'text' as const },
  { key: 'tagEn', label: 'التصنيف (إنجليزي)', type: 'text' as const },
  { key: 'author', label: 'الكاتب', type: 'text' as const },
  { key: 'readTime', label: 'وقت القراءة', type: 'text' as const, placeholder: '5 دقائق' },
  { key: 'isActive', label: 'فعال', type: 'switch' as const },
];

export default function ArticleManager() {
  return <CrudManager title="المقالات" apiPath="/api/admin/articles" columns={columns} fields={fields} />;
}
