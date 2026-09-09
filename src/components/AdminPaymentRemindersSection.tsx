import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, EventType } from '../types';
import { formatUGX } from '../utils/currencyUtils';
import { 
  CreditCard, 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  User, 
  Phone, 
  Calendar, 
  DollarSign, 
  Check, 
  X, 
  FileText, 
  ArrowUpRight, 
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPaymentRemindersSectionProps {
  onOpenBookingDetails?: (booking: Booking) => void;
}

export const AdminPaymentRemindersSection: React.FC<AdminPaymentRemindersSectionProps> = ({
  onOpenBookingDetails
}) => {
  const { 
    bookings, 
    updateBookingPayment, 
    sendPaymentReminderEmail,
    addBooking,
    showToast 
  } = useApp();

  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'unpaid' | 'deposit_paid' | 'overdue' | 'completed'>('all');
  
  // Email Reminder Composer Modal State
  const [selectedBookingForEmail, setSelectedBookingForEmail] = useState<Booking | null>(null);
  const [customEmailMessage, setCustomEmailMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Record Payment Modal State
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'airtel' | 'bank' | 'cash'>('momo');
  const [paymentNote, setPaymentNote] = useState('');

  // Manual Offline Client Debtor Form Modal State
  const [isAddDebtorOpen, setIsAddDebtorOpen] = useState(false);
  const [newDebtorName, setNewDebtorName] = useState('');
  const [newDebtorPhone, setNewDebtorPhone] = useState('');
  const [newDebtorEmail, setNewDebtorEmail] = useState('');
  const [newDebtorEventType, setNewDebtorEventType] = useState<EventType>('wedding');
  const [newDebtorDate, setNewDebtorDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDebtorTotal, setNewDebtorTotal] = useState<number>(10000000);
  const [newDebtorPaid, setNewDebtorPaid] = useState<number>(3000000);
  const [newDebtorDueDate, setNewDebtorDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);

  // Compute payment status for each booking
  const enrichedBookings = useMemo(() => {
    return bookings.map((b) => {
      const total = b.estimatedTotal || 0;
      const paid = b.amountPaid !== undefined ? b.amountPaid : (b.paymentStatus === 'fully_paid' ? total : (b.status === 'confirmed' ? Math.round(total * 0.5) : 0));
      const balance = b.balanceDue !== undefined ? b.balanceDue : Math.max(0, total - paid);
      
      let status = b.paymentStatus;
      if (!status) {
        if (balance === 0 && total > 0) status = 'fully_paid';
        else if (paid > 0) status = 'deposit_paid';
        else status = 'unpaid';
      }

      return {
        ...b,
        computedTotal: total,
        computedPaid: paid,
        computedBalance: balance,
        computedStatus: status,
      };
    });
  }, [bookings]);

  // Filter unfinished vs all
  const filteredBookings = useMemo(() => {
    return enrichedBookings.filter((b) => {
      if (b.status === 'cancelled') return false;

      // Filter by status tab
      if (paymentFilter === 'unpaid' && b.computedStatus !== 'unpaid') return false;
      if (paymentFilter === 'deposit_paid' && b.computedStatus !== 'deposit_paid') return false;
      if (paymentFilter === 'overdue' && b.computedStatus !== 'overdue') return false;
      if (paymentFilter === 'completed' && b.computedStatus !== 'fully_paid') return false;
      if (paymentFilter === 'all' && b.computedBalance <= 0) return false; // Default 'all' highlights unfinished balances

      // Search matching
      if (paymentSearch.trim()) {
        const query = paymentSearch.toLowerCase().trim();
        const matchesName = b.clientName.toLowerCase().includes(query);
        const matchesRef = b.referenceNumber.toLowerCase().includes(query);
        const matchesPhone = b.phone.includes(query);
        const matchesEmail = (b.email || '').toLowerCase().includes(query);
        const matchesType = b.eventType.toLowerCase().includes(query);
        const matchesDate = b.eventDate.includes(query);
        return matchesName || matchesRef || matchesPhone || matchesEmail || matchesType || matchesDate;
      }

      return true;
    });
  }, [enrichedBookings, paymentFilter, paymentSearch]);

  // Metrics
  const totalUnfinishedCount = enrichedBookings.filter(b => b.status !== 'cancelled' && b.computedBalance > 0).length;
  const overdueCount = enrichedBookings.filter(b => b.status !== 'cancelled' && b.computedStatus === 'overdue').length;
  const depositPaidCount = enrichedBookings.filter(b => b.status !== 'cancelled' && b.computedStatus === 'deposit_paid').length;
  const totalOutstandingBalance = enrichedBookings
    .filter(b => b.status !== 'cancelled' && b.computedBalance > 0)
    .reduce((sum, b) => sum + b.computedBalance, 0);

  // Open email reminder composer
  const handleOpenEmailReminder = (booking: Booking & { computedBalance: number; computedPaid: number; computedTotal: number }) => {
    setSelectedBookingForEmail(booking);
    setEmailSubject(`SBL Events Official Invoice & Payment Reminder - Ref #${booking.referenceNumber}`);
    setCustomEmailMessage(
      `Dear ${booking.clientName},\n\n` +
      `This is a friendly reminder from SBL Events regarding your upcoming event on ${booking.eventDate}.\n\n` +
      `Order Reference: #${booking.referenceNumber}\n` +
      `Agreed Package: ${booking.eventType.toUpperCase()} Setup & Production\n` +
      `Total Cost: UGX ${booking.computedTotal.toLocaleString()}\n` +
      `Amount Paid: UGX ${booking.computedPaid.toLocaleString()}\n` +
      `Remaining Balance Due: UGX ${booking.computedBalance.toLocaleString()}\n\n` +
      `Payment Instructions:\n` +
      `• Stanbic Bank: SBL Events Ltd - A/C 9030018944520\n` +
      `• MTN Mobile Money: 0772 311 908 (SBL Production Admin)\n` +
      `• Airtel Money: 0755 889 012 (SBL Events)\n\n` +
      `Kindly finalize the remaining balance to guarantee seamless rigging and dispatch. Thank you for choosing SBL Events!`
    );
  };

  const handleSendReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForEmail) return;

    sendPaymentReminderEmail(selectedBookingForEmail.id, customEmailMessage);
    setIsSendingEmail(false);
    setSelectedBookingForEmail(null);
  };

  // Open Record Payment Modal
  const handleOpenRecordPayment = (booking: Booking & { computedBalance: number; computedPaid: number; computedTotal: number }) => {
    setSelectedBookingForPayment(booking);
    setPaymentAmountInput(booking.computedBalance);
    setPaymentNote(`Payment received via ${paymentMethod.toUpperCase()} on ${new Date().toISOString().split('T')[0]}`);
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForPayment) return;

    const currentPaid = selectedBookingForPayment.amountPaid || 0;
    const newPaid = currentPaid + paymentAmountInput;
    const total = selectedBookingForPayment.estimatedTotal || 0;
    const newBalance = Math.max(0, total - newPaid);

    const newStatus = newBalance === 0 ? 'fully_paid' : (newPaid > 0 ? 'deposit_paid' : 'unpaid');

    updateBookingPayment(selectedBookingForPayment.id, {
      amountPaid: newPaid,
      balanceDue: newBalance,
      paymentStatus: newStatus,
      notes: `${selectedBookingForPayment.notes || ''}\n[${new Date().toISOString().split('T')[0]}] Received UGX ${paymentAmountInput.toLocaleString()} via ${paymentMethod.toUpperCase()}: ${paymentNote}`.trim(),
    });

    setSelectedBookingForPayment(null);
  };

  // Add new offline debtor
  const handleAddDebtorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDebtorName || !newDebtorPhone) {
      showToast('Missing Details', 'Please provide client name and phone number.', 'error');
      return;
    }

    const created = addBooking({
      clientName: newDebtorName,
      email: newDebtorEmail || `${newDebtorName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: newDebtorPhone,
      eventType: newDebtorEventType,
      eventDate: newDebtorDate,
      durationDays: 1,
      location: 'Masaka / Kampala Event Grounds',
      venueType: 'outdoor_grass',
      guestCount: 350,
      selectedServices: ['mega-tents', 'intelligent-lighting', 'mobile-disco-sound'],
      addons: [],
      customRequests: `Client ledger record with balance due on ${newDebtorDueDate}.`,
      estimatedTotal: newDebtorTotal,
    });

    if (created) {
      const balance = Math.max(0, newDebtorTotal - newDebtorPaid);
      updateBookingPayment(created.id, {
        amountPaid: newDebtorPaid,
        balanceDue: balance,
        paymentStatus: balance === 0 ? 'fully_paid' : (newDebtorPaid > 0 ? 'deposit_paid' : 'unpaid'),
        paymentDueDate: newDebtorDueDate,
      });

      setIsAddDebtorOpen(false);
      setNewDebtorName('');
      setNewDebtorPhone('');
      setNewDebtorEmail('');
      showToast('Client Ledger Added', `Added ${newDebtorName} with pending balance of UGX ${balance.toLocaleString()}.`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-amber-400/30 bg-gradient-to-r from-[#132644] via-[#162e52] to-[#132644] text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Client Ledger & Outstanding Balances</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Unfinished Payments & Email Reminder Dispatch
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Track clients with pending invoice balances, send official email reminders with bank/MoMo payment instructions, and record payments directly into the client ledger.
          </p>
        </div>

        <button
          onClick={() => setIsAddDebtorOpen(true)}
          className="px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client Payment Ledger</span>
        </button>
      </div>

      {/* Mini Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-white/15 bg-[#132644] text-white">
          <span className="text-[11px] text-slate-300 font-semibold block">Clients with Pending Balance</span>
          <span className="text-2xl font-extrabold text-amber-300 font-mono mt-1 block">
            {totalUnfinishedCount} Clients
          </span>
          <span className="text-[10px] text-slate-400">Requires follow-up before event</span>
        </div>

        <div className="p-4 rounded-2xl border border-white/15 bg-[#132644] text-white">
          <span className="text-[11px] text-slate-300 font-semibold block">Total Outstanding Balance</span>
          <span className="text-2xl font-extrabold text-amber-300 font-mono mt-1 block">
            {formatUGX(totalOutstandingBalance)}
          </span>
          <span className="text-[10px] text-amber-200">Pending client remittance</span>
        </div>

        <div className="p-4 rounded-2xl border border-white/15 bg-[#132644] text-white">
          <span className="text-[11px] text-slate-300 font-semibold block">Overdue Invoices</span>
          <span className="text-2xl font-extrabold text-red-300 font-mono mt-1 block">
            {overdueCount} Overdue
          </span>
          <span className="text-[10px] text-red-300">Past due date</span>
        </div>

        <div className="p-4 rounded-2xl border border-white/15 bg-[#132644] text-white">
          <span className="text-[11px] text-slate-300 font-semibold block">Deposit Paid (Balance Due)</span>
          <span className="text-2xl font-extrabold text-blue-300 font-mono mt-1 block">
            {depositPaidCount} Active
          </span>
          <span className="text-[10px] text-blue-200">50% Advance received</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl border border-white/15 bg-[#132644] text-white">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search client name, phone, email, date, or event type..."
            value={paymentSearch}
            onChange={(e) => setPaymentSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: `Unfinished Balances (${totalUnfinishedCount})` },
            { id: 'deposit_paid', label: `Deposit Paid (${depositPaidCount})` },
            { id: 'unpaid', label: 'Unpaid Invoices' },
            { id: 'overdue', label: `Overdue (${overdueCount})` },
            { id: 'completed', label: 'Fully Cleared' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPaymentFilter(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                paymentFilter === tab.id
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                  : 'bg-[#0E1D35] text-slate-200 border-white/15 hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Outstanding Balances - Mobile Cards (Jumia-style compact card view) & Desktop Table */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/15 bg-[#132644] overflow-hidden shadow-xl">
        
        {/* Mobile Compact Card View (< md) */}
        <div className="block md:hidden divide-y divide-white/10">
          {filteredBookings.length === 0 ? (
            <div className="py-8 px-4 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 opacity-60 mx-auto mb-2" />
              <p className="text-xs font-semibold">No pending balances matching current filter.</p>
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div key={b.id} className="p-3 space-y-2 bg-[#0E1D35]/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-white truncate">{b.clientName}</h4>
                    <p className="text-[10px] text-slate-300 font-mono">
                      Ref: <span className="text-blue-300 font-bold">{b.referenceNumber}</span> • {b.phone}
                    </p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                    b.computedStatus === 'fully_paid'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : b.computedStatus === 'deposit_paid'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                      : b.computedStatus === 'overdue'
                      ? 'bg-red-500/20 text-red-300 border-red-400/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  }`}>
                    {b.computedStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 p-2 rounded-lg bg-black/30 text-center text-[10px]">
                  <div>
                    <span className="text-slate-400 block text-[9px]">Total</span>
                    <span className="font-mono font-bold text-white text-[10px]">{formatUGX(b.computedTotal)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Paid</span>
                    <span className="font-mono font-bold text-emerald-400 text-[10px]">{formatUGX(b.computedPaid)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Balance</span>
                    <span className={`font-mono font-extrabold text-[10px] ${b.computedBalance > 0 ? 'text-amber-300' : 'text-slate-400'}`}>
                      {formatUGX(b.computedBalance)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[10px] text-slate-400 truncate">
                    {b.eventDate} • {b.eventType.replace('_', ' ')}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenEmailReminder(b)}
                      className="px-2 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-xs"
                    >
                      <Send className="w-2.5 h-2.5" />
                      <span>Reminder</span>
                    </button>
                    <button
                      onClick={() => handleOpenRecordPayment(b)}
                      className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[10px] flex items-center gap-1"
                    >
                      <CreditCard className="w-2.5 h-2.5 text-emerald-400" />
                      <span>Paid</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View (>= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/15 bg-[#0E1D35] text-slate-300">
                <th className="py-3.5 px-4 font-bold">Client & Reference</th>
                <th className="py-3.5 px-4 font-bold">Event & Date</th>
                <th className="py-3.5 px-4 font-bold">Total Cost</th>
                <th className="py-3.5 px-4 font-bold">Amount Paid</th>
                <th className="py-3.5 px-4 font-bold">Balance Due</th>
                <th className="py-3.5 px-4 font-bold">Payment Status</th>
                <th className="py-3.5 px-4 font-bold">Last Reminder</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 opacity-60" />
                      <p className="text-sm font-semibold">No pending balances matching current filter.</p>
                      <p className="text-xs text-slate-500">All registered clients are up to date or no results found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 space-y-1">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{b.clientName}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 flex items-center gap-2">
                        <span className="font-mono text-blue-300">{b.referenceNumber}</span>
                        <span>•</span>
                        <span>{b.phone}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                        {b.email || 'No email registered'}
                      </div>
                    </td>

                    <td className="py-4 px-4 space-y-1">
                      <span className="inline-block px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold uppercase text-slate-200">
                        {b.eventType.replace('_', ' ')}
                      </span>
                      <div className="text-[11px] text-slate-300 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{b.eventDate}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {b.location}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-slate-200">
                      {formatUGX(b.computedTotal)}
                    </td>

                    <td className="py-4 px-4 font-mono font-semibold text-emerald-400">
                      {formatUGX(b.computedPaid)}
                    </td>

                    <td className="py-4 px-4">
                      <span className={`font-mono font-extrabold text-sm block ${
                        b.computedBalance > 0 ? 'text-amber-300' : 'text-slate-400'
                      }`}>
                        {formatUGX(b.computedBalance)}
                      </span>
                      {b.paymentDueDate && b.computedBalance > 0 && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Due: {b.paymentDueDate}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                        b.computedStatus === 'fully_paid'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                          : b.computedStatus === 'deposit_paid'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                          : b.computedStatus === 'overdue'
                          ? 'bg-red-500/20 text-red-300 border-red-400/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                      }`}>
                        {b.computedStatus === 'fully_paid' && <CheckCircle2 className="w-3 h-3" />}
                        {b.computedStatus === 'deposit_paid' && <Clock className="w-3 h-3" />}
                        {b.computedStatus === 'overdue' && <AlertCircle className="w-3 h-3" />}
                        {b.computedStatus === 'unpaid' && <AlertCircle className="w-3 h-3" />}
                        <span>{b.computedStatus.replace('_', ' ')}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 text-[11px] text-slate-300">
                      {b.lastReminderSentAt ? (
                        <div className="space-y-0.5">
                          <span className="text-emerald-300 font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Sent</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {b.lastReminderSentAt}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Not sent yet</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Send Email Reminder Button */}
                        <button
                          onClick={() => handleOpenEmailReminder(b)}
                          className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                          title="Send official payment reminder email to client"
                        >
                          <Send className="w-3 h-3" />
                          <span>Email Reminder</span>
                        </button>

                        {/* Record Payment Button */}
                        <button
                          onClick={() => handleOpenRecordPayment(b)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs flex items-center gap-1 transition-all"
                          title="Record payment received"
                        >
                          <CreditCard className="w-3 h-3 text-emerald-400" />
                          <span>Record Paid</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: EMAIL REMINDER COMPOSER & PREVIEW */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedBookingForEmail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full rounded-3xl p-6 sm:p-8 bg-[#132644] border border-amber-400/40 text-white shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between pb-4 border-b border-white/15">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold mb-2">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Official Invoice Reminder Dispatch</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white">
                    Send Payment Reminder to {selectedBookingForEmail.clientName}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Target Email: <strong className="text-white">{selectedBookingForEmail.email || `${selectedBookingForEmail.clientName.toLowerCase().replace(/\s+/g, '')}@gmail.com`}</strong>
                  </p>
                </div>

                <button
                  onClick={() => setSelectedBookingForEmail(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Outstanding Balance Summary Card */}
              <div className="p-4 rounded-2xl bg-[#0E1D35] border border-white/15 grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Order</span>
                  <span className="text-sm font-extrabold text-white font-mono mt-1 block">
                    {formatUGX(selectedBookingForEmail.estimatedTotal || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Amount Paid</span>
                  <span className="text-sm font-extrabold text-emerald-400 font-mono mt-1 block">
                    {formatUGX(selectedBookingForEmail.amountPaid || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-300 block">Remaining Balance</span>
                  <span className="text-sm font-extrabold text-amber-300 font-mono mt-1 block">
                    {formatUGX(selectedBookingForEmail.balanceDue || (selectedBookingForEmail.estimatedTotal || 0) - (selectedBookingForEmail.amountPaid || 0))}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSendReminderSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Email Subject Line
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-white focus:outline-hidden focus:border-amber-400 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Email Body & Invoice Remittance Instructions
                  </label>
                  <textarea
                    rows={8}
                    value={customEmailMessage}
                    onChange={(e) => setCustomEmailMessage(e.target.value)}
                    className="w-full p-4 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-slate-100 font-mono focus:outline-hidden focus:border-amber-400 leading-relaxed"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dispatches official PDF summary & updates timestamp</span>
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedBookingForEmail(null)}
                      className="px-4 py-2.5 rounded-xl border border-white/20 text-xs font-semibold text-slate-300 hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSendingEmail}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSendingEmail ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Dispatching Email...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Official Email Reminder</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: RECORD PAYMENT RECEIVED */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedBookingForPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full rounded-3xl p-6 bg-[#132644] border border-emerald-400/40 text-white shadow-2xl space-y-5"
            >
              <div className="flex items-start justify-between pb-3 border-b border-white/15">
                <div>
                  <h3 className="text-lg font-extrabold text-white">
                    Record Payment Received
                  </h3>
                  <p className="text-xs text-slate-300">
                    Client: <strong className="text-white">{selectedBookingForPayment.clientName}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBookingForPayment(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Amount Received (UGX)
                  </label>
                  <input
                    type="number"
                    value={paymentAmountInput}
                    onChange={(e) => setPaymentAmountInput(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0E1D35] border border-white/20 text-sm font-mono font-bold text-amber-300 focus:outline-hidden focus:border-emerald-400"
                    required
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Current Balance Due: {formatUGX(selectedBookingForPayment.balanceDue || (selectedBookingForPayment.estimatedTotal || 0) - (selectedBookingForPayment.amountPaid || 0))}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-white focus:outline-hidden"
                  >
                    <option value="momo">MTN Mobile Money</option>
                    <option value="airtel">Airtel Money</option>
                    <option value="bank">Stanbic Bank Wire / Deposit</option>
                    <option value="cash">Cash at Masaka / Kampala Office</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Ledger Note / Transaction Ref
                  </label>
                  <input
                    type="text"
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    placeholder="e.g. MoMo Transaction ID: 2984920482"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-white focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBookingForPayment(null)}
                    className="px-4 py-2 rounded-xl border border-white/20 text-xs font-semibold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs shadow-md flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Payment Record</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: ADD OFFLINE DEBTOR / CLIENT RECORD */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isAddDebtorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-lg w-full rounded-3xl p-6 sm:p-8 bg-[#132644] border border-white/20 text-white shadow-2xl space-y-5"
            >
              <div className="flex items-start justify-between pb-3 border-b border-white/15">
                <div>
                  <h3 className="text-lg font-extrabold text-white">
                    Add Client Payment Ledger
                  </h3>
                  <p className="text-xs text-slate-300">
                    Log an event order with pending or partial payment
                  </p>
                </div>
                <button
                  onClick={() => setIsAddDebtorOpen(false)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddDebtorSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Client Full Name *
                    </label>
                    <input
                      type="text"
                      value={newDebtorName}
                      onChange={(e) => setNewDebtorName(e.target.value)}
                      placeholder="e.g. David & Mary Wedding"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-white focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      value={newDebtorPhone}
                      onChange={(e) => setNewDebtorPhone(e.target.value)}
                      placeholder="0772..."
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-white focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Client Email
                    </label>
                    <input
                      type="email"
                      value={newDebtorEmail}
                      onChange={(e) => setNewDebtorEmail(e.target.value)}
                      placeholder="client@gmail.com"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Event Type
                    </label>
                    <select
                      value={newDebtorEventType}
                      onChange={(e) => setNewDebtorEventType(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-white focus:outline-hidden"
                    >
                      <option value="wedding">Wedding / Kwanjula</option>
                      <option value="corporate">Corporate Gala</option>
                      <option value="concert">Concert / Stage</option>
                      <option value="tent_lending_b2b">B2B Hire</option>
                      <option value="private">Private Event</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={newDebtorDate}
                      onChange={(e) => setNewDebtorDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-white focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Payment Due Date
                    </label>
                    <input
                      type="date"
                      value={newDebtorDueDate}
                      onChange={(e) => setNewDebtorDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Total Invoice Amount (UGX)
                    </label>
                    <input
                      type="number"
                      value={newDebtorTotal}
                      onChange={(e) => setNewDebtorTotal(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-xs font-mono font-bold text-white focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Amount Paid So Far (UGX)
                    </label>
                    <input
                      type="number"
                      value={newDebtorPaid}
                      onChange={(e) => setNewDebtorPaid(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-xs font-mono font-bold text-emerald-300 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0E1D35] border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Remaining Balance Due:</span>
                  <span className="font-mono font-extrabold text-amber-300">
                    {formatUGX(Math.max(0, newDebtorTotal - newDebtorPaid))}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddDebtorOpen(false)}
                    className="px-4 py-2 rounded-xl border border-white/20 text-xs font-semibold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md"
                  >
                    Add Client Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
