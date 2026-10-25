'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/language-context';
import { SupportedLanguage } from '@/lib/types';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  short: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', short: 'EN' },
  { code: 'am', label: 'Amharic', nativeLabel: 'አማርኛ', short: 'አማ' },
  { code: 'om', label: 'Oromo', nativeLabel: 'Afaan Oromoo', short: 'OM' },
];

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Dropdown Trigger Button with Edge Glow */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select Language"
        className={`group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 border transition-all duration-200 outline-none select-none hover:-translate-y-0.5 active:translate-y-0 ${
          isOpen
            ? 'border-emerald-400 bg-slate-900 text-white ring-2 ring-emerald-400/40 shadow-[0_0_20px_-3px_rgba(16,185,129,0.4)]'
            : 'border-slate-800 text-slate-200 hover:text-white hover:border-emerald-500/60 hover:bg-slate-900 hover:shadow-[0_0_18px_-3px_rgba(16,185,129,0.3)] hover:ring-1 hover:ring-emerald-400/30'
        }`}
      >
        <Globe className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-12 ${
          isOpen ? 'text-emerald-300' : 'text-emerald-400'
        }`} />
        
        {/* Full native label on sm screens, short code on tiny mobile */}
        <span className="hidden xs:inline font-bold tracking-tight">
          {currentLang.nativeLabel}
        </span>
        <span className="xs:hidden font-black text-[11px] text-emerald-300">
          {currentLang.short}
        </span>

        {/* Rotating Chevron */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 group-hover:text-emerald-400 ${
            isOpen ? 'rotate-180 text-emerald-400' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Languages"
          className="absolute right-0 top-full mt-2 w-48 sm:w-52 rounded-2xl bg-slate-950/95 border border-emerald-500/40 shadow-2xl shadow-emerald-950/80 ring-1 ring-emerald-400/30 backdrop-blur-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1"
        >
          <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 flex items-center justify-between">
            <span>Language / ቋንቋ</span>
            <span className="text-emerald-400 font-mono text-[9px]">3 Active</span>
          </div>

          <div className="py-0.5 space-y-0.5">
            {LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 text-left border ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-white font-bold shadow-sm shadow-emerald-950/40 ring-1 ring-emerald-400/30'
                      : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-900/90 hover:border-emerald-500/40 hover:shadow-[0_0_12px_-2px_rgba(16,185,129,0.25)]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-white tracking-tight">
                      {lang.nativeLabel}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {lang.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md border ${
                      isSelected
                        ? 'bg-emerald-500/30 border-emerald-400/50 text-emerald-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      {lang.short}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
