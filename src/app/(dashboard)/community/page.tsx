export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getCurrentFarmerProfile } from '@/app/auth/actions';
import { Navbar } from '@/components/shared/navbar';
import { searchCommunityKnowledge, CommunityKnowledgeRow } from '@/lib/supabase/db-helpers';
import { CommunityView } from './community-view';

interface CommunityPageProps {
  searchParams?: Promise<{
    q?: string;
    crop?: string;
    region?: string;
    zone?: string;
  }>;
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const { q = '', crop = '', region = '', zone = '' } = resolvedParams;
  const profile = await getCurrentFarmerProfile();

  // Retrieve community knowledge with all active filters and resilient offline fallback
  let knowledgeItems: CommunityKnowledgeRow[] = [];
  try {
    knowledgeItems = await searchCommunityKnowledge({
      query: q || undefined,
      crop: crop || undefined,
      region: region || undefined,
      agroZone: zone || undefined,
      limit: 30,
    });
  } catch (err) {
    console.warn('[Community Page] Knowledge retrieval notice:', err);
    knowledgeItems = [];
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <Navbar
        userEmail={profile?.email}
        farmerName={profile?.full_name}
        avatarUrl={profile?.avatar_url}
      />

      <main className="flex-1 max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-24 sm:pb-12 w-full space-y-6">
        <CommunityView
          initialItems={knowledgeItems}
          currentCrop={crop}
          currentRegion={region}
          currentQuery={q}
          currentAgroZone={zone}
        />
      </main>

      <footer className="border-t border-slate-900 pt-6 pb-28 md:pb-6 text-center text-xs text-slate-500">
        Root Ethiopia • Agro-Ecological Advisory Engine • 100% Offline-First Multi-Agent Architecture
      </footer>
    </div>
  );
}
