'use client';

import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { useCartStore } from '@/store/cart-store';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { setCurrentPage } = useNavigationStore();
  const { locale } = useLanguageStore();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-3">{t('cart.empty', locale)}</h2>
          <p className="text-[#7F8C8D] mb-6">{t('cart.emptyDesc', locale)}</p>
          <Button onClick={() => setCurrentPage('services')} className="bg-[#6DB3D7] hover:bg-[#5DADE2] text-white px-8 rounded-xl">
            <ArrowRight className="w-4 h-4 ml-2" />
            {t('cart.continueShopping', locale)}
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-l from-[#6DB3D7] to-[#5DADE2] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
            <button onClick={() => setCurrentPage('home')} className="hover:text-white">{t('nav.home', locale)}</button>
            <span>/</span>
            <span>{t('cart.title', locale)}</span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <motion.div key={item.id} layout className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-20 h-20 bg-[#EBF5FB] rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingCart className="w-8 h-8 text-[#6DB3D7]/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#333] text-sm line-clamp-2 leading-relaxed">{item.name}</h4>
                  <p className="text-xs text-[#7F8C8D] mt-1">{item.category}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {item.originalPrice && (
                      <span className="text-xs text-[#7F8C8D] line-through">{item.originalPrice.toLocaleString()} {t('services.sar', locale)}</span>
                    )}
                    <span className="font-bold text-[#6DB3D7]">{item.price.toLocaleString()} {t('services.sar', locale)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-gray-100 rounded-lg">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-r-lg">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-l-lg">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
            <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 transition-colors">
              {locale === 'en' ? 'Clear cart' : 'تفريغ السلة'}
            </button>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm h-fit sticky top-28">
            <h3 className="font-bold text-[#2C3E50] text-lg mb-6">{locale === 'en' ? 'Order Summary' : 'ملخص الطلب'}</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[#7F8C8D]">{locale === 'en' ? 'Subtotal' : 'المجموع الفرعي'}</span>
                <span className="font-medium">{total.toLocaleString()} {t('services.sar', locale)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#7F8C8D]">{locale === 'en' ? 'Tax (15%)' : 'الضريبة (15%)'}</span>
                <span className="font-medium">{(total * 0.15).toFixed(0)} {t('services.sar', locale)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-bold text-[#2C3E50]">{locale === 'en' ? 'Total' : 'الإجمالي'}</span>
                <span className="font-bold text-[#6DB3D7] text-xl">{(total * 1.15).toFixed(0)} {t('services.sar', locale)}</span>
              </div>
            </div>
            <Button className="w-full bg-[#6DB3D7] hover:bg-[#5DADE2] text-white h-12 font-semibold rounded-xl">
              {t('cart.checkout', locale)}
            </Button>
            <button onClick={() => setCurrentPage('services')} className="w-full text-center text-sm text-[#6DB3D7] font-medium mt-3 hover:underline">
              {t('cart.continueShopping', locale)}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
