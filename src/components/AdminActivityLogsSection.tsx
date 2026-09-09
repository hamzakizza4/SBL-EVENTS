import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  UserCheck, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  Download, 
  Trash2, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight,
  Database,
  Info,
  Lock,
  Phone,
  FileText,
  Boxes
} from 'lucide-react';
import { ActivityLog, ActivityLogCategory } from '../types';
import { useApp } from '../context/AppContext';

interface AdminActivityLogsSectionProps {
  onNavigateToBooking?: (referenceNumber: string) => void;
  onNavigateToSettings?: () => void;
}

export const AdminActivityLogsSection: React.FC<AdminActivityLogsSectionProps> = ({
  onNavigateToBooking,
  onNavigateToSettings
}) => {
  const { 
    activityLogs, 
    isActivityLogsLoading, 
    refreshActivityLogs, 
    logActivity, 
    deleteActivityLog, 
    clearAllActivityLogs,
    currentAdminUser,
    showToast
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<ActivityLogCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter and sort logs
  const filteredLogs = useMemo(() => {
    let result = [...activityLogs];

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((log) => log.category === categoryFilter);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((log) => {
        const titleMatch = log.title?.toLowerCase().includes(q);
        const descMatch = log.description?.toLowerCase().includes(q);
        const userMatch = log.performedBy?.name?.toLowerCase().includes(q) || log.performedBy?.userId?.toLowerCase().includes(q);
        const actionMatch = log.action?.toLowerCase().includes(q);
        const refMatch = log.metadata?.referenceNumber?.toLowerCase().includes(q);
        const clientMatch = log.metadata?.clientName?.toLowerCase().includes(q);
        return titleMatch || descMatch || userMatch || actionMatch || refMatch || clientMatch;
      });
    }

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      result = result.filter((log) => {
        const logTime = new Date(log.timestamp).getTime();
        if (timeFilter === 'today') {
          return now - logTime <= oneDay;
        } else if (timeFilter === '7days') {
          return now - logTime <= 7 * oneDay;
        } else if (timeFilter === '30days') {
          return now - logTime <= 30 * oneDay;
        }
        return true;
      });
    }

    // Sort order
    result.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [activityLogs, categoryFilter, searchQuery, timeFilter, sortOrder]);

  // Statistics counters
  const stats = useMemo(() => {
    const total = activityLogs.length;
    const bookings = activityLogs.filter((l) => l.category === 'booking_change').length;
    const logins = activityLogs.filter((l) => l.category === 'user_login').length;
    const settings = activityLogs.filter((l) => l.category === 'settings_update').length;
    return { total, bookings, logins, settings };
  }, [activityLogs]);

  // Manual refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshActivityLogs();
    setIsRefreshing(false);
    showToast('Activity Logs Refreshed', 'Latest audit entries synced from Cloud Firestore.', 'info');
  };

  // Export logs to CSV
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      showToast('No Data', 'There are no logs to export with current filters.', 'warning');
      return;
    }

    const headers = ['ID', 'Timestamp', 'Category', 'Action', 'Title', 'Description', 'Actor Name', 'Actor Role', 'Reference Number', 'Client Name'];
    const rows = filteredLogs.map((log) => [
      log.id,
      `"${log.timestamp}"`,
      `"${log.category}"`,
      `"${log.action}"`,
      `"${(log.title || '').replace(/"/g, '""')}"`,
      `"${(log.description || '').replace(/"/g, '""')}"`,
      `"${(log.performedBy?.name || '').replace(/"/g, '""')}"`,
      `"${(log.performedBy?.role || '').replace(/"/g, '""')}"`,
      `"${(log.metadata?.referenceNumber || '').replace(/"/g, '""')}"`,
      `"${(log.metadata?.clientName || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sbl-activity-logs-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Logs Exported', `Exported ${filteredLogs.length} audit log entries as CSV.`, 'success');
  };

  // Export logs to JSON
  const handleExportJSON = () => {
    if (filteredLogs.length === 0) {
      showToast('No Data', 'There are no logs to export with current filters.', 'warning');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sbl-activity-logs-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Logs Exported', `Exported ${filteredLogs.length} audit log entries as JSON.`, 'success');
  };

  // Simulation test handlers (for verifying Firestore live write & read)
  const handleSimulateBookingChange = async () => {
    const randomRef = `SBL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    await logActivity(
      'booking_change',
      'STATUS_UPDATED',
      `Booking Status Confirmed: Ref #${randomRef}`,
      `Status was manually updated to 'confirmed' by ${currentAdminUser?.name || 'Major Admin'}. Rigging crew dispatched.`,
      {
        referenceNumber: randomRef,
        clientName: 'Hon. Grace Nabakooza',
        oldValue: 'pending',
        newValue: 'confirmed',
        venue: 'Munyonyo Commonwealth Resort',
        guestCount: 650
      }
    );
    showToast('Simulated Booking Change Logged', `Recorded status update for #${randomRef} directly in Firestore.`, 'success');
  };

  const handleSimulateUserLogin = async () => {
    await logActivity(
      'user_login',
      'ADMIN_LOGIN',
      `Admin Login: ${currentAdminUser?.name || 'SBL-1000'} (${currentAdminUser?.roleTitle || 'Major Admin'})`,
      `User ${currentAdminUser?.name || 'SBL-1000'} authenticated successfully into SBL Master Portal.`,
      {
        userId: currentAdminUser?.userId || 'sbl 1000',
        role: currentAdminUser?.roleTitle || 'Major Admin',
        ipOrLocation: 'Kampala Depot, Uganda',
        sessionType: 'Web Terminal'
      }
    );
    showToast('Simulated User Login Logged', 'Recorded administrator login event in Firestore.', 'success');
  };

  const handleSimulateSettingsUpdate = async () => {
    const newBufferDays = Math.floor(1 + Math.random() * 3);
    await logActivity(
      'settings_update',
      'BUFFER_DAYS_UPDATED',
      `Buffer Days Adjusted: ${newBufferDays} Days Pre-Rigging`,
      `Operational setup buffer modified to ${newBufferDays} days before event dates by ${currentAdminUser?.name || 'Major Admin'}.`,
      {
        settingKey: 'bufferDaysBefore',
        oldValue: '2 days',
        newValue: `${newBufferDays} days`,
        reason: 'Peak wedding season fleet scheduling optimization'
      }
    );
    showToast('Simulated Settings Update Logged', 'Recorded configuration modification in Firestore.', 'success');
  };

  // Helper for human-readable relative time
  const formatTimeAgo = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return timestamp;
    }
  };

  // Category visual badge styling
  const getCategoryBadge = (category: ActivityLogCategory) => {
    switch (category) {
      case 'booking_change':
        return {
          icon: <Calendar className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'Booking Change',
          color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400'
        };
      case 'user_login':
        return {
          icon: <UserCheck className="w-3.5 h-3.5 text-sky-400" />,
          label: 'User Login',
          color: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
          dot: 'bg-sky-400'
        };
      case 'settings_update':
        return {
          icon: <Sliders className="w-3.5 h-3.5 text-amber-400" />,
          label: 'Settings Update',
          color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400'
        };
      default:
        return {
          icon: <Info className="w-3.5 h-3.5 text-slate-400" />,
          label: 'General Activity',
          color: 'bg-white/10 text-slate-300 border-white/20',
          dot: 'bg-slate-400'
        };
    }
  };

  return (
    <div id="admin-activity-logs-section" className="space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#0D1E36] border border-white/15 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5 tracking-tight">
              <History className="w-6 h-6 text-emerald-400" />
              <span>Activity Logs & Audit Trail</span>
            </h2>
            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Database className="w-3 h-3" />
              <span>Cloud Firestore Live Sync</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Immutable live audit trail capturing client and admin booking changes, staff credentials & logins, 
            and global settings updates synced across all connected devices in real time.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            title="Refresh logs from Firestore"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : 'text-slate-300'}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleExportCSV}
              className="p-2.5 px-3 rounded-xl bg-[#142A4A] hover:bg-[#1A365D] text-slate-200 hover:text-white border border-white/15 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Download CSV report"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>CSV</span>
            </button>
            <button
              type="button"
              onClick={handleExportJSON}
              className="p-2.5 px-3 rounded-xl bg-[#142A4A] hover:bg-[#1A365D] text-slate-200 hover:text-white border border-white/15 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Download JSON audit file"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>JSON</span>
            </button>
          </div>

          {/* Major Admin Clear All Confirmation */}
          {currentAdminUser?.isMajorAdmin && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="p-2.5 px-3.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ml-auto lg:ml-0"
              title="Purge audit logs"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Purge Logs</span>
            </button>
          )}
        </div>
      </div>

      {/* QUICK SIMULATION / TEST PANEL (For quick demonstration and testing of Firestore) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/30 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-blue-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Interactive Audit Generator:</strong> Trigger a test event to see instantaneous Cloud Firestore write & read in action.
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <button
            type="button"
            onClick={handleSimulateBookingChange}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-colors cursor-pointer"
          >
            + Booking Change
          </button>
          <button
            type="button"
            onClick={handleSimulateUserLogin}
            className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-[11px] font-bold transition-colors cursor-pointer"
          >
            + User Login
          </button>
          <button
            type="button"
            onClick={handleSimulateSettingsUpdate}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-colors cursor-pointer"
          >
            + Settings Revision
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div 
          onClick={() => setCategoryFilter('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            categoryFilter === 'all' 
              ? 'bg-[#152B4D] border-white/40 shadow-lg ring-1 ring-white/20' 
              : 'bg-[#0F2039] border-white/10 hover:border-white/20 hover:bg-[#132745]'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Total Audit Logs</span>
            <History className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.total}</span>
            <span className="text-[11px] text-slate-400">Events tracked</span>
          </div>
        </div>

        <div 
          onClick={() => setCategoryFilter('booking_change')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            categoryFilter === 'booking_change' 
              ? 'bg-emerald-950/40 border-emerald-400 shadow-lg ring-1 ring-emerald-400/30' 
              : 'bg-[#0F2039] border-white/10 hover:border-emerald-500/30 hover:bg-[#132745]'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Booking Changes</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">{stats.bookings}</span>
            <span className="text-[11px] text-emerald-400/80">Revisions & payments</span>
          </div>
        </div>

        <div 
          onClick={() => setCategoryFilter('user_login')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            categoryFilter === 'user_login' 
              ? 'bg-sky-950/40 border-sky-400 shadow-lg ring-1 ring-sky-400/30' 
              : 'bg-[#0F2039] border-white/10 hover:border-sky-500/30 hover:bg-[#132745]'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider">User Logins</span>
            <UserCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-sky-300 font-mono">{stats.logins}</span>
            <span className="text-[11px] text-sky-400/80">Auth sessions</span>
          </div>
        </div>

        <div 
          onClick={() => setCategoryFilter('settings_update')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            categoryFilter === 'settings_update' 
              ? 'bg-amber-950/40 border-amber-400 shadow-lg ring-1 ring-amber-400/30' 
              : 'bg-[#0F2039] border-white/10 hover:border-amber-500/30 hover:bg-[#132745]'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Settings Revisions</span>
            <Sliders className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">{stats.settings}</span>
            <span className="text-[11px] text-amber-400/80">Buffers & config</span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1E36] border border-white/15 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Categories', count: stats.total },
              { id: 'booking_change', label: 'Booking Changes', count: stats.bookings },
              { id: 'user_login', label: 'User Logins', count: stats.logins },
              { id: 'settings_update', label: 'Settings Updates', count: stats.settings },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
                  categoryFilter === cat.id
                    ? 'bg-white text-slate-950 border-white shadow-sm'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  categoryFilter === cat.id ? 'bg-slate-950/10 text-slate-950 font-black' : 'bg-white/10 text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Time Filter & Sort Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-[#142A4A] border border-white/20 text-xs text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today Only</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>

            <button
              type="button"
              onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
              className="px-3 py-1.5 rounded-xl bg-[#142A4A] border border-white/20 text-xs text-slate-200 font-bold hover:text-white hover:bg-[#1A365D] transition-colors flex items-center gap-1 cursor-pointer"
              title={`Sort ${sortOrder === 'desc' ? 'Oldest First' : 'Newest First'}`}
            >
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, booking reference #, admin user ID, action keyword, or venue..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#091526] border border-white/20 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ACTIVITY LOGS LIST */}
      <div className="space-y-3">
        {isActivityLogsLoading ? (
          <div className="p-8 text-center space-y-4 rounded-2xl bg-[#0D1E36] border border-white/10">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-300 font-medium">Streaming latest activity logs from Cloud Firestore...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#0D1E36] border border-white/15 space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No activity logs found</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              {searchQuery || categoryFilter !== 'all' || timeFilter !== 'all'
                ? 'Try adjusting or clearing your search keywords and category filters.'
                : 'No audit records have been generated yet. Actions in the portal will automatically record here.'}
            </p>
            {(searchQuery || categoryFilter !== 'all' || timeFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setTimeFilter('all');
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredLogs.map((log) => {
              const badge = getCategoryBadge(log.category);
              const isExpanded = expandedLogId === log.id;
              const hasMetadata = log.metadata && Object.keys(log.metadata).length > 0;

              return (
                <div
                  key={log.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isExpanded 
                      ? 'bg-[#12243F] border-white/30 shadow-lg' 
                      : 'bg-[#0D1E36] border-white/10 hover:border-white/20 hover:bg-[#10223B]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    {/* Main Title & Category Badge */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Category Chip */}
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${badge.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>

                        {/* Action Code */}
                        <span className="px-2 py-0.5 rounded bg-black/30 border border-white/10 text-slate-300 font-mono text-[11px]">
                          {log.action}
                        </span>

                        {/* Actor Badge */}
                        <span className="text-[11px] text-slate-300 flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          <UserCheck className="w-3 h-3 text-sky-400" />
                          <strong className="text-white">{log.performedBy?.name || 'System'}</strong>
                          {log.performedBy?.role && (
                            <span className="text-slate-400 text-[10px]">({log.performedBy.role})</span>
                          )}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {log.title}
                      </h4>

                      {/* Description */}
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {log.description}
                      </p>
                    </div>

                    {/* Timestamp & Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-200 block font-mono">
                          {formatTimeAgo(log.timestamp)}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Expand / View Details Button */}
                      {hasMetadata && (
                        <button
                          type="button"
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title={isExpanded ? 'Collapse details' : 'Inspect event details & payload'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      )}

                      {/* Delete Log Option (Major Admin only) */}
                      {currentAdminUser?.isMajorAdmin && (
                        <button
                          type="button"
                          onClick={() => deleteActivityLog(log.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete this log record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* EXPANDED METADATA / PAYLOAD VIEW */}
                  <AnimatePresence>
                    {isExpanded && hasMetadata && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 pt-3.5 border-t border-white/10 space-y-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                          {log.metadata?.referenceNumber && (
                            <div className="p-2.5 rounded-xl bg-black/25 border border-white/10">
                              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Booking Reference</span>
                              <div className="flex items-center justify-between gap-1 mt-0.5">
                                <span className="font-mono font-bold text-amber-300">
                                  #{log.metadata.referenceNumber}
                                </span>
                                {onNavigateToBooking && (
                                  <button
                                    type="button"
                                    onClick={() => onNavigateToBooking(log.metadata?.referenceNumber!)}
                                    className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-0.5 underline cursor-pointer"
                                  >
                                    <span>Jump to Booking</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {log.metadata?.clientName && (
                            <div className="p-2.5 rounded-xl bg-black/25 border border-white/10">
                              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Client Name</span>
                              <span className="font-bold text-white mt-0.5 block">
                                {log.metadata.clientName}
                              </span>
                            </div>
                          )}

                          {log.metadata?.oldValue !== undefined && log.metadata?.newValue !== undefined && (
                            <div className="p-2.5 rounded-xl bg-black/25 border border-white/10">
                              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Status Revision</span>
                              <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[11px]">
                                <span className="text-red-400 line-through">{String(log.metadata.oldValue)}</span>
                                <span className="text-slate-400">→</span>
                                <span className="text-emerald-400 font-bold">{String(log.metadata.newValue)}</span>
                              </div>
                            </div>
                          )}

                          {log.metadata?.ipOrLocation && (
                            <div className="p-2.5 rounded-xl bg-black/25 border border-white/10">
                              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Terminal / Location</span>
                              <span className="text-slate-200 mt-0.5 block font-medium">
                                {log.metadata.ipOrLocation}
                              </span>
                            </div>
                          )}

                          {log.metadata?.venue && (
                            <div className="p-2.5 rounded-xl bg-black/25 border border-white/10">
                              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Venue Location</span>
                              <span className="text-slate-200 mt-0.5 block font-medium truncate">
                                {log.metadata.venue}
                              </span>
                            </div>
                          )}

                          {log.metadata?.settingKey && (
                            <div className="p-2.5 rounded-xl bg-black/25 border border-white/10">
                              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Modified Parameter</span>
                              <span className="text-amber-300 font-mono mt-0.5 block">
                                {log.metadata.settingKey}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Raw Audit Metadata JSON toggle */}
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-slate-300 overflow-x-auto">
                          <span className="text-[10px] text-slate-500 uppercase block mb-1 font-sans font-semibold">Raw Audit Payload</span>
                          <pre>{JSON.stringify(log.metadata, null, 2)}</pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CLEAR AUDIT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl bg-[#0F2038] border border-red-500/40 text-white shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Purge Audit Log Trail?</h3>
                  <p className="text-xs text-slate-300">This action cannot be undone.</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                You are about to delete all <strong className="text-white">{activityLogs.length} activity audit log records</strong> from Cloud Firestore. 
                This will clear the history for all administrators.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await clearAllActivityLogs();
                    setShowClearConfirm(false);
                    showToast('Logs Purged', 'All activity audit logs deleted from Firestore.', 'info');
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-red-600/30"
                >
                  Confirm & Purge All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
