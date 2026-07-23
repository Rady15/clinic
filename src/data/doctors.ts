export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  department: string;
  image: string;
}

export const doctors: Doctor[] = [
  {
    id: 1,
    name: 'د. حنان محمد',
    specialty: 'أخصائية الجلدية والتجميل والليزر',
    experience: 'خبرة 15 عام - حاصلة على ماجستير الجلدية والتجميل والليزر',
    department: 'جلدية',
    image: '/doctors/doctor-female-1.jpg',
  },
  {
    id: 2,
    name: 'د. لورانس يوسف',
    specialty: 'استشاري الأسنان',
    experience: 'خبرة أكثر من 39 عام - حاصل على شهادة الاختصاص العالي والهيئة السعودية',
    department: 'الأسنان',
    image: '/doctors/doctor-male-1.jpg',
  },
  {
    id: 3,
    name: 'د. مروة المحلاوي',
    specialty: 'أخصائية الجلدية والتجميل والليزر',
    experience: 'خبرة 15 عام - حاصلة على ماجستير الجلدية والتجميل والليزر',
    department: 'جلدية',
    image: '/doctors/doctor-female-2.jpg',
  },
  {
    id: 4,
    name: 'د. مازن العموري',
    specialty: 'تجميل الأسنان',
    experience: 'خبرة 24 سنة - حاصل على دبلوم تجميل الأسنان',
    department: 'الأسنان',
    image: '/doctors/doctor-male-2.jpg',
  },
  {
    id: 5,
    name: 'د. منى أبو المعاطي',
    specialty: 'أسنان متقدمة',
    experience: 'خبرة 10 سنوات - حاصلة على دبلوم الأسنان المتقدم',
    department: 'الأسنان',
    image: '/doctors/doctor-female-3.jpg',
  },
  {
    id: 6,
    name: 'د. وسيم وجوخ',
    specialty: 'تقويم الأسنان',
    experience: 'خبرة 20 عام - حاصل على ماجستير في تقويم الأسنان',
    department: 'الأسنان',
    image: '/doctors/doctor-male-3.jpg',
  },
  {
    id: 7,
    name: 'د. أمل المربط',
    specialty: 'أمراض النساء والتوليد',
    experience: 'خبرة 20 سنة - شهادة اختصاص في التوليد وأمراض النساء',
    department: 'النساء والولادة',
    image: '/doctors/doctor-female-4.jpg',
  },
  {
    id: 8,
    name: 'د. رباب سليمان',
    specialty: 'أمراض النساء والولادة والموجات',
    experience: 'ماجستير النساء والولادة موسكو - دبلوم الموجات فوق الصوتية',
    department: 'النساء والولادة',
    image: '/doctors/doctor-female-5.jpg',
  },
  {
    id: 9,
    name: 'د. نعمة عمران',
    specialty: 'طب عام',
    experience: 'خبرة 41 سنة - حاصلة على شهادات من جامعة القاهرة',
    department: 'العيادات',
    image: '/doctors/doctor-female-6.jpg',
  },
  {
    id: 10,
    name: 'د. هبة عارف',
    specialty: 'طب الأطفال',
    experience: 'خبرة بأكثر من 10 أعوام',
    department: 'العيادات',
    image: '/doctors/doctor-female-7.jpg',
  },
  {
    id: 11,
    name: 'د. هيثم جحجاح',
    specialty: 'طب وجراحة',
    experience: 'خبرة 30 عام - حاصلة على شهادة بكالوريوس طب وجراحة',
    department: 'العيادات',
    image: '/doctors/doctor-male-4.jpg',
  },
  {
    id: 12,
    name: 'د. إشراق عبد الله',
    specialty: 'طب الأطفال',
    experience: 'أخصائي طب الأطفال',
    department: 'العيادات',
    image: '/doctors/doctor-female-8.jpg',
  },
  {
    id: 13,
    name: 'د. عدنان ال سيف',
    specialty: 'علاج جذور وعصب الأسنان',
    experience: 'الامتيازات السريرية لعلاج جذور وعصب الأسنان',
    department: 'الأسنان',
    image: '/doctors/doctor-male-5.jpg',
  },
  {
    id: 14,
    name: 'د. رواح جعفر',
    specialty: 'تجميل الأسنان',
    experience: 'خبرة ٨ سنوات - بكالوريوس طب الأسنان - دبلوم تجميل الأسنان',
    department: 'الأسنان',
    image: '/doctors/doctor-male-6.jpg',
  },
];

export const departments = [
  'الكل', 'جلدية', 'الأسنان', 'النساء والولادة', 'العيادات'
];
