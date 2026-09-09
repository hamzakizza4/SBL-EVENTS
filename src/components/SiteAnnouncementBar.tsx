import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_CONTACT_INFO } from '../data/mockData';
import { Sparkles, Phone, MessageCircle, ArrowRight, X, Calendar, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SiteAnnouncementBar: React.FC = () => {
  const { announcement, openBookingModal, setCurrentPage } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!announcement || !announcement.enabled || isDismissed) {
    return null;
  }

  const handleActionClick = () => {
    switch (announcement.actionType) {
      case 'booking':
        openBookingModal();
        break;
      case 'whatsapp':
        window.open(COMPANY_CONTACT_INFO.whatsappUrl, '_blank', 'noopener,noreferrer');
        break;
      case 'phone':
        window.location.href = `tel:${COMPANY_CONTACT_INFO.phone}`;
        break;
      case 'calendar':
        setCurrentPage('calendar');
        break;
      case 'gallery':
        setCurrentPage('gallery');
        break;
      default:
        openBookingModal();
        break;
    }
  };

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Site Announcement"
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-40 bg-gradient-to-r from-[#060E1E] via-[#0C1E3C] to-[#060E1E] border-b border-blue-500/30 text-white overflow-hidden shadow-lg"
      >
        {/* Ambient subtle glow pulse */}
        {announcement.urgent && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-blue-500/15 to-blue-600/10 animate-pulse pointer-events-none" />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
          {/* Main Message & Badge */}
          <div className="flex-1 flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
            {announcement.badge && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-black text-[11px] sm:text-xs uppercase tracking-wider shrink-0 shadow-xs">
                <Sparkles className="w-3 h-3 text-white" />
                <span>{announcement.badge}</span>
              </span>
            )}
            <p className="text-blue-50 font-medium leading-tight truncate-multiline">
              {announcement.message}
            </p>
          </div>

          {/* Action Button & Dismiss */}
          <div className="flex items-center gap-2 shrink-0">
            {announcement.actionText && (
              <button
                type="button"
                onClick={handleActionClick}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:shadow-blue-600/20 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{announcement.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              aria-label="Dismiss announcement"
              className="p-1 rounded-lg text-blue-300/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
