import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookingConflictDetails } from '../utils/bookingConflictValidator';
import { Booking } from '../types';
import { AlertTriangle, ShieldAlert, Check, X, Calendar, MessageCircle } from 'lucide-react';

interface ConfirmOverlapBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  conflict: BookingConflictDetails | null;
  onProceedAnyway: (booking: Booking) => void;
}

export const ConfirmOverlapBookingModal: React.FC<ConfirmOverlapBookingModalProps> = ({
  isOpen,
  onClose,
  booking,
  conflict,
  onProceedAnyway,
}) => {
  if (!isOpen || !booking || !conflict) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
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
          className="relative w-full max-w-lg rounded-3xl bg-[#0F172A] border border-red-500/50 shadow-2xl p-6 text-white space-y-5"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-black text-white font-['Outfit']">
              Double-Booking Confirmation Guard
            </h3>
            <p className="text-xs text-slate-300">
              You are about to confirm a booking request that overlaps with an existing reservation in the calendar.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-red-300">
              <span>Target: #{booking.referenceNumber} ({booking.clientName})</span>
              <span className="font-mono text-white">{booking.eventDate}</span>
            </div>
            <div className="text-slate-300 text-[11px] leading-relaxed">
              <span className="font-bold text-amber-300">Clashing Reservation:</span>{' '}
              {conflict.summary}
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {conflict.overlappingDates.map((d) => (
                <span
                  key={d}
                  className="px-2 py-0.5 rounded-md bg-red-500/30 text-red-200 text-[10px] font-mono font-bold"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-white/5 p-3 rounded-xl border border-white/10">
            Confirming this booking will schedule concurrent equipment logistics. Ensure you have sufficient tents, sound rigs, and trucks before approving.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel & Propose New Date
            </button>
            <button
              type="button"
              onClick={() => onProceedAnyway(booking)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Confirm Overlap Anyway</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
