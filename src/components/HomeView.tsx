import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_CONTACT_INFO, VIDEO_REELS } from '../data/mockData';
import kwanjulaRoyalStageImg from '../assets/images/kwanjula_royal_stage_1787463864885.jpg';
import sblMegaTentImg from '../assets/images/sbl_mega_tent_1787463878262.jpg';
import sblLedScreenImg from '../assets/images/sbl_led_screen_1787463891580.jpg';
import sblBridalDecorImg from '../assets/images/sbl_bridal_decor_1787463904784.jpg';
import sblWeddingSplashImg from '../assets/images/sbl_wedding_splash_1788000507920.jpg';
import sblStageBlueTrussImg from '../assets/images/sbl_stage_blue_truss_1788001016044.jpg';
import sblAboutGardenLightsImg from '../assets/images/sbl_about_garden_lights_1788001002948.jpg';
import { getThemeClasses } from '../utils/themeStyles';
import { ReviewAvatar } from './ReviewAvatar';
import { ImageWithSkeleton } from './ImageWithSkeleton';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollReveal';
import { 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Tv, 
  Tent, 
  Volume2, 
  Sparkle, 
  Bath, 
  Truck,
  Star, 
  ChevronRight, 
  Clock, 
  Crown,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Play,
  Film,
  ExternalLink,
  Heart,
  Users,
  Award,
  ChevronLeft,
  Sliders,
  Check,
  Flame,
  Globe,
  X,
  Tag,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HomeView: React.FC = () => {
  const { 
    calendarEvents, 
    testimonials, 
    galleryItems,
    services,
    setCurrentPage, 
    openBookingModal,
    openSplashScreen,
    theme
  } = useApp();

  const t = getThemeClasses(theme);

  const scrollToFirstSection = () => {
    const el = document.getElementById('sbl-content-start');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.75, behavior: 'smooth' });
    }
  };

  // Hero Background Slideshow State (Memoized for optimal performance & stability)
  const heroSlides = useMemo(() => [
    {
      image: sblWeddingSplashImg,
      tag: 'Royal Weddings & Kwanjula',
      badge: 'Bespoke Bridal Elegance',
      title: 'We Design Your Dream with Royal Staging & Luxury Marquees',
      subtitle: "Uganda's premier production powerhouse based in Lwengo & Masaka. Tailored bridal domes, silk drapery, crystal chandeliers, and flawless ceremony execution.",
    },
    {
      image: sblStageBlueTrussImg,
      tag: 'Concert Stages & Blue Truss Rigging',
      badge: 'Festivals & Concerts',
      title: 'Heavy Box Truss Stages, Moving Beams & P2.6 LED Video Walls',
      subtitle: 'Engineered structural aluminium stages, computerized moving heads, and line array mobile disco sound for unforgettable live experiences.',
    },
    {
      image: sblMegaTentImg,
      tag: 'High-Capacity Mega Marquees',
      badge: 'Empologoma ya Bannamasaka',
      title: 'Engineered European Clear-Span Mega Tents (100 to 5,000+ Guests)',
      subtitle: 'Newly imported high-peak structures with 100km/h wind anchoring, ducted HVAC air-conditioning, and integrated wooden cassette flooring.',
    },
    {
      image: sblAboutGardenLightsImg,
      tag: 'Magical Evening Garden Ambiances',
      badge: 'Atmospheric Lighting',
      title: 'Fairytale Garden Lighting, Festoons & Mood Illuminations',
      subtitle: 'Transform outdoor gardens into illuminated evening wonderlands with romantic fairy lights, warm amber washes, and low-fog dance floors.',
    }
  ], []);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Preload all hero slide images for instant, flicker-free transitions
  useEffect(() => {
    heroSlides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, [heroSlides]);

  // Auto slide hero every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Interactive Package & Estimate Builder State
  const [selectedEventType, setSelectedEventType] = useState<'wedding' | 'concert' | 'corporate' | 'b2b'>('wedding');
  const [guestCount, setGuestCount] = useState<number>(500);

  // Video Reel Modal Preview State
  const [activeVideoModal, setActiveVideoModal] = useState<typeof VIDEO_REELS[0] | null>(null);

  const upcomingShowcases = calendarEvents.slice(0, 3);
  const featuredTestimonials = testimonials.filter((test) => test.featured || test.rating === 5).slice(0, 3);

  // Calculate estimated equipment recommendation (starts from 25,000,000 UGX)
  const calculatePackageDetails = () => {
    if (selectedEventType === 'wedding') {
      const tentSize = guestCount <= 300 ? '15m x 25m Clear-Span Marquee' : guestCount <= 800 ? '20m x 40m Royal Mega Tent' : '30m x 60m Grand Dome Marquee';
      const screen = guestCount <= 400 ? '12m² P2.6 Curved LED Screen' : '24m² Dual Ultra-HD LED Walls';
      const audio = guestCount <= 400 ? '4-Top Line Array System + 4 Subs' : '8-Top Concert Line Array + 8 Subwoofers';
      const estimate = guestCount <= 300 ? 25000000 : guestCount <= 800 ? 35000000 : 48000000;
      return { tentSize, screen, audio, restrooms: '2-Bay Luxury AC Mobile Restroom', estimate, label: 'Royal Wedding & Kwanjula Package' };
    } else if (selectedEventType === 'concert') {
      const tentSize = guestCount <= 500 ? '15m x 30m Festival Canopy' : 'Heavy-Duty 12m x 10m Concert Roof Stage';
      const screen = '32m² Main Stage P2.6 LED Wall + 2 Wing Displays';
      const audio = '16-Box DB Technologies Line Array & Digital 32-Ch Mixer';
      const estimate = guestCount <= 500 ? 28000000 : 45000000;
      return { tentSize, screen, audio, restrooms: '4-Bay VIP Event Restrooms', estimate, label: 'Mega Concert & Festival Rig' };
    } else if (selectedEventType === 'corporate') {
      const tentSize = '20m x 30m Fully Air-Conditioned Glass Marquee';
      const screen = '16m² Ultra-Bright P2.6 Presentation Screen';
      const audio = 'Corporate Voice PA & Wireless Lapel / Handheld Mics';
      const estimate = guestCount <= 300 ? 25000000 : 38000000;
      return { tentSize, screen, audio, restrooms: 'Luxury VIP Executive AC Trailer', estimate, label: 'Corporate Gala & AGM Suite' };
    } else {
      const tentSize = 'Modular Aluminium Beams (Dry Hire Sub-Rental)';
      const screen = 'Novastar Processors & P3.9 Rental Panels';
      const audio = 'Stage Box Truss & Power Distribution Racks';
      const estimate = 25000000;
      return { tentSize, screen, audio, restrooms: 'Optional Mobile Toilet Trailer', estimate, label: 'B2B Partner Equipment Hire' };
    }
  };

  const packageDetails = calculatePackageDetails();

  return (
    <div id="home-view" className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden">
      
      {/* 1. CINEMATIC GEOMETRIC HERO BANNER (Full-Bleed, Border-to-Border, High-Visibility Imagery) */}
      <section className="relative w-full overflow-hidden border-b border-white/15 bg-[#050811] text-white shadow-2xl pt-20 sm:pt-24">
        
        {/* Dynamic Background Image Layers with Enhanced Visibility & Directional Gradient */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="w-full h-full"
            >
              <img
                src={heroSlides[currentSlideIndex].image}
                alt={heroSlides[currentSlideIndex].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.15] scale-105"
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Ambient Radiant Gold & Blue Glows */}
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-amber-500/20 filter blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-600/15 filter blur-3xl" />

          {/* Directional Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050811]/95 via-[#050811]/80 sm:via-[#050811]/65 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050811]/95 via-transparent to-[#050811]/60 z-10" />
          
          {/* Subtle Geometric Graphic Lines */}
          <svg className="absolute inset-0 w-full h-full z-10 opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="100%" x2="100%" y2="0" stroke="white" strokeWidth="1" strokeDasharray="6 6" />
            <line x1="25%" y1="100%" x2="100%" y2="25%" stroke="rgba(251, 191, 36, 0.5)" strokeWidth="1.5" />
            <circle cx="85%" cy="30%" r="160" stroke="rgba(251, 191, 36, 0.25)" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* Hero Content Container - Flush against borders with generous inner breathing room */}
        <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14 md:py-16">
          
          {/* Top Header Bar inside Banner: Logo/Badge & Social Media Connect */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10 mb-8">
            <div className="flex items-center gap-3">
              <motion.button
                id="hero-splash-motto-btn"
                onClick={() => openSplashScreen()}
                title="Click to view full SBL Splash Experience"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 text-xs font-black backdrop-blur-md shadow-lg transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="text-amber-300">SBL MOTTO:</span>
                <span className="tracking-widest uppercase text-white font-extrabold font-['Outfit']">
                  WE DESIGN YOUR DREAM
                </span>
                <Sparkle className="w-3 h-3 text-amber-300" />
              </motion.button>

              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-300 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                <MapPin className="w-3 h-3 text-blue-300" />
                Masaka • Lwengo • All Uganda
              </span>
            </div>

            {/* Social & Contact Direct Links (Top Right like reference image) */}
            <div className="flex items-center gap-2">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href={COMPANY_CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-400/30 flex items-center justify-center transition-all shadow-sm"
                title="WhatsApp Direct"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-pink-500/20 hover:bg-pink-600 text-pink-300 hover:text-white border border-pink-400/30 flex items-center justify-center transition-all shadow-sm"
                title="TikTok Reels"
              >
                <Film className="w-3.5 h-3.5" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href={`mailto:${COMPANY_CONTACT_INFO.email}?subject=SBL%20Events%20Inquiry%20%26%20Booking`}
                className="w-8 h-8 rounded-full bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-400/30 flex items-center justify-center transition-all shadow-sm"
                title={`Email Dispatch (${COMPANY_CONTACT_INFO.email})`}
              >
                <Mail className="w-3.5 h-3.5" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href={`tel:${COMPANY_CONTACT_INFO.primaryPhone}`}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-all shadow-sm"
                title="Phone Call"
              >
                <Phone className="w-3.5 h-3.5" />
              </motion.a>
            </div>
          </div>

          {/* Main Grid: Left Typographic Presentation & Right Geometric Slanted Photo Cutouts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Category Pill Tag */}
              <motion.div
                key={`badge-${currentSlideIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>{heroSlides[currentSlideIndex].badge}</span>
              </motion.div>

              {/* Bold Two-Tone Headline */}
              <motion.div
                key={`title-group-${currentSlideIndex}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-1"
              >
                <h2 className="text-xl sm:text-3xl font-black text-amber-400 font-['Outfit'] uppercase tracking-tight">
                  {heroSlides[currentSlideIndex].tag}
                </h2>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] font-['Outfit',sans-serif] drop-shadow-xl">
                  {heroSlides[currentSlideIndex].title}
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                key={`sub-${currentSlideIndex}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-slate-200 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed"
              >
                {heroSlides[currentSlideIndex].subtitle}
              </motion.p>

              {/* Action Buttons Row */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap items-center gap-3 pt-2"
              >
                <motion.button
                  id="hero-book-event-btn"
                  onClick={() => openBookingModal()}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white hover:bg-amber-300 hover:text-slate-950 text-[#0F1F38] font-black text-xs sm:text-sm px-7 py-3.5 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Event / Get Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <motion.a
                  href="https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Film className="w-4 h-4" />
                  <span>TikTok @sblofficial92</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </motion.a>

                <motion.button
                  id="hero-explore-gallery-btn"
                  onClick={() => setCurrentPage('gallery')}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Events Done</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </motion.div>

              {/* Hero Slide Navigation Dots */}
              <div className="flex items-center gap-2 pt-2">
                {heroSlides.map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlideIndex === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
                <span className="text-[11px] text-slate-300 ml-2 font-medium">
                  {heroSlides[currentSlideIndex].tag}
                </span>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15 max-w-lg">
                <div>
                  <span className="text-xl sm:text-3xl font-black text-white font-['Outfit']">25,000+</span>
                  <p className="text-[10px] sm:text-xs text-slate-300 font-medium">m² Tent Inventory</p>
                </div>
                <div>
                  <span className="text-xl sm:text-3xl font-black text-white font-['Outfit']">1,500+</span>
                  <p className="text-[10px] sm:text-xs text-slate-300 font-medium">Completed Events</p>
                </div>
                <div>
                  <span className="text-xl sm:text-3xl font-black text-amber-300 font-['Outfit']">100kVA</span>
                  <p className="text-[10px] sm:text-xs text-slate-300 font-medium">Silent Power</p>
                </div>
              </div>

            </div>

            {/* Right Column: Live Photo Fleet Showcase */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[360px] sm:min-h-[460px]">
              
              {/* Fleet Badge */}
              <div className="flex items-center justify-center w-full max-w-sm mb-4 z-20 px-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-2 bg-[#0A1628]/80 border border-amber-400/30 px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Real Event Fleet & Staging Rigging</span>
                </span>
              </div>

              {/* Slanted Multi-Pill Capsule Gallery */}
              <div className="relative w-full h-full flex items-center justify-center min-h-[320px] sm:min-h-[420px]">
                {/* Graphic Backdrop Angle */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-white/5 to-transparent rounded-3xl -rotate-3 scale-95 border border-white/10 backdrop-blur-xs pointer-events-none" />

                  <div className="relative w-full h-full flex items-center justify-center gap-3.5 sm:gap-5 py-4">
                    {/* Pill 1: Main Event Feature */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85, y: 30, rotate: -12 }}
                      animate={{ opacity: 1, scale: 1, y: 0, rotate: -12 }}
                      whileHover={{ scale: 1.06, rotate: -6 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="relative w-28 sm:w-36 md:w-44 h-64 sm:h-80 md:h-96 rounded-full overflow-hidden border-2 border-white/40 shadow-2xl bg-[#091526] shrink-0"
                    >
                      <img
                        src={heroSlides[currentSlideIndex].image}
                        alt="SBL Event Rigging"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center filter brightness-95 contrast-110 transform rotate-12 scale-125 hover:scale-135 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
                      <div className="absolute bottom-4 left-0 right-0 text-center px-2 pointer-events-none">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 drop-shadow-md">
                          SBL LIVE
                        </span>
                      </div>
                    </motion.div>

                    {/* Pill 2: Truss Stage & LED screen */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85, y: -30, rotate: -12 }}
                      animate={{ opacity: 1, scale: 1, y: 0, rotate: -12 }}
                      whileHover={{ scale: 1.06, rotate: -6 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                      className="relative w-28 sm:w-36 md:w-44 h-64 sm:h-80 md:h-96 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-2xl bg-[#091526] shrink-0 -mt-8 sm:-mt-12"
                    >
                      <img
                        src={sblStageBlueTrussImg}
                        alt="SBL Box Truss Stage & Concert Lighting"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center filter brightness-95 contrast-110 transform rotate-12 scale-125 hover:scale-135 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
                      <div className="absolute bottom-4 left-0 right-0 text-center px-2 pointer-events-none">
                        <span className="text-[10px] font-black uppercase tracking-wider text-white drop-shadow-md">
                          TRUSS RIGGING
                        </span>
                      </div>
                    </motion.div>

                    {/* Pill 3: Mega Tent Architecture */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, x: 20, rotate: -12 }}
                      animate={{ opacity: 1, scale: 1, x: 0, rotate: -12 }}
                      whileHover={{ scale: 1.06, rotate: -6 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                      className="hidden sm:block relative w-24 md:w-28 h-48 md:h-64 rounded-full overflow-hidden border-2 border-white/30 shadow-xl bg-[#091526] shrink-0 mt-12"
                    >
                      <img
                        src={sblMegaTentImg}
                        alt="SBL Mega Marquee Dome"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center filter brightness-95 contrast-110 transform rotate-12 scale-125"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
                    </motion.div>
                  </div>

                  {/* Ambient Floating Geometry Rings */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-4 -right-4 w-20 h-20 rounded-full border border-dashed border-amber-400/40 pointer-events-none flex items-center justify-center"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  </motion.div>
                </div>
              </div>

          </div>

          {/* Bottom Banner Bar */}
          <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-white font-bold">www.sbleventsuganda.com</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Direct Warehouse Dispatch
              </span>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span className="text-slate-200">
                Hotline: <strong className="text-amber-300 font-mono">+256 752 420 911</strong>
              </span>
            </div>
          </div>

          {/* Center Floating Down-Arrow Anchor */}
          <div className="flex justify-center -mb-5 sm:-mb-7 relative z-30 pt-6">
            <motion.button
              onClick={scrollToFirstSection}
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.15, y: 2 }}
              whileTap={{ scale: 0.92 }}
              title="Scroll down to explore SBL Services & Equipment"
              aria-label="Scroll down to explore"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-2xl shadow-amber-500/50 border-2 border-white/40 flex items-center justify-center cursor-pointer transition-all duration-300 group"
            >
              <ChevronDown className="w-7 h-7 stroke-[2.5] group-hover:translate-y-0.5 transition-transform text-slate-950" />
            </motion.button>
          </div>

        </div>
      </section>

      {/* 2. SBL VIRAL TIKTOK REELS & LIVE DEPLOYMENTS SHOWCASE */}
      <section id="sbl-content-start" className="scroll-mt-24">
        <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" yOffset={40} blur>

        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B1322] via-[#0E182A] to-[#070D18] border border-white/10 shadow-2xl">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>Official TikTok Hub • 70,000+ Impressions</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
              Experience SBL Live on TikTok
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Watch real live setups in Masaka, Lwengo & across Uganda — from luxury Kwanjula introductions to modular Mega Tents, curved LED video walls, and computerized moving beam light shows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:brightness-110 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all transform hover:scale-105"
            >
              <Film className="w-4 h-4" />
              <span>Visit @sblofficial92</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setCurrentPage('gallery')}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Full Video Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4-Column Live Video Reels Cards - Jumia-style 2-column on mobile */}
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5" staggerDelay={0.09}>
          {VIDEO_REELS.map((reel) => (
            <StaggerItem key={reel.id}>
              <div
                onClick={() => setActiveVideoModal(reel)}
                className="group relative border border-white/10 rounded-xl sm:rounded-3xl overflow-hidden cursor-pointer bg-[#0B1322] hover:border-amber-400/60 shadow-lg sm:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between h-full"
              >
                {/* Media Thumbnail */}
                <div className="relative h-36 sm:h-60 overflow-hidden bg-black">
                  <ImageWithSkeleton
                    src={reel.thumbnail}
                    alt={reel.title}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    icon={<Film className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />}
                    label="Loading..."
                    showShimmerBadge={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1322] via-black/25 to-transparent pointer-events-none" />

                  {/* Animated Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-full bg-white/25 backdrop-blur-md border border-white/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-400 text-white group-hover:text-slate-950 transition-all shadow-2xl">
                      <Play className="w-3.5 h-3.5 sm:w-6 sm:h-6 ml-0.5 fill-current" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-1.5 left-1.5 right-1.5 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between">
                    <span className="bg-rose-600/90 backdrop-blur-md px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-[8px] sm:text-[10px] font-black text-white shadow-md flex items-center gap-0.5 sm:gap-1">
                      <Film className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span>{reel.badge}</span>
                    </span>
                    <span className="bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] font-bold text-slate-200">
                      {reel.duration}
                    </span>
                  </div>

                  {/* Bottom Stats */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between text-[9px] sm:text-xs text-slate-200">
                    <span className="font-bold flex items-center gap-0.5 sm:gap-1">
                      <Flame className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-300" />
                      {reel.viewsCount}
                    </span>
                    <span className="text-amber-300 font-extrabold truncate max-w-[70px] sm:max-w-none">{reel.tiktokHandle}</span>
                  </div>
                </div>

                {/* Content Description */}
                <div className="p-2 sm:p-4 space-y-1 sm:space-y-2.5 flex-1 flex flex-col justify-between text-white">
                  <div className="space-y-0.5 sm:space-y-1">
                    <h3 className="font-bold text-xs sm:text-sm leading-snug group-hover:text-amber-300 transition-colors line-clamp-1 sm:line-clamp-2">
                      {reel.title}
                    </h3>
                    <p className="hidden sm:block text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {reel.description}
                    </p>
                  </div>

                  <div className="pt-1 sm:pt-2 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="text-amber-300 font-bold flex items-center gap-0.5 sm:gap-1">
                      <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span className="truncate text-[9px] sm:text-xs">0752420911</span>
                    </span>
                    <span className="text-amber-300 group-hover:text-white font-bold flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[11px]">
                      <span>Play</span>
                      <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </ScrollReveal>
    </section>

      {/* 2B. FEATURED PRODUCTION SERVICES & FLEET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-amber-300" />
              <span>Direct Equipment Fleet</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] tracking-tight text-white">
              Certified Staging, Marquees &amp; Audio-Visual Gear
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Industrial European clear-span tents, concert aluminium box trusses, moving-head lighting, daylight P2.6/P3.9 LED walls, and silent power dispatch.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentPage('services');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="self-start md:self-auto py-2.5 px-5 rounded-2xl bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-amber-300 font-extrabold text-xs flex items-center gap-2 border border-white/15 hover:border-amber-400 transition-all cursor-pointer shadow-md group"
          >
            <span>Explore All Equipment &amp; Specs</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 2-Column mobile Jumia grid / 4-column desktop grid */}
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4" staggerDelay={0.06}>
          {services.slice(0, 4).map((srv) => (
            <StaggerItem key={srv.id}>
              <div className="bg-[#0B1322] border border-amber-500/20 hover:border-amber-400/60 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl group h-full hover:-translate-y-1">
                <div>
                  {/* Thumbnail with overlay */}
                  <div className="relative h-28 sm:h-40 overflow-hidden bg-[#060B14]">
                    <img
                      src={srv.image}
                      alt={srv.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1322] via-black/25 to-transparent" />
                    
                    {/* B2B / Category tag */}
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <span className="bg-[#050811]/90 text-amber-300 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-400/30 uppercase tracking-wider">
                        {srv.category}
                      </span>
                    </div>

                    {srv.b2bAvailable && (
                      <div className="absolute top-2 right-2 bg-amber-400 text-slate-950 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                        B2B Hire
                      </div>
                    )}
                  </div>

                  {/* Body info */}
                  <div className="p-3 sm:p-4 space-y-1 sm:space-y-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 leading-snug">
                      {srv.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {srv.shortDesc}
                    </p>
                    
                    <div className="pt-1.5 flex items-center justify-between text-[10px] sm:text-xs text-amber-300 font-semibold border-t border-white/10 mt-2">
                      <span>Starts from</span>
                      <span className="font-mono font-bold text-white">{(srv.basePrice / 1000000).toFixed(1)}M UGX</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-3 sm:p-4 pt-0 flex items-center gap-1.5">
                  <button
                    onClick={() => openBookingModal({ serviceId: srv.id })}
                    className="flex-1 py-1.5 sm:py-2 px-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[10px] sm:text-xs flex items-center justify-center gap-1 shadow-md shadow-amber-500/20 cursor-pointer hover:brightness-105 transition-all truncate"
                  >
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>Reserve</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('services');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="py-1.5 sm:py-2 px-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[10px] sm:text-xs font-bold cursor-pointer transition-colors"
                    title="View Full Specifications"
                  >
                    Specs
                  </button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* 3D Simulation Teaser Callout */}
        <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-blue-950/40 via-[#0E182A] to-amber-950/30 border border-blue-400/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-slate-200">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <span>
              Want to see how your truss stage, LED screen &amp; lighting look in 3D? <strong className="text-amber-300">Try our real-time interactive stage simulation.</strong>
            </span>
          </div>
          <button
            onClick={() => {
              setCurrentPage('stage-planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto py-2 px-4 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 text-blue-200 font-bold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors"
          >
            <span>Launch 3D Stage Planner</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 3. INTERACTIVE INSTANT EVENT PACKAGE & QUOTATION ESTIMATOR */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" yOffset={40}>
        <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#0B1322] via-[#0E182A] to-[#070D18] border border-amber-500/20 shadow-2xl text-white space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                <Sliders className="w-3.5 h-3.5 text-amber-300" />
                <span>Instant Package Estimator • Starts From 25 Million UGX</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
                Configure Your Turnkey Event Package
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Comprehensive packages start from <strong className="text-amber-300">25 Million UGX (25,000,000 UGX)</strong> — complete with certified European mega marquees, high-nits LED video walls, digital line-array sound, silent Cummins power, and luxury VIP mobile restrooms.
              </p>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-300 block">Need a Custom Specification?</span>
              <button
                onClick={() => openBookingModal()}
                className="text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1 mt-0.5 ml-auto cursor-pointer"
              >
                <span>Talk to Lead Rigger Brian</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Configuration Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Event Type Switcher */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  1. Select Event Type:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'wedding', label: 'Wedding & Kwanjula', icon: <Heart className="w-3.5 h-3.5" /> },
                    { id: 'concert', label: 'Mega Concert / Stage', icon: <Layers className="w-3.5 h-3.5" /> },
                    { id: 'corporate', label: 'Corporate Gala / AGM', icon: <Award className="w-3.5 h-3.5" /> },
                    { id: 'b2b', label: 'B2B Tent Lending', icon: <Truck className="w-3.5 h-3.5" /> },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedEventType(item.id as any)}
                      className={`p-3 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center ${
                        selectedEventType === item.id
                          ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 border-amber-300 shadow-lg font-black'
                          : 'bg-[#060B14] text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">
                    2. Estimated Guest Capacity:
                  </label>
                  <span className="font-black text-amber-300 text-sm bg-amber-400/10 px-3 py-0.5 rounded-full border border-amber-400/30">
                    {guestCount.toLocaleString()} Attendees
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="100"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full h-2.5 bg-[#060B14] rounded-lg appearance-none cursor-pointer accent-amber-400 border border-white/10"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                  <span>100 (Intimate)</span>
                  <span>500 (Standard)</span>
                  <span>1,500 (Grand)</span>
                  <span>3,000+ (Festival)</span>
                </div>
              </div>

            </div>

            {/* Right Package Calculation Card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-3xl bg-[#060B14] border border-amber-500/30 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] text-amber-300 uppercase font-black tracking-wider block">Recommended Rig</span>
                    <h3 className="font-bold text-sm text-white">{packageDetails.label}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Est. Starting From</span>
                    <span className="text-base font-black text-amber-300 font-mono">
                      UGX {packageDetails.estimate.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Shelter:</strong> {packageDetails.tentSize}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Display:</strong> {packageDetails.screen}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Acoustics:</strong> {packageDetails.audio}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Sanitation:</strong> {packageDetails.restrooms}</span>
                  </div>
                </div>

                <button
                  onClick={() => openBookingModal()}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02]"
                >
                  <Calendar className="w-4 h-4 text-slate-950" />
                  <span>Reserve This Package Now</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </ScrollReveal>

      {/* 4. SBL 4-PILLAR QUALITY & ENGINEERING GUARANTEE */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" yOffset={40}>
        <div className="rounded-3xl p-6 sm:p-10 bg-[#0B1322] border border-amber-500/20 shadow-2xl text-white space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs text-amber-400 font-extrabold uppercase tracking-widest block">
              The SBL Quality Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-['Outfit']">
              Why Central & Western Uganda Trusts SBL Events
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We never compromise on safety, sound fidelity, or timeline execution.
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4" staggerDelay={0.08}>
            <StaggerItem>
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#060B14] border border-white/10 space-y-1.5 sm:space-y-2 h-full">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                <h4 className="font-bold text-xs sm:text-sm text-white">100km/h Tested</h4>
                <p className="text-[10px] sm:text-xs text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  Certified aluminium frames with concrete ballast anchoring that protects venue lawns.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#060B14] border border-white/10 space-y-1.5 sm:space-y-2 h-full">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                <h4 className="font-bold text-xs sm:text-sm text-white">Standby Power</h4>
                <p className="text-[10px] sm:text-xs text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  Dedicated soundproof diesel generators with automatic transfer switches.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#060B14] border border-white/10 space-y-1.5 sm:space-y-2 h-full">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
                <h4 className="font-bold text-xs sm:text-sm text-white">15+ Yrs Rigging</h4>
                <p className="text-[10px] sm:text-xs text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  Sound engineers, lighting operators, and decor specialists stationed at every event.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#060B14] border border-white/10 space-y-1.5 sm:space-y-2 h-full">
                <Bath className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                <h4 className="font-bold text-xs sm:text-sm text-white">VIP Restrooms</h4>
                <p className="text-[10px] sm:text-xs text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  Air-conditioned luxury mobile trailers with running fresh water and porcelain toilets.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </ScrollReveal>

      {/* 6. CONFIRMED SCHEDULE & UPCOMING DISPATCH SLOTS */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6" yOffset={40}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">Live Operations</span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit'] ${t.headingText}`}>
              Confirmed Event Dispatch Schedule
            </h2>
          </div>

          <button
            onClick={() => setCurrentPage('calendar')}
            className="text-xs sm:text-sm font-bold text-amber-300 hover:text-white flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>Full Dispatch Calendar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4" staggerDelay={0.08}>
          {upcomingShowcases.map((evt) => (
            <StaggerItem key={evt.id}>
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-3xl bg-[#0B1322] border border-white/10 space-y-1.5 sm:space-y-3 shadow-lg sm:shadow-xl h-full flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-950 bg-gradient-to-r from-amber-500 to-yellow-500 px-1.5 sm:px-2.5 py-0.5 rounded uppercase text-[8px] sm:text-[10px]">
                      {evt.eventType}
                    </span>
                    <span className="text-amber-300 font-mono text-[9px] sm:text-[11px]">{evt.startDate}</span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-1 sm:line-clamp-2">{evt.title}</h4>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-300 flex items-center gap-1 sm:gap-1.5 truncate">
                  <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{evt.location}</span>
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </ScrollReveal>

      {/* 7. VERIFIED REVIEWS & COMMUNITY PRAISE */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6" yOffset={40}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">Client Trust</span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit'] ${t.headingText}`}>
              Recent Client Reviews
            </h2>
          </div>

          <button
            onClick={() => setCurrentPage('testimonials')}
            className="text-xs sm:text-sm font-bold text-amber-300 hover:text-white flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>All Testimonials</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5" staggerDelay={0.08}>
          {featuredTestimonials.map((test) => (
            <StaggerItem key={test.id}>
              <div className="p-4 sm:p-6 rounded-xl sm:rounded-3xl bg-[#0B1322] border border-white/10 shadow-lg sm:shadow-xl space-y-2.5 sm:space-y-3 flex flex-col justify-between h-full">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-200 italic leading-relaxed line-clamp-3 sm:line-clamp-none">
                    "{test.content}"
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5 pt-2 sm:pt-3 border-t border-white/10">
                  <ReviewAvatar 
                    name={test.author} 
                    avatarIcon={test.avatarIcon} 
                    avatarBg={test.avatarBg} 
                    size="sm" 
                  />
                  <div>
                    <h4 className="font-bold text-xs text-white">{test.author}</h4>
                    <p className="text-[10px] text-amber-300">{test.role} • {test.companyOrEvent}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </ScrollReveal>

      {/* 8. BOTTOM CALL TO ACTION */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" yOffset={35}>
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#0B1322] via-[#0E182A] to-[#080E1A] border border-amber-500/30 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>We Design Your Dream</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black font-['Outfit'] tracking-tight text-white">
              Ready to Stage Your Next Unforgettable Event?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Reserve mega marquees, concert line-array sound, curved LED screens, and power dispatch with guaranteed execution.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => openBookingModal()}
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-2xl shadow-amber-500/30 transition-all whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02]"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              <span>Book Event / Get Quote</span>
            </button>

            <a
              href="https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Film className="w-4 h-4" />
              <span>TikTok @sblofficial92</span>
            </a>
          </div>
        </div>
      </ScrollReveal>

      {/* 9. REEL MODAL PLAYER (IF CLICKED) */}
      <AnimatePresence>
        {activeVideoModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveVideoModal(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-lg w-full rounded-3xl p-6 border border-amber-500/30 bg-[#0B1322] text-white shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveVideoModal(null)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center gap-1 text-xs font-bold border border-white/15 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-sm">{activeVideoModal.title}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative h-64 rounded-2xl overflow-hidden bg-black">
                <ImageWithSkeleton
                  src={activeVideoModal.thumbnail}
                  alt={activeVideoModal.title}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover"
                  icon={<Film className="w-6 h-6 text-pink-400" />}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 pointer-events-none">
                  <span className="text-xs text-amber-300 font-bold">{activeVideoModal.tiktokHandle}</span>
                  <p className="text-xs text-slate-200 mt-1">{activeVideoModal.description}</p>
                </div>
              </div>

              {activeVideoModal.audioTranscriptNotes && (
                <div className="p-3 rounded-xl bg-[#060B14] border border-white/10 text-xs text-slate-300">
                  <span className="font-bold text-amber-300 block mb-0.5">Audio Highlights:</span>
                  {activeVideoModal.audioTranscriptNotes}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveVideoModal(null)}
                  className="py-3 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1 border border-white/15 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <a
                  href="https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:brightness-110 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Film className="w-4 h-4" />
                  <span>Open on TikTok</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => {
                    setActiveVideoModal(null);
                    openBookingModal();
                  }}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer hover:from-amber-400 hover:to-yellow-400 shadow-md shadow-amber-500/20"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Rig</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
