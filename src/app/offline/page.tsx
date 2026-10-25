'use client';

import Link from 'next/link';
import { WifiOff, RefreshCw, BookmarkCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OfflineSavedCardsClient } from '@/components/advice/offline-saved-cards-client';
import { useLanguage } from '@/lib/i18n/language-context';

export default function OfflinePage() {
  const { t } = useLanguage();

  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6">
      <header className="pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <span className="font-bold text-lg">🌱</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-emerald-400">{t('brand_name')}</h1>
            <p className="text-xs text-slate-400">{t('brand_tagline')}</p>
          </div>
        </div>
      </header>

      <main className="my-auto max-w-md mx-auto w-full space-y-6 text-center">
        <div className="inline-flex p-4 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 animate-pulse">
          <WifiOff className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {t('offline_screen_title')}
          </h2>
          <p className="text-amber-400 font-medium text-sm">
            {t('status_offline')}
          </p>
          <p className="text-sm text-slate-300">
            {t('offline_screen_description')}
          </p>
        </div>

        <Card className="bg-slate-900/60 border-slate-800/80 hover:border-emerald-500/60 hover:ring-1 hover:ring-emerald-400/30 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.25)] text-left text-slate-200 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('status_cached_ready')}</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              {t('offline_screen_subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <p>{t('offline_screen_feature1')}</p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <p>{t('offline_screen_feature2')}</p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <p>{t('offline_screen_feature3')}</p>
            </div>
          </CardContent>
        </Card>

        <OfflineSavedCardsClient />

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={handleRetry}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium border border-emerald-400/40 shadow-[0_0_20px_-3px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_-3px_rgba(16,185,129,0.6)] hover:border-emerald-300 hover:ring-1 hover:ring-emerald-400/40 flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t('offline_screen_btn_retry')}</span>
          </Button>

          <Link href="/diagnose" className="w-full">
            <Button
              variant="outline"
              className="w-full border-slate-700 hover:border-emerald-500/50 hover:ring-1 hover:ring-emerald-400/30 hover:shadow-[0_0_15px_-3px_rgba(16,185,129,0.25)] bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('offline_screen_btn_diagnose')}</span>
            </Button>
          </Link>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-500 pb-2">
        {t('footer_text')}
      </footer>
    </div>
  );
}
