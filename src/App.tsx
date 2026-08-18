/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
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
import { AnimatePresence, motion } from 'motion/react';
import { getThemeClasses } from './utils/themeStyles';

const AppContent: React.FC = () => {
  const { currentPage, theme } = useApp();
  const t = getThemeClasses(theme);

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
      case 'admin':
        return <AdminDashboard key="admin" />;
      default:
        return <HomeView key="home-default" />;
    }
  };

  return (
    <div className={`min-h-screen ${t.canvasBg} ${t.canvasText} flex flex-col selection:bg-amber-500 selection:text-slate-950 transition-colors duration-300 font-['Plus_Jakarta_Sans',sans-serif]`}>
      <Navbar />

      <main className="flex-grow">
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

      <Footer />
      <QuickBookingModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

