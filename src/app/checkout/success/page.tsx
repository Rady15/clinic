'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigationStore } from '@/store/navigation-store';
import { useLanguageStore } from '@/store/language-store';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { setCurrentPage } = useNavigationStore();
  const { locale } = useLanguageStore();
  const [verifying, setVerifying] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) {
      setVerifying(false);
      return;
    }

    fetch(`/api/public/orders?session_id=${sessionId}`)
      .then(r => r.json())
      .then(data => {
        setOrder(data);
        setVerifying(false);
      })
      .catch(() => setVerifying(false));
  }, [sessionId]);

  if (verifying) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#6DB3D7] mx-auto mb-4" />
          <p className="text-[#7F8C8D]">{locale === 'en' ? 'Verifying payment...' : 'جارٍ التحقق من الدفع...'}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl p-12 text-center shadow-lg max-w-md mx-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-[#2C3E50] mb-3">
          {locale === 'en' ? 'Payment Successful!' : 'تم الدفع بنجاح!'}
        </h2>
        <p className="text-[#7F8C8D] mb-6">
          {locale === 'en'
            ? 'Thank you for your order. We will contact you shortly.'
            : 'شكراً لطلبك. سنتواصل معك قريباً.'}
        </p>
        {order && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-right">
            <p><strong>{locale === 'en' ? 'Order ID' : 'رقم الطلب'}:</strong> {order.id}</p>
            <p><strong>{locale === 'en' ? 'Total' : 'الإجمالي'}:</strong> {order.total?.toLocaleString()} {locale === 'en' ? 'SAR' : 'ر.س'}</p>
          </div>
        )}
        <Button onClick={() => setCurrentPage('home')} className="bg-[#6DB3D7] hover:bg-[#5DADE2] text-white px-8 rounded-xl">
          {locale === 'en' ? 'Back to Home' : 'العودة للرئيسية'}
        </Button>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#6DB3D7] mx-auto mb-4" />
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
