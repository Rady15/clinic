'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import AdminLogin from './AdminLogin';
import AdminSidebar from './AdminSidebar';
import DashboardHome from './DashboardHome';
import BannerManager from './BannerManager';
import ServiceManager from './ServiceManager';
import CategoryManager from './CategoryManager';
import DoctorManager from './DoctorManager';
import ArticleManager from './ArticleManager';
import TestimonialManager from './TestimonialManager';
import BeforeAfterManager from './BeforeAfterManager';
import InsuranceManager from './InsuranceManager';
import VideoManager from './VideoManager';
import PromoPopupManager from './PromoPopupManager';
import PageContentManager from './PageContentManager';
import SettingsManager from './SettingsManager';
import NavManager from './NavManager';
import SocialLinksManager from './SocialLinksManager';
import WorkingHoursManager from './WorkingHoursManager';
import BookingManager from './BookingManager';
import OrderManager from './OrderManager';
import MessageManager from './MessageManager';
import JobApplicationManager from './JobApplicationManager';
import RatingManager from './RatingManager';
import CtaBannerManager from './CtaBannerManager';
import ImageBannerManager from './ImageBannerManager';

const adminPages: Record<string, React.ComponentType> = {
  'dashboard': DashboardHome,
  'banners': BannerManager,
  'services': ServiceManager,
  'categories': CategoryManager,
  'doctors': DoctorManager,
  'articles': ArticleManager,
  'testimonials': TestimonialManager,
  'before-after': BeforeAfterManager,
  'insurance': InsuranceManager,
  'videos': VideoManager,
  'promo-popup': PromoPopupManager,
  'page-content': PageContentManager,
  'settings': SettingsManager,
  'nav-items': NavManager,
  'social-links': SocialLinksManager,
  'working-hours': WorkingHoursManager,
  'bookings': BookingManager,
  'orders': OrderManager,
  'messages': MessageManager,
  'job-applications': JobApplicationManager,
  'ratings': RatingManager,
  'cta-banner': CtaBannerManager,
  'image-banners': ImageBannerManager,
};

function getInitialAdminPage(): string {
  if (typeof window === 'undefined') return 'dashboard';
  const saved = localStorage.getItem('admin_page');
  if (saved && adminPages[saved]) return saved;
  return 'dashboard';
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentPage, setCurrentPageState] = useState(getInitialAdminPage);
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/admin/auth', { method: 'GET' })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then(data => {
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const setCurrentPage = (page: string) => {
    setCurrentPageState(page);
    localStorage.setItem('admin_page', page);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch { /* ignore */ }
    localStorage.removeItem('admin_page');
    setIsAuthenticated(false);
    setCurrentPageState('dashboard');
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">جاري التحقق...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const AdminPageComponent = adminPages[currentPage] || DashboardHome;

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      <AdminSidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
        <AdminPageComponent />
      </main>
    </div>
  );
}
