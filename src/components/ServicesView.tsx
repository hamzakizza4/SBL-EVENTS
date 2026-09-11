import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Service } from '../types';
import { getThemeClasses } from '../utils/themeStyles';
import { 
  sblStageBlueTrussImg, 
  sblMegaTentImg, 
  intelligentLightingShowcaseImg,
  COMPANY_CONTACT_INFO 
} from '../data/mockData';
import { GeometricHeroBanner } from './GeometricHeroBanner';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollReveal';
import { 
  Layers, 
  CheckCircle2, 
  Calendar, 
  Info, 
  Zap, 
  Tv, 
  Volume2, 
  Sparkle, 
  Tent, 
  Bath, 
  Truck, 
  X,
  Check,
  Image as ImageIcon,
  Video,
  ExternalLink,
  Play,
  MessageCircle,
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ServicesView: React.FC = () => {
  const { services, openBookingModal, theme, eventCategories, isAdminLoggedIn, openCardEditor } = useApp();
  const t = getThemeClasses(theme);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeServiceModal, setActiveServiceModal] = useState<Service | null>(null);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'videos'>('photos');

  const categories = React.useMemo(() => {
    const base: { id: string; label: string; icon: React.ReactNode }[] = [
      { id: 'all', label: 'All Services', icon: <Layers className="w-4 h-4" /> },
      { id: 'tents', label: 'Mega Tents & Stages', icon: <Tent className="w-4 h-4" /> },
      { id: 'lighting', label: 'Intelligent Lighting', icon: <Zap className="w-4 h-4" /> },
      { id: 'screens', label: 'LED Video Screens', icon: <Tv className="w-4 h-4" /> },
      { id: 'sound-mc', label: 'Mobile Disco & Sound', icon: <Volume2 className="w-4 h-4" /> },
      { id: 'production', label: 'Decor & Planning', icon: <Sparkle className="w-4 h-4" /> },
      { id: 'restrooms', label: 'Mobile Restrooms', icon: <Bath className="w-4 h-4" /> },
      { id: 'b2b-lending', label: 'B2B Equipment Hire', icon: <Truck className="w-4 h-4" /> },
    ];

    if (eventCategories && eventCategories.length > 0) {
      eventCategories.filter(c => c.active).forEach((cat) => {
        if (!base.some(b => b.id === cat.slug)) {
          base.push({
            id: cat.slug,
            label: cat.name,
            icon: <Sparkle className="w-4 h-4" />
          });
        }
      });
    }

    return base;
  }, [eventCategories]);

  const filteredServices = services.filter((s) => {
    if (selectedCategory === 'all') return true;
    if (s.category === selectedCategory) return true;
    const matchCat = eventCategories?.find(c => c.slug === selectedCategory);
    if (matchCat && matchCat.recommendedServices && matchCat.recommendedServices.length > 0) {
      return matchCat.recommendedServices.includes(s.id);
    }
    return false;
  });

  return (
    <div id="services-view" className="w-full pb-20 space-y-10">
      
      {/* 1. CINEMATIC GEOMETRIC HERO BANNER */}
      <GeometricHeroBanner
        badgeText="Official Equipment Hire & Production Catalogue"
        badgeIcon={<Layers className="w-4 h-4 text-amber-300" />}
        accentHeading="EQUIPMENT &amp; HIRE"
        primaryHeading="PRODUCTION SERVICES CATALOGUE"
        description="Explore our certified inventory of European clear-span marquees, heavy-duty stage trusses, P3.9 outdoor LED screens, digital line-array sound systems, and luxury VIP mobile restrooms."
        mainImage={sblStageBlueTrussImg}
        secondaryImage={sblMegaTentImg}
        tertiaryImage={intelligentLightingShowcaseImg}
        bgPatternImage={sblStageBlueTrussImg}
        themeVariant="amber"
        primaryCta={{
          label: "Book Equipment Package",
          onClick: () => openBookingModal(),
          icon: <Calendar className="w-4 h-4" />
        }}
        secondaryCta={{
          label: "WhatsApp Equipment Inquiry",
          href: COMPANY_CONTACT_INFO.whatsappUrl,
          isExternal: true,
          variant: "whatsapp",
          icon: <MessageCircle className="w-4 h-4" />
        }}
        customSlot={
          /* Category Filter Pills */
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-500/20'
                    : 'bg-[#060B14]/80 text-slate-200 border-white/15 hover:bg-amber-400/20 hover:text-amber-200 backdrop-blur-sm'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        }
        stats={[
          { value: "50kVA - 100kVA", label: "Cummins Power" },
          { value: "1,500+ Seater", label: "Clear-Span Marquees" },
          { value: "P3.9 High-Def", label: "Daylight LED Screens" }
        ]}
      />

      {/* Main Container */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" yOffset={35}>

      {/* Services Grid - Jumia-style 2-column compact layout on mobile */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6" staggerDelay={0.07}>
        {filteredServices.map((srv) => {
          const photoCount = (srv.galleryImages?.length || 0) + 1;
          const videoCount = srv.videos?.length || 0;

          return (
            <StaggerItem key={srv.id}>
              <div
                className={`bg-gradient-to-b from-[#0B1322] to-[#060B14] border border-amber-500/20 hover:border-amber-400/60 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 shadow-lg sm:shadow-xl flex flex-col justify-between group h-full hover:-translate-y-1`}
              >
                <div>
                  {/* Media header - compact on mobile */}
                  <div className="relative h-28 sm:h-52 overflow-hidden bg-[#060B14]">
                    <img
                      src={srv.image}
                      alt={srv.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1322] via-black/20 to-transparent" />

                    {/* Media badges */}
                    <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex items-center gap-1 sm:gap-1.5">
                      <span className="bg-[#050811]/90 text-amber-300 text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded sm:rounded-md border border-amber-400/30 flex items-center gap-0.5 sm:gap-1 backdrop-blur-sm">
                        <ImageIcon className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                        <span>{photoCount}</span>
                      </span>
                      {videoCount > 0 && (
                        <span className="bg-amber-500/90 text-slate-950 text-[8px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded sm:rounded-md border border-amber-400 flex items-center gap-0.5 sm:gap-1 shadow-sm">
                          <Video className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                          <span>{videoCount}</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 flex items-center gap-1.5 z-20">
                      {isAdminLoggedIn && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openCardEditor('service', srv);
                          }}
                          className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-[9px] sm:text-[11px] font-black shadow-lg flex items-center gap-1 transition-all cursor-pointer"
                          title="Edit Service Card (Admin)"
                        >
                          <Pencil className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span>Edit</span>
                        </button>
                      )}
                      {srv.b2bAvailable && (
                        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 rounded sm:rounded-md uppercase tracking-wider shadow-sm">
                          B2B
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-2.5 sm:p-5 space-y-1.5 sm:space-y-3">
                    <div>
                      <h3 className="text-xs sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 sm:line-clamp-2 leading-snug">
                        {srv.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-slate-300 mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-2">
                        {srv.shortDesc}
                      </p>
                    </div>

                    {/* Features List - hidden on ultra-small mobile, shown on sm+ for clean Jumia card look */}
                    <div className="hidden sm:block space-y-1.5 pt-2 border-t border-white/10">
                      {srv.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-slate-200">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions - compact on mobile */}
                <div className="p-2.5 sm:p-5 pt-0 flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => openBookingModal({ serviceId: srv.id })}
                    className="flex-1 py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-[10px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer truncate"
                  >
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>Book</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveServiceModal(srv);
                      setActiveMediaTab('photos');
                    }}
                    className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border border-white/15 bg-white/5 hover:bg-amber-400/20 hover:text-amber-200 text-slate-300 transition-colors cursor-pointer shrink-0"
                    title="View Photos & Videos"
                  >
                    <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      </ScrollReveal>

      {/* DETAILED SERVICE MODAL WITH MEDIA (PHOTOS & VIDEOS) */}
      <AnimatePresence>
        {activeServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full rounded-3xl overflow-hidden border border-amber-500/30 bg-[#0B1322] text-white shadow-2xl my-8"
            >
              {/* Header Image */}
              <div className="relative h-60 w-full bg-[#060B14]">
                <img
                  src={activeServiceModal.image}
                  alt={activeServiceModal.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setActiveServiceModal(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-[#050811]/80 text-white hover:bg-amber-500 hover:text-slate-950 border border-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-bold text-white">{activeServiceModal.title}</h2>
                    <p className="text-xs text-amber-300/80">{activeServiceModal.tagline}</p>
                  </div>

                  {/* Media Tabs */}
                  <div className="flex items-center gap-1 bg-[#060B14] p-1 rounded-xl border border-white/10 self-start sm:self-auto">
                    <button
                      onClick={() => setActiveMediaTab('photos')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        activeMediaTab === 'photos'
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-3 h-3" />
                      <span>Photos</span>
                    </button>
                    <button
                      onClick={() => setActiveMediaTab('videos')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        activeMediaTab === 'videos'
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Video className="w-3 h-3" />
                      <span>Videos ({(activeServiceModal.videos || []).length})</span>
                    </button>
                  </div>
                </div>

                {/* Media Tab 1: Photos */}
                {activeMediaTab === 'photos' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {activeServiceModal.fullDesc || activeServiceModal.shortDesc}
                    </p>

                    {/* Gallery Thumbnails */}
                    {activeServiceModal.galleryImages && activeServiceModal.galleryImages.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-amber-300 uppercase">Gallery Photos</span>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {[activeServiceModal.image, ...activeServiceModal.galleryImages.filter(img => img !== activeServiceModal.image)].map((imgUrl, idx) => (
                            <img
                              key={idx}
                              src={imgUrl}
                              alt="Service photo"
                              referrerPolicy="no-referrer"
                              className="w-full h-16 rounded-lg object-cover border border-white/15"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Media Tab 2: Videos */}
                {activeMediaTab === 'videos' && (
                  <div className="space-y-3">
                    {(!activeServiceModal.videos || activeServiceModal.videos.length === 0) ? (
                      <div className="p-6 rounded-xl bg-[#060B14] text-center text-xs text-slate-400 space-y-1">
                        <Video className="w-6 h-6 mx-auto opacity-50" />
                        <p>No video links uploaded yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activeServiceModal.videos.map((vid) => (
                          <a
                            key={vid.id}
                            href={vid.url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#060B14] p-3 rounded-xl border border-white/15 hover:border-amber-400/40 flex items-center justify-between gap-2 group transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                                <Play className="w-3.5 h-3.5 fill-amber-300" />
                              </div>
                              <div className="truncate">
                                <p className="text-xs font-bold text-white truncate">{vid.title}</p>
                                <span className="text-[10px] text-amber-300 uppercase font-mono">
                                  {vid.platform || 'Watch Video'}
                                </span>
                              </div>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300 shrink-0" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Features */}
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <span className="text-[11px] font-bold text-amber-300 uppercase block">Specifications:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    {activeServiceModal.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="text-slate-200">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      const srvId = activeServiceModal.id;
                      setActiveServiceModal(null);
                      openBookingModal({ serviceId: srvId });
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 text-center transition-all cursor-pointer"
                  >
                    Reserve This Service
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
