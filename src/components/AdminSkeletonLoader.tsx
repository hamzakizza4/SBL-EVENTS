import React from 'react';
import { Database, RefreshCw, Sparkles, CheckSquare, ChevronDown } from 'lucide-react';

/**
 * Skeleton Loader for the Admin Bookings Table
 * Features realistic table columns, shimmer sweep animation, and responsive layout.
 */
export const AdminBookingsTableSkeleton: React.FC<{ rowCount?: number }> = ({ rowCount = 6 }) => {
  return (
    <div className="space-y-4">
      {/* Live Sync Status Banner */}
      <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-400/20 text-blue-200 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <RefreshCw className="w-4 h-4 text-blue-300 animate-spin" />
          <span className="font-semibold">Fetching latest reservations from Cloud Firestore...</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline font-mono">ai-studio-sblevents</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-3xl border border-white/15 bg-[#132644] overflow-hidden text-white shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E1D35] border-b border-white/15 text-slate-300 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4 w-10 text-center">
                  <div className="w-4 h-4 rounded bg-white/10 mx-auto" />
                </th>
                <th className="p-4 w-10"></th>
                <th className="p-4">Reference</th>
                <th className="p-4">Client & Contact</th>
                <th className="p-4">Event Details</th>
                <th className="p-4">Date & Location</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {Array.from({ length: rowCount }).map((_, idx) => (
                <tr key={idx} className="relative overflow-hidden">
                  {/* Select box */}
                  <td className="p-4 text-center">
                    <div className="w-4 h-4 rounded bg-white/10 animate-pulse mx-auto" />
                  </td>

                  {/* Expand chevron */}
                  <td className="p-4 text-center">
                    <div className="w-4 h-4 rounded bg-white/10 animate-pulse mx-auto" />
                  </td>

                  {/* Reference */}
                  <td className="p-4">
                    <div className="h-4 w-28 bg-white/15 rounded animate-pulse" />
                    <div className="h-2.5 w-16 bg-white/10 rounded animate-pulse mt-1.5" />
                  </td>

                  {/* Client & Contact */}
                  <td className="p-4">
                    <div className="h-4 w-36 bg-white/20 rounded animate-pulse" />
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
                      <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                    </div>
                  </td>

                  {/* Event Details */}
                  <td className="p-4">
                    <div className="h-4 w-32 bg-white/15 rounded animate-pulse" />
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="h-3 w-14 bg-white/10 rounded animate-pulse" />
                      <div className="h-3 w-12 bg-white/10 rounded animate-pulse" />
                    </div>
                  </td>

                  {/* Date & Location */}
                  <td className="p-4">
                    <div className="h-4 w-24 bg-white/15 rounded animate-pulse" />
                    <div className="h-3 w-28 bg-white/10 rounded animate-pulse mt-1.5" />
                  </td>

                  {/* Total */}
                  <td className="p-4">
                    <div className="h-4 w-20 bg-amber-400/20 rounded animate-pulse" />
                  </td>

                  {/* Status Pill */}
                  <td className="p-4">
                    <div className="h-6 w-20 bg-white/15 rounded-full animate-pulse" />
                  </td>

                  {/* Action Buttons */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="h-7 w-16 bg-white/10 rounded-lg animate-pulse" />
                      <div className="h-7 w-7 bg-white/10 rounded-lg animate-pulse" />
                      <div className="h-7 w-7 bg-white/10 rounded-lg animate-pulse" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for Dashboard Overview & Analytics
 */
export const AdminAnalyticsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl border border-white/15 bg-[#132644] text-white space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
              <div className="w-8 h-8 rounded-xl bg-white/10 animate-pulse" />
            </div>
            <div className="h-7 w-32 bg-white/20 rounded animate-pulse" />
            <div className="h-3 w-40 bg-white/10 rounded animate-pulse pt-1" />
          </div>
        ))}
      </div>

      {/* Main Chart Card Skeleton */}
      <div className="p-6 rounded-3xl border border-white/15 bg-[#132644] text-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-48 bg-white/15 rounded animate-pulse" />
          <div className="h-8 w-28 bg-white/10 rounded-xl animate-pulse" />
        </div>
        <div className="h-64 w-full rounded-2xl bg-white/5 border border-white/10 flex items-end justify-between p-6 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-full bg-white/10 rounded-t-lg animate-pulse"
              style={{ height: `${30 + (i * 12) % 65}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for Payment Reminders / Financial section
 */
export const AdminPaymentsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="p-5 rounded-2xl border border-white/15 bg-[#132644] space-y-2">
            <div className="h-3 w-28 bg-white/10 rounded animate-pulse" />
            <div className="h-6 w-36 bg-white/20 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="p-6 rounded-3xl border border-white/15 bg-[#132644] space-y-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-14 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
        ))}
      </div>
    </div>
  );
};
