import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, CalendarEvent, EventType, ServiceCategory } from '../types';
import { getBlockedDatesMap } from '../utils/bookingDateUtils';
import { formatUGX } from '../utils/currencyUtils';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Plus, 
  Filter, 
  ShieldCheck, 
  Clock, 
  Phone, 
  MessageCircle, 
  Eye,
  Trash2,
  FileText,
  CreditCard,
  Layers,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Sliders,
  X,
  User,
  ArrowRight,
  Shield,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminMonthlyCalendarProps {
  onOpenBookingDetails?: (booking: Booking) => void;
  onOpenManualBooking?: () => void;
  onOpenAddEventSlot?: () => void;
}

export const AdminMonthlyCalendar: React.FC<AdminMonthlyCalendarProps> = ({
  onOpenBookingDetails,
  onOpenManualBooking,
  onOpenAddEventSlot,
}) => {
  const { 
    calendarEvents, 
    bookings, 
    services,
    bufferDaysBefore, 
    bufferDaysAfter,
    setBufferDaysBefore,
    setBufferDaysAfter,
    updateBookingStatus,
    deleteBooking,
    deleteCalendarEvent,
    triggerMockEmailConfirmation,
    showToast 
  } = useApp();

  // Calendar date state (Default to August 2026 for event showcase season)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 1));
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>('2026-08-15');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'available'>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [isBufferSettingsOpen, setIsBufferSettingsOpen] = useState<boolean>(false);

  // Modal states for deleting confirmed date / booking
  const [deleteDateModalTarget, setDeleteDateModalTarget] = useState<{
    dateStr: string;
    confirmedBookings: Booking[];
    bookedCalEvents: CalendarEvent[];
  } | null>(null);

  const [deleteSingleModalTarget, setDeleteSingleModalTarget] = useState<Booking | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  // Compute blocked dates map with pre-event & post-event buffers
  const blockedDatesMap = useMemo(() => {
    return getBlockedDatesMap(bookings, calendarEvents, bufferDaysBefore, bufferDaysAfter);
  }, [bookings, calendarEvents, bufferDaysBefore, bufferDaysAfter]);

  // Navigate months
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date(2026, 7, 1)); // Jump to active demo period (August 2026)
    setSelectedDateStr('2026-08-15');
  };

  // Helper to format date string YYYY-MM-DD
  const formatDayString = (day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Get all data for a specific date
  const getDayData = (dateStr: string) => {
    // 1. Confirmed bookings on this date
    const dayBookings = bookings.filter((b) => {
      const matchStatus = b.status !== 'cancelled';
      const isStart = b.eventDate === dateStr;
      const isRange = b.eventDate <= dateStr && (b.endDate ? b.endDate >= dateStr : false);
      return matchStatus && (isStart || isRange);
    });

    // 2. Calendar custom events/holds on this date
    const dayCalEvents = calendarEvents.filter((e) => {
      return e.startDate <= dateStr && e.endDate >= dateStr;
    });

    // 3. Buffer info
    const bufferInfo = blockedDatesMap.get(dateStr);

    const confirmedCount = dayBookings.filter(b => b.status === 'confirmed').length + 
      dayCalEvents.filter(e => e.status === 'booked').length;
    const pendingCount = dayBookings.filter(b => b.status === 'pending').length;
    const hasBuffer = Boolean(bufferInfo?.isBufferDay) && confirmedCount === 0;
    const isAvailable = !bufferInfo && dayBookings.length === 0 && dayCalEvents.length === 0;

    return {
      dateStr,
      dayBookings,
      dayCalEvents,
      bufferInfo,
      confirmedCount,
      pendingCount,
      hasBuffer,
      isAvailable,
      isBlocked: Boolean(bufferInfo),
    };
  };

  // Month Statistics
  const monthStats = useMemo(() => {
    let confirmedEventsInMonth = 0;
    let pendingInquiriesInMonth = 0;
    let bufferDaysInMonth = 0;
    let openAvailableDaysInMonth = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDayString(day);
      const data = getDayData(dateStr);
      if (data.confirmedCount > 0) confirmedEventsInMonth += data.confirmedCount;
      if (data.pendingCount > 0) pendingInquiriesInMonth += data.pendingCount;
      if (data.hasBuffer) bufferDaysInMonth += 1;
      if (data.isAvailable) openAvailableDaysInMonth += 1;
    }

    return {
      confirmedEventsInMonth,
      pendingInquiriesInMonth,
      bufferDaysInMonth,
      openAvailableDaysInMonth,
    };
  }, [year, month, daysInMonth, bookings, calendarEvents, blockedDatesMap]);

  // Selected Day Details
  const selectedDayInfo = useMemo(() => {
    if (!selectedDateStr) return null;
    return getDayData(selectedDateStr);
  }, [selectedDateStr, bookings, calendarEvents, blockedDatesMap]);

  // Helper for event type badges and colors
  const getEventTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('wedding') || t.includes('kwanjula')) {
      return { bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/30', dot: 'bg-rose-400' };
    }
    if (t.includes('concert') || t.includes('festival')) {
      return { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30', dot: 'bg-purple-400' };
    }
    if (t.includes('corporate') || t.includes('expo')) {
      return { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', dot: 'bg-blue-400' };
    }
    return { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-400' };
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyPrefixDays = Array.from({ length: firstDayIndex }, (_, i) => i);

  return (
    <div className="space-y-6">
      
      {/* 1. Header Toolbar & Quick Month Overview */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-6 rounded-3xl border border-white/15 bg-[#132644] text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
            <CalendarIcon className="w-3.5 h-3.5 text-blue-300" />
            <span>Operational Dispatch & Fleet Availability</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
            Production Schedule & Date Availability Calendar
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Visually track confirmed client events, pending inquiries, buffer lockdown days, and available weekend slots across Uganda.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsBufferSettingsOpen(!isBufferSettingsOpen)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              isBufferSettingsOpen
                ? 'bg-amber-400 text-slate-950 border-amber-400'
                : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/20'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Buffer Config ({bufferDaysBefore}d / {bufferDaysAfter}d)</span>
          </button>

          {onOpenAddEventSlot && (
            <button
              onClick={onOpenAddEventSlot}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-blue-300" />
              <span>Add Date Hold</span>
            </button>
          )}

          {onOpenManualBooking && (
            <button
              onClick={onOpenManualBooking}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Booking</span>
            </button>
          )}
        </div>
      </div>

      {/* Buffer Settings Accordion */}
      <AnimatePresence>
        {isBufferSettingsOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-6 rounded-3xl border border-amber-400/30 bg-[#0E1D35] text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                  <h3 className="text-sm font-extrabold text-white">Automated Rigging & Strike Buffer Protection</h3>
                </div>
                <button
                  onClick={() => setIsBufferSettingsOpen(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before Buffer */}
                <div className="p-4 rounded-2xl bg-[#132644] border border-white/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Pre-Event Rigging Buffer</span>
                      <span className="text-[11px] text-slate-300">Days locked before confirmed events for stage setup</span>
                    </div>
                    <span className="text-base font-extrabold font-mono text-amber-300 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/30">
                      {bufferDaysBefore} Days
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[0, 1, 2, 3, 4].map((days) => (
                      <button
                        key={days}
                        onClick={() => setBufferDaysBefore(days)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          bufferDaysBefore === days
                            ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                            : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
                        }`}
                      >
                        {days}d {days === 2 ? '⭐' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* After Buffer */}
                <div className="p-4 rounded-2xl bg-[#132644] border border-white/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Post-Event Teardown Buffer</span>
                      <span className="text-[11px] text-slate-300">Days locked after event for strike and fleet cleaning</span>
                    </div>
                    <span className="text-base font-extrabold font-mono text-blue-300 px-2.5 py-1 rounded-lg bg-blue-500/20 border border-blue-400/30">
                      {bufferDaysAfter} Days
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[0, 1, 2, 3].map((days) => (
                      <button
                        key={days}
                        onClick={() => setBufferDaysAfter(days)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          bufferDaysAfter === days
                            ? 'bg-blue-400 text-slate-950 font-extrabold shadow-sm'
                            : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
                        }`}
                      >
                        {days}d {days === 1 ? '⭐' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Monthly Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-[#132644] text-white space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">Confirmed Events</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono block font-['Outfit']">
            {monthStats.confirmedEventsInMonth}
          </span>
          <span className="text-[10px] text-slate-300">Locked on dispatch roster</span>
        </div>

        <div className="p-4 rounded-2xl border border-amber-500/30 bg-[#132644] text-white space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">Pending Inquiries</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono block font-['Outfit']">
            {monthStats.pendingInquiriesInMonth}
          </span>
          <span className="text-[10px] text-slate-300">Awaiting contract signoff</span>
        </div>

        <div className="p-4 rounded-2xl border border-blue-500/30 bg-[#132644] text-white space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">Buffer Protected</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-blue-300 font-mono block font-['Outfit']">
            {monthStats.bufferDaysInMonth} Days
          </span>
          <span className="text-[10px] text-slate-300">Rigging & strike reserved</span>
        </div>

        <div className="p-4 rounded-2xl border border-white/15 bg-[#132644] text-white space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Open Available</span>
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono block font-['Outfit']">
            {monthStats.openAvailableDaysInMonth} Days
          </span>
          <span className="text-[10px] text-slate-400">Ready for incoming bookings</span>
        </div>
      </div>

      {/* 3. Main Monthly Calendar Grid & Side Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Calendar Grid (8 cols on lg) */}
        <div className="lg:col-span-8 p-6 rounded-3xl border border-white/15 bg-[#132644] text-white shadow-xl space-y-5">
          
          {/* Calendar Header Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/15">
            <div className="flex items-center gap-3">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
                {monthNames[month]} {year}
              </h3>
              <button
                onClick={goToToday}
                className="text-xs px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 font-semibold"
              >
                Current Season (Aug 2026)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Filter Bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 text-[11px] font-semibold">Filter:</span>
              {[
                { id: 'all', label: 'All Days' },
                { id: 'confirmed', label: 'Confirmed Events' },
                { id: 'pending', label: 'Pending' },
                { id: 'available', label: 'Available Only' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs ${
                    statusFilter === f.id
                      ? 'bg-white text-[#0F1F38] shadow-sm'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Visual Legend */}
            <div className="flex items-center gap-3 text-[11px] text-slate-300 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Confirmed</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                <span>Buffer</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                <span>Open</span>
              </div>
            </div>
          </div>

          {/* Day Names Row */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-1 border-b border-white/10">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* 7-Column Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {/* Empty prefix boxes */}
            {emptyPrefixDays.map((i) => (
              <div key={`prefix-${i}`} className="min-h-[80px] sm:min-h-[105px] rounded-2xl bg-white/[0.02] border border-white/5 opacity-30"></div>
            ))}

            {/* Days in Month */}
            {daysArray.map((day) => {
              const dateStr = formatDayString(day);
              const data = getDayData(dateStr);
              const isSelected = selectedDateStr === dateStr;

              // Filter condition
              let isDimmed = false;
              if (statusFilter === 'confirmed' && data.confirmedCount === 0) isDimmed = true;
              if (statusFilter === 'pending' && data.pendingCount === 0) isDimmed = true;
              if (statusFilter === 'available' && !data.isAvailable) isDimmed = true;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`min-h-[80px] sm:min-h-[105px] p-2 sm:p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none relative overflow-hidden group ${
                    isSelected
                      ? 'bg-blue-600/30 border-blue-400 shadow-lg ring-2 ring-blue-400/40 z-10'
                      : isDimmed
                      ? 'opacity-35 bg-[#0E1D35] border-white/5'
                      : data.confirmedCount > 0
                      ? 'bg-emerald-950/40 border-emerald-500/30 hover:border-emerald-400/60'
                      : data.pendingCount > 0
                      ? 'bg-amber-950/30 border-amber-500/30 hover:border-amber-400/60'
                      : data.hasBuffer
                      ? 'bg-blue-950/30 border-blue-500/30 hover:border-blue-400/60'
                      : 'bg-[#0E1D35] border-white/10 hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  {/* Day number & status dot */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs sm:text-sm font-extrabold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {day}
                    </span>

                    <div className="flex items-center gap-1">
                      {data.confirmedCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Confirmed Event"></span>
                      )}
                      {data.pendingCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-amber-400" title="Pending Inquiry"></span>
                      )}
                      {data.hasBuffer && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Buffer Day"></span>
                      )}
                    </div>
                  </div>

                  {/* Badges / Micro Event Cards */}
                  <div className="space-y-1 my-auto">
                    {data.dayBookings.slice(0, 2).map((b) => {
                      const color = getEventTypeColor(b.eventType);
                      return (
                        <div
                          key={b.id}
                          className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md font-semibold truncate flex items-center gap-1 ${color.bg} ${color.text} border ${color.border}`}
                          title={`${b.clientName} - ${b.eventType.replace('_', ' ')}`}
                        >
                          <span className={`w-1 h-1 rounded-full ${color.dot}`}></span>
                          <span className="truncate">{b.clientName}</span>
                        </div>
                      );
                    })}

                    {data.dayCalEvents.slice(0, 1).map((e) => (
                      <div
                        key={e.id}
                        className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md font-semibold truncate bg-purple-500/20 text-purple-200 border border-purple-500/30 flex items-center gap-1"
                        title={e.title}
                      >
                        <span className="w-1 h-1 rounded-full bg-purple-400"></span>
                        <span className="truncate">{e.title}</span>
                      </div>
                    ))}

                    {data.dayBookings.length > 2 && (
                      <span className="text-[9px] font-mono text-slate-400 block pl-0.5">
                        +{data.dayBookings.length - 2} more
                      </span>
                    )}

                    {data.hasBuffer && data.dayBookings.length === 0 && (
                      <div className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-400/20 flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5 shrink-0 text-blue-300" />
                        <span className="truncate">Rigging Buffer</span>
                      </div>
                    )}

                    {data.isAvailable && (
                      <div className="hidden sm:block text-[9px] text-slate-500 text-center font-medium">
                        Open
                      </div>
                    )}
                  </div>

                  {/* Weekend Highlight bar */}
                  {(firstDayIndex + day - 1) % 7 === 0 || (firstDayIndex + day - 1) % 7 === 6 ? (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400/40"></div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Detail Drawer (4 cols on lg) */}
        <div className="lg:col-span-4 p-6 rounded-3xl border border-white/15 bg-[#132644] text-white shadow-xl flex flex-col justify-between space-y-5">
          {selectedDateStr && selectedDayInfo ? (
            <div className="space-y-5">
              
              {/* Selected Day Header */}
              <div className="pb-4 border-b border-white/15 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                    Day Production Schedule
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {selectedDateStr}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>

                {/* Day status badge & Delete Confirmed Date action */}
                <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedDayInfo.confirmedCount > 0 ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{selectedDayInfo.confirmedCount} Confirmed Event{selectedDayInfo.confirmedCount > 1 ? 's' : ''}</span>
                      </span>
                    ) : selectedDayInfo.hasBuffer ? (
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Protected Buffer Day ({selectedDayInfo.bufferInfo?.reason || 'Rigging'})</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        <span>100% Available for New Booking</span>
                      </span>
                    )}

                    {selectedDayInfo.pendingCount > 0 && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                        {selectedDayInfo.pendingCount} Pending Inquiry
                      </span>
                    )}
                  </div>

                  {/* Prominent Option to Delete Confirmed Date */}
                  {selectedDayInfo.confirmedCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const confirmedBookings = selectedDayInfo.dayBookings.filter(b => b.status === 'confirmed');
                        const bookedCalEvents = selectedDayInfo.dayCalEvents.filter(e => e.status === 'booked');
                        setDeleteDateModalTarget({
                          dateStr: selectedDateStr,
                          confirmedBookings,
                          bookedCalEvents
                        });
                      }}
                      className="px-3 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                      title="Permanently remove all confirmed reservations on this date and make it open"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      <span>Delete Confirmed Date</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Scheduled Events List */}
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
                {selectedDayInfo.dayBookings.map((b) => {
                  const color = getEventTypeColor(b.eventType);
                  const balance = b.balanceDue !== undefined ? b.balanceDue : (b.estimatedTotal || 0) - (b.amountPaid || 0);

                  return (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl bg-[#0E1D35] border border-white/15 space-y-3 shadow-md hover:border-white/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] font-bold text-blue-300">
                              {b.referenceNumber}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${color.bg} ${color.text} border ${color.border}`}>
                              {b.eventType.replace('_', ' ')}
                            </span>
                          </div>
                          <h4 className="font-bold text-white text-sm mt-0.5">{b.clientName}</h4>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      {/* Specs snippet */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{b.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{b.guestCount} Guests</span>
                        </div>
                      </div>

                      {/* Total & Outstanding */}
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                        <span className="text-slate-400">Total Contract:</span>
                        <span className="font-mono font-bold text-amber-300">{formatUGX(b.estimatedTotal)}</span>
                      </div>

                      {balance > 0 && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-amber-200">Balance Due:</span>
                          <span className="font-mono font-bold text-red-300">{formatUGX(balance)}</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                        {b.status !== 'confirmed' ? (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'confirmed')}
                            className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm</span>
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                updateBookingStatus(b.id, 'pending');
                                showToast(
                                  'Date Unconfirmed',
                                  `Booking for ${b.clientName} moved back to pending inquiry. Calendar date freed.`,
                                  'info'
                                );
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="Unconfirm booking & release date back to pending inquiry"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Unconfirm</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteSingleModalTarget(b)}
                              className="px-2.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 border border-red-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="Delete confirmed booking and remove reservation from calendar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Date</span>
                            </button>
                          </>
                        )}

                        <a
                          href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${b.clientName}, SBL Events confirming schedule for your ${b.eventType.replace('_', ' ')} on ${b.eventDate}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        {onOpenBookingDetails && (
                          <button
                            onClick={() => onOpenBookingDetails(b)}
                            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20"
                            title="View Full Booking"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {selectedDayInfo.dayCalEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-2xl bg-[#0E1D35] border border-purple-500/30 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-300 uppercase tracking-wide">
                        {evt.status.replace('_', ' ')}
                      </span>
                      <button
                        onClick={() => deleteCalendarEvent(evt.id)}
                        className="text-red-400 hover:text-red-200"
                        title="Delete slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="font-bold text-white text-sm">{evt.title}</h4>
                    <p className="text-xs text-slate-300">{evt.location}</p>
                  </div>
                ))}

                {selectedDayInfo.dayBookings.length === 0 && selectedDayInfo.dayCalEvents.length === 0 && (
                  <div className="text-center py-8 px-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 mx-auto flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">No Events Booked for this Day</h4>
                      <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                        This date is open in the depot schedule and ready for mega tent rigging, sound, and lighting deployment.
                      </p>
                    </div>
                    {onOpenManualBooking && (
                      <button
                        onClick={onOpenManualBooking}
                        className="px-4 py-2 rounded-xl bg-white text-[#0F1F38] text-xs font-bold shadow-sm hover:bg-slate-100 transition-all inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Book {selectedDateStr}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              Select any day on the monthly grid to view production and booking details.
            </div>
          )}

          {/* Quick Hotline Footer */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold">Dispatch Hub: Lwengo Depot</span>
            <span className="font-mono text-blue-300 font-bold">+256 752 420 911</span>
          </div>
        </div>
      </div>

      {/* MODAL: DELETE ALL CONFIRMED BOOKINGS FOR DATE */}
      <AnimatePresence>
        {deleteDateModalTarget && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setDeleteDateModalTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0F1F38] border border-red-500/40 rounded-3xl p-6 shadow-2xl text-white space-y-5"
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-400">
                      Calendar Schedule Management
                    </span>
                    <h3 className="text-base font-extrabold text-white">
                      Delete Confirmed Date?
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteDateModalTarget(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B1528] border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold">Target Date:</span>
                  <span className="font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    {deleteDateModalTarget.dateStr}
                  </span>
                </div>
                <div className="text-slate-300 leading-relaxed">
                  You are about to delete <strong className="text-white">{deleteDateModalTarget.confirmedBookings.length} confirmed event booking(s)</strong>
                  {deleteDateModalTarget.bookedCalEvents.length > 0 && ` and ${deleteDateModalTarget.bookedCalEvents.length} calendar fixture(s)`}.
                </div>

                <div className="mt-2 space-y-1 max-h-36 overflow-y-auto">
                  {deleteDateModalTarget.confirmedBookings.map((b) => (
                    <div key={b.id} className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                      <span className="font-bold text-white truncate max-w-[180px]">{b.clientName}</span>
                      <span className="font-mono text-amber-300 text-[11px]">{formatUGX(b.estimatedTotal)}</span>
                    </div>
                  ))}
                  {deleteDateModalTarget.bookedCalEvents.map((e) => (
                    <div key={e.id} className="p-2 rounded-lg bg-purple-900/20 border border-purple-500/20 flex items-center justify-between">
                      <span className="font-bold text-purple-200 truncate">{e.title}</span>
                      <span className="text-[10px] text-purple-300">Custom Hold</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-200 text-xs">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p>
                  This frees this calendar date completely so other clients can book it immediately. This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteDateModalTarget(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const count = deleteDateModalTarget.confirmedBookings.length + deleteDateModalTarget.bookedCalEvents.length;
                    deleteDateModalTarget.confirmedBookings.forEach((b) => deleteBooking(b.id));
                    deleteDateModalTarget.bookedCalEvents.forEach((e) => deleteCalendarEvent(e.id));
                    showToast(
                      'Confirmed Date Deleted',
                      `Removed ${count} reservation(s) on ${deleteDateModalTarget.dateStr}. Date is now open for new events.`,
                      'warning'
                    );
                    setDeleteDateModalTarget(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete Confirmed Date</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: DELETE INDIVIDUAL CONFIRMED BOOKING */}
      <AnimatePresence>
        {deleteSingleModalTarget && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setDeleteSingleModalTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0F1F38] border border-red-500/40 rounded-3xl p-6 shadow-2xl text-white space-y-5"
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-400">
                      Delete Confirmed Booking
                    </span>
                    <h3 className="text-base font-extrabold text-white">
                      Remove Booking & Free Date
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteSingleModalTarget(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B1528] border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded">
                    {deleteSingleModalTarget.referenceNumber}
                  </span>
                  <span className="text-amber-400 font-black font-mono">
                    {formatUGX(deleteSingleModalTarget.estimatedTotal)}
                  </span>
                </div>
                <h4 className="font-extrabold text-white text-sm">
                  {deleteSingleModalTarget.clientName}
                </h4>
                <div className="text-slate-300 flex items-center gap-2">
                  <span>📅 {deleteSingleModalTarget.eventDate}</span>
                  <span>•</span>
                  <span className="capitalize">{deleteSingleModalTarget.eventType.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-200 text-xs">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p>
                  Permanently deletes this confirmed event and removes the date lock on the monthly calendar.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteSingleModalTarget(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteBooking(deleteSingleModalTarget.id);
                    showToast(
                      'Booking Deleted',
                      `Deleted confirmed booking for ${deleteSingleModalTarget.clientName} (${deleteSingleModalTarget.eventDate}).`,
                      'warning'
                    );
                    setDeleteSingleModalTarget(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Confirmed Date</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
