export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getCurrentFarmerProfile } from '@/app/auth/actions';
import { Navbar } from '@/components/shared/navbar';
import { searchCommunityKnowledge } from '@/lib/supabase/db-helpers';
import { Users, Sprout } from 'lucide-react';
import { CommunityView } from './community-view';
import Link from 'next/link';

interface CommunityPageProps {
  searchParams: Promise<{
    q?: string;
    crop?: string;
    region?: string;
    zone?: string;
  }>;
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const { q = '', crop = '', region = '', zone = '' } = await searchParams;
  const profile = await getCurrentFarmerProfile();

  // Retrieve community knowledge with all active filters
  const knowledgeItems = await searchCommunityKnowledge({
    query: q || undefined,
    crop: crop || undefined,
    region: region || undefined,
    agroZone: zone || undefined,
    limit: 30,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <Navbar userEmail={profile?.email} farmerName={profile?.full_name} />

      <main className="flex-1 max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-24 sm:pb-12 w-full space-y-6">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Peer-Verified Ethiopian Agronomy • የማህበረሰብ እውቀት</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Community Knowledge Hub <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              የአርሶ አደሮች የጋራ ተሞክሮ
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Practical remedies tested, upvoted, and proven by smallholders across Oromia, Amhara, Tigray, Sidama, and Southern regions.
          </p>
        </div>

        {/* Interactive Community Client View */}
        <CommunityView
          initialItems={knowledgeItems}
          currentCrop={crop}
          currentRegion={region}
          currentQuery={q}
          currentAgroZone={zone}
        />

        {/* Bottom Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-400" />
              Have a crop dilemma on your own farm?
            </h3>
            <p className="text-xs text-slate-300">
              Run the 5-Agent Council to get a customized, low-cost Advice Card tailored to your soil and agro-zone.
            </p>
          </div>

          <Link href="/diagnose" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-colors touch-manipulation">
              Start Diagnosis • ምርመራ ጀምር
            </button>
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Root Ethiopia • Agricultural Advisory Intelligence
      </footer>
    </div>
  );
}
