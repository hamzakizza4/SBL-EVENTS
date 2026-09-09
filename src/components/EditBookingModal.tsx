import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking, BookingStatus, EventType } from '../types';
import { 
  X, 
  ArrowLeft, 
  Save, 
  User, 
  Calendar, 
  DollarSign, 
  FileText, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface EditBookingModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Booking>) => void;
  formatUGX: (amount: number) => string;
}

export const EditBookingModal: React.FC<EditBookingModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSave,
  formatUGX,
}) => {
  const [clientName, setClientName] = useState(booking.clientName);
  const [email, setEmail] = useState(booking.email);
  const [phone, setPhone] = useState(booking.phone);
  const [companyName, setCompanyName] = useState(booking.companyName || '');
  const [eventType, setEventType] = useState<EventType>(booking.eventType);
  const [eventDate, setEventDate] = useState(booking.eventDate);
  const [durationDays, setDurationDays] = useState(booking.durationDays || 1);
  const [location, setLocation] = useState(booking.location);
  const [venueType, setVenueType] = useState(booking.venueType || 'outdoor_grass');
  const [guestCount, setGuestCount] = useState(booking.guestCount);
  
  // Financials
  const [estimatedTotal, setEstimatedTotal] = useState(booking.estimatedTotal || 0);
  const [amountPaid, setAmountPaid] = useState(booking.amountPaid || 0);
  const [paymentStatus, setPaymentStatus] = useState(booking.paymentStatus || 'unpaid');
  const [paymentDueDate, setPaymentDueDate] = useState(booking.paymentDueDate || '');
  
  // Status and Notes
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [customRequests, setCustomRequests] = useState(booking.customRequests || '');
  const [notes, setNotes] = useState(booking.notes || '');

  const [activeTab, setActiveTab] = useState<'details' | 'logistics' | 'financials' | 'notes'>('details');
  const [isSaving, setIsSaving] = useState(false);

  const balanceDue = Math.max(0, estimatedTotal - amountPaid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updates: Partial<Booking> = {
      clientName: clientName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      companyName: companyName.trim() || undefined,
      eventType,
      eventDate,
      durationDays: Number(durationDays) || 1,
      location: location.trim(),
      venueType,
      guestCount: Number(guestCount) || 1,
      estimatedTotal: Number(estimatedTotal) || 0,
      amountPaid: Number(amountPaid) || 0,
      balanceDue,
      paymentStatus,
      paymentDueDate: paymentDueDate || undefined,
      status,
      customRequests: customRequests.trim(),
      notes: notes.trim() || undefined,
    };

    onSave(booking.id, updates);
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="relative w-full max-w-3xl bg-[#0F1F38] border border-white/20 rounded-3xl shadow-2xl text-white overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* Top Sticky Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 bg-[#132644] flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/15 transition-colors cursor-pointer group"
                title="Back without saving"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-white">Edit Booking</h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    #{booking.referenceNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-300 truncate max-w-[200px] sm:max-w-md">
                  Modifying details for {booking.clientName}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Navigation Tabs for Mobile / Desktop */}
          <div className="flex items-center gap-1 p-2 bg-[#0B1528] border-b border-white/10 overflow-x-auto no-scrollbar shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'details'
                  ? 'bg-amber-500 text-[#0E1D35] shadow-md'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Client Contact</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('logistics')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'logistics'
                  ? 'bg-amber-500 text-[#0E1D35] shadow-md'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Event & Venue</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('financials')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'financials'
                  ? 'bg-amber-500 text-[#0E1D35] shadow-md'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Pricing & Payments</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'bg-amber-500 text-[#0E1D35] shadow-md'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Status & Notes</span>
            </button>
          </div>

          {/* Form Body - Scrollable with safe mobile padding */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm">
            {/* TAB 1: CLIENT CONTACT */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Client Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                        placeholder="e.g. Sarah Namubiru"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                        placeholder="+256 700 000000"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                        placeholder="client@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Company / Organization (Optional)
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                        placeholder="e.g. Stanbic Bank Uganda"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>These contact details will be used for auto-generating client invoices, receipts, and WhatsApp communications.</span>
                </div>
              </div>
            )}

            {/* TAB 2: EVENT & VENUE LOGISTICS */}
            {activeTab === 'logistics' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Event Category / Type *
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as EventType)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                    >
                      <option value="wedding">Wedding Ceremony & Reception</option>
                      <option value="corporate">Corporate Gala & Conference</option>
                      <option value="concert">Concert, Festival & Public Event</option>
                      <option value="introduction">Traditional Kwanjula / Kuhingira</option>
                      <option value="birthday">Private Birthday / Anniversary</option>
                      <option value="b2b_dry_hire">B2B Wholesale Equipment Sub-Rental</option>
                      <option value="other">Other Bespoke Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Estimated Guests
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        min={1}
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Venue Terrain
                    </label>
                    <select
                      value={venueType}
                      onChange={(e) => setVenueType(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                    >
                      <option value="outdoor_grass">Outdoor Grass Lawn</option>
                      <option value="outdoor_concrete">Paved / Tarmac / Concrete</option>
                      <option value="indoor_hall">Indoor Hall / Ballroom</option>
                      <option value="beach">Lake Victoria Beach / Sand</option>
                      <option value="private_compound">Private Residential Compound</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Location & Venue Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                      placeholder="e.g. Speke Resort Munyonyo, Peace Garden, Kampala"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: FINANCIALS & PAYMENTS */}
            {activeTab === 'financials' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Agreed Estimated Total (UGX) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-amber-400" />
                      <input
                        type="number"
                        min={0}
                        step={10000}
                        value={estimatedTotal}
                        onChange={(e) => setEstimatedTotal(Number(e.target.value))}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white font-mono font-bold focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                      />
                    </div>
                    <span className="text-[11px] text-amber-300/80 mt-1 block">
                      {formatUGX(estimatedTotal)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Amount Paid So Far (UGX)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-emerald-400" />
                      <input
                        type="number"
                        min={0}
                        step={10000}
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(Number(e.target.value))}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white font-mono font-bold focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                      />
                    </div>
                    <span className="text-[11px] text-emerald-300/80 mt-1 block">
                      {formatUGX(amountPaid)}
                    </span>
                  </div>
                </div>

                {/* Balance Due Card */}
                <div className="p-4 rounded-2xl bg-linear-to-r from-slate-900 to-[#122238] border border-white/15 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase">Calculated Balance Due:</span>
                    <h4 className="text-lg sm:text-xl font-mono font-extrabold text-amber-400">
                      {formatUGX(balanceDue)}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-bold uppercase">Deposit Status:</span>
                    <p className={`text-xs font-bold uppercase mt-0.5 ${
                      balanceDue === 0 && estimatedTotal > 0
                        ? 'text-emerald-400'
                        : amountPaid > 0
                        ? 'text-blue-400'
                        : 'text-amber-400'
                    }`}>
                      {balanceDue === 0 && estimatedTotal > 0 ? 'Fully Paid' : amountPaid > 0 ? 'Partially Paid' : 'Unpaid'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Payment Status Override
                    </label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                    >
                      <option value="unpaid">Unpaid (No deposit received yet)</option>
                      <option value="deposit_paid">Deposit Paid (Commitment received)</option>
                      <option value="fully_paid">Fully Paid (Cleared 100%)</option>
                      <option value="overdue">Overdue (Past payment date)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Payment Due Date
                    </label>
                    <input
                      type="date"
                      value={paymentDueDate}
                      onChange={(e) => setPaymentDueDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: STATUS & INTERNAL NOTES */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Booking Operational Status *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['pending', 'confirmed', 'completed', 'cancelled'] as BookingStatus[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatus(st)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-extrabold uppercase transition-all cursor-pointer border ${
                          status === st
                            ? st === 'confirmed'
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-md scale-105'
                              : st === 'pending'
                              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md scale-105'
                              : st === 'completed'
                              ? 'bg-blue-600 text-white border-blue-400 shadow-md scale-105'
                              : 'bg-red-600 text-white border-red-400 shadow-md scale-105'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Client Special Requests & Requirements
                  </label>
                  <textarea
                    rows={3}
                    value={customRequests}
                    onChange={(e) => setCustomRequests(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm leading-relaxed"
                    placeholder="e.g. VIP stage layout, white carpeting required by 8:00 AM..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Internal Dispatch & Warehouse Notes
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm leading-relaxed"
                    placeholder="e.g. Assigned driver: Moses (Truck UBD 234K). Riggers report on site at 6 AM..."
                  />
                </div>
              </div>
            )}

            {/* Bottom Sticky Action Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 sticky bottom-0 bg-[#0F1F38]/95 backdrop-blur-xs">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Cancel & Back
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-[#0E1D35] font-extrabold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Booking Changes'}</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
