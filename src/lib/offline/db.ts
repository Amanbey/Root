/**
 * ROOT – OFFLINE STORAGE ENGINE (IndexedDB via idb)
 * Provides local persistent storage for queued questions, offline advice cards,
 * and pending farmer votes when disconnected in the field.
 */

import { openDB, IDBPDatabase } from 'idb';
import { AdviceCard, OfflineQueueItem, QuestionSubmission } from '@/lib/types';

const DB_NAME = 'root_offline_agronomy_db';
const DB_VERSION = 1;

export interface OfflineStoredQuestion extends QuestionSubmission {
  adviceCard?: AdviceCard;
  syncedOnline: boolean;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getOfflineDB(): Promise<IDBPDatabase> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is only accessible in browser runtime'));
  }

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // 1. Sync Queue Store for pending mutations
        if (!db.objectStoreNames.contains('queue')) {
          const queueStore = db.createObjectStore('queue', { keyPath: 'id' });
          queueStore.createIndex('by_status', 'status');
          queueStore.createIndex('by_type', 'type');
          queueStore.createIndex('by_createdAt', 'createdAt');
        }

        // 2. Advice Cards Cache Store
        if (!db.objectStoreNames.contains('advice_cards')) {
          const cardsStore = db.createObjectStore('advice_cards', { keyPath: 'id' });
          cardsStore.createIndex('by_question_id', 'question_id');
          cardsStore.createIndex('by_crop', 'primary_crop');
        }

        // 3. Offline Questions Store
        if (!db.objectStoreNames.contains('offline_questions')) {
          const questionsStore = db.createObjectStore('offline_questions', { keyPath: 'id' });
          questionsStore.createIndex('by_synced', 'syncedOnline');
          questionsStore.createIndex('by_created_at', 'created_at');
        }
      },
    });
  }

  return dbPromise;
}

/**
 * 1. QUEUE MANAGEMENT
 */
export async function enqueueOfflineItem(item: OfflineQueueItem): Promise<void> {
  const db = await getOfflineDB();
  await db.put('queue', item);
}

export async function getPendingQueueItems(): Promise<OfflineQueueItem[]> {
  const db = await getOfflineDB();
  const tx = db.transaction('queue', 'readonly');
  const index = tx.store.index('by_status');
  return index.getAll('pending');
}

export async function getAllQueueItems(): Promise<OfflineQueueItem[]> {
  const db = await getOfflineDB();
  return db.getAll('queue');
}

export async function updateQueueItem(item: OfflineQueueItem): Promise<void> {
  const db = await getOfflineDB();
  await db.put('queue', item);
}

export async function removeQueueItem(id: string): Promise<void> {
  const db = await getOfflineDB();
  await db.delete('queue', id);
}

export async function getQueueCount(): Promise<number> {
  try {
    const db = await getOfflineDB();
    const index = db.transaction('queue').store.index('by_status');
    return await index.count('pending');
  } catch {
    return 0;
  }
}

/**
 * 2. ADVICE CARDS CACHE MANAGEMENT
 */
export async function cacheAdviceCardLocally(card: AdviceCard): Promise<void> {
  try {
    const db = await getOfflineDB();
    await db.put('advice_cards', {
      ...card,
      cachedAt: Date.now(),
    });
  } catch (err) {
    console.warn('[Offline DB] Failed to cache advice card:', err);
  }
}

export async function getCachedAdviceCardLocally(questionId: string): Promise<AdviceCard | null> {
  try {
    const db = await getOfflineDB();
    const index = db.transaction('advice_cards').store.index('by_question_id');
    const card = await index.get(questionId);
    return card || null;
  } catch {
    return null;
  }
}

export async function getAllCachedAdviceCardsLocally(): Promise<AdviceCard[]> {
  try {
    const db = await getOfflineDB();
    return await db.getAll('advice_cards');
  } catch {
    return [];
  }
}

/**
 * 3. OFFLINE QUESTIONS MANAGEMENT
 */
export async function saveOfflineQuestion(
  question: QuestionSubmission,
  adviceCard?: AdviceCard
): Promise<void> {
  try {
    const db = await getOfflineDB();
    await db.put('offline_questions', {
      ...question,
      adviceCard,
      syncedOnline: false,
    });
  } catch (err) {
    console.warn('[Offline DB] Failed to save offline question:', err);
  }
}

export async function markOfflineQuestionSynced(
  tempId: string,
  cloudId: string
): Promise<void> {
  try {
    const db = await getOfflineDB();
    const existing = await db.get('offline_questions', tempId);
    if (existing) {
      await db.delete('offline_questions', tempId);
      await db.put('offline_questions', {
        ...existing,
        id: cloudId,
        syncedOnline: true,
      });
    }
  } catch (err) {
    console.warn('[Offline DB] Failed to mark offline question synced:', err);
  }
}

export async function getOfflineQuestions(): Promise<OfflineStoredQuestion[]> {
  try {
    const db = await getOfflineDB();
    return await db.getAll('offline_questions');
  } catch {
    return [];
  }
}
