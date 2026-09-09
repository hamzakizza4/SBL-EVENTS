import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  COMPANY_CONTACT_INFO, 
  eventsCalendarBannerImg, 
  sblHallStageStockImg,
  sblMegaTentImg,
  kwanjulaRoyalStageImg,
  sblWeddingCoupleLogoImg
} from '../data/mockData';
import { getThemeClasses } from '../utils/themeStyles';
import { getBlockedDatesMap, isPastDate } from '../utils/bookingDateUtils';
import { GeometricHeroBanner } from './GeometricHeroBanner';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollReveal';
import { SblLogo } from './SblLogo';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Plus, 
  Filter, 
  Sparkles, 
  Ban, 
  ShieldAlert, 
  Clock, 
  Phone, 
  MessageCircle, 
  ShieldCheck,
  Boxes,
  Layers,
  Search,
  ArrowRight,
  TrendingUp,
  Truck,
  Check,
  List,
  Grid,
  Info,
  AlertCircle,
  CalendarCheck,
  Wrench,
  PackageCheck
} from 'lucide-react';

type CalendarStatusType = 'booked' | 'preparing' | 'teardown' | 'showcase' | 'available' | 'past';

export const CalendarView: React.FC = () => {
  const { 
    calendarEvents, 
    bookings, 
    inventory, 
    openBookingModal, 
    theme, 
    bufferDaysBefore, 
    bufferDaysAfter 
  } = useApp();
  const t = getThemeClasses(theme);

  // Calendar month state (September 2026 by default)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 1)); // September 2026
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'agenda'>('grid');

  // Inventory filter state
  const [invCategory, setInvCategory] = useState<string>('all');
  const [invSearch, setInvSearch] = useState<string>('');

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

  // Inventory Filtering & Stats
  const categoriesList = useMemo(() => {
    const cats = new Set(inventory.map((item) => item.category));
    return ['all', ...Array.from(cats)];
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchCategory = invCategory === 'all' || item.category.toLowerCase() === invCategory.toLowerCase();
      const matchSearch = 
        item.name.toLowerCase().includes(invSearch.toLowerCase()) || 
        item.specs.toLowerCase().includes(invSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(invSearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [inventory, invCategory, invSearch]);

  const totalUnitsFleet = useMemo(() => {
    return inventory.reduce((acc, item) => acc + item.totalQuantity, 0);
  }, [inventory]);

  const availableUnitsFleet = useMemo(() => {
    return inventory.reduce((acc, item) => acc + item.availableQuantity, 0);
  }, [inventory]);

  const deployedUnitsFleet = totalUnitsFleet - availableUnitsFleet;

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const goToCurrent = () => {
    setCurrentDate(new Date(2026, 8, 1));
    setSelectedDay(null);
  };

  // Helper to format date string YYYY-MM-DD
  const formatDayString = (day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Find events for a specific day
  const getEventsForDay = (day: number) => {
    const dateStr = formatDayString(day);
    return calendarEvents.filter((evt) => {
      if (filterType !== 'all' && evt.eventType !== filterType) return false;
      return evt.startDate <= dateStr && evt.endDate >= dateStr;
    });
  };

  // Helper to get comprehensive status for a day
  const getDayStatusInfo = (dateStr: string, day: number) => {
    const isPast = isPastDate(dateStr);
    const evts = getEventsForDay(day);
    const blockedInfo = blockedDatesMap.get(dateStr);
    const hasShowcase = evts.some(e => e.status === 'public_showcase' || e.status === 'tentative');

    let statusType: CalendarStatusType = 'available';
    let statusLabel = 'Available';
    let shortLabel = 'Open';
    let badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    let cellBg = 'bg-[#060B14]/80 border-emerald-500/25 hover:border-emerald-400 hover:bg-emerald-500/10';
    let dotColor = 'bg-emerald-400';

    if (isPast) {
      statusType = 'past';
      statusLabel = 'Past Date';
      shortLabel = 'Past';
      badgeBg = 'bg-white/5 text-slate-400 border-white/10';
      cellBg = 'bg-[#060B14]/40 border-white/5 opacity-60';
      dotColor = 'bg-slate-600';
    } else if (blockedInfo?.isEventDay) {
      statusType = 'booked';
      statusLabel = 'Booked (Live Event)';
      shortLabel = 'Booked';
      badgeBg = 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-black shadow-xs';
      cellBg = 'bg-gradient-to-b from-red-950/40 to-[#060B14] border-red-500/50 hover:border-red-400 shadow-md shadow-red-950/20';
      dotColor = 'bg-red-500 ring-2 ring-red-400/40 animate-pulse';
    } else if (blockedInfo?.isBufferDay && blockedInfo?.isBufferBefore) {
      statusType = 'preparing';
      statusLabel = 'Preparing (Rigging & Setup)';
      shortLabel = 'Preparing';
      badgeBg = 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-xs';
      cellBg = 'bg-gradient-to-b from-amber-950/35 to-[#060B14] border-amber-500/50 hover:border-amber-400';
      dotColor = 'bg-amber-400 ring-2 ring-amber-400/30';
    } else if (blockedInfo?.isBufferDay && blockedInfo?.isBufferAfter) {
      statusType = 'teardown';
      statusLabel = 'Teardown / Strike Buffer';
      shortLabel = 'Teardown';
      badgeBg = 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-xs';
      cellBg = 'bg-gradient-to-b from-purple-950/35 to-[#060B14] border-purple-500/50 hover:border-purple-400';
      dotColor = 'bg-purple-400 ring-2 ring-purple-400/30';
    } else if (hasShowcase) {
      statusType = 'showcase';
      statusLabel = 'Showcase / Inquiry';
      shortLabel = 'Showcase';
      badgeBg = 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-bold';
      cellBg = 'bg-gradient-to-b from-sky-950/35 to-[#060B14] border-sky-500/50 hover:border-sky-400';
      dotColor = 'bg-sky-400';
    }

    return {
      statusType,
      statusLabel,
      shortLabel,
      badgeBg,
      cellBg,
      dotColor,
      blockedInfo,
      events: evts,
      isPast
    };
  };

  // Month Statistics for Status Legend
  const monthStats = useMemo(() => {
    let bookedCount = 0;
    let preparingCount = 0;
    let teardownCount = 0;
    let showcaseCount = 0;
    let availableCount = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDayString(d);
      const blocked = blockedDatesMap.get(dateStr);
      const evts = calendarEvents.filter(e => e.startDate <= dateStr && e.endDate >= dateStr);
      if (blocked?.isEventDay) bookedCount++;
      else if (blocked?.isBufferBefore) preparingCount++;
      else if (blocked?.isBufferAfter) teardownCount++;
      else if (evts.some(e => e.status === 'public_showcase' || e.status === 'tentative')) showcaseCount++;
      else availableCount++;
    }

    return {
      bookedCount,
      preparingCount,
      teardownCount,
      showcaseCount,
      availableCount
    };
  }, [daysInMonth, month, year, blockedDatesMap, calendarEvents]);

  // Days grid
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyPrefixDays = Array.from({ length: firstDayIndex }, (_, i) => i);

  const selectedDayEvents = selectedDay
    ? calendarEvents.filter((e) => e.startDate <= selectedDay && e.endDate >= selectedDay)
    : [];

  const selectedDayBlockedInfo = selectedDay ? blockedDatesMap.get(selectedDay) : undefined;

  return (
    <div id="calendar-view" className="w-full pb-20 space-y-10">
      
      {/* 1. CINEMATIC GEOMETRIC HERO BANNER */}
      <GeometricHeroBanner
        badgeText="Live Production Dispatch & Availability Schedule"
        badgeIcon={<CalendarIcon className="w-4 h-4 text-amber-300" />}
        accentHeading="DISPATCH & FIXTURES"
        primaryHeading="EVENT SCHEDULE CALENDAR"
        description="Verify confirmed wedding dates, Kwanjula bookings, corporate fixtures, and open warehouse dispatch slots. Check real-time date availability and reserve your setup."
        mainImage={eventsCalendarBannerImg}
        secondaryImage={sblHallStageStockImg}
        tertiaryImage={kwanjulaRoyalStageImg}
        bgPatternImage={eventsCalendarBannerImg}
        themeVariant="amber"
        primaryCta={{
          label: "Reserve Event Date",
          onClick: () => openBookingModal(),
          icon: <Plus className="w-4 h-4" />
        }}
        secondaryCta={{
          label: "WhatsApp Date Check",
          href: COMPANY_CONTACT_INFO.whatsappUrl,
          isExternal: true,
          variant: "whatsapp",
          icon: <MessageCircle className="w-4 h-4" />
        }}
        customSlot={
          <div className="p-3.5 rounded-2xl bg-[#050811]/90 backdrop-blur-md border border-amber-500/30 text-xs text-slate-200 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong className="text-amber-300">Smart Buffer Protection:</strong> Dates include automated pre-event rigging (orange) and post-event strike buffers (purple) to ensure pristine setup execution.
            </span>
          </div>
        }
        stats={[
          { value: `${calendarEvents.length}`, label: "Confirmed Fixtures" },
          { value: `${availableUnitsFleet}`, label: "Available Fleet Items" },
          { value: "24/7", label: "Emergency Support" }
        ]}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

      {/* Main Calendar Card */}
      <ScrollReveal className="bg-[#0B1322] border border-amber-500/20 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl space-y-6" yOffset={35}>
        
        {/* Calendar Top Control Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          
          {/* Month Title & Fast Nav */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-['Outfit'] tracking-tight flex items-center gap-2">
              <span>{monthNames[month]}</span>
              <span className="text-amber-400">{year}</span>
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={goToCurrent}
                className="text-xs px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 font-bold transition-colors cursor-pointer"
              >
                Today
              </button>

              {/* Month Switcher Buttons */}
              <div className="flex items-center gap-1 border border-white/20 rounded-xl p-1 bg-[#060B14]">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* View Mode Toggle & Event Type Filter */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Switcher: Month Grid vs Agenda List */}
            <div className="flex items-center p-1 rounded-xl bg-[#060B14] border border-white/20">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Month Grid</span>
              </button>
              <button
                onClick={() => setViewMode('agenda')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'agenda'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Agenda List</span>
              </button>
            </div>

            {/* Event Category Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs bg-[#060B14] text-white border border-white/20 rounded-xl px-3 py-2 focus:outline-hidden focus:border-amber-400"
            >
              <option value="all">All Event Types</option>
              <option value="wedding">Weddings</option>
              <option value="corporate">Corporate Galas</option>
              <option value="concert_festival">Concerts & Festivals</option>
              <option value="tent_lending_b2b">B2B Tent Lending</option>
              <option value="cultural_religious">Kwanjula & Cultural</option>
            </select>
          </div>
        </div>

        {/* 2. PROMINENT COLOR-CODED STATUS LEGEND BAR (Booked, Preparing, Teardown, Available, Showcase) */}
        <div className="p-3.5 rounded-2xl bg-[#060B14] border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300/90 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Live Schedule Color System &amp; Filters</span>
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              Tap any status chip to filter dates
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* All */}
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              <span>All Days ({daysInMonth})</span>
            </button>

            {/* Booked (Red) */}
            <button
              onClick={() => setStatusFilter(statusFilter === 'booked' ? 'all' : 'booked')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'booked'
                  ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-md'
                  : 'bg-rose-950/40 text-rose-300 border border-rose-500/40 hover:bg-rose-900/50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
              <span>Booked ({monthStats.bookedCount})</span>
            </button>

            {/* Preparing / Rigging (Amber / Orange) */}
            <button
              onClick={() => setStatusFilter(statusFilter === 'preparing' ? 'all' : 'preparing')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'preparing'
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-md font-black'
                  : 'bg-amber-950/40 text-amber-300 border border-amber-500/40 hover:bg-amber-900/50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
              <span>Preparing &amp; Rigging ({monthStats.preparingCount})</span>
            </button>

            {/* Teardown / Post-Buffer (Purple) */}
            <button
              onClick={() => setStatusFilter(statusFilter === 'teardown' ? 'all' : 'teardown')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'teardown'
                  ? 'bg-purple-600 text-white ring-2 ring-purple-400 shadow-md'
                  : 'bg-purple-950/40 text-purple-300 border border-purple-500/40 hover:bg-purple-900/50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shrink-0" />
              <span>Teardown Strike ({monthStats.teardownCount})</span>
            </button>

            {/* Open & Available (Green) */}
            <button
              onClick={() => setStatusFilter(statusFilter === 'available' ? 'all' : 'available')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'available'
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-md'
                  : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
              <span>Available Slots ({monthStats.availableCount})</span>
            </button>

            {/* Public Showcase (Sky Blue) */}
            {monthStats.showcaseCount > 0 && (
              <button
                onClick={() => setStatusFilter(statusFilter === 'showcase' ? 'all' : 'showcase')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  statusFilter === 'showcase'
                    ? 'bg-sky-600 text-white ring-2 ring-sky-400 shadow-md'
                    : 'bg-sky-950/40 text-sky-300 border border-sky-500/40 hover:bg-sky-900/50'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                <span>Showcase / Expo ({monthStats.showcaseCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. CALENDAR VIEW MODE 1: RESPONSIVE MONTH GRID */}
        {viewMode === 'grid' && (
          <div className="space-y-3">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300/90 pb-1">
              <div className="py-1 rounded-lg bg-[#060B14]/60"><span className="hidden sm:inline">Sunday</span><span className="sm:hidden">Sun</span></div>
              <div className="py-1 rounded-lg bg-[#060B14]/60"><span className="hidden sm:inline">Monday</span><span className="sm:hidden">Mon</span></div>
              <div className="py-1 rounded-lg bg-[#060B14]/60"><span className="hidden sm:inline">Tuesday</span><span className="sm:hidden">Tue</span></div>
              <div className="py-1 rounded-lg bg-[#060B14]/60"><span className="hidden sm:inline">Wednesday</span><span className="sm:hidden">Wed</span></div>
              <div className="py-1 rounded-lg bg-[#060B14]/60"><span className="hidden sm:inline">Thursday</span><span className="sm:hidden">Thu</span></div>
              <div className="py-1 rounded-lg bg-[#060B14]/60"><span className="hidden sm:inline">Friday</span><span className="sm:hidden">Fri</span></div>
              <div className="py-1 rounded-lg bg-[#060B14]/60"><span className="hidden sm:inline">Saturday</span><span className="sm:hidden">Sat</span></div>
            </div>

            {/* Days Grid - Optimized for Mobile with No Text Squishing */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2.5">
              {emptyPrefixDays.map((_, idx) => (
                <div 
                  key={`empty-${idx}`} 
                  className="min-h-[64px] sm:min-h-[105px] md:min-h-[120px] rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/[0.04] opacity-20 pointer-events-none" 
                />
              ))}

              {daysArray.map((day) => {
                const dateStr = formatDayString(day);
                const statusInfo = getDayStatusInfo(dateStr, day);
                const isSelected = selectedDay === dateStr;

                // Status Filter Match check
                const isStatusMatch = 
                  statusFilter === 'all' || 
                  (statusFilter === 'booked' && statusInfo.statusType === 'booked') ||
                  (statusFilter === 'preparing' && statusInfo.statusType === 'preparing') ||
                  (statusFilter === 'teardown' && statusInfo.statusType === 'teardown') ||
                  (statusFilter === 'available' && statusInfo.statusType === 'available') ||
                  (statusFilter === 'showcase' && statusInfo.statusType === 'showcase');

                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(dateStr)}
                    className={`min-h-[64px] sm:min-h-[105px] md:min-h-[120px] rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/25 ring-2 ring-amber-400 shadow-xl shadow-amber-500/20 scale-[1.02] z-10'
                        : isStatusMatch
                        ? statusInfo.cellBg
                        : 'opacity-30 bg-[#060B14]/30 border-white/5'
                    }`}
                  >
                    {/* Top Row: Day Number & Status Dot/Badge */}
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-amber-300 font-black' : 'text-white'}`}>
                        {day}
                      </span>
                      
                      {/* Mobile compact dot, Desktop full badge */}
                      <div className="flex items-center">
                        <span className="sm:hidden">
                          <span className={`inline-block w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
                        </span>
                        <span className={`hidden sm:inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${statusInfo.badgeBg}`}>
                          {statusInfo.shortLabel}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Content Area: Mobile Status Tag / Desktop Detailed Badges */}
                    <div className="mt-1 space-y-1 overflow-hidden">
                      {/* Mobile Compact Label */}
                      <div className="sm:hidden">
                        {statusInfo.statusType === 'booked' && (
                          <div className="text-[8px] font-black text-rose-300 truncate bg-rose-500/20 rounded px-1 py-0.2">
                            Booked
                          </div>
                        )}
                        {statusInfo.statusType === 'preparing' && (
                          <div className="text-[8px] font-black text-amber-300 truncate bg-amber-500/20 rounded px-1 py-0.2">
                            Setup
                          </div>
                        )}
                        {statusInfo.statusType === 'teardown' && (
                          <div className="text-[8px] font-bold text-purple-300 truncate bg-purple-500/20 rounded px-1 py-0.2">
                            Strike
                          </div>
                        )}
                        {statusInfo.statusType === 'available' && !statusInfo.isPast && (
                          <div className="text-[8px] font-medium text-emerald-400 truncate flex items-center justify-center">
                            + Open
                          </div>
                        )}
                      </div>

                      {/* Desktop Detailed Event Badges */}
                      <div className="hidden sm:block space-y-1">
                        {statusInfo.blockedInfo?.isBufferDay && (
                          <div className={`text-[9px] truncate px-1.5 py-0.5 rounded font-bold ${
                            statusInfo.blockedInfo.isBufferBefore 
                              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30' 
                              : 'bg-purple-500/20 text-purple-200 border border-purple-500/30'
                          }`}>
                            {statusInfo.blockedInfo.isBufferBefore ? 'Pre-Event Rigging' : 'Teardown Buffer'}
                          </div>
                        )}

                        {statusInfo.events.slice(0, 2).map((evt) => (
                          <div
                            key={evt.id}
                            className={`text-[9px] truncate px-1.5 py-0.5 rounded-md font-bold shadow-xs ${
                              evt.status === 'public_showcase'
                                ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white'
                                : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950'
                            }`}
                          >
                            {evt.title}
                          </div>
                        ))}

                        {statusInfo.events.length > 2 && (
                          <span className="text-[9px] text-slate-300 block font-bold">
                            +{statusInfo.events.length - 2} more
                          </span>
                        )}

                        {statusInfo.statusType === 'available' && !statusInfo.isPast && (
                          <span className="text-[9px] text-emerald-400/80 block font-medium">
                            ✓ Open to Book
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. CALENDAR VIEW MODE 2: MOBILE-OPTIMIZED AGENDA TIMELINE LIST */}
        {viewMode === 'agenda' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-slate-300">
                Full Month Agenda Stream ({monthNames[month]} {year})
              </h3>
              <span className="text-xs text-amber-300 font-semibold">
                Tap any item to view details
              </span>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {daysArray.map((day) => {
                const dateStr = formatDayString(day);
                const statusInfo = getDayStatusInfo(dateStr, day);
                const dayName = new Date(year, month, day).toLocaleDateString('en-US', { weekday: 'short' });
                const isSelected = selectedDay === dateStr;

                // If filtering by status
                if (statusFilter !== 'all') {
                  if (statusFilter === 'booked' && statusInfo.statusType !== 'booked') return null;
                  if (statusFilter === 'preparing' && statusInfo.statusType !== 'preparing') return null;
                  if (statusFilter === 'teardown' && statusInfo.statusType !== 'teardown') return null;
                  if (statusFilter === 'available' && statusInfo.statusType !== 'available') return null;
                  if (statusFilter === 'showcase' && statusInfo.statusType !== 'showcase') return null;
                }

                return (
                  <div
                    key={`agenda-${day}`}
                    onClick={() => setSelectedDay(dateStr)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/20 ring-2 ring-amber-400/50 shadow-lg'
                        : statusInfo.cellBg
                    }`}
                  >
                    {/* Date Block */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#060B14] border border-white/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] uppercase font-bold text-amber-400">{dayName}</span>
                        <span className="text-base font-black text-white">{day}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${statusInfo.badgeBg}`}>
                            {statusInfo.statusLabel}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{dateStr}</span>
                        </div>

                        {statusInfo.events.length > 0 ? (
                          <div className="space-y-0.5">
                            {statusInfo.events.map(e => (
                              <h4 key={e.id} className="text-sm font-bold text-white flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>{e.title}</span>
                              </h4>
                            ))}
                          </div>
                        ) : statusInfo.blockedInfo ? (
                          <p className="text-xs text-slate-300 font-medium">
                            {statusInfo.blockedInfo.reason}
                          </p>
                        ) : (
                          <p className="text-xs text-emerald-300 font-medium">
                            Fleet &amp; Rigging crews are fully available for reservation.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="w-full sm:w-auto flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                      {statusInfo.statusType === 'available' && !statusInfo.isPast ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openBookingModal({ date: dateStr });
                          }}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-105 transition-transform"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Reserve Date</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold">
                          {statusInfo.isPast ? 'Closed' : 'Unavailable'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </ScrollReveal>

      {/* Selected Day Details Panel */}
      {selectedDay && (
        <ScrollReveal className="rounded-3xl p-6 sm:p-8 bg-[#0B1322] border border-amber-500/30 shadow-2xl text-white space-y-6" yOffset={30}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block">
                  Selected Schedule Details
                </span>
                {selectedDayBlockedInfo && (
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                    selectedDayBlockedInfo.isEventDay
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                      : selectedDayBlockedInfo.isBufferBefore
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                  }`}>
                    {selectedDayBlockedInfo.isEventDay 
                      ? '🔴 Confirmed Booked Event' 
                      : selectedDayBlockedInfo.isBufferBefore 
                      ? '🟠 Mandatory Pre-Event Rigging' 
                      : '🟣 Post-Event Strike Buffer'}
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">{selectedDay}</h3>
            </div>

            {isPastDate(selectedDay) ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-slate-300 text-xs font-bold">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Past Date (Booking Closed)</span>
              </div>
            ) : selectedDayBlockedInfo ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold">
                <Ban className="w-4 h-4 text-rose-400" />
                <span>Date Reserved / Under Rigging Buffer</span>
              </div>
            ) : (
              <button
                onClick={() => openBookingModal({ date: selectedDay })}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Book Event for {selectedDay}</span>
              </button>
            )}
          </div>

          {selectedDayEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedDayEvents.map((e) => (
                <div
                  key={e.id}
                  className="p-5 rounded-2xl bg-[#060B14] border border-amber-500/20 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                      {e.eventType}
                    </span>
                    <span className="text-xs text-slate-300 font-mono">
                      {e.startDate} to {e.endDate}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white">{e.title}</h4>
                  <p className="text-xs text-slate-300">{e.publicDescription || e.title}</p>

                  <div className="pt-2 border-t border-white/10 flex items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {e.location}
                    </span>
                    {e.clientName && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        {e.clientName}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-3 bg-[#060B14] rounded-2xl border border-white/10">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Date is Open &amp; Available for Setup</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                No major marquee rig or festival is scheduled for {selectedDay}. Our fleet and crews are ready for dispatch.
              </p>
              <button
                onClick={() => openBookingModal({ date: selectedDay })}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs inline-flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all mt-2 cursor-pointer"
              >
                <span>Reserve {selectedDay} Now</span>
              </button>
            </div>
          )}
        </ScrollReveal>
      )}

      {/* Live Inventory Stock Section */}
      <ScrollReveal id="live-inventory-section" className="rounded-3xl p-6 sm:p-10 bg-[#0B1322] border border-amber-500/20 shadow-2xl text-white space-y-8 relative overflow-hidden" yOffset={35}>
        {/* Subtle Decorative Background Image of SBL Hall Stage & Decor */}
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-64 opacity-20 pointer-events-none overflow-hidden rounded-tr-3xl">
          <img
            src={sblHallStageStockImg}
            alt="SBL Events Stock & Setup"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0B1322]/80 to-[#0B1322]" />
        </div>

        {/* Section Header */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold shadow-xs backdrop-blur-md">
              <Boxes className="w-4 h-4 text-amber-400" />
              <span>Real-Time Warehouse Stock &amp; Dispatch Fleet</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-['Outfit'] text-white">
              Inventory in Stock at the Moment
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Live equipment quantities ready for immediate deployment from our Lwengo &amp; Masaka logistics warehouses. Check available Mega Tents, LED panels, concert sound, and luxury restroom trailers.
            </p>
          </div>

          {/* Quick Reserve CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openBookingModal()}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <span>Book Equipment for Event</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={COMPANY_CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Inquiries</span>
            </a>
          </div>
        </div>

        {/* Real-time Fleet Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#060B14] border border-white/10 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Fleet Units</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">{totalUnitsFleet.toLocaleString()}</span>
              <span className="text-xs text-slate-400">items</span>
            </div>
            <p className="text-[10px] text-slate-300 flex items-center gap-1 mt-1">
              <Check className="w-3 h-3 text-amber-400" />
              <span>Certified heavy-duty equipment</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#060B14] border border-white/10 space-y-1">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">In Stock &amp; Ready</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-['Outfit']">{availableUnitsFleet.toLocaleString()}</span>
              <span className="text-xs text-emerald-300 font-semibold">available now</span>
            </div>
            <p className="text-[10px] text-slate-300 flex items-center gap-1 mt-1">
              <Truck className="w-3 h-3 text-amber-300" />
              <span>Immediate loading ready</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#060B14] border border-white/10 space-y-1">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">On Active Deployments</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-['Outfit']">{deployedUnitsFleet.toLocaleString()}</span>
              <span className="text-xs text-amber-300 font-semibold">currently dispatched</span>
            </div>
            <p className="text-[10px] text-slate-300 flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-amber-300" />
              <span>Returning per schedule</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#060B14] border border-white/10 space-y-1">
            <span className="text-[11px] font-bold text-amber-300/80 uppercase tracking-wider block">Fleet Availability</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                {totalUnitsFleet > 0 ? Math.round((availableUnitsFleet / totalUnitsFleet) * 100) : 100}%
              </span>
              <span className="text-xs text-amber-200">operational rate</span>
            </div>
            <p className="text-[10px] text-slate-300 flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Inspected after every event</span>
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categoriesList.map((cat) => {
              const isSelected = invCategory === cat;
              const label = cat === 'all' ? 'All Inventory' : cat;
              return (
                <button
                  key={cat}
                  onClick={() => setInvCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md scale-105'
                      : 'bg-[#060B14] hover:bg-amber-400/20 text-slate-200 border border-white/15'
                  }`}
                >
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tents, LED, sound..."
              value={invSearch}
              onChange={(e) => setInvSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#060B14] border border-white/20 text-white placeholder:text-slate-400 text-xs focus:outline-hidden focus:border-amber-400 transition-colors"
            />
          </div>
        </div>

        {/* Inventory Cards Grid */}
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5" staggerDelay={0.06}>
          {filteredInventory.map((item) => {
            const availPct = item.totalQuantity > 0 ? Math.round((item.availableQuantity / item.totalQuantity) * 100) : 0;
            const isLowStock = item.availableQuantity <= 1;
            const isOutOfStock = item.availableQuantity === 0;

            return (
              <StaggerItem key={item.id}>
                <div
                  className="rounded-2xl bg-[#060B14] border border-white/15 overflow-hidden flex flex-col justify-between p-3 sm:p-5 space-y-2.5 sm:space-y-4 hover:border-amber-400/60 transition-all duration-300 shadow-xl group h-full"
                >
                  {/* Top: Category & Stock Status */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 truncate">
                        {item.category}
                      </span>

                      <span className={`text-[9px] sm:text-[10px] font-extrabold uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border shrink-0 ${
                        isOutOfStock
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : isLowStock
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {isOutOfStock ? 'Booked' : isLowStock ? 'Low Stock' : 'Ready'}
                      </span>
                    </div>

                    {/* Image & Title */}
                    {item.image && (
                      <div className="w-full h-24 sm:h-36 rounded-xl overflow-hidden border border-white/10 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060B14]/90 via-transparent to-transparent" />
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[9px] sm:text-[11px] font-bold text-white px-1.5 py-0.5 rounded-lg bg-[#050811]/80 backdrop-blur-xs">
                          <span>Unit: {item.unit}</span>
                          {item.b2bEligible && <span className="text-amber-300 hidden sm:inline">Dry-Hire</span>}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-xs sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-slate-300 mt-0.5 leading-relaxed line-clamp-2">
                        {item.specs}
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Stock Progress & Action */}
                  <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-3 border-t border-white/10">
                    {/* Stock Metrics Numbers */}
                    <div className="flex items-center justify-between text-[10px] sm:text-xs font-semibold">
                      <span className="text-slate-300">
                        In Stock: <strong className="text-amber-300 text-xs sm:text-sm">{item.availableQuantity}</strong>
                      </span>
                      <span className="text-slate-400 text-[9px] sm:text-[11px]">
                        Total: {item.totalQuantity}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 sm:h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          availPct > 50 ? 'bg-emerald-400' : availPct > 20 ? 'bg-amber-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${Math.max(5, availPct)}%` }}
                      />
                    </div>

                    {/* Quick Action Button */}
                    <button
                      onClick={() => openBookingModal({ serviceId: item.id })}
                      className="w-full py-1.5 sm:py-2.5 px-2 sm:px-4 rounded-xl bg-white/10 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-500 hover:text-slate-950 hover:font-black text-white border border-white/20 font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer"
                    >
                      <span>Reserve</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Warehouse Logistics Notice */}
        <div className="p-4 rounded-2xl bg-[#060B14] border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              All inventory is dispatched with certified logistics trucks, rigging accessories, and backup power switchboards.
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full whitespace-nowrap">
            Lwengo &amp; Masaka Hubs
          </span>
        </div>

      </ScrollReveal>

      </div>

    </div>
  );
};
