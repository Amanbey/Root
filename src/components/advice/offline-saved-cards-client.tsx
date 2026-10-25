'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getOfflineQuestions, OfflineStoredQuestion } from '@/lib/offline/db';
import { HardDrive, ArrowRight, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n/language-context';

export function OfflineSavedCardsClient() {
  const { t, tCrop, tZone } = useLanguage();
  const [offlineCards, setOfflineCards] = useState<OfflineStoredQuestion[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const stored = await getOfflineQuestions();
        if (isMounted) {
          setOfflineCards(stored);
        }
      } catch (err) {
        console.warn('Failed to load offline cards:', err);
      }
    }

    load();

    const handleSync = () => {
      load();
    };

    window.addEventListener('root:sync-status', handleSync);
    return () => {
      isMounted = false;
      window.removeEventListener('root:sync-status', handleSync);
    };
  }, []);

  if (offlineCards.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3 pt-4 border-t border-slate-800/80">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-amber-400" />
          <span>{t('diag_offline_saved_title')} ({offlineCards.length})</span>
        </h2>
        <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
          <WifiOff className="w-3 h-3" />
          <span>{t('status_cached_ready')}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {offlineCards.map((q) => (
          <Card
            key={q.id}
            className="bg-slate-900/70 border border-amber-500/40 hover:border-amber-400/80 hover:ring-1 hover:ring-amber-400/40 hover:shadow-[0_0_25px_-4px_rgba(245,158,11,0.3)] transition-all duration-300 flex flex-col justify-between"
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="border-amber-500/50 bg-amber-950/40 text-amber-300 text-[10px]">
                    {tCrop(q.crop_type)}
                  </Badge>
                  <Badge variant="outline" className="border-slate-800 text-slate-400 text-[10px]">
                    {tZone(q.agro_zone || 'Weyna Dega')}
                  </Badge>
                </div>

                <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px]">
                  {q.syncedOnline ? t('status_online') : t('status_queued_local')}
                </Badge>
              </div>

              <CardTitle className="text-sm font-bold text-white leading-snug">
                {q.adviceCard?.diagnosis_name || q.title}
              </CardTitle>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1 italic">
                &ldquo;{q.symptoms_description}&rdquo;
              </p>
            </CardHeader>

            <CardContent className="p-4 pt-2">
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <span className="text-[10px] text-slate-500">
                  {new Date(q.created_at).toLocaleDateString()}
                </span>
                <Link
                  href={`/diagnose/${q.id}`}
                  className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold p-1 rounded-lg hover:bg-amber-950/40 transition-colors"
                >
                  <span>{t('diag_open_offline_card')}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
