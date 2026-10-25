'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, CheckCircle2, RefreshCw } from 'lucide-react';
import { subscribeToSyncStatus, syncAllPendingData, SyncStatus } from '@/lib/offline/sync-manager';

export function OfflineIndicator() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    isSyncing: false,
    pendingCount: 0,
    lastSyncTime: null,
    lastError: null,
  });
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const unsubscribe = subscribeToSyncStatus((status) => {
      setSyncStatus(status);
    });

    const handleOnline = () => {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 5000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const { isOnline, isSyncing, pendingCount } = syncStatus;

  // Don't show anything if online and no pending items and not showing reconnected
  if (isOnline && !isSyncing && pendingCount === 0 && !showReconnected) {
    return null;
  }

  return (
    <aside aria-label="Network and offline synchronization banner" className="sticky top-0 z-50 w-full transition-all duration-300">
      {!isOnline ? (
        <div className="bg-amber-500 text-slate-950 px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs font-semibold shadow-md">
          <div className="flex items-center gap-2 mx-auto">
            <WifiOff className="w-3.5 h-3.5 text-slate-950 shrink-0" />
            <span>
              Offline Mode Active • መስመር ውጭ{' '}
              {pendingCount > 0 ? (
                <strong className="underline underline-offset-2">({pendingCount} query waiting to sync)</strong>
              ) : (
                '(Instant advice available offline)'
              )}
            </span>
          </div>
        </div>
      ) : isSyncing ? (
        <div className="bg-teal-600 text-white px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs font-semibold shadow-md animate-in fade-in">
          <div className="flex items-center gap-2 mx-auto">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-white shrink-0" />
            <span>
              Synchronizing {pendingCount} offline {pendingCount === 1 ? 'diagnosis' : 'diagnoses'} to cloud database...
            </span>
          </div>
        </div>
      ) : showReconnected || pendingCount > 0 ? (
        <div className="bg-emerald-600 text-white px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs font-semibold shadow-md animate-in fade-in">
          <div className="flex items-center gap-2 mx-auto">
            {pendingCount === 0 ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                <span>Connected • All local diagnoses synchronized!</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                <span>Connected • {pendingCount} items queued</span>
                <button
                  type="button"
                  onClick={() => syncAllPendingData()}
                  className="ml-2 px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-800 text-[11px] font-bold underline"
                >
                  Sync Now
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
