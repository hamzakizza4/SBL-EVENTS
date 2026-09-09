import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  COMPANY_CONTACT_INFO, 
  sblBusinessCardImg, 
  bookingBannerBgImg,
  weddingVipGlassLoungeImg,
  sblMegaTentImg,
  sblHallStageStockImg
} from '../data/mockData';
import { EventType } from '../types';
import { getThemeClasses } from '../utils/themeStyles';
import { CelebrationSuccessModal } from './CelebrationSuccessModal';
import { GeometricHeroBanner } from './GeometricHeroBanner';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollReveal';
import { 
  validateBookingDate, 
  getTodayDateString, 
  DateValidationResult 
} from '../utils/bookingDateUtils';
import { 
  sanitizeInput, 
  sanitizeEmail, 
  sanitizePhone, 
  checkContactRateLimit, 
  recordContactSubmission, 
  isDuplicatePayload,
  isHoneypotTriggered,
  checkBookingRateLimit
} from '../utils/security';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Calendar, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Check,
  Sparkles,
  AlertTriangle,
  CalendarX,
  Clock,
  ArrowRight,
  Zap,
  Users,
  Layers,
  Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ContactBookingView: React.FC = () => {
  const { 
    services, 
    addBooking, 
    showToast, 
    theme, 
    setCurrentPage,
    bookings,
    calendarEvents,
    eventCategories,
    bufferDaysBefore,
    bufferDaysAfter
  } = useApp();
  const t = getThemeClasses(theme);

  const [activeTab, setActiveTab] = useState<'booking' | 'inquiry'>('booking');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Booking Form State
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [eventDate, setEventDate] = useState('');
  const [durationDays, setDurationDays] = useState(1);
  const [location, setLocation] = useState('');
  const [venueType, setVenueType] = useState<'outdoor_grass' | 'outdoor_concrete' | 'indoor_hall' | 'beach' | 'private_compound'>('outdoor_grass');
  const [guestCount, setGuestCount] = useState(400);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'mega-tents',
    'intelligent-lighting',
    'mobile-disco-sound',
  ]);
  const [powerRequirement, setPowerRequirement] = useState<'generator_needed' | 'venue_power_available' | 'unsure'>('generator_needed');
  const [customRequests, setCustomRequests] = useState('');
  
  // Success & Celebration Modal State
  const [isSuccess, setIsSuccess] = useState<string | null>(null);
  const [celebrationData, setCelebrationData] = useState<{
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
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  // Simple Inquiry Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquirySubject, setInquirySubject] = useState('General Equipment Rental');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryHoneypot, setInquiryHoneypot] = useState('');
  const [bookingHoneypot, setBookingHoneypot] = useState('');

  const todayDate = useMemo(() => getTodayDateString(), []);

  // Real-time Date Validation for past dates and calendar unavailabilities
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

  const toggleService = (sId: string) => {
    setSelectedServices((prev) =>
      prev.includes(sId) ? prev.filter((id) => id !== sId) : [...prev, sId]
    );
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 0. Anti-bot honeypot check
    if (isHoneypotTriggered(bookingHoneypot)) {
      return;
    }

    // 1. Rate limit pre-check
    const rateCheck = checkBookingRateLimit(false);
    if (!rateCheck.allowed) {
      showToast('Rate Limit Active', rateCheck.message || `Please wait ${rateCheck.remainingSeconds}s before booking.`, 'warning');
      return;
    }

    if (!clientName || !phone || !eventDate || selectedServices.length === 0) {
      showToast('Missing Fields', 'Please complete required contact details, event date, and services.', 'warning');
      return;
    }

    // Enforce real-time date validation
    if (dateValidation && !dateValidation.isValid) {
      if (dateValidation.status === 'past') {
        showToast('Invalid Date', 'Past dates cannot be selected. Please pick an upcoming date.', 'error');
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
    const sanitizedCompany = sanitizeInput(companyName);
    const sanitizedLocation = sanitizeInput(location);
    const sanitizedRequests = sanitizeInput(customRequests);

    const newBooking = addBooking({
      clientName: sanitizedName,
      email: sanitizedEmail || `${sanitizedName.toLowerCase().replace(/[^a-z0-9]/g, '')}@client.com`,
      phone: sanitizedPhone,
      companyName: sanitizedCompany,
      eventType,
      eventDate,
      durationDays,
      location: sanitizedLocation || 'Lwengo / Masaka / Kampala / Uganda',
      venueType,
      guestCount,
      selectedServices,
      addons: [],
      customRequests: sanitizedRequests,
      powerRequirement,
    });

    if (newBooking) {
      setIsSuccess(newBooking.referenceNumber);
      setCelebrationData({
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
      setIsCelebrationOpen(true);
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 0. Anti-bot honeypot check
    if (isHoneypotTriggered(inquiryHoneypot)) {
      setInquirySent(true);
      return;
    }

    // 1. Rate limiting check (max 3 inquiries per 120s)
    const rateCheck = checkContactRateLimit(false);
    if (!rateCheck.allowed) {
      showToast('Rate Limit Active', rateCheck.message || `Please wait ${rateCheck.remainingSeconds}s before submitting.`, 'warning');
      return;
    }

    if (!inquiryName || !inquiryPhone || !inquiryMessage) {
      showToast('Missing Fields', 'Please provide your name, phone number, and message.', 'warning');
      return;
    }
    
    const sanitizedInqName = sanitizeInput(inquiryName);
    const sanitizedInqPhone = sanitizePhone(inquiryPhone);
    const sanitizedInqMsg = sanitizeInput(inquiryMessage);

    // 2. Duplicate submission prevention
    const sig = `${sanitizedInqName}_${sanitizedInqPhone}_${sanitizedInqMsg}`;
    if (isDuplicatePayload('inquiry', sig, 30)) {
      showToast('Inquiry Received', 'Your inquiry was already submitted a moment ago. Our dispatch team is reviewing it!', 'info');
      return;
    }

    // Record submission to decrement rate limit bucket
    recordContactSubmission();

    const inquiryRef = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    setCelebrationData({
      referenceNumber: inquiryRef,
      clientName: sanitizedInqName,
      phone: sanitizedInqPhone,
      eventType: inquirySubject,
      eventDate: 'Flexible / In Discussion',
      location: 'Uganda Area',
      guestCount: 200,
      selectedServices: ['Equipment Consultation', 'Custom Setup'],
    });
    setIsCelebrationOpen(true);
    setInquirySent(true);
    
    setInquiryName('');
    setInquiryPhone('');
    setInquiryEmail('');
    setInquiryMessage('');
  };

  const faqs = [
    {
      q: 'How far in advance should we reserve tents, sound, and lighting?',
      a: 'We recommend booking 2 to 4 weeks ahead. Short-notice requests are accommodated based on fleet availability.'
    },
    {
      q: 'Do you offer B2B equipment lending to event planners?',
      a: 'Yes. We supply tents, heavy box trusses, line-array audio, and mobile restrooms at partner wholesale rates.'
    },
    {
      q: 'How do you secure structures in outdoor weather?',
      a: 'All structures use heavy concrete ballasts on hard ground and industrial anchoring on turf.'
    },
    {
      q: 'Do you provide standby silent generators?',
      a: 'Yes, 50kVA and 100kVA Cummins super-silent diesel generators with automatic transfer switches.'
    },
    {
      q: 'What is included in the VIP Mobile Restroom service?',
      a: 'Porcelain flush units, running water, vanity mirrors, ambient lighting, and dedicated hygiene attendants.'
    }
  ];

  return (
    <div id="contact-booking-view" className="w-full pb-20 space-y-10">
      
      {/* 1. CINEMATIC GEOMETRIC HERO BANNER */}
      <GeometricHeroBanner
        badgeText="Instant Reservation & Real-Time Schedule Check"
        badgeIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
        accentHeading="FAST DISPATCH & RIGGING"
        primaryHeading="BOOK EQUIPMENT & RIGGING"
        description="Lock in verified mega marquees, intelligent lighting trusses, crystal line-array audio, mobile VIP luxury restrooms, and heavy-duty generators with live schedule verification."
        mainImage={bookingBannerBgImg}
        secondaryImage={weddingVipGlassLoungeImg}
        tertiaryImage={sblBusinessCardImg}
        bgPatternImage={bookingBannerBgImg}
        themeVariant="amber"
        primaryCta={{
          label: "WhatsApp Quick Quote",
          href: COMPANY_CONTACT_INFO.whatsappUrl,
          isExternal: true,
          variant: "whatsapp",
          icon: <MessageCircle className="w-4 h-4" />
        }}
        secondaryCta={{
          label: "Call Hotline",
          href: `tel:${COMPANY_CONTACT_INFO.primaryPhone}`,
          icon: <Phone className="w-4 h-4" />
        }}
        customSlot={
          /* Mode Switcher with Smooth Animation */
          <div className="pt-1 flex flex-col sm:flex-row items-center gap-3">
            <div className="p-1 rounded-2xl inline-flex gap-1 border bg-[#050811]/90 backdrop-blur-md border-amber-500/30 shadow-xl">
              <button
                type="button"
                onClick={() => setActiveTab('booking')}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'booking'
                    ? 'text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {activeTab === 'booking' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 rounded-xl shadow-lg shadow-amber-500/25"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reserve Date</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('inquiry')}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'inquiry'
                    ? 'text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {activeTab === 'inquiry' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 rounded-xl shadow-lg shadow-amber-500/25"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Ask a Question</span>
                </span>
              </button>
            </div>
          </div>
        }
        stats={[
          { value: "0% Conflict", label: "Automated Buffer Guard" },
          { value: "50+ Crew", label: "On-Site Dispatch" },
          { value: "15 min", label: "Response Time" }
        ]}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">

      {/* Success Notification */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto p-5 rounded-2xl bg-emerald-950/90 border border-emerald-400/40 text-white space-y-3 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                ✓
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold">Booking Request Dispatched</h3>
                <p className="text-xs text-emerald-200">
                  Ref Code: <span className="font-mono font-extrabold text-amber-300 bg-black/30 px-2 py-0.5 rounded-md ml-1">{isSuccess}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={COMPANY_CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm on WhatsApp</span>
              </a>
              <button
                onClick={() => setIsSuccess(null)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
              >
                Book Another Date
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TAB 1: RESERVATION FORM */}
      {activeTab === 'booking' && !isSuccess && (
        <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Anti-Bot Honeypot Protection */}
          <input
            type="text"
            name="booking_security_check"
            value={bookingHoneypot}
            onChange={(e) => setBookingHoneypot(e.target.value)}
            className="hidden opacity-0 pointer-events-none absolute -left-[9999px]"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          
          {/* Main Form Fields */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Step 1: Contact Details */}
            <div className="bg-[#0B1322] border border-amber-500/20 rounded-2xl p-4 sm:p-6 space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[11px] flex items-center justify-center font-extrabold">1</span>
                  <span>Client &amp; Contact Info</span>
                </h3>
                <span className="text-[10px] text-amber-300/80 font-semibold">Required *</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-200 font-semibold flex items-center gap-1">
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Nalubega"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full h-11 bg-[#060B14] border border-white/20 rounded-xl px-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400 transition-colors"
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
                    className="w-full h-11 bg-[#060B14] border border-white/20 rounded-xl px-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-200 font-semibold">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="sarah@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 bg-[#060B14] border border-white/20 rounded-xl px-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-200 font-semibold">Organization / Family</label>
                  <input
                    type="text"
                    placeholder="e.g. Kato Family / MTN"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full h-11 bg-[#060B14] border border-white/20 rounded-xl px-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Schedule & Live Date Availability Validation */}
            <div className="bg-[#0B1322] border border-amber-500/20 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[11px] flex items-center justify-center font-extrabold">2</span>
                  <span>Date &amp; Location</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentPage('calendar')}
                  className="text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold transition-colors cursor-pointer"
                >
                  <Calendar className="w-3 h-3" />
                  <span>View Calendar</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-200 font-semibold">Event Type *</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full h-11 bg-[#060B14] border border-white/20 rounded-xl px-3 text-white focus:outline-hidden focus:border-amber-400 transition-colors cursor-pointer"
                  >
                    {eventCategories && eventCategories.length > 0 ? (
                      eventCategories.filter(c => c.active).sort((a, b) => a.order - b.order).map((cat) => (
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

                {/* Event Date with Live Validation Indicator */}
                <div className="space-y-1 sm:col-span-1">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-200 font-semibold">Event Date *</label>
                    <span className="text-[10px] text-slate-400">Min: Today</span>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      min={todayDate}
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className={`w-full h-11 bg-[#060B14] border rounded-xl px-3 text-white focus:outline-hidden transition-all ${
                        dateValidation
                          ? dateValidation.isValid
                            ? 'border-emerald-400/80 bg-emerald-950/20'
                            : 'border-rose-400 bg-rose-950/30'
                          : 'border-white/20 focus:border-amber-400'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-200 font-semibold">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Math.max(1, Number(e.target.value)))}
                    className="w-full h-11 bg-[#060B14] border border-white/20 rounded-xl px-3 text-white focus:outline-hidden focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Real-time Date Status Feedback Banner with Clean Animation */}
              <AnimatePresence mode="wait">
                {dateValidation && (
                  <motion.div
                    key={dateValidation.status + eventDate + durationDays}
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    {dateValidation.status === 'valid' && (
                      <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-emerald-200 text-xs flex items-center justify-between gap-2 shadow-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="font-medium truncate">{dateValidation.message}</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 shrink-0">
                          Available
                        </span>
                      </div>
                    )}

                    {dateValidation.status === 'past' && (
                      <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-400/50 text-rose-200 text-xs flex items-start gap-2 shadow-xs">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="font-bold text-rose-100">Past Date Selected</p>
                          <p className="text-[11px] text-rose-200 leading-snug">{dateValidation.message}</p>
                        </div>
                      </div>
                    )}

                    {(dateValidation.status === 'unavailable' || dateValidation.status === 'buffer') && (
                      <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-400/60 text-rose-200 text-xs space-y-2 shadow-sm">
                        <div className="flex items-start gap-2">
                          <CalendarX className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <p className="font-bold text-rose-100">
                              {dateValidation.status === 'buffer' ? 'Mandatory Staging Buffer Day' : 'Date Unavailable'}
                            </p>
                            <p className="text-[11px] text-rose-200 leading-snug">{dateValidation.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-rose-400/20 text-[11px]">
                          <span className="text-rose-300">Please choose an open calendar slot</span>
                          <button
                            type="button"
                            onClick={() => setCurrentPage('calendar')}
                            className="font-bold text-white underline hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Open Schedule Map</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Location & Surface */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-200 font-semibold">Location / Town / Venue *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Masaka, Lwengo, or Kampala"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-11 bg-[#060B14] border border-white/20 rounded-xl px-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-200 font-semibold">Venue Surface</label>
                  <select
                    value={venueType}
                    onChange={(e) => setVenueType(e.target.value as any)}
                    className="w-full h-11 bg-[#060B14] border border-white/20 rounded-xl px-3 text-white focus:outline-hidden focus:border-amber-400 transition-colors cursor-pointer"
                  >
                    <option value="outdoor_grass">Outdoor Lawn / Grass</option>
                    <option value="outdoor_concrete">Paved / Concrete</option>
                    <option value="indoor_hall">Indoor Hall / Auditorium</option>
                    <option value="private_compound">Private Compound</option>
                    <option value="beach">Beach / Lakefront</option>
                  </select>
                </div>
              </div>

              {/* Guest Count Selector */}
              <div className="space-y-2 text-xs pt-1">
                <div className="flex items-center justify-between text-slate-200 font-semibold">
                  <span>Guest Capacity:</span>
                  <span className="font-mono bg-[#060B14] px-2.5 py-0.5 rounded-lg text-amber-300 font-bold border border-amber-500/20">
                    {guestCount} Guests
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="50"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 px-1">
                  <span>50</span>
                  <span>500</span>
                  <span>1,500</span>
                  <span>3,000+</span>
                </div>
              </div>
            </div>

            {/* Step 3: Equipment & Services Grid */}
            <div className="bg-[#0B1322] border border-amber-500/20 rounded-2xl p-4 sm:p-6 space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[11px] flex items-center justify-center font-extrabold">3</span>
                  <span>Select Required Equipment</span>
                </h3>
                <span className="text-[11px] font-bold text-amber-300">{selectedServices.length} Selected</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {services.map((s) => {
                  const isSelected = selectedServices.includes(s.id);
                  return (
                    <motion.button
                      key={s.id}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleService(s.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 border-amber-300 font-black shadow-lg shadow-amber-500/20'
                          : 'bg-[#060B14] text-slate-200 border-white/15 hover:border-amber-400/40'
                      }`}
                    >
                      <div className="truncate min-w-0">
                        <p className="truncate text-xs font-bold">{s.title}</p>
                        <p className={`text-[10px] truncate ${isSelected ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                          {s.tagline}
                        </p>
                      </div>

                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                        isSelected ? 'bg-slate-950 text-amber-400 border-slate-950' : 'border-white/30 bg-white/5'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Power preference pills */}
              <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs">
                <label className="text-slate-200 font-semibold block">Power Supply Setup</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'generator_needed', label: 'Standby Generator' },
                    { id: 'venue_power_available', label: 'Venue Power' },
                    { id: 'unsure', label: 'Need Advice' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPowerRequirement(p.id as any)}
                      className={`py-2 px-1 rounded-xl border text-center text-[11px] font-medium transition-all cursor-pointer ${
                        powerRequirement === p.id
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black border-amber-300 shadow-md'
                          : 'bg-[#060B14] text-slate-300 border-white/15 hover:border-white/30'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-1 text-xs pt-1">
                <label className="text-slate-200 font-semibold">Special Instructions (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Stage height, lighting mood, color theme..."
                  value={customRequests}
                  onChange={(e) => setCustomRequests(e.target.value)}
                  className="w-full bg-[#060B14] border border-white/20 rounded-xl p-2.5 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

          </div>

          {/* Right Summary & Direct Action Column */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            
            {/* Quick Summary Card */}
            <div className="bg-[#0B1322] rounded-2xl p-5 border border-amber-500/30 shadow-2xl text-white space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-['Outfit'] text-white">Reservation Summary</h3>
                  <p className="text-[11px] text-amber-300/90 font-medium">
                    {eventType.toUpperCase()} • {durationDays} Day(s)
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                </div>
              </div>

              <div className="space-y-2 border-t border-b border-white/10 py-3 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Selected Services:</span>
                  <span className="font-bold text-white">{selectedServices.length} Item(s)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Target Guests:</span>
                  <span className="font-bold text-amber-300">{guestCount} Pax</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Rigging &amp; Transport:</span>
                  <span className="font-bold text-emerald-300">Included</span>
                </div>
              </div>

              {/* Submit CTA */}
              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                disabled={dateValidation ? !dateValidation.isValid : false}
                className={`w-full py-3.5 px-4 rounded-xl font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  dateValidation && !dateValidation.isValid
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                    : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/25'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Confirm Reservation Request</span>
              </motion.button>

              <p className="text-[10px] text-slate-400 text-center">
                Instant confirmation code generated upon request.
              </p>
            </div>

            {/* Direct Contact & WhatsApp */}
            <div className="bg-[#0B1322] rounded-2xl p-4 border border-amber-500/20 text-white space-y-3 text-xs shadow-xl">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">Direct Support</span>
                <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  Online
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={COMPANY_CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${COMPANY_CONTACT_INFO.primaryPhone}`}
                  className="py-2.5 px-3 rounded-xl bg-[#060B14] hover:bg-amber-400/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Call Us</span>
                </a>
              </div>

              <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{COMPANY_CONTACT_INFO.email}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{COMPANY_CONTACT_INFO.address}</span>
                </div>
              </div>
            </div>

          </div>

        </form>
      )}

      {/* TAB 2: INQUIRY FORM */}
      {activeTab === 'inquiry' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto"
        >
          <form onSubmit={handleInquirySubmit} className="bg-[#0B1322] rounded-2xl p-5 sm:p-7 border border-amber-500/30 shadow-2xl text-white space-y-4">
            {/* Anti-Bot Honeypot Protection */}
            <input
              type="text"
              name="inquiry_security_check"
              value={inquiryHoneypot}
              onChange={(e) => setInquiryHoneypot(e.target.value)}
              className="hidden opacity-0 pointer-events-none absolute -left-[9999px]"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <div>
              <h3 className="text-lg font-bold font-['Outfit'] text-white">Send a Message</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Questions on custom tent sizes, staging trusses, or B2B peer hire?
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Bosco"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full h-11 bg-[#060B14] border border-white/20 rounded-xl px-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0752420911"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full h-11 bg-[#060B14] border border-white/20 rounded-xl px-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    className="w-full h-11 bg-[#060B14] border border-white/20 rounded-xl px-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Subject</label>
                  <select
                    value={inquirySubject}
                    onChange={(e) => setInquirySubject(e.target.value)}
                    className="w-full h-11 bg-[#060B14] border border-white/20 rounded-xl px-3 text-white focus:outline-hidden focus:border-amber-400 cursor-pointer"
                  >
                    <option value="General Equipment Rental">General Equipment Rental</option>
                    <option value="B2B Tent Lending Wholesale">B2B Tent Lending / Peer Hire</option>
                    <option value="Corporate Event Tender">Corporate Event Tender</option>
                    <option value="Site Inspection Request">Site Inspection Request</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-200">Message *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your equipment needs, dates, or venue..."
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  className="w-full bg-[#060B14] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Quick Message</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* FAQs Section - Clean Accordion */}
      <ScrollReveal className="max-w-2xl mx-auto space-y-3 pt-4" yOffset={30}>
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Frequently Asked Questions</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold font-['Outfit'] text-white">
            Booking &amp; Rental FAQs
          </h3>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-white/15 bg-[#0B1322] rounded-xl overflow-hidden shadow-md transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-3.5 text-left text-xs sm:text-sm font-bold flex items-center justify-between gap-3 text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3.5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-white/10">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </ScrollReveal>

      </div>

      {/* Celebratory Success Modal */}
      <CelebrationSuccessModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        booking={celebrationData}
        onNavigateHome={() => setCurrentPage('home')}
      />

    </div>
  );
};
