import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Service } from '../types';
import { getThemeClasses } from '../utils/themeStyles';
import { 
  Layers, 
  CheckCircle2, 
  Calendar, 
  Info, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Tv, 
  Volume2, 
  Mic2, 
  Sparkle, 
  Tent, 
  Bath, 
  Truck, 
  SlidersHorizontal,
  X,
  Check,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ServicesView: React.FC = () => {
  const { services, openBookingModal, theme } = useApp();
  const t = getThemeClasses(theme);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeServiceModal, setActiveServiceModal] = useState<Service | null>(null);

  // Interactive Package Estimator State
  const [estGuests, setEstGuests] = useState<number>(400);
  const [estDays, setEstDays] = useState<number>(1);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([
    'mega-tents',
    'intelligent-lighting',
    'mobile-disco-sound',
  ]);
  const [selectedAddonKeys, setSelectedAddonKeys] = useState<{ [key: string]: boolean }>({
    generator: true,
    toilet: true,
    mc: false,
    led: false,
    dryice: true,
  });

  const categories: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Services (10)', icon: <Layers className="w-4 h-4" /> },
    { id: 'tents', label: 'Mega Tents & Stages', icon: <Tent className="w-4 h-4" /> },
    { id: 'lighting', label: 'Intelligent Lighting', icon: <Zap className="w-4 h-4" /> },
    { id: 'screens', label: 'LED Video Screens', icon: <Tv className="w-4 h-4" /> },
    { id: 'sound-mc', label: 'Mobile Disco & MC', icon: <Volume2 className="w-4 h-4" /> },
    { id: 'production', label: 'Decor & Planning', icon: <Sparkle className="w-4 h-4" /> },
    { id: 'restrooms', label: 'Mobile Restrooms', icon: <Bath className="w-4 h-4" /> },
    { id: 'b2b-lending', label: 'B2B Tent Lending', icon: <Truck className="w-4 h-4" /> },
  ];

  const filteredServices = services.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.category === selectedCategory;
  });

  // Calculate Estimator Total
  const baseCost = selectedServiceIds.reduce((sum, sId) => {
    const s = services.find((srv) => srv.id === sId);
    return sum + (s ? s.basePrice : 0);
  }, 0);

  const addonPrices: { [key: string]: number } = {
    generator: 350,
    toilet: 350,
    mc: 400,
    led: 800,
    dryice: 150,
  };

  const addonsTotal = Object.entries(selectedAddonKeys).reduce((sum, [key, active]) => {
    return sum + (active ? (addonPrices[key] || 0) : 0);
  }, 0);

  const guestScale = estGuests > 500 ? 1.3 : estGuests > 1000 ? 1.6 : 1.0;
  const grandTotalEstimate = Math.round((baseCost * guestScale + addonsTotal) * estDays);

  const toggleEstimatorService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleEstimatorAddon = (key: string) => {
    setSelectedAddonKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div id="services-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold shadow-xs">
          <Layers className="w-4 h-4 text-blue-300" />
          <span>Complete Event Inventory & Production Arsenal</span>
        </div>
        <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit'] ${t.headingText}`}>
          Services, Equipment Hire & Tent Lending
        </h1>
        <p className={`text-xs sm:text-base leading-relaxed ${t.mutedText}`}>
          Browse all 10 specialized services. Every booking includes certified rigging, master sound engineering, on-site backup generators, and transport logistics.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border shadow-xs ${
              selectedCategory === cat.id
                ? 'bg-white text-[#0F1F38] border-white font-bold shadow-md'
                : 'bg-[#152A4A] text-slate-200 border-white/15 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className={`${t.cardBg} border ${t.cardBorder} hover:border-white/40 rounded-3xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between group`}
          >
            <div>
              {/* Media header */}
              <div className="relative h-56 overflow-hidden bg-[#0A1830]">
                <img
                  src={srv.image}
                  alt={srv.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#152A4A] via-black/20 to-transparent" />
                
                <div className="absolute top-3 left-3 bg-[#0F1F38]/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                  ${srv.basePrice} {srv.priceUnit}
                </div>

                {srv.b2bAvailable && (
                  <div className="absolute top-3 right-3 bg-white text-[#0F1F38] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                    B2B Lending Ready
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {srv.shortDesc}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Key Specifications & Inclusions:
                  </span>
                  {srv.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                      <span className="text-slate-200">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 pt-0 flex items-center gap-3">
              <button
                onClick={() => openBookingModal({ serviceId: srv.id })}
                className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve / Book</span>
              </button>

              <button
                onClick={() => setActiveServiceModal(srv)}
                className="p-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Detailed Technical Specifications"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* INTERACTIVE INSTANT EVENT COST ESTIMATOR */}
      <section className="rounded-3xl p-6 sm:p-10 border border-white/20 bg-[#132644] text-white shadow-2xl space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-300" />
            <span>Interactive Cost Calculator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit']">
            Build Your Custom Package & Get Instant Estimate
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Select items to simulate package combinations. Our team will tailor exact rigging blueprints.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Scale sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0E1D35] p-5 rounded-2xl border border-white/10">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Guest Capacity Scale:</span>
                  <span className="text-white bg-white/10 px-2 py-0.5 rounded-md font-mono">{estGuests} Guests</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2500"
                  step="50"
                  value={estGuests}
                  onChange={(e) => setEstGuests(Number(e.target.value))}
                  className="w-full accent-white"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Event Duration (Days):</span>
                  <span className="text-white bg-white/10 px-2 py-0.5 rounded-md font-mono">{estDays} Day(s)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={estDays}
                  onChange={(e) => setEstDays(Number(e.target.value))}
                  className="w-full accent-white"
                />
              </div>
            </div>

            {/* Service Checkboxes */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                1. Select Core Service Modules:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {services.map((s) => {
                  const isChecked = selectedServiceIds.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleEstimatorService(s.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-white text-[#0F1F38] border-white font-bold shadow-md'
                          : 'bg-[#0E1D35] text-slate-300 border-white/15 hover:border-white/30'
                      }`}
                    >
                      <span className="truncate pr-2">{s.title}</span>
                      <span className="shrink-0 text-[11px] font-mono opacity-80">+${s.basePrice}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Addons Checkboxes */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                2. Power & Logistics Add-ons:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { key: 'generator', label: '100kVA Diesel Gen', price: 350 },
                  { key: 'toilet', label: 'VIP Restroom Trailer', price: 350 },
                  { key: 'mc', label: 'Bilingual MC Host', price: 400 },
                  { key: 'led', label: 'P2.6 LED Wall (4x3m)', price: 800 },
                  { key: 'dryice', label: 'Dry Ice Low Fog Effect', price: 150 },
                ].map((addon) => {
                  const isChecked = selectedAddonKeys[addon.key];
                  return (
                    <button
                      key={addon.key}
                      type="button"
                      onClick={() => toggleEstimatorAddon(addon.key)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-white text-[#0F1F38] border-white font-bold shadow-xs'
                          : 'bg-[#0E1D35] text-slate-300 border-white/15'
                      }`}
                    >
                      <span className="text-[11px]">{addon.label}</span>
                      <span className="text-[10px] opacity-70">+${addon.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Estimate Summary Box */}
          <div className="lg:col-span-5 bg-[#0E1D35] rounded-3xl p-6 sm:p-7 border border-white/20 space-y-6">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Estimated Package Total:</span>
              <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                ${grandTotalEstimate.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-300">
                Includes staging crew, sound technician & generator dispatch.
              </p>
            </div>

            <div className="space-y-2 border-t border-b border-white/10 py-4 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Selected Services ({selectedServiceIds.length}):</span>
                <span className="font-mono text-white">${Math.round(baseCost * guestScale * estDays).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Addons & Generators:</span>
                <span className="font-mono text-white">${addonsTotal * estDays}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Capacity Factor:</span>
                <span className="font-mono text-white">{estGuests} Guests ({guestScale}x)</span>
              </div>
            </div>

            <button
              onClick={() => openBookingModal({
                packageType: `Custom Calculator Estimate ($${grandTotalEstimate.toLocaleString()} - ${estGuests} Guests)`,
              })}
              className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Lock In This Package Estimate</span>
            </button>
          </div>

        </div>
      </section>

      {/* DETAILED SERVICE MODAL */}
      <AnimatePresence>
        {activeServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full rounded-3xl overflow-hidden border border-white/20 bg-[#132644] text-white shadow-2xl my-8 space-y-0"
            >
              <div className="relative h-64 w-full">
                <img
                  src={activeServiceModal.image}
                  alt={activeServiceModal.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setActiveServiceModal(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-[#0F1F38]/80 text-white hover:bg-[#0F1F38] border border-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{activeServiceModal.title}</h2>
                  <p className="text-xs text-blue-300 font-bold uppercase mt-0.5">
                    Pricing starts at ${activeServiceModal.basePrice} {activeServiceModal.priceUnit}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {activeServiceModal.description}
                </p>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Full Inclusions & Rigging Parameters:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeServiceModal.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs bg-white/10 p-2.5 rounded-xl border border-white/15">
                        <Check className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                        <span className="text-slate-100">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/15 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      const srvId = activeServiceModal.id;
                      setActiveServiceModal(null);
                      openBookingModal({ serviceId: srvId });
                    }}
                    className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-sm shadow-md text-center"
                  >
                    Proceed with Booking
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
