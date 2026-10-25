export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getCurrentFarmerProfile } from '@/app/auth/actions';
import { Navbar } from '@/components/shared/navbar';
import { getUserQuestions } from '@/lib/supabase/db-helpers';
import { DiagnoseViewClient } from '@/app/(dashboard)/diagnose/diagnose-view-client';

export default async function DiagnosePage() {
  const profile = await getCurrentFarmerProfile();
  const pastQuestions = profile?.id ? await getUserQuestions(profile.id) : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <Navbar
        userEmail={profile?.email}
        farmerName={profile?.full_name}
        avatarUrl={profile?.avatar_url}
      />

      <DiagnoseViewClient
        profile={profile}
        pastQuestions={pastQuestions}
      />

      <footer className="border-t border-slate-900 pt-6 pb-28 md:pb-6 text-center text-xs text-slate-500">
        Root Ethiopia • Agricultural Advisory Intelligence
      </footer>
    </div>
  );
}
