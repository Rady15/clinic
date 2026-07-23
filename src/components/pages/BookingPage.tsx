'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { doctors } from '@/data/doctors';
import { Check, User, Stethoscope, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const departments = [
  'جلدية', 'الأسنان', 'النساء والولادة', 'التغذية و التخسيس',
  'العلاج الطبيعي', 'المختبر', 'التجميل النسائي',
];

const steps = [
  { label: 'الخدمة', icon: Stethoscope },
  { label: 'اختيار الطبيب', icon: User },
  { label: 'التأكيد والدفع', icon: CreditCard },
];

export default function BookingPage() {
  const { setCurrentPage } = useNavigationStore();
  const [step, setStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '' });
  const [submitted, setSubmitted] = useState(false);

  const filteredDoctors = selectedDept
    ? doctors.filter(d => d.department === selectedDept)
    : [];

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-12 text-center shadow-lg max-w-md mx-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-3">تم الحجز بنجاح!</h2>
          <p className="text-[#7F8C8D] mb-6">سنتواصل معك لتأكيد الموعد</p>
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
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-4">حجز موعد</motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 text-white/80">
            <button onClick={() => setCurrentPage('home')} className="hover:text-white">الرئيسية</button>
            <span>/</span>
            <span>حجز موعد</span>
          </motion.div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors
                  ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-[#6DB3D7] text-white' : 'bg-gray-200 text-[#7F8C8D]'}`}>
                  {step > i + 1 ? <Check className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`text-xs mt-2 font-medium ${step === i + 1 ? 'text-[#6DB3D7]' : 'text-[#7F8C8D]'}`}>{s.label}</span>
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
              <h3 className="text-xl font-bold text-white mb-6">اختر القسم</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {departments.map(dept => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all text-center
                      ${selectedDept === dept ? 'bg-white text-[#6DB3D7] shadow-md' : 'bg-white/20 text-white hover:bg-white/30'}`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-start">
                <Button onClick={() => setStep(2)} disabled={!selectedDept} className="bg-white text-[#6DB3D7] hover:bg-gray-100 px-8 rounded-xl font-semibold disabled:opacity-50">
                  التالي
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-xl font-bold text-white mb-6">اختر الطبيب</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {filteredDoctors.map(doctor => (
                  <button
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor.name)}
                    className={`p-4 rounded-xl text-right transition-all
                      ${selectedDoctor === doctor.name ? 'bg-white text-[#333] shadow-md' : 'bg-white/20 text-white hover:bg-white/30'}`}
                  >
                    <p className="font-bold">{doctor.name}</p>
                    <p className={`text-sm mt-1 ${selectedDoctor === doctor.name ? 'text-[#6DB3D7]' : 'text-white/80'}`}>{doctor.specialty}</p>
                  </button>
                ))}
                {filteredDoctors.length === 0 && (
                  <p className="text-white/80 col-span-2 text-center py-4">اختر قسماً أولاً</p>
                )}
              </div>
              <div className="mt-8 flex justify-between">
                <Button onClick={() => setStep(1)} variant="ghost" className="text-white hover:bg-white/20 rounded-xl">السابق</Button>
                <Button onClick={() => setStep(3)} disabled={!selectedDoctor} className="bg-white text-[#6DB3D7] hover:bg-gray-100 px-8 rounded-xl font-semibold disabled:opacity-50">
                  التالي
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-xl font-bold text-white mb-6">التأكيد والدفع</h3>
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">الاسم</label>
                  <Input placeholder="أدخل اسمك" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-11 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">رقم الجوال</label>
                  <Input placeholder="أدخل رقم جوالك" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-11 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#333] mb-1">التاريخ</label>
                    <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="h-11 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333] mb-1">الوقت</label>
                    <Input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="h-11 rounded-xl" />
                  </div>
                </div>
                <div className="bg-[#EBF5FB] rounded-xl p-4 text-sm">
                  <p><strong>القسم:</strong> {selectedDept}</p>
                  <p><strong>الطبيب:</strong> {selectedDoctor}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button onClick={() => setStep(2)} variant="ghost" className="text-white hover:bg-white/20 rounded-xl">السابق</Button>
                <Button onClick={handleSubmit} disabled={!form.name || !form.phone} className="bg-white text-[#6DB3D7] hover:bg-gray-100 px-8 rounded-xl font-semibold disabled:opacity-50">
                  تأكيد الحجز
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
