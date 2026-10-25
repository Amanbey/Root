'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, CheckCircle2, RefreshCw } from 'lucide-react';
import { subscribeToSyncStatus, syncAllPendingData, SyncStatus } from '@/lib/offline/sync-manager';
import { useLanguage } from '@/lib/i18n/language-context';

export function OfflineIndicator() {
  const { t, language } = useLanguage();
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

  const offlineNotice = t('status_offline_banner');

  const syncingNotice = language === 'am'
    ? `ከደመናው ጋር በማመሳሰል ላይ (${pendingCount} ምርመራ)...`
    : language === 'om'
    ? `Waliin hidhamaa jira (${pendingCount})...`
    : `Synchronizing ${pendingCount} offline ${pendingCount === 1 ? 'diagnosis' : 'diagnoses'} to cloud...`;

  const syncNowText = t('status_sync_now');

  return (
    <aside aria-label="Network and offline synchronization banner" className="sticky top-0 z-50 w-full transition-all duration-300">
      {!isOnline ? (
        <div className="bg-amber-500 text-slate-950 px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs font-semibold shadow-md">
          <div className="flex items-center gap-2 mx-auto">
            <WifiOff className="w-3.5 h-3.5 text-slate-950 shrink-0" />
            <span>
              {offlineNotice}{' '}
              {pendingCount > 0 ? (
                <strong className="underline underline-offset-2">({pendingCount} {t('offline_banner_queued')})</strong>
              ) : null}
            </span>
          </div>
        </div>
      ) : isSyncing ? (
        <div className="bg-teal-600 text-white px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs font-semibold shadow-md animate-in fade-in">
          <div className="flex items-center gap-2 mx-auto">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-white shrink-0" />
            <span>{syncingNotice}</span>
          </div>
        </div>
      ) : showReconnected || pendingCount > 0 ? (
        <div className="bg-emerald-600 text-white px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs font-semibold shadow-md animate-in fade-in">
          <div className="flex items-center gap-2 mx-auto">
            {pendingCount === 0 ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                <span>
                  {t('status_synced_success')}
                </span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                <span>
                  {t('offline_banner_connected_queued')}: {pendingCount}
                </span>
                <button
                  type="button"
                  onClick={() => syncAllPendingData()}
                  className="ml-2 px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-800 text-[11px] font-bold underline"
                >
                  {syncNowText}
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
