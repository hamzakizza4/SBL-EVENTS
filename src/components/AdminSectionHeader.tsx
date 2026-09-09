import React from 'react';
import { ArrowLeft, LucideIcon } from 'lucide-react';

interface AdminSectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string | number;
  badgeColor?: 'blue' | 'amber' | 'emerald' | 'purple' | 'red';
  icon?: LucideIcon;
  onBack: () => void;
  backLabel?: string;
  children?: React.ReactNode;
}

export const AdminSectionHeader: React.FC<AdminSectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  badgeColor = 'blue',
  icon: Icon,
  onBack,
  backLabel = 'Back to Overview',
  children,
}) => {
  const badgeColorClasses = {
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
  }[badgeColor];

  return (
    <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/15 bg-linear-to-r from-[#132644] to-[#0D1C34] text-white shadow-xl space-y-4">
      {/* Top Bar: Navigation Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs sm:text-sm font-semibold border border-white/15 transition-all cursor-pointer shadow-xs group"
          title={backLabel}
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
          <span>{backLabel}</span>
        </button>

        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
          <span className="hidden sm:inline">Admin Panel</span>
          <span className="hidden sm:inline">/</span>
          <span className="text-slate-200 font-medium truncate max-w-[120px] sm:max-w-none">{title}</span>
        </div>
      </div>

      {/* Main Header Content and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            {Icon && (
              <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300">
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
            )}
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{title}</h2>
            {badge !== undefined && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${badgeColorClasses}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">{subtitle}</p>}
        </div>

        {/* Action Buttons Slot */}
        {children && (
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
