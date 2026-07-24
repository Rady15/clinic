'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/store/language-store';

export default function DirProvider({ children }: { children: React.ReactNode }) {
  const { locale, dir } = useLanguageStore();

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale, dir]);

  return <>{children}</>;
}
