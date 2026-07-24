'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard, Image, Stethoscope, FolderOpen, UserCog,
  Newspaper, Star, Shield, Video, Popcorn, FileText, Settings,
  Menu, LogOut, ChevronLeft, ChevronRight, MessageSquare,
  Briefcase, StarRating, Navigation, Share2, Clock
} from 'lucide-react';

interface AdminSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { id: 'banners', label: 'البنرات', icon: Image },
  { id: 'services', label: 'الخدمات', icon: Stethoscope },
  { id: 'categories', label: 'تصنيفات الخدمات', icon: FolderOpen },
  { id: 'doctors', label: 'الأطباء', icon: UserCog },
  { id: 'articles', label: 'المقالات', icon: Newspaper },
  { id: 'testimonials', label: 'آراء العملاء', icon: Star },
  { id: 'insurance', label: 'شركات التأمين', icon: Shield },
  { id: 'videos', label: 'الفيديوهات', icon: Video },
  { id: 'promo-popup', label: 'النافذة المنبثقة', icon: Popcorn },
  { id: 'page-content', label: 'محتوى الصفحات', icon: FileText },
  { id: 'settings', label: 'الإعدادات العامة', icon: Settings },
  { id: 'nav-items', label: 'القائمة', icon: Navigation },
  { id: 'social-links', label: 'روابط التواصل', icon: Share2 },
  { id: 'working-hours', label: 'ساعات العمل', icon: Clock },
  { id: 'bookings', label: 'الحجوزات', icon: Calendar },
  { id: 'messages', label: 'الرسائل', icon: MessageSquare },
  { id: 'job-applications', label: 'طلبات التوظيف', icon: Briefcase },
  { id: 'ratings', label: 'التقييمات', icon: StarRating },
];

export default function AdminSidebar({ currentPage, onPageChange, onLogout }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      localStorage.removeItem('admin_auth');
      localStorage.removeItem('admin_name');
      toast({ title: 'تم تسجيل الخروج' });
      onLogout();
    } catch {
      toast({ title: 'خطأ في تسجيل الخروج', variant: 'destructive' });
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#6DB3D7] rounded-lg flex items-center justify-center flex-shrink-0">
          <LayoutDashboard className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h2 className="font-bold text-gray-800 whitespace-nowrap">لوحة التحكم</h2>
            <p className="text-xs text-gray-500 whitespace-nowrap">مركز 9 Southern</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id);
                setMobileOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm',
                currentPage === item.id
                  ? 'bg-[#6DB3D7] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-2 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-all text-sm"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-50 transition-all text-sm mt-1"
        >
          {collapsed ? <ChevronLeft className="h-4 w-4 flex-shrink-0" /> : <ChevronRight className="h-4 w-4 flex-shrink-0" />}
          {!collapsed && <span>طي القائمة</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 right-4 z-50 lg:hidden bg-[#6DB3D7] text-white p-2 rounded-lg shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed top-0 right-0 h-full z-40 bg-white shadow-xl transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ width: 260 }}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:block bg-white border-l border-gray-200 transition-all duration-300 flex-shrink-0',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
