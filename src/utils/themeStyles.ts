import { ThemeMode } from '../types';

export interface ThemeClasses {
  // Main Canvas
  canvasBg: string;
  canvasText: string;
  
  // Navbar
  navBgScrolled: string;
  navBgTop: string;
  navBorder: string;
  navPillBg: string;
  navPillBorder: string;
  navLinkDefault: string;
  navLinkHover: string;
  navLinkActive: string;
  
  // Cards & Surfaces
  cardBg: string;
  cardBorder: string;
  cardHoverBorder: string;
  cardShadow: string;
  cardSubtleBg: string;
  
  // Typography
  headingText: string;
  subheadingText: string;
  bodyText: string;
  mutedText: string;
  accentText: string;
  
  // Buttons
  primaryBtn: string;
  secondaryBtn: string;
  outlineBtn: string;
  
  // Badges & Accents
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  
  // Inputs & Controls
  inputBg: string;
  inputBorder: string;
  inputText: string;
  
  // Highlights
  accentColor: string;
  accentGlow: string;
}

export const getThemeClasses = (theme: ThemeMode): ThemeClasses => {
  switch (theme) {
    case 'deep-navy-blue':
      return {
        canvasBg: 'bg-[#081225]',
        canvasText: 'text-white',
        
        navBgScrolled: 'bg-[#081225]/95 backdrop-blur-md shadow-xl shadow-black/40',
        navBgTop: 'bg-gradient-to-b from-[#081225]/95 via-[#081225]/80 to-transparent',
        navBorder: 'border-white/15',
        navPillBg: 'bg-[#0D1E3A]/90',
        navPillBorder: 'border-white/20',
        navLinkDefault: 'text-slate-200',
        navLinkHover: 'hover:text-white hover:bg-white/10',
        navLinkActive: 'bg-white text-[#081225] font-bold shadow-lg shadow-white/20',
        
        cardBg: 'bg-[#0D1E3A]',
        cardBorder: 'border-white/15',
        cardHoverBorder: 'hover:border-white/40',
        cardShadow: 'shadow-xl shadow-black/40',
        cardSubtleBg: 'bg-[#0A1830]',
        
        headingText: 'text-white',
        subheadingText: 'text-slate-100',
        bodyText: 'text-slate-200',
        mutedText: 'text-slate-400',
        accentText: 'text-blue-300',
        
        primaryBtn: 'bg-white hover:bg-slate-100 text-[#081225] font-extrabold shadow-lg shadow-white/20 hover:scale-[1.02] active:scale-[0.98]',
        secondaryBtn: 'bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/30',
        outlineBtn: 'bg-transparent hover:bg-white/10 text-white border border-white/30',
        
        badgeBg: 'bg-white/10',
        badgeText: 'text-white',
        badgeBorder: 'border-white/20',
        
        inputBg: 'bg-[#0A1830]',
        inputBorder: 'border-white/20 focus:border-white',
        inputText: 'text-white',
        
        accentColor: '#3B82F6',
        accentGlow: 'rgba(59, 130, 246, 0.25)',
      };

    case 'slate-dark-blue':
      return {
        canvasBg: 'bg-[#0F172A]',
        canvasText: 'text-white',
        
        navBgScrolled: 'bg-[#0F172A]/95 backdrop-blur-md shadow-xl shadow-black/40',
        navBgTop: 'bg-gradient-to-b from-[#0F172A]/95 via-[#0F172A]/80 to-transparent',
        navBorder: 'border-slate-700/80',
        navPillBg: 'bg-slate-800/90',
        navPillBorder: 'border-slate-700',
        navLinkDefault: 'text-slate-200',
        navLinkHover: 'hover:text-white hover:bg-slate-700/80',
        navLinkActive: 'bg-white text-slate-950 font-bold shadow-lg shadow-white/20',
        
        cardBg: 'bg-[#1E293B]',
        cardBorder: 'border-slate-700/80',
        cardHoverBorder: 'hover:border-blue-400/50',
        cardShadow: 'shadow-xl shadow-black/30',
        cardSubtleBg: 'bg-slate-900',
        
        headingText: 'text-white',
        subheadingText: 'text-slate-100',
        bodyText: 'text-slate-200',
        mutedText: 'text-slate-400',
        accentText: 'text-blue-300',
        
        primaryBtn: 'bg-white hover:bg-slate-100 text-slate-950 font-extrabold shadow-lg shadow-white/20 hover:scale-[1.02] active:scale-[0.98]',
        secondaryBtn: 'bg-slate-800 hover:bg-slate-700 text-white font-semibold border border-slate-600',
        outlineBtn: 'bg-transparent hover:bg-slate-800 text-slate-100 border border-slate-600',
        
        badgeBg: 'bg-blue-500/20',
        badgeText: 'text-blue-200',
        badgeBorder: 'border-blue-400/30',
        
        inputBg: 'bg-slate-900',
        inputBorder: 'border-slate-700 focus:border-white',
        inputText: 'text-white',
        
        accentColor: '#60A5FA',
        accentGlow: 'rgba(96, 165, 250, 0.25)',
      };

    case 'medium-dark-blue':
    default:
      // Primary Medium Dark Blue and Pure White
      return {
        canvasBg: 'bg-[#0F1F38]',
        canvasText: 'text-white',
        
        navBgScrolled: 'bg-[#0F1F38]/95 backdrop-blur-md shadow-xl shadow-[#081225]/60',
        navBgTop: 'bg-gradient-to-b from-[#0F1F38]/95 via-[#0F1F38]/80 to-transparent',
        navBorder: 'border-white/15',
        navPillBg: 'bg-[#152A4A]/90',
        navPillBorder: 'border-white/20',
        navLinkDefault: 'text-slate-200',
        navLinkHover: 'hover:text-white hover:bg-white/10',
        navLinkActive: 'bg-white text-[#0F1F38] font-bold shadow-lg shadow-white/20',
        
        cardBg: 'bg-[#152A4A]',
        cardBorder: 'border-white/15',
        cardHoverBorder: 'hover:border-white/40',
        cardShadow: 'shadow-xl shadow-[#081225]/40',
        cardSubtleBg: 'bg-[#10223D]',
        
        headingText: 'text-white',
        subheadingText: 'text-slate-100',
        bodyText: 'text-slate-200',
        mutedText: 'text-slate-300',
        accentText: 'text-blue-200',
        
        primaryBtn: 'bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold shadow-lg shadow-black/25 hover:scale-[1.02] active:scale-[0.98]',
        secondaryBtn: 'bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/30 backdrop-blur-xs',
        outlineBtn: 'bg-transparent hover:bg-white/10 text-white border border-white/30',
        
        badgeBg: 'bg-white/10',
        badgeText: 'text-white',
        badgeBorder: 'border-white/20',
        
        inputBg: 'bg-[#0E1D35]',
        inputBorder: 'border-white/20 focus:border-white',
        inputText: 'text-white',
        
        accentColor: '#38BDF8',
        accentGlow: 'rgba(56, 189, 248, 0.25)',
      };
  }
};
