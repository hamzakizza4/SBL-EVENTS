import React from 'react';
import { useApp } from '../context/AppContext';
import { Page } from '../types';
import { getThemeClasses } from '../utils/themeStyles';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Calendar, 
  Layers, 
  Lock, 
  ShieldCheck, 
  Crown,
  PhoneCall,
  Star,
  Flame,
  Info
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    openBookingModal, 
    isAdminLoggedIn, 
    currentAdminUser, 
    theme,
    isBookingModalOpen,
    isSearchOpen
  } = useApp();

  const t = getThemeClasses(theme);

  // Hide bottom nav if modal or search is open for clean screen real-estate
  if (isBookingModalOpen || isSearchOpen) {
    return null;
  }

  const handleNav = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      id="mobile-bottom-nav-dock"
      aria-label="Mobile Navigation Dock"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-2 pb-2 pt-1 pointer-events-none"
    >
      <div className={`max-w-md mx-auto pointer-events-auto ${t.navPillBg} backdrop-blur-2xl border ${t.navPillBorder} rounded-3xl p-1.5 shadow-2xl shadow-black/80 flex flex-col gap-1`}>
        
        {/* Row 1: Quick Access Utility Strip (Services, 3D Stage, Gallery, About, Admin) */}
        <div className="flex items-center justify-between gap-1 px-1 py-0.5 border-b border-white/10">
          <button
            id="mobile-dock-services"
            onClick={() => handleNav('services')}
            className={`flex-1 py-1 px-0.5 rounded-xl flex items-center justify-center gap-1 transition-all text-center cursor-pointer ${
              currentPage === 'services'
                ? 'bg-amber-400 text-stone-950 font-black shadow-xs'
                : 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <Flame className="w-3 h-3 shrink-0" />
            <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">Services</span>
          </button>

          <button
            id="mobile-dock-stage"
            onClick={() => handleNav('stage-planner')}
            className={`flex-1 py-1 px-0.5 rounded-xl flex items-center justify-center gap-1 transition-all text-center cursor-pointer ${
              currentPage === 'stage-planner'
                ? 'bg-amber-400 text-stone-950 font-black shadow-xs'
                : 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <Layers className="w-3 h-3 shrink-0" />
            <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">3D Stage</span>
          </button>

          <button
            id="mobile-dock-gallery"
            onClick={() => handleNav('gallery')}
            className={`flex-1 py-1 px-0.5 rounded-xl flex items-center justify-center gap-1 transition-all text-center cursor-pointer ${
              currentPage === 'gallery'
                ? 'bg-amber-400 text-stone-950 font-black shadow-xs'
                : 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <ImageIcon className="w-3 h-3 shrink-0" />
            <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">Gallery</span>
          </button>

          <button
            id="mobile-dock-about"
            onClick={() => handleNav('about')}
            className={`flex-1 py-1 px-0.5 rounded-xl flex items-center justify-center gap-1 transition-all text-center cursor-pointer ${
              currentPage === 'about'
                ? 'bg-amber-400 text-stone-950 font-black shadow-xs'
                : 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <Info className="w-3 h-3 shrink-0" />
            <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">About</span>
          </button>

          <button
            id="mobile-dock-admin"
            onClick={() => handleNav('admin')}
            className={`flex-1 py-1 px-0.5 rounded-xl flex items-center justify-center gap-1 transition-all text-center cursor-pointer ${
              currentPage === 'admin'
                ? 'bg-amber-400 text-stone-950 font-black shadow-xs'
                : isAdminLoggedIn
                ? 'text-emerald-300 bg-emerald-950/40 border border-emerald-500/30'
                : 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            {isAdminLoggedIn ? (
              currentAdminUser?.isMajorAdmin ? (
                <Crown className="w-3 h-3 text-amber-400 shrink-0" />
              ) : (
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              )
            ) : (
              <Lock className="w-3 h-3 shrink-0" />
            )}
            <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">
              {isAdminLoggedIn ? 'Console' : 'Admin'}
            </span>
          </button>
        </div>

        {/* Row 2: Main Direct Action Dock (Home, Availability, Book Now, Reviews, Contact) */}
        <div className="flex items-center justify-around gap-1 pt-0.5">
          {/* Home */}
          <button
            id="mobile-dock-home"
            onClick={() => handleNav('home')}
            className={`flex-1 py-1 px-0.5 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all text-center min-h-[44px] cursor-pointer ${
              currentPage === 'home'
                ? 'text-amber-400 font-extrabold bg-white/10 shadow-xs'
                : `${t.navLinkDefault} hover:text-white`
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-bold whitespace-nowrap">Home</span>
          </button>

          {/* Availability */}
          <button
            id="mobile-dock-availability"
            onClick={() => handleNav('calendar')}
            className={`flex-1 py-1 px-0.5 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all text-center min-h-[44px] cursor-pointer ${
              currentPage === 'calendar'
                ? 'text-amber-400 font-extrabold bg-white/10 shadow-xs'
                : `${t.navLinkDefault} hover:text-white`
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-[10px] font-bold whitespace-nowrap">Availability</span>
          </button>

          {/* Center Prominent Book Event Action */}
          <button
            id="mobile-dock-book-now"
            onClick={() => openBookingModal()}
            className="relative -top-2 px-3 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-stone-950 font-black shadow-xl shadow-amber-400/40 border-2 border-stone-950 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer shrink-0 min-w-[58px]"
            title="Book Your Event"
          >
            <Flame className="w-4 h-4 text-stone-950 fill-stone-950" />
            <span className="text-[9px] uppercase tracking-wider font-black text-stone-950 leading-none whitespace-nowrap">
              Book
            </span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
            </span>
          </button>

          {/* Review / Testimonials */}
          <button
            id="mobile-dock-review"
            onClick={() => handleNav('testimonials')}
            className={`flex-1 py-1 px-0.5 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all text-center min-h-[44px] cursor-pointer ${
              currentPage === 'testimonials'
                ? 'text-amber-400 font-extrabold bg-white/10 shadow-xs'
                : `${t.navLinkDefault} hover:text-white`
            }`}
          >
            <Star className="w-4 h-4" />
            <span className="text-[10px] font-bold whitespace-nowrap">Review</span>
          </button>

          {/* Contact */}
          <button
            id="mobile-dock-contact"
            onClick={() => handleNav('contact')}
            className={`flex-1 py-1 px-0.5 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all text-center min-h-[44px] cursor-pointer ${
              currentPage === 'contact'
                ? 'text-amber-400 font-extrabold bg-white/10 shadow-xs'
                : `${t.navLinkDefault} hover:text-white`
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span className="text-[10px] font-bold whitespace-nowrap">Contact</span>
          </button>
        </div>

      </div>
    </nav>
  );
};

