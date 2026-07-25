'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNavigationStore } from '@/store/navigation-store';
import { useCartStore } from '@/store/cart-store';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';
import {
  Search, ShoppingCart, User, Menu, X, Phone, ChevronDown, Globe, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface NavItemData {
  id: string;
  labelAr: string;
  labelEn: string;
  page: string;
  params: string;
  parentId: string | null;
  children?: NavItemData[];
}

interface SearchResult {
  type: 'service' | 'doctor';
  nameAr: string;
  nameEn: string;
}

export default function Header() {
  const { currentPage, setCurrentPage, isMobileMenuOpen, setMobileMenuOpen, isSearchOpen, setSearchOpen, isLoginOpen, setLoginOpen } = useNavigationStore();
  const itemCount = useCartStore(s => s.getItemCount());
  const { locale, setLocale } = useLanguageStore();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [navItems, setNavItems] = useState<NavItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('9200006802');
  const [logoUrl, setLogoUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetch('/api/public/nav-items')
      .then(r => r.json())
      .then((data: NavItemData[]) => {
        const parents = data.filter((n: NavItemData) => !n.parentId && n.page !== 'admin');
        setNavItems(parents.sort((a: NavItemData, b: NavItemData) => (parseInt(a.id.slice(-2)) || 0) - (parseInt(b.id.slice(-2)) || 0)));
      })
      .catch(() => {
        setNavItems([
          { id: 'f1', labelAr: 'الرئيسية', labelEn: 'Home', page: 'home', params: '{}', parentId: null },
          { id: 'f2', labelAr: 'من نحن', labelEn: 'About Us', page: 'about', params: '{}', parentId: null },
          { id: 'f3', labelAr: 'العروض', labelEn: 'Offers', page: 'offers', params: '{}', parentId: null, children: [
            { id: 'f3a', labelAr: 'العروض الرئيسية', labelEn: 'Main Offers', page: 'offers', params: '{}', parentId: 'f3' },
          ]},
          { id: 'f4', labelAr: 'الخدمات', labelEn: 'Services', page: 'services', params: '{}', parentId: null, children: [
            { id: 'f4a', labelAr: 'جلدية', labelEn: 'Dermatology', page: 'services', params: '{"category":"dermatology"}', parentId: 'f4' },
            { id: 'f4b', labelAr: 'العلاج الطبيعي', labelEn: 'Physiotherapy', page: 'services', params: '{"category":"physiotherapy"}', parentId: 'f4' },
            { id: 'f4c', labelAr: 'التجميل النسائي', labelEn: 'Female Cosmetic', page: 'services', params: '{"category":"femal-cosmetic"}', parentId: 'f4' },
            { id: 'f4d', labelAr: 'الأسنان', labelEn: 'Dental', page: 'services', params: '{"category":"dental"}', parentId: 'f4' },
            { id: 'f4e', labelAr: 'باقات التخسيس', labelEn: 'Slimming Packages', page: 'services', params: '{"category":"nutrition"}', parentId: 'f4' },
          ]},
          { id: 'f5', labelAr: 'الأطباء', labelEn: 'Doctors', page: 'doctors', params: '{}', parentId: null },
          { id: 'f6', labelAr: 'الأخبار و المقالات', labelEn: 'News & Articles', page: 'news', params: '{}', parentId: null },
          { id: 'f7', labelAr: 'الوظائف', labelEn: 'Jobs', page: 'jobs', params: '{}', parentId: null },
          { id: 'f8', labelAr: 'تواصل معنا', labelEn: 'Contact Us', page: 'contact', params: '{}', parentId: null, children: [
            { id: 'f8a', labelAr: 'تواصل معنا', labelEn: 'Contact Us', page: 'contact', params: '{}', parentId: 'f8' },
            { id: 'f8b', labelAr: 'رأيك يهمنا', labelEn: 'Your Opinion Matters', page: 'rating', params: '{}', parentId: 'f8' },
            { id: 'f8c', labelAr: 'الشكاوى والاقتراحات', labelEn: 'Complaints & Suggestions', page: 'rating', params: '{}', parentId: 'f8' },
          ]},
        ]);
      });
    fetch('/api/public/settings')
      .then(r => r.json())
      .then((data: Record<string, string>) => {
        if (data.phone) setPhone(data.phone);
        if (data.logo_url) setLogoUrl(data.logo_url);
      })
      .catch(() => {})
      .finally(() => { setLoading(false); });
  }, []);

  const handleNavClick = useCallback((item: NavItemData) => {
    let params: Record<string, string> = {};
    try {
      params = item.params ? JSON.parse(item.params) : {};
    } catch { /* ignore */ }
    setCurrentPage(item.page as any, params);
    setOpenDropdown(null);
  }, [setCurrentPage]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/public/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.services?.map((s: any) => ({ type: 'service' as const, nameAr: s.nameAr, nameEn: s.nameEn })) || []);
      setSearchResults(prev => [
        ...prev,
        ...(data.doctors?.map((d: any) => ({ type: 'doctor' as const, nameAr: d.nameAr, nameEn: d.nameEn })) || []),
      ]);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full bg-gray-200" />
        <Skeleton className="h-20 w-full bg-gray-200" />
      </div>
    );
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#2C3E50] text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 hover:text-[#6DB3D7] transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>
          <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-[#6DB3D7] transition-colors">
            <Phone className="w-4 h-4" />
            <span className="font-semibold" dir="ltr">{phone}</span>
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
              {logoUrl ? (
                <img src={logoUrl} alt="" className="w-12 h-12 object-contain" />
              ) : (
                <div className="w-12 h-12 bg-[#6DB3D7] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C9</span>
                </div>
              )}
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-[#2C3E50] leading-tight">
                  {locale === 'en' ? 'Clinic 9' : 'العيادة التاسعة'}
                </h1>
                <p className="text-xs text-[#7F8C8D]">
                  {locale === 'en' ? 'Specialized Medical Center' : 'مركز طبي متخصص'}
                </p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const hasDropdown = item.children && item.children.length > 0;
                const isOpen = openDropdown === item.id;

                return (
                  <div
                    key={item.id}
                    className="relative"
                  >
                    <button
                      onClick={() => hasDropdown ? setOpenDropdown(isOpen ? null : item.id) : handleNavClick(item)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 whitespace-nowrap
                        ${currentPage === item.page ? 'text-[#6DB3D7] bg-[#EBF5FB]' : 'text-[#333] hover:text-[#6DB3D7] hover:bg-[#EBF5FB]/50'}`}
                    >
                      {locale === 'en' ? item.labelEn : item.labelAr}
                      {hasDropdown && <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
                    </button>
                    {/* Dropdown */}
                    {hasDropdown && isOpen && (
                      <div
                        className="absolute top-full start-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px] z-[60]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.children!.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => handleNavClick(child)}
                            className="block w-full text-start px-4 py-2.5 text-sm text-[#333] hover:bg-[#EBF5FB] hover:text-[#6DB3D7] transition-colors"
                          >
                            {locale === 'en' ? child.labelEn : child.labelAr}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
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
                {t('header.bookNow', locale)}
              </button>
              <button
                onClick={() => setLoginOpen(true)}
                className="hidden md:flex items-center gap-2 text-sm text-[#333] hover:text-[#6DB3D7] transition-colors"
              >
                <User className="w-5 h-5" />
                <span>{t('header.login', locale)}</span>
              </button>
              {/* Admin link */}
              <button
                onClick={() => setCurrentPage('admin')}
                className="p-2 rounded-full hover:bg-gray-100 text-[#7F8C8D] hover:text-[#333] transition-colors"
                title="Admin"
              >
                <Settings className="w-4 h-4" />
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
                    placeholder={t('header.search', locale)}
                    className="pr-4 pl-12 h-12 rounded-full border-[#6DB3D7] focus:border-[#6DB3D7]"
                    autoFocus
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7F8C8D]" />
                  {searchResults.length > 0 && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 max-h-64 overflow-y-auto z-50">
                      {searchResults.map((r, i) => (
                        <div key={i} className="px-4 py-3 hover:bg-[#EBF5FB] text-sm cursor-pointer border-b border-gray-50 last:border-0">
                          <span className="text-xs text-[#7F8C8D]">
                            {r.type === 'service' ? (locale === 'en' ? 'Service' : 'خدمة') : (locale === 'en' ? 'Doctor' : 'طبيب')}
                          </span>
                          <p className="text-[#333]">{locale === 'en' ? r.nameEn : r.nameAr}</p>
                        </div>
                      ))}
                    </div>
                  )}
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
              initial={{ x: locale === 'ar' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: locale === 'ar' ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 ${locale === 'ar' ? 'right-0' : 'left-0'} bottom-0 w-[300px] bg-white z-50 overflow-y-auto shadow-2xl`}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-bold text-lg text-[#2C3E50]">{t('header.menu', locale)}</h3>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <div key={item.id}>
                      <button
                        onClick={() => { handleNavClick(item); setMobileMenuOpen(false); }}
                        className={`block w-full text-right px-4 py-3 rounded-lg text-sm font-medium transition-colors
                          ${currentPage === item.page ? 'text-[#6DB3D7] bg-[#EBF5FB]' : 'text-[#333] hover:bg-[#EBF5FB]/50'}`}
                      >
                        {locale === 'en' ? item.labelEn : item.labelAr}
                      </button>
                      {item.children && (
                        <div className="ps-4 mt-1 space-y-1">
                          {item.children.map(child => (
                            <button
                              key={child.id}
                              onClick={() => { handleNavClick(child); setMobileMenuOpen(false); }}
                              className="block w-full text-right px-4 py-2 rounded-lg text-sm text-[#7F8C8D] hover:bg-[#EBF5FB]/50 hover:text-[#6DB3D7] transition-colors"
                            >
                              {locale === 'en' ? child.labelEn : child.labelAr}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
                <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                  <button
                    onClick={() => { setCurrentPage('booking'); setMobileMenuOpen(false); }}
                    className="w-full bg-[#6DB3D7] text-white py-3 rounded-lg font-semibold hover:bg-[#5DADE2] transition-colors"
                  >
                    {t('header.bookNow', locale)}
                  </button>
                  <button
                    onClick={() => { setLoginOpen(true); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 text-[#333] py-3 rounded-lg border border-gray-200 hover:bg-[#EBF5FB] transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>{t('header.login', locale)}</span>
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
                <h3 className="text-xl font-bold text-[#2C3E50]">
                  {locale === 'en' ? 'Login' : 'تسجيل الدخول'}
                </h3>
                <button onClick={() => setLoginOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">{t('header.username', locale)} *</label>
                  <Input className="h-11 rounded-lg" placeholder={locale === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">{t('header.password', locale)} *</label>
                  <Input type="password" className="h-11 rounded-lg" placeholder={locale === 'en' ? 'Enter password' : 'أدخل كلمة المرور'} />
                </div>
                <button className="w-full bg-[#6DB3D7] text-white py-3 rounded-lg font-semibold hover:bg-[#5DADE2] transition-colors">
                  {t('header.loginBtn', locale)}
                </button>
                <div className="flex items-center justify-between text-sm">
                  <button className="text-[#6DB3D7] hover:underline">{t('header.forgot', locale)}</button>
                  <label className="flex items-center gap-2 text-[#7F8C8D]">
                    <input type="checkbox" className="rounded" />
                    {t('header.remember', locale)}
                  </label>
                </div>
                <p className="text-center text-sm text-[#7F8C8D]">
                  {t('header.noAccount', locale)}{' '}
                  <button className="text-[#6DB3D7] font-semibold hover:underline">{t('header.newAccount', locale)}</button>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
