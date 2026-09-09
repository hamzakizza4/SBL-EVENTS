import React from 'react';
import { motion } from 'motion/react';
import { 
  Crown, 
  Sparkles, 
  ArrowRight, 
  Phone, 
  Mail,
  MessageCircle, 
  Film, 
  ExternalLink,
  MapPin,
  CheckCircle2,
  Calendar,
  Globe
} from 'lucide-react';
import { COMPANY_CONTACT_INFO } from '../data/mockData';

export interface HeroCtaProps {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  isExternal?: boolean;
  variant?: 'primary' | 'secondary' | 'tiktok' | 'whatsapp';
  id?: string;
}

export interface GeometricHeroBannerProps {
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  primaryHeading: string;
  accentHeading?: string;
  description: string | React.ReactNode;
  primaryCta?: HeroCtaProps;
  secondaryCta?: HeroCtaProps;
  tertiaryCta?: HeroCtaProps;
  mainImage: string;
  secondaryImage?: string;
  tertiaryImage?: string;
  bgPatternImage?: string;
  showSocials?: boolean;
  bottomWebsite?: string;
  bottomPhone?: string;
  customSlot?: React.ReactNode;
  themeVariant?: 'navy' | 'emerald' | 'gold' | 'royal' | 'blue' | 'indigo' | 'magenta' | 'rose' | 'amber' | 'slate';
  tagline?: string;
  stats?: { label: string; value: string }[];
  fullBleed?: boolean;
}

