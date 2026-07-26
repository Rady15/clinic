'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { useCartStore } from '@/store/cart-store';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';
import CurrencySymbol from '@/components/ui/currency-symbol';
import { FadeIn, ScaleIn, StaggerContainer, ParallaxMouse, TiltCard, MagneticButton } from '@/components/ui/animated';
import {
  Stethoscope, ChevronLeft, ChevronRight, Star, Clock, ArrowLeft, Play, Shield, ArrowRight,
  ShoppingCart, Heart, Sparkles
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import BeforeAfterSection from '@/components/pages/BeforeAfterSection';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface BannerData {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  ctaTextAr: string;
  ctaTextEn: string;
  ctaLink: string;
  ctaButtons: { textAr: string; textEn: string; link: string; icon: string }[] | null;
  image: string;
  bgColor: string;
  order: number;
  isActive: boolean;
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

interface ServiceData {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  originalPrice: number | null;
  image: string;
  badge: string;
  isOffer: boolean;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string;
  subcategoryAr: string;
  subcategoryEn: string;
  category?: { nameAr: string; nameEn: string };
}

interface DoctorData {
  id: string;
  nameAr: string;
  nameEn: string;
  specialtyAr: string;
  specialtyEn: string;
  experienceAr: string;
  experienceEn: string;
  departmentAr: string;
  departmentEn: string;
  image: string;
  order: number;
  isActive: boolean;
}

interface TestimonialData {
  id: string;
  nameAr: string;
  nameEn: string;
  textAr: string;
  textEn: string;
  rating: number;
  order: number;
}

interface VideoData {
  id: string;
  titleAr: string;
  titleEn: string;
  thumbnail: string;
  videoUrl: string;
  order: number;
  isActive: boolean;
}

interface ArticleData {
  id: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  image: string;
  tagAr: string;
  tagEn: string;
  author: string;
  readTime: string;
  isActive: boolean;
}

interface InsuranceData {
  id: string;
  nameAr: string;
  nameEn: string;
  logo: string;
  order: number;
}

interface CtaBannerConfig {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  bgColor: string;
  buttons: { textAr: string; textEn: string; link: string; icon: string }[];
  isActive: boolean;
}

interface ImageBannerData {
  id: string;
  image: string;
  position: string;
  fullWidth: boolean;
  ctaEnabled: boolean;
  ctaTextAr: string;
  ctaTextEn: string;
  ctaLink: string;
  order: number;
  isActive: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Stethoscope,
};

function ImagePlaceholder({ className = '' }: { className?: string }) {
  return <div className={`bg-gradient-to-br from-[#EBF5FB] to-[#6DB3D7]/20 flex items-center justify-center ${className}`}>
    <Stethoscope className="w-12 h-12 text-[#6DB3D7]/40" />
  </div>;
}

export default function HomePage() {
  const { setCurrentPage } = useNavigationStore();
  const addItem = useCartStore(s => s.addItem);
  const { locale } = useLanguageStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentDoctorSlide, setCurrentDoctorSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [insurance, setInsurance] = useState<InsuranceData[]>([]);
  const [workingHoursText, setWorkingHoursText] = useState('');
  const [ctaBanner, setCtaBanner] = useState<CtaBannerConfig | null>(null);
  const [imageBanners, setImageBanners] = useState<ImageBannerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/public/banners').then(r => r.json()).catch(() => []),
      fetch('/api/public/service-categories').then(r => r.json()).catch(() => []),
      fetch('/api/public/services?featured=true').then(r => r.json()).catch(() => []),
      fetch('/api/public/doctors').then(r => r.json()).catch(() => []),
      fetch('/api/public/testimonials').then(r => r.json()).catch(() => []),
      fetch('/api/public/videos').then(r => r.json()).catch(() => []),
      fetch('/api/public/articles').then(r => r.json()).catch(() => []),
      fetch('/api/public/insurance').then(r => r.json()).catch(() => []),
      fetch('/api/public/settings').then(r => r.json()).catch(() => []),
    ]).then(([bData, catData, servData, docData, testiData, vidData, artData, insData, settData]) => {
      setBanners((bData || []).filter((b: BannerData) => b.isActive !== false).sort((a: BannerData, b: BannerData) => a.order - b.order));
      setCategories((catData || []).filter((c: CategoryData) => c.isActive !== false).sort((a: CategoryData, b: CategoryData) => a.order - b.order));
      setServices((servData || []).filter((s: ServiceData) => s.isActive !== false));
      setDoctors((docData || []).filter((d: DoctorData) => d.isActive !== false).sort((a: DoctorData, b: DoctorData) => a.order - b.order));
      setTestimonials((testiData || []).sort((a: TestimonialData, b: TestimonialData) => a.order - b.order));
      setVideos((vidData || []).filter((v: VideoData) => v.isActive !== false).sort((a: VideoData, b: VideoData) => a.order - b.order));
      setArticles((artData || []).filter((a: ArticleData) => a.isActive !== false));
      setInsurance((insData || []).filter((i: InsuranceData) => i.isActive !== false).sort((a: InsuranceData, b: InsuranceData) => a.order - b.order));
      const sett = settData as Record<string, string> | undefined;
      if (sett?.workingHours) setWorkingHoursText(sett.workingHours);
      if (sett?.cta_banner) {
        try {
          const parsed = JSON.parse(sett.cta_banner);
          if (parsed.isActive !== false) setCtaBanner(parsed);
        } catch {}
      }
      if (sett?.home_image_banners) {
        try {
          const parsed = JSON.parse(sett.home_image_banners);
          setImageBanners(parsed.filter((b: ImageBannerData) => b.isActive !== false));
        } catch {}
      }
      setLoading(false);
    });
  }, []);

  // GSAP ScrollTrigger parallax for hero
  useEffect(() => {
    if (loading) return;
    const heroEl = document.querySelector('.hero-section');
    if (!heroEl) return;

    const ctx = gsap.context(() => {
      gsap.to('.hero-section', {
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        y: 100,
        opacity: 0.6,
      });
    }, heroEl);

    return () => ctx.revert();
  }, [loading]);

  const nextSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentSlide(p => (p + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentSlide(p => (p - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length, nextSlide]);

  const featuredServices = services.slice(0, 6);
  const displayDoctors = doctors.slice(0, 10);
  const doctorsPerSlide = 5;
  const maxDoctorSlide = Math.ceil(displayDoctors.length / doctorsPerSlide) - 1;

  const renderImageBanners = (position: string) => {
    const matching = imageBanners.filter(b => b.position === position).sort((a, b) => a.order - b.order);
    if (matching.length === 0) return null;
    return matching.map((banner) => (
      <div key={banner.id} className={`${banner.fullWidth ? '' : 'max-w-7xl mx-auto px-4'} my-6`}>
        <div className="relative rounded-2xl overflow-hidden group">
          <img src={banner.image} alt="" className="w-full h-auto object-cover max-h-[400px]" />
          {banner.ctaEnabled && (
            <button
              onClick={() => setCurrentPage(banner.ctaLink as any || 'booking')}
              className="absolute bottom-6 right-6 bg-white/90 px-6 py-3 rounded-xl font-bold text-[#2C3E50] hover:bg-white transition-colors backdrop-blur-sm text-sm"
            >
              {locale === 'ar' ? banner.ctaTextAr : banner.ctaTextEn}
            </button>
          )}
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <main>
        <Skeleton className="h-[500px] w-full bg-gray-200" />
        <Skeleton className="h-12 w-full bg-gray-200" />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <Skeleton className="h-8 w-48 mx-auto mb-10 bg-gray-200" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl bg-gray-200" />)}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Hero Slider */}
      <section className="hero-section relative h-[500px] md:h-[600px] overflow-hidden">
        {banners.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <ParallaxMouse strength={15} className="absolute inset-0">
                {banners[currentSlide]?.image ? (
                  <img src={banners[currentSlide].image} alt="" className="absolute inset-0 w-full h-full object-cover scale-110" />
                ) : null}
              </ParallaxMouse>
              <div className={`absolute inset-0 ${banners[currentSlide]?.bgColor || 'from-[#6DB3D7]/90 to-[#2C3E50]/80'} bg-gradient-to-l ${!banners[currentSlide]?.image ? '' : '/90'}`} />
              <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 w-full">
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-lg">
                    <p className="text-white/80 text-lg mb-2">{locale === 'en' ? banners[currentSlide]?.subtitleEn : banners[currentSlide]?.subtitleAr}</p>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{locale === 'en' ? banners[currentSlide]?.titleEn : banners[currentSlide]?.titleAr}</h2>
                    <p className="text-white/90 text-base md:text-lg mb-6">{locale === 'en' ? banners[currentSlide]?.descriptionEn : banners[currentSlide]?.descriptionAr}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      {banners[currentSlide]?.ctaTextAr && (
                        <button onClick={() => {
                          const link = banners[currentSlide]?.ctaLink;
                          if (link?.startsWith('http')) window.open(link, '_blank');
                          else if (link) setCurrentPage(link as any);
                          else setCurrentPage('booking');
                        }} className="bg-white text-[#6DB3D7] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center gap-2">
                          {locale === 'en' ? banners[currentSlide]?.ctaTextEn : banners[currentSlide]?.ctaTextAr}
                        </button>
                      )}
                      {banners[currentSlide]?.ctaButtons && Array.isArray(banners[currentSlide].ctaButtons) && banners[currentSlide].ctaButtons!.map((btn, idx) => (
                        <button key={idx} onClick={() => {
                          if (btn.link?.startsWith('http')) window.open(btn.link, '_blank');
                          else if (btn.link) setCurrentPage(btn.link as any);
                        }} className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-lg font-bold hover:bg-white/30 transition-colors flex items-center gap-2">
                          {btn.icon && <img src={btn.icon} alt="" className="w-5 h-5 object-contain" />}
                          {locale === 'en' ? btn.textEn : btn.textAr}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-l from-[#6DB3D7]/90 to-[#2C3E50]/80 flex items-center">
            <div className="max-w-7xl mx-auto px-4 w-full">
              <div className="max-w-lg">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{locale === 'en' ? 'Medical Care with Professionalism' : 'الرعاية الطبية بكل احترافية'}</h2>
                <button onClick={() => setCurrentPage('booking')} className="bg-white text-[#6DB3D7] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                  {t('header.bookNow', locale)}
                </button>
              </div>
            </div>
          </div>
        )}
        {banners.length > 1 && (
          <>
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)} className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-white w-8' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
      </section>

      {renderImageBanners('after_hero')}

      {/* Info Strip */}
      <FadeIn direction="up" distance={20}>
        <div className="bg-[#EBF5FB] py-3">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-4">
            <Clock className="w-5 h-5 text-[#6DB3D7]" />
            <p className="text-[#333] font-semibold">
              <span className="text-[#6DB3D7]">{t('hero.workingHours', locale)}</span>{' '}
              {workingHoursText || t('hero.workingHoursText', locale)}
            </p>
          </div>
        </div>
      </FadeIn>

      {renderImageBanners('after_info_strip')}

      {/* Services Grid */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <FadeIn direction="up">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-3">{t('home.ourServices', locale)}</h3>
                <p className="text-[#7F8C8D] text-base max-w-2xl mx-auto">
                  {locale === 'en' ? 'Explore our range of specialized medical and cosmetic services' : 'استكشف مجموعتنا من الخدمات الطبية والتجميلية المتخصصة'}
                </p>
              </div>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCurrentPage('services', { category: cat.slug })}
                  className="service-card bg-[#EBF5FB] rounded-2xl p-6 text-center group cursor-pointer hover:bg-[#6DB3D7] transition-colors duration-300"
                >
                  {cat.image ? (
                    <img src={cat.image} alt="" className="w-16 h-16 rounded-full object-cover mx-auto mb-3" />
                  ) : (
                    <div className="w-16 h-16 bg-[#6DB3D7]/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white transition-colors duration-300">
                      <Stethoscope className="w-8 h-8 text-[#6DB3D7] group-hover:text-[#6DB3D7] transition-colors duration-300" />
                    </div>
                  )}
                  <p className="text-sm font-semibold text-[#333] group-hover:text-white transition-colors duration-300 leading-tight">{locale === 'en' ? cat.nameEn : cat.nameAr}</p>
                </button>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {renderImageBanners('after_services_grid')}

      {/* CTA Banner - Pay Later */}
      {ctaBanner && (
        <ScaleIn>
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="rounded-2xl p-8 md:p-12 flex flex-col-reverse md:flex-row items-center justify-between gap-6" style={{ background: `linear-gradient(to right, ${ctaBanner.bgColor}, ${ctaBanner.bgColor}cc)` }}>
                <div className="flex gap-3 shrink-0">
                  {ctaBanner.buttons.map((btn: any, idx: number) => (
                    <MagneticButton key={idx}>
                      <button
                        onClick={() => setCurrentPage(btn.link as any || 'booking')}
                        className="bg-white text-[#6DB3D7] px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
                      >
                        {btn.icon && <img src={btn.icon} alt="" className="w-5 h-5" />}
                        {locale === 'ar' ? btn.textAr : btn.textEn}
                      </button>
                    </MagneticButton>
                  ))}
                </div>
                <div className="text-center md:text-right">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{locale === 'ar' ? ctaBanner.titleAr : ctaBanner.titleEn}</h3>
                  <p className="text-white/80">{locale === 'ar' ? ctaBanner.descriptionAr : ctaBanner.descriptionEn}</p>
                </div>
              </div>
            </div>
          </section>
        </ScaleIn>
      )}

      {renderImageBanners('after_cta_banner')}

      {/* Premium Services Section */}
      {featuredServices.length > 0 && (
        <section className="py-24 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4">
            <FadeIn direction="up">
              <div className="text-center mb-20">
                <h3 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-5 tracking-tight">{t('home.suggestedServices', locale)}</h3>
                <p className="text-[#7F8C8D] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                  {locale === 'en' ? 'Discover our premium medical and cosmetic services designed for your wellbeing' : 'اكتشف خدماتنا الطبية والتجميلية المميزة المصممة لراحتك'}
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredServices.map((service, index) => (
                <PremiumServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                  locale={locale}
                  addItem={addItem}
                  t={t}
                />
              ))}
            </div>

            {/* View All Services */}
            <FadeIn direction="up" delay={0.3}>
              <div className="text-center mt-16">
                <MagneticButton>
                  <button
                    onClick={() => setCurrentPage('services')}
                    className="inline-flex items-center gap-3 bg-[#6DB3D7] text-white px-10 py-4 rounded-2xl font-semibold text-base hover:bg-[#5DADE2] transition-all duration-300 hover:shadow-xl hover:shadow-[#6DB3D7]/30"
                  >
                    {locale === 'en' ? 'View All Services' : 'عرض جميع الخدمات'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </MagneticButton>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {renderImageBanners('after_premium_services')}

      {/* Doctors Section */}
      {displayDoctors.length > 0 && (
        <FadeIn direction="left">
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4">
              <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-10">{t('home.ourDoctors', locale)}</h3>
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentDoctorSlide}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                  >
                    {displayDoctors.slice(currentDoctorSlide * doctorsPerSlide, (currentDoctorSlide + 1) * doctorsPerSlide).map((doctor) => (
                      <TiltCard key={doctor.id} className="doctor-card bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-50">
                        {doctor.image ? (
                          <img src={doctor.image} alt="" className="w-24 h-24 rounded-full object-cover mx-auto mb-3" />
                        ) : (
                          <div className="w-24 h-24 bg-[#EBF5FB] rounded-full flex items-center justify-center mx-auto mb-3">
                            <Stethoscope className="w-10 h-10 text-[#6DB3D7]/50" />
                          </div>
                        )}
                        <h4 className="font-bold text-[#333] text-sm mb-1">{locale === 'en' ? doctor.nameEn : doctor.nameAr}</h4>
                        <p className="text-xs text-[#7F8C8D] line-clamp-2 leading-relaxed mb-3">{locale === 'en' ? doctor.specialtyEn : doctor.specialtyAr}</p>
                        <button onClick={() => setCurrentPage('booking', { doctorId: doctor.id, doctorName: locale === 'en' ? doctor.nameEn : doctor.nameAr, department: locale === 'en' ? doctor.departmentEn : doctor.departmentAr })} className="bg-[#6DB3D7] text-white text-xs px-4 py-2 rounded-lg font-semibold hover:bg-[#5DADE2] transition-colors">
                          {t('home.bookAppointment', locale)}
                        </button>
                      </TiltCard>
                    ))}
                  </motion.div>
                </AnimatePresence>
                {maxDoctorSlide > 0 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button onClick={() => setCurrentDoctorSlide(p => Math.max(0, p - 1))} disabled={currentDoctorSlide === 0} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#EBF5FB] disabled:opacity-30 transition-colors">
                      <ChevronRight className="w-5 h-5 text-[#6DB3D7]" />
                    </button>
                    <div className="flex gap-2">
                      {Array.from({ length: maxDoctorSlide + 1 }).map((_, i) => (
                        <button key={i} onClick={() => setCurrentDoctorSlide(i)} className={`w-3 h-3 rounded-full transition-all ${i === currentDoctorSlide ? 'bg-[#6DB3D7] w-8' : 'bg-gray-300'}`} />
                      ))}
                    </div>
                    <button onClick={() => setCurrentDoctorSlide(p => Math.min(maxDoctorSlide, p + 1))} disabled={currentDoctorSlide === maxDoctorSlide} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#EBF5FB] disabled:opacity-30 transition-colors">
                      <ChevronLeft className="w-5 h-5 text-[#6DB3D7]" />
                    </button>
                  </div>
                )}
                <div className="text-center mt-6">
                  <button onClick={() => setCurrentPage('doctors')} className="text-[#6DB3D7] font-semibold hover:underline flex items-center gap-2 mx-auto">
                    <ArrowLeft className="w-4 h-4" />
                    {t('home.viewAllDoctors', locale)}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
      )}

      {renderImageBanners('after_doctors')}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <FadeIn direction="up">
          <section className="py-16 bg-[#EBF5FB]">
            <div className="max-w-7xl mx-auto px-4">
              <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-10">{t('home.clientReviews', locale)}</h3>
              <div className="relative max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div key={currentTestimonial} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-2xl p-8 text-center shadow-sm">
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {Array.from({ length: testimonials[currentTestimonial]?.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-[#333] text-lg leading-relaxed mb-4">&ldquo;{locale === 'en' ? testimonials[currentTestimonial]?.textEn : testimonials[currentTestimonial]?.textAr}&rdquo;</p>
                    <p className="font-bold text-[#2C3E50]">{locale === 'en' ? testimonials[currentTestimonial]?.nameEn : testimonials[currentTestimonial]?.nameAr}</p>
                  </motion.div>
                </AnimatePresence>
                {testimonials.length > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <button onClick={() => setCurrentTestimonial(p => (p - 1 + testimonials.length) % testimonials.length)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#6DB3D7] hover:text-white transition-colors shadow-sm">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button onClick={() => setCurrentTestimonial(p => (p + 1) % testimonials.length)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#6DB3D7] hover:text-white transition-colors shadow-sm">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </FadeIn>
      )}

      {renderImageBanners('after_testimonials')}

      {/* Before & After Section */}
      <BeforeAfterSection />

      {renderImageBanners('after_before_after')}

      {/* Videos Section */}
      {videos.length > 0 && (
        <FadeIn direction="right">
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4">
              <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-10">{t('home.clinicVideos', locale)}</h3>
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" direction="right">
                {videos.slice(0, 3).map((video) => (
                  <div key={video.id} className="bg-[#2C3E50] rounded-2xl overflow-hidden aspect-video flex items-center justify-center group cursor-pointer relative">
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    ) : null}
                    <div className="relative w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-[#6DB3D7] transition-colors">
                      <Play className="w-8 h-8 text-white" style={locale === 'ar' ? { marginRight: '-2px' } : { marginLeft: '-2px' }} />
                    </div>
                    <p className="absolute bottom-3 left-3 right-3 text-white text-sm font-semibold line-clamp-1">{locale === 'en' ? video.titleEn : video.titleAr}</p>
                  </div>
                ))}
              </StaggerContainer>
            </div>
          </section>
        </FadeIn>
      )}

      {renderImageBanners('after_videos')}

      {/* Blog Preview */}
      {articles.length > 0 && (
        <FadeIn direction="left">
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-10">{t('home.medicalNews', locale)}</h3>
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" direction="left">
                {articles.slice(0, 4).map((article) => (
                  <div key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-sm group cursor-pointer" onClick={() => setCurrentPage('news-article', { id: article.id })}>
                    {article.image ? (
                      <div className="h-40 overflow-hidden">
                        <img src={article.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <ImagePlaceholder className="h-40" />
                    )}
                    <div className="p-4">
                      {(article.tagAr || article.tagEn) && (
                        <span className="text-xs bg-[#6DB3D7] text-white px-2 py-0.5 rounded-full font-bold">{locale === 'en' ? article.tagEn : article.tagAr}</span>
                      )}
                      <h4 className="font-semibold text-[#333] mt-2 mb-2 line-clamp-2 group-hover:text-[#6DB3D7] transition-colors leading-relaxed">
                        {locale === 'en' ? article.titleEn : article.titleAr}
                      </h4>
                      <button className="text-[#6DB3D7] text-sm font-semibold hover:underline flex items-center gap-1">
                        {t('home.continueReading', locale)} <ArrowLeft className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </StaggerContainer>
            </div>
          </section>
        </FadeIn>
      )}

      {renderImageBanners('after_blog')}

      {/* CTA Contact */}
      <ScaleIn>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-[#EBF5FB] rounded-2xl p-8 md:p-12 text-center">
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">{t('home.contactBook', locale)}</h3>
              <p className="text-[#7F8C8D] mb-6">{t('home.contactDesc', locale)}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <MagneticButton>
                  <button onClick={() => setCurrentPage('booking')} className="bg-[#6DB3D7] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#5DADE2] transition-colors">
                    {t('home.bookBtn', locale)}
                  </button>
                </MagneticButton>
              </div>
            </div>
          </div>
        </section>
      </ScaleIn>

      {renderImageBanners('after_cta_contact')}

      {/* Insurance Companies */}
      {insurance.length > 0 && (
        <FadeIn direction="up">
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-10">{t('home.insurance', locale)}</h3>
              <StaggerContainer className="flex flex-wrap items-center justify-center gap-6">
                {insurance.map((company) => (
                  <div key={company.id} className="w-32 h-20 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100 hover:shadow-md transition-shadow">
                    {company.logo ? (
                      <img src={company.logo} alt="" className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Shield className="w-6 h-6 text-[#6DB3D7]" />
                        <span className="text-xs text-[#333] font-medium">{locale === 'en' ? company.nameEn : company.nameAr}</span>
                      </div>
                    )}
                  </div>
                ))}
              </StaggerContainer>
            </div>
          </section>
        </FadeIn>
      )}

      {renderImageBanners('after_insurance')}
    </main>
  );
}

function PremiumServiceCard({ service, index, locale, addItem, t }: {
  service: ServiceData;
  index: number;
  locale: string;
  addItem: (item: any) => void;
  t: (key: string, locale: string) => string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <motion.div
      custom={index}
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.96 },
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
        })
      }}
      initial="hidden"
      animate="visible"
      className="group relative bg-white rounded-[24px] overflow-hidden transition-all duration-[450ms] ease-out hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(109,179,215,0.25)] border border-[#edf2f7] hover:border-[#6DB3D7]/40 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsButtonHovered(false); }}
    >
      {/* Image Container - 70-75% of card */}
      <div className="relative h-[300px] overflow-hidden bg-gray-100">
        {service.image ? (
          <img
            src={service.image}
            alt=""
            className="w-full h-full object-cover transition-all duration-[700ms] ease-out group-hover:scale-108 group-hover:brightness-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#EBF5FB] to-[#6DB3D7]/20 flex items-center justify-center">
            <ShoppingCart className="w-16 h-16 text-[#6DB3D7]/40" />
          </div>
        )}

        {/* Badge */}
        {service.badge && (
          <span className="absolute top-5 right-5 bg-[#2C3E50] text-white text-xs px-3.5 py-1.5 rounded-full font-bold shadow-lg z-10">
            {service.badge}
          </span>
        )}

        {service.isOffer && (
          <span className="absolute top-5 left-5 bg-red-500 text-white text-xs px-3.5 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1 z-10">
            <Sparkles className="w-3 h-3" />
            {locale === 'en' ? 'Offer' : 'عرض'}
          </span>
        )}

        {/* Circular Cart Button - expands to full width on card hover */}
        <div
          className="absolute bottom-5 left-5 transition-all duration-[350ms] ease-out z-10"
          style={{
            width: isHovered ? 'calc(100% - 2.5rem)' : '48px',
            height: '48px',
          }}
        >
          <button
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              addItem({
                id: service.id,
                name: locale === 'en' ? service.nameEn : service.nameAr,
                price: service.price,
                originalPrice: service.originalPrice || undefined,
                image: service.image,
                category: locale === 'en' ? service.category?.nameEn || '' : service.category?.nameAr || '',
              });
            }}
            className="w-full h-full bg-[#6DB3D7] text-white rounded-full hover:bg-[#5DADE2] transition-all duration-300 flex items-center justify-center relative overflow-hidden shadow-lg hover:shadow-xl"
          >
            {/* Text */}
            <span
              className="transition-all duration-[250ms] ease-out absolute whitespace-nowrap font-semibold text-sm"
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateX(0)' : 'translateX(10px)',
              }}
            >
              {t('home.addToCart', locale)}
            </span>

            {/* Cart Icon */}
            <ShoppingCart
              className="w-5 h-5 transition-all duration-[250ms] ease-out absolute"
              style={{
                opacity: isHovered ? 0 : 1,
                transform: isHovered ? 'scale(0.8) rotate(-10deg)' : 'scale(1) rotate(0deg)',
              }}
            />
          </button>
        </div>
      </div>

      {/* Floating White Panel - overlaps bottom 20-25% of image */}
      <div className="relative bg-white rounded-[22px] -mt-8 mx-4 p-6 shadow-lg">
        {/* Category Badge */}
        <span className="inline-block bg-[#EBF5FB] text-[#6DB3D7] text-xs font-semibold px-3 py-1 rounded-full mb-3">
          {locale === 'en' ? service.category?.nameEn : service.category?.nameAr}
        </span>

        {/* Title */}
        <h4 className="font-bold text-[#2C3E50] text-xl mb-3 leading-tight line-clamp-2">
          {locale === 'en' ? service.nameEn : service.nameAr}
        </h4>

        {/* Price */}
        <div className="flex items-center gap-3">
          {service.originalPrice && service.originalPrice > service.price && (
            <span className="text-sm text-[#7F8C8D] line-through">
              {service.originalPrice.toLocaleString()} <CurrencySymbol />
            </span>
          )}
          <span className="text-xl font-bold text-[#6DB3D7]">
            {service.price.toLocaleString()} <CurrencySymbol />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
