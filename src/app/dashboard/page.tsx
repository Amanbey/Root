export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { redirect } from 'next/navigation';
import { getCurrentFarmerProfile } from '@/app/auth/actions';
import { getFarmerDashboardSummary } from '@/lib/supabase/db-helpers';
import { getCurrentEthiopianSeason } from '@/lib/agronomy/seasonal-calendar';
import { Navbar } from '@/components/shared/navbar';
import { DashboardView } from '@/components/dashboard/dashboard-view';

export default async function DashboardPage() {
  const profile = await getCurrentFarmerProfile();

  if (!profile) {
    redirect('/login?redirectTo=/dashboard');
  }

  // Fetch real database metrics and peer remedies for farmer's main crops
  const summary = await getFarmerDashboardSummary(profile.id, profile.main_crops || []);

  // Compute seasonal advisory based on current Ethiopian calendar
  const seasonData = getCurrentEthiopianSeason();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <Navbar
        userEmail={profile.email}
        farmerName={profile.full_name}
        avatarUrl={profile.avatar_url}
      />

      <main className="flex-1 max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-24 sm:pb-12 w-full">
        <DashboardView
          profile={profile}
          summary={summary}
          seasonData={seasonData}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Root Ethiopia • Agro-Ecological Advisory Engine • 100% Offline-First Multi-Agent Architecture
      </footer>
    </div>
  );
}
