'use client';

import { Suspense } from 'react';
import { ProfileForm } from '@/app/(dashboard)/profile/profile-form';
import { Leaf, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { FarmerProfile } from '@/lib/types';

interface ProfileViewClientProps {
  profile: FarmerProfile | null;
}

export function ProfileViewClient({ profile }: ProfileViewClientProps) {
  const { t, tZone } = useLanguage();

  return (
    <main className="flex-1 max-w-3xl mx-auto px-4 py-6 sm:py-8 pb-24 sm:pb-12 w-full space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 flex items-center justify-center text-slate-950 font-black text-xl shadow-xl shadow-emerald-950/60 border border-emerald-400/40">
            {(profile?.full_name || 'F')[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {profile?.full_name || t('prof_title')}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {t('dash_verified_farmer')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {profile?.region || 'Ethiopia'} • {tZone(profile?.agro_ecological_zone || 'Weyna Dega')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>{t('prof_context_active')}</span>
          </div>
        </div>
      </div>

      {/* Form Component */}
      <Suspense fallback={<div className="text-center py-12 text-slate-400 text-sm">Loading...</div>}>
        <ProfileForm initialProfile={profile} />
      </Suspense>
    </main>
  );
}
