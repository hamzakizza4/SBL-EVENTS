import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { COMPANY_CONTACT_INFO } from '../data/mockData';

export const FloatingWhatsAppButton: React.FC = () => {
  return (
    <aside
      aria-label="Direct WhatsApp Contact"
      className="fixed bottom-[108px] sm:bottom-[104px] lg:bottom-6 right-3 sm:right-6 z-50 pointer-events-auto transition-all duration-300"
    >
      <a
        id="floating-whatsapp-btn"
        href={COMPANY_CONTACT_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white rounded-full shadow-2xl shadow-emerald-950/60 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-emerald-300/40 ring-4 ring-emerald-500/25 cursor-pointer"
        title="Chat directly with SBL Events Lwengo on WhatsApp (0752420911)"
      >
        {/* Pulsing indicator */}
        <div className="relative flex items-center justify-center shrink-0">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs">
            <MessageCircle className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-white rounded-full animate-ping" />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-lime-300 border-2 border-emerald-600 rounded-full" />
        </div>

        <div className="flex flex-col text-left pr-1">
          <div className="flex items-center gap-1">
            <span className="text-[9px] sm:text-[10px] text-emerald-100 uppercase font-black tracking-wider leading-none">
              WhatsApp Chat
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-lime-300 animate-pulse" />
          </div>
          <span className="text-xs sm:text-[13px] font-black leading-tight text-white flex items-center gap-1 mt-0.5">
            0752420911
          </span>
        </div>
      </a>
    </aside>
  );
};

