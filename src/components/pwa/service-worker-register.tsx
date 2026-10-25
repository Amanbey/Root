'use client';

import { useEffect } from 'react';
import { syncAllPendingData } from '@/lib/offline/sync-manager';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
          });

          // Check for worker updates
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (
                  installingWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  console.log('[Root PWA] New advisory engine version available.');
                }
              });
            }
          });

          // Listen for background sync triggers from Service Worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data?.type === 'TRIGGER_BACKGROUND_SYNC') {
              console.log('[Root PWA] Background sync triggered by Service Worker');
              syncAllPendingData();
            }
          });

          // Initial check if back online
          if (navigator.onLine) {
            syncAllPendingData();
          }

          console.log('[Root PWA] Service Worker registered with scope:', registration.scope);
        } catch (error) {
          console.warn('[Root PWA] Service Worker registration failed:', error);
        }
      };

      if (document.readyState === 'complete') {
        registerSW();
      } else {
        window.addEventListener('load', registerSW);
        return () => window.removeEventListener('load', registerSW);
      }
    }
  }, []);

  return null;
}
