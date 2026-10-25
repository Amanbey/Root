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

  // Don't show if already installed, dismissed, or unsupported
  if (isStandalone || isDismissed || (!deferredPrompt && !isInstalled)) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-4 left-3 right-3 sm:left-4 sm:right-4 z-50 mx-auto max-w-md animate-in fade-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-3 sm:p-3.5 shadow-2xl border border-emerald-500/40 text-white backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          </div>
          <div className="text-xs min-w-0">
            <p className="font-bold text-white truncate">{t('pwa_install_title')}</p>
            <p className="text-[11px] text-slate-300 truncate">{t('pwa_install_sub')}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isInstalled ? (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold px-2 py-1 bg-emerald-950/60 rounded-md">
              <Check className="w-3.5 h-3.5" /> {t('pwa_installed')}
            </span>
          ) : (
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold h-8 text-xs px-2.5 sm:px-3 shadow-md"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              {t('pwa_btn_install')}
            </Button>
          )}

          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Close install prompt"
            className="text-slate-400 hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
