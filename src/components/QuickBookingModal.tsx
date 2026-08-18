import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EventType, BookingAddon } from '../types';
import { AVAILABLE_ADDONS } from '../data/mockData';
import { getThemeClasses } from '../utils/themeStyles';
import { 
  X, 
  Check, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';

export const QuickBookingModal: React.FC = () => {
  const { 
    isBookingModalOpen, 
    closeBookingModal, 
    bookingPrefill, 
    services, 
    addBooking,
    theme
  } = useApp();

  const t = getThemeClasses(theme);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submittedBooking, setSubmittedBooking] = useState<{ ref: string; total: number } | null>(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [eventDate, setEventDate] = useState('');
  const [durationDays, setDurationDays] = useState(1);
  const [location, setLocation] = useState('');
  const [venueType, setVenueType] = useState<'outdoor_grass' | 'outdoor_concrete' | 'indoor_hall' | 'beach' | 'private_compound'>('outdoor_grass');
  const [guestCount, setGuestCount] = useState(300);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [addons, setAddons] = useState<BookingAddon[]>([]);
  const [customRequests, setCustomRequests] = useState('');
  const [powerRequirement, setPowerRequirement] = useState<'generator_needed' | 'venue_power_available' | 'unsure'>('generator_needed');

  // Prefill when opened
  useEffect(() => {
    if (isBookingModalOpen) {
      setStep(1);
      setSubmittedBooking(null);
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

  if (!isBookingModalOpen) return null;

  // Calculations
  const servicesTotal = selectedServices.reduce((sum, sId) => {
    const s = services.find((srv) => srv.id === sId);
    return sum + (s ? s.basePrice : 0);
  }, 0) * durationDays;

  const addonsTotal = addons.reduce((sum, a) => sum + a.price * a.quantity, 0) * durationDays;
  const scaleMultiplier = guestCount > 500 ? 1.3 : guestCount > 1000 ? 1.6 : 1.0;
  const estimatedTotal = Math.round((servicesTotal * scaleMultiplier) + addonsTotal);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !phone || !eventDate || selectedServices.length === 0) return;

    const newBooking = addBooking({
      clientName,
      email: email || `${clientName.toLowerCase().replace(/\s+/g, '')}@client.com`,
      phone,
      companyName,
      eventType,
      eventDate,
      durationDays,
      location: location || 'Kampala Area / Event Grounds',
      venueType,
      guestCount,
      selectedServices,
      addons,
      customRequests,
      powerRequirement,
      estimatedTotal,
    });

    setSubmittedBooking({ ref: newBooking.referenceNumber, total: estimatedTotal });
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="max-w-2xl w-full rounded-3xl overflow-hidden border border-white/20 bg-[#132644] text-white shadow-2xl my-8 space-y-0"
      >
        {/* Header */}
        <div className="p-6 bg-[#0F1F38] border-b border-white/15 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-white text-xs font-semibold mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-300" />
              <span>Direct Event Production Reservation</span>
            </div>
            <h2 className="text-xl font-bold font-['Outfit'] text-white">
              {step === 3 ? 'Booking Reference Confirmed' : 'Reserve SBL Equipment & Staging'}
            </h2>
          </div>

          <button
            onClick={closeBookingModal}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {step < 3 && (
          <div className="grid grid-cols-2 bg-[#0E1D35] border-b border-white/10 text-xs text-center font-bold">
            <div className={`py-2.5 border-b-2 transition-colors ${step === 1 ? 'border-white text-white' : 'border-transparent text-slate-400'}`}>
              1. Services & Setup
            </div>
            <div className={`py-2.5 border-b-2 transition-colors ${step === 2 ? 'border-white text-white' : 'border-transparent text-slate-400'}`}>
              2. Logistics & Contact
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {step === 1 && (
            <div className="space-y-5 text-xs">
              <div className="space-y-2">
                <label className="font-bold text-white uppercase tracking-wider block">
                  Select Production Equipment & Services:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {services.map((s) => {
                    const isSelected = selectedServices.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => toggleService(s.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-white text-[#0F1F38] border-white font-bold shadow-md'
                            : 'bg-[#0E1D35] text-slate-300 border-white/15 hover:border-white/30'
                        }`}
                      >
                        <span className="truncate pr-2">{s.title}</span>
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border shrink-0 ${
                          isSelected ? 'bg-[#0F1F38] text-white border-transparent' : 'border-white/30'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Addons */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="font-bold text-white uppercase tracking-wider block">
                  Recommended Add-Ons:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_ADDONS.slice(0, 4).map((addon) => {
                    const isChecked = addons.some((a) => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id, addon.name, addon.price)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-white text-[#0F1F38] border-white font-bold shadow-xs'
                            : 'bg-[#0E1D35] text-slate-300 border-white/15'
                        }`}
                      >
                        <span className="text-[11px] truncate pr-2">{addon.name}</span>
                        <span className={`text-[10px] font-mono shrink-0 ${isChecked ? 'text-slate-800' : 'text-slate-400'}`}>
                          +${addon.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Estimate Pill */}
              <div className="p-4 rounded-2xl bg-[#0E1D35] border border-white/15 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[11px] block">Live Package Estimate:</span>
                  <span className="text-xl font-bold font-mono text-white">${estimatedTotal.toLocaleString()}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-2.5 px-5 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <span>Continue to Step 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-white">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grace Tumusiime"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-white">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+256 700 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-white">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white focus:outline-hidden focus:border-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-white">Days</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white focus:outline-hidden focus:border-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-white">Guest Count</label>
                  <input
                    type="number"
                    min="50"
                    max="5000"
                    step="50"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white focus:outline-hidden focus:border-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white">Venue Name & Town / Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kampala Serena / Private Grounds"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white">Specific Notes / Staging Requests</label>
                <textarea
                  rows={2}
                  placeholder="Special tent shape (dome/clear-span), truss height, line array sound specs..."
                  value={customRequests}
                  onChange={(e) => setCustomRequests(e.target.value)}
                  className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-4 rounded-xl border border-white/20 text-slate-300 hover:text-white"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3.5 px-6 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-sm shadow-xl flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Submit & Reserve Booking (${estimatedTotal.toLocaleString()})</span>
                </button>
              </div>
            </form>
          )}

          {step === 3 && submittedBooking && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-white text-[#0F1F38] flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white font-['Outfit']">
                Booking Reference: <span className="font-mono text-blue-200">{submittedBooking.ref}</span>
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, {clientName}! Your request has been queued in our operations dashboard. Our logistics team will inspect dispatch routes and contact you at <strong className="text-white">{phone}</strong>.
              </p>
              <div className="pt-4">
                <button
                  onClick={closeBookingModal}
                  className="py-3 px-8 rounded-xl bg-white text-[#0F1F38] font-extrabold text-xs shadow-md"
                >
                  Close & Return to Site
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
