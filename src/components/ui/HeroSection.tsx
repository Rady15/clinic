'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';

interface HeroSectionProps {
  titleKey?: string;
  title?: string;
  pageKey: string;
}

export default function HeroSection({ titleKey, title, pageKey }: HeroSectionProps) {
  const { setCurrentPage } = useNavigationStore();
  const { locale } = useLanguageStore();
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    fetch('/api/public/settings')
      .then(r => r.json())
      .then((data: Record<string, string>) => {
        const img = data[`${pageKey}_hero_image`];
        if (img) setBgImage(img);
      })
      .catch(() => {});
  }, [pageKey]);

  const displayTitle = title || (titleKey ? t(titleKey, locale) : '');

  return (
    <section
      className="relative py-16 overflow-hidden"
      style={!bgImage ? { background: 'linear-gradient(to right, #6DB3D7, #5DADE2)' } : undefined}
    >
      {bgImage && (
        <>
          <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#6DB3D7]/80 to-[#5DADE2]/60" />
        </>
      )}
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-4"
        >
          {displayTitle}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 text-white/80"
        >
          <button onClick={() => setCurrentPage('home')} className="hover:text-white">
            {t('nav.home', locale)}
          </button>
          <span>/</span>
          <span>{displayTitle}</span>
        </motion.div>
      </div>
    </section>
  );
}
