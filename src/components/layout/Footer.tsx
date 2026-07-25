'use client';

import { useState, useEffect } from 'react';
import { useNavigationStore } from '@/store/navigation-store';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';
import { Phone, Mail, MessageCircle, Instagram, Youtube, MapPin, Clock, Twitter, Music, Ghost } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SocialLinkData {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
}

interface WorkingHourData {
  id: string;
  dayAr: string;
  dayEn: string;
  from: string;
  to: string;
  order: number;
}

interface ServiceCategoryData {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
}

export default function Footer() {
  const { setCurrentPage } = useNavigationStore();
  const { locale } = useLanguageStore();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [socialLinks, setSocialLinks] = useState<SocialLinkData[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHourData[]>([]);
  const [categories, setCategories] = useState<ServiceCategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/public/settings').then(r => r.json()).catch(() => []),
      fetch('/api/public/social-links').then(r => r.json()).catch(() => []),
      fetch('/api/public/working-hours').then(r => r.json()).catch(() => []),
      fetch('/api/public/service-categories').then(r => r.json()).catch(() => []),
    ]).then(([settData, socialData, hoursData, catData]) => {
      const sMap: Record<string, string> = {};
      Object.entries(settData || {}).forEach(([key, value]) => { sMap[key] = value as string; });
      setSettings(sMap);
      setSocialLinks((socialData || []).filter((s: SocialLinkData) => s.isActive !== false));
      setWorkingHours((hoursData || []).filter((h: WorkingHourData) => h.isActive !== false).sort((a: WorkingHourData, b: WorkingHourData) => a.order - b.order));
      setCategories((catData || []).filter((c: ServiceCategoryData) => c.isActive !== false));
      setLoading(false);
    });
  }, []);

  const phone = settings.phone || '9200006802';
  const whatsapp = settings.whatsapp || '0537666284';
  const email = settings.email || 'info@clinic9sa.com';
  const clinicName = settings.clinicName || (locale === 'en' ? 'Clinic 9' : 'العيادة التاسعة');
  const clinicDesc = settings.clinicDesc || (locale === 'en' ? 'Clinic 9 Medical Center - Providing high-quality healthcare services' : 'مركز العيادة التاسعة الطبي - نقدم خدمات صحية ذات جودة متميزة');
  const address = settings.address || (locale === 'en' ? 'Eastern Province, Saudi Arabia' : 'المنطقة الشرقية، المملكة العربية السعودية');
  const logoUrl = settings.logo_url || '';

  const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    instagram: Instagram,
    youtube: Youtube,
    snapchat: Ghost,
    tiktok: Music,
    twitter: Twitter,
    whatsapp: Phone,
  };

  if (loading) {
    return (
      <footer className="bg-[#2C3E50] text-white">
        <div className="bg-[#6DB3D7]"><div className="max-w-7xl mx-auto px-4 py-8"><Skeleton className="h-20 w-full bg-white/20" /></div></div>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => <div key={i}><Skeleton className="h-4 w-24 mb-4 bg-white/10" /><Skeleton className="h-3 w-full mb-2 bg-white/10" /><Skeleton className="h-3 w-3/4 bg-white/10" /></div>)}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#2C3E50] text-white">
      {/* Working Hours Section */}
      {workingHours.length > 0 && (
        <div className="bg-[#6DB3D7]">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h3 className="text-2xl font-bold text-center mb-6">
              {locale === 'en' ? 'Working Hours' : 'مواعيد العمل'}
            </h3>
            <div className={`grid gap-4 ${workingHours.length <= 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'}`}>
              {workingHours.map((wh) => (
                <div key={wh.id} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <p className="font-semibold text-lg">{locale === 'en' ? wh.dayEn : wh.dayAr}</p>
                  <p className="text-sm opacity-90 mt-1">{wh.from} – {wh.to}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#6DB3D7] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">C9</span>
              </div>
              <span className="text-lg font-bold">{clinicName}</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">{clinicDesc}</p>
            <div className="flex items-center gap-3">
              {socialLinks.map(link => {
                const IconComp = socialIconMap[link.platform];
                return IconComp ? (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#6DB3D7] transition-colors">
                    <IconComp className="w-4 h-4" />
                  </a>
                ) : null;
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">{locale === 'en' ? 'Quick Links' : 'روابط سريعة'}</h4>
            <ul className="space-y-2">
              {[
                { label: t('nav.home', locale), page: 'home' as const },
                { label: t('nav.about', locale), page: 'about' as const },
                { label: t('nav.doctors', locale), page: 'doctors' as const },
                { label: t('nav.contact', locale), page: 'contact' as const },
                { label: t('nav.news', locale), page: 'news' as const },
                { label: t('nav.booking', locale), page: 'booking' as const },
              ].map(link => (
                <li key={link.label}>
                  <button onClick={() => setCurrentPage(link.page)} className="text-sm text-gray-300 hover:text-[#6DB3D7] transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 className="text-lg font-bold mb-4">{locale === 'en' ? 'Departments' : 'الأقسام'}</h4>
            <ul className="space-y-2">
              {categories.slice(0, 7).map(cat => (
                <li key={cat.id}>
                  <button onClick={() => setCurrentPage('services', { category: cat.slug })} className="text-sm text-gray-300 hover:text-[#6DB3D7] transition-colors">
                    {locale === 'en' ? cat.nameEn : cat.nameAr}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">{locale === 'en' ? 'Contact Info' : 'معلومات التواصل'}</h4>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#6DB3D7] transition-colors">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span className="font-semibold" dir="ltr">{phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#6DB3D7] transition-colors">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>{email}</span>
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${whatsapp}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#6DB3D7] transition-colors">
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span className="font-semibold" dir="ltr">{whatsapp}</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-gray-400">
            {locale === 'en' ? `Copyright © ${new Date().getFullYear()} ${clinicName}. ${t('footer.rights', locale)}.` : `حقوق الطبع والنشر © ${new Date().getFullYear()} ${clinicName}. ${t('footer.rights', locale)}.`}
          </p>
          <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm text-gray-400">
            <Phone className="w-4 h-4" />
            <span className="font-semibold" dir="ltr">{phone}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
