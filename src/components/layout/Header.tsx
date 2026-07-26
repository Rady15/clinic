'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNavigationStore } from '@/store/navigation-store';
import { useCartStore } from '@/store/cart-store';
import CurrencySymbol from '@/components/ui/currency-symbol';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';
import {
  Search, ShoppingCart, User, Menu, X, Phone, ChevronDown, Globe, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { signIn, signOut, useSession } from 'next-auth/react';

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
  const cartTotal = useCartStore(s => s.getTotal());
  const { locale, setLocale } = useLanguageStore();
  const { data: session } = useSession();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [navItems, setNavItems] = useState<NavItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('9200006802');
  const [logoUrl, setLogoUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const isLoggedIn = !!session;
  const isAdmin = userRole === 'admin';

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

  // Fetch user role when logged in
  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/auth/me?email=${encodeURIComponent(session.user.email)}`)
        .then(r => r.json())
        .then(data => { if (data.role) setUserRole(data.role); })
        .catch(() => {});
    } else {
      setUserRole(null);
    }
  }, [session]);

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

  const handleLoginClick = () => {
    if (isAdmin) {
      setCurrentPage('admin');
    } else {
      setLoginOpen(true);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setUserRole(null);
    setCurrentPage('home');
  };

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
      <header className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo Only */}
            <button
              onClick={() => setCurrentPage('home')}
              className="shrink-0"
            >
              {logoUrl ? (
                <img src={logoUrl} alt="Clinic 9" className="h-14 w-auto object-contain" />
              ) : (
                <div className="h-14 w-14 bg-[#6DB3D7] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C9</span>
                </div>
              )}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const hasDropdown = item.children && item.children.length > 0;
                const isOpen = openDropdown === item.id;

                return (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => hasDropdown ? setOpenDropdown(isOpen ? null : item.id) : handleNavClick(item)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 whitespace-nowrap
                        ${currentPage === item.page ? 'text-[#6DB3D7] bg-[#EBF5FB]' : 'text-[#333] hover:text-[#6DB3D7] hover:bg-[#EBF5FB]/50'}`}
                    >
                      {locale === 'en' ? item.labelEn : item.labelAr}
                      {hasDropdown && <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
                    </button>
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
                className="flex items-center gap-1.5 p-2 rounded-full hover:bg-[#EBF5FB] text-[#333] hover:text-[#6DB3D7] transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-[#6DB3D7] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
                {cartTotal > 0 && (
                  <span className="hidden sm:flex items-center text-xs font-bold text-[#6DB3D7]">
                    {cartTotal.toLocaleString()} <CurrencySymbol className="h-3.5 w-auto inline-block" />
                  </span>
                )}
              </button>
              <button
                onClick={() => setCurrentPage('booking')}
                className="hidden md:flex items-center gap-2 bg-[#6DB3D7] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#5DADE2] transition-colors"
              >
                {t('header.bookNow', locale)}
              </button>

              {/* Login / User Menu */}
              {isLoggedIn ? (
                <div className="hidden md:flex items-center gap-2">
                  {isAdmin && (
                    <button
                      onClick={() => setCurrentPage('admin')}
                      className="flex items-center gap-2 bg-[#2C3E50] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#34495E] transition-colors"
                    >
                      {locale === 'en' ? 'Dashboard' : 'لوحة التحكم'}
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-[#7F8C8D] hover:text-red-500 transition-colors p-2"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="hidden md:flex items-center gap-2 text-sm text-[#333] hover:text-[#6DB3D7] transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{t('header.login', locale)}</span>
                </button>
              )}

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
                  {isLoggedIn ? (
                    <>
                      {isAdmin && (
                        <button
                          onClick={() => { setCurrentPage('admin'); setMobileMenuOpen(false); }}
                          className="w-full bg-[#2C3E50] text-white py-3 rounded-lg font-semibold hover:bg-[#34495E] transition-colors"
                        >
                          {locale === 'en' ? 'Dashboard' : 'لوحة التحكم'}
                        </button>
                      )}
                      <button
                        onClick={async () => { await handleLogout(); setMobileMenuOpen(false); }}
                        className="w-full flex items-center justify-center gap-2 text-red-500 py-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>{locale === 'en' ? 'Logout' : 'تسجيل خروج'}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { setLoginOpen(true); setMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 text-[#333] py-3 rounded-lg border border-gray-200 hover:bg-[#EBF5FB] transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span>{t('header.login', locale)}</span>
                    </button>
                  )}
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
              <HeaderLoginForm onClose={() => setLoginOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function HeaderLoginForm({ onClose }: { onClose: () => void }) {
  const { locale } = useLanguageStore();
  const { setCurrentPage } = useNavigationStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError(locale === 'en' ? 'Invalid email or password' : 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } else {
      // Check user role and redirect
      try {
        const meRes = await fetch(`/api/auth/me?email=${encodeURIComponent(email)}`);
        const meData = await meRes.json();
        onClose();
        if (meData.role === 'admin') {
          setCurrentPage('admin');
        } else {
          setCurrentPage('home');
        }
      } catch {
        onClose();
        setCurrentPage('home');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-500 bg-red-50 p-2 rounded-lg">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-[#333] mb-1">{locale === 'en' ? 'Email or Username' : 'البريد الإلكتروني أو اسم المستخدم'} *</label>
        <Input className="h-11 rounded-lg" type="text" placeholder={locale === 'en' ? 'Enter email or username' : 'أدخل البريد الإلكتروني أو اسم المستخدم'} value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#333] mb-1">{t('header.password', locale)} *</label>
        <Input type="password" className="h-11 rounded-lg" placeholder={locale === 'en' ? 'Enter password' : 'أدخل كلمة المرور'} value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-[#6DB3D7] text-white py-3 rounded-lg font-semibold hover:bg-[#5DADE2] transition-colors disabled:opacity-50">
        {loading ? '...' : t('header.loginBtn', locale)}
      </button>
      <div className="flex items-center justify-between text-sm">
        <button type="button" onClick={() => { onClose(); setCurrentPage('account'); }} className="text-[#6DB3D7] hover:underline">{t('header.forgot', locale)}</button>
        <label className="flex items-center gap-2 text-[#7F8C8D]">
          <input type="checkbox" className="rounded" />
          {t('header.remember', locale)}
        </label>
      </div>
      <p className="text-center text-sm text-[#7F8C8D]">
        {t('header.noAccount', locale)}{' '}
        <button type="button" onClick={() => { onClose(); setCurrentPage('account'); }} className="text-[#6DB3D7] font-semibold hover:underline">{t('header.newAccount', locale)}</button>
      </p>
      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-[#7F8C8D]">{locale === 'en' ? 'OR' : 'أو'}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <button type="button" onClick={() => signIn('google', { callbackUrl: '/' })} className="w-full border border-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm text-[#333]">
        <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        {locale === 'en' ? 'Continue with Google' : 'التسجيل بحساب جوجل'}
      </button>
    </form>
  );
}
