import React from 'react';
import { sblWeddingCoupleLogoImg } from '../data/mockData';

interface SblLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  tagline?: string;
  className?: string;
  badge?: string;
  animated?: boolean;
}

export const SblLogo: React.FC<SblLogoProps> = ({
  size = 'md',
  showText = true,
  tagline = 'We Design Your Dream',
  className = '',
  badge,
  animated = false,
}) => {
  const sizeClasses = {
    xs: { icon: 'w-7 h-7', text: 'text-sm', sub: 'text-[9px]', badge: 'text-[8px] px-1.5' },
    sm: { icon: 'w-9 h-9', text: 'text-base', sub: 'text-[10px]', badge: 'text-[8px] px-2' },
    md: { icon: 'w-11 h-11', text: 'text-lg sm:text-xl', sub: 'text-[11px]', badge: 'text-[9px] px-2.5' },
    lg: { icon: 'w-14 h-14', text: 'text-xl sm:text-2xl', sub: 'text-xs', badge: 'text-[10px] px-3' },
    xl: { icon: 'w-20 h-20', text: 'text-2xl sm:text-3xl', sub: 'text-sm', badge: 'text-xs px-3.5' },
    '2xl': { icon: 'w-28 h-28', text: 'text-3xl sm:text-4xl', sub: 'text-base', badge: 'text-sm px-4' },
  }[size];

  return (
    <div className={`flex items-center gap-3 text-left ${className}`}>
      {/* Wedding Couple Emblem Logo Image with Royal Blue Ring */}
      <div
        className={`relative ${sizeClasses.icon} rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-blue-700 via-blue-500 to-sky-300 shadow-lg shadow-blue-500/25 shrink-0 border border-blue-400/50 ${
          animated ? 'hover:scale-105 transition-transform duration-300' : ''
        }`}
      >
        <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#060D1A] relative">
          <img
            src={sblWeddingCoupleLogoImg}
            alt="SBL Events - Wedding Couple Logo (Man & Woman Getting Married)"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Subtle clean overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-blue-400/10 pointer-events-none" />
        </div>
      </div>

      {showText && (
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-black tracking-tight text-white font-['Outfit'] ${sizeClasses.text}`}
            >
              SBL <span className="text-blue-400 font-normal">EVENTS</span>
            </span>
            {badge && (
              <span
                className={`font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-200 border border-blue-400/40 rounded-full ${sizeClasses.badge}`}
              >
                {badge}
              </span>
            )}
          </div>
          {tagline && (
            <p className={`text-slate-300 font-medium tracking-wide truncate ${sizeClasses.sub}`}>
              <span className="text-blue-300 font-semibold">{tagline}</span>
              <span className="hidden sm:inline"> • Mega Tents, Sound &amp; Staging</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};
