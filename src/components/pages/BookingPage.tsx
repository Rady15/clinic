'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { useLanguageStore } from '@/store/language-store';
import { useSession } from 'next-auth/react';
import { t } from '@/lib/i18n';
import { Check, Stethoscope, User, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryData {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  isActive: boolean;
}

interface DoctorData {
  id: string;
  nameAr: string;
  nameEn: string;
  specialtyAr: string;
  specialtyEn: string;
  departmentAr: string;
  departmentEn: string;
  image: string;
  isActive: boolean;
}

const steps = [
  { labelAr: 'القسم', labelEn: 'Department', icon: Stethoscope },
  { labelAr: 'اختيار الطبيب', labelEn: 'Choose Doctor', icon: User },
  { labelAr: 'التأكيد والدفع', labelEn: 'Confirm & Pay', icon: CreditCard },
];

export default function BookingPage() {
  const { setCurrentPage } = useNavigationStore();
  const { locale } = useLanguageStore();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', time: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      setForm(prev => ({
        ...prev,
        name: prev.name || session.user?.name || '',
        email: prev.email || session.user?.email || '',
      }));
    }
  }, [session]);

  useEffect(() => {
    Promise.all([
      fetch('/api/public/service-categories').then(r => r.json()).catch(() => []),
      fetch('/api/public/doctors').then(r => r.json()).catch(() => []),
    ]).then(([catData, docData]) => {
      setCategories((catData || []).filter((c: CategoryData) => c.isActive !== false));
      setDoctors((docData || []).filter((d: DoctorData) => d.isActive !== false));
      setLoading(false);
    });
  }, []);

  const filteredDoctors = selectedDept
    ? doctors.filter(d => (locale === 'en' ? d.departmentEn : d.departmentAr) === selectedDept)
    : [];

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/public/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email || session?.user?.email || '',
          department: selectedDept,
          doctorId: selectedDoctorId,
          date: form.date,
          time: form.time,
          notes: form.notes,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert(locale === 'en' ? 'Error submitting booking' : 'خطأ في إرسال الحجز');
      }
    } catch {
      alert(locale === 'en' ? 'Error submitting booking' : 'خطأ في إرسال الحجز');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <main>
        <Skeleton className="h-48 w-full bg-gray-200" />
        <div className="max-w-3xl mx-auto px-4 py-12">
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
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-3">{locale === 'en' ? 'Booking Confirmed!' : 'تم الحجز بنجاح!'}</h2>
          <p className="text-[#7F8C8D] mb-6">{locale === 'en' ? 'We will contact you to confirm the appointment' : 'سنتواصل معك لتأكيد الموعد'}</p>
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
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-4">{t('booking.title', locale)}</motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 text-white/80">
            <button onClick={() => setCurrentPage('home')} className="hover:text-white">{t('nav.home', locale)}</button>
            <span>/</span>
            <span>{t('booking.title', locale)}</span>
          </motion.div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors
                  ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-[#6DB3D7] text-white' : 'bg-gray-200 text-[#7F8C8D]'}`}>
                  {step > i + 1 ? <Check className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`text-xs mt-2 font-medium ${step === i + 1 ? 'text-[#6DB3D7]' : 'text-[#7F8C8D]'}`}>
                  {locale === 'en' ? s.labelEn : s.labelAr}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-24 h-0.5 mx-2 mb-6 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-[#6DB3D7] rounded-2xl p-8">
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-xl font-bold text-white mb-6">{locale === 'en' ? 'Choose Department' : 'اختر القسم'}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedDept(locale === 'en' ? cat.nameEn : cat.nameAr)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all text-center
                      ${selectedDept === (locale === 'en' ? cat.nameEn : cat.nameAr) ? 'bg-white text-[#6DB3D7] shadow-md' : 'bg-white/20 text-white hover:bg-white/30'}`}
                  >
                    {locale === 'en' ? cat.nameEn : cat.nameAr}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-start">
                <Button onClick={() => setStep(2)} disabled={!selectedDept} className="bg-white text-[#6DB3D7] hover:bg-gray-100 px-8 rounded-xl font-semibold disabled:opacity-50">
                  {locale === 'en' ? 'Next' : 'التالي'}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-xl font-bold text-white mb-6">{t('booking.chooseDoctor', locale)}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {filteredDoctors.map(doctor => (
                  <button
                    key={doctor.id}
                    onClick={() => { setSelectedDoctor(locale === 'en' ? doctor.nameEn : doctor.nameAr); setSelectedDoctorId(doctor.id); }}
                    className={`p-4 rounded-xl text-right transition-all flex items-center gap-3
                      ${selectedDoctorId === doctor.id ? 'bg-white text-[#333] shadow-md' : 'bg-white/20 text-white hover:bg-white/30'}`}
                  >
                    {doctor.image ? (
                      <img src={doctor.image} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center shrink-0">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold">{locale === 'en' ? doctor.nameEn : doctor.nameAr}</p>
                      <p className={`text-sm ${selectedDoctorId === doctor.id ? 'text-[#6DB3D7]' : 'text-white/80'}`}>
                        {locale === 'en' ? doctor.specialtyEn : doctor.specialtyAr}
                      </p>
                    </div>
                  </button>
                ))}
                {filteredDoctors.length === 0 && (
                  <p className="text-white/80 col-span-2 text-center py-4">{locale === 'en' ? 'Choose a department first' : 'اختر قسماً أولاً'}</p>
                )}
              </div>
              <div className="mt-8 flex justify-between">
                <Button onClick={() => setStep(1)} variant="ghost" className="text-white hover:bg-white/20 rounded-xl">
                  {locale === 'en' ? 'Previous' : 'السابق'}
                </Button>
                <Button onClick={() => setStep(3)} disabled={!selectedDoctor} className="bg-white text-[#6DB3D7] hover:bg-gray-100 px-8 rounded-xl font-semibold disabled:opacity-50">
                  {locale === 'en' ? 'Next' : 'التالي'}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-xl font-bold text-white mb-6">{t('booking.confirm', locale)}</h3>
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">{t('booking.name', locale)} *</label>
                  <Input placeholder={locale === 'en' ? 'Enter your name' : 'أدخل اسمك'} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-11 rounded-xl" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">{t('booking.phone', locale)} *</label>
                  <Input placeholder={locale === 'en' ? 'Enter your phone' : 'أدخل رقم جوالك'} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-11 rounded-xl" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">{t('booking.email', locale)}</label>
                  <Input type="email" placeholder={locale === 'en' ? 'Enter your email' : 'أدخل بريدك'} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="h-11 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#333] mb-1">{t('booking.date', locale)}</label>
                    <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="h-11 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333] mb-1">{t('booking.time', locale)}</label>
                    <Input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="h-11 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">{t('booking.notes', locale)}</label>
                  <Input placeholder={locale === 'en' ? 'Notes (optional)' : 'ملاحظات'} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="h-11 rounded-xl" />
                </div>
                <div className="bg-[#EBF5FB] rounded-xl p-4 text-sm">
                  <p><strong>{t('booking.department', locale)}:</strong> {selectedDept}</p>
                  <p><strong>{locale === 'en' ? 'Doctor' : 'الطبيب'}:</strong> {selectedDoctor}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button onClick={() => setStep(2)} variant="ghost" className="text-white hover:bg-white/20 rounded-xl">
                  {locale === 'en' ? 'Previous' : 'السابق'}
                </Button>
                <Button onClick={handleSubmit} disabled={!form.name || !form.phone || submitting} className="bg-white text-[#6DB3D7] hover:bg-gray-100 px-8 rounded-xl font-semibold disabled:opacity-50">
                  {submitting ? (locale === 'en' ? 'Submitting...' : 'جار الإرسال...') : t('booking.submit', locale)}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
