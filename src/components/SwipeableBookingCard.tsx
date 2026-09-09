import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Booking, Service, BookingStatus, ServiceCategory } from '../types';
import { BookingConflictDetails } from '../utils/bookingConflictValidator';
import { 
  Trash2, 
  Phone, 
  MessageCircle, 
  Mail, 
  Eye, 
  Calendar, 
  MapPin, 
  Users, 
  CheckSquare, 
  Square, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  AlertTriangle,
  MoveLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldAlert
} from 'lucide-react';

interface SwipeableBookingCardProps {
  booking: Booking;
  services: Service[];
  isSelected: boolean;
  conflict?: BookingConflictDetails;
  onInspectConflict?: (booking: Booking, conflict: BookingConflictDetails) => void;
  onToggleSelect: (e: React.MouseEvent) => void;
  onDeleteRequest: (booking: Booking) => void;
  onViewDetails: (booking: Booking) => void;
  onViewEmail: (booking: Booking) => void;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  formatUGX: (amount: number) => string;
}

export const SwipeableBookingCard: React.FC<SwipeableBookingCardProps> = ({
  booking,
  services,
  isSelected,
  conflict,
  onInspectConflict,
  onToggleSelect,
  onDeleteRequest,
  onViewDetails,
  onViewEmail,
  onUpdateStatus,
  isExpanded,
  onToggleExpand,
  formatUGX,
}) => {
  const [copiedRef, setCopiedRef] = useState(false);
  const [isSwipingPastThreshold, setIsSwipingPastThreshold] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);

  // Framer motion x position tracking
  const x = useMotionValue(0);
  const trashScale = useTransform(x, [0, -80, -140], [0.8, 1.1, 1.3]);
  const trashRotate = useTransform(x, [0, -80, -140], [0, -12, -25]);
  const deleteBgOpacity = useTransform(x, [0, -30, -100], [0.4, 0.8, 1]);

  const handleCopyRef = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(booking.referenceNumber);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 1800);
  };

  const handleDragUpdate = () => {
    const currentX = x.get();
    setSwipeOffset(currentX);
    if (currentX <= -80) {
      if (!isSwipingPastThreshold) setIsSwipingPastThreshold(true);
    } else {
      if (isSwipingPastThreshold) setIsSwipingPastThreshold(false);
    }
  };

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    // If dragged past -85px or swiped fast to the left
    if (info.offset.x <= -85 || info.velocity.x <= -350) {
      onDeleteRequest(booking);
    }
    setIsSwipingPastThreshold(false);
    setSwipeOffset(0);
  };

  const orderedServicesList = booking.selectedServices.map(
    (sId) =>
      services.find((srv) => srv.id === sId) || {
        id: sId,
        title: sId,
        basePrice: 0,
        category: 'equipment' as ServiceCategory,
        shortDesc: 'Event Logistics Item',
        tagline: '',
        fullDesc: '',
        image: '',
        galleryImages: [],
        priceUnit: 'per event',
        features: [],
        specs: [],
        b2bAvailable: false,
      }
  );

  const statusColors = {
    confirmed: {
      pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      dot: 'bg-emerald-400',
      border: 'border-l-emerald-500',
    },
    pending: {
      pill: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      dot: 'bg-amber-400',
      border: 'border-l-amber-500',
    },
    completed: {
      pill: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      dot: 'bg-blue-400',
      border: 'border-l-blue-500',
    },
    cancelled: {
      pill: 'bg-red-500/20 text-red-300 border-red-500/40',
      dot: 'bg-red-400',
      border: 'border-l-red-500',
    },
  }[booking.status] || {
    pill: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    dot: 'bg-slate-400',
    border: 'border-l-slate-500',
  };

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg select-none group">
      {/* 1. BACKGROUND DELETE ACTION TRAY (Revealed as card is swiped left) */}
      <motion.div 
        style={{ opacity: deleteBgOpacity }}
        className={`absolute inset-0 bg-gradient-to-l from-red-600 via-red-700 to-rose-950 flex items-center justify-end px-5 text-white transition-colors duration-150 ${
          isSwipingPastThreshold ? 'from-red-500 via-rose-600 to-red-900 ring-2 ring-red-400' : ''
        }`}
        onClick={() => onDeleteRequest(booking)}
      >
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="flex flex-col items-end text-right">
            <span className="text-xs font-black tracking-wider uppercase text-white flex items-center gap-1">
              {isSwipingPastThreshold ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
                  <span>Release to Delete!</span>
                </>
              ) : (
                <>
                  <MoveLeft className="w-3.5 h-3.5 text-red-200 animate-pulse" />
                  <span>Swipe to Delete</span>
                </>
              )}
            </span>
            <span className="text-[10px] text-red-200 font-semibold">
              Ref #{booking.referenceNumber}
            </span>
          </div>

          <motion.div 
            style={{ scale: trashScale, rotate: trashRotate }}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
              isSwipingPastThreshold
                ? 'bg-white text-red-600 shadow-white/30 ring-4 ring-white/40'
                : 'bg-red-800/80 text-white border border-white/20'
            }`}
          >
            <Trash2 className="w-5 h-5" />
          </motion.div>
        </div>
      </motion.div>

      {/* 2. FOREGROUND CARD (Swipes smoothly to the left) */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -130, right: 0 }}
        dragElastic={0.12}
        onDrag={handleDragUpdate}
        onDragEnd={handleDragEnd}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
        className={`relative z-10 bg-[#0E1B2E] rounded-2xl p-4 sm:p-5 transition-colors border-l-4 ${statusColors.border} ${
          conflict?.hasConflict
            ? conflict.severity === 'critical'
              ? 'border-2 border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
              : 'border-2 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
            : 'border border-white/15'
        } ${
          isSelected ? 'bg-[#1a2b45] ring-2 ring-amber-400/70' : 'hover:bg-[#12233b]'
        }`}
      >
        {/* Top Header Strip: Checkbox, Reference Number, Status, Swipe Handle */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleSelect}
              className="p-1 rounded-md text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isSelected ? 'Deselect Booking' : 'Select Booking'}
            >
              {isSelected ? (
                <CheckSquare className="w-4 h-4 text-amber-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </button>

            <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
              <span className="font-mono font-bold text-xs text-amber-300">
                {booking.referenceNumber}
              </span>
              <button
                type="button"
                onClick={handleCopyRef}
                className="text-slate-400 hover:text-white transition-colors p-0.5"
                title="Copy reference code"
              >
                {copiedRef ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Visual Conflict Indicator Pill */}
            {conflict?.hasConflict && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onInspectConflict?.(booking, conflict);
                }}
                className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 ${
                  conflict.severity === 'critical'
                    ? 'bg-red-500/30 text-red-300 border border-red-500/50 animate-pulse'
                    : 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                }`}
                title={conflict.summary}
              >
                <AlertTriangle className="w-2.5 h-2.5" />
                <span>{conflict.badgeText}</span>
              </button>
            )}

            <span
              className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${statusColors.pill}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot} animate-pulse`} />
              <span>{booking.status}</span>
            </span>

            {/* Visual Touch Swipe Affordance */}
            <div 
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-[10px] font-bold"
              title="Swipe left to delete this booking"
            >
              <MoveLeft className="w-3 h-3 text-red-400 animate-pulse" />
              <span className="hidden sm:inline">Swipe</span>
            </div>
          </div>
        </div>

        {/* Card Body: Client Name, Event, Date, Location */}
        <div className="pt-3 space-y-2.5">
          {/* Overlap Alert Banner */}
          {conflict?.hasConflict && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onInspectConflict?.(booking, conflict);
              }}
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                conflict.severity === 'critical'
                  ? 'bg-red-500/15 border-red-500/40 hover:bg-red-500/25 text-red-200'
                  : 'bg-amber-500/15 border-amber-500/40 hover:bg-amber-500/25 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    conflict.severity === 'critical'
                      ? 'bg-red-500/30 text-red-300 animate-pulse'
                      : 'bg-amber-500/30 text-amber-300'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="font-black text-[11px] uppercase tracking-wide flex items-center gap-1.5">
                    <span>
                      {conflict.severity === 'critical'
                        ? '⚠️ Calendar Overlap Detected'
                        : '⚠️ Logistics Buffer Clash'}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-slate-300 font-normal">
                      {conflict.overlappingDates.join(', ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-200 truncate mt-0.5">
                    {conflict.summary}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase shrink-0 shadow-xs cursor-pointer ${
                  conflict.severity === 'critical'
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                Inspect
              </button>
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-base font-extrabold text-white tracking-tight leading-tight">
                {booking.clientName}
              </h4>
              {booking.companyName && (
                <p className="text-xs text-slate-400 font-medium">{booking.companyName}</p>
              )}
            </div>

            <div className="text-right shrink-0">
              <div className="text-sm font-black text-amber-400 font-mono">
                {formatUGX(booking.estimatedTotal || 0)}
              </div>
              <span className="text-[10px] text-slate-400">Total Est.</span>
            </div>
          </div>

          {/* Key Event Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5">
              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-semibold text-white">{booking.eventDate}</span>
              <span className="text-[10px] text-slate-400">
                ({booking.durationDays || 1} day{(booking.durationDays || 1) > 1 ? 's' : ''})
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5 truncate">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate" title={booking.location}>
                {booking.location || 'Uganda Event Venue'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5">
              <span className="capitalize font-bold text-amber-200">
                {booking.eventType.replace('_', ' ')}
              </span>
              <span className="text-slate-400">&bull;</span>
              <span className="flex items-center gap-1 text-[11px] text-slate-300">
                <Users className="w-3 h-3 text-slate-400" />
                {booking.guestCount || 200} Guests
              </span>
            </div>

            {/* Quick Contact Actions (Direct Call / WhatsApp) */}
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5 justify-between">
              <span className="font-mono text-xs font-semibold text-slate-200 truncate">
                {booking.phone}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={`tel:${booking.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-emerald-400 transition-colors"
                  title="Call Client"
                >
                  <Phone className="w-3 h-3" />
                </a>
                <a
                  href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(booking.clientName)}%2C%20regarding%20your%20SBL%20Events%20booking%20Ref%20${booking.referenceNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded-md bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 transition-colors"
                  title="WhatsApp Client"
                >
                  <MessageCircle className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Selected Services Badges */}
          <div className="flex flex-wrap gap-1 pt-1">
            {orderedServicesList.slice(0, 3).map((srv) => (
              <span
                key={srv.id}
                className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 truncate max-w-[140px]"
                title={srv.title}
              >
                {srv.title}
              </span>
            ))}
            {orderedServicesList.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold">
                +{orderedServicesList.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* EXPANDED SPECIFICATIONS DRAWER */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-white/10 space-y-3 overflow-hidden text-xs"
            >
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Full Equipment Specifications
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {orderedServicesList.map((srv) => (
                    <div
                      key={srv.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/5 text-[11px]"
                    >
                      <span className="font-semibold text-white">{srv.title}</span>
                      <span className="text-amber-300 font-mono font-bold">
                        {formatUGX(srv.basePrice)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {booking.customRequests && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200">
                  <strong className="block text-white mb-0.5">Client Special Requests:</strong>
                  {booking.customRequests}
                </div>
              )}

              {/* Quick Status Buttons */}
              <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                {booking.status !== 'confirmed' && (
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm &amp; Place in Calendar</span>
                  </button>
                )}
                {booking.status !== 'completed' && (
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(booking.id, 'completed')}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/30 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Mark Completed
                  </button>
                )}
                {booking.status !== 'cancelled' && (
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Footer Actions Strip */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onToggleExpand}
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white font-semibold cursor-pointer py-1"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Hide Specs</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                <span>View Full Specs</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onViewEmail(booking)}
              className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 transition-colors cursor-pointer"
              title="View / Send Client Email Receipt"
            >
              <Mail className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onViewDetails(booking)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors cursor-pointer"
              title="Full Booking Modal"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {/* Direct Delete Button (Accessible fallback alongside swipe-to-delete) */}
            <button
              type="button"
              onClick={() => onDeleteRequest(booking)}
              className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 transition-colors cursor-pointer group/del"
              title="Delete Booking (or swipe card left)"
            >
              <Trash2 className="w-3.5 h-3.5 group-hover/del:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
