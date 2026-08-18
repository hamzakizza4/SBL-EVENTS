import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GALLERY_ITEMS } from '../data/mockData';
import { GalleryItem } from '../types';
import { getThemeClasses } from '../utils/themeStyles';
import { 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Camera,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const GalleryView: React.FC = () => {
  const { openBookingModal, theme } = useApp();
  const t = getThemeClasses(theme);

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'weddings', label: 'Luxury Weddings' },
    { id: 'corporate', label: 'Corporate Galas & Expos' },
    { id: 'concerts', label: 'Concerts & Festivals' },
  ];

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  return (
    <div id="gallery-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold shadow-xs">
          <Camera className="w-4 h-4 text-blue-300" />
          <span>Proven Production Excellence</span>
        </div>
        <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit'] ${t.headingText}`}>
          Event Production Showcase & Portfolio
        </h1>
        <p className={`text-xs sm:text-base leading-relaxed ${t.mutedText}`}>
          Explore real stage structures, illuminated marquees, LED video walls, and luxury floral decors engineered by SBL Events across the region.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border shadow-xs ${
              activeFilter === f.id
                ? 'bg-white text-[#0F1F38] border-white font-bold shadow-md'
                : 'bg-[#152A4A] text-slate-200 border-white/15 hover:bg-white/10 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedGalleryItem(item)}
            className={`group relative border rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 ${
              t.cardBg
            } ${t.cardBorder} hover:border-white/40 ${t.cardShadow}`}
          >
            {/* Image */}
            <div className="relative h-72 sm:h-80 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F38] via-black/30 to-transparent" />
              
              {/* Top Meta */}
              <div className="absolute top-3 left-3 bg-[#0F1F38]/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white border border-white/20 shadow-sm">
                {item.category.toUpperCase()}
              </div>

              {item.beforeImage && (
                <div className="absolute top-3 right-3 bg-white text-[#0F1F38] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow">
                  Transformation View
                </div>
              )}

              {/* Bottom Card Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2 text-white">
                <div className="flex items-center gap-3 text-[11px] text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-300" />
                    {item.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-300" />
                    {item.attendees}
                  </span>
                </div>

                <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-blue-200 transition-colors">
                  {item.title}
                </h3>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-300 group-hover:text-white flex items-center gap-1 font-semibold">
                    <span>Inspect Production Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: GALLERY ITEM DETAILS */}
      <AnimatePresence>
        {selectedGalleryItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl w-full rounded-3xl overflow-hidden border border-white/20 bg-[#132644] text-white shadow-2xl space-y-0 my-8"
            >
              <div className="relative h-80 sm:h-96 w-full">
                <img
                  src={selectedGalleryItem.image}
                  alt={selectedGalleryItem.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedGalleryItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-[#0F1F38]/80 text-white hover:bg-[#0F1F38] transition-colors border border-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-blue-300 font-bold uppercase mb-1">
                    <span>{selectedGalleryItem.category}</span>
                    <span>•</span>
                    <span>{selectedGalleryItem.date}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedGalleryItem.title}</h2>
                  <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-white" />
                    <span>{selectedGalleryItem.location} ({selectedGalleryItem.attendees} Capacity)</span>
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {selectedGalleryItem.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-white/15">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Services & Equipment Deployed:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedGalleryItem.servicesProvided.map((srv, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-white/10 text-white text-xs border border-white/20 font-medium">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/15 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      const itemTitle = selectedGalleryItem.title;
                      setSelectedGalleryItem(null);
                      openBookingModal({ packageType: itemTitle });
                    }}
                    className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-sm shadow-md transition-all text-center"
                  >
                    Request Similar Setup for Your Event
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
