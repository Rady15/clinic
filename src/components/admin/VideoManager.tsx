'use client';

import CrudManager, { Column } from './CrudManager';

const columns: Column[] = [
  { key: 'titleAr', label: 'العنوان (عربي)' },
  { key: 'thumbnail', label: 'الصورة المصغرة', type: 'image' },
  { key: 'videoUrl', label: 'رابط الفيديو' },
  { key: 'isActive', label: 'الحالة', type: 'switch' },
];

const fields = [
  { key: 'titleAr', label: 'العنوان (عربي)', type: 'text' as const },
  { key: 'titleEn', label: 'العنوان (إنجليزي)', type: 'text' as const },
  { key: 'thumbnail', label: 'video', type: 'image' as const },
  { key: 'videoUrl', label: 'رابط الفيديو (YouTube embed URL)', type: 'text' as const },
  { key: 'order', label: 'الترتيب', type: 'number' as const },
  { key: 'isActive', label: 'فعال', type: 'switch' as const },
];

export default function VideoManager() {
  return <CrudManager title="الفيديوهات" apiPath="/api/admin/videos" columns={columns} fields={fields} />;
}
