export interface Service {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  isOffer?: boolean;
}

export interface ServiceCategory {
  name: string;
  slug: string;
  count: number;
  icon: string;
  subcategories?: { name: string; count: number }[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    name: 'الخدمات',
    slug: 'all',
    count: 333,
    icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965466.png',
  },
  {
    name: 'عروض',
    slug: 'offers',
    count: 31,
    icon: 'https://cdn-icons-png.flaticon.com/512/2331/2331970.png',
  },
  {
    name: 'جلدية',
    slug: 'dermatology',
    count: 132,
    icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965466.png',
    subcategories: [
      { name: 'أبر النضارة ومحفزات الكولاجين', count: 38 },
      { name: 'البلازما', count: 7 },
      { name: 'البوتكس و الفيلر', count: 17 },
      { name: 'التقشير', count: 12 },
      { name: 'التشقير و التقشير الكربوني', count: 10 },
      { name: 'تنظيف البشرة', count: 8 },
      { name: 'الأجهزة', count: 14 },
      { name: 'الديرما بن و الخلايا الجذعية', count: 7 },
      { name: 'الرجنيرا', count: 3 },
      { name: 'الاكسوزوم', count: 0 },
      { name: 'توريد الشفايف', count: 2 },
      { name: 'خيوط الشد و النضارة', count: 2 },
      { name: 'إزالة التاتو', count: 4 },
    ],
  },
  {
    name: 'ليزر',
    slug: 'laser',
    count: 72,
    icon: 'https://cdn-icons-png.flaticon.com/512/3163/3163466.png',
    subcategories: [
      { name: 'ليزر السيدات', count: 44 },
      { name: 'الرجال', count: 28 },
    ],
  },
  {
    name: 'الأسنان',
    slug: 'dental',
    count: 71,
    icon: 'https://cdn-icons-png.flaticon.com/512/3063/3063177.png',
    subcategories: [
      { name: 'تقويم الاسنان', count: 19 },
      { name: 'التركيبات و الابتسامات', count: 9 },
      { name: 'الزراعة', count: 10 },
      { name: 'تبييض الاسنان', count: 5 },
      { name: 'علاجات الاسنان', count: 6 },
    ],
  },
  {
    name: 'النساء و الولادة',
    slug: 'obstetrics',
    count: 12,
    icon: 'https://cdn-icons-png.flaticon.com/512/2916/2916315.png',
    subcategories: [
      { name: 'السونار', count: 3 },
      { name: 'باقات الحمل', count: 4 },
      { name: 'خدمات العيادة', count: 4 },
      { name: 'وسائل منع الحمل', count: 1 },
    ],
  },
  {
    name: 'التجميل النسائي',
    slug: 'femal-cosmetic',
    count: 14,
    icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965466.png',
  },
  {
    name: 'التغذية و التخسيس',
    slug: 'nutrition',
    count: 13,
    icon: 'https://cdn-icons-png.flaticon.com/512/2909/2909750.png',
    subcategories: [
      { name: 'الاجهزة', count: 5 },
      { name: 'باقات التخسيس', count: 6 },
      { name: 'حقن التخسيس', count: 0 },
    ],
  },
  {
    name: 'العلاج الطبيعي',
    slug: 'physiotherapy',
    count: 7,
    icon: 'https://cdn-icons-png.flaticon.com/512/2865/2865431.png',
  },
  {
    name: 'المختبر',
    slug: 'lab',
    count: 15,
    icon: 'https://cdn-icons-png.flaticon.com/512/2918/2917780.png',
  },
  {
    name: 'العيدية',
    slug: 'eid',
    count: 36,
    icon: 'https://cdn-icons-png.flaticon.com/512/2331/2331970.png',
  },
];

