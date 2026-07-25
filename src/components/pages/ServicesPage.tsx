'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { useCartStore } from '@/store/cart-store';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';
import { ShoppingCart, SlidersHorizontal, X, Stethoscope, Heart, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
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

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const sidebarVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const heroVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 9;

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

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    services.forEach(s => {
      const key = s.categoryId || 'all';
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [services]);

  if (loading) {
    return (
      <main className="bg-[#F8FAFC] min-h-screen">
        <Skeleton className="h-[400px] w-full bg-gray-200" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-[20px] bg-gray-200" />)}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      {/* Hero Section */}
      <motion.section
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        className="relative h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#6DB3D7] to-[#5DADE2]"
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {pageTitle}
          </h1>

          {/* Category Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <button
              onClick={() => { setSelectedCategory('all'); setCurrentPageNum(1); }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                selectedCategory === 'all'
                  ? 'bg-white text-[#2C3E50] shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
              }`}
            >
              {t('services.all', locale)}
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.slug); setCurrentPageNum(1); }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm flex items-center gap-2 ${
                  selectedCategory === cat.slug
                    ? 'bg-white text-[#2C3E50] shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                }`}
              >
                <span>{locale === 'en' ? cat.nameEn : cat.nameAr}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedCategory === cat.slug ? 'bg-[#6DB3D7] text-white' : 'bg-white/30 text-white'
                }`}>
                  {categoryCounts[cat.id] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Products Grid - 75% */}
          <div className="w-full lg:w-3/4">
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

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedServices.map((service, index) => (
                <ProductCard
                  key={service.id}
                  service={service}
                  index={index}
                  locale={locale}
                  addItem={addItem}
                  t={t}
                />
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

          {/* Sidebar - 25% */}
          <motion.aside
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:block w-1/4 shrink-0"
          >
            <div className="sticky top-28 space-y-6">
              {/* Categories */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-[#2C3E50] mb-4 flex items-center justify-between">
                  {locale === 'en' ? 'Categories' : 'الأقسام'}
                  <SlidersHorizontal className="w-4 h-4" />
                </h3>
                <div className="space-y-1 max-h-64 overflow-y-auto">
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
                      className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${selectedCategory === cat.slug ? 'bg-[#EBF5FB] text-[#6DB3D7] font-semibold' : 'text-[#333] hover:bg-gray-50'}`}
                    >
                      <span>{locale === 'en' ? cat.nameEn : cat.nameAr}</span>
                       <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                         {categoryCounts[cat.id] || 0}
                       </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-[#2C3E50] mb-4">
                  {locale === 'en' ? 'Price Range' : 'نطاق السعر'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
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

              {/* Suggested Products */}
              {services.filter(s => s.isFeatured).slice(0, 3).length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-[#2C3E50] mb-4">
                    {locale === 'en' ? 'Suggested' : 'مقترحات'}
                  </h3>
                  <div className="space-y-3">
                    {services.filter(s => s.isFeatured).slice(0, 3).map(s => (
                      <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        {s.image ? (
                          <img src={s.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 bg-[#EBF5FB] rounded-lg flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-[#6DB3D7]/50" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#333] line-clamp-1">{locale === 'en' ? s.nameEn : s.nameAr}</p>
                          <p className="text-sm font-bold text-[#6DB3D7]">{s.price.toLocaleString()} {t('services.sar', locale)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}

function ProductCard({ service, index, locale, addItem, t }: {
  service: ServiceData;
  index: number;
  locale: string;
  addItem: (item: any) => void;
  t: (key: string, locale: string) => string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="group bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#6DB3D7]/20 transition-all duration-[450ms] ease-out hover:-translate-y-2 border border-[#edf2f7] hover:border-[#6DB3D7] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsButtonHovered(false); }}
    >
      {/* Image Container */}
      <div className="relative h-[320px] overflow-hidden bg-gray-100">
        {service.image ? (
          <img
            src={service.image}
            alt=""
            className="w-full h-full object-cover transition-all duration-[700ms] ease-out group-hover:scale-108 group-hover:brightness-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#EBF5FB] to-[#6DB3D7]/20 flex items-center justify-center">
            <ShoppingCart className="w-16 h-16 text-[#6DB3D7]/40" />
          </div>
        )}

        {/* Discount Badge */}
        {service.originalPrice && service.originalPrice > service.price && (
          <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg z-10">
            {Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)}% {locale === 'en' ? 'OFF' : 'خصم'}
          </span>
        )}

        {/* Badge */}
        {service.badge && !service.originalPrice && (
          <span className="absolute top-4 right-4 bg-[#6DB3D7] text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg z-10">
            {service.badge}
          </span>
        )}

        {/* Offer Badge */}
        {service.isOffer && (
          <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1 z-10">
            <Sparkles className="w-3 h-3" />
            {locale === 'en' ? 'Offer' : 'عرض'}
          </span>
        )}

        {/* Quick Add Button */}
        <div
          className={`absolute inset-x-4 bottom-4 transition-all duration-[350ms] ease-out ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <button
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              addItem({
                id: parseInt(service.id) || 0,
                name: locale === 'en' ? service.nameEn : service.nameAr,
                price: service.price,
                originalPrice: service.originalPrice || undefined,
                image: service.image,
                category: locale === 'en' ? service.category?.nameEn || '' : service.category?.nameAr || '',
              });
            }}
            className="w-full bg-[#6DB3D7] text-white py-4 rounded-[18px] font-bold text-sm shadow-xl hover:bg-[#5DADE2] transition-all duration-300 flex items-center justify-center relative overflow-hidden"
          >
            <span
              className={`transition-all duration-[250ms] ease-out absolute ${
                isButtonHovered ? 'opacity-0 scale-90 rotate-[-10deg]' : 'opacity-100 scale-100 rotate-0'
              }`}
            >
              {t('home.addToCart', locale)}
            </span>
            <ShoppingCart
              className={`w-5 h-5 transition-all duration-[250ms] ease-out absolute ${
                isButtonHovered ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-[-10deg]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <p className="text-xs text-[#6DB3D7] font-semibold mb-2 uppercase tracking-wide">
          {locale === 'en' ? service.category?.nameEn : service.category?.nameAr}
        </p>
        <h4 className="font-bold text-[#2C3E50] mb-3 line-clamp-2 leading-snug min-h-[3rem] text-base">
          {locale === 'en' ? service.nameEn : service.nameAr}
        </h4>
        <div className="flex items-center gap-3">
          {service.originalPrice && service.originalPrice > service.price && (
            <span className="text-sm text-[#7F8C8D] line-through">{service.originalPrice.toLocaleString()} {t('services.sar', locale)}</span>
          )}
          <span className="text-xl font-bold text-[#6DB3D7]">{service.price.toLocaleString()} {t('services.sar', locale)}</span>
        </div>
      </div>
    </motion.div>
  );
}
