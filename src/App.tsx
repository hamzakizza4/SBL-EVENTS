/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AdminContentSyncProvider } from './context/AdminContentSyncContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { QuickBookingModal } from './components/QuickBookingModal';
import { HomeView } from './components/HomeView';
import { ServicesView } from './components/ServicesView';
import { GalleryView } from './components/GalleryView';
import { CalendarView } from './components/CalendarView';
import { AboutView } from './components/AboutView';
import { TestimonialsView } from './components/TestimonialsView';
import { ContactBookingView } from './components/ContactBookingView';
import { AdminDashboard } from './components/AdminDashboard';
import { StagePlannerView } from './components/StagePlannerView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { SplashScreen } from './components/SplashScreen';
import { EmailConfirmationModal } from './components/EmailConfirmationModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { AdminCardEditModal } from './components/AdminCardEditModal';
import { AnimatePresence, motion } from 'motion/react';
import { getThemeClasses } from './utils/themeStyles';
import { Lock, Crown, ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage,
    isAdminLoggedIn,
    currentAdminUser,
    theme, 
    isEmailModalOpen, 
    closeEmailModal, 
    activeEmailConfirmation, 
    triggerMockEmailConfirmation,
    openSearch,
    toggleSearch,
    openShortcuts,
    openBookingModal
  } = useApp();
  const t = getThemeClasses(theme);

  // Global Hotkeys for instant access
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't trigger single-letter shortcuts when focused in inputs or textareas
      const target = e.target as HTMLElement | null;
      const isInput = target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable);

      // Cmd/Ctrl + K -> Toggle Global Search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleSearch();
        return;
      }

      if (isInput) return;

      // '/' to quick-search
      if (e.key === '/') {
        e.preventDefault();
        openSearch();
        return;
      }

      // '?' to open shortcuts
      if (e.key === '?') {
        e.preventDefault();
        openShortcuts();
        return;
      }

      // 'b' or 'B' to open booking modal
      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        openBookingModal();
        return;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [toggleSearch, openSearch, openShortcuts, openBookingModal]);

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView key="home" />;
      case 'services':
        return <ServicesView key="services" />;
      case 'gallery':
        return <GalleryView key="gallery" />;
      case 'calendar':
        return <CalendarView key="calendar" />;
      case 'about':
        return <AboutView key="about" />;
      case 'testimonials':
        return <TestimonialsView key="testimonials" />;
      case 'contact':
        return <ContactBookingView key="contact" />;
      case 'stage-planner':
        return <StagePlannerView key="stage-planner" />;
      case 'admin':
        return <AdminDashboard key="admin" />;
      default:
        return <HomeView key="home-default" />;
    }
  };

  return (
    <div className={`min-h-screen ${t.canvasBg} ${t.canvasText} flex flex-col selection:bg-amber-500 selection:text-slate-950 transition-colors duration-300 font-['Plus_Jakarta_Sans',sans-serif]`}>
      <Navbar />

      <main className="flex-grow pb-36 sm:pb-32 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Desktop Admin Quick-Access Pill (Guarantees Admin is 100% visible and accessible on desktop) */}
      <div className="hidden lg:flex fixed bottom-6 left-6 z-30">
        <button
          id="desktop-floating-admin-quick-btn"
          onClick={() => {
            setCurrentPage('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-3.5 py-2 rounded-full text-xs font-black backdrop-blur-xl border shadow-xl flex items-center gap-2 transition-all duration-200 cursor-pointer group hover:scale-105 active:scale-95 ${
            currentPage === 'admin'
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/40 ring-2 ring-amber-400/30'
              : isAdminLoggedIn
              ? 'bg-[#0B1322]/90 text-amber-300 border-amber-500/50 hover:bg-amber-400 hover:text-slate-950 shadow-black/60'
              : 'bg-[#0B1322]/90 text-slate-200 border-white/20 hover:border-amber-400/70 hover:text-amber-200 shadow-black/60'
          }`}
          title={isAdminLoggedIn ? `Logged in: ${currentAdminUser?.name} (${currentAdminUser?.userId})` : 'Open SBL Staff & Admin Console'}
        >
          {isAdminLoggedIn ? (
            currentAdminUser?.isMajorAdmin ? (
              <Crown className="w-3.5 h-3.5 text-amber-400 group-hover:text-slate-950" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:text-slate-950" />
            )
          ) : (
            <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300" />
          )}
          <span>
            {isAdminLoggedIn 
              ? `${currentAdminUser?.isMajorAdmin ? 'Major Admin' : 'Admin'}: ${currentAdminUser?.name.split(' ')[0]}`
              : 'Admin Portal'}
          </span>
          {isAdminLoggedIn && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>
      </div>

      <FloatingWhatsAppButton />
      <MobileBottomNav />
      <Footer />
      <QuickBookingModal />
      <GlobalSearchModal />
      <KeyboardShortcutsModal />
      <ToastContainer />
      <AdminCardEditModal />
      <SplashScreen />
      <EmailConfirmationModal
        isOpen={isEmailModalOpen}
        onClose={closeEmailModal}
        bookingData={activeEmailConfirmation}
        onResendEmail={(email) => {
          if (activeEmailConfirmation) {
            triggerMockEmailConfirmation(activeEmailConfirmation, email);
          }
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AdminContentSyncProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AdminContentSyncProvider>
  );
}

