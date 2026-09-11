import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAdminContentSync } from '../context/AdminContentSyncContext';
import { 
  VIDEO_REELS, 
  COMPANY_CONTACT_INFO, 
  galleryShowcaseBannerBgImg,
  sblStageBlueTrussImg,
  sblLedScreenImg,
  kwanjulaRoyalStageImg,
  sblMegaTentImg
} from '../data/mockData';
import { GalleryItem, VideoReel } from '../types';
import { getThemeClasses } from '../utils/themeStyles';
import { GeometricHeroBanner } from './GeometricHeroBanner';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollReveal';
import { 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Camera,
  Crown,
  Play,
  Film,
  Phone,
  MessageCircle,
  Volume2,
  Tv,
  Tent,
  Sparkles,
  ExternalLink,
  Zap,
  Flame,
  UserCheck,
  Search,
  ChevronLeft,
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const GalleryView: React.FC = () => {
  const { galleryItems, openBookingModal, theme, isAdminLoggedIn, openCardEditor } = useApp();
  const { videoReels } = useAdminContentSync();
  const allReels = (videoReels && videoReels.length > 0) ? videoReels : VIDEO_REELS;
  const t = getThemeClasses(theme);

  const [mainViewMode, setMainViewMode] = useState<'photos' | 'videos'>('photos');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [selectedVideoReel, setSelectedVideoReel] = useState<VideoReel | null>(null);

  const photoFilters = [
    { id: 'all', label: 'All Events Done' },
    { id: 'weddings', label: 'Weddings & Kwanjula' },
    { id: 'tents', label: 'Mega Tents & AC Marquees' },
    { id: 'corporate', label: 'Corporate Galas & Expos' },
    { id: 'concerts', label: 'Concerts, Stages & Sound' },
  ];

  const filteredItems = galleryItems.filter((item) => {
    // 1. Category check
    if (activeFilter !== 'all' && item.category !== activeFilter) return false;

    // 2. Search query check
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchTitle = item.title.toLowerCase().includes(q);
    const matchDesc = item.description.toLowerCase().includes(q);
    const matchLoc = item.location.toLowerCase().includes(q);
    const matchCat = item.category.toLowerCase().includes(q);
    const matchBadge = item.badge?.toLowerCase().includes(q);
    const matchClient = item.clientName?.toLowerCase().includes(q);
    const matchAttendees = item.attendees?.toLowerCase().includes(q);

    return matchTitle || matchDesc || matchLoc || matchCat || matchBadge || matchClient || matchAttendees;
  });

  const filteredVideos = allReels.filter((reel) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      reel.title.toLowerCase().includes(q) ||
      reel.description.toLowerCase().includes(q) ||
      reel.category.toLowerCase().includes(q) ||
      reel.tiktokHandle.toLowerCase().includes(q)
    );
  });

  return (
    <div id="gallery-view" className="w-full pb-20 space-y-10">
      
      {/* 1. CINEMATIC GEOMETRIC HERO BANNER (Full-Bleed, Border-to-Border, High Visibility) */}
      <GeometricHeroBanner
        badgeText="Real Production Portfolio & Live Video Reels"
        badgeIcon={<Camera className="w-4 h-4 text-amber-300" />}
        accentHeading="EVENTS DONE &amp; DISPATCH"
        primaryHeading="PRODUCTION SHOWCASE"
        description="Explore verified structural mega marquees, royal Kwanjula & wedding staging, curved P2.6 LED video screens, concert lighting trusses, and mobile disco setups engineered across Masaka, Lwengo, and nationwide."
        mainImage={galleryShowcaseBannerBgImg}
        secondaryImage={sblStageBlueTrussImg}
        tertiaryImage={sblLedScreenImg}
        bgPatternImage={galleryShowcaseBannerBgImg}
        themeVariant="amber"
        primaryCta={{
          label: "Book Equipment / Get Quote",
          onClick: () => openBookingModal(),
          icon: <Calendar className="w-4 h-4" />
        }}
        secondaryCta={{
          label: "Watch TikTok Reels",
          href: "https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/",
          isExternal: true,
          variant: "tiktok",
          icon: <Film className="w-4 h-4" />
        }}
        customSlot={
          <div className="pt-2">
            {/* View Mode Toggle */}
            <div className="inline-flex p-1.5 rounded-full bg-[#050811]/90 backdrop-blur-md border border-amber-500/30 shadow-xl">
              <button
                id="gallery-photos-tab"
                onClick={() => setMainViewMode('photos')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                  mainViewMode === 'photos'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Photos ({galleryItems.length})</span>
              </button>

              <button
                id="gallery-videos-tab"
                onClick={() => setMainViewMode('videos')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black transition-all relative cursor-pointer ${
                  mainViewMode === 'videos'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>TikTok Reels</span>
                <span className="bg-white text-rose-600 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                  HOT
                </span>
              </button>
            </div>
          </div>
        }
        stats={[
          { value: `${galleryItems.length}+`, label: "Portfolio Stills" },
          { value: `${VIDEO_REELS.length}+`, label: "TikTok Video Reels" },
          { value: "100%", label: "Verified Real Gear" }
        ]}
      />

      {/* Main Container for Gallery Content */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" yOffset={35}>

      {/* PHOTOS VIEW */}
      {mainViewMode === 'photos' && (
        <div className="space-y-8">
          {/* Search Bar & Filter Controls */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#0B1322] border border-amber-500/20 shadow-xl space-y-3.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300 pointer-events-none" />
                <input
                  id="gallery-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search showcase by event type, venue, city (e.g. Masaka, Kampala, Mbarara), tents, LED screens..."
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#060B14] border border-white/15 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Counter Badge */}
              <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-slate-300">
                <span className="bg-[#060B14] px-3.5 py-2 rounded-xl border border-amber-400/30 font-semibold text-amber-300">
                  {filteredItems.length} {filteredItems.length === 1 ? 'event photo' : 'event photos'}
                </span>
                {(searchQuery || activeFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilter('all');
                    }}
                    className="text-xs text-amber-300 hover:text-white underline font-semibold px-2 py-1 cursor-pointer"
                  >
                    Reset all
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Categories:</span>
              {photoFilters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeFilter === f.id
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'bg-[#060B14] text-slate-200 border border-white/15 hover:bg-amber-400/20 hover:text-amber-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}

              {/* Suggested Search Terms */}
              <div className="hidden lg:flex items-center gap-1.5 ml-auto text-[11px] text-slate-400">
                <span className="font-semibold text-slate-400">Quick tags:</span>
                {['Kwanjula', 'Mega Marquee', 'Masaka', 'Concert', 'AC Tent'].map((kw) => (
                  <button
                    key={kw}
                    onClick={() => setSearchQuery(kw)}
                    className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-200 border border-white/10 text-[10px] font-medium transition-colors cursor-pointer"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gallery Grid or Empty State - Jumia 2-column compact layout on mobile */}
          {filteredItems.length > 0 ? (
            <StaggerContainer className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6" staggerDelay={0.06}>
              {filteredItems.map((item) => (
                <StaggerItem key={item.id}>
                  <div
                    onClick={() => setSelectedGalleryItem(item)}
                    className="group relative border border-amber-500/20 hover:border-amber-400/60 rounded-xl sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 h-full bg-[#0B1322] shadow-lg sm:shadow-xl"
                  >
                    {/* Image */}
                    <div className="relative h-40 sm:h-80 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-black/30 to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex flex-wrap gap-1 sm:gap-2">
                        <span className="bg-[#050811]/90 backdrop-blur-md px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[11px] font-bold text-amber-300 border border-amber-400/30 shadow-sm">
                          {item.category.toUpperCase()}
                        </span>
                        {item.badge && (
                          <span className="hidden xs:inline-block bg-gradient-to-r from-amber-500 to-yellow-500 backdrop-blur-md px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-black text-slate-950 shadow-sm">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Top Right Admin Edit Button */}
                      {isAdminLoggedIn && (
                        <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 z-30">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openCardEditor('gallery', item);
                            }}
                            className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-[9px] sm:text-[11px] font-black shadow-lg flex items-center gap-1 transition-all cursor-pointer"
                            title="Edit Gallery Item (Admin)"
                          >
                            <Pencil className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            <span>Edit</span>
                          </button>
                        </div>
                      )}

                      {/* Bottom Card Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-5 space-y-1 sm:space-y-2 text-white">
                        <div className="flex items-center gap-1.5 sm:gap-3 text-[9px] sm:text-[11px] text-slate-300">
                          <span className="flex items-center gap-0.5 sm:gap-1 truncate">
                            <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                            <Users className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                            <span>{item.attendees}</span>
                          </span>
                        </div>

                        <h3 className="text-xs sm:text-lg font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors line-clamp-1 sm:line-clamp-2 leading-snug">
                          {item.title}
                        </h3>

                        <div className="flex items-center justify-between pt-0.5 sm:pt-1">
                          <span className="text-[10px] sm:text-xs text-amber-300/80 group-hover:text-amber-300 flex items-center gap-1 font-semibold">
                            <span>Details</span>
                            <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl bg-[#0B1322] border border-white/15 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-amber-300 shadow-md">
                <Search className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-white">No gallery events matching "{searchQuery}"</h3>
                <p className="text-xs text-slate-300">
                  Try searching for keywords like "wedding", "kwanjula", "marquee", "dome", "Masaka", or clear your filter.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-md cursor-pointer"
              >
                Clear Search &amp; View All Events
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIDEO REELS VIEW */}
      {mainViewMode === 'videos' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-[#0B1322] via-[#0E182A] to-[#070D18] border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>SBL Events Official Live Reels</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit']">
                  Watch Live Rigging &amp; Venue Setups
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Hear our live commentary ("Empologoma ya Bannamasaka"), inspect our newly imported China Mega Tents, ducted AC cooling, and LED screen video walls in action.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2 justify-center">
                <a
                  href={COMPANY_CONTACT_INFO.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xs sm:text-sm text-center shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Film className="w-4 h-4" />
                  <span>Open TikTok @sblofficial92</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={COMPANY_CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm text-center transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Video Inquiry</span>
                </a>
              </div>
            </div>
          </div>

          {/* Search Bar for Video Reels */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#0B1322] border border-white/15 shadow-xl space-y-3.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400 pointer-events-none" />
                <input
                  id="video-reels-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search video reels by title, keyword, TikTok tag, sound or marquee setup..."
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#060B14] border border-white/15 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-hidden focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-slate-300">
                <span className="bg-[#060B14] px-3.5 py-2 rounded-xl border border-pink-500/30 font-semibold text-pink-200">
                  {filteredVideos.length} {filteredVideos.length === 1 ? 'reel' : 'reels'}
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-pink-300 hover:text-white underline font-semibold px-2 py-1 cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Video Reels Grid or Empty State - Jumia 2-column layout on mobile */}
          {filteredVideos.length > 0 ? (
            <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6" staggerDelay={0.06}>
              {filteredVideos.map((reel) => (
                <StaggerItem key={reel.id}>
                  <div
                    onClick={() => setSelectedVideoReel(reel)}
                    className="group relative border border-white/15 rounded-xl sm:rounded-3xl overflow-hidden cursor-pointer bg-[#0B1322] hover:border-pink-400/60 shadow-lg sm:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full"
                  >
                    {/* Reel Thumbnail with Play Button */}
                    <div className="relative h-40 sm:h-80 overflow-hidden bg-black">
                      <img
                        src={reel.thumbnail}
                        alt={reel.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-black/20 to-transparent" />

                      {/* Play Button Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-white text-white group-hover:text-slate-950 transition-all shadow-xl">
                          <Play className="w-4 h-4 sm:w-6 sm:h-6 ml-0.5 fill-current" />
                        </div>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-1.5 left-1.5 right-1.5 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between">
                        <span className="bg-rose-600/90 backdrop-blur-md px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-extrabold text-white shadow-xs flex items-center gap-0.5 sm:gap-1">
                          <Film className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span>{reel.badge}</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isAdminLoggedIn && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openCardEditor('reel', reel);
                              }}
                              className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-[9px] sm:text-[11px] font-black shadow-lg flex items-center gap-1 transition-all cursor-pointer"
                              title="Edit Reel (Admin)"
                            >
                              <Pencil className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              <span>Edit</span>
                            </button>
                          )}
                          <span className="bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] font-bold text-slate-200">
                            {reel.duration}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Stats */}
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between text-[9px] sm:text-[11px] text-slate-200">
                        <span className="font-semibold">{reel.viewsCount}</span>
                        <span className="text-pink-300 font-bold truncate max-w-[80px] sm:max-w-none">{reel.tiktokHandle}</span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-2 sm:p-5 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-3 text-white">
                      <div className="space-y-0.5 sm:space-y-1.5">
                        <h3 className="font-bold text-xs sm:text-base leading-snug group-hover:text-pink-200 transition-colors line-clamp-1 sm:line-clamp-2">
                          {reel.title}
                        </h3>
                        <p className="hidden sm:block text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {reel.description}
                        </p>
                      </div>

                      <div className="pt-1 sm:pt-2 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-xs">
                        <span className="text-amber-300 font-bold flex items-center gap-0.5 sm:gap-1">
                          <Phone className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                          <span className="truncate text-[9px] sm:text-xs">{reel.hotline}</span>
                        </span>
                        <span className="text-white/80 group-hover:text-white font-semibold flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-xs">
                          <span>Play</span>
                          <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl bg-[#0B1322] border border-white/15 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-rose-400 shadow-md">
                <Film className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-white">No video reels matching "{searchQuery}"</h3>
                <p className="text-xs text-slate-300">
                  Try searching for keywords like "wedding", "kwanjula", "rigging", "sound", or reset search.
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-md cursor-pointer"
              >
                Clear Search &amp; View All Reels
              </button>
            </div>
          )}
        </div>
      )}

      </ScrollReveal>

      {/* MODAL: PHOTO GALLERY ITEM DETAILS */}
      <AnimatePresence>
        {selectedGalleryItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl w-full rounded-3xl overflow-hidden border border-amber-500/30 bg-[#0B1322] text-white shadow-2xl space-y-0 my-8"
            >
              <div className="relative h-80 sm:h-96 w-full">
                <img
                  src={selectedGalleryItem.image}
                  alt={selectedGalleryItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setSelectedGalleryItem(null)}
                  className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#050811]/90 text-white hover:bg-black transition-colors border border-white/20 flex items-center gap-1.5 text-xs font-bold shadow-lg cursor-pointer backdrop-blur-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setSelectedGalleryItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-[#050811]/80 text-white hover:bg-amber-500 hover:text-slate-950 transition-colors border border-white/20 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-bold uppercase mb-1">
                    <span>{selectedGalleryItem.category}</span>
                    <span>•</span>
                    <span>{selectedGalleryItem.date}</span>
                    {selectedGalleryItem.badge && (
                      <>
                        <span>•</span>
                        <span className="text-amber-400 font-extrabold">{selectedGalleryItem.badge}</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedGalleryItem.title}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {selectedGalleryItem.location} ({selectedGalleryItem.attendees})
                    </span>
                    {selectedGalleryItem.clientName && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-amber-300" />
                        Client: <strong className="text-white">{selectedGalleryItem.clientName}</strong>
                      </span>
                    )}
                    {selectedGalleryItem.postedBy && (
                      <span className="text-slate-400 text-[11px]">
                        Posted by Admin: {selectedGalleryItem.postedBy}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {selectedGalleryItem.description}
                </p>

                {/* Video Link if attached */}
                {selectedGalleryItem.videoUrl && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-rose-200">
                      <Play className="w-4 h-4 text-rose-400 fill-rose-400" />
                      <span className="font-semibold">Event Video &amp; Reel Clip available for this setup</span>
                    </div>
                    <a
                      href={selectedGalleryItem.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1 text-[11px] shadow-sm whitespace-nowrap"
                    >
                      <Film className="w-3 h-3" />
                      <span>Watch Video</span>
                    </a>
                  </div>
                )}

                {/* Additional Event Photos if available */}
                {selectedGalleryItem.photos && selectedGalleryItem.photos.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/15">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                      Event Photo Gallery ({selectedGalleryItem.photos.length + 1} Shots):
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      <div className="h-20 rounded-xl overflow-hidden border border-white/30">
                        <img
                          src={selectedGalleryItem.image}
                          alt="Cover"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {selectedGalleryItem.photos.map((photo, pIdx) => (
                        <div key={pIdx} className="h-20 rounded-xl overflow-hidden border border-white/20">
                          <img
                            src={photo}
                            alt={`Shot ${pIdx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-white/15">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    Equipment &amp; Production Deployed:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedGalleryItem.servicesProvided.map((srv, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-white/10 text-white text-xs border border-white/20 font-medium">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedGalleryItem(null)}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={() => {
                      const itemTitle = selectedGalleryItem.title;
                      setSelectedGalleryItem(null);
                      openBookingModal({ packageType: itemTitle });
                    }}
                    className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all text-center cursor-pointer"
                  >
                    Request Similar Setup for Your Event
                  </button>

                  <a
                    href={`https://wa.me/256752420911?text=Hello%20SBL%20Events,%20I%20saw%20the%20${encodeURIComponent(selectedGalleryItem.title)}%20in%20your%20portfolio%20and%20would%20like%20a%20quotation.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Us</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: VIDEO REEL PLAYER & SPECS */}
      <AnimatePresence>
        {selectedVideoReel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full rounded-3xl overflow-hidden border border-amber-500/30 bg-[#0B1322] text-white shadow-2xl space-y-0 my-8"
            >
              {/* Media Header Banner */}
              <div className="relative h-72 sm:h-80 w-full bg-black">
                <img
                  src={selectedVideoReel.thumbnail}
                  alt={selectedVideoReel.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1322] via-transparent to-black/60" />
                
                {/* Back Button Overlay */}
                <button
                  type="button"
                  onClick={() => setSelectedVideoReel(null)}
                  className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#050811]/90 text-white hover:bg-black transition-colors border border-white/20 flex items-center gap-1.5 text-xs font-bold shadow-lg cursor-pointer backdrop-blur-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedVideoReel(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-[#050811]/90 text-white hover:bg-amber-500 hover:text-slate-950 transition-colors border border-white/20 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Center Video Play Simulation */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <a
                    href={selectedVideoReel.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-110 mb-3 cursor-pointer"
                  >
                    <Play className="w-8 h-8 ml-1 fill-current" />
                  </a>
                  <span className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-pink-300 border border-pink-500/30">
                    Watch Full HD Clip on TikTok {selectedVideoReel.tiktokHandle}
                  </span>
                </div>
              </div>

              {/* Reel Info Content */}
              <div className="p-6 sm:p-8 space-y-5">
                <div>
                  <div className="flex items-center gap-2 text-xs text-rose-300 font-bold uppercase mb-1">
                    <span>{selectedVideoReel.badge}</span>
                    <span>•</span>
                    <span>{selectedVideoReel.location}</span>
                    <span>•</span>
                    <span>{selectedVideoReel.viewsCount}</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">{selectedVideoReel.title}</h2>
                  <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Booking Hotline: {selectedVideoReel.hotline}</span>
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {selectedVideoReel.description}
                </p>

                {/* Audio Voiceover Highlights */}
                {selectedVideoReel.audioTranscriptNotes && (
                  <div className="p-3.5 rounded-2xl bg-[#060B14] border border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Original Audio / Setup Commentary:</span>
                    </div>
                    <p className="text-xs text-slate-300 italic">
                      {selectedVideoReel.audioTranscriptNotes}
                    </p>
                  </div>
                )}

                {/* Equipment Highlights */}
                <div className="space-y-2 pt-2 border-t border-white/15">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    Featured Rigging &amp; Equipment:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedVideoReel.equipmentHighlights.map((eq, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-white/10 text-white text-xs border border-white/20 font-medium">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedVideoReel(null)}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={() => {
                      const reelTitle = selectedVideoReel.title;
                      setSelectedVideoReel(null);
                      openBookingModal({ packageType: reelTitle });
                    }}
                    className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all text-center cursor-pointer"
                  >
                    Book This Setup ({selectedVideoReel.title})
                  </button>

                  <a
                    href={selectedVideoReel.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:brightness-110 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Film className="w-4 h-4" />
                    <span>View TikTok</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
