'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { useCartStore } from '@/store/cart-store';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';
import {
  Stethoscope, ChevronLeft, ChevronRight, Star, Clock, ArrowLeft, Play, Shield, ArrowRight
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
      const wh = (settData || []).find((s: { key: string }) => s.key === 'workingHours');
      if (wh) setWorkingHoursText(wh.value);
      setLoading(false);
    });
  }, []);

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
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
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
              {banners[currentSlide]?.image ? (
                <img src={banners[currentSlide].image} alt="" className="absolute inset-0 w-full h-full object-cover" />
              ) : null}
              <div className={`absolute inset-0 ${banners[currentSlide]?.bgColor || 'from-[#6DB3D7]/90 to-[#2C3E50]/80'} bg-gradient-to-l ${!banners[currentSlide]?.image ? '' : '/90'}`} />
              <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 w-full">
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-lg">
                    <p className="text-white/80 text-lg mb-2">{locale === 'en' ? banners[currentSlide]?.subtitleEn : banners[currentSlide]?.subtitleAr}</p>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{locale === 'en' ? banners[currentSlide]?.titleEn : banners[currentSlide]?.titleAr}</h2>
                    <p className="text-white/90 text-base md:text-lg mb-6">{locale === 'en' ? banners[currentSlide]?.descriptionEn : banners[currentSlide]?.descriptionAr}</p>
                    <button onClick={() => setCurrentPage('booking')} className="bg-white text-[#6DB3D7] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                      {locale === 'en' ? banners[currentSlide]?.ctaTextEn : banners[currentSlide]?.ctaTextAr || t('booking.submit', locale)}
                    </button>
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

      {/* Info Strip */}
      <div className="bg-[#EBF5FB] py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-4">
          <Clock className="w-5 h-5 text-[#6DB3D7]" />
          <p className="text-[#333] font-semibold">
            <span className="text-[#6DB3D7]">{t('hero.workingHours', locale)}</span>{' '}
            {workingHoursText || t('hero.workingHoursText', locale)}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-10">{t('home.ourServices', locale)}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setCurrentPage('services', { category: cat.slug })}
                  className="service-card bg-[#EBF5FB] rounded-2xl p-6 text-center group cursor-pointer"
                >
                  {cat.image ? (
                    <img src={cat.image} alt="" className="w-16 h-16 rounded-full object-cover mx-auto mb-3" />
                  ) : (
                    <div className="w-16 h-16 bg-[#6DB3D7]/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#6DB3D7] transition-colors">
                      <Stethoscope className="w-8 h-8 text-[#6DB3D7] group-hover:text-white transition-colors" />
                    </div>
                  )}
                  <p className="text-sm font-semibold text-[#333] leading-tight">{locale === 'en' ? cat.nameEn : cat.nameAr}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner - Pay Later */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-l from-[#6DB3D7] to-[#5DADE2] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{t('home.smilePayLater', locale)}</h3>
              <p className="text-white/80">{t('home.smilePayLaterDesc', locale)}</p>
            </div>
            <button onClick={() => setCurrentPage('services')} className="bg-white text-[#6DB3D7] px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shrink-0">
              {t('home.browseServices', locale)}
            </button>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      {featuredServices.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-10">{t('home.suggestedServices', locale)}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((service) => (
                <div key={service.id} className="product-card bg-white rounded-2xl overflow-hidden shadow-sm">
                  {service.image ? (
                    <div className="h-48 overflow-hidden">
                      <img src={service.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <ImagePlaceholder className="h-48" />
                  )}
                  {service.badge && (
                    <span className="absolute top-3 right-3 bg-[#6DB3D7] text-white text-xs px-2.5 py-1 rounded-full font-bold">{service.badge}</span>
                  )}
                  <div className="p-5">
                    <p className="text-xs text-[#7F8C8D] mb-1">{locale === 'en' ? service.category?.nameEn : service.category?.nameAr}</p>
                    <h4 className="font-semibold text-[#333] mb-3 line-clamp-2 leading-relaxed">{locale === 'en' ? service.nameEn : service.nameAr}</h4>
                    <div className="flex items-center gap-2 mb-3">
                      {service.originalPrice && (
                        <span className="text-sm text-[#7F8C8D] line-through">{service.originalPrice.toLocaleString()} {t('services.sar', locale)}</span>
                      )}
                      <span className="text-lg font-bold text-[#6DB3D7]">{service.price.toLocaleString()} {t('services.sar', locale)}</span>
                    </div>
                    <button
                      onClick={() => addItem({
                        id: parseInt(service.id),
                        name: locale === 'en' ? service.nameEn : service.nameAr,
                        price: service.price,
                        originalPrice: service.originalPrice || undefined,
                        image: service.image,
                        category: locale === 'en' ? service.category?.nameEn || '' : service.category?.nameAr || '',
                      })}
                      className="w-full bg-[#6DB3D7] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#5DADE2] transition-colors"
                    >
                      {t('home.addToCart', locale)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button onClick={() => setCurrentPage('services')} className="text-[#6DB3D7] font-semibold hover:underline flex items-center gap-2 mx-auto">
                <ArrowLeft className="w-4 h-4" />
                {t('home.viewAllServices', locale)}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Doctors Section */}
      {displayDoctors.length > 0 && (
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
                    <div key={doctor.id} className="doctor-card bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-50">
                      {doctor.image ? (
                        <img src={doctor.image} alt="" className="w-24 h-24 rounded-full object-cover mx-auto mb-3" />
                      ) : (
                        <div className="w-24 h-24 bg-[#EBF5FB] rounded-full flex items-center justify-center mx-auto mb-3">
                          <Stethoscope className="w-10 h-10 text-[#6DB3D7]/50" />
                        </div>
                      )}
                      <h4 className="font-bold text-[#333] text-sm mb-1">{locale === 'en' ? doctor.nameEn : doctor.nameAr}</h4>
                      <p className="text-xs text-[#7F8C8D] line-clamp-2 leading-relaxed mb-3">{locale === 'en' ? doctor.specialtyEn : doctor.specialtyAr}</p>
                      <button onClick={() => setCurrentPage('booking')} className="bg-[#6DB3D7] text-white text-xs px-4 py-2 rounded-lg font-semibold hover:bg-[#5DADE2] transition-colors">
                        {t('home.bookAppointment', locale)}
                      </button>
                    </div>
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
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
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
      )}

      {/* Videos Section */}
      {videos.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-10">{t('home.clinicVideos', locale)}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </div>
          </div>
        </section>
      )}

      {/* Blog Preview */}
      {articles.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-10">{t('home.medicalNews', locale)}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            </div>
          </div>
        </section>
      )}

      {/* CTA Contact */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-[#EBF5FB] rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">{t('home.contactBook', locale)}</h3>
            <p className="text-[#7F8C8D] mb-6">{t('home.contactDesc', locale)}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => setCurrentPage('booking')} className="bg-[#6DB3D7] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#5DADE2] transition-colors">
                {t('home.bookBtn', locale)}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Companies */}
      {insurance.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-10">{t('home.insurance', locale)}</h3>
            <div className="flex flex-wrap items-center justify-center gap-6">
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
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
