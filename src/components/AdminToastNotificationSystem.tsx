import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Phone, 
  Clock, 
  Zap, 
  ArrowRight, 
  ExternalLink,
  DollarSign,
  Users,
  Sparkles,
  ShieldAlert,
  Star,
  MessageSquare,
  Sliders,
  UserCheck,
  History
} from 'lucide-react';
import { AdminLiveAlert, Booking, CallbackRequest, Testimonial } from '../types';
import { formatUGX } from '../utils/currencyUtils';

interface AdminToastNotificationProps {
  alerts: AdminLiveAlert[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  onReviewBooking?: (booking: Booking) => void;
  onQuickConfirm?: (bookingId: string) => void;
  onCallClient?: (phone: string, callbackId?: string) => void;
  onApproveReview?: (testimonialId: string) => void;
  onViewCallbacks?: () => void;
  onViewActivityLogs?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const AdminToastNotificationSystem: React.FC<AdminToastNotificationProps> = ({
  alerts,
  onDismiss,
  onClearAll,
  onReviewBooking,
  onQuickConfirm,
  onCallClient,
  onApproveReview,
  onViewCallbacks,
  onViewActivityLogs,
  onNavigateTab
}) => {
  if (alerts.length === 0) return null;

  return (
    <div
      id="admin-toast-portal"
      className="fixed top-20 right-4 sm:right-8 z-50 flex flex-col gap-3.5 max-w-sm sm:max-w-md w-full pointer-events-none"
    >
      <AnimatePresence>
        {alerts.map((alert) => {
          const category = alert.category || (alert.booking ? 'booking' : 'general');
          const b = alert.booking;
          const cb = alert.callback;
          const test = alert.testimonial;

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -25, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 350, damping: 26 }}
              className="pointer-events-auto rounded-3xl border-2 border-amber-400/60 bg-[#0A1628]/95 p-4 sm:p-5 text-white shadow-2xl backdrop-blur-2xl ring-1 ring-white/15 overflow-hidden relative group"
            >
              {/* Top Accent Gradient & Shimmer Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                category === 'callback'
                  ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400'
                  : category === 'review'
                  ? 'bg-gradient-to-r from-amber-400 via-pink-400 to-amber-400'
                  : category === 'settings'
                  ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400'
                  : 'bg-gradient-to-r from-amber-400 via-sky-400 to-amber-400'
              } animate-shimmer-sweep`} />

              {/* Header Badge & Close Button */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      category === 'callback' ? 'bg-emerald-400' : category === 'review' ? 'bg-amber-400' : 'bg-amber-400'
                    }`} />
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${
                      category === 'callback' ? 'bg-emerald-500' : category === 'review' ? 'bg-amber-500' : 'bg-amber-500'
                    }`} />
                  </span>

                  {/* Badge Label by Category */}
                  {category === 'callback' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-300" />
                      <span>Urgent Callback Request</span>
                    </span>
                  )}
                  {category === 'review' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                      <span>New Client Review</span>
                    </span>
                  )}
                  {category === 'booking' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-300" />
                      <span>Booking Notification</span>
                    </span>
                  )}
                  {category === 'settings' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-blue-300" />
                      <span>Settings Modified</span>
                    </span>
                  )}
                  {category === 'login' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-sky-300" />
                      <span>Staff Authenticated</span>
                    </span>
                  )}

                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timestamp}</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onDismiss(alert.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* CONTENT BY CATEGORY */}

              {/* 1. BOOKING ALERT */}
              {category === 'booking' && b && (
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-1.5">
                        <span>{b.clientName}</span>
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-300">
                        <span className="font-mono font-bold text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 text-[11px]">
                          #{b.referenceNumber}
                        </span>
                        <a 
                          href={`tel:${b.phone}`}
                          className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>{b.phone}</span>
                        </a>
                      </div>
                    </div>

                    {b.estimatedTotal && (
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">Estimated</span>
                        <span className="font-mono font-black text-amber-300 text-xs sm:text-sm">
                          {formatUGX(b.estimatedTotal)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event Highlights Pill Box */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">{b.eventDate} ({b.durationDays || 1}d)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{b.location || 'Uganda Venue'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate capitalize">{b.eventType.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{b.guestCount} Guests</span>
                    </div>
                  </div>

                  {b.customRequests && (
                    <p className="text-[11px] text-slate-300 italic line-clamp-1 bg-white/5 px-2 py-1 rounded">
                      "{b.customRequests}"
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    {onReviewBooking && (
                      <button
                        type="button"
                        onClick={() => {
                          onReviewBooking(b);
                          onDismiss(alert.id);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                      >
                        <span>Review in Bookings</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {onQuickConfirm && (
                      <button
                        type="button"
                        onClick={() => {
                          onQuickConfirm(b.id);
                          onDismiss(alert.id);
                        }}
                        className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                        title="Mark status as confirmed instantly"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Confirm</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDismiss(alert.id)}
                      className="py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
                      title="Dismiss"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* 2. CALLBACK ALERT */}
              {category === 'callback' && (
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-1.5">
                        <span>{cb?.clientName || alert.title || 'Prospective Client'}</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {alert.message || 'Client requested immediate phone callback regarding upcoming event.'}
                      </p>
                    </div>
                  </div>

                  {cb && (
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Direct Phone:</span>
                        <a 
                          href={`tel:${cb.phone}`}
                          className="font-bold text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{cb.phone}</span>
                        </a>
                      </div>
                      {cb.eventInterest && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Interest:</span>
                          <span className="text-slate-200 font-semibold">{cb.eventInterest}</span>
                        </div>
                      )}
                      {cb.preferredTime && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Preferred Time:</span>
                          <span className="text-slate-200 font-mono">{cb.preferredTime}</span>
                        </div>
                      )}
                      {cb.notes && (
                        <p className="text-slate-300 italic pt-1 border-t border-white/5 line-clamp-2">
                          "{cb.notes}"
                        </p>
                      )}
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-2">
                    {cb?.phone && (
                      <a
                        href={`tel:${cb.phone}`}
                        onClick={() => {
                          if (onCallClient) onCallClient(cb.phone, cb.id);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Client Now</span>
                      </a>
                    )}

                    {(onViewCallbacks || onNavigateTab) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (onViewCallbacks) onViewCallbacks();
                          else if (onNavigateTab) onNavigateTab('callbacks');
                          onDismiss(alert.id);
                        }}
                        className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <span>View Callbacks</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDismiss(alert.id)}
                      className="py-2 px-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* 3. REVIEW / TESTIMONIAL ALERT */}
              {category === 'review' && (
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-white">
                        {test?.author || alert.title || 'Client Review'}
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {test?.companyOrEvent || alert.message}
                      </p>
                    </div>

                    {test && (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= test.rating 
                                ? 'text-amber-400 fill-amber-400' 
                                : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {test && (
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 italic">
                      "{test.content}"
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-2">
                    {test && onApproveReview && (
                      <button
                        type="button"
                        onClick={() => {
                          onApproveReview(test.id);
                          onDismiss(alert.id);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Review</span>
                      </button>
                    )}

                    {onNavigateTab && (
                      <button
                        type="button"
                        onClick={() => {
                          onNavigateTab('testimonials');
                          onDismiss(alert.id);
                        }}
                        className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <span>Reviews Tab</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDismiss(alert.id)}
                      className="py-2 px-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* 4. SETTINGS / LOGIN / GENERAL AUDIT ALERT */}
              {(category === 'settings' || category === 'login' || category === 'general') && (
                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-white">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="pt-2 flex items-center gap-2">
                    {(onViewActivityLogs || onNavigateTab) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (onViewActivityLogs) onViewActivityLogs();
                          else if (onNavigateTab) onNavigateTab('activity_logs');
                          onDismiss(alert.id);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>Open Activity Logs</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDismiss(alert.id)}
                      className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

