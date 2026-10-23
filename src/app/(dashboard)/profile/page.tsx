import { Suspense } from 'react';
import { getCurrentFarmerProfile } from '@/app/auth/actions';
import { Navbar } from '@/components/shared/navbar';
import { ProfileForm } from '@/app/(dashboard)/profile/profile-form';
import { Leaf } from 'lucide-react';

export default async function ProfilePage() {
  const profile = await getCurrentFarmerProfile();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <Navbar userEmail={profile?.email} farmerName={profile?.full_name} />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-6 sm:py-8 w-full space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 flex items-center justify-center text-slate-950 font-black text-xl shadow-xl shadow-emerald-950/60 border border-emerald-400/40">
              {(profile?.full_name || 'Farmer')[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  {profile?.full_name || 'Farmer Profile'}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                  Verified Farmer
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {profile?.region || 'Ethiopia'} • {profile?.agro_ecological_zone || 'Weyna Dega'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>Local Context Active</span>
          </div>
        </div>

        {/* Form Component */}
        <Suspense fallback={<div className="text-center py-12 text-slate-400 text-sm">Loading farmer details...</div>}>
          <ProfileForm initialProfile={profile} />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Root Ethiopia • Agro-Ecological Advisory Engine
      </footer>
    </div>
  );
}
