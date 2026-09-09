import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { COMPANY_CONTACT_INFO } from '../data/mockData';
import kwanjulaRoyalStageImg from '../assets/images/kwanjula_royal_stage_1787463864885.jpg';
import sblMegaTentImg from '../assets/images/sbl_mega_tent_1787463878262.jpg';
import sblLedScreenImg from '../assets/images/sbl_led_screen_1787463891580.jpg';
import sblBridalDecorImg from '../assets/images/sbl_bridal_decor_1787463904784.jpg';
import sblWeddingSplashImg from '../assets/images/sbl_wedding_splash_1788000507920.jpg';
import sblStageBlueTrussImg from '../assets/images/sbl_stage_blue_truss_1788001016044.jpg';
import { 
  Sparkles, 
  Crown, 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  Code, 
  Activity, 
  Tv, 
  Tent, 
  Volume2, 
  Layers, 
  CheckCircle2, 
  Zap, 
  Calendar, 
  Users, 
  ShieldCheck, 
  ExternalLink,
  Sliders,
  ChevronRight,
  Maximize2
} from 'lucide-react';

export const IsometricHeroShowcase: React.FC = () => {
  const { openBookingModal, setCurrentPage, openSearch, theme } = useApp();
  const [activeLayer, setActiveLayer] = useState<'all' | 'tents' | 'sound' | 'screens' | 'pricing'>('all');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Mouse parallax tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <section 
      id="isometric-hero-showcase"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      className="relative w-full overflow-hidden bg-[#030712] text-white pt-20 sm:pt-24 pb-16 sm:pb-20 md:pb-24 border-b border-cyan-500/20"
    >
      {/* 1. CYBERPUNK / TECH ISOMETRIC BLUEPRINT GRID FLOOR */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Deep ambient radial glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-600/15 filter blur-[120px]" />
        <div className="absolute bottom-10 right-1/4 w-[650px] h-[650px] rounded-full bg-purple-600/20 filter blur-[140px]" />
        <div className="absolute top-10 right-10 w-[400px] h-[400px] rounded-full bg-pink-600/10 filter blur-[100px]" />

        {/* 3D Perspective Isometric Circuit Grid Lines */}
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(6, 182, 212, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(168, 85, 247, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            transform: 'perspective(1000px) rotateX(60deg) scale(2.2)',
            transformOrigin: '50% 65%',
          }}
        />

        {/* Glowing Circuit Lines SVG overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 300 L 250 300 L 350 400 L 700 400" stroke="#06B6D4" strokeWidth="1.5" fill="none" strokeDasharray="6 6" />
          <path d="M 300 0 L 300 200 L 450 350 L 900 350" stroke="#A855F7" strokeWidth="1.5" fill="none" />
          <path d="M 800 600 L 950 450 L 1200 450" stroke="#EC4899" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
          <circle cx="350" cy="400" r="4" fill="#06B6D4" />
          <circle cx="450" cy="350" r="4" fill="#A855F7" />
          <circle cx="950" cy="450" r="4" fill="#EC4899" />
        </svg>

        {/* Top/Bottom Fade masks */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/80" />
      </div>

      {/* 2. MAIN CONTAINER (Split into Left 3D Isometric Screen Cascade & Right Bold Typography) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Mini Bar: Status Indicator */}
        <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[11px] font-mono font-bold text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>SYSTEM: LIVE RIGGING FLEET READY</span>
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-400">
              Masaka • Lwengo • Serving All Uganda
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 hidden md:inline">Inquiries:</span>
            <a 
              href="mailto:najibshafiq@sblevents.com" 
              className="text-xs font-mono font-bold text-amber-300 hover:text-amber-200 underline"
            >
              najibshafiq@sblevents.com
            </a>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT 7 COLS: 3D ISOMETRIC LAPTOP WITH CASCADING NEON UI CARDS */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[480px] sm:min-h-[560px] py-4">
            
            {/* Parallax Wrapper Container */}
            <motion.div
              animate={{
                rotateY: mousePos.x * 12,
                rotateX: -mousePos.y * 12,
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
              className="relative w-full max-w-xl mx-auto flex items-center justify-center"
            >
              
              {/* 3D Tilted Laptop Frame Backing */}
              <div 
                className="relative w-[340px] sm:w-[460px] md:w-[500px] h-[240px] sm:h-[300px] rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black p-2 sm:p-3 border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/20"
                style={{
                  transform: 'rotateX(25deg) rotateY(-20deg) rotateZ(8deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Laptop Screen Bezel */}
                <div className="w-full h-full rounded-xl bg-[#060D1A] overflow-hidden border border-white/10 relative p-3 flex flex-col justify-between">
                  {/* Laptop Top Bar */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[9px] font-mono text-cyan-300 font-bold">sbleventsuganda.com/rigging</span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  </div>

                  {/* Internal preview graphic */}
                  <div className="relative flex-1 my-2 rounded-lg overflow-hidden border border-cyan-500/30 bg-[#081326]">
                    <img 
                      src={sblStageBlueTrussImg} 
                      alt="SBL Stage"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                      <div>
                        <span className="text-[10px] font-black uppercase text-cyan-300">Live Stage Rig</span>
                        <h4 className="text-xs font-bold text-white">European Truss & P2.6 LED</h4>
                      </div>
                    </div>
                  </div>

                  <div className="h-2 w-1/3 bg-cyan-500/30 rounded-full" />
                </div>

                {/* Base of laptop glow */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-4 bg-cyan-500/40 filter blur-md rounded-full" />
              </div>

              {/* CASCADING 3D FLOATING LAYER 1: TOP HERO UI CARD (Elevated with Neon Cyan Border) */}
              <motion.div
                initial={{ opacity: 0, y: 30, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="absolute top-2 sm:top-4 -left-2 sm:left-4 z-30 w-[260px] sm:w-[320px] rounded-2xl bg-[#091529]/95 backdrop-blur-md p-3.5 sm:p-4 border-2 border-cyan-400 shadow-2xl shadow-cyan-500/30"
                style={{
                  transform: 'rotateX(20deg) rotateY(-18deg) rotateZ(6deg) translateZ(40px)',
                }}
              >
                {/* Header of card */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-cyan-500/30">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                      <Tent className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-cyan-300 block">SBL PRODUCTION</span>
                      <h4 className="text-xs font-black text-white">Mega Tents & Stages</h4>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                    2,500+ Cap
                  </span>
                </div>

                {/* Image and specs */}
                <div className="mt-2.5 relative rounded-xl overflow-hidden h-24 border border-cyan-500/20">
                  <img 
                    src={sblMegaTentImg} 
                    alt="Mega Tent" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 px-2 py-0.5 rounded text-[9px] font-bold text-amber-300">
                    100km/h Wind Rated
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[10px]">
                  <span className="text-slate-300 font-medium">Clear-Span Aluminium</span>
                  <button 
                    onClick={() => openBookingModal()}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <span>Reserve</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>

              {/* CASCADING 3D FLOATING LAYER 2: MIDDLE GALLERY / SETUPS CARD (Neon Purple/Pink Border) */}
              <motion.div
                initial={{ opacity: 0, y: 40, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="absolute top-28 sm:top-36 right-0 sm:right-2 z-20 w-[250px] sm:w-[310px] rounded-2xl bg-[#0F1026]/95 backdrop-blur-md p-3.5 sm:p-4 border-2 border-purple-500 shadow-2xl shadow-purple-500/30"
                style={{
                  transform: 'rotateX(20deg) rotateY(-18deg) rotateZ(6deg) translateZ(20px)',
                }}
              >
                <div className="flex items-center justify-between pb-2 border-b border-purple-500/30">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                      <Tv className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold uppercase text-purple-300 block">VISUAL RIGGING</span>
                      <h4 className="text-xs font-black text-white">Curved P2.6 LED Walls</h4>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-purple-300">4K Ultra HD</span>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                  <div className="rounded-lg overflow-hidden h-16 border border-white/10">
                    <img src={sblLedScreenImg} alt="LED Screen" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-lg overflow-hidden h-16 border border-white/10">
                    <img src={kwanjulaRoyalStageImg} alt="Royal Stage" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-300">
                  <span className="text-emerald-400 font-bold">● Novastar Scalers</span>
                  <span className="font-mono text-purple-300">Outdoor IP65</span>
                </div>
              </motion.div>

              {/* CASCADING 3D FLOATING LAYER 3: BOTTOM TRANSPARENT PRICING & SOUND CARD (Pink/Red Neon) */}
              <motion.div
                initial={{ opacity: 0, y: 50, x: -10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="absolute -bottom-6 sm:-bottom-8 left-4 sm:left-12 z-40 w-[270px] sm:w-[330px] rounded-2xl bg-[#140C20]/95 backdrop-blur-md p-3.5 sm:p-4 border-2 border-pink-500 shadow-2xl shadow-pink-500/30"
                style={{
                  transform: 'rotateX(20deg) rotateY(-18deg) rotateZ(6deg) translateZ(60px)',
                }}
              >
                <div className="flex items-center justify-between pb-2 border-b border-pink-500/30">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300">
                      <Volume2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold uppercase text-pink-300 block">SOUND & CONCERT RIGS</span>
                      <h4 className="text-xs font-black text-white">Line Array & Mobile Disco</h4>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30">
                    Active
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between bg-black/40 p-2 rounded-xl border border-white/10">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-medium">Standard Sound Rig</span>
                    <span className="text-xs font-black text-amber-300 font-mono">UGX 850,000 / Day</span>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentPage('contact');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-3 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-[10px] font-black shadow-md cursor-pointer"
                  >
                    GET STARTED
                  </button>
                </div>
              </motion.div>

              {/* FLOATING HUD WIDGET 1: CODE / RIG ENGINE SNIPPET (Top Left) */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden sm:flex absolute -top-8 -left-8 z-50 p-2.5 rounded-xl bg-[#06101E]/90 border border-cyan-400/40 shadow-xl backdrop-blur-md items-center gap-2 font-mono text-[10px]"
              >
                <div className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                  <Code className="w-3 h-3" />
                </div>
                <div className="text-slate-300">
                  <span className="text-cyan-400 font-bold">&lt;//&gt;</span> <span className="text-purple-300">rigEngine</span>({'{'} <span className="text-amber-300">truss</span>: <span className="text-emerald-300">&apos;300mm&apos;</span> {'}'})
                </div>
              </motion.div>

              {/* FLOATING HUD WIDGET 2: AUDIO EQUALIZER / DECIBELS (Right side) */}
              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="hidden sm:flex absolute top-1/2 -right-10 z-50 p-3 rounded-2xl bg-[#110A1F]/90 border border-purple-400/40 shadow-xl backdrop-blur-md flex-col gap-1.5"
              >
                <div className="flex items-center justify-between gap-3 text-[10px]">
                  <span className="font-bold text-purple-300 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-purple-400" />
                    <span>AUDIO METRICS</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-black">118 dB</span>
                </div>

                {/* Animated Equalizer Waveform Bars */}
                <div className="flex items-end gap-1 h-5 w-24 pt-1">
                  {[40, 75, 90, 60, 100, 85, 45, 95, 70, 50].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] }}
                      transition={{ duration: 1 + (i % 3) * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex-1 rounded-full bg-gradient-to-t from-purple-500 to-cyan-400"
                    />
                  ))}
                </div>
              </motion.div>

              {/* FLOATING HUD WIDGET 3: VERIFIED CHIEF RIGGER BADGE (Bottom Right) */}
              <motion.div
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="hidden sm:flex absolute -bottom-4 right-0 z-50 p-2.5 rounded-xl bg-[#091522]/90 border border-emerald-400/40 shadow-xl backdrop-blur-md items-center gap-2.5 text-xs"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center font-black">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-300 block">100% RELIABILITY</span>
                  <span className="text-[11px] font-extrabold text-white">2-Day Rigging Buffer</span>
                </div>
              </motion.div>

            </motion.div>
          </div>

          {/* RIGHT 5 COLS: BOLD GLOWING TYPOGRAPHY & HERO HEADINGS (Matching the template image) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            {/* Top Glowing Ribbon / Premium Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-600/20 border border-amber-400/40 shadow-lg shadow-amber-500/20 text-xs font-black backdrop-blur-md"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span className="text-amber-300 font-mono tracking-widest uppercase">PREMIUM</span>
              <span className="text-white">PRODUCTION & RIGGING POWERHOUSE</span>
            </motion.div>

            {/* Glowing Hero Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-1.5"
            >
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-['Outfit',sans-serif] tracking-tight text-white leading-none">
                SBL -
              </h2>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-['Outfit',sans-serif] tracking-tight leading-[1.05] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-200 bg-clip-text text-transparent drop-shadow-2xl">
                EVENT RIGGING &amp; TECHNOLOGY
              </h1>
              <p className="text-xl sm:text-2xl font-extrabold tracking-wider font-['Outfit',sans-serif] text-slate-300 uppercase">
                UGANDA PRODUCTION SUITE
              </p>
            </motion.div>

            {/* Core Value Statement */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-medium"
            >
              European clear-span mega tents, heavy aluminium box truss stages, P2.6 ultra-HD curved LED video screens, computerized moving beam lighting, and high-impact concert sound.
            </motion.p>

            {/* Quick Interactive Highlights */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-[#060B14] border border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-semibold">100km/h Wind Anchored</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#060B14] border border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-200 font-semibold">Ducted HVAC Cooling</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#060B14] border border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="text-slate-200 font-semibold">50/100kVA Silent Power</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#060B14] border border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-semibold">B2B Sub-Hiring Fleet</span>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <button
                id="isometric-hero-book-btn"
                onClick={() => openBookingModal()}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 flex items-center gap-2 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>BOOK EVENT / GET QUOTE</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('services-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setCurrentPage('gallery');
                  }
                }}
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-amber-400/20 text-white hover:text-amber-200 border border-white/20 hover:border-amber-400/40 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>EXPLORE SERVICES</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openSearch()}
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-amber-300" />
                <span>SEARCH FLEET</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-amber-200 border border-white/15">
                  Ctrl+K
                </kbd>
              </button>

              <a
                href={COMPANY_CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-sm font-bold flex items-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </motion.div>

            {/* Official Confirmation & Direct Inquiries Notice */}
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
              <span>Official dispatch confirmations sent to:</span>
              <strong className="text-amber-300 font-mono">najibshafiq@sblevents.com</strong>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
