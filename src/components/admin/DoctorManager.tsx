'use client';

import CrudManager, { Column } from './CrudManager';

const columns: Column[] = [
  { key: 'nameAr', label: 'الاسم (عربي)' },
  { key: 'specialtyAr', label: 'التخصص' },
  { key: 'departmentAr', label: 'القسم' },
  { key: 'image', label: 'الصورة', type: 'image' },
  { key: 'isActive', label: 'الحالة', type: 'switch' },
];

const fields = [
  { key: 'nameAr', label: 'الاسم (عربي)', type: 'text' as const },
  { key: 'nameEn', label: 'الاسم (إنجليزي)', type: 'text' as const },
  { key: 'specialtyAr', label: 'التخصص (عربي)', type: 'text' as const },
  { key: 'specialtyEn', label: 'التخصص (إنجليزي)', type: 'text' as const },
  { key: 'experienceAr', label: 'الخبرة (عربي)', type: 'text' as const },
  { key: 'experienceEn', label: 'الخبرة (إنجليزي)', type: 'text' as const },
  { key: 'departmentAr', label: 'القسم (عربي)', type: 'text' as const },
  { key: 'departmentEn', label: 'القسم (إنجليزي)', type: 'text' as const },
  { key: 'image', label: 'doctor', type: 'image' as const },
  { key: 'order', label: 'الترتيب', type: 'number' as const },
  { key: 'isActive', label: 'فعال', type: 'switch' as const },
];

export default function DoctorManager() {
  return <CrudManager title="الأطباء" apiPath="/api/admin/doctors" columns={columns} fields={fields} />;
}
