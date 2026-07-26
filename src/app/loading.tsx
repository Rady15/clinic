export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#6DB3D7]/30 border-t-[#6DB3D7] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    </div>
  );
}
