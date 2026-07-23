'use client';

import { useState } from 'react';
import { useNavigationStore } from '@/store/navigation-store';
import { useCartStore } from '@/store/cart-store';
import {
  Search, ShoppingCart, User, Menu, X, Phone, ChevronDown, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';

const navItems = [
  { label: 'الرئيسية', page: 'home' as const },
  { label: 'من نحن', page: 'about' as const },
  {
    label: 'العروض', page: 'offers' as const,
    children: [
      { label: 'العروض الرئيسية', page: 'offers' as const },
      { label: 'عروض المختبر', page: 'services' as const, params: { category: 'lab' } },
    ],
  },
  {
    label: 'الخدمات', page: 'services' as const,
    children: [
      { label: 'جلدية', page: 'services' as const, params: { category: 'dermatology' } },
      { label: 'العلاج الطبيعي', page: 'services' as const, params: { category: 'physiotherapy' } },
      { label: 'التجميل النسائي', page: 'services' as const, params: { category: 'femal-cosmetic' } },
      { label: 'الأسنان', page: 'services' as const, params: { category: 'dental' } },
      { label: 'باقات التخسيس', page: 'services' as const, params: { category: 'nutrition' } },
    ],
  },
  { label: 'الأطباء', page: 'doctors' as const },
  { label: 'الأخبار و المقالات', page: 'news' as const },
  { label: 'الوظائف', page: 'jobs' as const },
  {
    label: 'تواصل معنا', page: 'contact' as const,
    children: [
      { label: 'تواصل معنا', page: 'contact' as const },
      { label: 'الشكاوى و الاقتراحات', page: 'rating' as const },
      { label: 'رأيك يهمنا', page: 'rating' as const },
    ],
  },
];

export default function Header() {
  const { currentPage, setCurrentPage, isMobileMenuOpen, setMobileMenuOpen, isSearchOpen, setSearchOpen, isLoginOpen, setLoginOpen } = useNavigationStore();
  const itemCount = useCartStore(s => s.getItemCount());
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#2C3E50] text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-10">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:text-[#6DB3D7] transition-colors">
              <Globe className="w-4 h-4" />
              <span>English</span>
            </button>
          </div>
          <a href="tel:9200006802" className="flex items-center gap-2 hover:text-[#6DB3D7] transition-colors">
            <Phone className="w-4 h-4" />
            <span className="font-semibold" dir="ltr">9200006802</span>
          </a>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-3 shrink-0"
            >
              <div className="w-12 h-12 bg-[#6DB3D7] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">C9</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-[#2C3E50] leading-tight">العيادة التاسعة</h1>
                <p className="text-xs text-[#7F8C8D]">مركز طبي متخصص</p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    onClick={() => {
                      if (!item.children) {
                        setCurrentPage(item.page, item.params);
                      }
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 whitespace-nowrap
                      ${currentPage === item.page ? 'text-[#6DB3D7] bg-[#EBF5FB]' : 'text-[#333] hover:text-[#6DB3D7] hover:bg-[#EBF5FB]/50'}`}
                  >
                    {item.label}
                    {item.children && <ChevronDown className="w-3 h-3" />}
                  </button>
                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.children && openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px] z-50"
                      >
                        {item.children.map((child) => (
                          <button
                            key={child.label}
                            onClick={() => setCurrentPage(child.page, child.params)}
                            className="block w-full text-right px-4 py-2.5 text-sm text-[#333] hover:bg-[#EBF5FB] hover:text-[#6DB3D7] transition-colors"
                          >
                            {child.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full hover:bg-[#EBF5FB] text-[#333] hover:text-[#6DB3D7] transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage('cart')}
                className="p-2 rounded-full hover:bg-[#EBF5FB] text-[#333] hover:text-[#6DB3D7] transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-[#6DB3D7] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCurrentPage('booking')}
                className="hidden md:flex items-center gap-2 bg-[#6DB3D7] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#5DADE2] transition-colors"
              >
                أحجز الأن
              </button>
              <button
                onClick={() => setLoginOpen(true)}
                className="hidden md:flex items-center gap-2 text-sm text-[#333] hover:text-[#6DB3D7] transition-colors"
              >
                <User className="w-5 h-5" />
                <span>دخول / تسجيل جديد</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-full hover:bg-[#EBF5FB] text-[#333] transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="relative max-w-xl mx-auto">
                  <Input
                    placeholder="ابدأ الكتابة لرؤية الخدمات التي تبحث عنها"
                    className="pr-4 pl-12 h-12 rounded-full border-[#6DB3D7] focus:border-[#6DB3D7] text-right"
                    autoFocus
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7F8C8D]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-white z-50 overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-bold text-lg text-[#2C3E50]">القائمة</h3>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <Input
                  placeholder="Search"
                  className="mb-4 h-10 rounded-lg"
                />
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <div key={item.label}>
                      <button
                        onClick={() => setCurrentPage(item.page, item.params)}
                        className={`block w-full text-right px-4 py-3 rounded-lg text-sm font-medium transition-colors
                          ${currentPage === item.page ? 'text-[#6DB3D7] bg-[#EBF5FB]' : 'text-[#333] hover:bg-[#EBF5FB]/50'}`}
                      >
                        {item.label}
                      </button>
                    </div>
                  ))}
                </nav>
                <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                  <button
                    onClick={() => { setCurrentPage('booking'); setMobileMenuOpen(false); }}
                    className="w-full bg-[#6DB3D7] text-white py-3 rounded-lg font-semibold hover:bg-[#5DADE2] transition-colors"
                  >
                    أحجز الأن
                  </button>
                  <button
                    onClick={() => { setLoginOpen(true); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 text-[#333] py-3 rounded-lg border border-gray-200 hover:bg-[#EBF5FB] transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>دخول / تسجيل جديد</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setLoginOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-8 z-50 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#2C3E50]">تسجيل الدخول</h3>
                <button onClick={() => setLoginOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">اسم المستخدم أو البريد الإلكتروني *</label>
                  <Input className="h-11 rounded-lg" placeholder="أدخل بريدك الإلكتروني" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">كلمة المرور *</label>
                  <Input type="password" className="h-11 rounded-lg" placeholder="أدخل كلمة المرور" />
                </div>
                <button className="w-full bg-[#6DB3D7] text-white py-3 rounded-lg font-semibold hover:bg-[#5DADE2] transition-colors">
                  تسجيل دخول
                </button>
                <div className="flex items-center justify-between text-sm">
                  <button className="text-[#6DB3D7] hover:underline">استرجاع كلمة المرور؟</button>
                  <label className="flex items-center gap-2 text-[#7F8C8D]">
                    <input type="checkbox" className="rounded" />
                    تذكرني
                  </label>
                </div>
                <p className="text-center text-sm text-[#7F8C8D]">
                  ليس لديك حساب؟{' '}
                  <button className="text-[#6DB3D7] font-semibold hover:underline">حساب جديد</button>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
