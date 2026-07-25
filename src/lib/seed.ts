import { db } from '@/lib/db';

export async function seedDatabase() {
  console.log('🌱 Seeding database...');

  // 1. Admin user
  const existingAdmin = await db.admin.findFirst({ where: { username: 'admin' } });
  if (!existingAdmin) {
    await db.admin.create({
      data: { username: 'admin', password: 'admin123', name: 'مدير النظام' },
    });
    console.log('✅ Admin user created');
  }

  // 2. Settings
  const defaultSettings = [
    { key: 'site_name', value: 'عيادة 9 southern', label: 'اسم الموقع', type: 'text', group: 'general' },
    { key: 'site_name_en', value: '9 Southern Clinic', label: 'Site Name (EN)', type: 'text', group: 'general' },
    { key: 'phone', value: '9200006802', label: 'رقم الهاتف', type: 'text', group: 'contact' },
    { key: 'phone2', value: '', label: 'رقم الهاتف الثاني', type: 'text', group: 'contact' },
    { key: 'email', value: 'info@clinic9sa.com', label: 'البريد الإلكتروني', type: 'text', group: 'contact' },
    { key: 'whatsapp', value: '966501234567', label: 'واتساب', type: 'text', group: 'contact' },
    { key: 'address_ar', value: 'جدة، المملكة العربية السعودية', label: 'العنوان بالعربي', type: 'textarea', group: 'contact' },
    { key: 'address_en', value: 'Jeddah, Saudi Arabia', label: 'العنوان بالإنجليزي', type: 'textarea', group: 'contact' },
    { key: 'about_text_ar', value: 'عيادة 9 southern هي مركز طبي متكامل يقدم أفضل الخدمات الطبية والتجميلية في جدة. نحن نسعى لتقديم رعاية صحية متميزة بأحدث التقنيات وأفضل الأطباء المتخصصين.', label: 'نبذة عربية', type: 'textarea', group: 'general' },
    { key: 'about_text_en', value: '9 Southern Clinic is an integrated medical center providing the best medical and cosmetic services in Jeddah. We strive to deliver distinguished healthcare with the latest technologies and the best specialized doctors.', label: 'About Text (EN)', type: 'textarea', group: 'general' },
    { key: 'working_hours_text', value: 'السبت - الخميس: 10:00 ص - 10:00 م | الجمعة: مغلق', label: 'ساعات العمل', type: 'textarea', group: 'contact' },
    { key: 'logo_url', value: '', label: 'رابط الشعار', type: 'image', group: 'appearance' },
    { key: 'primary_color', value: '#6DB3D7', label: 'اللون الأساسي', type: 'text', group: 'appearance' },
  ];

  for (const s of defaultSettings) {
    const exists = await db.siteSetting.findUnique({ where: { key: s.key } });
    if (!exists) {
      await db.siteSetting.create({ data: s });
    }
  }
  console.log('✅ Settings seeded');

  // 3. Service Categories
  const catData = [
    { nameAr: 'جلدية', nameEn: 'Dermatology', slug: 'dermatology', icon: 'Stethoscope', image: '/uploads/categories/dermatology.jpg', order: 1 },
    { nameAr: 'ليزر', nameEn: 'Laser', slug: 'laser', icon: 'Zap', image: '/uploads/categories/laser.jpg', order: 2 },
    { nameAr: 'الأسنان', nameEn: 'Dental', slug: 'dental', icon: 'Smile', image: '/uploads/categories/dental.jpg', order: 3 },
    { nameAr: 'النساء و الولادة', nameEn: 'Obstetrics', slug: 'obstetrics', icon: 'Heart', image: '/uploads/categories/obstetrics.jpg', order: 4 },
    { nameAr: 'التغذية و التخسيس', nameEn: 'Nutrition', slug: 'nutrition', icon: 'Activity', image: '/uploads/categories/nutrition.jpg', order: 5 },
    { nameAr: 'العلاج الطبيعي', nameEn: 'Physiotherapy', slug: 'physiotherapy', icon: 'BriefcaseMedical', image: '/uploads/categories/physiotherapy.jpg', order: 6 },
    { nameAr: 'التجميل النسائي', nameEn: 'Female Cosmetic', slug: 'female-cosmetic', icon: 'Sparkles', image: '/uploads/categories/cosmetic.jpg', order: 7 },
    { nameAr: 'المختبر', nameEn: 'Laboratory', slug: 'lab', icon: 'FlaskConical', image: '/uploads/categories/lab.jpg', order: 8 },
  ];

  for (const c of catData) {
    const exists = await db.serviceCategory.findUnique({ where: { slug: c.slug } });
    if (!exists) {
      await db.serviceCategory.create({ data: c });
    }
  }
  console.log('✅ Categories seeded');

  // Get category IDs
  const categories = await db.serviceCategory.findMany();
  const catMap: Record<string, string> = {};
  for (const c of categories) catMap[c.slug] = c.id;

  // 4. Services
  const existingServices = await db.service.count();
  if (existingServices === 0) {
    const serviceData = [
      { nameAr: '3 جلسات ليزر جسم للسيدات', nameEn: '3 Laser Body Sessions - Women', price: 729, originalPrice: 1010, image: '/uploads/services/svc1.jpg', badge: '-28%', isOffer: true, isFeatured: true, categoryId: catMap['laser'], subcategoryAr: 'ليزر السيدات', subcategoryEn: 'Laser Women', order: 1 },
      { nameAr: 'قوالب تبييض الاسنان', nameEn: 'Teeth Whitening Trays', price: 400, image: '/uploads/services/svc2.jpg', categoryId: catMap['dental'], subcategoryAr: 'تبييض الاسنان', subcategoryEn: 'Teeth Whitening', order: 2 },
      { nameAr: 'كشف + سونار خارجي', nameEn: 'Checkup + External Ultrasound', price: 149, originalPrice: 380, badge: '-61%', isOffer: true, image: '/uploads/services/svc3.jpg', categoryId: catMap['obstetrics'], subcategoryAr: 'السونار', subcategoryEn: 'Ultrasound', order: 3 },
      { nameAr: 'ليزر منطقة من اختيارك للسيدات', nameEn: 'Laser for Selected Area - Women', price: 89, originalPrice: 200, badge: '-56%', isOffer: true, categoryId: catMap['laser'], subcategoryAr: 'ليزر السيدات', order: 4 },
      { nameAr: '2 مل سالمون', nameEn: '2ml Salmon Injection', price: 1000, categoryId: catMap['dermatology'], subcategoryAr: 'أبر النضارة ومحفزات الكولاجين', subcategoryEn: 'Collagen Boosters', order: 5 },
      { nameAr: 'بوتكس للوجه', nameEn: 'Botox for Face', price: 599, image: '/uploads/services/svc6.jpg', isFeatured: true, categoryId: catMap['dermatology'], subcategoryAr: 'البوتكس و الفيلر', subcategoryEn: 'Botox & Filler', order: 6 },
      { nameAr: 'فيلر شفايف 1 مل', nameEn: 'Lip Filler 1ml', price: 1200, categoryId: catMap['dermatology'], subcategoryAr: 'البوتكس و الفيلر', order: 7 },
      { nameAr: 'تنظيف بشرة عميق', nameEn: 'Deep Skin Cleansing', price: 350, image: '/uploads/services/svc8.jpg', isFeatured: true, categoryId: catMap['dermatology'], subcategoryAr: 'تنظيف البشرة', subcategoryEn: 'Skin Cleansing', order: 8 },
      { nameAr: 'تقشير كربوني للوجه', nameEn: 'Carbon Peel', price: 450, image: '/uploads/services/svc9.jpg', categoryId: catMap['dermatology'], subcategoryAr: 'التشقير و التقشير الكربوني', order: 9 },
      { nameAr: 'تقويم أسنان معدني', nameEn: 'Metal Braces', price: 4500, image: '/uploads/services/svc10.jpg', categoryId: catMap['dental'], subcategoryAr: 'تقويم الاسنان', order: 10 },
      { nameAr: 'زراعة سن واحد', nameEn: 'Single Tooth Implant', price: 3500, categoryId: catMap['dental'], subcategoryAr: 'الزراعة', order: 11 },
      { nameAr: 'باقة التخسيس الشاملة', nameEn: 'Comprehensive Slimming Package', price: 1800, categoryId: catMap['nutrition'], subcategoryAr: 'باقات التخسيس', order: 12 },
      { nameAr: '12 جلسة علاج طبيعي بالليزر', nameEn: '12 Physiotherapy Sessions', price: 840, originalPrice: 1680, badge: '-50%', isOffer: true, categoryId: catMap['physiotherapy'], order: 13 },
      { nameAr: 'تحليل دم شامل', nameEn: 'Complete Blood Test', price: 350, categoryId: catMap['lab'], order: 14 },
    ];

    for (const s of serviceData) {
      await db.service.create({
        data: {
          nameAr: s.nameAr, nameEn: s.nameEn || '',
          descriptionAr: '', descriptionEn: '',
          price: s.price, originalPrice: s.originalPrice || null,
          image: s.image || '', badge: s.badge || '',
          isOffer: s.isOffer || false, isFeatured: s.isFeatured || false,
          categoryId: s.categoryId,
          subcategoryAr: s.subcategoryAr || '', subcategoryEn: s.subcategoryEn || '',
          order: s.order || 0,
        },
      });
    }
    console.log('✅ Services seeded');
  }

  // 5. Doctors
  const existingDoctors = await db.doctor.count();
  if (existingDoctors === 0) {
    await db.doctor.createMany({
      data: [
        { nameAr: 'د. حنان محمد', nameEn: 'Dr. Hanan Mohamed', specialtyAr: 'أخصائية الجلدية والتجميل والليزر', specialtyEn: 'Dermatology, Cosmetics & Laser', experienceAr: 'خبرة 15 عام', experienceEn: '15 years experience', departmentAr: 'جلدية', departmentEn: 'Dermatology', image: '/uploads/doctors/dr1.jpg', order: 1 },
        { nameAr: 'د. لورانس يوسف', nameEn: 'Dr. Lawrence Youssef', specialtyAr: 'استشاري الأسنان', specialtyEn: 'Dental Consultant', experienceAr: 'خبرة 39 عام', experienceEn: '39 years experience', departmentAr: 'الأسنان', departmentEn: 'Dental', image: '/uploads/doctors/dr2.jpg', order: 2 },
        { nameAr: 'د. مروة المحلاوي', nameEn: 'Dr. Marwa El-Mahlawy', specialtyAr: 'أخصائية الجلدية والتجميل والليزر', specialtyEn: 'Dermatology & Laser', experienceAr: 'خبرة 15 عام', experienceEn: '15 years experience', departmentAr: 'جلدية', departmentEn: 'Dermatology', image: '/uploads/doctors/dr3.jpg', order: 3 },
        { nameAr: 'د. مازن العموري', nameEn: 'Dr. Mazen Al-Omouri', specialtyAr: 'تجميل الأسنان', specialtyEn: 'Cosmetic Dentistry', experienceAr: 'خبرة 24 سنة', experienceEn: '24 years experience', departmentAr: 'الأسنان', departmentEn: 'Dental', image: '/uploads/doctors/dr4.jpg', order: 4 },
        { nameAr: 'د. أمل أبو المعاطي', nameEn: 'Dr. Amal Abu El-Mataati', specialtyAr: 'أسنان متقدمة', specialtyEn: 'Advanced Dentistry', experienceAr: 'خبرة 10 سنوات', experienceEn: '10 years experience', departmentAr: 'الأسنان', departmentEn: 'Dental', image: '/uploads/doctors/dr5.jpg', order: 5 },
        { nameAr: 'د. وسيم وجوخ', nameEn: 'Dr. Waseem Wajoukh', specialtyAr: 'تقويم الأسنان', specialtyEn: 'Orthodontics', experienceAr: 'خبرة 20 عام', experienceEn: '20 years experience', departmentAr: 'الأسنان', departmentEn: 'Dental', image: '/uploads/doctors/dr6.jpg', order: 6 },
        { nameAr: 'د. أمل المربط', nameEn: 'Dr. Amal Al-Murbat', specialtyAr: 'أمراض النساء والتوليد', specialtyEn: 'Obstetrics & Gynecology', experienceAr: 'خبرة 20 سنة', experienceEn: '20 years experience', departmentAr: 'النساء والولادة', departmentEn: 'Obstetrics', image: '/uploads/doctors/dr7.jpg', order: 7 },
        { nameAr: 'د. رباب سليمان', nameEn: 'Dr. Rabab Suleiman', specialtyAr: 'أمراض النساء والولادة والموجات', specialtyEn: 'OB/GYN & Ultrasound', experienceAr: 'ماجستير النساء والولادة', experienceEn: 'Master in OB/GYN', departmentAr: 'النساء والولادة', departmentEn: 'Obstetrics', image: '/uploads/doctors/dr8.jpg', order: 8 },
      ],
    });
    console.log('✅ Doctors seeded');
  }

  // 6. Articles
  const existingArticles = await db.article.count();
  if (existingArticles === 0) {
    await db.article.createMany({
      data: [
      { titleAr: 'العلاقة بين التغذية وحب الشباب', titleEn: 'Nutrition and Acne', excerptAr: 'تعد العلاقة بين التغذية وحب الشباب من المواضيع المهمة', excerptEn: 'The relationship between nutrition and acne is an important topic', contentAr: 'تعد العلاقة بين التغذية وحب الشباب من المواضيع المهمة التي تشغل بال الكثير من الأشخاص. أظهرت الدراسات أن هناك علاقة وثيقة بين نوعية الغذاء وظهور حب الشباب.', contentEn: 'The relationship between nutrition and acne is an important topic. Studies have shown a close link between diet type and acne appearance.', image: '/uploads/articles/art1.jpg', tagAr: 'جديد حصرياً', tagEn: 'New Exclusive', author: 'admin', readTime: '5 دقائق' },
        { titleAr: 'أحدث التقنيات لعلاج الندبات', titleEn: 'Latest Scar Treatment Techniques', excerptAr: 'تطورت تقنيات علاج الندبات بشكل كبير', excerptEn: 'Scar treatment techniques have evolved greatly', contentAr: 'تطورت تقنيات علاج الندبات بشكل كبير في السنوات الأخيرة.', contentEn: 'Scar treatment techniques have evolved greatly in recent years.', image: '/uploads/articles/art2.jpg', tagAr: 'طبي', tagEn: 'Medical', author: 'admin', readTime: '7 دقائق' },
        { titleAr: 'العناية بالبشرة في فصل الصيف', titleEn: 'Summer Skincare Tips', excerptAr: 'مع ارتفاع درجات الحرارة تحتاج البشرة عناية خاصة', excerptEn: 'With rising temperatures your skin needs special care', contentAr: 'مع ارتفاع درجات الحرارة في فصل الصيف تحتاج البشرة إلى عناية خاصة للحفاظ على نضارتها.', contentEn: 'With rising temperatures in summer, your skin needs special care to maintain its freshness.', image: '/uploads/articles/art3.jpg', tagAr: 'جديد حصرياً', tagEn: 'New Exclusive', author: 'admin', readTime: '8 دقائق' },
        { titleAr: 'فوائد البلازما للشعر والبشرة', titleEn: 'Plasma Benefits for Hair and Skin', excerptAr: 'تعتبر علاج البلازما من أحدث التقنيات', excerptEn: 'Plasma treatment is one of the latest technologies', contentAr: 'تعتبر علاج البلازما الغنية بالصفائح الدموية من أحدث التقنيات الطبية.', contentEn: 'PRP plasma treatment is one of the latest medical technologies.', image: '/uploads/articles/art4.jpg', tagAr: 'علاج', tagEn: 'Treatment', author: 'admin', readTime: '6 دقائق' },
        { titleAr: 'أهمية تقويم الأسنان', titleEn: 'Importance of Orthodontics', excerptAr: 'تقويم الأسنان ليس فقط للجمال بل له فوائد صحية', excerptEn: 'Orthodontics has health benefits beyond beauty', contentAr: 'تقويم الأسنان ليس فقط للجمال بل له فوائد صحية عديدة.', contentEn: 'Orthodontics is not just for beauty but has many health benefits.', image: '/uploads/articles/art5.jpg', author: 'admin', readTime: '5 دقائق' },
        { titleAr: 'الأمراض الجلدية بعد كورونا', titleEn: 'Skin Diseases After COVID', excerptAr: 'أظهرت الدراسات أن فيروس كورونا يمكن أن يسبب أعراض جلدية', excerptEn: 'Studies show COVID can cause skin symptoms', contentAr: 'أظهرت الدراسات أن فيروس كورونا يمكن أن يسبب مجموعة متنوعة من الأعراض الجلدية.', contentEn: 'Studies show COVID can cause a variety of skin symptoms.', image: '/uploads/articles/art6.jpg', author: 'admin', readTime: '10 دقائق' },
      ],
    });
    console.log('✅ Articles seeded');
  }

  // 7. Testimonials
  const existingTestimonials = await db.testimonial.count();
  if (existingTestimonials === 0) {
    await db.testimonial.createMany({
      data: [
        { nameAr: 'سارة أحمد', nameEn: 'Sarah Ahmed', textAr: 'تجربة رائعة مع العيادة، الدكتورة حنان محترفة جداً في الجلدية والتجميل', textEn: 'Amazing experience with the clinic, Dr. Hanan is very professional in dermatology', rating: 5, order: 1 },
        { nameAr: 'نورة محمد', nameEn: 'Noura Mohamed', textAr: 'خدمة ممتازة وأسعار مناسبة، أنصح الجميع بالتعامل مع العيادة', textEn: 'Excellent service and reasonable prices, I recommend everyone to visit', rating: 5, order: 2 },
        { nameAr: 'فاطمة علي', nameEn: 'Fatima Ali', textAr: 'بيئة نظيفة ومريحة، والطاقم الطبي متعاون جداً', textEn: 'Clean and comfortable environment with very cooperative staff', rating: 4, order: 3 },
        { nameAr: 'ريم خالد', nameEn: 'Reem Khaled', textAr: 'أفضل عيادة في المنطقة، تجربتي مع تقويم الأسنان كانت ممتازة', textEn: 'Best clinic in the area, my orthodontics experience was excellent', rating: 5, order: 4 },
      ],
    });
    console.log('✅ Testimonials seeded');
  }

  // 8. Insurance
  const existingInsurance = await db.insuranceCompany.count();
  if (existingInsurance === 0) {
    await db.insuranceCompany.createMany({
      data: [
        { nameAr: 'بوبا', nameEn: 'Bupa', logo: 'https://companieslogo.com/img/orig/8210.SR-b6db68cc.png', order: 1 },
        { nameAr: 'تكافل', nameEn: 'Takaful', logo: 'https://companieslogo.com/img/orig/8230.SR-8290a9f8.png', order: 2 },
        { nameAr: 'ميدغلف', nameEn: 'Medgulf', logo: 'https://companieslogo.com/img/orig/8030.SR_BIG-32d46cc2.png', order: 3 },
        { nameAr: 'أكسا', nameEn: 'AXA', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/AXA_logo.svg/230px-AXA_logo.svg.png', order: 4 },
        { nameAr: 'التعاونية', nameEn: 'Cooperative', logo: 'https://companieslogo.com/img/orig/8010.SR-890ea7cf.png', order: 5 },
        { nameAr: 'ولاء', nameEn: 'Walaa', logo: 'https://companieslogo.com/img/orig/8060.SR_BIG-49588bcc.png', order: 6 },
        { nameAr: 'أسياسة', nameEn: 'Aseelah', logo: '', order: 7 },
        { nameAr: 'ساب', nameEn: 'SAB', logo: '', order: 8 },
      ],
    });
    console.log('✅ Insurance companies seeded');
  }

  // 9. Videos
  const existingVideos = await db.video.count();
  if (existingVideos === 0) {
    await db.video.createMany({
      data: [
        { titleAr: 'جولة في العيادة', titleEn: 'Clinic Tour', videoUrl: '', order: 1 },
        { titleAr: 'خدمات الليزر', titleEn: 'Laser Services', videoUrl: '', order: 2 },
        { titleAr: 'خدمات الأسنان', titleEn: 'Dental Services', videoUrl: '', order: 3 },
      ],
    });
    console.log('✅ Videos seeded');
  }

  // 10. Banners
  const existingBanners = await db.banner.count();
  if (existingBanners === 0) {
    await db.banner.createMany({
      data: [
        { titleAr: 'الرعاية الطبية بكل احترافية', titleEn: 'Professional Medical Care', subtitleAr: 'مركز العيادة التاسعة الطبي', subtitleEn: '9 Southern Medical Center', descriptionAr: 'نقدم خدمات صحية ذات جودة متميزة وفقا لأعلى المعايير الصحية العالمية', descriptionEn: 'We provide high-quality healthcare services according to the highest international standards', ctaTextAr: 'احجز موعدك الآن', ctaTextEn: 'Book Your Appointment Now', ctaLink: 'booking', image: '/uploads/banners/banner1.jpg', bgColor: '#6DB3D7', order: 1 },
        { titleAr: 'ابتسامة أجمل', titleEn: 'A More Beautiful Smile', subtitleAr: 'رعاية طبية بأسلوب جديد', subtitleEn: 'Medical Care in a New Way', descriptionAr: 'أحدث تقنيات تجميل وعلاج الأسنان مع نخبة من أفضل الأطباء', descriptionEn: 'Latest cosmetic dentistry techniques with the best doctors', ctaTextAr: 'اكتشف خدماتنا', ctaTextEn: 'Discover Our Services', ctaLink: 'services', image: '/uploads/banners/banner2.jpg', bgColor: '#5DADE2', order: 2 },
        { titleAr: 'عروض حصرية', titleEn: 'Exclusive Offers', subtitleAr: 'خصومات تصل إلى 50%', subtitleEn: 'Discounts up to 50%', descriptionAr: 'تقنيات متطورة في الجلدية والليزر والتجميل بأيدي خبراء متخصصين', descriptionEn: 'Advanced dermatology, laser, and cosmetic techniques by specialized experts', ctaTextAr: 'تصفح العروض', ctaTextEn: 'Browse Offers', ctaLink: 'offers', image: '/uploads/banners/banner3.jpg', bgColor: '#48C9B0', order: 3 },
      ],
    });
    console.log('✅ Banners seeded');
  }

  // 11. Promo Popup
  const existingPopup = await db.promoPopup.count();
  if (existingPopup === 0) {
    await db.promoPopup.create({
      data: {
        titleAr: 'عروض الصيف 🔥', titleEn: 'Summer Offers 🔥',
        descriptionAr: 'احصل على خصم 30% على جميع خدمات الليزر', descriptionEn: 'Get 30% off on all laser services',
        ctaTextAr: 'استعرض العروض', ctaTextEn: 'View Offers', ctaLink: 'offers',
      },
    });
    console.log('✅ Promo popup seeded');
  }

  // 12. Page Content
  const existingPages = await db.pageContent.count();
  if (existingPages === 0) {
    await db.pageContent.createMany({
      data: [
        { pageKey: 'about', titleAr: 'من نحن', titleEn: 'About Us', contentAr: 'عيادة 9 southern هي مركز طبي متكامل يقدم أفضل الخدمات الطبية والتجميلية في جدة. نحن نسعى لتقديم رعاية صحية متميزة بأحدث التقنيات وأفضل الأطباء المتخصصين. تشمل خدماتنا الجلدية والتجميل والليزر والأسنان والتغذية والعلاج الطبيعي وأمراض النساء والولادة.', contentEn: '9 Southern Clinic is an integrated medical center providing the best medical and cosmetic services in Jeddah. We strive to deliver distinguished healthcare with the latest technologies and the best specialized doctors. Our services include dermatology, cosmetics, laser, dental, nutrition, physiotherapy, and obstetrics.' },
        { pageKey: 'contact', titleAr: 'اتصل بنا', titleEn: 'Contact Us', contentAr: 'تواصل معنا لأي استفسار أو حجز موعد', contentEn: 'Contact us for any inquiries or appointment booking' },
      ],
    });
    console.log('✅ Page content seeded');
  }

  // 13. Nav Items
  const existingNav = await db.navItem.count();
  if (existingNav === 0) {
    const home = await db.navItem.create({ data: { labelAr: 'الرئيسية', labelEn: 'Home', page: 'home', order: 1 } });
    const about = await db.navItem.create({ data: { labelAr: 'من نحن', labelEn: 'About Us', page: 'about', order: 2 } });
    const offers = await db.navItem.create({ data: { labelAr: 'العروض', labelEn: 'Offers', page: 'offers', order: 3 } });
    const services = await db.navItem.create({ data: { labelAr: 'الخدمات', labelEn: 'Services', page: 'services', order: 4 } });
    const doctors = await db.navItem.create({ data: { labelAr: 'الأطباء', labelEn: 'Doctors', page: 'doctors', order: 5 } });
    const news = await db.navItem.create({ data: { labelAr: 'الأخبار و المقالات', labelEn: 'News & Articles', page: 'news', order: 6 } });
    const jobs = await db.navItem.create({ data: { labelAr: 'الوظائف', labelEn: 'Jobs', page: 'jobs', order: 7 } });
    const contact = await db.navItem.create({ data: { labelAr: 'تواصل معنا', labelEn: 'Contact Us', page: 'contact', order: 8 } });

    await db.navItem.create({ data: { labelAr: 'العروض الرئيسية', labelEn: 'Main Offers', page: 'offers', parentId: offers.id, order: 1 } });

    await db.navItem.create({ data: { labelAr: 'جلدية', labelEn: 'Dermatology', page: 'services', params: JSON.stringify({ category: 'dermatology' }), parentId: services.id, order: 1 } });
    await db.navItem.create({ data: { labelAr: 'ليزر', labelEn: 'Laser', page: 'services', params: JSON.stringify({ category: 'laser' }), parentId: services.id, order: 2 } });
    await db.navItem.create({ data: { labelAr: 'الأسنان', labelEn: 'Dental', page: 'services', params: JSON.stringify({ category: 'dental' }), parentId: services.id, order: 3 } });
    await db.navItem.create({ data: { labelAr: 'التجميل النسائي', labelEn: 'Female Cosmetic', page: 'services', params: JSON.stringify({ category: 'female-cosmetic' }), parentId: services.id, order: 4 } });
    await db.navItem.create({ data: { labelAr: 'باقات التخسيس', labelEn: 'Slimming Packages', page: 'services', params: JSON.stringify({ category: 'nutrition' }), parentId: services.id, order: 5 } });

    await db.navItem.create({ data: { labelAr: 'تواصل معنا', labelEn: 'Contact Us', page: 'contact', parentId: contact.id, order: 1 } });
    await db.navItem.create({ data: { labelAr: 'رأيك يهمنا', labelEn: 'Your Opinion Matters', page: 'rating', parentId: contact.id, order: 2 } });
    await db.navItem.create({ data: { labelAr: 'الشكاوى والاقتراحات', labelEn: 'Complaints & Suggestions', page: 'rating', parentId: contact.id, order: 3 } });

    console.log('✅ Nav items seeded');
  }

  // 14. Social Links
  const existingSocial = await db.socialLink.count();
  if (existingSocial === 0) {
    await db.socialLink.createMany({
      data: [
        { platform: 'whatsapp', url: 'https://wa.me/966501234567', icon: 'phone', order: 1 },
        { platform: 'instagram', url: 'https://instagram.com/clinic9sa', icon: 'instagram', order: 2 },
        { platform: 'twitter', url: 'https://twitter.com/clinic9sa', icon: 'twitter', order: 3 },
        { platform: 'snapchat', url: 'https://snapchat.com/add/clinic9sa', icon: 'ghost', order: 4 },
        { platform: 'tiktok', url: 'https://tiktok.com/@clinic9sa', icon: 'music', order: 5 },
        { platform: 'youtube', url: 'https://youtube.com/@clinic9sa', icon: 'play', order: 6 },
      ],
    });
    console.log('✅ Social links seeded');
  }

  // 15. Working Hours
  const existingHours = await db.workingHour.count();
  if (existingHours === 0) {
    await db.workingHour.createMany({
      data: [
        { dayAr: 'السبت', dayEn: 'Saturday', from: '10:00', to: '22:00', order: 1 },
        { dayAr: 'الأحد', dayEn: 'Sunday', from: '10:00', to: '22:00', order: 2 },
        { dayAr: 'الاثنين', dayEn: 'Monday', from: '10:00', to: '22:00', order: 3 },
        { dayAr: 'الثلاثاء', dayEn: 'Tuesday', from: '10:00', to: '22:00', order: 4 },
        { dayAr: 'الأربعاء', dayEn: 'Wednesday', from: '10:00', to: '22:00', order: 5 },
        { dayAr: 'الخميس', dayEn: 'Thursday', from: '10:00', to: '22:00', order: 6 },
        { dayAr: 'الجمعة', dayEn: 'Friday', from: '', to: '', order: 7, isActive: false },
      ],
    });
    console.log('✅ Working hours seeded');
  }

  // Before/After Cases
  const existingBeforeAfter = await db.beforeAfterCase.count();
  if (existingBeforeAfter === 0) {
    await db.beforeAfterCase.createMany({
      data: [
        {
          doctorNameAr: 'د. حنان محمد', doctorNameEn: 'Dr. Hanan Mohamed',
          treatmentAr: 'علاج حب الشباب', treatmentEn: 'Acne Treatment',
          categoryAr: 'جلدية', categoryEn: 'Dermatology',
          branchAr: 'الفرع الرئيسي', branchEn: 'Main Branch',
          beforeImage: '/uploads/categories/dermatology.jpg',
          afterImage: '/uploads/services/svc6.jpg',
          dividerPosition: 50, order: 1, isActive: true,
        },
        {
          doctorNameAr: 'د. لورانس يوسف', doctorNameEn: 'Dr. Lawrence Youssef',
          treatmentAr: 'تبييض الأسنان', treatmentEn: 'Teeth Whitening',
          categoryAr: 'الأسنان', categoryEn: 'Dental',
          branchAr: 'الفرع الرئيسي', branchEn: 'Main Branch',
          beforeImage: '/uploads/services/svc2.jpg',
          afterImage: '/uploads/services/svc10.jpg',
          dividerPosition: 40, order: 2, isActive: true,
        },
        {
          doctorNameAr: 'د. مروة المحلاوي', doctorNameEn: 'Dr. Marwa El-Mahlawy',
          treatmentAr: 'تقشير كربوني', treatmentEn: 'Carbon Peel',
          categoryAr: 'جلدية', categoryEn: 'Dermatology',
          branchAr: 'فرع النساء', branchEn: 'Women Branch',
          beforeImage: '/uploads/services/svc9.jpg',
          afterImage: '/uploads/services/svc8.jpg',
          dividerPosition: 60, order: 3, isActive: true,
        },
        {
          doctorNameAr: 'د. مازن العموري', doctorNameEn: 'Dr. Mazen Al-Omouri',
          treatmentAr: 'تقويم الأسنان', treatmentEn: 'Orthodontics',
          categoryAr: 'الأسنان', categoryEn: 'Dental',
          branchAr: 'الفرع الرئيسي', branchEn: 'Main Branch',
          beforeImage: '/uploads/banners/banner2.jpg',
          afterImage: '/uploads/banners/banner3.jpg',
          dividerPosition: 45, order: 4, isActive: true,
        },
        {
          doctorNameAr: 'د. أمل أبو المعاطي', doctorNameEn: 'Dr. Amal Abu El-Mataati',
          treatmentAr: 'تنظيف بشرة عميق', treatmentEn: 'Deep Skin Cleansing',
          categoryAr: 'جلدية', categoryEn: 'Dermatology',
          branchAr: 'فرع النساء', branchEn: 'Women Branch',
          beforeImage: '/uploads/articles/art1.jpg',
          afterImage: '/uploads/articles/art2.jpg',
          dividerPosition: 35, order: 5, isActive: true,
        },
        {
          doctorNameAr: 'د. وسيم وجوخ', doctorNameEn: 'Dr. Waseem Wajoukh',
          treatmentAr: 'زراعة سن واحد', treatmentEn: 'Single Tooth Implant',
          categoryAr: 'الأسنان', categoryEn: 'Dental',
          branchAr: 'الفرع الرئيسي', branchEn: 'Main Branch',
          beforeImage: '/uploads/categories/dental.jpg',
          afterImage: '/uploads/services/svc2.jpg',
          dividerPosition: 55, order: 6, isActive: true,
        },
      ],
    });
    console.log('✅ Before/After cases seeded');
  }

  const existingOrders = await db.order.count();
  if (existingOrders === 0) {
    const services = await db.service.findMany({ where: { isActive: true }, take: 3 });
    if (services.length > 0) {
      const order = await db.order.create({
        data: {
          name: 'أحمد محمد',
          email: 'ahmed@example.com',
          phone: '0501234567',
          total: services.reduce((s, svc) => s + svc.price * 1.15, 0),
          subtotal: services.reduce((s, svc) => s + svc.price, 0),
          tax: services.reduce((s, svc) => s + svc.price * 0.15, 0),
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentIntentId: 'pi_demo_' + Date.now(),
          stripeSessionId: 'cs_demo_' + Date.now(),
          items: {
            create: services.map(svc => ({
              serviceId: svc.id,
              nameAr: svc.nameAr,
              nameEn: svc.nameEn,
              price: svc.price,
              quantity: 1,
              image: svc.image,
            })),
          },
        },
      });
      await db.payment.create({
        data: {
          amount: order.total,
          currency: 'SAR',
          status: 'succeeded',
          paymentIntentId: order.paymentIntentId,
          stripeSessionId: order.stripeSessionId,
          customerEmail: order.email,
          customerName: order.name,
          orderId: order.id,
          paymentMethod: 'stripe',
        },
      });
      console.log('✅ Demo order seeded');
    }
  }

  console.log('🎉 Database seeding completed!');
}
