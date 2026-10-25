'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage } from '@/lib/types';
import { 
  translations, 
  TranslationKey, 
  Translations, 
  localizedCrops, 
  localizedZones,
  localizedRegions
} from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey, fallback?: string) => string;
  tCrop: (crop: string) => string;
  tZone: (zone: string) => string;
  tRegion: (region: string) => string;
  strings: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: TranslationKey) => translations.en[key] || String(key),
  tCrop: (crop: string) => crop,
  tZone: (zone: string) => zone,
  tRegion: (region: string) => region,
  strings: translations.en,
});

const STORAGE_KEY = 'root_preferred_language';

export function LanguageProvider({
  children,
  initialLanguage = 'en',
}: {
  children: React.ReactNode;
  initialLanguage?: SupportedLanguage;
}) {
  const [language, setLanguageState] = useState<SupportedLanguage>(initialLanguage);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (saved && (saved === 'en' || saved === 'am' || saved === 'om')) {
        setLanguageState(saved);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = saved;
        }
      } else {
        // Enforce English as default
        setLanguageState('en');
        if (typeof document !== 'undefined') {
          document.documentElement.lang = 'en';
        }
      }
    } catch {
      // localStorage may be unavailable
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
      }
    } catch {
      // ignore
    }
  };

  const t = (key: TranslationKey, fallback?: string): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || fallback || translations.en[key] || String(key);
  };

  const tCrop = (crop: string): string => {
    const cropsDict = localizedCrops[language] || localizedCrops.en;
    return cropsDict[crop] || crop;
  };

  const tZone = (zone: string): string => {
    const zonesDict = localizedZones[language] || localizedZones.en;
    return zonesDict[zone] || zone;
  };

  const tRegion = (region: string): string => {
    const regionsDict = localizedRegions[language] || localizedRegions.en;
    return regionsDict[region] || region;
  };

  const currentStrings = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tCrop, tZone, tRegion, strings: currentStrings }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
