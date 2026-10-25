'use client';

import { useLanguage } from '@/lib/i18n/language-context';
import { SupportedLanguage } from '@/lib/types';
import { Globe } from 'lucide-react';

const LANGUAGES: { code: SupportedLanguage; label: string; short: string; amharicName: string }[] = [
  { code: 'en', label: 'English', short: 'EN', amharicName: 'እንግሊዝኛ' },
  { code: 'am', label: 'አማርኛ', short: 'አማ', amharicName: 'አማርኛ' },
  { code: 'om', label: 'Afaan Oromoo', short: 'OM', amharicName: 'ኦሮምኛ' },
];

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-lg p-0.5 shadow-sm ${className}`}>
      <div className="px-1.5 py-1 text-slate-400 hidden xs:flex items-center">
        <Globe className="w-3.5 h-3.5 text-emerald-400" />
      </div>
      {LANGUAGES.map((lang) => {
        const isSelected = language === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            aria-label={`Switch to ${lang.label}`}
            className={`px-2 py-1 rounded text-xs font-bold transition-all min-w-[28px] ${
              isSelected
                ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-950 font-black'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            {lang.short}
          </button>
        );
      })}
    </div>
  );
}
