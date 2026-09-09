import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EventType } from '../types';
import { COMPANY_CONTACT_INFO } from '../data/mockData';
import { 
  validateBookingDate, 
  getTodayDateString, 
  DateValidationResult 
} from '../utils/bookingDateUtils';
import { 
  sanitizeInput, 
  sanitizeEmail, 
  sanitizePhone,
  isHoneypotTriggered,
  checkBookingRateLimit
} from '../utils/security';
import { 
  X, 
  Check, 
  Calendar, 
  MessageCircle, 
  Phone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Copy,
  CheckCheck,
  Mail,
  AlertTriangle,
  CalendarX,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export const QuickBookingModal: React.FC = () => {
  const { 
    isBookingModalOpen, 
    closeBookingModal, 
    bookingPrefill, 
    services, 
    addBooking,
    eventCategories,
    triggerMockEmailConfirmation,
    bookings,
    calendarEvents,
    bufferDaysBefore,
    bufferDaysAfter,
    setCurrentPage,
    showToast
  } = useApp();

  const [submittedBooking, setSubmittedBooking] = useState<{
    referenceNumber: string;
    clientName: string;
    phone: string;
    eventType: string;
    eventDate: string;
    location: string;
    durationDays?: number;
    guestCount?: number;
    selectedServices?: string[];
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Form State
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [eventDate, setEventDate] = useState('');
  const [durationDays, setDurationDays] = useState(1);
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState(300);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customRequests, setCustomRequests] = useState('');

  const todayDate = useMemo(() => getTodayDateString(), []);

  // Real-time Date Validation
  const dateValidation: DateValidationResult | null = useMemo(() => {
    if (!eventDate) return null;
    return validateBookingDate(
      eventDate,
      durationDays,
      bookings,
      calendarEvents,
      bufferDaysBefore,
      bufferDaysAfter
    );
  }, [eventDate, durationDays, bookings, calendarEvents, bufferDaysBefore, bufferDaysAfter]);

  // Prefill when opened
  useEffect(() => {
    if (isBookingModalOpen) {
      setSubmittedBooking(null);
      setCopied(false);
      if (bookingPrefill?.serviceId) {
        setSelectedServices([bookingPrefill.serviceId]);
      } else if (selectedServices.length === 0) {
        setSelectedServices(['mega-tents', 'intelligent-lighting', 'mobile-disco-sound']);
      }
      if (bookingPrefill?.date) {
        setEventDate(bookingPrefill.date);
      } else if (!eventDate) {
        const d = new Date();
        d.setDate(d.getDate() + 14);
        setEventDate(d.toISOString().split('T')[0]);
      }
    }
  }, [isBookingModalOpen, bookingPrefill]);

  // Keyboard shortcut listener (ESC to close)
  useEffect(() => {
    if (!isBookingModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeBookingModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBookingModalOpen, closeBookingModal]);

  if (!isBookingModalOpen) return null;

  const toggleService = (sId: string) => {
    setSelectedServices((prev) =>
      prev.includes(sId) ? prev.filter((id) => id !== sId) : [...prev, sId]
    );
  };

  const handleCopyRef = () => {
    if (submittedBooking?.referenceNumber && navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(submittedBooking.referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 0. Anti-bot honeypot check
    if (isHoneypotTriggered(honeypot)) {
      return;
    }

    // 1. Rate limiting check
    const rateCheck = checkBookingRateLimit(false);
    if (!rateCheck.allowed) {
      showToast('Rate Limit Active', rateCheck.message || `Please wait ${rateCheck.remainingSeconds}s before submitting.`, 'warning');
      return;
    }

    if (!clientName || !phone || !eventDate || selectedServices.length === 0) {
      showToast('Missing Fields', 'Please complete contact details, event date, and services.', 'warning');
      return;
    }

    if (dateValidation && !dateValidation.isValid) {
      if (dateValidation.status === 'past') {
        showToast('Past Date', 'Cannot book past dates. Please pick an upcoming date.', 'error');
        return;
      }
      if (dateValidation.status === 'unavailable' || dateValidation.status === 'buffer') {
        showToast('Date Unavailable', dateValidation.message, 'error');
        return;
      }
    }

    const sanitizedName = sanitizeInput(clientName);
    const sanitizedPhone = sanitizePhone(phone);
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedLocation = sanitizeInput(location);
    const sanitizedRequests = sanitizeInput(customRequests);

    const newBooking = addBooking({
      clientName: sanitizedName,
      email: sanitizedEmail || `${sanitizedName.toLowerCase().replace(/[^a-z0-9]/g, '')}@client.com`,
      phone: sanitizedPhone,
      companyName: '',
      eventType,
      eventDate,
      durationDays,
      location: sanitizedLocation || 'Uganda Event Venue',
      venueType: 'outdoor_grass',
      guestCount,
      selectedServices,
      addons: [],
      customRequests: sanitizedRequests,
      isQuickBooking: true,
    });

    if (newBooking) {
      setSubmittedBooking({
        referenceNumber: newBooking.referenceNumber,
        clientName: newBooking.clientName,
        phone: newBooking.phone,
        eventType: newBooking.eventType,
        eventDate: newBooking.eventDate,
        location: newBooking.location,
        durationDays: newBooking.durationDays,
        guestCount: newBooking.guestCount,
        selectedServices: newBooking.selectedServices,
      });

      // Confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#ffffff'],
          zIndex: 9999,
        });
      } catch {
        // ignore
      }
    }
  };

  const whatsappMessage = submittedBooking
    ? encodeURIComponent(
        `Hello SBL Events! I just submitted an inquiry.\n\n*Reference:* ${submittedBooking.referenceNumber}\n*Name:* ${submittedBooking.clientName}\n*Event:* ${submittedBooking.eventType}\n*Date:* ${submittedBooking.eventDate}\n*Location:* ${submittedBooking.location}\n\nPlease confirm availability and details.`
      )
    : '';

  return (
    <AnimatePresence>
      <div 
        id="quick-booking-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeBookingModal();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-lg w-full rounded-2xl overflow-hidden border border-amber-500/30 bg-[#0B1322] text-white shadow-2xl my-6 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-[#060B14] border-b border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={closeBookingModal}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-amber-400/20 text-slate-200 hover:text-amber-300 flex items-center gap-1 text-xs font-bold border border-white/15 cursor-pointer transition-colors"
                title="Back"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-300" />
                <h2 className="text-sm sm:text-base font-black font-['Outfit'] text-white">
                  {submittedBooking ? 'Reservation Inquiry Received' : 'Reserve Equipment & Services'}
                </h2>
              </div>
            </div>

            <button
              onClick={closeBookingModal}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-amber-400/20 text-slate-300 hover:text-amber-300 transition-all cursor-pointer flex items-center justify-center"
              title="Close modal (Esc)"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Success Screen */}
          {submittedBooking ? (
            <div className="p-5 sm:p-6 text-center space-y-4">
              <div className="relative flex items-center justify-center pt-1">
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute w-16 h-16 rounded-full bg-amber-400/25"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 border border-amber-300 flex items-center justify-center shadow-lg relative z-10 text-slate-950"
                >
                  <Check className="w-7 h-7 stroke-[3]" />
                </motion.div>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold font-['Outfit'] text-white">Thank you, {submittedBooking.clientName}!</h3>
                <p className="text-xs text-slate-300">
                  Your reservation request has been logged. Our dispatch team will verify equipment and contact you shortly.
                </p>
              </div>

              {/* Reference Card */}
              <div className="p-3 rounded-xl bg-[#060B14] border border-amber-500/20 flex items-center justify-between gap-3 text-left">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Reference Code
                  </span>
                  <span className="text-sm font-mono font-bold text-amber-300">
                    {submittedBooking.referenceNumber}
                  </span>
                </div>
                <button
                  onClick={handleCopyRef}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-amber-400/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5 border border-white/15 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-300" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <a
                  href={`https://wa.me/${COMPANY_CONTACT_INFO.whatsapp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Dispatch</span>
                </a>
                <button
                  onClick={() => {
                    triggerMockEmailConfirmation({
                      referenceNumber: submittedBooking.referenceNumber,
                      clientName: submittedBooking.clientName,
                      phone: submittedBooking.phone,
                      eventType: submittedBooking.eventType,
                      eventDate: submittedBooking.eventDate,
                      location: submittedBooking.location,
                      durationDays: submittedBooking.durationDays,
                      guestCount: submittedBooking.guestCount,
                      selectedServices: submittedBooking.selectedServices,
                    });
                    closeBookingModal();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-slate-950" />
                  <span>View Receipt</span>
                </button>
              </div>
            </div>
          ) : (
            /* Direct Booking Form */
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs">
              {/* Anti-Bot Honeypot Protection */}
              <input
                type="text"
                name="quick_booking_security"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden opacity-0 pointer-events-none absolute -left-[9999px]"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-slate-200 font-semibold">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Bosco"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full h-10 bg-[#060B14] border border-white/20 rounded-xl px-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-200 font-semibold">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0752420911"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 bg-[#060B14] border border-white/20 rounded-xl px-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <label className="text-slate-200 font-semibold">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full h-10 bg-[#060B14] border border-white/20 rounded-xl px-2.5 text-white focus:outline-hidden focus:border-amber-400 cursor-pointer"
                  >
                    {eventCategories && eventCategories.filter(c => c.active).length > 0 ? (
                      eventCategories.filter(c => c.active).map(cat => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="wedding">Wedding / Kwanjula</option>
                        <option value="corporate">Corporate Gala</option>
                        <option value="concert">Concert / Stage</option>
                        <option value="b2b-lending">B2B Hire</option>
                        <option value="private">Private Event</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Event Date with Live Validation */}
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-slate-200 font-semibold">Event Date *</label>
                  <input
                    type="date"
                    required
                    min={todayDate}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className={`w-full h-10 bg-[#060B14] border rounded-xl px-2.5 text-white focus:outline-hidden transition-all ${
                      dateValidation
                        ? dateValidation.isValid
                          ? 'border-emerald-400 bg-emerald-950/20'
                          : 'border-rose-400 bg-rose-950/30'
                        : 'border-white/20 focus:border-amber-400'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-200 font-semibold">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Math.max(1, Number(e.target.value)))}
                    className="w-full h-10 bg-[#060B14] border border-white/20 rounded-xl px-3 text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Date validation message with animation */}
              <AnimatePresence mode="wait">
                {dateValidation && (
                  <motion.div
                    key={dateValidation.status + eventDate + durationDays}
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {dateValidation.status === 'valid' && (
                      <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-400/40 text-emerald-300 text-[11px] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Date available for booking & transport dispatch.</span>
                      </div>
                    )}
                    {dateValidation.status === 'past' && (
                      <div className="p-2 rounded-lg bg-rose-950/80 border border-rose-400/50 text-rose-200 text-[11px] flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>Past date selected. Please pick today or a future date.</span>
                      </div>
                    )}
                    {(dateValidation.status === 'unavailable' || dateValidation.status === 'buffer') && (
                      <div className="p-2 rounded-lg bg-rose-950/80 border border-rose-400/50 text-rose-200 text-[11px] flex items-start gap-1.5">
                        <CalendarX className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <span className="font-bold">Unavailable Date: </span>
                          <span>{dateValidation.message}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-slate-200 font-semibold">Location / Venue *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Masaka / Kampala"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-10 bg-[#060B14] border border-white/20 rounded-xl px-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-200 font-semibold">
                    <span>Guests:</span>
                    <span className="text-amber-300 font-mono">{guestCount}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full accent-amber-400 mt-2"
                  />
                </div>
              </div>

              {/* Services Checkboxes */}
              <div className="space-y-1 pt-1">
                <label className="text-slate-200 font-semibold block">Select Services Needed *</label>
                <div className="grid grid-cols-2 gap-1.5 max-h-28 overflow-y-auto pr-1">
                  {services.map((s) => {
                    const isSelected = selectedServices.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleService(s.id)}
                        className={`p-2 rounded-xl border text-left transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold border-amber-300 shadow-sm'
                            : 'bg-[#060B14] text-slate-300 border-white/15 hover:border-amber-400/40'
                        }`}
                      >
                        <span className="truncate text-[11px]">{s.title}</span>
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                          isSelected ? 'bg-slate-950 text-amber-400 border-transparent' : 'border-white/30'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-bold text-xs transition-colors cursor-pointer border border-white/15 flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back / Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={dateValidation ? !dateValidation.isValid : false}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    dateValidation && !dateValidation.isValid
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/25'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve Date</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
