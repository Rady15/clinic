'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { doctors } from '@/data/doctors';
import { services, homeServiceCategories } from '@/data/services';
import { articles } from '@/data/articles';
import { useCartStore } from '@/store/cart-store';
import {
  Stethoscope, Zap, Activity, Smile, Heart, BriefcaseMedical,
  ChevronLeft, ChevronRight, Star, Clock, ArrowLeft, Play, Shield, Award
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Stethoscope, Zap, Activity, Smile, Heart, BriefcaseMedical,
};

const heroSlides = [
  {
    title: 'الرعاية الطبية بكل احترافية',
    subtitle: 'مركز العيادة التاسعة الطبي',
    description: 'نقدم خدمات صحية ذات جودة متميزة وفقا لأعلى المعايير الصحية العالمية',
    cta: 'احجز موعدك الآن',
    bgGradient: 'from-[#6DB3D7]/90 to-[#2C3E50]/80',
  },
  {
    title: 'ابتسامة أجمل',
    subtitle: 'رعاية طبية بأسلوب جديد',
    description: 'أحدث تقنيات تجميل وعلاج الأسنان مع نخبة من أفضل الأطباء',
    cta: 'اكتشف خدماتنا',
    bgGradient: 'from-[#5DADE2]/90 to-[#2C3E50]/80',
  },
  {
    title: 'من أجلك لابتسامة أجمل',
    subtitle: 'خدمات الجلدية والتجميل',
    description: 'تقنيات متطورة في الجلدية والليزر والتجميل بأيدي خبراء متخصصين',
    cta: 'تعرف على أطبائنا',
    bgGradient: 'from-[#2C3E50]/90 to-[#6DB3D7]/80',
  },
];

const testimonials = [
  { name: 'سارة أحمد', rating: 5, text: 'تجربة رائعة في العيادة التاسعة. الأطباء محترفون والخدمة ممتازة. أنصح الجميع بزيارتها.' },
  { name: 'فاطمة محمد', rating: 5, text: 'أفضل مركز طبي في المنطقة الشرقية. النظافة والترتيب والخدمة في أعلى مستوى.' },
  { name: 'نورة عبدالله', rating: 4, text: 'خدمة ممتازة وأسعار مناسبة. كادر طبي متعاون ومحترف.' },
  { name: 'هند خالد', rating: 5, text: 'سعيدة جداً بالنتائج. الدكتورة حنان ممتازة في مجال الجلدية والتجميل.' },
];

const insuranceCompanies = [
  'تكافل', 'بوبا', 'ميدغلف', 'ولاء', 'أسياسة', 'ساب', 'تعاونية', 'الراجحي',
];

