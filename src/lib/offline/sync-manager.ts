/**
 * ROOT – OFFLINE BACKGROUND SYNC MANAGER
 * Automatically synchronizes pending offline questions, advice cards,
 * and upvotes when the device reconnects to mobile network or Wi-Fi.
 */

import { 
  getPendingQueueItems, 
  removeQueueItem, 
  updateQueueItem, 
  markOfflineQuestionSynced, 
  getQueueCount 
} from './db';
import { submitCropQuestionAction, SubmitQuestionPayload, voteAdviceAction } from '@/app/actions/diagnose';
import { upvoteRemedyAction } from '@/app/actions/community';
import { signUpAction } from '@/app/auth/actions';

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: number | null;
  lastError: string | null;
}

let isSyncInProgress = false;
const listeners = new Set<(status: SyncStatus) => void>();

function notifyListeners(status: Partial<SyncStatus>) {
  if (typeof window === 'undefined') return;

  const current: SyncStatus = {
    isOnline: navigator.onLine,
    isSyncing: isSyncInProgress,
    pendingCount: 0,
    lastSyncTime: null,
    lastError: null,
    ...status,
  };

  listeners.forEach((listener) => {
    try {
      listener(current);
    } catch (e) {
      console.warn('[Sync Manager] Listener error:', e);
    }
  });

  window.dispatchEvent(
    new CustomEvent('root:sync-status', { detail: current })
  );
}

export function subscribeToSyncStatus(listener: (status: SyncStatus) => void): () => void {
  listeners.add(listener);

  // Initial trigger
  getQueueCount().then((count) => {
    listener({
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      isSyncing: isSyncInProgress,
      pendingCount: count,
      lastSyncTime: null,
      lastError: null,
    });
  });

  return () => {
    listeners.delete(listener);
  };
}

/**
 * Execute full background sync of all pending mutations
 */
export async function syncAllPendingData(): Promise<{ syncedCount: number; failedCount: number }> {
  if (isSyncInProgress || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    return { syncedCount: 0, failedCount: 0 };
  }

  isSyncInProgress = true;
  notifyListeners({ isSyncing: true });

  let syncedCount = 0;
  let failedCount = 0;

  try {
    const pendingItems = await getPendingQueueItems();

    for (const item of pendingItems) {
      try {
        // Mark syncing
        await updateQueueItem({ ...item, status: 'syncing' });

        if (item.type === 'submit_question') {
          const payload = item.payload as unknown as SubmitQuestionPayload;
          const result = await submitCropQuestionAction(payload);

          if (result.success && result.questionId) {
            await markOfflineQuestionSynced(item.id, result.questionId);
            await removeQueueItem(item.id);
            syncedCount++;
          } else {
            throw new Error(result.error || 'Server rejected offline question');
          }
        } else if (item.type === 'vote_advice') {
          const payload = item.payload as unknown as {
            adviceCardId: string;
            vote: 'helpful' | 'unhelpful';
            userId?: string;
          };
          await voteAdviceAction({
            adviceCardId: payload.adviceCardId,
            vote: payload.vote,
            userId: payload.userId,
          });
          await removeQueueItem(item.id);
          syncedCount++;
        } else if ((item.type as string) === 'upvote_remedy') {
          const payload = item.payload as unknown as { remedyId: string };
          await upvoteRemedyAction(payload.remedyId);
          await removeQueueItem(item.id);
          syncedCount++;
        } else if (item.type === 'register_farmer') {
          const payload = item.payload as {
            fullName: string;
            email: string;
            phone?: string;
            password?: string;
            region?: string;
            agroZone?: string;
            preferredLanguage?: string;
          };
          const formData = new FormData();
          formData.append('fullName', payload.fullName);
          formData.append('email', payload.email);
          if (payload.phone) formData.append('phone', payload.phone);
          if (payload.password) formData.append('password', payload.password);
          formData.append('region', payload.region || 'Oromia');
          formData.append('agroZone', payload.agroZone || 'Weyna Dega');
          formData.append('preferredLanguage', payload.preferredLanguage || 'en');

          const result = await signUpAction(null, formData);
          if (
            result.success || 
            (result.error && (
              result.error.toLowerCase().includes('already registered') || 
              result.error.toLowerCase().includes('already exists')
            ))
          ) {
            await removeQueueItem(item.id);
            syncedCount++;
          } else {
            throw new Error(result.error || 'Server rejected registration sync');
          }
        } else {
          // Unknown item type, discard
          await removeQueueItem(item.id);
        }
      } catch (itemErr: unknown) {
        failedCount++;
        const errorMessage = itemErr instanceof Error ? itemErr.message : 'Sync failed';
        await updateQueueItem({
          ...item,
          status: 'failed',
          attempts: (item.attempts || 0) + 1,
          error: errorMessage,
        });
      }
    }
  } catch (err: unknown) {
    console.warn('[Sync Manager] Global sync execution warning:', err);
  } finally {
    isSyncInProgress = false;
    const remainingCount = await getQueueCount();
    notifyListeners({
      isSyncing: false,
      pendingCount: remainingCount,
      lastSyncTime: Date.now(),
    });
  }

  return { syncedCount, failedCount };
}

/**
 * Register Service Worker Background Sync tag if supported
 */
export async function requestBackgroundSync(): Promise<void> {
  if (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'SyncManager' in window
  ) {
    try {
      const reg = await navigator.serviceWorker.ready;
      // @ts-expect-error SyncManager is not in all standard TS dom definitions
      if (reg.sync) {
        // @ts-expect-error sync is present on supporting browsers
        await reg.sync.register('sync-offline-queue');
      }
    } catch (err) {
      console.warn('[Sync Manager] Native sync registration not available:', err);
    }
  }
}

/**
 * Automatically hook into browser online events
 */
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[Sync Manager] Network restored. Triggering offline queue sync...');
    syncAllPendingData();
  });
}
