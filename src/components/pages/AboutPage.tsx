'use client';

import { motion } from 'framer-motion';
import { Award, Heart, Users, Target, Eye, Shield } from 'lucide-react';

const values = [
  { icon: Award, title: 'التميز', description: 'نسعى باستمرار إلى التميز بالجودة من خلال العمل الجماعي ورضا العملاء والتحسين والتعليم المستمر.' },
  { icon: Heart, title: 'الرحمة', description: 'المرضى هم مصدر قوتنا. نحن نخدم جميع المرضى برحمة وكرامة.' },
  { icon: Users, title: 'الاحترام', description: 'نحن نحترم قيمة وتنوع كل مريض وكذلك كل شخص يعمل أو يخدم في مجمع كلينيك 9 الطبي.' },
  { icon: Shield, title: 'المسؤولية', description: 'نحن مسؤولون عن نتائجنا ونتحمل المسؤولية عن أفعالنا.' },
  { icon: Target, title: 'الثقة', description: 'نبني الثقة في قدرتنا من خلال توقع احتياجات مجتمعنا والمرضى والاستجابة لها.' },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero Banner */}
      <section className="bg-gradient-to-l from-[#6DB3D7] to-[#5DADE2] py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            من نحن
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 text-white/80">
            <span>الرئيسية</span>
            <span>/</span>
            <span>من نحن</span>
          </motion.div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-[#2C3E50] mb-6">مركز العيادة التاسعة</h2>
            <p className="text-[#333] leading-relaxed text-lg mb-8">
              مركز العيادة التاسعة هو مركز طبي خاص يهدف لتقديم خدمات صحية ذات جودة متميزة وفقا لأعلى المعايير الصحية العالمية، حيث يحتوي مجمع العيادة التاسعة الطبي على عيادات طبية متخصصة، ويتميز بتوفر تقنيات طبية متطورة يشرف عليها نخبة من الكفاءات يقدمون أسلوبا جديدا من الرعاية الصحية بالمنطقة.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#EBF5FB] rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-[#6DB3D7] rounded-xl flex items-center justify-center shrink-0">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#2C3E50] mb-3">رسالتنا</h3>
                <p className="text-[#333] leading-relaxed">
                  يكرس مركز كلينيك 9 الطبي جهوده لتقديم خدمات رعاية صحية متميزة ومتفوقة بتكلفة تنافسية باستخدام أفضل الممارسات الطبية القائمة على الأدلة، حيث يكون المريض مركز الاهتمام.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#6DB3D7] rounded-2xl p-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">رؤيتنا</h3>
                <p className="text-white/90 leading-relaxed">
                  أن تكون كلينك 9 خيار المرضى من أجل رعاية صحية عالية الجودة وسلامة المرضى، في المنطقة الشرقية.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#2C3E50] text-center mb-12">قيمنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#EBF5FB] rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-[#6DB3D7]" />
                </div>
                <h4 className="text-lg font-bold text-[#2C3E50] mb-2">{value.title}</h4>
                <p className="text-[#7F8C8D] text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">طرق التواصل</h2>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[#333]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">الرقم الموحد:</span>
              <a href="tel:9200006802" className="text-[#6DB3D7] font-bold" dir="ltr">9200006802</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">واتساب:</span>
              <a href="https://wa.me/0537666284" className="text-[#6DB3D7] font-bold" dir="ltr">0537666284</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
