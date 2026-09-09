import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  CheckCircle2, 
  Copy, 
  CheckCheck, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Phone, 
  ShieldCheck, 
  Printer, 
  RotateCw, 
  ExternalLink,
  Crown,
  Sparkles,
  Layers,
  ChevronLeft
} from 'lucide-react';
import { COMPANY_CONTACT_INFO, sblBusinessCardImg } from '../data/mockData';

export interface EmailConfirmationData {
  referenceNumber: string;
  clientName: string;
  email?: string;
  phone: string;
  eventType: string;
  eventDate: string;
  location: string;
  durationDays?: number;
  guestCount?: number;
  selectedServices?: string[];
  customRequests?: string;
  createdAt?: string;
}

interface EmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: EmailConfirmationData | null;
  onResendEmail?: (email: string) => void;
}

export const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  isOpen,
  onClose,
  bookingData,
  onResendEmail,
}) => {
  const [copied, setCopied] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen || !bookingData) return null;

  const targetEmail = customEmail || bookingData.email || `${bookingData.clientName.toLowerCase().replace(/\s+/g, '')}@client.com`;
  const formattedDate = bookingData.createdAt || new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleCopyRef = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(bookingData.referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleResend = () => {
    setIsResending(true);
    setResendSuccess(false);

    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
      if (onResendEmail) {
        onResendEmail(targetEmail);
      }
      setTimeout(() => setResendSuccess(false), 3500);
    }, 900);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div 
        id="mock-email-confirmation-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-2xl w-full rounded-3xl overflow-hidden border border-white/20 bg-[#0C1A30] text-slate-100 shadow-2xl my-6 flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Email Header Bar */}
          <div className="p-4 sm:p-5 bg-[#081324] border-b border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={onClose}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors border border-white/15 flex items-center gap-1 text-xs font-bold shrink-0 cursor-pointer"
                title="Back"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-white truncate font-['Outfit']">
                    Booking Confirmation Email
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                    Dispatched
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">
                  Sent to <span className="text-pink-300 font-semibold">{targetEmail}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handlePrint}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors border border-white/10 hidden sm:flex items-center gap-1 text-xs"
                title="Print Confirmation Receipt"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/25 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Email Body Scroll Area */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
            {/* Simulated Email Envelope Header */}
            <div className="p-4 rounded-2xl bg-[#112442] border border-white/15 space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-300">
                <div><strong className="text-white">From:</strong> SBL Events Dispatch Operations &lt;najibshafiq@sblevents.com&gt;</div>
                <div className="text-slate-400 text-[11px]">{formattedDate}</div>
              </div>
              <div className="text-slate-300">
                <strong className="text-white">To:</strong> {bookingData.clientName} &lt;{targetEmail}&gt;
              </div>
              <div className="text-slate-200">
                <strong className="text-white">Subject:</strong> 🌟 Booking Confirmation: Reference #{bookingData.referenceNumber} - SBL Events Uganda
              </div>
            </div>

            {/* Email Body Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0F223D] border border-white/20 space-y-6 shadow-inner">
              {/* Brand Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-white/10 text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white p-0.5 flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/20">
                    <img 
                      src={sblBusinessCardImg} 
                      alt="SBL Events Uganda" 
                      className="w-full h-full object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base sm:text-lg text-white font-['Outfit'] tracking-tight">
                      SBL EVENTS UGANDA
                    </h4>
                    <p className="text-[11px] text-amber-300 font-semibold">
                      Lwengo &middot; Masaka &middot; Kampala &middot; Western &middot; Countrywide
                    </p>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                    Official Reference Code
                  </span>
                  <div className="inline-flex items-center gap-2 mt-0.5">
                    <span className="text-base sm:text-lg font-mono font-black text-amber-300 bg-amber-400/10 px-3 py-1 rounded-xl border border-amber-400/30">
                      {bookingData.referenceNumber}
                    </span>
                    <button
                      onClick={handleCopyRef}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Copy Reference"
                    >
                      {copied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Greeting */}
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white font-['Outfit']">
                  Dear {bookingData.clientName},
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Thank you for choosing <strong>SBL Events Uganda</strong> to design and power your dream celebration. We have received your booking request and assigned reference number <strong className="text-amber-300 font-mono">#{bookingData.referenceNumber}</strong>.
                </p>
              </div>

              {/* Key Reservation Specifications */}
              <div className="space-y-3">
                <h5 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Reservation & Event Specifications</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-[#091526] border border-white/10 flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Event Date</span>
                      <span className="text-xs font-bold text-white">{bookingData.eventDate} ({bookingData.durationDays || 1} day duration)</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#091526] border border-white/10 flex items-start gap-2.5">
                    <Layers className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Event Type</span>
                      <span className="text-xs font-bold text-white capitalize">{bookingData.eventType.replace(/_/g, ' ')}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#091526] border border-white/10 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Venue Location</span>
                      <span className="text-xs font-bold text-white truncate max-w-[180px]">{bookingData.location}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#091526] border border-white/10 flex items-start gap-2.5">
                    <Users className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Expected Attendance</span>
                      <span className="text-xs font-bold text-white">{bookingData.guestCount || 300} Guests</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Services breakdown */}
              {bookingData.selectedServices && bookingData.selectedServices.length > 0 && (
                <div className="space-y-2.5">
                  <h5 className="text-xs font-extrabold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Requested Equipment & Production Fleet</span>
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {bookingData.selectedServices.map((srv, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-[#081324] border border-white/15 text-xs text-slate-200 font-medium capitalize"
                      >
                        ✓ {srv.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Operational Steps */}
              <div className="p-4 rounded-2xl bg-[#0A182E] border border-emerald-500/20 space-y-3">
                <h5 className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Next Steps & Dispatch Guarantee</span>
                </h5>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 leading-relaxed">
                  <li><strong>Date Lock:</strong> Our Lwengo production manager verifies equipment route logistics and locks the date with 2-day buffer rigging time.</li>
                  <li><strong>Custom Quote:</strong> We generate your transparent formal quotation tailored to your guest size and power requirements.</li>
                  <li><strong>Site Visit / Rigging Team:</strong> For large clear-span marquees and heavy line arrays, an SBL technician contacts you to coordinate site ground anchors.</li>
                </ol>
              </div>

              {/* Hotline Contact Footer */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
                <div>
                  <p className="font-semibold text-white">SBL Events Uganda Operations</p>
                  <p className="text-[11px] text-slate-400">Headquarters: Masaka - Mbarara Highway, Lwengo Town</p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${COMPANY_CONTACT_INFO.phone}`}
                    className="text-blue-300 hover:text-white font-bold flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{COMPANY_CONTACT_INFO.phone}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Resend Action Bar */}
            <div className="p-4 rounded-2xl bg-[#081324] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Mail className="w-4 h-4 text-pink-300 shrink-0" />
                <span>Didn&apos;t receive this in your inbox? Check spam folder or resend:</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  id="mock-email-resend-btn"
                  onClick={handleResend}
                  disabled={isResending}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                  <span>{isResending ? 'Sending...' : resendSuccess ? 'Email Resent!' : 'Resend Email Confirmation'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-[#081324] border-t border-white/10 flex items-center justify-between gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-bold text-xs transition-colors cursor-pointer border border-white/15 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white text-[#0F1F38] hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
            >
              Done & Close Preview
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
