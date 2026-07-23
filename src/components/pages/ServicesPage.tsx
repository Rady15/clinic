'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { useCartStore } from '@/store/cart-store';
import { services, serviceCategories } from '@/data/services';
import { ShoppingCart, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ServicesPage() {
  const { pageParams, setCurrentPage } = useNavigationStore();
  const addItem = useCartStore(s => s.addItem);
  const [selectedCategory, setSelectedCategory] = useState(pageParams.category || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 13000]);
  const [currentPage, setCurrentPageNum] = useState(1);
  const itemsPerPage = 12;

  const filteredServices = useMemo(() => {
    let result = services;

    if (selectedCategory === 'offers') {
      result = result.filter(s => s.isOffer);
    } else if (selectedCategory !== 'all') {
      result = result.filter(s => {
        const cat = serviceCategories.find(c => c.slug === selectedCategory);
        return s.category === cat?.name || s.subcategory === cat?.name;
      });
    }

    if (selectedSubcategory) {
      result = result.filter(s => s.subcategory === selectedSubcategory);
    }

    result = result.filter(s => s.price >= priceRange[0] && s.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => b.id - a.id); break;
      default: break;
    }

    return result;
  }, [selectedCategory, selectedSubcategory, sortBy, priceRange]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeCategory = serviceCategories.find(c => c.slug === selectedCategory);

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-l from-[#6DB3D7] to-[#5DADE2] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            {selectedCategory === 'offers' ? 'العروض' : 'الخدمات'}
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <button onClick={() => setCurrentPage('home')} className="hover:text-white">الرئيسية</button>
            <span>/</span>
            <span>{selectedCategory === 'offers' ? 'العروض' : 'الخدمات'}</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
              <h3 className="font-bold text-[#2C3E50] mb-4 flex items-center justify-between">
                الأقسام
                <SlidersHorizontal className="w-4 h-4" />
              </h3>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {serviceCategories.map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => { setSelectedCategory(cat.slug); setSelectedSubcategory(null); setCurrentPageNum(1); }}
                    className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between
                      ${selectedCategory === cat.slug ? 'bg-[#EBF5FB] text-[#6DB3D7] font-semibold' : 'text-[#333] hover:bg-gray-50'}`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-[#7F8C8D]">({cat.count})</span>
                  </button>
                ))}
              </div>

              {/* Price Filter */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="font-semibold text-sm text-[#2C3E50] mb-3">حسب السعر</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="أدنى سعر"
                    value={priceRange[0]}
                    onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-center"
                  />
                  <span className="text-[#7F8C8D]">—</span>
                  <input
                    type="number"
                    placeholder="أعلى سعر"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-center"
                  />
                </div>
              </div>

              {/* Subcategories */}
              {activeCategory?.subcategories && activeCategory.subcategories.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="font-semibold text-sm text-[#2C3E50] mb-3">الأقسام الفرعية</h4>
                  <div className="space-y-1">
                    {activeCategory.subcategories.map(sub => (
                      <button
                        key={sub.name}
                        onClick={() => { setSelectedSubcategory(sub.name); setCurrentPageNum(1); }}
                        className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between
                          ${selectedSubcategory === sub.name ? 'bg-[#EBF5FB] text-[#6DB3D7] font-semibold' : 'text-[#333] hover:bg-gray-50'}`}
                      >
                        <span>{sub.name}</span>
                        <span className="text-xs text-[#7F8C8D]">({sub.count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Category Pills - Mobile */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 lg:hidden">
              {serviceCategories.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => { setSelectedCategory(cat.slug); setSelectedSubcategory(null); setCurrentPageNum(1); }}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors shrink-0
                    ${selectedCategory === cat.slug ? 'bg-[#6DB3D7] text-white' : 'bg-white text-[#333] border border-gray-200'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Sort Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex items-center justify-between flex-wrap gap-4">
              <p className="text-sm text-[#7F8C8D]">
                عرض <span className="font-semibold text-[#333]">{filteredServices.length}</span> نتيجة
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  تصفية
                </button>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                >
                  <option value="default">الترتيب الافتراضي</option>
                  <option value="price-asc">الأدنى سعراً</option>
                  <option value="price-desc">الأعلى سعراً</option>
                  <option value="newest">الأحدث</option>
                </select>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-white rounded-2xl p-4 shadow-sm mb-6 lg:hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#2C3E50]">الأقسام</h3>
                  <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {serviceCategories.map(cat => (
                    <button key={cat.slug} onClick={() => { setSelectedCategory(cat.slug); setCurrentPageNum(1); }} className={`px-3 py-1.5 rounded-lg text-sm ${selectedCategory === cat.slug ? 'bg-[#6DB3D7] text-white' : 'bg-gray-100 text-[#333]'}`}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedServices.map((service) => (
                <motion.div key={service.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="product-card bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="h-48 bg-gradient-to-br from-[#EBF5FB] to-[#6DB3D7]/20 flex items-center justify-center relative">
                    {service.badge && (
                      <span className="absolute top-3 right-3 bg-[#6DB3D7] text-white text-xs px-2.5 py-1 rounded-full font-bold">{service.badge}</span>
                    )}
                    <ShoppingCart className="w-12 h-12 text-[#6DB3D7]/40" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-[#7F8C8D] mb-1">{service.category} {service.subcategory !== service.category && `, ${service.subcategory}`}</p>
                    <h4 className="font-semibold text-[#333] mb-3 line-clamp-2 leading-relaxed min-h-[3rem]">{service.name}</h4>
                    <div className="flex items-center gap-2 mb-3">
                      {service.originalPrice && (
                        <span className="text-sm text-[#7F8C8D] line-through">{service.originalPrice.toLocaleString()} ر.س</span>
                      )}
                      <span className="text-lg font-bold text-[#6DB3D7]">{service.price.toLocaleString()} ر.س</span>
                    </div>
                    <button
                      onClick={() => addItem({ id: service.id, name: service.name, price: service.price, originalPrice: service.originalPrice, image: service.image, category: service.category })}
                      className="w-full bg-[#6DB3D7] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#5DADE2] transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      إضافة إلى السلة
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-[#7F8C8D]">لا توجد خدمات في هذا القسم</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPageNum(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors
                      ${currentPage === page ? 'bg-[#6DB3D7] text-white' : 'bg-white text-[#333] hover:bg-[#EBF5FB]'}`}
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
