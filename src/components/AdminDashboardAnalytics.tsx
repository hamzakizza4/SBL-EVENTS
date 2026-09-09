import React, { useState, useMemo } from 'react';
import { Booking, InventoryItem } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Boxes, 
  CheckCircle2, 
  Clock, 
  Star, 
  Sparkles, 
  Layers, 
  Calendar, 
  Truck, 
  Tent, 
  Zap, 
  Tv, 
  Volume2, 
  Bath, 
  ShieldCheck, 
  ThumbsUp, 
  MessageSquare,
  Activity,
  UserCheck,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AdminDashboardAnalyticsProps {
  bookings: Booking[];
  inventory: InventoryItem[];
  onNavigateToTab?: (tab: string) => void;
}

const CATEGORY_COLORS = ['#38bdf8', '#fbbf24', '#34d399', '#f472b6', '#a78bfa', '#fb923c', '#818cf8'];

export const AdminDashboardAnalytics: React.FC<AdminDashboardAnalyticsProps> = ({
  bookings,
  inventory,
  onNavigateToTab
}) => {
  const { testimonials, approveTestimonial, deleteTestimonial } = useApp();
  const [inventoryViewMode, setInventoryViewMode] = useState<'chart' | 'list'>('chart');

  // Total Fleet Inventory Metrics
  const totalFleetUnits = useMemo(() => {
    return inventory.reduce((sum, item) => sum + (item.totalQuantity || 0), 0);
  }, [inventory]);

  const availableFleetUnits = useMemo(() => {
    return inventory.reduce((sum, item) => sum + (item.availableQuantity || 0), 0);
  }, [inventory]);

  const deployedFleetUnits = Math.max(0, totalFleetUnits - availableFleetUnits);
  const utilizationPercentage = totalFleetUnits > 0 ? Math.round((deployedFleetUnits / totalFleetUnits) * 100) : 0;

  // Inventory Category Breakdown (Grouped by unified category label for unique keys & chart display)
  const inventoryCategoryData = useMemo(() => {
    const categoryMap: Record<string, { name: string; total: number; available: number; deployed: number; itemsCount: number }> = {};

    inventory.forEach((item) => {
      const rawCat = (item.category || '').toLowerCase().trim();
      let catLabel = 'Accessories & Misc';

      if (rawCat.includes('tent')) {
        catLabel = 'Mega Tents';
      } else if (rawCat.includes('screen') || rawCat.includes('video') || rawCat.includes('led')) {
        catLabel = 'LED Screens';
      } else if (rawCat.includes('sound') || rawCat.includes('audio') || rawCat.includes('disco')) {
        catLabel = 'Audio & Sound';
      } else if (rawCat.includes('light')) {
        catLabel = 'Lighting & FX';
      } else if (rawCat.includes('stag') || rawCat.includes('truss') || rawCat.includes('rigging')) {
        catLabel = 'Staging & Truss';
      } else if (rawCat.includes('restroom') || rawCat.includes('sanitation')) {
        catLabel = 'VIP Restrooms';
      } else if (rawCat.includes('power') || rawCat.includes('gen') || rawCat.includes('logistic')) {
        catLabel = 'Power & Logistics';
      } else if (rawCat.includes('decor') || rawCat.includes('seat') || rawCat.includes('chair') || rawCat.includes('table')) {
        catLabel = 'Decor & Seating';
      } else if (item.category && item.category.trim().length > 0) {
        catLabel = item.category.trim();
      }

      // Group directly by catLabel to guarantee strict uniqueness and accurate aggregation
      if (!categoryMap[catLabel]) {
        categoryMap[catLabel] = {
          name: catLabel,
          total: 0,
          available: 0,
          deployed: 0,
          itemsCount: 0,
        };
      }

      categoryMap[catLabel].total += item.totalQuantity || 0;
      categoryMap[catLabel].available += item.availableQuantity || 0;
      categoryMap[catLabel].deployed += Math.max(0, (item.totalQuantity || 0) - (item.availableQuantity || 0));
      categoryMap[catLabel].itemsCount += 1;
    });

    return Object.values(categoryMap);
  }, [inventory]);

  // Reviews Metrics
  const averageRating = useMemo(() => {
    if (testimonials.length === 0) return 5.0;
    const total = testimonials.reduce((sum, t) => sum + t.rating, 0);
    return Number((total / testimonials.length).toFixed(1));
  }, [testimonials]);

  const pendingReviews = useMemo(() => {
    return testimonials.filter((t) => !t.approved);
  }, [testimonials]);

  const verifiedReviewsCount = useMemo(() => {
    return testimonials.filter((t) => t.verified).length;
  }, [testimonials]);

  // Rating Distribution
  const ratingDistribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    testimonials.forEach((t) => {
      const r = Math.min(5, Math.max(1, Math.round(t.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[r] = (counts[r] || 0) + 1;
    });
    return [
      { stars: '5 Stars', count: counts[5], color: '#10b981' },
      { stars: '4 Stars', count: counts[4], color: '#3b82f6' },
      { stars: '3 Stars', count: counts[3], color: '#f59e0b' },
      { stars: '2 Stars', count: counts[2], color: '#f97316' },
      { stars: '1 Star', count: counts[1], color: '#ef4444' },
    ];
  }, [testimonials]);

  // Active Events Operations Breakdown
  const eventsByType = useMemo(() => {
    const map: Record<string, number> = {};
    bookings.filter(b => b.status !== 'cancelled').forEach((b) => {
      const type = b.eventType || 'other';
      map[type] = (map[type] || 0) + 1;
    });
    return Object.entries(map).map(([type, count]) => ({
      name: type.replace('_', ' ').toUpperCase(),
      count,
    }));
  }, [bookings]);

  return (
    <div className="space-y-8">
      {/* Top Fleet & Operational Metrics Grid (No Money Earned) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Fleet Inventory */}
        <div className="p-5 rounded-3xl border border-white/15 bg-[#132644] text-white shadow-lg space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-bold uppercase tracking-wider">Fleet Inventory Stock</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {totalFleetUnits}
            </span>
            <span className="text-xs text-blue-300 font-semibold">Total Units</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/10">
            <span className="text-emerald-300 font-semibold">{availableFleetUnits} Available</span>
            <span className="text-amber-300 font-semibold">{deployedFleetUnits} In Field</span>
          </div>
        </div>

        {/* Metric 2: Fleet Utilization */}
        <div className="p-5 rounded-3xl border border-white/15 bg-[#132644] text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-bold uppercase tracking-wider">Fleet Dispatch Rate</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-300 font-mono tracking-tight">
              {utilizationPercentage}%
            </span>
            <span className="text-xs text-slate-300">Active Deployment</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1">
            <div
              className="bg-amber-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${utilizationPercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Live User Reviews */}
        <div className="p-5 rounded-3xl border border-white/15 bg-[#132644] text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-bold uppercase tracking-wider">Customer Satisfaction</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight flex items-center gap-1">
              {averageRating} <span className="text-xl">★</span>
            </span>
            <span className="text-xs text-slate-300">({testimonials.length} Reviews)</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/10">
            <span className="text-emerald-300 font-medium">{verifiedReviewsCount} Verified</span>
            {pendingReviews.length > 0 ? (
              <span className="text-amber-300 font-bold">{pendingReviews.length} Pending Approval</span>
            ) : (
              <span className="text-slate-400">All Approved</span>
            )}
          </div>
        </div>

        {/* Metric 4: Active Event Operations */}
        <div className="p-5 rounded-3xl border border-white/15 bg-[#132644] text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-bold uppercase tracking-wider">Scheduled Events</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {bookings.filter(b => b.status === 'confirmed').length}
            </span>
            <span className="text-xs text-purple-300 font-semibold">Confirmed Events</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/10">
            <span className="text-amber-300 font-semibold">{bookings.filter(b => b.status === 'pending').length} Inquiries</span>
            <span className="text-blue-300 font-semibold">{bookings.filter(b => b.status === 'completed').length} Completed</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Inventory Breakdown & Live User Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: FLEET INVENTORY STOCK & CATEGORY AVAILABILITY (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl border border-white/15 bg-[#132644] text-white space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <span>Fleet Inventory Breakdown</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      {inventory.length} Stock Types
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Real-time available stock vs active field deployment across Masaka & Kampala depots
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInventoryViewMode(inventoryViewMode === 'chart' ? 'list' : 'chart')}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                >
                  {inventoryViewMode === 'chart' ? 'View List' : 'View Chart'}
                </button>
                {onNavigateToTab && (
                  <button
                    onClick={() => onNavigateToTab('inventory')}
                    className="text-xs font-bold text-blue-300 hover:text-white flex items-center gap-1"
                  >
                    <span>Manage Fleet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Inventory Chart / Visual Breakdown */}
            {inventoryViewMode === 'chart' ? (
              <div className="space-y-4">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={inventoryCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#94a3b8" 
                        fontSize={11} 
                        tickLine={false}
                        angle={-15}
                        textAnchor="end"
                      />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0E1D35', 
                          borderColor: '#ffffff30', 
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '12px'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Bar dataKey="available" name="Available in Depot" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="deployed" name="Deployed on Site" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Quick inventory summary chips */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {inventoryCategoryData.map((cat, idx) => (
                    <div key={`${cat.name}-${idx}`} className="p-3 rounded-2xl bg-[#0E1D35] border border-white/10 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white truncate">{cat.name}</span>
                        <span className="font-mono text-blue-300 font-bold">{cat.available}/{cat.total}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-400 h-1.5 rounded-full"
                          style={{ width: `${(cat.available / (cat.total || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#0E1D35] border border-white/10 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-white block">{item.name}</span>
                      <span className="text-[11px] text-slate-300 capitalize">{item.category} • Depot: Masaka / Kampala</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-mono font-extrabold text-blue-300 text-sm">
                          {item.availableQuantity}
                        </span>
                        <span className="text-[10px] text-slate-400 block">of {item.totalQuantity} Units</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        item.availableQuantity > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {item.availableQuantity > 0 ? 'Ready' : 'Out'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE REVIEWS FEED FROM USERS (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl border border-white/15 bg-[#132644] text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Live Client Reviews
                  </h3>
                  <p className="text-xs text-slate-300">
                    Real-time customer feedback & testimonials
                  </p>
                </div>
              </div>

              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('testimonials')}
                  className="text-xs font-bold text-emerald-300 hover:text-white flex items-center gap-1"
                >
                  <span>All ({testimonials.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Rating Stars Summary Box */}
            <div className="p-4 rounded-2xl bg-[#0E1D35] border border-white/10 flex items-center justify-between gap-4">
              <div>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {averageRating}
                </div>
                <div className="flex items-center gap-1 text-amber-300 mt-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= Math.round(averageRating) ? 'fill-amber-300 text-amber-300' : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Based on {testimonials.length} reviews
                </span>
              </div>

              <div className="space-y-1 text-[10px] text-slate-300 flex-1 max-w-[160px]">
                {ratingDistribution.slice(0, 3).map((r) => (
                  <div key={r.stars} className="flex items-center gap-2">
                    <span className="w-12 text-slate-400">{r.stars}</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          backgroundColor: r.color,
                          width: `${testimonials.length > 0 ? (r.count / testimonials.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="font-mono text-white">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Reviews Feed List */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {testimonials.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No client reviews submitted yet.
                </div>
              ) : (
                testimonials.slice(0, 5).map((review) => (
                  <div
                    key={review.id}
                    className="p-3.5 rounded-2xl bg-[#0E1D35] border border-white/10 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-white block">{review.author}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                          <span className="capitalize">{review.eventType}</span>
                          {review.companyOrEvent && (
                            <>
                              <span>•</span>
                              <span className="text-slate-400">{review.companyOrEvent}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{review.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-300">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-300 text-amber-300" />
                        ))}
                      </div>
                    </div>

                    <p className="text-slate-200 text-xs italic leading-relaxed line-clamp-2">
                      "{review.content}"
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                      <span className="text-slate-400">
                        Status: <strong className={review.approved ? 'text-emerald-300' : 'text-amber-300'}>
                          {review.approved ? 'Live Approved' : 'Pending Review'}
                        </strong>
                      </span>

                      {!review.approved && (
                        <button
                          onClick={() => approveTestimonial(review.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-bold transition-colors"
                        >
                          Approve Review
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
