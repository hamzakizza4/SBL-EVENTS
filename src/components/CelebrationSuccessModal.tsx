import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Check, 
  X, 
  Sparkles, 
  MessageCircle, 
  Phone, 
  Calendar, 
  MapPin, 
  Users, 
  Copy, 
  CheckCheck, 
  Layers, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Mail,
  ChevronLeft
} from 'lucide-react';
import { COMPANY_CONTACT_INFO } from '../data/mockData';
import { Booking } from '../types';
import { useApp } from '../context/AppContext';

interface CelebrationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    referenceNumber: string;
    clientName: string;
    phone: string;
    eventType: string;
    eventDate: string;
    location: string;
    durationDays?: number;
    guestCount?: number;
    selectedServices?: string[];
  } | null;
  onNavigateHome?: () => void;
}

export const CelebrationSuccessModal: React.FC<CelebrationSuccessModalProps> = ({
  isOpen,
  onClose,
  booking,
  onNavigateHome,
}) => {
  const { triggerMockEmailConfirmation } = useApp();
  const [copied, setCopied] = useState(false);

  // Trigger confetti bursts and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    // Confetti cannon fire
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#ffffff'],
      });
      fire(0.2, {
        spread: 60,
        colors: ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa'],
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        colors: ['#2563eb', '#059669', '#d97706', '#db2777'],
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        colors: ['#93c5fd', '#6ee7b7', '#fde68a'],
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    } catch {
      // ignore
    }

    // ESC key listener to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !booking) return null;

  const handleCopyRef = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(booking.referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello SBL Events Uganda! I just submitted a booking inquiry.\n\n*Reference:* ${booking.referenceNumber}\n*Name:* ${booking.clientName}\n*Event:* ${booking.eventType}\n*Date:* ${booking.eventDate}\n*Location:* ${booking.location}\n\nPlease confirm availability and let me know the next steps.`
  );
  const whatsappUrl = `https://wa.me/256752420911?text=${whatsappMessage}`;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
        onClick={(e) => {
          // Close when clicking outside modal box
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-lg w-full rounded-3xl overflow-hidden border border-white/20 bg-[#132644] text-white shadow-2xl my-6 flex flex-col"
          onClick={(e) => e.stopPropagation()} // Prevent clicking inside from closing
        >
          {/* Top Decorative Header Accent */}
          <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-400 animate-pulse" />

          {/* Back Button Top Left */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/25 text-slate-200 hover:text-white transition-all cursor-pointer z-20 flex items-center gap-1 text-xs font-bold border border-white/15"
            title="Back / Close dialog"
            aria-label="Back"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          {/* Close Button Top Right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/25 text-slate-300 hover:text-white transition-all cursor-pointer z-20"
            title="Close dialog (or click outside)"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8 space-y-6 text-center">
            {/* Lottie-style celebratory animated badge */}
            <div className="relative flex items-center justify-center pt-2">
              {/* Outer pulsing halo waves */}
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-28 h-28 rounded-full bg-emerald-400/20"
              />
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                className="absolute w-24 h-24 rounded-full bg-blue-400/25"
              />

              {/* Floating sparkles */}
              <motion.div
                animate={{ y: [-4, 4, -4], rotate: [0, 15, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-2 -right-2 text-amber-300"
              >
                <Sparkles className="w-6 h-6 drop-shadow-md" />
              </motion.div>
              <motion.div
                animate={{ y: [4, -4, 4], rotate: [0, -15, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-1 -left-2 text-emerald-300"
              >
                <Sparkles className="w-5 h-5 drop-shadow-md" />
              </motion.div>

              {/* Center celebratory emblem */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 border-4 border-white/40 shadow-xl flex items-center justify-center relative z-10"
              >
                <motion.svg
                  className="w-10 h-10 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M20 6L9 17l-5-5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                  />
                </motion.svg>
              </motion.div>
            </div>

            {/* Title & Celebration Message */}
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Inquiry Submitted Successfully!</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white tracking-tight">
                You&apos;re All Set, {booking.clientName.split(' ')[0]}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                Your event inquiry has been logged in our dispatch schedule. Our production coordinators are reviewing your date.
              </p>
            </div>

            {/* Reference Badge with Copy Action */}
            <div className="p-4 rounded-2xl bg-[#0E1D35] border border-white/15 flex items-center justify-between gap-3 text-left">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Official Booking Reference
                </span>
                <span className="text-base sm:text-lg font-mono font-black text-amber-300">
                  {booking.referenceNumber}
                </span>
              </div>
              <button
                onClick={handleCopyRef}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/15"
                title="Copy reference code"
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-300" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Key Event Details Summary Box */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-left space-y-2.5">
              <div className="grid grid-cols-2 gap-2 text-slate-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                  <span className="truncate">{booking.eventDate} ({booking.durationDays || 1} day)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-pink-300 shrink-0" />
                  <span className="truncate capitalize">{booking.eventType.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="truncate">{booking.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span className="truncate">{booking.guestCount || 300} Guests</span>
                </div>
              </div>

              {booking.selectedServices && booking.selectedServices.length > 0 && (
                <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-semibold">Services:</span>
                  {booking.selectedServices.slice(0, 3).map((srv, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-[#0E1D35] border border-white/10 text-[10px] text-slate-300 font-medium"
                    >
                      {srv.replace(/-/g, ' ')}
                    </span>
                  ))}
                  {booking.selectedServices.length > 3 && (
                    <span className="text-[10px] text-slate-400">+{booking.selectedServices.length - 3} more</span>
                  )}
                </div>
              )}
            </div>

            {/* Fast Response Guarantee */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Fast Track: Coordinator will respond within 30 minutes</span>
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => {
                  triggerMockEmailConfirmation({
                    referenceNumber: booking.referenceNumber,
                    clientName: booking.clientName,
                    phone: booking.phone,
                    eventType: booking.eventType,
                    eventDate: booking.eventDate,
                    location: booking.location,
                    durationDays: booking.durationDays,
                    guestCount: booking.guestCount,
                    selectedServices: booking.selectedServices,
                  });
                }}
                className="w-full py-3 px-4 rounded-2xl bg-[#0E1D35] hover:bg-[#152a4a] border border-amber-400/30 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-amber-300" />
                <span>View / Resend Booking Confirmation Email</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300/70" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Confirmation</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${COMPANY_CONTACT_INFO.phone}`}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-300" />
                  <span>Call Operations</span>
                </a>

                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateHome) onNavigateHome();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white text-[#0F1F38] hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back / Done</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
