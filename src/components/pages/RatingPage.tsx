'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { Star, Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ratingCategories = [
  {
    title: 'النظافة',
    options: ['سيء', 'مقبول', 'جيد', 'ممتاز'],
  },
  {
    title: 'هل كان الكادر سعيداً؟',
    options: ['سيء', 'مقبول', 'جيد', 'ممتاز'],
  },
  {
    title: 'هل كان الكادر متعاوناً؟',
    options: ['سيء', 'مقبول', 'جيد', 'ممتاز'],
  },
];

export default function RatingPage() {
  const { setCurrentPage } = useNavigationStore();
  const [department, setDepartment] = useState('');
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: '', email: '', comment: '' });
  const [overallRating, setOverallRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-12 text-center shadow-lg max-w-md mx-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-3">شكراً لتقييمك!</h2>
          <p className="text-[#7F8C8D] mb-6">نقدر رأيك وسنعمل على تحسين خدماتنا</p>
          <Button onClick={() => setCurrentPage('home')} className="bg-[#6DB3D7] hover:bg-[#5DADE2] text-white px-8 rounded-xl">
            العودة للرئيسية
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main>
      <section className="bg-gradient-to-l from-[#6DB3D7] to-[#5DADE2] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-4">رأيك يهمنا</motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 text-white/80">
            <button onClick={() => setCurrentPage('home')} className="hover:text-white">الرئيسية</button>
            <span>/</span>
            <span>رأيك يهمنا</span>
          </motion.div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm space-y-8">
          {/* Department Select */}
          <div>
            <label className="block text-sm font-medium text-[#333] mb-2">القسم</label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="اختر القسم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dermatology">جلدية</SelectItem>
                <SelectItem value="dental">الأسنان</SelectItem>
                <SelectItem value="obstetrics">النساء و الولادة</SelectItem>
                <SelectItem value="nutrition">التغذية و التخسيس</SelectItem>
                <SelectItem value="physiotherapy">العلاج الطبيعي</SelectItem>
                <SelectItem value="lab">المختبر</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-medium text-[#333] mb-2">التقييم العام</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setOverallRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star className={`w-8 h-8 ${star <= overallRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Category Ratings */}
          {ratingCategories.map(cat => (
            <div key={cat.title}>
              <label className="block text-sm font-medium text-[#333] mb-3">{cat.title}</label>
              <div className="flex flex-wrap gap-3">
                {cat.options.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setRatings({ ...ratings, [cat.title]: opt })}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${ratings[cat.title] === opt ? 'bg-[#6DB3D7] text-white shadow-md' : 'bg-gray-100 text-[#333] hover:bg-[#EBF5FB]'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-[#333] mb-2">اترك تعليقك</label>
            <Textarea
              placeholder="اكتب تعليقك هنا"
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
              className="min-h-[100px] rounded-xl"
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">الاسم</label>
              <Input placeholder="أدخل اسمك" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-11 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">البريد الإلكتروني</label>
              <Input type="email" placeholder="أدخل بريدك" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="h-11 rounded-xl" />
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#6DB3D7] hover:bg-[#5DADE2] text-white h-12 text-base font-semibold rounded-xl">
            <Send className="w-4 h-4 ml-2" />
            إرسال التقييم
          </Button>
        </form>
      </div>
    </main>
  );
}
