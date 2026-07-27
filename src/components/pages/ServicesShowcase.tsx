'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';
import { Stethoscope, ArrowRight, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CategoryData {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  icon: string;
  image: string;
  order: number;
  isActive: boolean;
}

export default function ServicesShowcase({ categories }: { categories: CategoryData[] }) {
  const { setCurrentPage } = useNavigationStore();
  const { locale } = useLanguageStore();
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true, margin: '-100px' });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    if (!sectionRef.current || !scrollContainerRef.current) return;

    const section = sectionRef.current;
    const scroller = scrollContainerRef.current;
    const totalScroll = scroller.scrollWidth - scroller.clientWidth;

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${totalScroll}`,
      pin: true,
      scrub: 1,
      animation: gsap.to(scroller, {
        scrollLeft: totalScroll,
        ease: 'none',
      }),
      invalidateOnRefresh: true,
    });

    return () => {
      st.kill();
    };
  }, [categories]);

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    updateScrollButtons();
    return () => el.removeEventListener('scroll', updateScrollButtons);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const amount = 380;
    scrollContainerRef.current.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#1a2744] to-[#0d1f3c]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      {/* Floating glow orbs */}
      <div className="absolute top-20 left-[10%] w-96 h-96 bg-[#6DB3D7]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-[#5DADE2]/8 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-8">
        {/* Title */}
        <div ref={titleRef} className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-12 h-[2px] bg-[#6DB3D7]" />
              <span className="text-[#6DB3D7] font-semibold text-sm tracking-widest uppercase">
                {locale === 'en' ? 'Our Specialties' : 'تخصصاتنا'}
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              {locale === 'en' ? 'Explore Our' : 'استكشف'}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6DB3D7] to-[#85C1E9]">
                {locale === 'en' ? 'Medical Services' : 'خدماتنا الطبية'}
              </span>
            </motion.h2>
          </div>

          {/* Navigation arrows */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-transparent"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-transparent"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-20 px-4 md:px-[max(1rem,calc((100vw-80rem)/2+1rem))] scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat, index) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            className="group relative flex-shrink-0 w-[300px] md:w-[340px] lg:w-[380px] cursor-pointer"
            style={{ scrollSnapAlign: 'start' }}
            onClick={() => setCurrentPage('services', { category: cat.slug })}
          >
            {/* Card */}
            <div className="relative h-[440px] md:h-[480px] rounded-3xl overflow-hidden">
              {/* Image */}
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={locale === 'en' ? cat.nameEn : cat.nameAr}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1B4F72] to-[#2E86C1] flex items-center justify-center">
                  <Stethoscope className="w-24 h-24 text-white/20" />
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-[#6DB3D7]/0 group-hover:bg-[#6DB3D7]/10 transition-colors duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                {/* Number tag */}
                <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 text-sm font-bold border border-white/10">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#6DB3D7]/20 backdrop-blur-md flex items-center justify-center mb-4 border border-[#6DB3D7]/30 group-hover:bg-[#6DB3D7]/40 transition-all duration-500 group-hover:scale-110">
                  <Stethoscope className="w-7 h-7 text-[#85C1E9]" />
                </div>

                {/* Name */}
                <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                  {locale === 'en' ? cat.nameEn : cat.nameAr}
                </h3>

                {/* Divider */}
                <div className="w-12 h-[2px] bg-[#6DB3D7] mb-4 transition-all duration-500 group-hover:w-20" />

                {/* CTA */}
                <div className="flex items-center gap-2 text-[#85C1E9] font-semibold text-sm group-hover:text-white transition-colors">
                  <span>{locale === 'en' ? 'View Services' : 'عرض الخدمات'}</span>
                  <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-2" />
                </div>
              </div>

              {/* Border glow on hover */}
              <div className="absolute inset-0 rounded-3xl border border-white/0 group-hover:border-white/20 transition-all duration-500" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scroll hint gradient fade */}
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#0d1f3c] to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#0d1f3c] to-transparent pointer-events-none z-10" />
    </section>
  );
}
