import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/shared/navbar';
import { AdviceDetailTabs } from '@/components/advice/advice-detail-tabs';
import { 
  getQuestionById, 
  getAdviceCardByQuestionId, 
  getAgentRunWithTimeline 
} from '@/lib/supabase/db-helpers';
import { getCurrentFarmerProfile } from '@/app/auth/actions';
import { ArrowLeft, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuestionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const profile = await getCurrentFarmerProfile();
  const question = await getQuestionById(id);

  if (!question) {
    notFound();
  }

  const adviceCard = await getAdviceCardByQuestionId(id);
  const agentRun = await getAgentRunWithTimeline(id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <Navbar userEmail={profile?.email} farmerName={profile?.full_name} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-6 sm:py-8 pb-24 sm:pb-12 w-full space-y-6">
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
              {question.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={question.photo_url}
                  alt={question.title}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 text-xl font-bold">
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

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Root Ethiopia • Agricultural Advisory Intelligence
      </footer>
    </div>
  );
}
