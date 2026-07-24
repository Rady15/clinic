'use client';

import CrudManager, { Column } from './CrudManager';
import { Star } from 'lucide-react';

const columns: Column[] = [
  { key: 'nameAr', label: 'الاسم (عربي)' },
  { key: 'textAr', label: 'النص' },
  { key: 'rating', label: 'التقييم' },
  { key: 'isActive', label: 'الحالة', type: 'switch' },
];

const fields = [
  { key: 'nameAr', label: 'الاسم (عربي)', type: 'text' as const },
  { key: 'nameEn', label: 'الاسم (إنجليزي)', type: 'text' as const },
  { key: 'textAr', label: 'النص (عربي)', type: 'textarea' as const },
  { key: 'textEn', label: 'النص (إنجليزي)', type: 'textarea' as const },
  { key: 'rating', label: 'التقييم (1-5)', type: 'number' as const },
  { key: 'order', label: 'الترتيب', type: 'number' as const },
  { key: 'isActive', label: 'فعال', type: 'switch' as const },
];

export default function TestimonialManager() {
  return (
    <CrudManager
      title="آراء العملاء"
      apiPath="/api/admin/testimonials"
      columns={columns}
      fields={fields}
      renderActions={(item, onEdit, onDelete) => (
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(item)} className="p-1.5 hover:bg-gray-100 rounded">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          </button>
          <button onClick={onEdit} className="p-1.5 hover:bg-gray-100 rounded">
            ✏️
          </button>
          <button onClick={onDelete} className="p-1.5 hover:bg-red-50 rounded">
            🗑️
          </button>
        </div>
      )}
    />
  );
}