export const GeometricHeroBanner: React.FC<GeometricHeroBannerProps> = ({
  badgeText = 'We Design Your Dream',
  badgeIcon,
  primaryHeading,
  accentHeading,
  description,
  primaryCta,
  secondaryCta,
  tertiaryCta,
  mainImage,
  secondaryImage,
  tertiaryImage,
  bgPatternImage,
  showSocials = true,
  bottomWebsite = 'www.sbleventsuganda.com',
  bottomPhone = '+256 752 420 911',
  customSlot,
  themeVariant = 'navy',
  tagline = 'Masaka • Lwengo • Serving All Uganda',
  stats,
  fullBleed = true,
}) => {
  // Uniform Luxury Theme color accents (Midnight Obsidian & Radiant Amber Gold)
  const themeAccents: Record<string, {
    accentColor: string;
    accentBg: string;
    accentBorder: string;
    pillBg: string;
    gradientSplit: string;
    glowColor: string;
  }> = {
    navy: {
      accentColor: 'text-amber-400',
      accentBg: 'bg-amber-400',
      accentBorder: 'border-amber-400/30',
      pillBg: 'from-amber-400/20 to-amber-500/10',
      gradientSplit: 'from-[#050811] via-[#091222] to-[#121E38]',
      glowColor: 'bg-amber-500/15',
    },
    blue: {
      accentColor: 'text-amber-300',
      accentBg: 'bg-amber-400',
      accentBorder: 'border-amber-400/30',
      pillBg: 'from-amber-400/20 to-amber-500/10',
      gradientSplit: 'from-[#050811] via-[#081326] to-[#0E2040]',
      glowColor: 'bg-amber-500/20',
    },
    indigo: {
      accentColor: 'text-amber-300',
      accentBg: 'bg-amber-400',
      accentBorder: 'border-amber-400/30',
      pillBg: 'from-amber-400/20 to-amber-500/10',
      gradientSplit: 'from-[#050811] via-[#0A1328] to-[#122042]',
      glowColor: 'bg-amber-500/20',
    },
    magenta: {
      accentColor: 'text-amber-300',
      accentBg: 'bg-rose-500',
      accentBorder: 'border-rose-400/30',
      pillBg: 'from-amber-400/20 to-rose-500/10',
      gradientSplit: 'from-[#050811] via-[#1A0A16] to-[#2E1228]',
      glowColor: 'bg-rose-500/20',
    },
    emerald: {
      accentColor: 'text-amber-300',
      accentBg: 'bg-emerald-400',
      accentBorder: 'border-emerald-400/30',
      pillBg: 'from-emerald-400/20 to-amber-500/10',
      gradientSplit: 'from-[#050811] via-[#071916] to-[#0D2E28]',
      glowColor: 'bg-emerald-500/15',
    },
    gold: {
      accentColor: 'text-amber-300',
      accentBg: 'bg-amber-400',
      accentBorder: 'border-amber-400/40',
      pillBg: 'from-amber-400/25 to-yellow-500/10',
      gradientSplit: 'from-[#050811] via-[#140F06] to-[#261C0B]',
      glowColor: 'bg-amber-500/25',
    },
    royal: {
      accentColor: 'text-amber-300',
      accentBg: 'bg-amber-400',
      accentBorder: 'border-amber-400/30',
      pillBg: 'from-amber-400/20 to-amber-500/10',
      gradientSplit: 'from-[#050811] via-[#091224] to-[#132242]',
      glowColor: 'bg-amber-500/20',
    },
    rose: {
      accentColor: 'text-amber-300',
      accentBg: 'bg-rose-400',
      accentBorder: 'border-rose-400/30',
      pillBg: 'from-rose-400/20 to-amber-500/10',
      gradientSplit: 'from-[#050811] via-[#1C0913] to-[#331123]',
      glowColor: 'bg-rose-500/15',
    },
    amber: {
      accentColor: 'text-amber-400',
      accentBg: 'bg-amber-500',
      accentBorder: 'border-amber-400/30',
      pillBg: 'from-amber-400/20 to-orange-500/10',
      gradientSplit: 'from-[#050811] via-[#190F05] to-[#301E0A]',
      glowColor: 'bg-amber-500/25',
    },
    slate: {
      accentColor: 'text-amber-300',
      accentBg: 'bg-amber-400',
      accentBorder: 'border-slate-400/30',
      pillBg: 'from-slate-400/20 to-amber-500/10',
      gradientSplit: 'from-[#050811] via-[#0C1220] to-[#162035]',
      glowColor: 'bg-amber-500/15',
    }
  };

  const currentTheme = themeAccents[themeVariant] || themeAccents.navy;

  const renderCtaButton = (cta?: HeroCtaProps) => {
    if (!cta) return null;

    const commonClasses = "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 shadow-xl cursor-pointer select-none";

    let variantClasses = "bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-500/25";
    if (cta.variant === 'secondary') {
      variantClasses = "bg-white/10 text-white hover:bg-white/20 border border-white/25 backdrop-blur-md";
    } else if (cta.variant === 'tiktok') {
      variantClasses = "bg-gradient-to-r from-pink-600 via-rose-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white shadow-rose-900/30 font-bold";
    } else if (cta.variant === 'whatsapp') {
      variantClasses = "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40 font-bold";
    }

    if (cta.href) {
      return (
        <motion.a
          key={cta.label}
          id={cta.id}
          href={cta.href}
          target={cta.isExternal ? '_blank' : undefined}
          rel={cta.isExternal ? 'noopener noreferrer' : undefined}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className={`${commonClasses} ${variantClasses}`}
        >
          {cta.icon}
          <span>{cta.label}</span>
          {cta.isExternal && <ExternalLink className="w-3.5 h-3.5 opacity-75" />}
        </motion.a>
      );
    }

    return (
      <motion.button
        key={cta.label}
        id={cta.id}
        type="button"
        onClick={cta.onClick}
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={`${commonClasses} ${variantClasses}`}
      >
        {cta.icon}
        <span>{cta.label}</span>
      </motion.button>
    );
  };

  return (
    <div className={`relative w-full overflow-hidden border-y border-white/15 bg-gradient-to-br ${currentTheme.gradientSplit} text-white shadow-2xl ${fullBleed ? '' : 'rounded-3xl border'}`}>
      
      {/* 1. VISIBLE HIGH-DEF BACKGROUND IMAGE WITH DYNAMIC DIRECTIONAL GRADIENT */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Background Image Layer (High Visibility, not muted) */}
        <img
          src={bgPatternImage || mainImage}
          alt="SBL Event Background"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.12] scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Ambient Glow Orbs */}
        <div className={`absolute -top-24 -left-24 w-96 h-96 rounded-full ${currentTheme.glowColor} filter blur-3xl`} />
        <div className={`absolute -bottom-24 right-1/4 w-[500px] h-[500px] rounded-full ${currentTheme.glowColor} filter blur-3xl`} />

        {/* Diagonal Graphic Split Overlay (Left dark mask for crisp typography, right clear for image reveal) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071324]/95 via-[#071324]/85 sm:via-[#071324]/75 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071324]/90 via-transparent to-[#071324]/60 z-10" />
        
        {/* Subtle Geometric Graphic Lines inspired by reference PSD banner */}
        <svg className="absolute inset-0 w-full h-full z-10 opacity-25" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="100%" x2="100%" y2="0" stroke="white" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="20%" y1="100%" x2="100%" y2="20%" stroke="rgba(251, 191, 36, 0.4)" strokeWidth="1.5" />
          <circle cx="85%" cy="20%" r="140" stroke="white" strokeWidth="1" fill="none" opacity="0.15" />
          <circle cx="85%" cy="20%" r="220" stroke="rgba(251, 191, 36, 0.3)" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* 2. MAIN BANNER CONTENT CONTAINER (EDGE-TO-EDGE BORDER ALIGNMENT) */}
      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-20 sm:pt-24 pb-10 sm:pb-14 md:pb-16">
        
        {/* Top Header Bar inside Banner: Logo/Badge & Social Icons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
          
          {/* Brand Badge / Motto */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-400/20">
              {badgeIcon || <Crown className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block">
                SBL EVENTS UGANDA
              </span>
              <span className="text-xs font-bold text-slate-200">
                {badgeText}
              </span>
            </div>
          </motion.div>

          {/* Social / Direct Connect Badges (Like reference image top right) */}
          {showSocials && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <a
                href={COMPANY_CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-400/30 flex items-center justify-center transition-all duration-200"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-pink-500/20 hover:bg-pink-600 text-pink-300 hover:text-white border border-pink-400/30 flex items-center justify-center transition-all duration-200"
                title="Watch TikTok Reels"
              >
                <Film className="w-3.5 h-3.5" />
              </a>

              <a
                href={`mailto:${COMPANY_CONTACT_INFO.email}?subject=SBL%20Events%20Inquiry`}
                className="w-8 h-8 rounded-full bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-400/30 flex items-center justify-center transition-all duration-200"
                title={`Official Inquiries: ${COMPANY_CONTACT_INFO.email}`}
              >
                <Mail className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${COMPANY_CONTACT_INFO.primaryPhone}`}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-all duration-200"
                title="Direct Phone Call"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-slate-300">
                <MapPin className="w-3 h-3 text-amber-300" />
                <span>{tagline}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Content Body: Grid split (Left Text & CTAs, Right Dynamic Pill Graphic Cutouts) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Tagline pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-black text-amber-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="uppercase tracking-wider">{badgeText}</span>
            </motion.div>

            {/* Bold Two-Tone Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="space-y-1"
            >
              {accentHeading && (
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-amber-400 font-['Outfit'] tracking-tight uppercase leading-none">
                  {accentHeading}
                </h2>
              )}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-['Outfit'] tracking-tight leading-[1.08] drop-shadow-lg">
                {primaryHeading}
              </h1>
            </motion.div>

            {/* Description Subtext */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="text-xs sm:text-sm md:text-base text-slate-200 max-w-2xl leading-relaxed font-normal"
            >
              {description}
            </motion.div>

            {/* Custom Slot (e.g. Date Validator or Mode Switcher or Quick Form) */}
            {customSlot && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="pt-1"
              >
                {customSlot}
              </motion.div>
            )}

            {/* Action Buttons Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              {renderCtaButton(primaryCta)}
              {renderCtaButton(secondaryCta)}
              {renderCtaButton(tertiaryCta)}
            </motion.div>

            {/* Stats Row (if provided) */}
            {stats && stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-3 gap-4 pt-6 border-t border-white/15 max-w-lg"
              >
                {stats.map((stat, i) => (
                  <div key={i}>
                    <span className="text-xl sm:text-2xl font-black text-white font-['Outfit'] block">
                      {stat.value}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-300 font-medium">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right Column: GEOMETRIC SLANTED PILL PHOTO CUTOUTS (Inspired directly by the reference image) */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[320px] sm:min-h-[400px]">
            
            {/* Background Graphic Accent Slant Box */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-white/5 to-transparent rounded-3xl -rotate-2 scale-95 border border-white/10 backdrop-blur-xs pointer-events-none" />
            
            {/* Multi-Pill Geometric Slanted Windows */}
            <div className="relative w-full h-full flex items-center justify-center gap-3.5 sm:gap-5 py-4">
              
              {/* Pill Cutout 1 (Left slanted tall pill) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 30, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotate: -12 }}
                whileHover={{ scale: 1.05, rotate: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.2 }}
                className="relative w-28 sm:w-36 md:w-44 h-64 sm:h-80 md:h-96 rounded-full overflow-hidden border-2 border-white/40 shadow-2xl bg-[#091526] shrink-0"
              >
                <img
                  src={mainImage}
                  alt={typeof primaryHeading === 'string' ? primaryHeading : 'SBL Rigging Event'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter brightness-95 contrast-110 transform rotate-12 scale-125 hover:scale-135 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                <div className="absolute bottom-4 left-0 right-0 text-center px-2 pointer-events-none">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 drop-shadow-md">
                    SBL RIGGING
                  </span>
                </div>
              </motion.div>

              {/* Pill Cutout 2 (Center/Right staggered slanted pill) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: -30, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotate: -12 }}
                whileHover={{ scale: 1.05, rotate: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.3 }}
                className="relative w-28 sm:w-36 md:w-44 h-64 sm:h-80 md:h-96 rounded-full overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-[#091526] shrink-0 -mt-8 sm:-mt-12"
              >
                <img
                  src={secondaryImage || bgPatternImage || mainImage}
                  alt="SBL Production Feature"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter brightness-95 contrast-110 transform rotate-12 scale-125 hover:scale-135 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                <div className="absolute bottom-4 left-0 right-0 text-center px-2 pointer-events-none">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-white drop-shadow-md">
                    VERIFIED GEAR
                  </span>
                </div>
              </motion.div>

              {/* Optional Pill Cutout 3 (Small accent pill) */}
              {tertiaryImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20, rotate: -12 }}
                  animate={{ opacity: 1, scale: 1, x: 0, rotate: -12 }}
                  whileHover={{ scale: 1.05, rotate: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.4 }}
                  className="hidden sm:block relative w-24 md:w-28 h-48 md:h-60 rounded-full overflow-hidden border-2 border-white/30 shadow-xl bg-[#091526] shrink-0 mt-12"
                >
                  <img
                    src={tertiaryImage}
                    alt="SBL Lighting & Stage"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center filter brightness-95 contrast-110 transform rotate-12 scale-125"
                  />
                </motion.div>
              )}
            </div>

            {/* Geometric Accent Circle Pin */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-3 -right-3 w-16 h-16 rounded-full border border-dashed border-amber-400/40 pointer-events-none flex items-center justify-center"
            >
              <div className="w-2 h-2 rounded-full bg-amber-400" />
            </motion.div>
          </div>
        </div>

        {/* 3. BOTTOM BANNER FOOTER STRIP (Like the www.graphicsfamily.com footer in reference) */}
        <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-white font-bold">{bottomWebsite}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Direct Rigging & Dispatch
            </span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-200">
              Hotline: <strong className="text-amber-300 font-mono">{bottomPhone}</strong>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
