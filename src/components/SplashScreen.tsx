import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_CONTACT_INFO } from '../data/mockData';
import { SblLogo } from './SblLogo';
import sblWeddingSplashImg from '../assets/images/sbl_wedding_splash_1788000507920.jpg';
import { 
  Crown, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Phone, 
  Film, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  X,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SplashScreen: React.FC = () => {
  const { isSplashScreenOpen, closeSplashScreen, openBookingModal } = useApp();
  const [progress, setProgress] = useState(0);

  // Auto-progress bar (12 seconds total with auto-entry)
  useEffect(() => {
    if (!isSplashScreenOpen) return;

    setProgress(0);
    const startTime = Date.now();
    const totalDuration = 12000; // 12 seconds total loading

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(timer);
      }
    }, 50);

    const autoCloseTimer = setTimeout(() => {
      closeSplashScreen();
    }, totalDuration);

    return () => {
      clearInterval(timer);
      clearTimeout(autoCloseTimer);
    };
  }, [isSplashScreenOpen, closeSplashScreen]);

  // Keyboard shortcut listener (ESC or Enter to dismiss)
  useEffect(() => {
    if (!isSplashScreenOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        closeSplashScreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSplashScreenOpen, closeSplashScreen]);

  if (!isSplashScreenOpen) return null;

  const handleEnterApp = () => {
    closeSplashScreen();
  };

  const handleBookNow = () => {
    closeSplashScreen();
    openBookingModal();
  };

  return (
    <AnimatePresence>
      <motion.div
        id="sbl-splash-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.03 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed inset-0 z-[100] flex flex-col justify-between overflow-y-auto bg-[#070F1E] text-white select-none"
      >
        {/* Background Image with Cinematic Cover Overlay - Highly Visible & Vibrant */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 12, ease: 'easeOut' }}
            src={sblWeddingSplashImg}
            alt="SBL Luxury Events & Wedding Production"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-105 saturate-110"
          />
          {/* Subtle Gradient & Vignette Cover - Lightened for Maximum Visual Detail */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060D1A]/90 via-[#0A1629]/40 to-black/25" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(6,13,26,0.6)_100%)]" />
        </div>

        {/* Top Header Bar */}
        <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SblLogo size="md" badge="Official Hub" />
          </div>

          <div className="flex items-center gap-3">
            {/* Direct TikTok Quick Link */}
            <a
              href="https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-600/90 to-rose-600/90 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg border border-white/20 transition-all transform hover:scale-105"
            >
              <Film className="w-3.5 h-3.5" />
              <span>TikTok @sblofficial92</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Skip / Close Button */}
            <button
              onClick={handleEnterApp}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Skip Intro</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Center Main Stage / Splash Content */}
        <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 text-center flex flex-col items-center justify-center space-y-6 sm:space-y-8 my-auto">
          
          {/* Motto Pill */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-amber-500/20 text-amber-200 border border-amber-400/40 text-xs sm:text-sm font-extrabold backdrop-blur-md shadow-2xl"
          >
            <Crown className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="tracking-widest uppercase text-white drop-shadow-sm font-['Outfit']">
              "We Design Your Dream"
            </span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </motion.div>

          {/* Majestic Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="space-y-3"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none font-['Outfit'] drop-shadow-lg">
              SBL EVENTS <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-amber-200">UGANDA</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Mega Marquees, Royal Kwanjula & Wedding Stages, Intelligent Lighting, Line Array Audio & Air-Conditioned Mobile Suites.
            </p>
          </motion.div>

          {/* Main Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md pt-2"
          >
            {/* Primary Enter Button */}
            <button
              id="splash-enter-experience-btn"
              onClick={handleEnterApp}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-100 text-[#0F1F38] font-black text-sm sm:text-base shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] cursor-pointer"
            >
              <span>Enter SBL Experience</span>
              <ArrowRight className="w-4 h-4 text-[#0F1F38]" />
            </button>

            {/* Direct Booking Modal Button */}
            <button
              id="splash-book-now-btn"
              onClick={handleBookNow}
              className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0F1F38] font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#0F1F38]" />
              <span>Book Event</span>
            </button>
          </motion.div>

          {/* Direct TikTok & Phone Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 pt-1"
          >
            <a
              href="https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-300 transition-colors flex items-center gap-1.5 font-semibold text-pink-200"
            >
              <Film className="w-3.5 h-3.5 text-pink-400" />
              <span>TikTok: https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/</span>
            </a>
            <span>•</span>
            <a
              href={`tel:${COMPANY_CONTACT_INFO.phone}`}
              className="hover:text-white transition-colors flex items-center gap-1.5 font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hotline: 0752 420 911</span>
            </a>
          </motion.div>

        </main>

        {/* Bottom Progress Bar & Footer Bar */}
        <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-300" />
            <span>SBL Events Production & Rental Co. • All rights reserved</span>
          </div>

          {/* Dynamic Auto-Advance Progress Tracker (12s Loading) */}
          <div className="w-full sm:w-80 flex items-center gap-3">
            <span className="text-[10px] text-amber-300 font-mono font-bold whitespace-nowrap">
              Entering in {Math.max(1, Math.ceil(12 - (progress / 100) * 12))}s ({Math.round(progress)}%)
            </span>
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden border border-white/20">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-white transition-all duration-75 rounded-full"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
            <button
              onClick={handleEnterApp}
              className="text-white hover:text-amber-300 font-bold whitespace-nowrap cursor-pointer text-[10px] uppercase tracking-wider bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md border border-white/20 transition-all"
            >
              Enter Now (Esc)
            </button>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};
