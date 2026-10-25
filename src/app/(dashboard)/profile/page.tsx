export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getCurrentFarmerProfile } from '@/app/auth/actions';
import { Navbar } from '@/components/shared/navbar';
import { ProfileViewClient } from '@/app/(dashboard)/profile/profile-view-client';

export default async function ProfilePage() {
  const profile = await getCurrentFarmerProfile();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <Navbar
        userEmail={profile?.email}
        farmerName={profile?.full_name}
        avatarUrl={profile?.avatar_url}
      />

      <ProfileViewClient profile={profile} />

      <footer className="border-t border-slate-900 pt-6 pb-28 md:pb-6 text-center text-xs text-slate-500">
        Root Ethiopia • Agro-Ecological Advisory Engine • 100% Offline-First Multi-Agent Architecture
      </footer>
    </div>
  );
}
