export interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
 image: string;
 tag?: string;
 content?: string;
}

export const articles: Article[] = [
  {
    id: 1,
    title: 'العلاقة بين التغذية وحب الشباب',
    excerpt: 'تعد العلاقة بين التغذية وحب الشباب من المواضيع المهمة التي تشغل بال الكثير من الأشخاص، خاصة الشباب والمراهقين الذين يعانون من هذه المشكلة الجلدية الشائعة.',
    date: '2025-07-14',
    author: 'admin',
    readTime: '5 دقائق',
    image: '/articles/nutrition-acne.jpg',
    tag: 'جديد حصرياً',
  },
  {
    id: 2,
    title: 'أحدث التقنيات لعلاج الندبات',
    excerpt: 'تطورت تقنيات علاج الندبات بشكل كبير في السنوات الأخيرة، مما يوفر حلولاً فعالة ومبتكرة للأشخاص الذين يعانون من آثار الحبوب أو الجروح أو العمليات الجراحية.',
    date: '2025-07-15',
    author: 'admin',
    readTime: '7 دقائق',
    image: '/articles/scar-treatment.jpg',
  },
  {
    id: 3,
    title: 'الأمراض الجلدية بعد كورونا',
    excerpt: 'أظهرت الدراسات أن فيروس كورونا المستجد يمكن أن يسبب مجموعة متنوعة من الأعراض الجلدية، بدءاً من طفح جلدي خفيف وحتى حالات أكثر خطورة.',
    date: '2025-07-15',
    author: 'admin',
    readTime: '10 دقائق',
    image: '/articles/skin-covid.jpg',
  },
  {
    id: 4,
    title: 'العناية بالبشرة في فصل الصيف',
    excerpt: 'مع ارتفاع درجات الحرارة في فصل الصيف، تحتاج البشرة إلى عناية خاصة للحفاظ على نضارتها وصحتها. تعرف على أهم النصائح للعناية ببشرتك خلال الصيف.',
    date: '2025-07-15',
    author: 'admin',
    readTime: '8 دقائق',
    image: '/articles/summer-skincare.jpg',
    tag: 'جديد حصرياً',
  },
  {
    id: 5,
    title: 'فوائد البلازما للشعر والبشرة',
    excerpt: 'تعتبر علاج البلازما الغنية بالصفائح الدموية (PRP) من أحدث التقنيات الطبية المستخدمة في تجديد البشرة وعلاج تساقط الشعر.',
    date: '2025-07-10',
    author: 'admin',
    readTime: '6 دقائق',
    image: '/articles/plasma.jpg',
  },
  {
    id: 6,
    title: 'أهمية تقويم الأسنان',
    excerpt: 'تقويم الأسنان ليس فقط للجمال بل له فوائد صحية عديدة تتجاوز المظهر الجمالي للابتسامة.',
    date: '2025-07-08',
    author: 'admin',
    readTime: '5 دقائق',
    image: '/articles/orthodontics.jpg',
  },
];
