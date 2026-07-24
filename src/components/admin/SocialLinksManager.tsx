'use client';

import CrudManager, { Column } from './CrudManager';

const columns: Column[] = [
  { key: 'platform', label: 'المنصة' },
  { key: 'url', label: 'الرابط' },
  { key: 'isActive', label: 'الحالة', type: 'switch' },
];

const fields = [
  { key: 'platform', label: 'المنصة', type: 'text' as const, placeholder: 'whatsapp, instagram, etc.' },
  { key: 'url', label: 'الرابط', type: 'text' as const },
  { key: 'icon', label: 'الأيقونة', type: 'text' as const },
  { key: 'order', label: 'الترتيب', type: 'number' as const },
  { key: 'isActive', label: 'فعال', type: 'switch' as const },
];

export default function SocialLinksManager() {
  return <CrudManager title="روابط التواصل" apiPath="/api/admin/social-links" columns={columns} fields={fields} />;
}
