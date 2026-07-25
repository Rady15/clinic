// Simple i18n system for Arabic/English
export type Locale = 'ar' | 'en';

const translations: Record<string, Record<Locale, string>> = {
  // Navigation
  'nav.home': { ar: 'الرئيسية', en: 'Home' },
  'nav.about': { ar: 'من نحن', en: 'About Us' },
  'nav.offers': { ar: 'العروض', en: 'Offers' },
  'nav.mainOffers': { ar: 'العروض الرئيسية', en: 'Main Offers' },
  'nav.labOffers': { ar: 'عروض المختبر', en: 'Lab Offers' },
  'nav.services': { ar: 'الخدمات', en: 'Services' },
  'nav.dermatology': { ar: 'جلدية', en: 'Dermatology' },
  'nav.physiotherapy': { ar: 'العلاج الطبيعي', en: 'Physiotherapy' },
  'nav.femaleCosmetic': { ar: 'التجميل النسائي', en: 'Female Cosmetic' },
  'nav.dental': { ar: 'الأسنان', en: 'Dental' },
  'nav.nutrition': { ar: 'باقات التخسيس', en: 'Slimming Packages' },
  'nav.doctors': { ar: 'الأطباء', en: 'Doctors' },
  'nav.news': { ar: 'الأخبار و المقالات', en: 'News & Articles' },
  'nav.jobs': { ar: 'الوظائف', en: 'Jobs' },
  'nav.contact': { ar: 'تواصل معنا', en: 'Contact Us' },
  'nav.complaints': { ar: 'الشكاوى و الاقتراحات', en: 'Complaints & Suggestions' },
  'nav.yourOpinion': { ar: 'رأيك يهمنا', en: 'Your Opinion Matters' },
  'nav.cart': { ar: 'السلة', en: 'Cart' },
  'nav.booking': { ar: 'حجز موعد', en: 'Book Appointment' },
  'nav.account': { ar: 'حسابي', en: 'My Account' },

  // Header
  'header.login': { ar: 'دخول / تسجيل جديد', en: 'Login / Register' },
  'header.bookNow': { ar: 'أحجز الأن', en: 'Book Now' },
  'header.search': { ar: 'ابدأ الكتابة لرؤية الخدمات التي تبحث عنها', en: 'Start typing to see the services you are looking for' },
  'header.menu': { ar: 'القائمة', en: 'Menu' },
  'header.username': { ar: 'اسم المستخدم أو البريد الإلكتروني', en: 'Username or Email' },
  'header.password': { ar: 'كلمة المرور', en: 'Password' },
  'header.loginBtn': { ar: 'تسجيل دخول', en: 'Login' },
  'header.forgot': { ar: 'استرجاع كلمة المرور؟', en: 'Forgot Password?' },
  'header.remember': { ar: 'تذكرني', en: 'Remember Me' },
  'header.noAccount': { ar: 'ليس لديك حساب؟', en: 'Don\'t have an account?' },
  'header.newAccount': { ar: 'حساب جديد', en: 'New Account' },

  // Hero
  'hero.workingHours': { ar: 'مواعيد العمل:', en: 'Working Hours:' },
  'hero.workingHoursText': { ar: 'من 8 صباحًا الى 12 مساءً طوال الأسبوع', en: '8 AM to 12 AM throughout the week' },

  // Home sections
  'home.ourServices': { ar: 'خدماتنا', en: 'Our Services' },
  'home.smilePayLater': { ar: 'ابتسم الآن وادفع لاحقا', en: 'Smile Now, Pay Later' },
  'home.smilePayLaterDesc': { ar: 'استمتع بخدماتنا وادفع على أقساط مريحة مع تمارا', en: 'Enjoy our services and pay in comfortable installments with Tamara' },
  'home.browseServices': { ar: 'تصفح الخدمات', en: 'Browse Services' },
  'home.suggestedServices': { ar: 'خدمات مقترحة لك', en: 'Suggested Services For You' },
  'home.addToCart': { ar: 'إضافة إلى السلة', en: 'Add to Cart' },
  'home.viewAllServices': { ar: 'عرض جميع الخدمات', en: 'View All Services' },
  'home.ourDoctors': { ar: 'أطبائنا', en: 'Our Doctors' },
  'home.bookAppointment': { ar: 'إحجز موعد', en: 'Book Appointment' },
  'home.viewAllDoctors': { ar: 'عرض جميع الأطباء', en: 'View All Doctors' },
  'home.clientReviews': { ar: 'أراء عملاء عيادة التاسعة', en: 'Clinic 9 Client Reviews' },
  'home.clinicVideos': { ar: 'فيديوهات العيادة', en: 'Clinic Videos' },
  'home.medicalNews': { ar: 'كل جديد من تطورات الدراسات الطبية', en: 'Latest Developments in Medical Studies' },
  'home.continueReading': { ar: 'تابع القراءة', en: 'Continue Reading' },
  'home.contactBook': { ar: 'تواصل معنا لحجز موعد', en: 'Contact Us to Book an Appointment' },
  'home.contactDesc': { ar: 'نحن هنا لمساعدتك. احجز موعدك الآن وتواصل معنا مباشرة', en: 'We are here to help. Book your appointment now and contact us directly' },
  'home.bookBtn': { ar: 'حجز موعد', en: 'Book Appointment' },
  'home.callUs': { ar: 'اتصل بنا:', en: 'Call Us:' },
  'home.insurance': { ar: 'شركات التأمين', en: 'Insurance Companies' },

  // Before & After Section
  'beforeAfter.badge': { ar: 'قبل وبعد', en: 'Before & After' },
  'beforeAfter.title': { ar: 'بعض من قصص النجاح', en: 'Some Success Stories' },
  'beforeAfter.subtitle': { ar: 'شاهد نتائج حقيقية لمرضانا قبل وبعد العلاج', en: 'See real results of our patients before and after treatment' },
  'beforeAfter.before': { ar: 'قبل', en: 'Before' },
  'beforeAfter.after': { ar: 'بعد', en: 'After' },

  // Services page
  'services.title': { ar: 'الخدمات', en: 'Services' },
  'services.offers': { ar: 'العروض', en: 'Offers' },
  'services.all': { ar: 'الكل', en: 'All' },
  'services.sortBy': { ar: 'ترتيب حسب', en: 'Sort By' },
  'services.priceRange': { ar: 'نطاق السعر', en: 'Price Range' },
  'services.sar': { ar: '﷼', en: 'SAR' },

  // Doctors page
  'doctors.title': { ar: 'الأطباء', en: 'Doctors' },
  'doctors.team': { ar: 'فريق العمل', en: 'Our Team' },
  'doctors.allDept': { ar: 'الكل', en: 'All' },

  // About page
  'about.title': { ar: 'من نحن', en: 'About Us' },

  // Contact page
  'contact.title': { ar: 'تواصل معنا', en: 'Contact Us' },
  'contact.name': { ar: 'الاسم', en: 'Name' },
  'contact.email': { ar: 'البريد الإلكتروني', en: 'Email' },
  'contact.phone': { ar: 'الهاتف', en: 'Phone' },
  'contact.subject': { ar: 'الموضوع', en: 'Subject' },
  'contact.message': { ar: 'الرسالة', en: 'Message' },
  'contact.send': { ar: 'إرسال', en: 'Send' },
  'contact.workingHours': { ar: 'ساعات العمل', en: 'Working Hours' },
  'contact.address': { ar: 'العنوان', en: 'Address' },

  // Booking page
  'booking.title': { ar: 'حجز موعد', en: 'Book Appointment' },
  'booking.service': { ar: 'الخدمة', en: 'Service' },
  'booking.chooseDoctor': { ar: 'اختيار الطبيب', en: 'Choose Doctor' },
  'booking.confirm': { ar: 'التأكيد والدفع', en: 'Confirm & Pay' },
  'booking.submit': { ar: 'إرسال', en: 'Submit' },
  'booking.name': { ar: 'الاسم', en: 'Name' },
  'booking.phone': { ar: 'الهاتف', en: 'Phone' },
  'booking.email': { ar: 'البريد الإلكتروني', en: 'Email' },
  'booking.department': { ar: 'القسم', en: 'Department' },
  'booking.date': { ar: 'التاريخ', en: 'Date' },
  'booking.time': { ar: 'الوقت', en: 'Time' },
  'booking.notes': { ar: 'ملاحظات', en: 'Notes' },

  // Cart page
  'cart.title': { ar: 'سلة المشتريات', en: 'Shopping Cart' },
  'cart.empty': { ar: 'سلة مشترياتك فارغة حالياً.', en: 'Your shopping cart is currently empty.' },
  'cart.emptyDesc': { ar: 'أضف منتجات إلى سلتك قبل المتابعة', en: 'Add products to your cart before proceeding' },
  'cart.continueShopping': { ar: 'متابعة التسوق', en: 'Continue Shopping' },
  'cart.checkout': { ar: 'إتمام الشراء', en: 'Checkout' },
  'cart.total': { ar: 'المجموع', en: 'Total' },
  'cart.remove': { ar: 'حذف', en: 'Remove' },

  // News page
  'news.title': { ar: 'الأخبار و المقالات', en: 'News & Articles' },
  'news.readMore': { ar: 'قراءة المزيد', en: 'Read More' },
  'news.minRead': { ar: 'دقائق قراءة', en: 'min read' },

  // Jobs page
  'jobs.title': { ar: 'الوظائف', en: 'Jobs' },
  'jobs.apply': { ar: 'قم بإرسال نموذج الوظيفة الآن', en: 'Submit Your Job Application Now' },
  'jobs.uploadCv': { ar: 'اختر الملف', en: 'Choose File' },

  // Rating page
  'rating.title': { ar: 'قيمنا', en: 'Rate Us' },
  'rating.cleanliness': { ar: 'النظافة', en: 'Cleanliness' },
  'rating.staffFriendly': { ar: 'هل الكادر كان سعيد؟', en: 'Was the staff friendly?' },
  'rating.staffCoop': { ar: 'هل الكادر كان متعاون؟', en: 'Was the staff cooperative?' },
  'rating.leaveComment': { ar: 'اترك تعليقاتك', en: 'Leave your comments' },
  'rating.submit': { ar: 'إرسال التقييم', en: 'Submit Rating' },
  'rating.bad': { ar: 'سيء', en: 'Bad' },
  'rating.good': { ar: 'جيد', en: 'Good' },
  'rating.excellent': { ar: 'ممتاز', en: 'Excellent' },

  // Footer
  'footer.rights': { ar: 'جميع الحقوق محفوظة', en: 'All Rights Reserved' },
  'footer.values': { ar: 'قيمتنا', en: 'Our Values' },

  // Floating
  'float.chatNow': { ar: 'كلم الآن', en: 'Chat Now' },
  'float.cookieText': { ar: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع', en: 'We use cookies to improve your experience on the site' },
  'float.cookieAccept': { ar: 'قبول', en: 'Accept' },
};

export function t(key: string, locale: Locale = 'ar'): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[locale] || entry.ar || key;
}

// Helper to get localized field from a database object
export function localize(obj: Record<string, string>, locale: Locale, fallbackLocale: Locale = 'ar'): string {
  const field = locale === 'en' ? 'En' : 'Ar';
  const fbField = fallbackLocale === 'en' ? 'En' : 'Ar';
  // Try the specific field patterns
  for (const suffix of [`_${field}`, field]) {
    for (const key of Object.keys(obj)) {
      if (key.endsWith(suffix) && obj[key]) return obj[key];
    }
  }
  // Fallback
  for (const suffix of [`_${fbField}`, fbField]) {
    for (const key of Object.keys(obj)) {
      if (key.endsWith(suffix) && obj[key]) return obj[key];
    }
  }
  return '';
}
