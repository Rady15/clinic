import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8" dir="rtl">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-[#6DB3D7] mb-4">404</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">الصفحة غير موجودة</h2>
        <p className="text-gray-600 mb-6">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#6DB3D7] text-white px-6 py-3 rounded-lg hover:bg-[#5DADE2] transition-colors font-medium"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
