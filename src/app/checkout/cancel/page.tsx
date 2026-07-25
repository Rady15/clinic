'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigationStore } from '@/store/navigation-store';
import { useLanguageStore } from '@/store/language-store';

export default function CheckoutCancelPage() {
  const { setCurrentPage } = useNavigationStore();
  const { locale } = useLanguageStore();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl p-12 text-center shadow-lg max-w-md mx-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <X className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-[#2C3E50] mb-3">
          {locale === 'en' ? 'Payment Cancelled' : 'تم إلغاء الدفع'}
        </h2>
        <p className="text-[#7F8C8D] mb-6">
          {locale === 'en'
            ? 'Your payment was cancelled. You can try again when you are ready.'
            : 'تم إلغاء الدفع. يمكنك المحاولة مرة أخرى عندما تكون مستعداً.'}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => setCurrentPage('cart')} className="bg-[#6DB3D7] hover:bg-[#5DADE2] text-white px-8 rounded-xl">
            {locale === 'en' ? 'Back to Cart' : 'العودة للسلة'}
          </Button>
          <Button onClick={() => setCurrentPage('home')} variant="outline" className="px-8 rounded-xl">
            {locale === 'en' ? 'Home' : 'الرئيسية'}
          </Button>
        </div>
      </div>
    </main>
  );
}
