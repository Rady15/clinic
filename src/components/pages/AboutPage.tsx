'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';
import { Award, Heart, Users, Target, Eye, Shield, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PageContentData {
  id: string;
  pageKey: string;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  image: string;
}

interface TestimonialData {
  id: string;
  nameAr: string;
  nameEn: string;
  textAr: string;
  textEn: string;
  rating: number;
}

const values = [
  { icon: Award, titleAr: 'التميز', titleEn: 'Excellence', descriptionAr: 'نسعى باستمرار إلى التميز بالجودة من خلال العمل الجماعي ورضا العملاء والتحسين والتعليم المستمر.', descriptionEn: 'We constantly strive for quality excellence through teamwork, customer satisfaction, and continuous improvement.' },
  { icon: Heart, titleAr: 'الرحمة', titleEn: 'Compassion', descriptionAr: 'المرضى هم مصدر قوتنا. نحن نخدم جميع المرضى برحمة وكرامة.', descriptionEn: 'Patients are our strength. We serve all patients with compassion and dignity.' },
  { icon: Users, titleAr: 'الاحترام', titleEn: 'Respect', descriptionAr: 'نحن نحترم قيمة وتنوع كل مريض وكذلك كل شخص يعمل أو يخدم في مجمع كلينيك 9 الطبي.', descriptionEn: 'We respect the value and diversity of every patient and every person working at Clinic 9 Medical Complex.' },
  { icon: Shield, titleAr: 'المسؤولية', titleEn: 'Responsibility', descriptionAr: 'نحن مسؤولون عن نتائجنا ونتحمل المسؤولية عن أفعالنا.', descriptionEn: 'We are responsible for our outcomes and accountable for our actions.' },
  { icon: Target, titleAr: 'الثقة', titleEn: 'Trust', descriptionAr: 'نبني الثقة في قدرتنا من خلال توقع احتياجات مجتمعنا والمرضى والاستجابة لها.', descriptionEn: 'We build trust in our ability by anticipating and responding to our community and patients needs.' },
];

export default function AboutPage() {
  const { setCurrentPage } = useNavigationStore();
  const { locale } = useLanguageStore();
  const [pageContent, setPageContent] = useState<PageContentData | null>(null);
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/public/page-content/about').then(r => r.json()).catch(() => null),
      fetch('/api/public/testimonials').then(r => r.json()).catch(() => []),
    ]).then(([contentData, testiData]) => {
      if (contentData && contentData.length > 0) setPageContent(contentData[0]);
      setTestimonials(testiData || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <main>
        <Skeleton className="h-48 w-full bg-gray-200" />
        <div className="max-w-5xl mx-auto px-4 py-16">
          <Skeleton className="h-8 w-64 mb-6 bg-gray-200" />
          <Skeleton className="h-4 w-full mb-4 bg-gray-200" />
          <Skeleton className="h-4 w-3/4 mb-4 bg-gray-200" />
          <Skeleton className="h-64 rounded-2xl mb-8 bg-gray-200" />
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Hero Banner */}
      <section className="bg-gradient-to-l from-[#6DB3D7] to-[#5DADE2] py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('about.title', locale)}
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 text-white/80">
            <button onClick={() => setCurrentPage('home')} className="hover:text-white">{t('nav.home', locale)}</button>
            <span>/</span>
            <span>{t('about.title', locale)}</span>
          </motion.div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="prose prose-lg max-w-none">
            <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-[#2C3E50] mb-6">
                  {locale === 'en' ? 'Clinic 9 Medical Center' : 'مركز العيادة التاسعة'}
                </h2>
                <p className="text-[#333] leading-relaxed text-lg mb-8">
                  {locale === 'en'
                    ? (pageContent?.contentEn || 'Clinic 9 Medical Center is a private medical center that aims to provide high-quality healthcare services in accordance with the highest international health standards.')
                    : (pageContent?.contentAr || 'مركز العيادة التاسعة هو مركز طبي خاص يهدف لتقديم خدمات صحية ذات جودة متميزة وفقا لأعلى المعايير الصحية العالمية، حيث يحتوي مجمع العيادة التاسعة الطبي على عيادات طبية متخصصة، ويتميز بتوفر تقنيات طبية متطورة يشرف عليها نخبة من الكفاءات يقدمون أسلوبا جديدا من الرعاية الصحية بالمنطقة.')
                  }
                </p>
              </div>
              {pageContent?.image && (
                <div className="w-full md:w-80 shrink-0">
                  <img src={pageContent.image} alt="" className="w-full rounded-2xl object-cover h-64" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#EBF5FB] rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-[#6DB3D7] rounded-xl flex items-center justify-center shrink-0">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#2C3E50] mb-3">{locale === 'en' ? 'Our Mission' : 'رسالتنا'}</h3>
                <p className="text-[#333] leading-relaxed">
                  {locale === 'en'
                    ? 'Clinic 9 Medical Center is dedicated to providing distinguished and superior healthcare at competitive costs using best evidence-based medical practices, where the patient is the center of attention.'
                    : 'يكرس مركز كلينيك 9 الطبي جهوده لتقديم خدمات رعاية صحية متميزة ومتفوقة بتكلفة تنافسية باستخدام أفضل الممارسات الطبية القائمة على الأدلة، حيث يكون المريض مركز الاهتمام.'
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#6DB3D7] rounded-2xl p-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">{locale === 'en' ? 'Our Vision' : 'رؤيتنا'}</h3>
                <p className="text-white/90 leading-relaxed">
                  {locale === 'en'
                    ? 'For Clinic 9 to be the patients choice for high-quality healthcare and patient safety in the Eastern Province.'
                    : 'أن تكون كلينك 9 خيار المرضى من أجل رعاية صحية عالية الجودة وسلامة المرضى، في المنطقة الشرقية.'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#2C3E50] text-center mb-12">{t('footer.values', locale)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.titleAr}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#EBF5FB] rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-[#6DB3D7]" />
                </div>
                <h4 className="text-lg font-bold text-[#2C3E50] mb-2">{locale === 'en' ? value.titleEn : value.titleAr}</h4>
                <p className="text-[#7F8C8D] text-sm leading-relaxed">{locale === 'en' ? value.descriptionEn : value.descriptionAr}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials preview */}
      {testimonials.length > 0 && (
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-[#EBF5FB] rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center gap-1 mb-4">
                {Array.from({ length: testimonials[0].rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-[#333] text-lg leading-relaxed mb-4">&ldquo;{locale === 'en' ? testimonials[0].textEn : testimonials[0].textAr}&rdquo;</p>
              <p className="font-bold text-[#2C3E50]">{locale === 'en' ? testimonials[0].nameEn : testimonials[0].nameAr}</p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
