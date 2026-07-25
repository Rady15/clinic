'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BeforeAfterSlider from '@/components/ui/before-after-slider';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';

interface BeforeAfterCase {
  id: string;
  doctorNameAr: string;
  doctorNameEn: string;
  treatmentAr: string;
  treatmentEn: string;
  categoryAr: string;
  categoryEn: string;
  branchAr: string;
  branchEn: string;
  beforeImage: string;
  afterImage: string;
  dividerPosition: number;
  order: number;
  isActive: boolean;
}

export default function BeforeAfterSection() {
  const [cases, setCases] = useState<BeforeAfterCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [inView, setInView] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { locale } = useLanguageStore();
  const isRtl = locale === 'ar';

  useEffect(() => {
    fetch('/api/public/before-after-cases')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setCases(Array.isArray(data) ? data : []))
      .catch(() => setCases([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loading]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.offsetWidth * 0.75;
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  const text = (key: string) => t(key, locale);

  if (loading) {
    return (
      <section
        ref={sectionRef}
        className="py-20 bg-gradient-to-b from-white to-[#F8FAFC]"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="h-6 w-20 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse" />
            <div className="h-10 w-64 bg-gray-200 rounded-lg mx-auto mb-3 animate-pulse" />
            <div className="h-5 w-96 max-w-full bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-[24px] aspect-[4/3]" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded mx-auto" />
                  <div className="h-5 w-40 bg-gray-200 rounded mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (cases.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-white to-[#F8FAFC] overflow-hidden"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-[#EBF5FB] text-[#6DB3D7] text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide">
            {text('beforeAfter.badge')}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50] mb-4 leading-tight">
            {text('beforeAfter.title')}
          </h2>
          <p className="text-[#7F8C8D] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {text('beforeAfter.subtitle')}
          </p>
        </motion.div>

        <div className="relative group/section">
          <button
            onClick={() => scroll(isRtl ? 'right' : 'left')}
            className="absolute start-0 top-1/2 -translate-y-1/2 -translate-x-3 w-11 h-11 bg-white rounded-full shadow-lg items-center justify-center text-[#6DB3D7] hover:bg-[#6DB3D7] hover:text-white transition-all duration-200 z-10 hidden md:flex opacity-0 group-hover/section:opacity-100"
            aria-label="Previous"
          >
            {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          <button
            onClick={() => scroll(isRtl ? 'left' : 'right')}
            className="absolute end-0 top-1/2 -translate-y-1/2 translate-x-3 w-11 h-11 bg-white rounded-full shadow-lg items-center justify-center text-[#6DB3D7] hover:bg-[#6DB3D7] hover:text-white transition-all duration-200 z-10 hidden md:flex opacity-0 group-hover/section:opacity-100"
            aria-label="Next"
          >
            {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {cases.map((item, index) => (
              <motion.div
                key={item.id}
                className="flex-none w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] snap-start"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="group cursor-pointer transition-all duration-[450ms] ease-out hover:-translate-y-1.5">
                  <BeforeAfterSlider
                    beforeImage={item.beforeImage}
                    afterImage={item.afterImage}
                    initialPosition={item.dividerPosition || 50}
                    locale={locale}
                    className="transition-all duration-[450ms] group-hover:brightness-[1.05] shadow-sm group-hover:shadow-[0_20px_60px_-15px_rgba(109,179,215,0.25)]"
                  />
                  <div className="mt-5 text-center px-2">
                    <span className="inline-block bg-[#EBF5FB] text-[#6DB3D7] text-xs font-semibold px-3 py-1 rounded-full mb-2">
                      {locale === 'en' ? item.categoryEn : item.categoryAr}
                    </span>
                    <h3 className="font-bold text-[#2C3E50] text-base md:text-lg leading-tight mb-1">
                      {locale === 'en' ? item.treatmentEn : item.treatmentAr}
                    </h3>
                    <p className="text-sm text-[#7F8C8D]">
                      {locale === 'en' ? item.doctorNameEn : item.doctorNameAr}
                    </p>
                    {(item.branchAr || item.branchEn) && (
                      <p className="text-xs text-[#95A5A6] mt-0.5">
                        {locale === 'en' ? item.branchEn : item.branchAr}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