export const services: Service[] = [
  { id: 1, name: '3 جلسات ليزر جسم للسيدات (يدين – رجلين – ابطين – بكيني)', category: 'ليزر', subcategory: 'ليزر السيدات', price: 729, originalPrice: 1010, image: '/services/laser-body.jpg', badge: '-28%', isOffer: true },
  { id: 2, name: 'قوالب تبييض الاسنان فقط', category: 'الأسنان', subcategory: 'تبييض الاسنان', price: 400, image: '/services/teeth-whitening.jpg' },
  { id: 3, name: 'كشف + سونار خارجي', category: 'النساء و الولادة', subcategory: 'السونار', price: 149, originalPrice: 380, image: '/services/ultrasound.jpg', badge: '-61%', isOffer: true },
  { id: 4, name: 'ليزر منطقة من اختيارك للسيدات', category: 'ليزر', subcategory: 'ليزر السيدات', price: 89, originalPrice: 200, image: '/services/laser-area.jpg', badge: '-56%', isOffer: true },
  { id: 5, name: '(3 جلسات) منطقة من اختيارك للسيدات', category: 'ليزر', subcategory: 'ليزر السيدات', price: 349, originalPrice: 389, image: '/services/laser-3sessions.jpg', badge: '-10%', isOffer: true },
  { id: 6, name: '12 جلسة علاج طبيعي بالليزر', category: 'العلاج الطبيعي', subcategory: 'العلاج الطبيعي', price: 840, originalPrice: 1680, image: '/services/physio-laser.jpg', badge: '-50%', isOffer: true },
  { id: 7, name: '15 جلسة لعلاج الانفصال العضلي بعد الولادة', category: 'التغذية و التخسيس', subcategory: 'باقات التخسيس', price: 2500, image: '/services/postpartum.jpg' },
  { id: 8, name: '2 مل سالمون', category: 'جلدية', subcategory: 'أبر النضارة ومحفزات الكولاجين', price: 1000, image: '/services/salmon.jpg' },
  { id: 9, name: '2 مل فيلر وجنات أو تحديد فك + 1 مل فيلر شفايف مجانا', category: 'جلدية', subcategory: 'أبر النضارة ومحفزات الكولاجين', price: 2199, originalPrice: 3000, image: '/services/filler-cheeks.jpg', badge: '-27%', isOffer: true },
  { id: 10, name: '3 بلازما الشعر', category: 'جلدية', subcategory: 'البلازما', price: 1699, originalPrice: 2700, image: '/services/hair-plasma.jpg', badge: '-37%', isOffer: true },
  { id: 11, name: '3 تركيبات زيركون', category: 'الأسنان', subcategory: 'التركيبات و الابتسامات', price: 1947, originalPrice: 3600, image: '/services/zircon.jpg', badge: '-46%', isOffer: true },
  { id: 12, name: '3 جلسات إزالة تاتو (منطقة صغيرة)', category: 'جلدية', subcategory: 'إزالة التاتو', price: 2100, image: '/services/tattoo-removal.jpg' },
  { id: 13, name: '5 مل أبرة الجوري (شد الكولاجين)', category: 'جلدية', subcategory: 'أبر النضارة ومحفزات الكولاجين', price: 1850, image: '/services/rose-needle.jpg', isOffer: true },
  { id: 14, name: 'بيبي فيس للنضارة', category: 'جلدية', subcategory: 'أبر النضارة ومحفزات الكولاجين', price: 900, image: '/services/baby-face.jpg' },
  { id: 15, name: 'سونار رباعي الأبعاد', category: 'النساء و الولادة', subcategory: 'السونار', price: 449, originalPrice: 600, image: '/services/4d-ultrasound.jpg', badge: '-25%', isOffer: true },
  { id: 16, name: 'بوتكس للوجه (منطقة واحدة)', category: 'جلدية', subcategory: 'البوتكس و الفيلر', price: 599, image: '/services/botox.jpg' },
  { id: 17, name: 'فيلر شفايف 1 مل', category: 'جلدية', subcategory: 'البوتكس و الفيلر', price: 1200, image: '/services/lip-filler.jpg' },
  { id: 18, name: 'جلسة ميزو ثيرابي للوجه', category: 'جلدية', subcategory: 'الديرما بن و الخلايا الجذعية', price: 800, image: '/services/mesotherapy.jpg' },
  { id: 19, name: 'تنظيف بشرة عميق', category: 'جلدية', subcategory: 'تنظيف البشرة', price: 350, image: '/services/deep-cleansing.jpg' },
  { id: 20, name: 'تقشير كربوني للوجه', category: 'جلدية', subcategory: 'التشقير و التقشير الكربوني', price: 450, image: '/services/carbon-peel.jpg' },
  { id: 21, name: 'تقويم أسنان معدني', category: 'الأسنان', subcategory: 'تقويم الاسنان', price: 4500, image: '/services/metal-braces.jpg' },
  { id: 22, name: 'تقويم أسنان شفاف (إنفزلاين)', category: 'الأسنان', subcategory: 'تقويم الاسنان', price: 12000, image: '/services/invisalign.jpg' },
  { id: 23, name: 'زراعة سن واحد', category: 'الأسنان', subcategory: 'الزراعة', price: 3500, image: '/services/implant.jpg' },
  { id: 24, name: 'تركيب تاج زيركون', category: 'الأسنان', subcategory: 'التركيبات و الابتسامات', price: 1200, image: '/services/crown.jpg' },
  { id: 25, name: 'باقة التخسيس الشاملة (6 جلسات)', category: 'التغذية و التخسيس', subcategory: 'باقات التخسيس', price: 1800, image: '/services/slimming-package.jpg' },
  { id: 26, name: 'كشف أسنان عام', category: 'الأسنان', subcategory: 'علاجات الاسنان', price: 100, image: '/services/dental-checkup.jpg' },
  { id: 27, name: 'حجامة وتنظيف دم', category: 'المختبر', subcategory: 'المختبر', price: 250, image: '/services/cupping.jpg' },
  { id: 28, name: 'تحليل دم شامل', category: 'المختبر', subcategory: 'المختبر', price: 350, image: '/services/blood-test.jpg' },
];

export const homeServiceCategories = [
  { name: 'خدمات الجلدية و التجميل', icon: 'Stethoscope', slug: 'dermatology', image: '/services-cat/dermatology.jpg' },
  { name: 'خدمات الليزر', icon: 'Zap', slug: 'laser', image: '/services-cat/laser.jpg' },
  { name: 'خدمات التخسيس', icon: 'Activity', slug: 'nutrition', image: '/services-cat/slimming.jpg' },
  { name: 'خدمات الأسنان', icon: 'Smile', slug: 'dental', image: '/services-cat/dental.jpg' },
  { name: 'متابعة الحمل و التجميل النسائي', icon: 'Heart', slug: 'obstetrics', image: '/services-cat/obstetrics.jpg' },
  { name: 'الخدمات الطبية', icon: 'BriefcaseMedical', slug: 'physiotherapy', image: '/services-cat/medical.jpg' },
];
