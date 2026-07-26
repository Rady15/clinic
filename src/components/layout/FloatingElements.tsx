'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Instagram, Youtube, X, Cookie, Phone, Twitter, Music, Ghost } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/store/language-store';
import { t } from '@/lib/i18n';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  whatsapp: Phone,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  snapchat: Ghost,
  tiktok: Music,
  phone: Phone,
  play: Youtube,
  message: MessageCircle,
};

interface SocialLinkData {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
  isActive: boolean;
}

interface PromoPopupData {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  ctaTextAr: string;
  ctaTextEn: string;
  ctaLink: string;
  image: string;
  isActive: boolean;
}

export function WhatsAppFAB() {
  const { locale } = useLanguageStore();
  const [whatsapp, setWhatsapp] = useState('0537666284');

  useEffect(() => {
    fetch('/api/public/settings')
      .then(r => r.json())
      .then((data: Record<string, string>) => {
        if (data.whatsapp) setWhatsapp(data.whatsapp);
      })
      .catch(() => {});
  }, []);

  return (
    <a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 group"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
        <div className="relative w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors whatsapp-pulse">
          <MessageCircle className="w-7 h-7 text-white" />
        </div>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-[#333] text-xs px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {t('float.chatNow', locale)}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-white rotate-45" />
        </div>
      </div>
    </a>
  );
}

export function SocialSidebar() {
  const [socialLinks, setSocialLinks] = useState<SocialLinkData[]>([]);

  useEffect(() => {
    fetch('/api/public/social-links')
      .then(r => r.json())
      .then((data: SocialLinkData[]) => {
        setSocialLinks(data.filter((s: SocialLinkData) => s.isActive !== false).sort((a: SocialLinkData, b: SocialLinkData) => a.order - b.order));
      })
      .catch(() => {});
  }, []);

  const colorMap: Record<string, string> = {
    instagram: 'hover:bg-pink-500',
    youtube: 'hover:bg-red-500',
    whatsapp: 'hover:bg-green-500',
    snapchat: 'hover:bg-yellow-500',
    tiktok: 'hover:bg-gray-700',
    twitter: 'hover:bg-blue-500',
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 p-2">
      {socialLinks.map(link => {
        const IconComponent = iconMap[link.platform] || iconMap[link.icon] || MessageCircle;
        return (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-10 h-10 bg-[#2C3E50] rounded-r-lg flex items-center justify-center text-white ${colorMap[link.platform] || 'hover:bg-[#6DB3D7]'} transition-all hover:w-12`}
        >
          <IconComponent className="w-4 h-4" />
        </a>
        );
      })}
    </div>
  );
}

export function CookieBar() {
  const { locale } = useLanguageStore();
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem('cookie-dismissed')) {
      setVisible(false);
    }
  }, []);

  if (!mounted || !visible) return null;

  const handleDismiss = () => {
    localStorage.setItem('cookie-dismissed', 'true');
    setVisible(false);
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 right-0 left-0 z-50 bg-[#2C3E50] text-white p-4"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm">
          <Cookie className="w-5 h-5 text-[#6DB3D7] shrink-0" />
          <p>{t('float.cookieText', locale)}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="bg-[#6DB3D7] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#5DADE2] transition-colors shrink-0"
        >
          {t('float.cookieAccept', locale)}
        </button>
      </div>
    </motion.div>
  );
}

export function PromoPopup() {
  const { locale } = useLanguageStore();
  const [visible, setVisible] = useState(false);
  const [promo, setPromo] = useState<PromoPopupData | null>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem('promo-dismissed');
    if (dismissed) return;

    fetch('/api/public/promo-popup')
      .then(r => r.json())
      .then((data: PromoPopupData[]) => {
        if (data && data.length > 0 && data[0].isActive !== false) {
          setPromo(data[0]);
          setTimeout(() => setVisible(true), 3000);
        }
      })
      .catch(() => {});
  }, []);

  if (!visible || !promo) return null;

  const handleDismiss = () => {
    localStorage.setItem('promo-dismissed', 'true');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="fixed bottom-24 left-6 z-40 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
      >
        <button
          onClick={handleDismiss}
          className="absolute top-2 left-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-3 h-3 text-gray-500" />
        </button>
        {promo.image ? (
          <img src={promo.image} alt="" className="w-full h-40 object-cover" />
        ) : (
          <div className="bg-[#6DB3D7] p-4 text-center">
            <p className="text-white font-bold text-lg">{locale === 'en' ? promo.titleEn : promo.titleAr}</p>
          </div>
        )}
        <div className="p-4">
          <p className="text-sm font-semibold text-[#333] mb-2 line-clamp-2">
            {locale === 'en' ? promo.descriptionEn : promo.descriptionAr}
          </p>
          {promo.ctaLink && (
            <a
              href={promo.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#6DB3D7] text-white text-center py-2.5 rounded-lg font-semibold text-sm hover:bg-[#5DADE2] transition-colors"
            >
              {locale === 'en' ? promo.ctaTextEn : promo.ctaTextAr}
            </a>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
