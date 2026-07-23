'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { doctors, departments } from '@/data/doctors';
import { Stethoscope, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function DoctorsPage() {
  const { setCurrentPage } = useNavigationStore();
  const [selectedDept, setSelectedDept] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDoctors = useMemo(() => {
    let result = doctors;
    if (selectedDept !== 'الكل') {
      result = result.filter(d => d.department === selectedDept);
    }
    if (searchQuery) {
      result = result.filter(d =>
        d.name.includes(searchQuery) || d.specialty.includes(searchQuery)
      );
    }
    return result;
  }, [selectedDept, searchQuery]);

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-l from-[#6DB3D7] to-[#5DADE2] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-4">الأطباء</motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 text-white/80">
            <button onClick={() => setCurrentPage('home')} className="hover:text-white">الرئيسية</button>
            <span>/</span>
            <span>الأطباء</span>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="ابحث عن طبيب..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pr-4 pl-10 h-11 rounded-xl"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7F8C8D]" />
          </div>
          <div className="flex flex-wrap gap-2">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedDept === dept ? 'bg-[#6DB3D7] text-white' : 'bg-[#EBF5FB] text-[#333] hover:bg-[#6DB3D7]/20'}`}
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
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Stethoscope className="w-14 h-14 text-[#6DB3D7]/50" />
                </div>
              </div>
              <div className="p-5 text-center">
                <h4 className="text-lg font-bold text-[#333] mb-1">{doctor.name}</h4>
                <p className="text-sm text-[#6DB3D7] font-medium mb-2">{doctor.specialty}</p>
                <p className="text-xs text-[#7F8C8D] mb-4 line-clamp-2 leading-relaxed">{doctor.experience}</p>
                <button
                  onClick={() => setCurrentPage('booking')}
                  className="w-full bg-[#6DB3D7] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#5DADE2] transition-colors"
                >
                  إحجز موعد
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-[#7F8C8D]">لا يوجد أطباء في هذا القسم</p>
          </div>
        )}
      </div>
    </main>
  );
}
