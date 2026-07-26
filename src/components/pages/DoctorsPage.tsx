'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';
import { Stethoscope, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import HeroSection from '@/components/ui/HeroSection';

interface DoctorData {
  id: string;
  nameAr: string;
  nameEn: string;
  specialtyAr: string;
  specialtyEn: string;
  experienceAr: string;
  experienceEn: string;
  departmentAr: string;
  departmentEn: string;
  image: string;
  order: number;
  isActive: boolean;
}

export default function DoctorsPage() {
  const { setCurrentPage } = useNavigationStore();
  const { locale } = useLanguageStore();
  const [selectedDept, setSelectedDept] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/doctors')
      .then(r => r.json())
      .then((data: DoctorData[]) => {
        setDoctors(data.filter((d: DoctorData) => d.isActive !== false));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const departments = useMemo(() => {
    const depts = new Set<string>();
    doctors.forEach(d => {
      const dept = locale === 'en' ? d.departmentEn : d.departmentAr;
      if (dept) depts.add(dept);
    });
    return Array.from(depts);
  }, [doctors, locale]);

  const filteredDoctors = useMemo(() => {
    let result = doctors;
    if (selectedDept) {
      result = result.filter(d => (locale === 'en' ? d.departmentEn : d.departmentAr) === selectedDept);
    }
    if (searchQuery) {
      result = result.filter(d =>
        d.nameAr.includes(searchQuery) || d.nameEn.includes(searchQuery.toLowerCase()) ||
        d.specialtyAr.includes(searchQuery) || d.specialtyEn.includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [selectedDept, searchQuery, doctors, locale]);

  if (loading) {
    return (
      <main>
        <Skeleton className="h-48 w-full bg-gray-200" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl bg-gray-200" />)}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <HeroSection titleKey="doctors.title" pageKey="doctors" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder={locale === 'en' ? 'Search for a doctor...' : 'ابحث عن طبيب...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pr-4 pl-10 h-11 rounded-xl"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7F8C8D]" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDept('')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${!selectedDept ? 'bg-[#6DB3D7] text-white' : 'bg-[#EBF5FB] text-[#333] hover:bg-[#6DB3D7]/20'}`}
            >
              {t('doctors.allDept', locale)}
            </button>
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${selectedDept === dept ? 'bg-[#6DB3D7] text-white' : 'bg-[#EBF5FB] text-[#333] hover:bg-[#6DB3D7]/20'}`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDoctors.map((doctor, i) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="doctor-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50"
            >
              <div className="h-56 bg-gradient-to-br from-[#EBF5FB] to-[#6DB3D7]/20 flex items-center justify-center">
                {doctor.image ? (
                  <img src={doctor.image} alt="" className="w-28 h-28 rounded-full object-cover shadow-md" />
                ) : (
                  <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Stethoscope className="w-14 h-14 text-[#6DB3D7]/50" />
                  </div>
                )}
              </div>
              <div className="p-5 text-center">
                <h4 className="text-lg font-bold text-[#333] mb-1">{locale === 'en' ? doctor.nameEn : doctor.nameAr}</h4>
                <p className="text-sm text-[#6DB3D7] font-medium mb-2">{locale === 'en' ? doctor.specialtyEn : doctor.specialtyAr}</p>
                <p className="text-xs text-[#7F8C8D] mb-4 line-clamp-2 leading-relaxed">{locale === 'en' ? doctor.experienceEn : doctor.experienceAr}</p>
                <button
                  onClick={() => setCurrentPage('booking', { doctorId: doctor.id, doctorName: locale === 'en' ? doctor.nameEn : doctor.nameAr, department: locale === 'en' ? doctor.departmentEn : doctor.departmentAr })}
                  className="w-full bg-[#6DB3D7] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#5DADE2] transition-colors"
                >
                  {t('home.bookAppointment', locale)}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-[#7F8C8D]">{locale === 'en' ? 'No doctors found in this department' : 'لا يوجد أطباء في هذا القسم'}</p>
          </div>
        )}
      </div>
    </main>
  );
}
