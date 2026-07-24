'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';
import { Phone, Mail, MapPin, Upload, Send, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function JobsPage() {
  const { setCurrentPage } = useNavigationStore();
  const { locale } = useLanguageStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/public/settings')
      .then(r => r.json())
      .then((data: { key: string; value: string }[]) => {
        const sMap: Record<string, string> = {};
        (data || []).forEach((s: { key: string; value: string }) => { sMap[s.key] = s.value; });
        setSettings(sMap);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const phone = settings.phone || '9200006802';
  const email = settings.email || 'info@clinic9sa.com';
  const address = settings.address || (locale === 'en' ? 'Eastern Province, Saudi Arabia' : 'المنطقة الشرقية، المملكة العربية السعودية');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !form.message) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('message', form.message);
      if (file) formData.append('file', file);
      await fetch('/api/public/job-application', { method: 'POST', body: formData });
      setSubmitted(true);
    } catch {
      alert(locale === 'en' ? 'Error submitting application' : 'خطأ في إرسال الطلب');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <main>
        <Skeleton className="h-48 w-full bg-gray-200" />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="h-64 rounded-2xl bg-gray-200" />
            <Skeleton className="h-96 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="bg-gradient-to-l from-[#6DB3D7] to-[#5DADE2] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-4">{t('nav.jobs', locale)}</motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 text-white/80">
            <button onClick={() => setCurrentPage('home')} className="hover:text-white">{t('nav.home', locale)}</button>
            <span>/</span>
            <span>{t('nav.jobs', locale)}</span>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info Side */}
          <div>
            <h3 className="text-2xl font-bold text-[#2C3E50] mb-8">{locale === 'en' ? 'Contact Info' : 'معلومات التواصل'}</h3>
            <div className="space-y-6">
              {[
                { icon: MapPin, label: locale === 'en' ? 'Address' : 'العنوان', value: address },
                { icon: Phone, label: locale === 'en' ? 'Phone' : 'الهاتف', value: phone, dir: 'ltr' as const },
                { icon: Mail, label: locale === 'en' ? 'Email' : 'البريد الإلكتروني', value: email },
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
            <h3 className="text-2xl font-bold text-[#2C3E50] mb-8">{t('jobs.apply', locale)}</h3>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <p className="text-green-700 font-semibold text-lg">{locale === 'en' ? 'Your application has been sent successfully!' : 'تم إرسال طلبك بنجاح!'}</p>
                <p className="text-green-600 mt-2">{locale === 'en' ? 'We will contact you if a suitable opportunity is available' : 'سنتواصل معك في حال توفرت فرصة مناسبة'}</p>
                <Button onClick={() => setSubmitted(false)} className="mt-4 bg-[#6DB3D7] hover:bg-[#5DADE2]">
                  {locale === 'en' ? 'Submit another application' : 'إرسال طلب آخر'}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">{locale === 'en' ? 'Full Name' : 'الاسم الكامل'}</label>
                  <Input placeholder={locale === 'en' ? 'Enter your full name' : 'أدخل اسمك الكامل'} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="h-11 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">{locale === 'en' ? 'Email' : 'البريد الإلكتروني'}</label>
                  <Input type="email" placeholder={locale === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="h-11 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">{locale === 'en' ? 'Phone' : 'رقم الجوال'}</label>
                  <Input placeholder={locale === 'en' ? 'Enter your phone' : 'أدخل رقم جوالك'} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required className="h-11 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">{locale === 'en' ? 'Message' : 'الرسالة'}</label>
                  <Textarea placeholder={locale === 'en' ? 'Write your message' : 'اكتب رسالتك هنا'} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="min-h-[120px] rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">{locale === 'en' ? 'Upload CV' : 'رفع السيرة الذاتية'}</label>
                  <input type="file" ref={fileRef} onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" accept=".pdf,.doc,.docx" />
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#6DB3D7] transition-colors cursor-pointer"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-[#7F8C8D] mx-auto mb-2" />
                    {file ? (
                      <p className="text-sm text-[#6DB3D7] font-semibold">{file.name}</p>
                    ) : (
                      <>
                        <p className="text-sm text-[#7F8C8D]">{locale === 'en' ? 'Drag file here or' : 'اسحب الملف هنا أو'}</p>
                        <button type="button" className="text-[#6DB3D7] text-sm font-semibold mt-1">{t('jobs.uploadCv', locale)}</button>
                        <p className="text-xs text-[#7F8C8D] mt-2">PDF, DOC, DOCX ({locale === 'en' ? 'max 5MB' : 'الحد الأقصى 5MB'})</p>
                      </>
                    )}
                  </div>
                </div>
                <Button type="submit" disabled={submitting || !file} className="w-full bg-[#6DB3D7] hover:bg-[#5DADE2] text-white h-12 text-base font-semibold rounded-xl disabled:opacity-50">
                  <Send className="w-4 h-4 ml-2" />
                  {submitting ? (locale === 'en' ? 'Sending...' : 'جار الإرسال...') : t('contact.send', locale)}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
