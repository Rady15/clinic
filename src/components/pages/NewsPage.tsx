'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation-store';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';
import { Clock, User, ArrowLeft, Stethoscope } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ArticleData {
  id: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  image: string;
  tagAr: string;
  tagEn: string;
  author: string;
  readTime: string;
  isActive: boolean;
  createdAt: string;
}

export default function NewsPage() {
  const { setCurrentPage, pageParams } = useNavigationStore();
  const { locale } = useLanguageStore();
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const articleId = pageParams.id;
  const selectedArticle = articleId ? articles.find(a => a.id === articleId) : null;

  useEffect(() => {
    fetch('/api/public/articles')
      .then(r => r.json())
      .then((data: ArticleData[]) => {
        setArticles(data.filter((a: ArticleData) => a.isActive !== false));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main>
        <Skeleton className="h-48 w-full bg-gray-200" />
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl bg-gray-200" />)}
          </div>
        </div>
      </main>
    );
  }

  if (selectedArticle) {
    return (
      <main>
        <section className="bg-gradient-to-l from-[#6DB3D7] to-[#5DADE2] py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white mb-4">
              {locale === 'en' ? selectedArticle.titleEn : selectedArticle.titleAr}
            </motion.h1>
            <div className="flex items-center justify-center gap-4 text-white/80 text-sm">
              <button onClick={() => setCurrentPage('home')} className="hover:text-white">{t('nav.home', locale)}</button>
              <span>/</span>
              <button onClick={() => setCurrentPage('news')} className="hover:text-white">{t('nav.news', locale)}</button>
              <span>/</span>
              <span>{locale === 'en' ? selectedArticle.titleEn : selectedArticle.titleAr}</span>
            </div>
          </div>
        </section>
        <article className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-6 text-sm text-[#7F8C8D] mb-8">
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {selectedArticle.author}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedArticle.readTime} {t('news.minRead', locale)}</span>
            <span>{new Date(selectedArticle.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</span>
          </div>
          {selectedArticle.image ? (
            <img src={selectedArticle.image} alt="" className="w-full h-72 object-cover rounded-2xl mb-8" />
          ) : (
            <div className="h-72 bg-gradient-to-br from-[#EBF5FB] to-[#6DB3D7]/20 rounded-2xl flex items-center justify-center mb-8">
              <Stethoscope className="w-20 h-20 text-[#6DB3D7]/40" />
            </div>
          )}
          <div className="prose prose-lg max-w-none text-[#333] leading-relaxed">
            <p className="text-lg mb-6">{locale === 'en' ? selectedArticle.excerptEn : selectedArticle.excerptAr}</p>
            <div dangerouslySetInnerHTML={{ __html: locale === 'en' ? selectedArticle.contentEn : selectedArticle.contentAr }} />
          </div>
          <div className="mt-10">
            <button onClick={() => setCurrentPage('news')} className="text-[#6DB3D7] font-semibold hover:underline flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> {locale === 'en' ? 'Back to articles' : 'العودة للمقالات'}
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
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-4">{t('nav.news', locale)}</motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 text-white/80">
            <button onClick={() => setCurrentPage('home')} className="hover:text-white">{t('nav.home', locale)}</button>
            <span>/</span>
            <span>{t('nav.news', locale)}</span>
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
              onClick={() => setCurrentPage('news-article', { id: article.id })}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="h-48 relative overflow-hidden">
                {article.image ? (
                  <img src={article.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="h-full bg-gradient-to-br from-[#EBF5FB] to-[#6DB3D7]/20 flex items-center justify-center">
                    <Stethoscope className="w-14 h-14 text-[#6DB3D7]/40" />
                  </div>
                )}
                {(article.tagAr || article.tagEn) && (
                  <span className="absolute top-3 right-3 bg-[#6DB3D7] text-white text-xs px-2.5 py-1 rounded-full font-bold">
                    {locale === 'en' ? article.tagEn : article.tagAr}
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#333] mb-2 group-hover:text-[#6DB3D7] transition-colors leading-relaxed">
                  {locale === 'en' ? article.titleEn : article.titleAr}
                </h3>
                <p className="text-sm text-[#7F8C8D] mb-4 line-clamp-2 leading-relaxed">
                  {locale === 'en' ? article.excerptEn : article.excerptAr}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-[#7F8C8D]">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                  </div>
                  <button className="text-[#6DB3D7] text-sm font-semibold hover:underline flex items-center gap-1">
                    {t('news.readMore', locale)} <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {articles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-[#7F8C8D]">{locale === 'en' ? 'No articles yet' : 'لا توجد مقالات حالياً'}</p>
          </div>
        )}
      </div>
    </main>
  );
}
