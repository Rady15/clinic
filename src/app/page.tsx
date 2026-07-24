'use client';

import { useNavigationStore } from '@/store/navigation-store';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { WhatsAppFAB, SocialSidebar, CookieBar, PromoPopup } from '@/components/layout/FloatingElements';
import HomePage from '@/components/pages/HomePage';
import AboutPage from '@/components/pages/AboutPage';
import ServicesPage from '@/components/pages/ServicesPage';
import DoctorsPage from '@/components/pages/DoctorsPage';
import NewsPage from '@/components/pages/NewsPage';
import ContactPage from '@/components/pages/ContactPage';
import JobsPage from '@/components/pages/JobsPage';
import BookingPage from '@/components/pages/BookingPage';
import RatingPage from '@/components/pages/RatingPage';
import CartPage from '@/components/pages/CartPage';
import AccountPage from '@/components/pages/AccountPage';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { AnimatePresence, motion } from 'framer-motion';

const pages: Record<string, React.ComponentType> = {
  home: HomePage,
  about: AboutPage,
  services: ServicesPage,
  offers: ServicesPage,
  doctors: DoctorsPage,
  news: NewsPage,
  'news-article': NewsPage,
  contact: ContactPage,
  jobs: JobsPage,
  booking: BookingPage,
  rating: RatingPage,
  cart: CartPage,
  account: AccountPage,
};

export default function Page() {
  const { currentPage } = useNavigationStore();

  // Admin dashboard - full screen, no header/footer
  if (currentPage === 'admin') {
    return <AdminDashboard />;
  }

  const PageComponent = pages[currentPage] || HomePage;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <PageComponent />
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
      <WhatsAppFAB />
      <SocialSidebar />
      <CookieBar />
      <PromoPopup />
    </div>
  );
}
