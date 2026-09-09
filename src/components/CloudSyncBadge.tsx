import React from 'react';
import { useAdminContentSync } from '../context/AdminContentSyncContext';
import { Cloud, CloudCheck, CloudOff, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface CloudSyncBadgeProps {
  compact?: boolean;
  className?: string;
  showRefreshButton?: boolean;
}

export const CloudSyncBadge: React.FC<CloudSyncBadgeProps> = ({
  compact = false,
  className = '',
  showRefreshButton = true,
}) => {
  const {
    syncStatus,
    isSyncing,
    lastSyncedAt,
    syncError,
    isCloudConnected,
    pendingSyncCount,
    forceRefreshFromCloud,
  } = useAdminContentSync();

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Connected';
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (compact) {
    return (
      <div
        id="cloud-sync-badge-compact"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition-all ${
          syncStatus === 'syncing'
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            : syncStatus === 'error'
            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
            : syncStatus === 'offline'
            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
        } ${className}`}
        title={syncError || `Cloud Firestore status: ${syncStatus}. All edits persist globally.`}
      >
        {syncStatus === 'syncing' ? (
          <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
        ) : syncStatus === 'offline' ? (
          <CloudOff className="w-3 h-3 text-orange-400" />
        ) : syncStatus === 'error' ? (
          <AlertTriangle className="w-3 h-3 text-red-400" />
        ) : (
          <CloudCheck className="w-3 h-3 text-emerald-400" />
        )}
        <span>
          {syncStatus === 'syncing'
            ? 'Syncing...'
            : syncStatus === 'offline'
            ? pendingSyncCount > 0 ? `Queued (${pendingSyncCount})` : 'Offline'
            : syncStatus === 'error'
            ? 'Sync Notice'
            : 'Live Synced'}
        </span>
      </div>
    );
  }

  return (
    <div
      id="cloud-sync-badge-full"
      className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border backdrop-blur-md transition-all ${
        syncStatus === 'syncing'
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
          : syncStatus === 'error'
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
          : syncStatus === 'offline'
          ? 'bg-amber-600/15 border-amber-600/30 text-amber-300'
          : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {syncStatus === 'syncing' ? (
          <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
        ) : syncStatus === 'offline' ? (
          <CloudOff className="w-4 h-4 text-amber-400" />
        ) : syncStatus === 'error' ? (
          <AlertTriangle className="w-4 h-4 text-rose-400" />
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute opacity-75" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 relative" />
          </>
        )}
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            {syncStatus === 'syncing'
              ? 'Saving to Cloud Firestore'
              : syncStatus === 'offline'
              ? 'Local Mode (Auto-Syncs Online)'
              : syncStatus === 'error'
              ? 'Sync Attention'
              : 'Cloud Firestore Live'}
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 font-mono text-white/80">
            Realtime
          </span>
        </div>
        <p className="text-[11px] text-white/70">
          {syncStatus === 'syncing'
            ? 'Propagating edits to all visitors...'
            : syncStatus === 'offline'
            ? pendingSyncCount > 0 ? `${pendingSyncCount} edits queued for cloud push` : 'Edits safely saved locally'
            : `All services & gallery edits synced (${formatLastSync(lastSyncedAt)})`}
        </p>
      </div>

      {showRefreshButton && (
        <button
          id="btn-cloud-sync-refresh"
          type="button"
          onClick={() => forceRefreshFromCloud()}
          disabled={isSyncing}
          className="ml-1 p-1.5 rounded-lg hover:bg-white/15 active:scale-95 text-white/80 hover:text-white transition-all disabled:opacity-50"
          title="Force refresh data from Firestore database"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
};

export default CloudSyncBadge;
