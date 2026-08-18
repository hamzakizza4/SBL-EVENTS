import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_CONTACT_INFO, AVAILABLE_ADDONS } from '../data/mockData';
import { EventType, BookingAddon } from '../types';
import { getThemeClasses } from '../utils/themeStyles';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Calendar, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Check
} from 'lucide-react';

export const ContactBookingView: React.FC = () => {
  const { services, addBooking, showToast, theme } = useApp();
  const t = getThemeClasses(theme);

  const [activeTab, setActiveTab] = useState<'booking' | 'inquiry'>('booking');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Full Booking Engine State
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
  const [addons, setAddons] = useState<BookingAddon[]>([
    { id: 'gen-100', name: '100kVA Silent Diesel Generator', price: 350, quantity: 1 }
  ]);
  const [customRequests, setCustomRequests] = useState('');
  const [powerRequirement, setPowerRequirement] = useState<'generator_needed' | 'venue_power_available' | 'unsure'>('generator_needed');
  const [isSuccess, setIsSuccess] = useState<string | null>(null);

  // Simple Inquiry Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquirySubject, setInquirySubject] = useState('General Equipment Rental');
  const [inquiryMessage, setInquiryMessage] = useState('');

  // Calculations
  const servicesTotal = selectedServices.reduce((sum, sId) => {
    const s = services.find((srv) => srv.id === sId);
    return sum + (s ? s.basePrice : 0);
  }, 0) * durationDays;

  const addonsTotal = addons.reduce((sum, a) => sum + a.price * a.quantity, 0) * durationDays;
  const guestScale = guestCount > 500 ? 1.3 : guestCount > 1000 ? 1.6 : 1.0;
  const estimatedTotal = Math.round((servicesTotal * guestScale) + addonsTotal);

  const toggleService = (sId: string) => {
    setSelectedServices((prev) =>
      prev.includes(sId) ? prev.filter((id) => id !== sId) : [...prev, sId]
    );
  };

  const toggleAddon = (addonId: string, name: string, price: number) => {
    setAddons((prev) => {
      const exists = prev.find((a) => a.id === addonId);
      if (exists) {
        return prev.filter((a) => a.id !== addonId);
      } else {
        return [...prev, { id: addonId, name, price, quantity: 1 }];
      }
    });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !phone || !eventDate || selectedServices.length === 0) {
      showToast('Missing Fields', 'Please complete the required contact and event details.', 'warning');
      return;
    }

    const newBooking = addBooking({
      clientName,
      email: email || `${clientName.toLowerCase().replace(/\s+/g, '')}@client.com`,
      phone,
      companyName,
      eventType,
      eventDate,
      durationDays,
      location: location || 'Kampala Region / Client Grounds',
      venueType,
      guestCount,
      selectedServices,
      addons,
      customRequests,
      powerRequirement,
      estimatedTotal,
    });

    setIsSuccess(newBooking.referenceNumber);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone || !inquiryMessage) return;
    showToast(
      'Inquiry Sent Successfully!',
      `Thank you ${inquiryName}. Our desk officer will respond within 30 minutes.`,
      'success'
    );
    setInquiryName('');
    setInquiryPhone('');
    setInquiryEmail('');
    setInquiryMessage('');
  };

  const faqs = [
    {
      q: 'How far in advance should we reserve mega marquees, sound and lighting?',
      a: 'For major wedding weekends and holiday concert dates, we recommend booking 1 to 4 months in advance. However, our large fleet of 25,000+ m² tents allows us to accommodate emergency requests or equipment lending on short notice.'
    },
    {
      q: 'Do you offer B2B tent lending and sub-rentals to other event organizers?',
      a: 'Yes! We actively partner with event planners, decorators, hotels, and venues. You can hire tents (dry-hire or wet-hire with our rigging crew), box truss staging, line arrays, and mobile luxury toilet trailers at discounted wholesale rates.'
    },
    {
      q: 'How do you handle rainy weather and high winds during outdoor events?',
      a: 'All SBL structures are European-engineered with wind load certifications up to 100km/h. We utilize engineered concrete ballast blocks for asphalt/paved surfaces and heavy-duty ground earth augers for lawns. Raised timber cassette flooring prevents mud or water ingress.'
    },
    {
      q: 'What are your power requirements and generator policies?',
      a: 'We operate our own fleet of 50kVA and 100kVA Cummins super-silent diesel generators equipped with automatic transfer switches. We recommend powering sound, LED screens, and heavy lighting independently from municipal power to guarantee zero disruption.'
    },
    {
      q: 'What is included in the VIP Mobile Luxury Restroom service?',
      a: 'Our trailers feature hotel-grade porcelain flush toilets, running fresh water, vanity mirrors, LED lighting, quiet air-conditioning, stereo background music, luxury hand soaps/lotions, and a dedicated uniformed hygiene attendant stationed throughout your celebration.'
    }
  ];

  return (
    <div id="contact-booking-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold shadow-xs">
          <Calendar className="w-4 h-4 text-blue-300" />
          <span>Integrated Booking & Inquiries</span>
        </div>
        <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit'] ${t.headingText}`}>
          Book Your Event Production or Inquire
        </h1>
        <p className={`text-xs sm:text-base leading-relaxed ${t.mutedText}`}>
          Use our interactive booking wizard below to calculate an instant cost estimate and lock in your event date, or contact our production directors directly.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex justify-center">
        <div className="p-1.5 rounded-2xl inline-flex gap-2 border bg-[#152A4A] border-white/15">
          <button
            onClick={() => setActiveTab('booking')}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'booking'
                ? 'bg-white text-[#0F1F38] shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Interactive Event Booking Wizard</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiry')}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'inquiry'
                ? 'bg-white text-[#0F1F38] shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Quick General Inquiry</span>
          </button>
        </div>
      </div>

      {/* SUCCESS BANNER */}
      {isSuccess && (
        <div className="rounded-3xl p-8 bg-[#132644] text-white border border-white/20 shadow-2xl space-y-4 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-white text-[#0F1F38] flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-['Outfit']">Booking Request Dispatched!</h2>
          <p className="text-sm text-slate-200">
            Your booking reference is <strong className="text-white font-mono">{isSuccess}</strong>. Our logistics director is reviewing equipment availability and will call you with your confirmed staging itinerary.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsSuccess(null)}
              className="py-2.5 px-6 rounded-xl bg-white text-[#0F1F38] font-bold text-xs shadow-md"
            >
              Submit Another Booking or Close
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: FULL BOOKING WIZARD */}
      {activeTab === 'booking' && !isSuccess && (
        <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Wizard Form Steps */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Contact Details */}
            <div className={`${t.cardBg} border ${t.cardBorder} rounded-3xl p-6 sm:p-8 shadow-xl space-y-6`}>
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <span className="w-7 h-7 rounded-full bg-white text-[#0F1F38] font-extrabold text-xs flex items-center justify-center">
                  1
                </span>
                <div>
                  <h3 className="font-bold text-base text-white">Client & Host Information</h3>
                  <p className="text-[11px] text-slate-300">Who should our production team contact?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-white">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Mukasa"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+256 700 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white">Email Address</label>
                  <input
                    type="email"
                    placeholder="david@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white">Company / Organization (If Applicable)</label>
                  <input
                    type="text"
                    placeholder="e.g. Mukasa Holdings / B2B Planner"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Event Details */}
            <div className={`${t.cardBg} border ${t.cardBorder} rounded-3xl p-6 sm:p-8 shadow-xl space-y-6`}>
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <span className="w-7 h-7 rounded-full bg-white text-[#0F1F38] font-extrabold text-xs flex items-center justify-center">
                  2
                </span>
                <div>
                  <h3 className="font-bold text-base text-white">Event Logistics & Dates</h3>
                  <p className="text-[11px] text-slate-300">Set venue location, guest count, and duration</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-white">Event Category *</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white focus:outline-hidden focus:border-white"
                  >
                    <option value="wedding">Luxury Wedding</option>
                    <option value="corporate">Corporate Gala / Expo</option>
                    <option value="concert">Concert / Festival</option>
                    <option value="b2b-lending">B2B Tent Lending</option>
                    <option value="private">Private Celebration</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white focus:outline-hidden focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white focus:outline-hidden focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-white">Location / Town / Venue Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Speke Resort Munyonyo Grounds"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white">Venue Surface Type</label>
                  <select
                    value={venueType}
                    onChange={(e) => setVenueType(e.target.value as any)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white focus:outline-hidden focus:border-white"
                  >
                    <option value="outdoor_grass">Outdoor Natural Grass / Lawn</option>
                    <option value="outdoor_concrete">Outdoor Paved / Concrete / Asphalt</option>
                    <option value="indoor_hall">Indoor Auditorium / Hall</option>
                    <option value="beach">Sandy Beach / Lakeside</option>
                    <option value="private_compound">Private Residential Compound</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>Anticipated Guest Count:</span>
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded-md">{guestCount} Guests</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="50"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full accent-white"
                />
              </div>
            </div>

            {/* Step 3: Equipment & Services Selection */}
            <div className={`${t.cardBg} border ${t.cardBorder} rounded-3xl p-6 sm:p-8 shadow-xl space-y-6`}>
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <span className="w-7 h-7 rounded-full bg-white text-[#0F1F38] font-extrabold text-xs flex items-center justify-center">
                  3
                </span>
                <div>
                  <h3 className="font-bold text-base text-white">Required Services & Equipment</h3>
                  <p className="text-[11px] text-slate-300">Select all modules needed for your staging</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {services.map((s) => {
                  const isSelected = selectedServices.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleService(s.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-white text-[#0F1F38] border-white font-bold shadow-md'
                          : 'bg-[#0E1D35] text-slate-300 border-white/15 hover:border-white/30'
                      }`}
                    >
                      <div>
                        <p className="font-bold">{s.title}</p>
                        <p className={`text-[10px] line-clamp-1 ${isSelected ? 'text-slate-700' : 'text-slate-400'}`}>
                          Starts at ${s.basePrice} {s.priceUnit}
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected ? 'bg-[#0F1F38] border-transparent text-white' : 'border-white/30'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Power & Addons */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Power Infrastructure & Recommended Add-ons:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_ADDONS.map((addon) => {
                    const isChecked = addons.some((a) => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id, addon.name, addon.price)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                          isChecked
                            ? 'bg-white text-[#0F1F38] border-white font-bold shadow-xs'
                            : 'bg-[#0E1D35] text-slate-300 border-white/15'
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{addon.name}</p>
                          <span className={`text-[10px] ${isChecked ? 'text-slate-700' : 'text-slate-400'}`}>
                            +${addon.price} / day
                          </span>
                        </div>
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                          isChecked ? 'bg-[#0F1F38] text-white border-transparent' : 'border-white/30'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-white">Specific Technical Requests / Custom Rigging Notes</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Need truss height clearance above 6m, dry-ice fog during bridal entrance, backup sound generator..."
                  value={customRequests}
                  onChange={(e) => setCustomRequests(e.target.value)}
                  className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                />
              </div>
            </div>

          </div>

          {/* Right Floating Order Summary Box */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-[#132644] rounded-3xl p-6 sm:p-7 border border-white/20 shadow-2xl text-white space-y-6">
              <div>
                <span className="text-xs text-blue-300 font-bold uppercase tracking-wider block">Live Estimate</span>
                <h3 className="text-3xl font-black font-mono tracking-tight text-white mt-1">
                  ${estimatedTotal.toLocaleString()}
                </h3>
                <p className="text-[11px] text-slate-300 mt-1">
                  Estimated for {durationDays} day(s) • {guestCount} Guests
                </p>
              </div>

              <div className="space-y-2.5 border-t border-b border-white/10 py-4 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Selected Services:</span>
                  <span className="font-mono text-white">{selectedServices.length} Selected</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Power & Addons:</span>
                  <span className="font-mono text-white">${addonsTotal}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>On-site Inspection:</span>
                  <span className="font-bold text-white">FREE Included</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Certified Rigging Crew:</span>
                  <span className="font-bold text-white">Included</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Confirm & Lock In Booking</span>
              </button>

              <div className="space-y-2 text-[11px] text-slate-300 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-300 shrink-0" />
                  <span>No payment required right now. Our director verifies date logistics first.</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="bg-[#132644] rounded-3xl p-6 border border-white/20 text-white space-y-4 text-xs">
              <h4 className="font-bold text-sm text-white">Direct Production Hotline</h4>
              <div className="space-y-2.5 text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-white shrink-0" />
                  <a href={`tel:${COMPANY_CONTACT_INFO.phone}`} className="text-white font-bold hover:underline">
                    {COMPANY_CONTACT_INFO.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-white shrink-0" />
                  <a href={`mailto:${COMPANY_CONTACT_INFO.email}`} className="text-white hover:underline">
                    {COMPANY_CONTACT_INFO.email}
                  </a>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <span>{COMPANY_CONTACT_INFO.address}</span>
                </div>
              </div>
            </div>
          </div>

        </form>
      )}

      {/* TAB 2: SIMPLE GENERAL INQUIRY */}
      {activeTab === 'inquiry' && (
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleInquirySubmit} className="bg-[#132644] rounded-3xl p-6 sm:p-10 border border-white/20 shadow-2xl text-white space-y-6">
            <div>
              <h3 className="text-2xl font-bold font-['Outfit']">Send a Message to SBL Events</h3>
              <p className="text-xs text-slate-300 mt-1">
                Have custom stage dimensions, tender requirements, or B2B tent lending questions? Let us know.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-white">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brenda Nalwanga"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+256 700 000 000"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-white">Email Address</label>
                  <input
                    type="email"
                    placeholder="brenda@example.com"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white">Inquiry Subject</label>
                  <select
                    value={inquirySubject}
                    onChange={(e) => setInquirySubject(e.target.value)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white focus:outline-hidden focus:border-white"
                  >
                    <option value="General Equipment Rental">General Equipment Rental</option>
                    <option value="B2B Tent Lending Wholesale">B2B Tent Lending / Peer Sub-Hire</option>
                    <option value="Corporate Gala Tender">Corporate Gala / Festival Tender</option>
                    <option value="Venue Inspection Request">Free Venue Inspection Request</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white">Your Message & Requirements *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Describe your event dates, location, equipment needs, or questions..."
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Inquiry Message</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAQS SECTION */}
      <div className="max-w-4xl mx-auto space-y-6 pt-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-blue-300" />
            <span>Frequently Asked Questions</span>
          </div>
          <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit'] ${t.headingText}`}>
            Important Logistics & Booking Guidelines
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  t.cardBg
                } ${t.cardBorder}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left text-xs sm:text-sm font-bold flex items-center justify-between gap-4 text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-300 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
