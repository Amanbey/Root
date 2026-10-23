'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, CloudUpload } from 'lucide-react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) {
    return null;
  }

  return (
    <aside aria-label="Network status banner" className="sticky top-0 z-40 w-full transition-all duration-300">
      {!isOnline ? (
        <div className="bg-amber-500/90 backdrop-blur-md text-amber-950 px-4 py-1.5 flex items-center justify-between text-xs font-semibold shadow-md">
          <div className="flex items-center gap-2 mx-auto">
            <WifiOff className="w-4 h-4 animate-bounce text-amber-950" />
            <span>Offline Mode Active • መስመር ውጭ (Queries will queue locally)</span>
          </div>
        </div>
      ) : showReconnected ? (
        <div className="bg-emerald-600/90 backdrop-blur-md text-white px-4 py-1.5 flex items-center justify-between text-xs font-semibold shadow-md animate-in fade-in">
          <div className="flex items-center gap-2 mx-auto">
            <Wifi className="w-4 h-4 text-emerald-200" />
            <span>Connection Restored • Synchronizing with community knowledge...</span>
            <CloudUpload className="w-4 h-4 animate-pulse text-emerald-200" />
          </div>
        </div>
      ) : null}
    </aside>
  );
}
