'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';
import { Star, Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryData {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  isActive: boolean;
}

const ratingOptions = [
  { ar: 'سيء', en: 'Bad', value: 1 },
  { ar: 'مقبول', en: 'Acceptable', value: 2 },
  { ar: 'جيد', en: 'Good', value: 3 },
  { ar: 'ممتاز', en: 'Excellent', value: 4 },
];

export default function RatingPage() {
  const { setCurrentPage } = useNavigationStore();
  const { locale } = useLanguageStore();
  const [department, setDepartment] = useState('');
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [form, setForm] = useState({ name: '', email: '', comment: '' });
  const [overallRating, setOverallRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/service-categories')
      .then(r => r.json())
      .then((data: CategoryData[]) => {
        setCategories(data.filter((c: CategoryData) => c.isActive !== false));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const ratingCategories = [
    { key: 'cleanliness', labelAr: 'النظافة', labelEn: 'Cleanliness' },
    { key: 'staffFriendly', labelAr: 'هل الكادر كان سعيداً؟', labelEn: 'Was the staff friendly?' },
    { key: 'staffCoop', labelAr: 'هل الكادر كان متعاون؟', labelEn: 'Was the staff cooperative?' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/public/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          department,
          cleanliness: ratings.cleanliness || 0,
          staffFriendly: ratings.staffFriendly || 0,
          staffCoop: ratings.staffCoop || 0,
        }),
      });
      setSubmitted(true);
    } catch {
      alert(locale === 'en' ? 'Error submitting rating' : 'خطأ في إرسال التقييم');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <main>
        <Skeleton className="h-48 w-full bg-gray-200" />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Skeleton className="h-96 rounded-2xl bg-gray-200" />
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-12 text-center shadow-lg max-w-md mx-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-3">{locale === 'en' ? 'Thank you for your rating!' : 'شكراً لتقييمك!'}</h2>
          <p className="text-[#7F8C8D] mb-6">{locale === 'en' ? 'We appreciate your opinion and will work to improve our services' : 'نقدر رأيك وسنعمل على تحسين خدماتنا'}</p>
          <Button onClick={() => setCurrentPage('home')} className="bg-[#6DB3D7] hover:bg-[#5DADE2] text-white px-8 rounded-xl">
            {locale === 'en' ? 'Back to Home' : 'العودة للرئيسية'}
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main>
      <section className="bg-gradient-to-l from-[#6DB3D7] to-[#5DADE2] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-4">{t('rating.title', locale)}</motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 text-white/80">
            <button onClick={() => setCurrentPage('home')} className="hover:text-white">{t('nav.home', locale)}</button>
            <span>/</span>
            <span>{t('rating.title', locale)}</span>
          </motion.div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm space-y-8">
          {/* Department Select */}
          <div>
            <label className="block text-sm font-medium text-[#333] mb-2">{t('booking.department', locale)}</label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder={locale === 'en' ? 'Select department' : 'اختر القسم'} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={locale === 'en' ? cat.nameEn : cat.nameAr}>
                    {locale === 'en' ? cat.nameEn : cat.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-medium text-[#333] mb-2">{locale === 'en' ? 'Overall Rating' : 'التقييم العام'}</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setOverallRating(star)} className="transition-transform hover:scale-110">
                  <Star className={`w-8 h-8 ${star <= overallRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Category Ratings */}
          {ratingCategories.map(cat => (
            <div key={cat.key}>
              <label className="block text-sm font-medium text-[#333] mb-3">{locale === 'en' ? cat.labelEn : cat.labelAr}</label>
              <div className="flex flex-wrap gap-3">
                {ratingOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRatings({ ...ratings, [cat.key]: opt.value })}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${ratings[cat.key] === opt.value ? 'bg-[#6DB3D7] text-white shadow-md' : 'bg-gray-100 text-[#333] hover:bg-[#EBF5FB]'}`}
                  >
                    {locale === 'en' ? opt.en : opt.ar}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-[#333] mb-2">{t('rating.leaveComment', locale)}</label>
            <Textarea placeholder={locale === 'en' ? 'Write your comment' : 'اكتب تعليقك هنا'} value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} className="min-h-[100px] rounded-xl" />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">{t('booking.name', locale)}</label>
              <Input placeholder={locale === 'en' ? 'Enter your name' : 'أدخل اسمك'} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-11 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">{t('booking.email', locale)}</label>
              <Input type="email" placeholder={locale === 'en' ? 'Enter your email' : 'أدخل بريدك'} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="h-11 rounded-xl" />
            </div>
          </div>

          <Button type="submit" disabled={submitting} className="w-full bg-[#6DB3D7] hover:bg-[#5DADE2] text-white h-12 text-base font-semibold rounded-xl disabled:opacity-50">
            <Send className="w-4 h-4 ml-2" />
            {submitting ? (locale === 'en' ? 'Submitting...' : 'جار الإرسال...') : t('rating.submit', locale)}
          </Button>
        </form>
      </div>
    </main>
  );
}
