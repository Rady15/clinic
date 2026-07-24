'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';
import { Phone, Mail, MessageCircle, MapPin, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface WorkingHourData {
  id: string;
  dayAr: string;
  dayEn: string;
  from: string;
  to: string;
  order: number;
}

interface SocialLinkData {
  id: string;
  platform: string;
  url: string;
}

export default function ContactPage() {
  const { setCurrentPage } = useNavigationStore();
  const { locale } = useLanguageStore();
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [workingHours, setWorkingHours] = useState<WorkingHourData[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [socialLinks, setSocialLinks] = useState<SocialLinkData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/public/working-hours').then(r => r.json()).catch(() => []),
      fetch('/api/public/settings').then(r => r.json()).catch(() => []),
      fetch('/api/public/social-links').then(r => r.json()).catch(() => []),
    ]).then(([hoursData, settData, socialData]) => {
      setWorkingHours((hoursData || []).filter((h: WorkingHourData) => h.isActive !== false).sort((a: WorkingHourData, b: WorkingHourData) => a.order - b.order));
      const sMap: Record<string, string> = {};
      (settData || []).forEach((s: { key: string; value: string }) => { sMap[s.key] = s.value; });
      setSettings(sMap);
      setSocialLinks(socialData || []);
      setLoading(false);
    });
  }, []);

  const phone = settings.phone || '9200006802';
  const whatsapp = settings.whatsapp || '0537666284';
  const email = settings.email || 'info@clinic9sa.com';
  const address = settings.address || (locale === 'en' ? 'Eastern Province, Saudi Arabia' : 'المنطقة الشرقية، المملكة العربية السعودية');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      setSubmitted(true);
      setFormState({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      alert(locale === 'en' ? 'Error sending message' : 'خطأ في إرسال الرسالة');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <main>
        <Skeleton className="h-48 w-full bg-gray-200" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 rounded-2xl bg-gray-200" />
            <Skeleton className="h-96 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-l from-[#6DB3D7] to-[#5DADE2] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-4">{t('contact.title', locale)}</motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 text-white/80">
            <button onClick={() => setCurrentPage('home')} className="hover:text-white">{t('nav.home', locale)}</button>
            <span>/</span>
            <span>{t('contact.title', locale)}</span>
          </motion.div>
        </div>
      </section>

      {/* Working Hours */}
      {workingHours.length > 0 && (
        <section className="bg-[#EBF5FB] py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-xl font-bold text-[#2C3E50] text-center mb-8">{t('contact.workingHours', locale)}</h3>
            <div className={`grid gap-4 ${workingHours.length <= 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'}`}>
              {workingHours.map(wh => (
                <div key={wh.id} className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <p className="font-semibold text-[#2C3E50]">{locale === 'en' ? wh.dayEn : wh.dayAr}</p>
                  <p className="text-sm text-[#7F8C8D] mt-1">{wh.from} – {wh.to}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Placeholder */}
            <div className="bg-gradient-to-br from-[#EBF5FB] to-[#6DB3D7]/10 rounded-2xl h-[400px] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-[#6DB3D7]/40 mx-auto mb-4" />
                <p className="text-[#7F8C8D]">{address}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-[#6DB3D7] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-8">{t('contact.title', locale)}</h3>
              <div className="space-y-6">
                <a href={`https://wa.me/${whatsapp}`} className="flex items-center gap-4 hover:bg-white/10 rounded-xl p-3 -mx-3 transition-colors">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">{locale === 'en' ? 'WhatsApp' : 'تواصل واتساب'}</p>
                    <p className="font-bold" dir="ltr">{whatsapp}</p>
                  </div>
                </a>
                <a href={`tel:${phone}`} className="flex items-center gap-4 hover:bg-white/10 rounded-xl p-3 -mx-3 transition-colors">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">{locale === 'en' ? 'Unified Number' : 'الرقم الموحد'}</p>
                    <p className="font-bold" dir="ltr">{phone}</p>
                  </div>
                </a>
                <a href={`mailto:${email}`} className="flex items-center gap-4 hover:bg-white/10 rounded-xl p-3 -mx-3 transition-colors">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">{locale === 'en' ? 'Email' : 'البريد الإلكتروني'}</p>
                    <p className="font-bold">{email}</p>
                  </div>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">{t('contact.workingHours', locale)}</p>
                    <p className="font-bold">{workingHours.length > 0 ? `${workingHours[0].from} – ${workingHours[0].to}` : '8:00 – 24:00'}</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <p className="text-sm text-white/80 mb-3">{locale === 'en' ? 'To book an appointment, contact us via WhatsApp' : 'لحجز موعد يمكنك التواصل معنا عبر الواتساب'}</p>
                <a href={`https://wa.me/${whatsapp}`} className="inline-block bg-white text-[#6DB3D7] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                  {locale === 'en' ? 'Contact via WhatsApp' : 'التواصل عبر الواتساب'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-8">{locale === 'en' ? 'Send us a message' : 'أرسل لنا رسالة'}</h3>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <p className="text-green-700 font-semibold text-lg">{locale === 'en' ? 'Your message has been sent successfully!' : 'تم إرسال رسالتك بنجاح!'}</p>
              <p className="text-green-600 mt-2">{locale === 'en' ? 'We will contact you as soon as possible' : 'سنتواصل معك في أقرب وقت'}</p>
              <Button onClick={() => setSubmitted(false)} className="mt-4 bg-[#6DB3D7] hover:bg-[#5DADE2]">
                {locale === 'en' ? 'Send another message' : 'إرسال رسالة أخرى'}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">{t('contact.name', locale)}</label>
                  <Input placeholder={locale === 'en' ? 'Enter your name' : 'أدخل اسمك'} value={formState.name} onChange={e => setFormState({ ...formState, name: e.target.value })} required className="h-11" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">{t('contact.email', locale)}</label>
                  <Input type="email" placeholder={locale === 'en' ? 'Enter your email' : 'أدخل بريدك'} value={formState.email} onChange={e => setFormState({ ...formState, email: e.target.value })} required className="h-11" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-1">{t('contact.phone', locale)}</label>
                <Input placeholder={locale === 'en' ? 'Enter your phone' : 'أدخل رقم جوالك'} value={formState.phone} onChange={e => setFormState({ ...formState, phone: e.target.value })} className="h-11" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-1">{t('contact.subject', locale)}</label>
                <Input placeholder={locale === 'en' ? 'Subject' : 'الموضوع'} value={formState.subject} onChange={e => setFormState({ ...formState, subject: e.target.value })} className="h-11" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-1">{t('contact.message', locale)}</label>
                <Textarea placeholder={locale === 'en' ? 'Write your message here' : 'اكتب رسالتك هنا'} value={formState.message} onChange={e => setFormState({ ...formState, message: e.target.value })} required className="min-h-[120px]" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full bg-[#6DB3D7] hover:bg-[#5DADE2] text-white h-12 text-base font-semibold rounded-xl">
                {submitting ? (locale === 'en' ? 'Sending...' : 'جار الإرسال...') : t('contact.send', locale)}
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
