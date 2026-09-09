import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Page } from '../types';
import { COMPANY_CONTACT_INFO } from '../data/mockData';
import { getThemeClasses } from '../utils/themeStyles';
import { SblLogo } from './SblLogo';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Lock, 
  Sparkles,
  Send,
  ChevronUp,
  Film,
  MessageCircle,
  Clock,
  Crown
} from 'lucide-react';
import { motion } from 'motion/react';

export const Footer: React.FC = () => {
  const { currentPage, setCurrentPage, theme, isAdminLoggedIn, addCallbackRequest, openSplashScreen } = useApp();
  const [quickPhone, setQuickPhone] = useState('');
  const [quickName, setQuickName] = useState('');

  const t = getThemeClasses(theme);

  const handleQuickCallRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPhone.trim()) return;

    addCallbackRequest({
      clientName: quickName.trim() || 'Website Visitor',
      phone: quickPhone.trim(),
      eventInterest: 'Quick Callback from Footer',
      preferredTime: 'As soon as possible',
      notes: 'Submitted via redesigned footer quick dispatch bar.',
    });

    setQuickPhone('');
    setQuickName('');
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { id: Page; title: string; subtitle: string }[] = [
    { id: 'home', title: 'WELCOME', subtitle: 'HOMEPAGE' },
    { id: 'services', title: 'SERVICES', subtitle: 'EQUIPMENT CATALOGUE' },
    { id: 'stage-planner', title: '3D STAGE', subtitle: 'SIMULATION & RIGGING' },
    { id: 'gallery', title: 'PORTFOLIO', subtitle: 'VIEW OUR EVENTS' },
    { id: 'calendar', title: 'CALENDAR', subtitle: 'LIVE AVAILABILITY' },
    { id: 'about', title: 'ABOUT', subtitle: 'OUR JOURNEY' },
    { id: 'testimonials', title: 'REVIEWS', subtitle: 'CLIENT TRUST' },
    { id: 'contact', title: 'CONTACT', subtitle: 'GET IN TOUCH' },
  ];

  return (
    <footer id="main-footer" className="bg-[#04070E] text-white border-t border-white/10 relative overflow-hidden">
      
      {/* 1. TOP DISPATCH STRIP: Minimal Direct Callback & Hotline Bar */}
      <div className="border-b border-white/10 bg-[#070D18]/90 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-5">
          
          <div className="flex items-center gap-3 text-center lg:text-left">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 shrink-0">
              <Crown className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black tracking-tight text-white font-['Outfit']">
                SBL PRODUCTION DISPATCH • MASAKA & LWENGO
              </h4>
              <p className="text-xs text-slate-400">
                Direct hotline reservation: <strong className="text-amber-400 font-mono">+256 752 420 911</strong> (WhatsApp & Calls)
              </p>
            </div>
          </div>

          {/* Quick Callback Form */}
          <form onSubmit={handleQuickCallRequest} className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto max-w-lg">
            <input
              type="text"
              placeholder="Your name"
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-[#0B1322] border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400 flex-1 min-w-[120px]"
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={quickPhone}
              onChange={(e) => setQuickPhone(e.target.value)}
              required
              className="px-3.5 py-2.5 rounded-xl bg-[#0B1322] border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400 flex-1 min-w-[140px]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer transform hover:scale-[1.03]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Request Call</span>
            </button>
          </form>

        </div>
      </div>

      {/* 2. MAIN FOOTER BODY: High-Contrast 2-Tier Navigation & Clean Brand Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        
        {/* Brand Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          
          {/* Logo & Motto */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <SblLogo size="lg" animated={true} badge="NO. 1 IN UGANDA" />
          </div>

          {/* Clean Contact Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <a 
              href={COMPANY_CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Chat</span>
            </a>

            <a 
              href="https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-pink-500/15 text-pink-300 hover:bg-pink-600 hover:text-white border border-pink-500/30 font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Film className="w-3.5 h-3.5" />
              <span>TikTok Live</span>
            </a>

            <a 
              href={`mailto:${COMPANY_CONTACT_INFO.email}?subject=SBL%20Events%20Inquiry`}
              className="px-3 py-2 rounded-xl bg-amber-500/15 text-amber-300 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 font-bold transition-all flex items-center gap-1.5 shadow-sm font-mono"
              title="Official Inquiries Email"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{COMPANY_CONTACT_INFO.email}</span>
            </a>

            <a 
              href={`tel:${COMPANY_CONTACT_INFO.primaryPhone}`}
              className="px-3 py-2 rounded-xl bg-white/10 text-slate-200 hover:bg-white hover:text-[#0B172A] border border-white/15 font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>0752 420 911</span>
            </a>
          </div>

        </div>

        {/* 2-Tier Structured Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 py-8">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => navigateTo(link.id)}
                className={`p-3.5 rounded-2xl text-center transition-all duration-300 group cursor-pointer flex flex-col items-center justify-center gap-1 border ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 border-amber-400 shadow-xl shadow-amber-500/20'
                    : 'bg-[#0B1322] hover:bg-amber-400/15 text-slate-300 hover:text-white border-white/10 hover:border-amber-400/40'
                }`}
              >
                <span className={`text-xs font-black tracking-wider block ${isActive ? 'text-slate-950 font-black' : 'text-white group-hover:text-amber-300'}`}>
                  {link.title}
                </span>
                <span className={`text-[10px] font-mono tracking-widest block uppercase ${isActive ? 'text-slate-900 font-bold' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {link.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Center Circular Action Badge & Summary */}
        <div className="flex flex-col items-center justify-center pt-2 pb-6 text-center space-y-4">
          
          {/* Circular Gold Scroll-To-Top / Anchor Badge */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.12, y: -3 }}
            whileTap={{ scale: 0.94 }}
            title="Back to Top"
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 border border-amber-300/30 transition-all cursor-pointer group"
          >
            <ChevronUp className="w-6 h-6 stroke-[3] group-hover:-translate-y-0.5 transition-transform text-slate-950" />
          </motion.button>

          <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
            European Clear-Span Mega Tents • Box Truss Stages • P2.6 Curved LED Walls • Line Array Audio • Luxury Mobile Restrooms • B2B Tent Sub-Hiring
          </p>

        </div>

      </div>

      {/* 3. BOTTOM LEGAL BAR */}
      <div className="border-t border-white/10 bg-[#03070E] py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} SBL Events Uganda. All rights reserved.</span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-slate-400">{COMPANY_CONTACT_INFO.address}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button 
              onClick={() => openSplashScreen()} 
              className="text-amber-300 hover:text-white font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Intro Cover</span>
            </button>
            <span>•</span>
            <button 
              onClick={() => navigateTo('admin')} 
              className="text-slate-300 hover:text-white font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3 text-blue-300" />
              <span>Staff Portal</span>
            </button>
          </div>

        </div>
      </div>

    </footer>
  );
};

