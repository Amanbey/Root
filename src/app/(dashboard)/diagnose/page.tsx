export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';
import { getCurrentFarmerProfile } from '@/app/auth/actions';
import { Navbar } from '@/components/shared/navbar';
import { QuestionForm } from '@/app/(dashboard)/diagnose/question-form';
import { getUserQuestions } from '@/lib/supabase/db-helpers';
import { Bot, History, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OfflineSavedCardsClient } from '@/components/advice/offline-saved-cards-client';

export default async function DiagnosePage() {
  const profile = await getCurrentFarmerProfile();
  const pastQuestions = profile?.id ? await getUserQuestions(profile.id) : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <Navbar userEmail={profile?.email} farmerName={profile?.full_name} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-6 sm:py-8 pb-24 sm:pb-12 w-full space-y-8">
        {/* Title Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Bot className="w-3.5 h-3.5" />
            <span>Multi-Agent Advisory System • ደረጃ 1</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Diagnose Crop Problem <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              የሰብል ችግር ምርመራ
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400">
            Submit your crop symptoms or upload a field photo. Root’s Diagnostic Agent will analyze the pathogen and generate a structured Advice Card.
          </p>
        </div>

        {/* Form */}
        <QuestionForm initialProfile={profile} />

        {/* Offline Stored Diagnoses (Persistent IndexedDB) */}
        <OfflineSavedCardsClient />

        {/* Real User's Past Diagnoses (100% Real Supabase Data) */}
        {pastQuestions.length > 0 && (
          <section className="space-y-3 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                Your Recent Diagnoses ({pastQuestions.length})
              </h2>
              <span className="text-[11px] text-slate-400">
                Peer-verified and saved to device
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {pastQuestions.map((q) => (
                <Card
                  key={q.id}
                  className="bg-slate-900/70 border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-[10px]">
                          {q.crop_type}
                        </Badge>
                        <Badge variant="outline" className="border-slate-800 text-slate-400 text-[10px]">
                          {q.agro_zone || 'Weyna Dega'}
                        </Badge>
                      </div>
                      {q.advice_card && (
                        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{q.advice_card.confidence_score}% Confirmed</span>
                        </div>
                      )}
                    </div>

                    <CardTitle className="text-sm font-bold text-white leading-snug">
                      {q.advice_card?.diagnosis_name || q.title}
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
                        className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                      >
                        <span>View Advice Card</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Guarantees */}
        <div className="max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-center text-[11px] text-slate-400">
          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="font-semibold text-emerald-400 block">⚡ Instant Response</span>
            <span>Local Ollama & Offline Engine</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="font-semibold text-amber-400 block">🌿 0 ETB Cost</span>
            <span>Pesticide-free organic remedies</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80 col-span-2 sm:col-span-1">
            <span className="font-semibold text-teal-400 block">📡 100% Offline</span>
            <span>Saved to local device cache</span>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Root Ethiopia • Agricultural Advisory Intelligence
      </footer>
    </div>
  );
}
