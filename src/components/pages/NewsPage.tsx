'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { articles } from '@/data/articles';
import { Clock, User, ArrowLeft, Stethoscope } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function NewsPage() {
  const { setCurrentPage, pageParams } = useNavigationStore();
  const articleId = pageParams.id;
  const selectedArticle = articleId ? articles.find(a => a.id === Number(articleId)) : null;

  if (selectedArticle) {
    return (
      <main>
        <section className="bg-gradient-to-l from-[#6DB3D7] to-[#5DADE2] py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white mb-4">{selectedArticle.title}</motion.h1>
            <div className="flex items-center justify-center gap-4 text-white/80 text-sm">
              <button onClick={() => setCurrentPage('home')} className="hover:text-white">الرئيسية</button>
              <span>/</span>
              <button onClick={() => setCurrentPage('news')} className="hover:text-white">الأخبار و المقالات</button>
              <span>/</span>
              <span>{selectedArticle.title}</span>
            </div>
          </div>
        </section>
        <article className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-6 text-sm text-[#7F8C8D] mb-8">
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {selectedArticle.author}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedArticle.readTime}</span>
            <span>{selectedArticle.date}</span>
          </div>
          <div className="h-72 bg-gradient-to-br from-[#EBF5FB] to-[#6DB3D7]/20 rounded-2xl flex items-center justify-center mb-8">
            <Stethoscope className="w-20 h-20 text-[#6DB3D7]/40" />
          </div>
          <div className="prose prose-lg max-w-none text-[#333] leading-relaxed">
            <p className="text-lg mb-6">{selectedArticle.excerpt}</p>
            <p>يعد هذا الموضوع من المواضيع المهمة في المجال الطبي، حيث تشير الأبحاث الحديثة إلى أهمية الوعي الصحي والوقاية من الأمراض. ننصح دائماً بزيارة الطبيب المختص للحصول على استشارة مهنية دقيقة.</p>
            <p>في العيادة التاسعة، نحرص على تقديم أفضل الخدمات الطبية بأعلى معايير الجودة، مع فريق من الأطباء المتخصصين الذين يواكبون أحدث التطورات في المجال الطبي.</p>
          </div>
          <div className="mt-10">
            <button onClick={() => setCurrentPage('news')} className="text-[#6DB3D7] font-semibold hover:underline flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> العودة للمقالات
            </button>
          </div>
        </article>
      </main>
    );
  }

  return (
    <main>
      <section className="bg-gradient-to-l from-[#6DB3D7] to-[#5DADE2] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-4">الأخبار و المقالات</motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 text-white/80">
            <button onClick={() => setCurrentPage('home')} className="hover:text-white">الرئيسية</button>
            <span>/</span>
            <span>الأخبار و المقالات</span>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setCurrentPage('news-article', { id: String(article.id) })}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="h-48 bg-gradient-to-br from-[#EBF5FB] to-[#6DB3D7]/20 flex items-center justify-center relative">
                {article.tag && (
                  <span className="absolute top-3 right-3 bg-[#6DB3D7] text-white text-xs px-2.5 py-1 rounded-full font-bold">{article.tag}</span>
                )}
                <Stethoscope className="w-14 h-14 text-[#6DB3D7]/40" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#333] mb-2 group-hover:text-[#6DB3D7] transition-colors leading-relaxed">{article.title}</h3>
                <p className="text-sm text-[#7F8C8D] mb-4 line-clamp-2 leading-relaxed">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-[#7F8C8D]">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                  </div>
                  <button className="text-[#6DB3D7] text-sm font-semibold hover:underline flex items-center gap-1">
                    قراءة المزيد <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
