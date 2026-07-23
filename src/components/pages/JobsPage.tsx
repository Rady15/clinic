'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { Phone, Mail, MapPin, Upload, Send, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function JobsPage() {
  const { setCurrentPage } = useNavigationStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main>
      <section className="bg-gradient-to-l from-[#6DB3D7] to-[#5DADE2] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-4">الوظائف</motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 text-white/80">
            <button onClick={() => setCurrentPage('home')} className="hover:text-white">الرئيسية</button>
            <span>/</span>
            <span>الوظائف</span>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info Side */}
          <div>
            <h3 className="text-2xl font-bold text-[#2C3E50] mb-8">معلومات التواصل</h3>
            <div className="space-y-6">
              {[
                { icon: MapPin, label: 'العنوان', value: 'المنطقة الشرقية، المملكة العربية السعودية' },
                { icon: Phone, label: 'الهاتف', value: '9200006802', dir: 'ltr' as const },
                { icon: Mail, label: 'البريد الإلكتروني', value: 'info@clinic9sa.com' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4 bg-[#EBF5FB] rounded-xl p-5">
                  <div className="w-12 h-12 bg-[#6DB3D7] rounded-xl flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#7F8C8D] mb-1">{item.label}</p>
                    <p className="font-semibold text-[#333] flex items-center gap-2" dir={item.dir}>
                      {item.value}
                      <button className="text-[#6DB3D7] hover:text-[#5DADE2]" dir="ltr"><Copy className="w-4 h-4" /></button>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div>
            <h3 className="text-2xl font-bold text-[#2C3E50] mb-8">قم بإرسال نموذج الوظيفة الآن</h3>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <p className="text-green-700 font-semibold text-lg">تم إرسال طلبك بنجاح!</p>
                <p className="text-green-600 mt-2">سنتواصل معك في حال توفرت فرصة مناسبة</p>
                <Button onClick={() => setSubmitted(false)} className="mt-4 bg-[#6DB3D7] hover:bg-[#5DADE2]">إرسال طلب آخر</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">الاسم الكامل</label>
                  <Input placeholder="أدخل اسمك الكامل" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="h-11 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">البريد الإلكتروني</label>
                  <Input type="email" placeholder="أدخل بريدك الإلكتروني" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="h-11 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">رقم الجوال</label>
                  <Input placeholder="أدخل رقم جوالك" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required className="h-11 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">الرسالة</label>
                  <Textarea placeholder="اكتب رسالتك هنا" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="min-h-[120px] rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">رفع السيرة الذاتية</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#6DB3D7] transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-[#7F8C8D] mx-auto mb-2" />
                    <p className="text-sm text-[#7F8C8D]">اسحب الملف هنا أو</p>
                    <button type="button" className="text-[#6DB3D7] text-sm font-semibold mt-1">اختر الملف</button>
                    <p className="text-xs text-[#7F8C8D] mt-2">PDF, DOC, DOCX (الحد الأقصى 5MB)</p>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-[#6DB3D7] hover:bg-[#5DADE2] text-white h-12 text-base font-semibold rounded-xl">
                  <Send className="w-4 h-4 ml-2" />
                  إرسال
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
