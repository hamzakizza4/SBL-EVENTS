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
    case 'royal-emerald-gold':
      // Majestic Royal Emerald Velvet & Imperial Champagne Gold (Ultra-Attractive New Main Theme)
      return {
        canvasBg: 'bg-[#02130E]',
        canvasText: 'text-emerald-50',
        
        navBgScrolled: 'bg-[#02130E]/95 backdrop-blur-md shadow-2xl shadow-black/80',
        navBgTop: 'bg-gradient-to-b from-[#02130E]/95 via-[#02130E]/80 to-transparent',
        navBorder: 'border-emerald-500/20',
        navPillBg: 'bg-[#052017]/90',
        navPillBorder: 'border-emerald-400/30',
        navLinkDefault: 'text-emerald-100',
        navLinkHover: 'hover:text-amber-300 hover:bg-emerald-500/15',
        navLinkActive: 'bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 text-slate-950 font-black shadow-lg shadow-emerald-500/30',
        
        cardBg: 'bg-[#06241A]',
        cardBorder: 'border-emerald-500/20',
        cardHoverBorder: 'hover:border-amber-400/60',
        cardShadow: 'shadow-2xl shadow-[#010B07]/80',
        cardSubtleBg: 'bg-[#031A13]',
        
        headingText: 'text-white',
        subheadingText: 'text-emerald-100',
        bodyText: 'text-emerald-50',
        mutedText: 'text-emerald-300/70',
        accentText: 'text-amber-400',
        
        primaryBtn: 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black shadow-xl shadow-amber-400/30 hover:scale-[1.02] active:scale-[0.98]',
        secondaryBtn: 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-100 font-semibold border border-emerald-400/30 backdrop-blur-xs',
        outlineBtn: 'bg-transparent hover:bg-emerald-500/15 text-emerald-300 border border-emerald-400/40',
        
        badgeBg: 'bg-emerald-500/20',
        badgeText: 'text-emerald-300',
        badgeBorder: 'border-emerald-400/40',
        
        inputBg: 'bg-[#031A13]',
        inputBorder: 'border-emerald-500/30 focus:border-amber-400',
        inputText: 'text-emerald-50',
        
        accentColor: '#10B981',
        accentGlow: 'rgba(16, 185, 129, 0.35)',
      };

    case 'amethyst-rosegold':
      // Imperial Amethyst Velvet & Radiant Rose Gold
      return {
        canvasBg: 'bg-[#0B0414]',
        canvasText: 'text-pink-50',
        
        navBgScrolled: 'bg-[#0B0414]/95 backdrop-blur-md shadow-2xl shadow-black/80',
        navBgTop: 'bg-gradient-to-b from-[#0B0414]/95 via-[#0B0414]/80 to-transparent',
        navBorder: 'border-purple-500/20',
        navPillBg: 'bg-[#150926]/90',
        navPillBorder: 'border-pink-500/30',
        navLinkDefault: 'text-purple-200',
        navLinkHover: 'hover:text-pink-300 hover:bg-purple-500/15',
        navLinkActive: 'bg-gradient-to-r from-purple-500 via-pink-400 to-rose-400 text-slate-950 font-black shadow-lg shadow-pink-500/30',
        
        cardBg: 'bg-[#170B2B]',
        cardBorder: 'border-purple-500/20',
        cardHoverBorder: 'hover:border-pink-400/60',
        cardShadow: 'shadow-2xl shadow-[#06020A]/80',
        cardSubtleBg: 'bg-[#0F061D]',
        
        headingText: 'text-white',
        subheadingText: 'text-pink-100',
        bodyText: 'text-pink-50',
        mutedText: 'text-purple-300/70',
        accentText: 'text-pink-400',
        
        primaryBtn: 'bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 hover:from-pink-400 hover:to-amber-200 text-slate-950 font-black shadow-xl shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98]',
        secondaryBtn: 'bg-purple-950/60 hover:bg-purple-900/80 text-purple-100 font-semibold border border-purple-400/30 backdrop-blur-xs',
        outlineBtn: 'bg-transparent hover:bg-purple-500/15 text-pink-300 border border-pink-400/40',
        
        badgeBg: 'bg-pink-500/20',
        badgeText: 'text-pink-300',
        badgeBorder: 'border-pink-400/40',
        
        inputBg: 'bg-[#0F061D]',
        inputBorder: 'border-purple-500/30 focus:border-pink-400',
        inputText: 'text-pink-50',
        
        accentColor: '#EC4899',
        accentGlow: 'rgba(236, 72, 153, 0.35)',
      };

    case 'crimson-obsidian':
      // Signature Regal Crimson & Obsidian Noir
      return {
        canvasBg: 'bg-[#050811]',
        canvasText: 'text-white',
        
        navBgScrolled: 'bg-[#050811]/95 backdrop-blur-md shadow-2xl shadow-black/80',
        navBgTop: 'bg-gradient-to-b from-[#050811]/95 via-[#050811]/80 to-transparent',
        navBorder: 'border-red-500/20',
        navPillBg: 'bg-[#0B1322]/90',
        navPillBorder: 'border-red-500/30',
        navLinkDefault: 'text-slate-200',
        navLinkHover: 'hover:text-red-400 hover:bg-red-500/10',
        navLinkActive: 'bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 text-slate-950 font-black shadow-lg shadow-red-500/30',
        
        cardBg: 'bg-[#0B1322]',
        cardBorder: 'border-red-500/15',
        cardHoverBorder: 'hover:border-red-500/50',
        cardShadow: 'shadow-2xl shadow-black/70',
        cardSubtleBg: 'bg-[#070D18]',
        
        headingText: 'text-white',
        subheadingText: 'text-slate-100',
        bodyText: 'text-slate-200',
        mutedText: 'text-slate-400',
        accentText: 'text-amber-400',
        
        primaryBtn: 'bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 hover:from-red-500 hover:to-yellow-400 text-slate-950 font-black shadow-xl shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98]',
        secondaryBtn: 'bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 backdrop-blur-xs',
        outlineBtn: 'bg-transparent hover:bg-red-500/10 text-red-300 border border-red-500/30',
        
        badgeBg: 'bg-red-500/15',
        badgeText: 'text-red-300',
        badgeBorder: 'border-red-500/30',
        
        inputBg: 'bg-[#080E1B]',
        inputBorder: 'border-white/15 focus:border-red-400',
        inputText: 'text-white',
        
        accentColor: '#DC2626',
        accentGlow: 'rgba(220, 38, 38, 0.35)',
      };

    case 'deep-navy-blue':
      // Deep Midnight Navy & Pure White
      return {
        canvasBg: 'bg-[#030914]',
        canvasText: 'text-white',
        
        navBgScrolled: 'bg-[#030914]/95 backdrop-blur-md shadow-2xl shadow-blue-950/60',
        navBgTop: 'bg-gradient-to-b from-[#030914]/95 via-[#030914]/80 to-transparent',
        navBorder: 'border-blue-500/20',
        navPillBg: 'bg-[#081224]/90',
        navPillBorder: 'border-blue-400/30',
        navLinkDefault: 'text-blue-100',
        navLinkHover: 'hover:text-white hover:bg-blue-600/20',
        navLinkActive: 'bg-blue-600 text-white font-black shadow-lg shadow-blue-600/30',
        
        cardBg: 'bg-[#071326]',
        cardBorder: 'border-blue-500/20',
        cardHoverBorder: 'hover:border-blue-400/60',
        cardShadow: 'shadow-2xl shadow-black/80',
        cardSubtleBg: 'bg-[#050D1C]',
        
        headingText: 'text-white',
        subheadingText: 'text-blue-100',
        bodyText: 'text-blue-50',
        mutedText: 'text-blue-200/70',
        accentText: 'text-blue-400',
        
        primaryBtn: 'bg-blue-600 hover:bg-blue-500 text-white font-black shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98]',
        secondaryBtn: 'bg-blue-950/70 hover:bg-blue-900/80 text-white font-semibold border border-blue-400/30 backdrop-blur-xs',
        outlineBtn: 'bg-transparent hover:bg-blue-600/15 text-blue-200 border border-blue-400/40',
        
        badgeBg: 'bg-blue-500/20',
        badgeText: 'text-blue-300',
        badgeBorder: 'border-blue-400/35',
        
        inputBg: 'bg-[#050D1C]',
        inputBorder: 'border-blue-500/30 focus:border-blue-400',
        inputText: 'text-white',
        
        accentColor: '#2563EB',
        accentGlow: 'rgba(37, 99, 235, 0.35)',
      };

    case 'white-brown-light':
      // Luminous Crisp White Canvas with Deep Royal Blue & Slate Accents
      return {
        canvasBg: 'bg-[#F4F7FC]',
        canvasText: 'text-slate-900',
        
        navBgScrolled: 'bg-[#F4F7FC]/95 backdrop-blur-md shadow-lg shadow-blue-950/5',
        navBgTop: 'bg-gradient-to-b from-[#F4F7FC]/95 via-[#F4F7FC]/85 to-transparent',
        navBorder: 'border-blue-200/60',
        navPillBg: 'bg-white/95',
        navPillBorder: 'border-blue-200',
        navLinkDefault: 'text-slate-700',
        navLinkHover: 'hover:text-blue-600 hover:bg-blue-50',
        navLinkActive: 'bg-blue-600 text-white font-black shadow-md shadow-blue-600/20',
        
        cardBg: 'bg-white',
        cardBorder: 'border-blue-100',
        cardHoverBorder: 'hover:border-blue-400',
        cardShadow: 'shadow-xl shadow-blue-900/5',
        cardSubtleBg: 'bg-[#EDF2F9]',
        
        headingText: 'text-slate-900',
        subheadingText: 'text-blue-950',
        bodyText: 'text-slate-700',
        mutedText: 'text-slate-500',
        accentText: 'text-blue-600',
        
        primaryBtn: 'bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98]',
        secondaryBtn: 'bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold border border-blue-200',
        outlineBtn: 'bg-transparent hover:bg-blue-50 text-blue-700 border border-blue-300',
        
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-200',
        
        inputBg: 'bg-white',
        inputBorder: 'border-slate-300 focus:border-blue-600',
        inputText: 'text-slate-900',
        
        accentColor: '#2563EB',
        accentGlow: 'rgba(37, 99, 235, 0.25)',
      };

    case 'medium-dark-blue':
    case 'white-brown':
    default:
      // Original Signature SBL Events: Royal Sapphire Blue & Crisp White
      return {
        canvasBg: 'bg-[#060E1E]',
        canvasText: 'text-white',
        
        navBgScrolled: 'bg-[#060E1E]/95 backdrop-blur-md shadow-2xl shadow-blue-950/60',
        navBgTop: 'bg-gradient-to-b from-[#060E1E]/95 via-[#060E1E]/80 to-transparent',
        navBorder: 'border-blue-500/20',
        navPillBg: 'bg-[#0C1B36]/90',
        navPillBorder: 'border-blue-400/30',
        navLinkDefault: 'text-blue-100',
        navLinkHover: 'hover:text-white hover:bg-blue-600/20',
        navLinkActive: 'bg-blue-600 text-white font-black shadow-lg shadow-blue-600/35',
        
        cardBg: 'bg-[#0B1A34]',
        cardBorder: 'border-blue-500/20',
        cardHoverBorder: 'hover:border-blue-400/60',
        cardShadow: 'shadow-2xl shadow-[#020713]/80',
        cardSubtleBg: 'bg-[#08152B]',
        
        headingText: 'text-white',
        subheadingText: 'text-blue-100',
        bodyText: 'text-blue-50/95',
        mutedText: 'text-blue-200/70',
        accentText: 'text-blue-400',
        
        primaryBtn: 'bg-blue-600 hover:bg-blue-500 text-white font-black shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98]',
        secondaryBtn: 'bg-blue-950/70 hover:bg-blue-900/80 text-white font-semibold border border-blue-400/30 backdrop-blur-xs',
        outlineBtn: 'bg-transparent hover:bg-blue-600/15 text-blue-200 border border-blue-400/40',
        
        badgeBg: 'bg-blue-500/20',
        badgeText: 'text-blue-300',
        badgeBorder: 'border-blue-400/35',
        
        inputBg: 'bg-[#08152B]',
        inputBorder: 'border-blue-500/30 focus:border-blue-400',
        inputText: 'text-white',
        
        accentColor: '#2563EB',
        accentGlow: 'rgba(37, 99, 235, 0.35)',
      };
  }
};
