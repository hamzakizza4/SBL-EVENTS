import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Page } from '../types';
import { getThemeClasses } from '../utils/themeStyles';
import { ThemeSwitcher } from './ThemeSwitcher';
import { SblLogo } from './SblLogo';
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
  Crown, 
  Film,
  Flame,
  Search,
  Keyboard,
  Command
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    openBookingModal, 
    isAdminLoggedIn, 
    currentAdminUser, 
    theme, 
    openSplashScreen,
    openSearch,
    openShortcuts
  } = useApp();
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
    { id: 'services', label: 'Services', icon: <Flame className="w-3.5 h-3.5 text-amber-400" /> },
    { 
      id: 'stage-planner', 
      label: '3D Stage', 
      icon: <Layers className="w-3.5 h-3.5 text-amber-400" />,
      badge: '3D'
    },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: 'calendar', label: 'Availability', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'about', label: 'About', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'testimonials', label: 'Reviews', icon: <MessageSquareQuote className="w-3.5 h-3.5" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-3.5 h-3.5" /> },
    { 
      id: 'admin', 
      label: 'Admin', 
      icon: <Lock className="w-3.5 h-3.5 text-amber-300" />,
      badge: isAdminLoggedIn ? (currentAdminUser?.isMajorAdmin ? 'Super' : 'Staff') : undefined
    }
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
        isScrolled ? `${t.navBgScrolled} border-b ${t.navBorder} py-2` : `${t.navBgTop} py-2.5`
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2">
          
          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden cursor-pointer shrink-0"
          >
            <SblLogo size="md" animated={true} badge="We Design Your Dream" />
          </button>

          {/* Desktop Navigation Pills */}
          <nav className={`hidden lg:flex items-center gap-0.5 xl:gap-1 ${t.navPillBg} p-1 rounded-full border ${t.navPillBorder} backdrop-blur-md shadow-xs shrink`}>
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              const isAdminItem = item.id === 'admin';
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? isAdminItem 
                        ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                        : t.navLinkActive 
                      : isAdminItem
                        ? 'text-amber-300 hover:text-amber-200 hover:bg-amber-400/20'
                        : `${t.navLinkDefault} ${t.navLinkHover}`
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-[#0F1F38] text-white'
                          : 'bg-amber-400/30 text-amber-200'
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
          <div className="hidden sm:flex items-center gap-1.5 xl:gap-2 shrink-0">
            {/* Global Search / Command Palette Trigger */}
            <button
              id="nav-search-trigger-btn"
              onClick={() => openSearch()}
              title="Search Services, Equipment & Setups (Ctrl+K)"
              className="p-2 xl:px-2.5 xl:py-1.5 rounded-xl text-xs border border-white/20 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 font-semibold shadow-xs cursor-pointer group shrink-0"
            >
              <Search className="w-3.5 h-3.5 text-slate-300 group-hover:text-white" />
              <span className="hidden 2xl:inline text-slate-300 group-hover:text-white">Search</span>
              <kbd className="hidden xl:inline-flex items-center gap-0.5 px-1 py-0.5 rounded-md bg-white/10 border border-white/20 text-[9px] font-mono text-slate-300">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </button>

            {/* Keyboard Shortcuts Trigger */}
            <button
              id="nav-shortcuts-trigger-btn"
              onClick={() => openShortcuts()}
              title="Keyboard Accessibility & Shortcuts (?)"
              className="hidden xl:flex p-2 rounded-xl text-xs border border-white/20 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all items-center justify-center font-bold shadow-xs cursor-pointer shrink-0"
            >
              <Keyboard className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {/* TikTok Channel Quick Link */}
            <a
              id="nav-tiktok-link"
              href="https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/"
              target="_blank"
              rel="noopener noreferrer"
              title="SBL Official TikTok"
              className="hidden 2xl:flex p-2 xl:px-2.5 xl:py-1.5 rounded-xl text-xs border border-pink-500/40 bg-pink-600/20 hover:bg-pink-600 text-white transition-all items-center gap-1 font-bold shadow-xs shrink-0"
            >
              <Film className="w-3.5 h-3.5 text-pink-300 group-hover:text-white" />
              <span className="hidden 2xl:inline">TikTok</span>
            </a>

            {/* Replay Splash Intro */}
            <button
              id="nav-replay-splash-btn"
              onClick={() => openSplashScreen()}
              title="View SBL Splash Cover Screen"
              className="hidden 2xl:flex p-2 xl:px-2.5 xl:py-1.5 rounded-xl text-xs border border-amber-400/40 bg-amber-400/15 hover:bg-amber-400/25 text-amber-200 hover:text-white transition-all items-center gap-1 font-bold shadow-xs cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden 2xl:inline">Splash</span>
            </button>

            {/* Theme Selector Compact Button */}
            <div className="shrink-0">
              <ThemeSwitcher variant="compact" />
            </div>

            {/* Prominent High-Visibility Admin Portal Button */}
            <button
              id="nav-admin-btn"
              onClick={() => handleNav('admin')}
              title={isAdminLoggedIn ? `Logged in as ${currentAdminUser?.name}` : "Admin Portal & Staff Dashboard"}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs border transition-all flex items-center gap-1.5 font-black cursor-pointer shadow-md ${
                currentPage === 'admin'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/30 ring-2 ring-amber-400/40'
                  : isAdminLoggedIn
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/60 hover:bg-amber-400 hover:text-slate-950'
                  : 'bg-white/10 text-white border-amber-400/40 hover:bg-amber-400/20 hover:border-amber-400 hover:text-amber-200'
              }`}
            >
              {isAdminLoggedIn ? (
                currentAdminUser?.isMajorAdmin ? (
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                )
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span className="inline">
                {isAdminLoggedIn ? (currentAdminUser?.isMajorAdmin ? 'Major Admin' : 'Staff') : 'Admin Portal'}
              </span>
              {isAdminLoggedIn && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            <button
              id="nav-book-now-btn"
              onClick={() => openBookingModal()}
              className={`${t.primaryBtn} text-xs px-3.5 py-1.5 xl:px-4 xl:py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer font-extrabold`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Book Event</span>
            </button>
          </div>

          {/* Mobile Menu & Quick Controls */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <div className="scale-90 origin-right">
              <ThemeSwitcher variant="compact" />
            </div>

            <button
              id="mobile-search-btn"
              onClick={() => openSearch()}
              className="p-2 rounded-xl border border-white/20 bg-white/10 text-white cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl border border-white/20 bg-white/10 text-white cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden border-b ${t.navBorder} ${t.navPillBg} backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-2xl max-h-[85vh] overflow-y-auto`}>
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`w-full px-4 py-3 rounded-xl text-left text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-stone-950 font-black shadow-md'
                      : `${t.bodyText} hover:bg-white/10 hover:text-white`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/30 text-amber-200 font-black border border-amber-400/40">
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  )}
                </button>
              );
            })}

            <button
              id="mobile-nav-splash"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openSplashScreen();
              }}
              className="w-full px-4 py-3 rounded-xl text-left text-sm font-semibold transition-colors flex items-center justify-between border mt-1 bg-amber-400/10 text-amber-200 border-amber-400/30 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>View SBL Splash Cover Screen</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          </div>

          {/* Quick Contact Hotline */}
          <div className="pt-2 border-t border-white/10">
            <a
              href="tel:+256772473343"
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Direct Event Hotline: +256 772 473 343</span>
            </a>
          </div>

          <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openBookingModal();
              }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-sm text-center shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              <span>Book Your Event</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
