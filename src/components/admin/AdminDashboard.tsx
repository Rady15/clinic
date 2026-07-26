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
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [checking, setChecking] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const localAuth = localStorage.getItem('admin_auth');
    if (localAuth === 'true') {
      setIsAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-[#6DB3D7] border-t-transparent rounded-full" />
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
