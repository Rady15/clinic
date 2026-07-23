'use client';

import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { Phone, Mail, MessageCircle, MapPin, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const workingHours = [
  { day: 'الأحد', hours: '8:00 – 24:00' },
  { day: 'الأثنين', hours: '8:00 – 24:00' },
  { day: 'الثلاثاء', hours: '8:00 – 24:00' },
  { day: 'الأربعاء', hours: '8:00 – 24:00' },
  { day: 'الخميس', hours: '8:00 – 24:00' },
  { day: 'السبت', hours: '8:00 – 24:00' },
];

export default function ContactPage() {
  const { setCurrentPage } = useNavigationStore();
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-l from-[#6DB3D7] to-[#5DADE2] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-4">تواصل معنا</motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 text-white/80">
            <button onClick={() => setCurrentPage('home')} className="hover:text-white">الرئيسية</button>
            <span>/</span>
            <span>تواصل معنا</span>
          </motion.div>
        </div>
      </section>

      {/* Working Hours */}
      <section className="bg-[#EBF5FB] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-xl font-bold text-[#2C3E50] text-center mb-8">مواعيد العمل</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {workingHours.map(s => (
              <div key={s.day} className="bg-white rounded-xl p-4 text-center shadow-sm">
                <p className="font-semibold text-[#2C3E50]">{s.day}</p>
                <p className="text-sm text-[#7F8C8D] mt-1">{s.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Placeholder */}
            <div className="bg-gradient-to-br from-[#EBF5FB] to-[#6DB3D7]/10 rounded-2xl h-[400px] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-[#6DB3D7]/40 mx-auto mb-4" />
                <p className="text-[#7F8C8D]">المنطقة الشرقية، المملكة العربية السعودية</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-[#6DB3D7] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-8">تواصل معنا</h3>
              <div className="space-y-6">
                <a href="https://wa.me/0537666284" className="flex items-center gap-4 hover:bg-white/10 rounded-xl p-3 -mx-3 transition-colors">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">تواصل واتساب</p>
                    <p className="font-bold" dir="ltr">0537666284</p>
                  </div>
                </a>
                <a href="tel:9200006802" className="flex items-center gap-4 hover:bg-white/10 rounded-xl p-3 -mx-3 transition-colors">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">الرقم الموحد</p>
                    <p className="font-bold" dir="ltr">9200006802</p>
                  </div>
                </a>
                <a href="mailto:info@clinic9sa.com" className="flex items-center gap-4 hover:bg-white/10 rounded-xl p-3 -mx-3 transition-colors">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">البريد الإلكتروني</p>
                    <p className="font-bold">info@clinic9sa.com</p>
                  </div>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">مواعيد العمل</p>
                    <p className="font-bold">8:00 صباحاً – 12:00 مساءً</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <p className="text-sm text-white/80 mb-3">لحجز موعد يمكنك التواصل معنا عبر الواتساب</p>
                <a
                  href="https://wa.me/0537666284"
                  className="inline-block bg-white text-[#6DB3D7] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                >
                  التواصل عبر الواتساب
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-8">أرسل لنا رسالة</h3>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <p className="text-green-700 font-semibold text-lg">تم إرسال رسالتك بنجاح!</p>
              <p className="text-green-600 mt-2">سنتواصل معك في أقرب وقت</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">الاسم</label>
                  <Input placeholder="أدخل اسمك" value={formState.name} onChange={e => setFormState({ ...formState, name: e.target.value })} className="h-11" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">البريد الإلكتروني</label>
                  <Input type="email" placeholder="أدخل بريدك" value={formState.email} onChange={e => setFormState({ ...formState, email: e.target.value })} className="h-11" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-1">رقم الجوال</label>
                <Input placeholder="أدخل رقم جوالك" value={formState.phone} onChange={e => setFormState({ ...formState, phone: e.target.value })} className="h-11" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-1">الرسالة</label>
                <Textarea placeholder="اكتب رسالتك هنا" value={formState.message} onChange={e => setFormState({ ...formState, message: e.target.value })} className="min-h-[120px]" />
              </div>
              <Button type="submit" className="w-full bg-[#6DB3D7] hover:bg-[#5DADE2] text-white h-12 text-base font-semibold rounded-xl">إرسال الرسالة</Button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
