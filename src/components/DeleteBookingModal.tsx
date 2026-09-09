import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking } from '../types';
import { Trash2, AlertTriangle, X, Calendar, MapPin, DollarSign } from 'lucide-react';

interface DeleteBookingModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  onConfirm: (booking: Booking) => void;
  formatUGX: (amount: number) => string;
}

export const DeleteBookingModal: React.FC<DeleteBookingModalProps> = ({
  isOpen,
  booking,
  onClose,
  onConfirm,
  formatUGX,
}) => {
  if (!isOpen || !booking) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-[#0F1D33] border border-red-500/30 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden"
        >
          {/* Crimson glow backdrop */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-600/30 border border-red-500/40 flex items-center justify-center text-red-400 shadow-inner">
                <Trash2 className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-red-400">
                  Swipe Action Verification
                </span>
                <h3 className="text-lg font-black text-white leading-tight">
                  Delete Booking?
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Booking Summary Card */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 mb-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                {booking.referenceNumber}
              </span>
              <span className="text-xs font-black text-amber-400 font-mono">
                {formatUGX(booking.estimatedTotal || 0)}
              </span>
            </div>

            <h4 className="text-base font-extrabold text-white">
              {booking.clientName}
            </h4>

            <div className="flex flex-col gap-1 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{booking.eventDate} ({booking.durationDays || 1} day{(booking.durationDays || 1) > 1 ? 's' : ''})</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{booking.location || 'Uganda Venue'}</span>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-200 text-xs mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              This will permanently remove the booking, release its scheduled fleet equipment in the calendar, and synchronize the deletion to cloud storage.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer text-center"
            >
              Keep Booking
            </button>
            <button
              type="button"
              onClick={() => onConfirm(booking)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-lg shadow-red-950/60 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span>Confirm Delete</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
