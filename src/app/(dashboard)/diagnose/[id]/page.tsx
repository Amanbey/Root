export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';

import { Navbar } from '@/components/shared/navbar';
import { QuestionDetailNav } from '@/components/advice/question-detail-nav';
import { Footer } from '@/components/shared/footer';
import { AdviceDetailTabs } from '@/components/advice/advice-detail-tabs';
import { 
  getQuestionById, 
  getAdviceCardByQuestionId, 
  getAgentRunWithTimeline 
} from '@/lib/supabase/db-helpers';
import { getCurrentFarmerProfile } from '@/app/auth/actions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { OfflineCardDetailView } from '@/components/advice/offline-card-detail-view';
import { CacheCardClient } from '@/components/advice/cache-card-client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuestionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const profile = await getCurrentFarmerProfile();
  const question = await getQuestionById(id);

  if (!question) {
    return <OfflineCardDetailView id={id} profile={profile} />;
  }

  const adviceCard = await getAdviceCardByQuestionId(id);
  const agentRun = await getAgentRunWithTimeline(id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <CacheCardClient card={adviceCard} />
      <Navbar
        userEmail={profile?.email}
        farmerName={profile?.full_name}
        avatarUrl={profile?.avatar_url}
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-6 sm:py-8 pb-24 sm:pb-12 w-full space-y-6">
        {/* Navigation Breadcrumb */}
        <QuestionDetailNav />

        {/* Question Summary Bar */}
        <Card className="bg-slate-900/60 border-slate-800/80 hover:border-emerald-500/60 hover:ring-1 hover:ring-emerald-400/30 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.25)] transition-all">
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              {question.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={question.photo_url}
                  alt={question.title}
                  className="w-16 h-16 rounded-xl object-cover border border-emerald-500/40 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/40 shadow-[0_0_12px_-2px_rgba(16,185,129,0.3)] flex items-center justify-center text-emerald-400 shrink-0 text-xl font-bold">
                  🌱
                </div>
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-[10px]">
                    {question.crop_type}
                  </Badge>
                  <span className="text-[11px] text-slate-400">
                    {new Date(question.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {question.title}
                </h2>
                <p className="text-xs text-slate-300 line-clamp-2">
                  &ldquo;{question.symptoms_description}&rdquo;
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advice Card & Multi-Agent Deliberation Tabs */}
        {adviceCard ? (
          <AdviceDetailTabs 
            card={adviceCard} 
            farmerName={profile?.full_name} 
            agentRun={agentRun} 
          />
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs rounded-xl bg-slate-900/40 border border-slate-800">
            Diagnosis card is still generating or unavailable.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