export default function HomePage() {
  const { setCurrentPage } = useNavigationStore();
  const addItem = useCartStore(s => s.addItem);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentDoctorSlide, setCurrentDoctorSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextSlide = useCallback(() => setCurrentSlide(p => (p + 1) % heroSlides.length), []);
  const prevSlide = useCallback(() => setCurrentSlide(p => (p - 1 + heroSlides.length) % heroSlides.length), []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const featuredServices = services.filter(s => s.isOffer).slice(0, 3);
  const displayDoctors = doctors.slice(0, 10);
  const doctorsPerSlide = 5;
  const maxDoctorSlide = Math.ceil(displayDoctors.length / doctorsPerSlide) - 1;

  return (
    <main>
      {/* Hero Slider */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className={`absolute inset-0 bg-gradient-to-l ${heroSlides[currentSlide].bgGradient}`}
          >
            <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-lg"
                >
                  <p className="text-white/80 text-lg mb-2">{heroSlides[currentSlide].subtitle}</p>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    {heroSlides[currentSlide].title}
                  </h2>
                  <p className="text-white/90 text-base md:text-lg mb-6">
                    {heroSlides[currentSlide].description}
                  </p>
                  <button
                    onClick={() => setCurrentPage('booking')}
                    className="bg-white text-[#6DB3D7] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                  >
                    {heroSlides[currentSlide].cta}
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-white w-8' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* Info Strip */}
      <div className="bg-[#EBF5FB] py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-4">
          <Clock className="w-5 h-5 text-[#6DB3D7]" />
          <p className="text-[#333] font-semibold">
            <span className="text-[#6DB3D7]">مواعيد العمل:</span> من 8 صباحًا الى 12 مساءً طوال الأسبوع
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-10">خدماتنا</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {homeServiceCategories.map((cat, i) => {
              const IconComp = iconMap[cat.icon] || Stethoscope;
              return (
                <motion.button
                  key={cat.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setCurrentPage('services', { category: cat.slug })}
                  className="service-card bg-[#EBF5FB] rounded-2xl p-6 text-center group cursor-pointer"
                >
                  <div className="w-16 h-16 bg-[#6DB3D7]/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#6DB3D7] transition-colors">
                    <IconComp className="w-8 h-8 text-[#6DB3D7] group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-sm font-semibold text-[#333] leading-tight">{cat.name}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner - Tamara / Pay Later */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-l from-[#6DB3D7] to-[#5DADE2] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">ابتسم الآن وادفع لاحقا</h3>
              <p className="text-white/80">استمتع بخدماتنا وادفع على أقساط مريحة مع تمارا</p>
            </div>
            <button
              onClick={() => setCurrentPage('services')}
              className="bg-white text-[#6DB3D7] px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shrink-0"
            >
              تصفح الخدمات
            </button>
          </div>
        </div>
      </section>

      {/* Featured Services / Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-10">خدمات مقترحة لك</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <div key={service.id} className="product-card bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="h-48 bg-gradient-to-br from-[#EBF5FB] to-[#6DB3D7]/20 flex items-center justify-center">
                  <Stethoscope className="w-16 h-16 text-[#6DB3D7]/50" />
                </div>
                <div className="p-5">
                  <p className="text-xs text-[#7F8C8D] mb-1">{service.category}</p>
                  <h4 className="font-semibold text-[#333] mb-3 line-clamp-2 leading-relaxed">{service.name}</h4>
                  <div className="flex items-center gap-2 mb-3">
                    {service.originalPrice && (
                      <span className="text-sm text-[#7F8C8D] line-through">{service.originalPrice} ر.س</span>
                    )}
                    <span className="text-lg font-bold text-[#6DB3D7]">{service.price} ر.س</span>
                    {service.badge && (
                      <span className="bg-[#6DB3D7] text-white text-xs px-2 py-0.5 rounded-full font-bold">{service.badge}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addItem({ id: service.id, name: service.name, price: service.price, originalPrice: service.originalPrice, image: service.image, category: service.category })}
                    className="w-full bg-[#6DB3D7] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#5DADE2] transition-colors"
                  >
                    إضافة إلى السلة
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => setCurrentPage('services')}
              className="text-[#6DB3D7] font-semibold hover:underline flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              عرض جميع الخدمات
            </button>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-10">أطبائنا</h3>
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDoctorSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
              >
                {displayDoctors
                  .slice(currentDoctorSlide * doctorsPerSlide, (currentDoctorSlide + 1) * doctorsPerSlide)
                  .map((doctor) => (
                    <div key={doctor.id} className="doctor-card bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-50">
                      <div className="w-24 h-24 bg-[#EBF5FB] rounded-full flex items-center justify-center mx-auto mb-3">
                        <Stethoscope className="w-10 h-10 text-[#6DB3D7]/50" />
                      </div>
                      <h4 className="font-bold text-[#333] text-sm mb-1">{doctor.name}</h4>
                      <p className="text-xs text-[#7F8C8D] line-clamp-2 leading-relaxed mb-3">{doctor.experience}</p>
                      <button
                        onClick={() => setCurrentPage('booking')}
                        className="bg-[#6DB3D7] text-white text-xs px-4 py-2 rounded-lg font-semibold hover:bg-[#5DADE2] transition-colors"
                      >
                        إحجز موعد
                      </button>
                    </div>
                  ))}
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentDoctorSlide(p => Math.max(0, p - 1))}
                disabled={currentDoctorSlide === 0}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#EBF5FB] disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[#6DB3D7]" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: maxDoctorSlide + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentDoctorSlide(i)}
                    className={`w-3 h-3 rounded-full transition-all ${i === currentDoctorSlide ? 'bg-[#6DB3D7] w-8' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentDoctorSlide(p => Math.min(maxDoctorSlide, p + 1))}
                disabled={currentDoctorSlide === maxDoctorSlide}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#EBF5FB] disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#6DB3D7]" />
              </button>
            </div>
            <div className="text-center mt-6">
              <button
                onClick={() => setCurrentPage('doctors')}
                className="text-[#6DB3D7] font-semibold hover:underline flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                عرض جميع الأطباء
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-[#EBF5FB]">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-10">أراء عملاء عيادة التاسعة</h3>
          <div className="relative max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl p-8 text-center shadow-sm"
              >
                <div className="flex items-center justify-center gap-1 mb-4">
                  {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-[#333] text-lg leading-relaxed mb-4">&ldquo;{testimonials[currentTestimonial].text}&rdquo;</p>
                <p className="font-bold text-[#2C3E50]">{testimonials[currentTestimonial].name}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={() => setCurrentTestimonial(p => (p - 1 + testimonials.length) % testimonials.length)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#6DB3D7] hover:text-white transition-colors shadow-sm">
                <ChevronRight className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentTestimonial(p => (p + 1) % testimonials.length)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#6DB3D7] hover:text-white transition-colors shadow-sm">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-10">فيديوهات العيادة</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {heroSlides.map((slide, i) => (
              <div key={i} className="bg-[#2C3E50] rounded-2xl overflow-hidden aspect-video flex items-center justify-center group cursor-pointer">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-[#6DB3D7] transition-colors">
                  <Play className="w-8 h-8 text-white mr-[-2px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-10">كل جديد من تطورات الدراسات الطبية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.slice(0, 4).map((article) => (
              <div key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-sm group cursor-pointer" onClick={() => setCurrentPage('news-article', { id: String(article.id) })}>
                <div className="h-40 bg-gradient-to-br from-[#EBF5FB] to-[#6DB3D7]/20 flex items-center justify-center">
                  <Stethoscope className="w-12 h-12 text-[#6DB3D7]/40" />
                </div>
                <div className="p-4">
                  {article.tag && (
                    <span className="text-xs bg-[#6DB3D7] text-white px-2 py-0.5 rounded-full font-bold">{article.tag}</span>
                  )}
                  <h4 className="font-semibold text-[#333] mt-2 mb-2 line-clamp-2 group-hover:text-[#6DB3D7] transition-colors leading-relaxed">
                    {article.title}
                  </h4>
                  <button className="text-[#6DB3D7] text-sm font-semibold hover:underline flex items-center gap-1">
                    تابع القراءة <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Contact */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-[#EBF5FB] rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">تواصل معنا لحجز موعد</h3>
            <p className="text-[#7F8C8D] mb-6">نحن هنا لمساعدتك. احجز موعدك الآن وتواصل معنا مباشرة</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage('booking')}
                className="bg-[#6DB3D7] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#5DADE2] transition-colors"
              >
                حجز موعد
              </button>
              <a
                href="tel:9200006802"
                className="bg-white text-[#333] px-8 py-3 rounded-lg font-bold border border-gray-200 hover:border-[#6DB3D7] hover:text-[#6DB3D7] transition-colors"
              >
                اتصل بنا: 9200006802
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Companies */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-10">شركات التأمين</h3>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {insuranceCompanies.map((company) => (
              <div key={company} className="w-32 h-20 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center gap-1">
                  <Shield className="w-6 h-6 text-[#6DB3D7]" />
                  <span className="text-xs text-[#333] font-medium">{company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
