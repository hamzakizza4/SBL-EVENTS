import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getThemeClasses } from '../utils/themeStyles';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Plus, 
  Filter,
  Sparkles
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { calendarEvents, openBookingModal, theme } = useApp();
  const t = getThemeClasses(theme);

  // Calendar month state (August 2026 by default)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 1)); // August 2026
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const goToCurrent = () => {
    setCurrentDate(new Date(2026, 7, 1));
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

  // Days grid
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyPrefixDays = Array.from({ length: firstDayIndex }, (_, i) => i);

  const selectedDayEvents = selectedDay
    ? calendarEvents.filter((e) => e.startDate <= selectedDay && e.endDate >= selectedDay)
    : [];

  return (
    <div id="calendar-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold shadow-xs">
          <CalendarIcon className="w-4 h-4 text-blue-300" />
          <span>Live Production Dispatch & Availability</span>
        </div>
        <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit'] ${t.headingText}`}>
          Event Schedule & Availability Calendar
        </h1>
        <p className={`text-xs sm:text-base leading-relaxed ${t.mutedText}`}>
          Check confirmed event dates, showcase rehearsals, and open dispatch slots for tent staging, audio rigs, and LED screen logistics.
        </p>
      </div>

      {/* Main Calendar Card */}
      <div className={`${t.cardBg} border ${t.cardBorder} rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6`}>
        
        {/* Calendar Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/15">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={goToCurrent}
              className="text-xs px-2.5 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 border border-white/20 font-semibold"
            >
              Today
            </button>
          </div>

          {/* Filter & Month Navigation */}
          <div className="flex items-center gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs bg-[#0E1D35] text-white border border-white/20 rounded-xl px-3 py-2 focus:outline-hidden"
            >
              <option value="all">All Event Types</option>
              <option value="wedding">Weddings</option>
              <option value="corporate">Corporate Galas</option>
              <option value="concert">Concerts & Festivals</option>
              <option value="private">Private Celebrations</option>
            </select>

            <div className="flex items-center gap-1 border border-white/20 rounded-xl p-1 bg-white/5">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {emptyPrefixDays.map((_, idx) => (
            <div key={`empty-${idx}`} className="h-24 sm:h-32 rounded-2xl bg-white/5 opacity-40" />
          ))}

          {daysArray.map((day) => {
            const dateStr = formatDayString(day);
            const evts = getEventsForDay(day);
            const isSelected = selectedDay === dateStr;
            const hasEvents = evts.length > 0;

            return (
              <div
                key={`day-${day}`}
                onClick={() => setSelectedDay(dateStr)}
                className={`h-24 sm:h-32 rounded-2xl p-2 sm:p-2.5 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-white bg-white/20 ring-2 ring-white/40 shadow-lg'
                    : hasEvents
                    ? 'border-white/20 bg-[#0E1D35] hover:border-white/40 hover:bg-white/10'
                    : 'border-white/10 bg-[#0E1D35]/50 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {day}
                  </span>
                  {hasEvents && (
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </div>

                {/* Mini Event Badges */}
                <div className="space-y-1 overflow-hidden">
                  {evts.slice(0, 2).map((evt) => (
                    <div
                      key={evt.id}
                      className="text-[9px] sm:text-[10px] truncate px-1.5 py-0.5 rounded-md font-semibold bg-white text-[#0F1F38]"
                    >
                      {evt.title}
                    </div>
                  ))}
                  {evts.length > 2 && (
                    <span className="text-[9px] text-slate-400 block font-semibold">
                      +{evts.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Selected Day Details Panel */}
      {selectedDay && (
        <div className="rounded-3xl p-6 sm:p-8 bg-[#132644] border border-white/20 shadow-2xl text-white space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
            <div>
              <span className="text-xs text-blue-300 font-bold uppercase tracking-wider block">
                Selected Schedule Details
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">{selectedDay}</h3>
            </div>

            <button
              onClick={() => openBookingModal({ date: selectedDay })}
              className="py-2.5 px-5 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Book Event for {selectedDay}</span>
            </button>
          </div>

          {selectedDayEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedDayEvents.map((e) => (
                <div
                  key={e.id}
                  className="p-5 rounded-2xl bg-[#0E1D35] border border-white/15 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-white bg-white/10 px-2 py-0.5 rounded-md">
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
                      <MapPin className="w-3.5 h-3.5 text-white" />
                      {e.location}
                    </span>
                    {e.clientName && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-white" />
                        {e.clientName}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-3 bg-[#0E1D35] rounded-2xl border border-white/10">
              <CheckCircle2 className="w-8 h-8 text-white mx-auto" />
              <h4 className="text-base font-bold text-white">Date is Open & Available</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                No major marquee rig or festival is scheduled for {selectedDay}. Our fleet and crews are ready for dispatch.
              </p>
              <button
                onClick={() => openBookingModal({ date: selectedDay })}
                className="py-2.5 px-6 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-xs inline-flex items-center gap-2 shadow-md transition-all mt-2"
              >
                <span>Reserve {selectedDay} Now</span>
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
