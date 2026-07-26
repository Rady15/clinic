import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PageName = 
  | 'home' 
  | 'about' 
  | 'services' 
  | 'offers' 
  | 'doctors' 
  | 'news' 
  | 'contact' 
  | 'jobs' 
  | 'booking' 
  | 'rating' 
  | 'cart' 
  | 'account' 
  | 'dashboard'
  | 'service-category'
  | 'news-article'
  | 'admin';

interface NavigationState {
  currentPage: PageName;
  pageParams: Record<string, string>;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isCartOpen: boolean;
  isLoginOpen: boolean;
  setCurrentPage: (page: PageName, params?: Record<string, string>) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setLoginOpen: (open: boolean) => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      currentPage: 'home',
      pageParams: {},
      isMobileMenuOpen: false,
      isSearchOpen: false,
      isCartOpen: false,
      isLoginOpen: false,
      setCurrentPage: (page, params = {}) => {
        set({ currentPage: page, pageParams: params, isMobileMenuOpen: false, isSearchOpen: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      setCartOpen: (open) => set({ isCartOpen: open }),
      setLoginOpen: (open) => set({ isLoginOpen: open }),
    }),
    {
      name: 'clinic-navigation',
      partialize: (state) => ({ currentPage: state.currentPage, pageParams: state.pageParams }),
    }
  )
);
