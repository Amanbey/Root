/**
 * ROOT – OFFLINE AUTHENTICATION ENGINE
 * Enables smallholder farmers in rural, zero-connectivity regions of Ethiopia
 * to register accounts, authenticate, and access agronomic tools completely offline.
 * Account mutations and credentials are synchronously cached in localStorage + IndexedDB,
 * cookies are set for middleware/server hydration, and queued for cloud sync.
 */

import { FarmerProfile, SupportedLanguage, EthiopianRegion, AgroEcologicalZone } from '@/lib/types';
import { enqueueOfflineItem, getOfflineDB } from './db';

const STORAGE_KEY_ACTIVE_FARMER = 'root_active_farmer';
const STORAGE_KEY_OFFLINE_ACCOUNTS = 'root_offline_accounts';
const COOKIE_OFFLINE_SESSION = 'root_offline_session';
const COOKIE_OFFLINE_FARMER = 'root_offline_farmer';

export interface OfflineFarmerAccount {
  profile: FarmerProfile;
  password?: string;
  savedAt: number;
}

/**
 * Check if the current browser environment is offline
 */
export function isBrowserOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}

/**
 * Helper to set offline session cookies
 */
export function setOfflineAuthCookies(profile: FarmerProfile): void {
  if (typeof document === 'undefined') return;
  const maxAge = 30 * 24 * 60 * 60; // 30 days
  document.cookie = `${COOKIE_OFFLINE_SESSION}=1; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `${COOKIE_OFFLINE_FARMER}=${encodeURIComponent(JSON.stringify(profile))}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Helper to clear offline session cookies
 */
export function clearOfflineAuthCookies(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_OFFLINE_SESSION}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${COOKIE_OFFLINE_FARMER}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Synchronously get active farmer profile from localStorage
 */
export function getActiveOfflineFarmerSync(): FarmerProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_FARMER);
    return raw ? (JSON.parse(raw) as FarmerProfile) : null;
  } catch {
    return null;
  }
}

/**
 * Get all offline accounts from localStorage
 */
export function getOfflineAccountsSync(): OfflineFarmerAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OFFLINE_ACCOUNTS);
    return raw ? (JSON.parse(raw) as OfflineFarmerAccount[]) : [];
  } catch {
    return [];
  }
}

/**
 * Save an offline farmer profile:
 * - Persists to localStorage for synchronous instant access
 * - Sets offline session cookies for Next.js middleware and SSR
 * - Persists to IndexedDB for resilient background durability
 * - Enqueues a 'register_farmer' task in the offline queue for auto-sync when online
 */
export async function registerOfflineFarmer(params: {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  region: EthiopianRegion;
  agroZone: AgroEcologicalZone;
  preferredLanguage: SupportedLanguage;
}): Promise<FarmerProfile> {
  const cleanEmail = params.email.trim().toLowerCase();
  const profileId = `offline_farmer_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const profile: FarmerProfile = {
    id: profileId,
    email: cleanEmail,
    phone: params.phone?.trim() || undefined,
    full_name: params.fullName.trim(),
    region: params.region,
    agro_ecological_zone: params.agroZone,
    preferred_language: params.preferredLanguage,
    main_crops: ['Teff', 'Wheat'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const account: OfflineFarmerAccount = {
    profile,
    password: params.password,
    savedAt: Date.now(),
  };

  // 1. Synchronous localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_FARMER, JSON.stringify(profile));
      const accounts = getOfflineAccountsSync().filter(
        (a) => a.profile.email?.toLowerCase() !== cleanEmail
      );
      accounts.push(account);
      localStorage.setItem(STORAGE_KEY_OFFLINE_ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {
      console.warn('[Offline Auth] LocalStorage write error:', e);
    }
  }

  // 2. Set cookies
  setOfflineAuthCookies(profile);

  // 3. Persist to IndexedDB
  try {
    const db = await getOfflineDB();
    if (db.objectStoreNames.contains('offline_farmers')) {
      await db.put('offline_farmers', account);
    }
  } catch (idbErr) {
    console.warn('[Offline Auth] IndexedDB account save warning:', idbErr);
  }

  // 4. Enqueue for auto-sync if password was provided
  if (params.password) {
    try {
      await enqueueOfflineItem({
        id: `sync_reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: 'register_farmer',
        payload: {
          fullName: params.fullName.trim(),
          email: cleanEmail,
          phone: params.phone?.trim(),
          password: params.password,
          region: params.region,
          agroZone: params.agroZone,
          preferredLanguage: params.preferredLanguage,
        },
        createdAt: Date.now(),
        attempts: 0,
        status: 'pending',
      });
    } catch (queueErr) {
      console.warn('[Offline Auth] Queue registration error:', queueErr);
    }
  }

  return profile;
}

/**
 * Sign in locally in offline mode using cached credentials
 */
export async function signInOffline(
  email: string,
  password?: string
): Promise<{ success: boolean; profile?: FarmerProfile; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const accounts = getOfflineAccountsSync();

  const found = accounts.find((a) => a.profile.email?.toLowerCase() === cleanEmail);
  if (!found) {
    return {
      success: false,
      error: 'No local account found for this email.',
    };
  }

  // Verify password if one was stored
  if (found.password && password && found.password !== password) {
    return {
      success: false,
      error: 'Incorrect password for local offline account.',
    };
  }

  // Log in as this farmer
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_ACTIVE_FARMER, JSON.stringify(found.profile));
  }
  setOfflineAuthCookies(found.profile);

  return {
    success: true,
    profile: found.profile,
  };
}

/**
 * Create or enter instant offline mode (e.g. guest or field bypass)
 */
export async function createGuestOfflineSession(
  email?: string,
  fullName?: string
): Promise<FarmerProfile> {
  const cleanEmail = email?.trim().toLowerCase() || 'farmer@offline.root';
  const name =
    fullName?.trim() ||
    (email && email.includes('@') ? email.split('@')[0].replace(/[._-]/g, ' ') : '') ||
    'Local Farmer';

  return await registerOfflineFarmer({
    fullName: name,
    email: cleanEmail,
    region: 'Oromia',
    agroZone: 'Weyna Dega',
    preferredLanguage: 'en',
  });
}

/**
 * Log out from offline session
 */
export function signOutOffline(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_ACTIVE_FARMER);
  }
  clearOfflineAuthCookies();
}
