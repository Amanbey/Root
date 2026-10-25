'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if dismissed previously in localStorage
    if (typeof window !== 'undefined' && localStorage.getItem('root_pwa_dismissed')) {
      setIsDismissed(true);
    }

    // Check if app is already running as installed PWA
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('root_pwa_dismissed', 'true');
      } catch {
        // ignore storage quota error
      }
    }
  };

  // Don't show if already installed, dismissed, or unsupported
  if (isStandalone || isDismissed || (!deferredPrompt && !isInstalled)) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 left-3 right-3 md:left-auto md:right-6 z-40 mx-auto md:mx-0 max-w-sm w-auto animate-in fade-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-950/95 via-slate-900/95 to-slate-950/95 p-3 shadow-2xl border border-emerald-500/50 text-white backdrop-blur-xl ring-1 ring-emerald-400/30">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-[0_0_10px_-2px_rgba(16,185,129,0.3)]">
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xs min-w-0">
            <p className="font-bold text-white text-[11px] truncate">{t('pwa_install_title')}</p>
            <p className="text-[10px] text-slate-300 truncate">{t('pwa_install_sub')}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isInstalled ? (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold px-2 py-1 bg-emerald-950/80 border border-emerald-500/40 rounded-lg">
              <Check className="w-3 h-3" /> {t('pwa_installed')}
            </span>
          ) : (
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold h-7 text-[11px] px-2.5 rounded-lg shadow-md"
            >
              <Download className="w-3 h-3 mr-1" />
              {t('pwa_btn_install')}
            </Button>
          )}

          <button
            onClick={handleDismiss}
            aria-label="Close install prompt"
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
