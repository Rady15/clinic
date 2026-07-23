'use client';

import { useNavigationStore } from '@/store/navigation-store';
import { Phone, Mail, MapPin, Instagram, Youtube, MessageCircle } from 'lucide-react';

const footerLinks = {
  departments: [
    { label: 'قسم الأسنان', page: 'services' as const, params: { category: 'dental' } },
    { label: 'الجلدية والتجميل', page: 'services' as const, params: { category: 'dermatology' } },
    { label: 'النساء و الولادة', page: 'services' as const, params: { category: 'obstetrics' } },
    { label: 'التغذية و التخسيس', page: 'services' as const, params: { category: 'nutrition' } },
    { label: 'المختبر', page: 'services' as const, params: { category: 'lab' } },
  ],
  quickLinks: [
    { label: 'الرئيسية', page: 'home' as const },
    { label: 'من نحن', page: 'about' as const },
    { label: 'الأطباء', page: 'doctors' as const },
    { label: 'تواصل معنا', page: 'contact' as const },
    { label: 'سياسة الخصوصية', page: 'home' as const },
    { label: 'سياسة الإستبدال و الإسترجاع', page: 'home' as const },
    { label: 'شهادة الإعتماد', page: 'home' as const },
  ],
};

export default function Footer() {
  const { setCurrentPage } = useNavigationStore();

  return (
    <footer className="bg-[#2C3E50] text-white">
      {/* Working Hours Section */}
      <div className="bg-[#6DB3D7]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h3 className="text-2xl font-bold text-center mb-6">مواعيد العمل</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { day: 'الأحد', hours: '8:00 – 24:00' },
              { day: 'الأثنين', hours: '8:00 – 24:00' },
              { day: 'الثلاثاء', hours: '8:00 – 24:00' },
              { day: 'الأربعاء', hours: '8:00 – 24:00' },
              { day: 'الخميس', hours: '8:00 – 24:00' },
              { day: 'السبت', hours: '8:00 – 24:00' },
            ].map((schedule) => (
              <div key={schedule.day} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="font-semibold text-lg">{schedule.day}</p>
                <p className="text-sm opacity-90 mt-1">{schedule.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#6DB3D7] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">C9</span>
              </div>
              <span className="text-lg font-bold">العيادة التاسعة</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              مركز العيادة التاسعة الطبي - نقدم خدمات صحية ذات جودة متميزة وفقا لأعلى المعايير الصحية العالمية
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#6DB3D7] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#6DB3D7] transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://wa.me/0537666284" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#6DB3D7] transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => setCurrentPage(link.page, link.params)}
                    className="text-sm text-gray-300 hover:text-[#6DB3D7] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 className="text-lg font-bold mb-4">الأقسام</h4>
            <ul className="space-y-2">
              {footerLinks.departments.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => setCurrentPage(link.page, link.params)}
                    className="text-sm text-gray-300 hover:text-[#6DB3D7] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">معلومات التواصل</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:9200006802" className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#6DB3D7] transition-colors">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>الرقم الموحد</span>
                  <span className="font-semibold" dir="ltr">9200006802</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@clinic9sa.com" className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#6DB3D7] transition-colors">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>البريد الإلكتروني</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/0537666284" className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#6DB3D7] transition-colors">
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>تواصل واتساب</span>
                  <span className="font-semibold" dir="ltr">0537666284</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-gray-400">
            حقوق الطبع والنشر © 2025 جميع الحقوق محفوظة. مركز كلينك 9 الطبي.
          </p>
          <a href="tel:9200006802" className="flex items-center gap-2 text-sm text-gray-400">
            <Phone className="w-4 h-4" />
            <span>الرقم الموحد</span>
            <span className="font-semibold" dir="ltr">9200006802</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
