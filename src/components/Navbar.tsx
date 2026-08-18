import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Page } from '../types';
import { getThemeClasses } from '../utils/themeStyles';
import { ThemeSwitcher } from './ThemeSwitcher';
import { 
  Sparkles, 
  Calendar, 
  Phone, 
  Menu, 
  X, 
  Layers, 
  Image as ImageIcon, 
  Users, 
  MessageSquareQuote, 
  Mail, 
  Lock,
  ChevronRight,
  ShieldCheck,
  Crown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPage, setCurrentPage, openBookingModal, isAdminLoggedIn, currentAdminUser, theme } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = getThemeClasses(theme);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: Page; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'services', label: 'Services & Rentals', icon: <Layers className="w-3.5 h-3.5" />, badge: '10' },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: 'calendar', label: 'Availability', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'about', label: 'About Us', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'testimonials', label: 'Reviews', icon: <MessageSquareQuote className="w-3.5 h-3.5" /> },
    { id: 'contact', label: 'Book & Contact', icon: <Mail className="w-3.5 h-3.5" /> },
  ];

  const handleNav = (page: Page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? `${t.navBgScrolled} border-b ${t.navBorder} py-2.5` : `${t.navBgTop} py-3.5`
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-[#0F1F38] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 font-black">
              <span className="font-extrabold text-[#0F1F38] text-base tracking-tighter">SBL</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-slate-200 transition-colors">
                  SBL <span className="text-white/80 font-normal">EVENTS</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20 px-2 py-0.5 rounded-full">
                  Production & Rigging
                </span>
              </div>
              <p className="text-[11px] text-slate-300 tracking-wide font-normal">
                Mega Tents • Stages • Sound • Lighting • VIP Toilets
              </p>
            </div>
          </button>

          {/* Desktop Navigation Pills */}
          <nav className={`hidden lg:flex items-center gap-1 ${t.navPillBg} p-1 rounded-full border ${t.navPillBorder} backdrop-blur-md shadow-xs`}>
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive ? t.navLinkActive : `${t.navLinkDefault} ${t.navLinkHover}`
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-[#0F1F38] text-white'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Theme Selector Compact Button */}
            <ThemeSwitcher variant="compact" />

            <button
              id="nav-admin-btn"
              onClick={() => handleNav('admin')}
              title="Admin Dashboard"
              className={`px-3 py-2 rounded-xl text-xs border transition-all flex items-center gap-1.5 font-bold ${
                currentPage === 'admin'
                  ? 'bg-white text-[#0F1F38] border-white shadow-md'
                  : isAdminLoggedIn
                  ? 'bg-white/15 text-white border-white/30 hover:bg-white/25'
                  : 'bg-white/10 text-slate-200 border-white/20 hover:text-white hover:bg-white/15'
              }`}
            >
              {isAdminLoggedIn ? (
                currentAdminUser?.isMajorAdmin ? (
                  <Crown className="w-3.5 h-3.5 text-blue-200" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
                )
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              <span className="hidden md:inline">
                {isAdminLoggedIn ? (currentAdminUser?.isMajorAdmin ? 'Major Admin' : 'Sub-Admin') : 'Admin'}
              </span>
            </button>

            <button
              id="nav-book-now-btn"
              onClick={() => openBookingModal()}
              className={`${t.primaryBtn} text-xs sm:text-sm px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-md`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Event</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl border border-white/20 bg-white/10 text-white"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-white/15 bg-[#0F1F38] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`w-full px-4 py-3 rounded-xl text-left text-sm font-semibold transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-white text-[#0F1F38] font-bold shadow-md'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  )}
                </button>
              );
            })}

            <button
              id="mobile-nav-admin"
              onClick={() => handleNav('admin')}
              className={`w-full px-4 py-3 rounded-xl text-left text-sm font-semibold transition-colors flex items-center justify-between border mt-2 ${
                currentPage === 'admin'
                  ? 'bg-white text-[#0F1F38] border-white font-bold'
                  : 'bg-white/10 text-slate-200 border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4" />
                <span>
                  {isAdminLoggedIn
                    ? `Admin Portal (${currentAdminUser?.name})`
                    : 'Admin & Employee Portal'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          </div>

          <div className="pt-3 border-t border-white/15 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openBookingModal();
              }}
              className="flex-1 py-3 rounded-xl bg-white text-[#0F1F38] font-extrabold text-sm text-center shadow-md flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Your Event</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
