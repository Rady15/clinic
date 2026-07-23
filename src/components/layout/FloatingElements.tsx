'use client';

import { useState } from 'react';
import { MessageCircle, Instagram, Youtube, X, Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function WhatsAppFAB() {
  return (
    <a
      href="https://wa.me/0537666284"
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
          واتساب
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-white rotate-45" />
        </div>
      </div>
    </a>
  );
}

export function SocialSidebar() {
  const socials = [
    { icon: Instagram, href: '#', color: 'hover:bg-pink-500' },
    { icon: Youtube, href: '#', color: 'hover:bg-red-500' },
    { icon: MessageCircle, href: 'https://wa.me/0537666284', color: 'hover:bg-green-500' },
    { icon: MessageCircle, href: 'https://wa.me/0537666284', color: 'hover:bg-green-600' },
  ];

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 p-2">
      {socials.map((social, i) => (
        <a
          key={i}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-10 h-10 bg-[#2C3E50] rounded-l-lg flex items-center justify-center text-white ${social.color} transition-all hover:w-12`}
        >
          <social.icon className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
}

export function CookieBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

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
          <p>
            نستخدم ملفات تعريف الارتباط (الكوكيز) لتحسين تجربتك على موقع عيادة التاسعة. من خلال تصفحك لهذا الموقع، فإنك توافق على استخدامنا لملفات تعريف الارتباط.
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="bg-[#6DB3D7] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#5DADE2] transition-colors shrink-0"
        >
          موافقة
        </button>
      </div>
    </motion.div>
  );
}

export function PromoPopup() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="fixed bottom-24 left-6 z-40 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
      >
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 left-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="w-3 h-3 text-gray-500" />
        </button>
        <div className="bg-[#6DB3D7] p-4 text-center">
          <p className="text-white font-bold text-lg">باقة مميزة</p>
        </div>
        <div className="p-4">
          <p className="text-sm font-semibold text-[#333] mb-2">
            2 بلازما +2 خلايا جذعية + 2 ميزو ثيربي +2 اكسوزوم
          </p>
          <p className="text-[#6DB3D7] font-bold text-xl mb-3">3,800 ر.س</p>
          <a
            href="#"
            className="block w-full bg-[#6DB3D7] text-white text-center py-2.5 rounded-lg font-semibold text-sm hover:bg-[#5DADE2] transition-colors"
          >
            احجز الآن
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
