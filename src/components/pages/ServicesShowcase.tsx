'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { useLanguageStore } from '@/store/language-store';
import { Stethoscope, ArrowLeft } from 'lucide-react';

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
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true, margin: '-80px' });

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#1a2744] to-[#0d1f3c]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      {/* Glow orbs */}
      <div className="absolute top-20 left-[10%] w-96 h-96 bg-[#6DB3D7]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-[#5DADE2]/8 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-24">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-12 h-[2px] bg-[#6DB3D7]" />
            <span className="text-[#6DB3D7] font-semibold text-sm tracking-widest uppercase">
              {locale === 'en' ? 'Our Specialties' : 'تخصصاتنا'}
            </span>
            <div className="w-12 h-[2px] bg-[#6DB3D7]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
          >
            {locale === 'en' ? 'Explore Our' : 'استكشف'}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6DB3D7] to-[#85C1E9]">
              {' '}{locale === 'en' ? 'Medical Services' : 'خدماتنا الطبية'}
            </span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className="group relative cursor-pointer"
              onClick={() => setCurrentPage('services', { category: cat.slug })}
            >
              <div className="relative h-[360px] md:h-[400px] rounded-3xl overflow-hidden">
                {/* Image */}
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={locale === 'en' ? cat.nameEn : cat.nameAr}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1B4F72] to-[#2E86C1] flex items-center justify-center">
                    <Stethoscope className="w-20 h-20 text-white/20" />
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Hover glow */}
                <div className="absolute inset-0 bg-[#6DB3D7]/0 group-hover:bg-[#6DB3D7]/10 transition-colors duration-500" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-7">
                  {/* Number */}
                  <div className="absolute top-5 left-5 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/60 text-xs font-bold border border-white/10">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#6DB3D7]/20 backdrop-blur-md flex items-center justify-center mb-3 border border-[#6DB3D7]/30 group-hover:bg-[#6DB3D7]/40 transition-all duration-500 group-hover:scale-110">
                    <Stethoscope className="w-6 h-6 text-[#85C1E9]" />
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                    {locale === 'en' ? cat.nameEn : cat.nameAr}
                  </h3>

                  {/* Divider */}
                  <div className="w-10 h-[2px] bg-[#6DB3D7] mb-3 transition-all duration-500 group-hover:w-16" />

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-[#85C1E9] font-semibold text-sm group-hover:text-white transition-colors">
                    <span>{locale === 'en' ? 'View Services' : 'عرض الخدمات'}</span>
                    <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-2" />
                  </div>
                </div>

                {/* Border on hover */}
                <div className="absolute inset-0 rounded-3xl border border-white/0 group-hover:border-white/20 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
