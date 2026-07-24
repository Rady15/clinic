'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { useCartStore } from '@/store/cart-store';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';
import { ShoppingCart, SlidersHorizontal, X, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryData {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  icon: string;
  image: string;
  isActive: boolean;
}

interface ServiceData {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  originalPrice: number | null;
  image: string;
  badge: string;
  isOffer: boolean;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string;
  subcategoryAr: string;
  subcategoryEn: string;
  category?: { nameAr: string; nameEn: string };
}

export default function ServicesPage() {
  const { pageParams, setCurrentPage } = useNavigationStore();
  const addItem = useCartStore(s => s.addItem);
  const { locale } = useLanguageStore();
  const [selectedCategory, setSelectedCategory] = useState(pageParams.category || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 13000]);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;

  useEffect(() => {
    Promise.all([
      fetch('/api/public/service-categories').then(r => r.json()).catch(() => []),
      fetch('/api/public/services').then(r => r.json()).catch(() => []),
    ]).then(([catData, servData]) => {
      setCategories((catData || []).filter((c: CategoryData) => c.isActive !== false));
      setServices((servData || []).filter((s: ServiceData) => s.isActive !== false));
      setLoading(false);
    });
  }, []);

  const filteredServices = useMemo(() => {
    let result = services;

    if (pageParams.category === 'offers' || selectedCategory === 'offers') {
      result = result.filter(s => s.isOffer);
    } else if (selectedCategory !== 'all') {
      result = result.filter(s => s.category?.nameEn?.toLowerCase().includes(selectedCategory) || s.category?.nameAr?.includes(selectedCategory) || s.categoryId === selectedCategory);
    }

    result = result.filter(s => s.price >= priceRange[0] && s.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      default: break;
    }

    return result;
  }, [selectedCategory, sortBy, priceRange, services, pageParams.category]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice((currentPageNum - 1) * itemsPerPage, currentPageNum * itemsPerPage);

  const pageTitle = pageParams.category === 'offers' ? t('services.offers', locale) : t('services.title', locale);

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Skeleton className="h-48 w-full bg-gray-200" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl bg-gray-200" />)}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-l from-[#6DB3D7] to-[#5DADE2] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{pageTitle}</h1>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <button onClick={() => setCurrentPage('home')} className="hover:text-white">{t('nav.home', locale)}</button>
            <span>/</span>
            <span>{pageTitle}</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
              <h3 className="font-bold text-[#2C3E50] mb-4 flex items-center justify-between">
                {locale === 'en' ? 'Categories' : 'الأقسام'}
                <SlidersHorizontal className="w-4 h-4" />
              </h3>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                <button
                  onClick={() => { setSelectedCategory('all'); setCurrentPageNum(1); }}
                  className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === 'all' ? 'bg-[#EBF5FB] text-[#6DB3D7] font-semibold' : 'text-[#333] hover:bg-gray-50'}`}
                >
                  {t('services.all', locale)}
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.slug); setCurrentPageNum(1); }}
                    className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.slug ? 'bg-[#EBF5FB] text-[#6DB3D7] font-semibold' : 'text-[#333] hover:bg-gray-50'}`}
                  >
                    {locale === 'en' ? cat.nameEn : cat.nameAr}
                  </button>
                ))}
              </div>

              {/* Price Filter */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="font-semibold text-sm text-[#2C3E50] mb-3">{t('services.priceRange', locale)}</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="0"
                    value={priceRange[0]}
                    onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-center"
                  />
                  <span className="text-[#7F8C8D]">—</span>
                  <input
                    type="number"
                    placeholder="13000"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-center"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Category Pills - Mobile */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 lg:hidden">
              <button
                onClick={() => { setSelectedCategory('all'); setCurrentPageNum(1); }}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors shrink-0 ${selectedCategory === 'all' ? 'bg-[#6DB3D7] text-white' : 'bg-white text-[#333] border border-gray-200'}`}
              >
                {t('services.all', locale)}
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.slug); setCurrentPageNum(1); }}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors shrink-0 ${selectedCategory === cat.slug ? 'bg-[#6DB3D7] text-white' : 'bg-white text-[#333] border border-gray-200'}`}
                >
                  {locale === 'en' ? cat.nameEn : cat.nameAr}
                </button>
              ))}
            </div>

            {/* Sort Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex items-center justify-between flex-wrap gap-4">
              <p className="text-sm text-[#7F8C8D]">
                {locale === 'en' ? 'Showing' : 'عرض'} <span className="font-semibold text-[#333]">{filteredServices.length}</span> {locale === 'en' ? 'results' : 'نتيجة'}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {locale === 'en' ? 'Filter' : 'تصفية'}
                </button>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                  <option value="default">{locale === 'en' ? 'Default' : 'الترتيب الافتراضي'}</option>
                  <option value="price-asc">{locale === 'en' ? 'Price: Low to High' : 'الأدنى سعراً'}</option>
                  <option value="price-desc">{locale === 'en' ? 'Price: High to Low' : 'الأعلى سعراً'}</option>
                </select>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-white rounded-2xl p-4 shadow-sm mb-6 lg:hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#2C3E50]">{t('services.priceRange', locale)}</h3>
                  <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="0" value={priceRange[0]} onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-center" />
                  <span className="text-[#7F8C8D]">—</span>
                  <input type="number" placeholder="13000" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-center" />
                </div>
              </motion.div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedServices.map((service) => (
                <motion.div key={service.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="product-card bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="h-48 relative overflow-hidden">
                    {service.image ? (
                      <img src={service.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-[#EBF5FB] to-[#6DB3D7]/20 flex items-center justify-center">
                        <ShoppingCart className="w-12 h-12 text-[#6DB3D7]/40" />
                      </div>
                    )}
                    {service.badge && (
                      <span className="absolute top-3 right-3 bg-[#6DB3D7] text-white text-xs px-2.5 py-1 rounded-full font-bold">{service.badge}</span>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-[#7F8C8D] mb-1">{locale === 'en' ? service.category?.nameEn : service.category?.nameAr}</p>
                    <h4 className="font-semibold text-[#333] mb-3 line-clamp-2 leading-relaxed min-h-[3rem]">{locale === 'en' ? service.nameEn : service.nameAr}</h4>
                    <div className="flex items-center gap-2 mb-3">
                      {service.originalPrice && (
                        <span className="text-sm text-[#7F8C8D] line-through">{service.originalPrice.toLocaleString()} {t('services.sar', locale)}</span>
                      )}
                      <span className="text-lg font-bold text-[#6DB3D7]">{service.price.toLocaleString()} {t('services.sar', locale)}</span>
                    </div>
                    <button
                      onClick={() => addItem({
                        id: parseInt(service.id),
                        name: locale === 'en' ? service.nameEn : service.nameAr,
                        price: service.price,
                        originalPrice: service.originalPrice || undefined,
                        image: service.image,
                        category: locale === 'en' ? service.category?.nameEn || '' : service.category?.nameAr || '',
                      })}
                      className="w-full bg-[#6DB3D7] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#5DADE2] transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {t('home.addToCart', locale)}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-[#7F8C8D]">{locale === 'en' ? 'No services found in this category' : 'لا توجد خدمات في هذا القسم'}</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPageNum(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPageNum === page ? 'bg-[#6DB3D7] text-white' : 'bg-white text-[#333] hover:bg-[#EBF5FB]'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
