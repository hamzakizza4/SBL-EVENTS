import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getThemeClasses } from '../utils/themeStyles';
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
  Mic2, 
  Sparkle, 
  Bath, 
  Truck, 
  Star, 
  ChevronRight, 
  Clock, 
  Award,
  Crown
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomeView: React.FC = () => {
  const { 
    services, 
    calendarEvents, 
    testimonials, 
    setCurrentPage, 
    openBookingModal,
    theme
  } = useApp();

  const t = getThemeClasses(theme);
  const [sliderPos, setSliderPos] = useState<number>(50);

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'mega-tents': return <Tent className="w-4 h-4" />;
      case 'stage-construction': return <Layers className="w-4 h-4" />;
      case 'intelligent-lighting': return <Zap className="w-4 h-4" />;
      case 'led-screens': return <Tv className="w-4 h-4" />;
      case 'mobile-disco-sound': return <Volume2 className="w-4 h-4" />;
      case 'professional-mc': return <Mic2 className="w-4 h-4" />;
      case 'luxury-decoration': return <Sparkle className="w-4 h-4" />;
      case 'mobile-toilets': return <Bath className="w-4 h-4" />;
      case 'tent-lending-b2b': return <Truck className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const upcomingShowcases = calendarEvents.slice(0, 3);
  const featuredTestimonials = testimonials.filter((test) => test.featured || test.rating === 5).slice(0, 3);

  return (
    <div id="home-view" className="space-y-16 sm:space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-24 sm:pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85"
            alt="SBL Events Production"
            className="w-full h-full object-cover object-center filter brightness-40 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F38] via-[#0F1F38]/80 to-[#0F1F38]/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-8 space-y-5">
              
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-semibold backdrop-blur-md shadow-md"
              >
                <Crown className="w-3.5 h-3.5 text-blue-200" />
                <span>Full-Service Event Production & Tent Lending</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight font-['Outfit',sans-serif]"
              >
                Flawless Staging, <br className="hidden sm:block" />
                Sound & Mega Tents.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-200 text-sm sm:text-base max-w-xl leading-relaxed"
              >
                Mega marquees, concert lighting, LED screens, sound systems, MC hosts, luxury mobile toilets, and B2B tent rentals.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-3 pt-2"
              >
                <button
                  id="hero-book-event-btn"
                  onClick={() => openBookingModal()}
                  className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-sm sm:text-base px-7 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#0F1F38]" />
                  <span>Book Event Now</span>
                  <ArrowRight className="w-4 h-4 text-[#0F1F38]" />
                </button>

                <button
                  id="hero-explore-services-btn"
                  onClick={() => setCurrentPage('services')}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm sm:text-base px-6 py-3 rounded-xl backdrop-blur-md transition-all flex items-center justify-center gap-2"
                >
                  <span>View Services</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Stat Highlights */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-3 pt-4 border-t border-white/15 max-w-lg"
              >
                <div>
                  <span className="text-xl sm:text-2xl font-black text-white font-['Outfit']">25,000+</span>
                  <p className="text-[11px] text-slate-300">m² Tent Inventory</p>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-white font-['Outfit']">1,500+</span>
                  <p className="text-[11px] text-slate-300">Events Completed</p>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-white font-['Outfit']">100%</span>
                  <p className="text-[11px] text-slate-300">Power Backup</p>
                </div>
              </motion.div>

            </div>

            {/* Right Quick Reserve Card */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-3xl border border-white/20 bg-[#132644] text-white shadow-2xl space-y-4"
              >
                <div className="space-y-1">
                  <span className="text-xs text-blue-200 uppercase font-bold tracking-wider">Fast Dispatch</span>
                  <h3 className="text-lg font-bold">Instant Event Reservation</h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#0E1D35] border border-white/10 flex items-center justify-between">
                    <span className="text-slate-300">Tent Capacities:</span>
                    <span className="font-bold text-white">50 - 5,000 Guests</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0E1D35] border border-white/10 flex items-center justify-between">
                    <span className="text-slate-300">B2B Tent Lending:</span>
                    <span className="font-bold text-white">Dry / Wet Hire Ready</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0E1D35] border border-white/10 flex items-center justify-between">
                    <span className="text-slate-300">Mobile VIP Restrooms:</span>
                    <span className="font-bold text-white">Luxury AC Suites</span>
                  </div>
                </div>

                <button
                  onClick={() => openBookingModal()}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-xs shadow-md transition-all text-center flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve Date & Equipment</span>
                </button>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE PRODUCTION ARSENAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs text-blue-300 font-bold uppercase tracking-wider block">Production Arsenal</span>
            <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight font-['Outfit'] ${t.headingText}`}>
              Our 10 Core Services
            </h2>
          </div>

          <button
            onClick={() => setCurrentPage('services')}
            className="text-xs sm:text-sm font-bold text-white hover:text-blue-200 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>All Specifications</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.slice(0, 6).map((srv) => (
            <div
              key={srv.id}
              onClick={() => openBookingModal({ serviceId: srv.id })}
              className={`${t.cardBg} border ${t.cardBorder} hover:border-white/40 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 shadow-xl group flex flex-col justify-between`}
            >
              <div className="relative h-48 overflow-hidden bg-[#0A1830]">
                <img
                  src={srv.image}
                  alt={srv.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#132644] via-black/20 to-transparent" />
                
                <div className="absolute top-3 left-3 bg-[#0F1F38]/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                  ${srv.basePrice} {srv.priceUnit}
                </div>

                {srv.b2bAvailable && (
                  <div className="absolute top-3 right-3 bg-white text-[#0F1F38] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    B2B Lending
                  </div>
                )}
              </div>

              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-blue-300">
                  {getServiceIcon(srv.id)}
                  <h3 className="font-bold text-base text-white group-hover:text-blue-200 transition-colors">
                    {srv.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {srv.shortDesc}
                </p>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Reserve Setup</span>
                  <span className="text-white font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BEFORE / AFTER TRANSFORMATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs text-blue-300 font-bold uppercase tracking-wider block">Real Transformations</span>
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit'] ${t.headingText}`}>
            Empty Lawn to Luxury Ballroom
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Slide horizontally to see how SBL converts empty terrain into illuminated luxury venues.
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-white/20 h-72 sm:h-96 shadow-2xl select-none">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80"
            alt="Completed SBL Event Rig"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80"
              alt="Empty Field Before"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: '100%' }}
            />
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
              BEFORE: Raw Field
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-white text-[#0F1F38] backdrop-blur-md px-3 py-1 rounded-full text-xs font-black shadow-md">
            AFTER: Fully Dressed Marquee
          </div>

          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-[#0F1F38] shadow-xl flex items-center justify-center text-xs font-bold border-2 border-[#0F1F38]">
              ↔
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          />
        </div>
      </section>

      {/* UPCOMING SHOWCASES & CALENDAR SNEAK PEEK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs text-blue-300 font-bold uppercase tracking-wider block">Live Operations</span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit'] ${t.headingText}`}>
              Confirmed Schedule & Slots
            </h2>
          </div>

          <button
            onClick={() => setCurrentPage('calendar')}
            className="text-xs sm:text-sm font-bold text-white hover:text-blue-200 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Full Dispatch Calendar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingShowcases.map((evt) => (
            <div
              key={evt.id}
              className="p-5 rounded-2xl bg-[#132644] border border-white/15 space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-md uppercase">
                  {evt.eventType}
                </span>
                <span className="text-slate-300 font-mono text-[11px]">{evt.startDate}</span>
              </div>
              <h4 className="font-bold text-sm text-white">{evt.title}</h4>
              <p className="text-[11px] text-slate-300">{evt.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SNIPPET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs text-blue-300 font-bold uppercase tracking-wider block">Client Trust</span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit'] ${t.headingText}`}>
              Recent Client Reviews
            </h2>
          </div>

          <button
            onClick={() => setCurrentPage('testimonials')}
            className="text-xs sm:text-sm font-bold text-white hover:text-blue-200 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>All Testimonials</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredTestimonials.map((test) => (
            <div
              key={test.id}
              className="p-6 rounded-3xl bg-[#132644] border border-white/15 shadow-lg space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-300">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-300" />
                  ))}
                </div>
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  "{test.content}"
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-3 border-t border-white/10">
                <img
                  src={test.image}
                  alt={test.author}
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="font-bold text-xs text-white">{test.author}</h4>
                  <p className="text-[10px] text-blue-300">{test.role} • {test.companyOrEvent}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-10 bg-white text-[#0F1F38] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] tracking-tight">
              Ready to Stage Your Event?
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Reserve marquees, concert sound, lighting, and power dispatch with guaranteed execution.
            </p>
          </div>

          <button
            onClick={() => openBookingModal()}
            className="py-3.5 px-8 rounded-xl bg-[#0F1F38] hover:bg-[#132644] text-white font-extrabold text-xs sm:text-sm shadow-xl transition-all whitespace-nowrap flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Event / Get Quote</span>
          </button>
        </div>
      </section>

    </div>
  );
};
