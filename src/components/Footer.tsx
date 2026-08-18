import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Page } from '../types';
import { COMPANY_CONTACT_INFO } from '../data/mockData';
import { getThemeClasses } from '../utils/themeStyles';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  ArrowUpRight, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  Send,
  Crown
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, showToast, theme, isAdminLoggedIn } = useApp();
  const [quickPhone, setQuickPhone] = useState('');

  const t = getThemeClasses(theme);

  const handleQuickCallRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPhone.trim()) return;
    showToast('Callback Requested!', `Our senior event production director will call ${quickPhone} shortly.`, 'success');
    setQuickPhone('');
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="border-t border-white/15 bg-[#0B172A] text-slate-300 text-sm relative overflow-hidden transition-colors">
      {/* Top Banner: Immediate Availability & Callback */}
      <div className="border-b border-white/10 bg-[#0F1F38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Immediate Availability & Nationwide Logistics</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Planning a Wedding, Concert, or Mega Marquee Event?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm">
                Get an instant quote breakdown, equipment inventory reservation, or book a free on-site venue inspection today.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleQuickCallRequest} className="flex flex-col sm:flex-row gap-2">
                <input
                  id="footer-callback-phone-input"
                  type="tel"
                  placeholder="Enter your phone number..."
                  value={quickPhone}
                  onChange={(e) => setQuickPhone(e.target.value)}
                  required
                  className="flex-1 bg-[#081225] border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm px-4 py-3 rounded-xl focus:outline-hidden focus:border-white transition-all"
                />
                <button
                  id="footer-callback-submit-btn"
                  type="submit"
                  className="bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Callback</span>
                </button>
              </form>
              <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                <span>Zero obligation. Direct conversation with SBL technical directors.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#0F1F38] font-black text-lg shadow-md">
                SBL
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  SBL <span className="text-slate-300 font-normal">EVENTS</span>
                </span>
                <p className="text-[11px] text-slate-400">Production, Lending & Staging Powerhouse</p>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md">
              SBL Events provides end-to-end event production, high-capacity European-standard mega tents, intelligent DMX lighting, concert sound systems, charismatic MCs, LED video walls, luxury mobile restrooms, and B2B tent lending to peer event holders.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>100km/h Wind-Load Tested Clear-Span Marquees</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Silent Diesel Generator Backup on Standby for all Events</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Certified Rigging & Sound Engineers with 15+ Yrs Field Mastery</span>
              </div>
            </div>
          </div>

          {/* Col 2: Core Services */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Core Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Mega Tents & Marquees</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Intelligent Mood Lighting</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Concert Line-Array Audio</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>P2.6 LED Video Screens</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Modular Heavy-Duty Stages</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>VIP Mobile Restroom Trailers</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>B2B Sub-Rental & Tent Lending</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('gallery')} className="hover:text-white transition-colors">
                  Project Gallery & Visuals
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('calendar')} className="hover:text-white transition-colors">
                  Live Availability Calendar
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                  About SBL Events
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('testimonials')} className="hover:text-white transition-colors">
                  Client Reviews & Trust
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  Contact & Bookings
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin')} className="hover:text-white transition-colors flex items-center gap-1 text-blue-300 font-bold">
                  <Lock className="w-3 h-3" />
                  <span>Admin & Employee Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Operations */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Headquarters
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span className="text-slate-300">{COMPANY_CONTACT_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <a href={`tel:${COMPANY_CONTACT_INFO.phone}`} className="hover:text-white text-slate-200 font-bold">
                  {COMPANY_CONTACT_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <a href={`mailto:${COMPANY_CONTACT_INFO.email}`} className="hover:text-white text-slate-200">
                  {COMPANY_CONTACT_INFO.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span className="text-slate-300">{COMPANY_CONTACT_INFO.hours}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal & Rights */}
      <div className="border-t border-white/10 bg-[#081225] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SBL Events Production & Rental Co. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Mega Tents • Stages • Audio • Intelligent Lights</span>
            <span>•</span>
            <button onClick={() => navigateTo('admin')} className="text-slate-300 hover:text-white font-semibold flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Staff Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
