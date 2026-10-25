export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getCurrentFarmerProfile } from '@/app/auth/actions';
import { Navbar } from '@/components/shared/navbar';
import { searchCommunityKnowledge } from '@/lib/supabase/db-helpers';
import { CommunityView } from './community-view';

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
        <CommunityView
          initialItems={knowledgeItems}
          currentCrop={crop}
          currentRegion={region}
          currentQuery={q}
          currentAgroZone={zone}
        />
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Root Ethiopia • Agro-Ecological Advisory Engine • 100% Offline-First Multi-Agent Architecture
      </footer>
    </div>
  );
}
