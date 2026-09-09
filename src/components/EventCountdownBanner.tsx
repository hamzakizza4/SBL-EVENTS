import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flame, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Tag, 
  ShieldCheck, 
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { COUNTDOWN_CAMPAIGNS, CountdownCampaign } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { formatUGX } from '../utils/currencyUtils';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSeconds: number;
}

function calculateTimeRemaining(targetDateStr: string): TimeRemaining {
  const target = new Date(targetDateStr).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, totalSeconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    totalSeconds: Math.floor(diff / 1000)
  };
}

export const EventCountdownBanner: React.FC = () => {
  const { setCurrentPage, calendarEvents } = useApp();
  const [activeCampaignIndex, setActiveCampaignIndex] = useState(0);

  const campaigns = COUNTDOWN_CAMPAIGNS;
  const currentCampaign: CountdownCampaign = campaigns[activeCampaignIndex] || campaigns[0];

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() => 
    calculateTimeRemaining(currentCampaign.targetDate)
  );

  useEffect(() => {
    // Initial compute
    setTimeLeft(calculateTimeRemaining(currentCampaign.targetDate));

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(currentCampaign.targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentCampaign.targetDate]);

  const handleCtaClick = (action: 'book' | 'calendar' | 'whatsapp') => {
    if (action === 'book') {
      setCurrentPage('contact');
      // Scroll to form smoothly
      setTimeout(() => {
        const formEl = document.getElementById('booking-inquiry-form');
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (action === 'calendar') {
      setCurrentPage('calendar');
    } else if (action === 'whatsapp') {
      const msg = encodeURIComponent(
        `Hello SBL Events! I am inquiring about the "${currentCampaign.title}" (Target Date: ${new Date(currentCampaign.targetDate).toLocaleDateString()}). Please provide date availability and quote in Uganda Shillings (UGX).`
      );
      window.open(`https://wa.me/256700000000?text=${msg}`, '_blank', 'noopener,noreferrer');
    }
  };

  // Find next upcoming confirmed event from actual live calendar
  const nextConfirmedCalendarEvent = calendarEvents
    .filter(e => (e.status === 'booked' || e.status === 'public_showcase') && new Date(e.startDate).getTime() >= new Date().getTime())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

  return (
    <div id="landing-countdown-section" className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0B1527] via-[#0F1F38] to-[#152B4D] border border-amber-500/30 shadow-2xl p-6 sm:p-8 lg:p-10 text-white">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Campaign selector tabs */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-extrabold tracking-widest text-amber-400 uppercase flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Live Urgency Countdown & Season Timelines
          </span>
        </div>

        {/* Campaign Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
          {campaigns.map((camp, idx) => {
            const isActive = idx === activeCampaignIndex;
            return (
              <button
                key={camp.id}
                id={`campaign-tab-${camp.id}`}
                onClick={() => setActiveCampaignIndex(idx)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {camp.badgeType === 'promo' && <Flame className="w-3.5 h-3.5 text-amber-900" />}
                {camp.badgeType === 'showcase' && <Sparkles className="w-3.5 h-3.5 text-amber-900" />}
                {camp.badgeType === 'festival' && <Calendar className="w-3.5 h-3.5 text-amber-900" />}
                <span>{camp.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Promotion / Event details */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              {currentCampaign.badge}
            </span>

            {currentCampaign.slotsLeft && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/40">
                <AlertCircle className="w-3 h-3 text-red-400" />
                Only {currentCampaign.slotsLeft} Prime Weekend Slots Left
              </span>
            )}

            {currentCampaign.discountValue && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <Tag className="w-3 h-3 text-emerald-400" />
                {currentCampaign.discountLabel}: {currentCampaign.discountValue}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {currentCampaign.title}
            </h3>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
              {currentCampaign.subtitle}
            </p>
          </div>

          {/* Highlight Banner */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">Campaign Benefit:</div>
              <div className="text-xs sm:text-sm font-semibold text-white">{currentCampaign.highlightText}</div>
            </div>
          </div>

          {/* Perks list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {currentCampaign.perks.map((perk, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{perk}</span>
              </div>
            ))}
          </div>

          {/* Call to actions */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              id="countdown-primary-cta"
              onClick={() => handleCtaClick(currentCampaign.actionType)}
              className="px-6 py-3 bg-linear-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
            >
              <span>{currentCampaign.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="countdown-whatsapp-cta"
              onClick={() => handleCtaClick('whatsapp')}
              className="px-4 py-3 bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl border border-emerald-400/40 transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-emerald-200" />
              <span>WhatsApp Inquiries</span>
            </button>

            <button
              id="countdown-calendar-cta"
              onClick={() => setCurrentPage('calendar')}
              className="px-4 py-3 bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-300" />
              <span>Full Uganda Calendar</span>
            </button>
          </div>
        </div>

        {/* Right Column: High-Impact Countdown Display Digits */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full bg-black/40 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/15 shadow-xl text-center space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
              <span className="uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Target Expiration:
              </span>
              <span className="text-white font-mono font-semibold">
                {new Date(currentCampaign.targetDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>

            {/* Countdown Blocks */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {/* Days */}
              <div className="bg-linear-to-b from-white/10 to-white/5 rounded-xl p-2.5 sm:p-3 border border-white/15 flex flex-col items-center justify-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-white tracking-tight">
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-300/90 font-bold mt-1">
                  Days
                </div>
              </div>

              {/* Hours */}
              <div className="bg-linear-to-b from-white/10 to-white/5 rounded-xl p-2.5 sm:p-3 border border-white/15 flex flex-col items-center justify-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-white tracking-tight">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-300/90 font-bold mt-1">
                  Hours
                </div>
              </div>

              {/* Minutes */}
              <div className="bg-linear-to-b from-white/10 to-white/5 rounded-xl p-2.5 sm:p-3 border border-white/15 flex flex-col items-center justify-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-white tracking-tight">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-300/90 font-bold mt-1">
                  Mins
                </div>
              </div>

              {/* Seconds */}
              <div className="bg-linear-to-b from-amber-500/20 to-amber-600/10 rounded-xl p-2.5 sm:p-3 border border-amber-500/30 flex flex-col items-center justify-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-amber-400 tracking-tight animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-400 font-bold mt-1">
                  Secs
                </div>
              </div>
            </div>

            {/* Currency & Booking Note */}
            <div className="pt-2 border-t border-white/10 text-left space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">All pricing quoted in:</span>
                <span className="font-extrabold text-amber-300 font-mono">Uganda Shillings (UGX)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Standard Tent Packages from:</span>
                <span className="font-bold text-white font-mono">{formatUGX(3500000)}</span>
              </div>
            </div>

            {/* Live Sync Status with Next Real Event */}
            {nextConfirmedCalendarEvent && (
              <div className="mt-3 p-2.5 bg-blue-950/60 rounded-xl border border-blue-500/30 text-left text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-blue-300 font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Next Confirmed Dispatch:</span>
                </div>
                <div className="text-slate-200 font-medium truncate">
                  {nextConfirmedCalendarEvent.title} ({nextConfirmedCalendarEvent.location})
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Date: {nextConfirmedCalendarEvent.startDate} • Status: Confirmed by Dispatch Admin
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
