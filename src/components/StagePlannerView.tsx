import React from 'react';
import { useApp } from '../context/AppContext';
import { getThemeClasses } from '../utils/themeStyles';
import { Interactive3DStagePlanner } from './Interactive3DStagePlanner';
import { Sparkles, ArrowLeft, Calendar, ShieldCheck, Box, PhoneCall } from 'lucide-react';

export const StagePlannerView: React.FC = () => {
  const { theme, setCurrentPage, openBookingModal } = useApp();
  const t = getThemeClasses(theme);

  return (
    <div className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive 3D Simulation</span>
          </span>
          <button
            onClick={() => openBookingModal()}
            className={`${t.primaryBtn} px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Request Custom Rig</span>
          </button>
        </div>
      </div>

      {/* Hero Headline */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-black">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Next-Gen Event Production Visualization</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-['Outfit'] tracking-tight">
          3D Interactive Stage & Rigging Planner
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Explore stage footprints, aluminium box truss heights, moving head light sweeps, P2.6 LED screens, and acoustic PA placements in real-time 3D before your event begins.
        </p>
      </div>

      {/* The 3D Interactive Stage Component */}
      <div className="p-4 sm:p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 shadow-2xl backdrop-blur-md">
        <Interactive3DStagePlanner />
      </div>

      {/* Production Engineering Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className={`${t.cardBg} p-6 rounded-3xl border ${t.cardBorder} shadow-lg space-y-3`}>
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Box className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-['Outfit']">Certified Structural Rigging</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            All box trusses, ground support towers, and stage decks are engineered with certified load calculations and safety wire fail-safes.
          </p>
        </div>

        <div className={`${t.cardBg} p-6 rounded-3xl border ${t.cardBorder} shadow-lg space-y-3`}>
          <div className="w-10 h-10 rounded-2xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-['Outfit']">100% Uninterrupted Power</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Each stage package comes with dedicated backup diesel generators (up to 100kVA) and automatic transfer switches for zero blackout risk.
          </p>
        </div>

        <div className={`${t.cardBg} p-6 rounded-3xl border ${t.cardBorder} shadow-lg space-y-3`}>
          <div className="w-10 h-10 rounded-2xl bg-blue-400/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-['Outfit']">On-Site Technical Crew</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            SBL rigging engineers, light jockeys (LJ), sound mixers, and video directors remain on-site throughout your event from setup to breakdown.
          </p>
        </div>
      </div>
    </div>
  );
};
