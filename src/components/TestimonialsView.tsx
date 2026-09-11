import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { EventType } from '../types';
import { getThemeClasses } from '../utils/themeStyles';
import { 
  testimonialsBannerBgImg, 
  weddingVipGlassLoungeImg, 
  kwanjulaRoyalStageImg,
  COMPANY_CONTACT_INFO 
} from '../data/mockData';
import { ReviewAvatar } from './ReviewAvatar';
import { GeometricHeroBanner } from './GeometricHeroBanner';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollReveal';
import { 
  MessageSquareQuote, 
  Star, 
  ShieldCheck, 
  Plus, 
  Filter, 
  X, 
  Send,
  MessageCircle,
  Heart,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Calendar,
  CheckCircle2,
  Sparkles,
  Quote,
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TestimonialsView: React.FC = () => {
  const { testimonials, addTestimonial, theme, openBookingModal, isAdminLoggedIn, openCardEditor } = useApp();
  const t = getThemeClasses(theme);

  const [filterType, setFilterType] = useState<string>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Auto-playing Carousel State
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [slideProgress, setSlideProgress] = useState<number>(0);

  // Submit Review Form State
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [companyOrEvent, setCompanyOrEvent] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [eventType, setEventType] = useState<EventType>('wedding');

  // Approved or featured testimonials for the carousel
  const carouselTestimonials = React.useMemo(() => {
    const list = testimonials.filter((test) => test.approved || test.featured);
    return list.length > 0 ? list : testimonials;
  }, [testimonials]);

  // Keep current slide within bounds if list changes
  useEffect(() => {
    if (currentSlide >= carouselTestimonials.length) {
      setCurrentSlide(0);
    }
  }, [carouselTestimonials.length, currentSlide]);

  // Auto-play timer with smooth progress bar
  const SLIDE_DURATION_MS = 5500;
  const TICK_INTERVAL_MS = 50;

  useEffect(() => {
    if (!isPlaying || isHovered || isSubmitModalOpen || carouselTestimonials.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setSlideProgress((prev) => {
        const next = prev + (TICK_INTERVAL_MS / SLIDE_DURATION_MS) * 100;
        if (next >= 100) {
          setDirection(1);
          setCurrentSlide((curr) => (curr + 1) % carouselTestimonials.length);
          return 0;
        }
        return next;
      });
    }, TICK_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, isSubmitModalOpen, carouselTestimonials.length]);

  const handleNextSlide = () => {
    setDirection(1);
    setCurrentSlide((curr) => (curr + 1) % carouselTestimonials.length);
    setSlideProgress(0);
  };

  const handlePrevSlide = () => {
    setDirection(-1);
    setCurrentSlide((curr) => (curr - 1 + carouselTestimonials.length) % carouselTestimonials.length);
    setSlideProgress(0);
  };

  const handleGoToSlide = (index: number) => {
    if (index === currentSlide) return;
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setSlideProgress(0);
  };

  const toggleAutoPlay = () => {
    setIsPlaying((prev) => !prev);
    if (!isPlaying) {
      setSlideProgress(0);
    }
  };

  const filteredReviews = testimonials.filter((test) => {
    if (!test.approved && !test.featured) return false;
    if (filterType === 'all') return true;
    return test.eventType === filterType;
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim() || !companyOrEvent.trim()) return;

    addTestimonial({
      author,
      role: role || 'Event Host',
      companyOrEvent,
      content,
      rating,
      eventType,
      avatarIcon: eventType === 'wedding' ? 'heart' : eventType === 'corporate' ? 'building' : 'sparkles',
    });

    setAuthor('');
    setRole('');
    setCompanyOrEvent('');
    setContent('');
    setRating(5);
    setIsSubmitModalOpen(false);
  };

  const activeTestimonial = carouselTestimonials[currentSlide] || carouselTestimonials[0];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.97,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 280, damping: 28 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
      scale: 0.97,
      transition: {
        x: { type: 'spring' as const, stiffness: 280, damping: 28 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    })
  };

  return (
    <div id="testimonials-view" className="w-full pb-20 space-y-12">
      
      {/* 1. CINEMATIC GEOMETRIC HERO BANNER */}
      <GeometricHeroBanner
        badgeText="Real Client Stories, Ratings & Community Trust"
        badgeIcon={<Heart className="w-4 h-4 text-amber-300" />}
        accentHeading="CLIENT SATISFACTION"
        primaryHeading="WHAT OUR CLIENTS & PARTNERS SAY"
        description="From glamorous weddings and VIP introduction ceremonies in Masaka and Kampala to international corporate galas and peer event planners using our B2B tent lending fleet, discover verified client experiences."
        mainImage={testimonialsBannerBgImg}
        secondaryImage={weddingVipGlassLoungeImg}
        tertiaryImage={kwanjulaRoyalStageImg}
        bgPatternImage={testimonialsBannerBgImg}
        themeVariant="amber"
        primaryCta={{
          label: "Share Your Experience",
          onClick: () => setIsSubmitModalOpen(true),
          icon: <Plus className="w-4 h-4" />
        }}
        secondaryCta={{
          label: "Send WhatsApp Feedback",
          href: COMPANY_CONTACT_INFO.whatsappUrl,
          isExternal: true,
          variant: "whatsapp",
          icon: <MessageCircle className="w-4 h-4" />
        }}
        stats={[
          { value: "4.98 / 5.0", label: "Average Rating" },
          { value: "500+ Events", label: "Flawlessly Delivered" },
          { value: "99.4%", label: "Client Recommendation" }
        ]}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* 2. AUTO-PLAYING CAROUSEL SLIDER SPOTLIGHT (FRAMER MOTION POWERED) */}
        <section 
          id="testimonials-carousel-section"
          className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#0F1B2E] via-[#09121F] to-[#060B14] p-6 sm:p-10 shadow-2xl shadow-[#040810]/80 overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Ambient Radiant Glow in Background */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none" />

          {/* Carousel Control Bar & Live Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-md">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                    Live Client Feedback Spotlight
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[10px] font-bold text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {isHovered ? 'Paused on Hover' : isPlaying ? 'Auto-Playing' : 'Paused'}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white font-['Outfit']">
                  Featured Client Testimonials
                </h3>
              </div>
            </div>

            {/* Slider Navigation & Autoplay Controls */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-mono font-bold text-slate-400 mr-2">
                <span className="text-amber-300 font-extrabold">{String(currentSlide + 1).padStart(2, '0')}</span>
                {' / '}
                <span>{String(carouselTestimonials.length).padStart(2, '0')}</span>
              </span>

              {/* Play / Pause Toggle */}
              <button
                type="button"
                onClick={toggleAutoPlay}
                title={isPlaying ? 'Pause Autoplay' : 'Resume Autoplay'}
                className="p-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 text-slate-200 hover:text-white transition-all cursor-pointer shadow-xs"
                aria-label={isPlaying ? 'Pause Autoplay' : 'Resume Autoplay'}
              >
                {isPlaying ? <Pause className="w-4 h-4 text-amber-300" /> : <Play className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* Prev Button */}
              <button
                type="button"
                onClick={handlePrevSlide}
                title="Previous Testimonial"
                className="p-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-amber-400/20 hover:border-amber-400/40 text-slate-200 hover:text-white transition-all cursor-pointer shadow-xs"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNextSlide}
                title="Next Testimonial"
                className="p-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-amber-400/20 hover:border-amber-400/40 text-slate-200 hover:text-white transition-all cursor-pointer shadow-xs"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Testimonial Slide Container */}
          <div className="relative min-h-[300px] sm:min-h-[280px] lg:min-h-[250px] py-8 z-10 flex flex-col justify-center">
            {/* Watermark Quote Icon */}
            <div className="absolute right-2 top-4 opacity-5 pointer-events-none select-none">
              <Quote className="w-36 h-36 sm:w-48 sm:h-48 text-amber-300" />
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              {activeTestimonial && (
                <motion.div
                  key={activeTestimonial.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, { offset }) => {
                    if (offset.x > 60) handlePrevSlide();
                    else if (offset.x < -60) handleNextSlide();
                  }}
                  className="space-y-6 cursor-grab active:cursor-grabbing"
                >
                  {/* Rating & Verified Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      {[...Array(activeTestimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-xs" />
                      ))}
                      <span className="text-xs font-black text-amber-300 ml-1.5 font-mono">5.0 / 5.0</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 shadow-xs">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        {activeTestimonial.eventType.replace('_', ' ')}
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 shadow-xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Verified SBL Client
                      </span>
                    </div>
                  </div>

                  {/* Main Quote Content */}
                  <blockquote className="text-base sm:text-xl lg:text-2xl font-medium leading-relaxed text-slate-100 font-['Outfit'] italic tracking-wide">
                    "{activeTestimonial.content}"
                  </blockquote>

                  {/* Author Information & Context */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4">
                      <ReviewAvatar 
                        name={activeTestimonial.author} 
                        avatarIcon={activeTestimonial.avatarIcon} 
                        avatarBg={activeTestimonial.avatarBg} 
                        size="lg" 
                      />
                      <div>
                        <h4 className="font-extrabold text-base sm:text-lg text-white font-['Outfit']">
                          {activeTestimonial.author}
                        </h4>
                        <p className="text-xs sm:text-sm text-amber-300 font-semibold">
                          {activeTestimonial.role}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{activeTestimonial.companyOrEvent}</span>
                          {activeTestimonial.date && (
                            <>
                              <span>•</span>
                              <span className="text-slate-500">{activeTestimonial.date}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Quick CTA inside carousel */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isAdminLoggedIn && (
                        <button
                          type="button"
                          onClick={() => openCardEditor('testimonial', activeTestimonial)}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                          title="Edit Testimonial (Admin)"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => openBookingModal({
                          eventType: (activeTestimonial.eventType === 'corporate' ? 'corporate' : 'wedding') as EventType,
                          location: activeTestimonial.companyOrEvent
                        })}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Similar Setup</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Autoplay Progress Bar */}
          <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-4">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300"
              style={{ width: `${slideProgress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          {/* Clickable Slide Indicators / Thumbnails Bar */}
          <div className="flex items-center justify-center gap-2 pt-6 flex-wrap">
            {carouselTestimonials.map((test, index) => {
              const isActive = index === currentSlide;
              return (
                <button
                  key={test.id || index}
                  type="button"
                  onClick={() => handleGoToSlide(index)}
                  title={`View feedback from ${test.author}`}
                  className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all duration-300 cursor-pointer border ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow-md scale-105'
                      : 'bg-white/5 text-slate-400 hover:text-white border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-slate-950' : 'bg-slate-500 group-hover:bg-amber-400'}`} />
                  <span className="truncate max-w-[120px] sm:max-w-[160px]">{test.author.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. FILTER AND SUBMIT ROW */}
        <ScrollReveal className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl border border-amber-500/20 bg-[#0B1322] shadow-2xl" yOffset={25}>
          {/* Category filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Reviews' },
              { id: 'wedding', label: 'Weddings' },
              { id: 'corporate', label: 'Corporate Galas' },
              { id: 'concert_festival', label: 'Concerts & Stages' },
              { id: 'tent_lending_b2b', label: 'B2B Tent Lending' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  filterType === f.id
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-300 shadow-md scale-105'
                    : 'bg-[#060B14] text-slate-200 border-white/15 hover:bg-amber-400/20 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Testimonial</span>
          </button>
        </ScrollReveal>

        {/* 4. ALL REVIEWS GRID - Jumia compact style on mobile */}
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6" staggerDelay={0.06}>
          {filteredReviews.map((test) => (
            <StaggerItem key={test.id}>
              <div
                className="relative bg-[#0B1322] border border-amber-500/20 rounded-xl sm:rounded-3xl p-3 sm:p-7 shadow-lg sm:shadow-2xl space-y-2 sm:space-y-4 flex flex-col justify-between h-full hover:-translate-y-1 hover:border-amber-400/50 transition-all duration-300 group"
              >
                {isAdminLoggedIn && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openCardEditor('testimonial', test);
                    }}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-[9px] sm:text-[11px] font-black shadow-md flex items-center gap-1 transition-all cursor-pointer"
                    title="Edit Review (Admin)"
                  >
                    <Pencil className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span>Edit</span>
                  </button>
                )}
                <div className="space-y-1.5 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-amber-300">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-300 text-amber-300" />
                      ))}
                    </div>
                    <span className={`text-[8px] sm:text-[10px] font-extrabold text-amber-300 uppercase bg-amber-500/10 px-1.5 sm:px-2.5 py-0.5 rounded-full border border-amber-500/30 truncate max-w-[80px] sm:max-w-none ${isAdminLoggedIn ? 'mr-12 sm:mr-16' : ''}`}>
                      {test.eventType.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-[10px] sm:text-sm text-slate-200 leading-relaxed italic line-clamp-4 sm:line-clamp-none">
                    "{test.content}"
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-white/10">
                  <ReviewAvatar 
                    name={test.author} 
                    avatarIcon={test.avatarIcon} 
                    avatarBg={test.avatarBg} 
                    size="sm" 
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-[11px] sm:text-sm text-white truncate">{test.author}</h4>
                    <p className="text-[9px] sm:text-[11px] text-amber-300 font-semibold truncate">{test.role}</p>
                    <p className="text-[8px] sm:text-[10px] text-slate-400 truncate">{test.companyOrEvent}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>

      {/* SUBMIT REVIEW MODAL */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl w-full rounded-3xl p-6 sm:p-8 bg-[#0B1322] text-white border border-amber-500/30 shadow-2xl space-y-6 my-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-black font-['Outfit'] text-white">Share Your SBL Events Experience</h3>
                  <p className="text-xs text-slate-300">Your feedback helps future clients plan with confidence.</p>
                </div>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-200">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full bg-[#060B14] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-200">Your Role / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Bride / Event Director"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-[#060B14] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-200">Company or Event Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jenkins Wedding / Tech Summit"
                      value={companyOrEvent}
                      onChange={(e) => setCompanyOrEvent(e.target.value)}
                      className="w-full bg-[#060B14] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-200">Event Category</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as EventType)}
                      className="w-full bg-[#060B14] border border-white/20 rounded-xl p-3 text-white focus:outline-hidden focus:border-amber-400 cursor-pointer"
                    >
                      <option value="wedding">Luxury Wedding</option>
                      <option value="corporate">Corporate Gala / Expo</option>
                      <option value="concert_festival">Concert / Stage Festival</option>
                      <option value="tent_lending_b2b">B2B Tent Lending</option>
                      <option value="private">Private Celebration</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-200">Overall Rating (1 - 5 Stars)</label>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-amber-300 ml-2 font-bold">{rating} out of 5</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-200">Your Review &amp; Comments *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about the tent setup, sound clarity, MC performance, or overall execution..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-[#060B14] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="py-2.5 px-4 rounded-xl border border-white/20 text-slate-300 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
