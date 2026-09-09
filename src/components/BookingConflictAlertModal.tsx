import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookingConflictDetails } from '../utils/bookingConflictValidator';
import { Booking, CalendarEvent } from '../types';
import { 
  AlertTriangle, 
  Calendar, 
  X, 
  User, 
  Phone, 
  MessageCircle, 
  Clock, 
  ShieldAlert, 
  MapPin, 
  Sparkles,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface BookingConflictAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  conflict: BookingConflictDetails | null;
  onNavigateToCalendar?: () => void;
}

export const BookingConflictAlertModal: React.FC<BookingConflictAlertModalProps> = ({
  isOpen,
  onClose,
  booking,
  conflict,
  onNavigateToCalendar,
}) => {
  if (!isOpen || !booking || !conflict || !conflict.hasConflict) return null;

  const isCritical = conflict.severity === 'critical';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Dialog Content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0B1526] border border-white/20 shadow-2xl p-6 sm:p-7 text-white space-y-6"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Banner */}
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isCritical
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-lg shadow-red-500/20 animate-pulse'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}
            >
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                    isCritical
                      ? 'bg-red-500/25 text-red-300 border border-red-500/40'
                      : 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {conflict.badgeText}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Target Ref #{booking.referenceNumber}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mt-1">
                {isCritical ? 'Schedule Conflict Detected' : 'Logistics Buffer Warning'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {conflict.summary}
              </p>
            </div>
          </div>

          {/* Clashing Dates Strip */}
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-red-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Overlapping Event Dates ({conflict.overlapCount} Day{conflict.overlapCount > 1 ? 's' : ''}):</span>
              </span>
              <span className="font-mono text-[11px] text-slate-300">
                Double-booking prevention active
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {conflict.overlappingDates.map((date) => (
                <span
                  key={date}
                  className="px-3 py-1 rounded-xl bg-red-500/25 border border-red-500/50 text-red-200 font-mono font-black text-xs shadow-xs flex items-center gap-1"
                >
                  <Clock className="w-3 h-3 text-red-400" />
                  <span>{date}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Side-by-Side Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. New Booking Request */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Incoming Request
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {booking.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-white text-sm">{booking.clientName}</p>
                <div className="flex items-center gap-1 text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{booking.eventDate} ({booking.durationDays || 1} day{booking.durationDays && booking.durationDays > 1 ? 's' : ''})</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="line-clamp-1">{booking.location}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{booking.phone}</span>
                </div>
              </div>
            </div>

            {/* 2. Conflicting Existing Reservation */}
            <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-red-500/20">
                <span className="text-xs font-bold text-red-300 uppercase tracking-wider">
                  Existing Reservation
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  {conflict.conflictingStatus?.toUpperCase() || 'RESERVED'}
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-white text-sm">
                  {conflict.conflictingClient || conflict.conflictingTitle}
                </p>
                <div className="flex items-center gap-1 text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{conflict.conflictingDates}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ref: #{conflict.conflictingRef}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 italic">
                  <span>Source: {conflict.conflictingSource === 'calendar' ? 'Calendar Event' : 'Confirmed Booking'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Recommendation Box */}
          <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/25 space-y-2">
            <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Recommended Administrator Action</span>
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {conflict.recommendation}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-white/10">
            {booking.phone && (
              <a
                href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${booking.clientName}, this is SBL Event Logistics regarding your booking request #${booking.referenceNumber} for ${booking.eventType} on ${booking.eventDate}. We noticed a calendar scheduling conflict with an existing reservation. We would love to discuss offering an alternate date or dedicated equipment options.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Client (Propose Alternate Date)</span>
              </a>
            )}

            {booking.phone && (
              <a
                href={`tel:${booking.phone}`}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Client</span>
              </a>
            )}

            {onNavigateToCalendar && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToCalendar();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Open Calendar Schedule</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Dismiss Notice
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
