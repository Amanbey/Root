'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/navbar';
import { AdviceDetailTabs } from '@/components/advice/advice-detail-tabs';
import { getCachedAdviceCardLocally, getOfflineQuestions, OfflineStoredQuestion } from '@/lib/offline/db';
import { AdviceCard, FarmerProfile } from '@/lib/types';
import { ArrowLeft, MessageSquarePlus, WifiOff, CloudAlert, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface OfflineCardDetailViewProps {
  id: string;
  profile?: FarmerProfile | null;
}

export function OfflineCardDetailView({ id, profile }: OfflineCardDetailViewProps) {
  const [loading, setLoading] = useState(true);
  const [offlineQuestion, setOfflineQuestion] = useState<OfflineStoredQuestion | null>(null);
  const [adviceCard, setAdviceCard] = useState<AdviceCard | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFromLocalDB() {
      try {
        const questions = await getOfflineQuestions();
        const matchedQ = questions.find((q) => q.id === id);

        const cachedCard = await getCachedAdviceCardLocally(id);

        if (isMounted) {
          if (matchedQ) {
            setOfflineQuestion(matchedQ);
            setAdviceCard(matchedQ.adviceCard || cachedCard);
          } else if (cachedCard) {
            setAdviceCard(cachedCard);
          }
          setLoading(false);
        }
      } catch (e) {
        console.warn('Failed to load offline card from IndexedDB:', e);
        if (isMounted) setLoading(false);
      }
    }

    loadFromLocalDB();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <Navbar userEmail={profile?.email} farmerName={profile?.full_name} />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
          <p className="text-sm text-slate-400">Loading advice card from local device storage...</p>
        </main>
      </div>
    );
  }

  if (!adviceCard && !offlineQuestion) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <Navbar userEmail={profile?.email} farmerName={profile?.full_name} />
        <main className="flex-1 max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <CloudAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Diagnosis Not Found</h2>
          <p className="text-xs text-slate-400">
            This crop question is not in the cloud database or local device memory.
          </p>
          <Link href="/diagnose">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs mt-2">
              Start New Diagnosis
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <Navbar userEmail={profile?.email} farmerName={profile?.full_name} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-6 sm:py-8 pb-24 sm:pb-12 w-full space-y-6">
        {/* Offline Badge Alert */}
        <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Offline Mode Active:</strong> Loaded from persistent device memory.
              {offlineQuestion?.syncedOnline === false && ' Queued for cloud database sync.'}
            </span>
          </div>
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px]">
            Device Cache
          </Badge>
        </div>

        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/diagnose"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Crop Diagnosis</span>
          </Link>

          <Link href="/diagnose">
            <Button size="sm" variant="outline" className="border-slate-800 bg-slate-900 text-xs h-8">
              <MessageSquarePlus className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              New Question
            </Button>
          </Link>
        </div>

        {/* Question Summary Bar */}
        <Card className="bg-slate-900/60 border-slate-800">
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 text-xl font-bold">
                🌱
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-[10px]">
                    {offlineQuestion?.crop_type || adviceCard?.primary_crop || 'Crop'}
                  </Badge>
                  <span className="text-[11px] text-slate-400">
                    {new Date(offlineQuestion?.created_at || adviceCard?.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {offlineQuestion?.title || adviceCard?.diagnosis_name}
                </h2>
                {offlineQuestion?.symptoms_description && (
                  <p className="text-xs text-slate-300 line-clamp-2">
                    &ldquo;{offlineQuestion.symptoms_description}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advice Card */}
        {adviceCard && (
          <AdviceDetailTabs 
            card={adviceCard} 
            farmerName={profile?.full_name} 
          />
        )}
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Root Ethiopia • Agricultural Advisory Intelligence
      </footer>
    </div>
  );
}
