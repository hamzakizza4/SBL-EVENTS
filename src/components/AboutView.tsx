import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  INVENTORY_ITEMS, 
  sblAboutGardenLightsImg, 
  sblMegaTentImg, 
  sblStageBlueTrussImg, 
  COMPANY_CONTACT_INFO 
} from '../data/mockData';
import { getThemeClasses } from '../utils/themeStyles';
import { IsometricHeroShowcase } from './IsometricHeroShowcase';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollReveal';
import { 
  ShieldCheck, 
  Award, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  Phone
} from 'lucide-react';
import { motion } from 'motion/react';

export const AboutView: React.FC = () => {
  const { openBookingModal, theme } = useApp();
  const t = getThemeClasses(theme);

  return (
    <div id="about-view" className="w-full pb-20 space-y-12">
      
      {/* 1. 3D ISOMETRIC PRODUCTION SHOWCASE HERO */}
      <IsometricHeroShowcase />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Production Standards & Commitments */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5" staggerDelay={0.1}>
          <StaggerItem>
            <div 
              className={`p-6 rounded-3xl border ${t.cardBg} ${t.cardBorder} shadow-xl space-y-3 h-full hover:-translate-y-1 transition-transform duration-300`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Structural Wind-Load Certified</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                All our clear-span and alpine marquees are engineered to withstand extreme 100km/h wind loads with industrial steel anchoring.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div 
              className={`p-6 rounded-3xl border ${t.cardBg} ${t.cardBorder} shadow-xl space-y-3 h-full hover:-translate-y-1 transition-transform duration-300`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">100% Uninterrupted Power</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every major deployment is accompanied by synchronized Cummins silent diesel generators with automatic failover switches.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div 
              className={`p-6 rounded-3xl border ${t.cardBg} ${t.cardBorder} shadow-xl space-y-3 h-full hover:-translate-y-1 transition-transform duration-300`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Direct Rigging & On-Site Engineers</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Experienced stage managers and sound engineers stay on-site throughout your ceremony to ensure pristine live execution.
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Inventory Fleet */}
        <ScrollReveal className={`rounded-3xl p-6 sm:p-8 border border-amber-500/20 bg-gradient-to-br from-[#0B1322] via-[#0E182A] to-[#070D18] text-white shadow-2xl space-y-6`} yOffset={35}>
          <div className="space-y-1">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">Equipment Fleet</span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight font-['Outfit']">
              Certified Inventory &amp; Rigging Arsenal
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {INVENTORY_ITEMS.map((item) => (
              <div
                key={item.id}
                className="p-3 sm:p-3.5 rounded-2xl bg-[#060B14] border border-white/10 space-y-1 sm:space-y-1.5 hover:border-amber-400/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] sm:text-xs gap-1 mb-1">
                    <span className="font-bold text-amber-300 uppercase truncate text-[10px] sm:text-xs">{item.category}</span>
                    <span className="text-[9px] sm:text-[10px] bg-white/10 text-white px-1.5 sm:px-2 py-0.5 rounded-full font-mono shrink-0">
                      {item.totalQuantity}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-white line-clamp-1">{item.name}</h4>
                  <p className="text-[10px] text-slate-300 line-clamp-2 mt-0.5">{item.specs}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full liability insurance &amp; structural certifications included.</span>
            </div>

            <button
              onClick={() => openBookingModal()}
              className="py-2.5 px-6 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
            >
              <span>Book Venue Inspection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>

      </div>

    </div>
  );
};
