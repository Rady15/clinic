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
    { key: 'phone', value: '0501234567', label: 'رقم الهاتف', type: 'text', group: 'contact' },
    { key: 'phone2', value: '', label: 'رقم الهاتف الثاني', type: 'text', group: 'contact' },
    { key: 'email', value: 'info@clinic9sa.com', label: 'البريد الإلكتروني', type: 'text', group: 'contact' },
    { key: 'whatsapp', value: '966501234567', label: 'واتساب', type: 'text', group: 'contact' },
    { key: 'address_ar', value: 'جدة، المملكة العربية السعودية', label: 'العنوان بالعربي', type: 'textarea', group: 'contact' },
    { key: 'address_en', value: 'Jeddah, Saudi Arabia', label: 'العنوان بالإنجليزي', type: 'textarea', group: 'contact' },
    { key: 'about_text_ar', value: 'عيادة 9 southern هي مركز طبي متكامل يقدم أفضل الخدمات الطبية والتجميلية', label: 'نبذة عربية', type: 'textarea', group: 'general' },
    { key: 'about_text_en', value: '9 Southern Clinic is an integrated medical center providing the best medical and cosmetic services', label: 'About Text (EN)', type: 'textarea', group: 'general' },
    { key: 'working_hours_text', value: 'السبت - الخميس: 10:00 ص - 10:00 م | الجمعة: مغلق', label: 'ساعات العمل', type: 'textarea', group: 'contact' },
    { key: 'logo_url', value: '', label: 'رابط الشعار', type: 'image', group: 'appearance' },
    { key: 'primary_color', value: '#6DB3D7', label: 'اللون الأساسي', type: 'text', group: 'appearance' },
    { key: 'instagram', value: 'https://instagram.com/clinic9sa', label: 'Instagram', type: 'text', group: 'social' },
    { key: 'twitter', value: 'https://twitter.com/clinic9sa', label: 'Twitter', type: 'text', group: 'social' },
    { key: 'snapchat', value: 'https://snapchat.com/add/clinic9sa', label: 'Snapchat', type: 'text', group: 'social' },
    { key: 'tiktok', value: 'https://tiktok.com/@clinic9sa', label: 'TikTok', type: 'text', group: 'social' },
    { key: 'youtube', value: 'https://youtube.com/@clinic9sa', label: 'YouTube', type: 'text', group: 'social' },
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
    { nameAr: 'جلدية', nameEn: 'Dermatology', slug: 'dermatology', icon: 'Stethoscope', image: '', order: 1 },
    { nameAr: 'ليزر', nameEn: 'Laser', slug: 'laser', icon: 'Zap', image: '', order: 2 },
    { nameAr: 'الأسنان', nameEn: 'Dental', slug: 'dental', icon: 'Smile', image: '', order: 3 },
    { nameAr: 'النساء و الولادة', nameEn: 'Obstetrics', slug: 'obstetrics', icon: 'Heart', image: '', order: 4 },
    { nameAr: 'التغذية و التخسيس', nameEn: 'Nutrition', slug: 'nutrition', icon: 'Activity', image: '', order: 5 },
    { nameAr: 'العلاج الطبيعي', nameEn: 'Physiotherapy', slug: 'physiotherapy', icon: 'BriefcaseMedical', image: '', order: 6 },
    { nameAr: 'التجميل النسائي', nameEn: 'Female Cosmetic', slug: 'female-cosmetic', icon: 'Sparkles', image: '', order: 7 },
    { nameAr: 'المختبر', nameEn: 'Laboratory', slug: 'lab', icon: 'FlaskConical', image: '', order: 8 },
  ];

  for (const c of catData) {
    const exists = await db.serviceCategory.findUnique({ where: { slug: c.slug } });
    if (!exists) {
      await db.serviceCategory.create({ data: c });
    }
  }
  console.log('✅ Categories seeded');

  // Get category IDs for services
  const categories = await db.serviceCategory.findMany();
  const catMap: Record<string, string> = {};
  for (const c of categories) catMap[c.slug] = c.id;

  // 4. Services
  const serviceData = [
    { nameAr: '3 جلسات ليزر جسم للسيدات', nameEn: '3 Laser Body Sessions - Women', descriptionAr: '', descriptionEn: '', price: 729, originalPrice: 1010, image: '', badge: '-28%', isOffer: true, isFeatured: true, categoryId: catMap['laser'], subcategoryAr: 'ليزر السيدات', subcategoryEn: 'Laser Women', order: 1 },
    { nameAr: 'قوالب تبييض الاسنان', nameEn: 'Teeth Whitening Trays', price: 400, categoryId: catMap['dental'], subcategoryAr: 'تبييض الاسنان', subcategoryEn: 'Teeth Whitening', order: 2 },
    { nameAr: 'كشف + سونار خارجي', nameEn: 'Checkup + External Ultrasound', price: 149, originalPrice: 380, badge: '-61%', isOffer: true, categoryId: catMap['obstetrics'], subcategoryAr: 'السونار', subcategoryEn: 'Ultrasound', order: 3 },
    { nameAr: 'ليزر منطقة من اختيارك للسيدات', nameEn: 'Laser for Selected Area - Women', price: 89, originalPrice: 200, badge: '-56%', isOffer: true, categoryId: catMap['laser'], subcategoryAr: 'ليزر السيدات', order: 4 },
    { nameAr: '2 مل سالمون', nameEn: '2ml Salmon Injection', price: 1000, categoryId: catMap['dermatology'], subcategoryAr: 'أبر النضارة ومحفزات الكولاجين', subcategoryEn: 'Collagen Boosters', order: 5 },
    { nameAr: 'بوتكس للوجه', nameEn: 'Botox for Face', price: 599, categoryId: catMap['dermatology'], subcategoryAr: 'البوتكس و الفيلر', subcategoryEn: 'Botox & Filler', order: 6 },
    { nameAr: 'فيلر شفايف 1 مل', nameEn: 'Lip Filler 1ml', price: 1200, categoryId: catMap['dermatology'], subcategoryAr: 'البوتكس و الفيلر', order: 7 },
    { nameAr: 'تنظيف بشرة عميق', nameEn: 'Deep Skin Cleansing', price: 350, categoryId: catMap['dermatology'], subcategoryAr: 'تنظيف البشرة', subcategoryEn: 'Skin Cleansing', order: 8 },
    { nameAr: 'تقشير كربوني للوجه', nameEn: 'Carbon Peel', price: 450, categoryId: catMap['dermatology'], subcategoryAr: 'التشقير و التقشير الكربوني', order: 9 },
    { nameAr: 'تقويم أسنان معدني', nameEn: 'Metal Braces', price: 4500, categoryId: catMap['dental'], subcategoryAr: 'تقويم الاسنان', order: 10 },
    { nameAr: 'زراعة سن واحد', nameEn: 'Single Tooth Implant', price: 3500, categoryId: catMap['dental'], subcategoryAr: 'الزراعة', order: 11 },
    { nameAr: 'باقة التخسيس الشاملة', nameEn: 'Comprehensive Slimming Package', price: 1800, categoryId: catMap['nutrition'], subcategoryAr: 'باقات التخسيس', order: 12 },
    { nameAr: '12 جلسة علاج طبيعي بالليزر', nameEn: '12 Physiotherapy Sessions', price: 840, originalPrice: 1680, badge: '-50%', isOffer: true, categoryId: catMap['physiotherapy'], order: 13 },
    { nameAr: 'تحليل دم شامل', nameEn: 'Complete Blood Test', price: 350, categoryId: catMap['lab'], order: 14 },
  ];

  const existingServices = await db.service.count();
  if (existingServices === 0) {
    for (const s of serviceData) {
      await db.service.create({
        data: {
          nameAr: s.nameAr, nameEn: s.nameEn || '',
          descriptionAr: s.descriptionAr || '', descriptionEn: s.descriptionEn || '',
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
  const doctorData = [
    { nameAr: 'د. حنان محمد', nameEn: 'Dr. Hanan Mohamed', specialtyAr: 'أخصائية الجلدية والتجميل والليزر', specialtyEn: 'Dermatology, Cosmetics & Laser', experienceAr: 'خبرة 15 عام', experienceEn: '15 years experience', departmentAr: 'جلدية', departmentEn: 'Dermatology', order: 1 },
    { nameAr: 'د. لورانس يوسف', nameEn: 'Dr. Lawrence Youssef', specialtyAr: 'استشاري الأسنان', specialtyEn: 'Dental Consultant', experienceAr: 'خبرة 39 عام', experienceEn: '39 years experience', departmentAr: 'الأسنان', departmentEn: 'Dental', order: 2 },
    { nameAr: 'د. مروة المحلاوي', nameEn: 'Dr. Marwa El-Mahlawy', specialtyAr: 'أخصائية الجلدية والتجميل والليزر', specialtyEn: 'Dermatology & Laser', experienceAr: 'خبرة 15 عام', experienceEn: '15 years experience', departmentAr: 'جلدية', departmentEn: 'Dermatology', order: 3 },
    { nameAr: 'د. مازن العموري', nameEn: 'Dr. Mazen Al-Omouri', specialtyAr: 'تجميل الأسنان', specialtyEn: 'Cosmetic Dentistry', experienceAr: 'خبرة 24 سنة', experienceEn: '24 years experience', departmentAr: 'الأسنان', departmentEn: 'Dental', order: 4 },
    { nameAr: 'د. أمل أبو المعاطي', nameEn: 'Dr. Amal Abu El-Mataati', specialtyAr: 'أسنان متقدمة', specialtyEn: 'Advanced Dentistry', experienceAr: 'خبرة 10 سنوات', experienceEn: '10 years experience', departmentAr: 'الأسنان', departmentEn: 'Dental', order: 5 },
    { nameAr: 'د. وسيم وجوخ', nameEn: 'Dr. Waseem Wajoukh', specialtyAr: 'تقويم الأسنان', specialtyEn: 'Orthodontics', experienceAr: 'خبرة 20 عام', experienceEn: '20 years experience', departmentAr: 'الأسنان', departmentEn: 'Dental', order: 6 },
    { nameAr: 'د. أمل المربط', nameEn: 'Dr. Amal Al-Murbat', specialtyAr: 'أمراض النساء والتوليد', specialtyEn: 'Obstetrics & Gynecology', experienceAr: 'خبرة 20 سنة', experienceEn: '20 years experience', departmentAr: 'النساء والولادة', departmentEn: 'Obstetrics', order: 7 },
    { nameAr: 'د. رباب سليمان', nameEn: 'Dr. Rabab Suleiman', specialtyAr: 'أمراض النساء والولادة والموجات', specialtyEn: 'OB/GYN & Ultrasound', experienceAr: 'ماجستير النساء والولادة', experienceEn: 'Master in OB/GYN', departmentAr: 'النساء والولادة', departmentEn: 'Obstetrics', order: 8 },
  ];

  const existingDoctors = await db.doctor.count();
  if (existingDoctors === 0) {
    for (const d of doctorData) {
      await db.doctor.create({ data: d });
    }
    console.log('✅ Doctors seeded');
  }

  // 6. Articles
  const articleData = [
    { titleAr: 'العلاقة بين التغذية وحب الشباب', titleEn: 'Nutrition and Acne', excerptAr: 'تعد العلاقة بين التغذية وحب الشباب من المواضيع المهمة', excerptEn: 'The relationship between nutrition and acne is an important topic', contentAr: 'محتوى المقال هنا...', contentEn: 'Article content here...', image: '', tagAr: 'جديد حصرياً', tagEn: 'New Exclusive', author: 'admin', readTime: '5 دقائق' },
    { titleAr: 'أحدث التقنيات لعلاج الندبات', titleEn: 'Latest Scar Treatment Techniques', excerptAr: 'تطورت تقنيات علاج الندبات بشكل كبير', excerptEn: 'Scar treatment techniques have evolved greatly', contentAr: 'محتوى المقال...', contentEn: 'Content...', image: '', tagAr: 'طبي', tagEn: 'Medical', author: 'admin', readTime: '7 دقائق' },
    { titleAr: 'العناية بالبشرة في فصل الصيف', titleEn: 'Summer Skincare Tips', excerptAr: 'مع ارتفاع درجات الحرارة تحتاج البشرة عناية خاصة', excerptEn: 'With rising temperatures your skin needs special care', contentAr: 'محتوى المقال...', contentEn: 'Content...', image: '', tagAr: 'جديد حصرياً', tagEn: 'New Exclusive', author: 'admin', readTime: '8 دقائق' },
    { titleAr: 'فوائد البلازما للشعر والبشرة', titleEn: 'Plasma Benefits for Hair and Skin', excerptAr: 'تعتبر علاج البلازما من أحدث التقنيات', excerptEn: 'Plasma treatment is one of the latest technologies', contentAr: 'محتوى المقال...', contentEn: 'Content...', image: '', tagAr: 'علاج', tagEn: 'Treatment', author: 'admin', readTime: '6 دقائق' },
    { titleAr: 'أهمية تقويم الأسنان', titleEn: 'Importance of Orthodontics', excerptAr: 'تقويم الأسنان ليس فقط للجمال بل له فوائد صحية', excerptEn: 'Orthodontics is not just for beauty but has health benefits', contentAr: 'محتوى المقال...', contentEn: 'Content...', image: '', author: 'admin', readTime: '5 دقائق' },
    { titleAr: 'الأمراض الجلدية بعد كورونا', titleEn: 'Skin Diseases After COVID', excerptAr: 'أظهرت الدراسات أن فيروس كورونا يمكن أن يسبب أعراض جلدية', excerptEn: 'Studies show COVID can cause skin symptoms', contentAr: 'محتوى المقال...', contentEn: 'Content...', image: '', author: 'admin', readTime: '10 دقائق' },
  ];

  const existingArticles = await db.article.count();
  if (existingArticles === 0) {
    for (const a of articleData) {
      await db.article.create({ data: a });
    }
    console.log('✅ Articles seeded');
  }

  // 7. Testimonials
  const existingTestimonials = await db.testimonial.count();
  if (existingTestimonials === 0) {
    await db.testimonial.createMany({
      data: [
        { nameAr: 'سارة أحمد', nameEn: 'Sarah Ahmed', textAr: 'تجربة رائعة مع العيادة، الدكتورة حنان محترفة جداً في الجلدية والتجميل', textEn: 'Amazing experience with the clinic, Dr. Hanan is very professional', rating: 5, order: 1 },
        { nameAr: 'نورة محمد', nameEn: 'Noura Mohamed', textAr: 'خدمة ممتازة وأسعار مناسبة، أنصح الجميع بالتعامل مع العيادة', textEn: 'Excellent service and reasonable prices', rating: 5, order: 2 },
        { nameAr: 'فاطمة علي', nameEn: 'Fatima Ali', textAr: 'بيئة نظيفة ومريحة، والطاقم الطبي متعاون جداً', textEn: 'Clean and comfortable environment with cooperative staff', rating: 4, order: 3 },
        { nameAr: 'ريم خالد', nameEn: 'Reem Khaled', textAr: 'أفضل عيادة في المنطقة، تجربتي مع تقويم الأسنان كانت ممتازة', textEn: 'Best clinic in the area, my orthodontics experience was excellent', rating: 5, order: 4 },
      ],
    });
    console.log('✅ Testimonials seeded');
  }

  // 8. Insurance Companies
  const existingInsurance = await db.insuranceCompany.count();
  if (existingInsurance === 0) {
    await db.insuranceCompany.createMany({
      data: [
        { nameAr: 'بوبا', nameEn: 'Bupa', logo: '', order: 1 },
        { nameAr: 'تكافل', nameEn: 'Takaful', logo: '', order: 2 },
        { nameAr: 'ميدغلف', nameEn: 'Medgulf', logo: '', order: 3 },
        { nameAr: 'أكسا', nameEn: 'AXA', logo: '', order: 4 },
        { nameAr: 'التعاونية', nameEn: 'Cooperative', logo: '', order: 5 },
      ],
    });
    console.log('✅ Insurance companies seeded');
  }

  // 9. Videos
  const existingVideos = await db.video.count();
  if (existingVideos === 0) {
    await db.video.createMany({
      data: [
        { titleAr: 'جولة في العيادة', titleEn: 'Clinic Tour', thumbnail: '', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 1 },
        { titleAr: 'خدمات الليزر', titleEn: 'Laser Services', thumbnail: '', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 2 },
        { titleAr: 'خدمات الأسنان', titleEn: 'Dental Services', thumbnail: '', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 3 },
      ],
    });
    console.log('✅ Videos seeded');
  }

  // 10. Banners
  const existingBanners = await db.banner.count();
  if (existingBanners === 0) {
    await db.banner.createMany({
      data: [
        { titleAr: 'مرحباً بك في عيادة 9 southern', titleEn: 'Welcome to 9 Southern Clinic', subtitleAr: 'نقدم أفضل الخدمات الطبية والتجميلية', subtitleEn: 'Best Medical & Cosmetic Services', bgColor: '#6DB3D7', order: 1 },
        { titleAr: 'عروض حصرية', titleEn: 'Exclusive Offers', subtitleAr: 'خصومات تصل إلى 50%', subtitleEn: 'Discounts up to 50%', bgColor: '#5DADE2', order: 2 },
        { titleAr: 'احجز موعدك الآن', titleEn: 'Book Your Appointment Now', subtitleAr: 'سهولة الحجز عبر الإنترنت', subtitleEn: 'Easy Online Booking', bgColor: '#48C9B0', order: 3 },
      ],
    });
    console.log('✅ Banners seeded');
  }

  // 11. Promo Popup
  const existingPopup = await db.promoPopup.count();
  if (existingPopup === 0) {
    await db.promoPopup.create({
      data: {
        titleAr: 'عروض الصيف 🔥',
        titleEn: 'Summer Offers 🔥',
        descriptionAr: 'احصل على خصم 30% على جميع خدمات الليزر',
        descriptionEn: 'Get 30% off on all laser services',
        ctaTextAr: 'استعرض العروض',
        ctaTextEn: 'View Offers',
        ctaLink: '#offers',
      },
    });
    console.log('✅ Promo popup seeded');
  }

  // 12. Page Content
  const existingPages = await db.pageContent.count();
  if (existingPages === 0) {
    await db.pageContent.createMany({
      data: [
        { pageKey: 'about', titleAr: 'من نحن', titleEn: 'About Us', contentAr: 'عيادة 9 southern هي مركز طبي متكامل يقدم أفضل الخدمات الطبية والتجميلية في جدة. نحن نسعى لتقديم رعاية صحية متميزة بأحدث التقنيات وأفضل الأطباء.', contentEn: '9 Southern Clinic is an integrated medical center providing the best medical and cosmetic services in Jeddah.' },
        { pageKey: 'contact', titleAr: 'اتصل بنا', titleEn: 'Contact Us', contentAr: 'تواصل معنا لأي استفسار أو حجز موعد', contentEn: 'Contact us for any inquiries or appointment booking' },
        { pageKey: 'terms', titleAr: 'الشروط والأحكام', titleEn: 'Terms & Conditions', contentAr: 'شروط استخدام الموقع والخدمات المقدمة', contentEn: 'Website terms of use and services terms' },
      ],
    });
    console.log('✅ Page content seeded');
  }

  // 13. Nav Items
  const existingNav = await db.navItem.count();
  if (existingNav === 0) {
    const navs = await Promise.all([
      db.navItem.create({ data: { labelAr: 'الرئيسية', labelEn: 'Home', page: 'home', order: 1 } }),
      db.navItem.create({ data: { labelAr: 'من نحن', labelEn: 'About', page: 'about', order: 2 } }),
      db.navItem.create({ data: { labelAr: 'الخدمات', labelEn: 'Services', page: 'services', order: 3 } }),
      db.navItem.create({ data: { labelAr: 'الأطباء', labelEn: 'Doctors', page: 'doctors', order: 4 } }),
      db.navItem.create({ data: { labelAr: 'الأخبار', labelEn: 'News', page: 'news', order: 5 } }),
      db.navItem.create({ data: { labelAr: 'اتصل بنا', labelEn: 'Contact', page: 'contact', order: 6 } }),
      db.navItem.create({ data: { labelAr: 'حجز موعد', labelEn: 'Booking', page: 'booking', order: 7 } }),
    ]);
    // Add children to services nav
    await db.navItem.create({ data: { labelAr: 'جلدية', labelEn: 'Dermatology', page: 'services', params: JSON.stringify({ category: 'dermatology' }), parentId: navs[2].id, order: 1 } });
    await db.navItem.create({ data: { labelAr: 'ليزر', labelEn: 'Laser', page: 'services', params: JSON.stringify({ category: 'laser' }), parentId: navs[2].id, order: 2 } });
    await db.navItem.create({ data: { labelAr: 'الأسنان', labelEn: 'Dental', page: 'services', params: JSON.stringify({ category: 'dental' }), parentId: navs[2].id, order: 3 } });
    await db.navItem.create({ data: { labelAr: 'العروض', labelEn: 'Offers', page: 'offers', parentId: navs[2].id, order: 4 } });
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

  console.log('🎉 Database seeding completed!');
}
