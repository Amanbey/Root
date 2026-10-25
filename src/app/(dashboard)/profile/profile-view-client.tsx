'use client';

import { Suspense, useState } from 'react';
import { ProfileForm } from '@/app/(dashboard)/profile/profile-form';
import { Leaf, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { FarmerProfile } from '@/lib/types';

interface ProfileViewClientProps {
  profile: FarmerProfile | null;
}

export function ProfileViewClient({ profile }: ProfileViewClientProps) {
  const { t, tZone } = useLanguage();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null);

  return (
    <main className="flex-1 max-w-3xl mx-auto px-4 py-6 sm:py-8 pb-24 sm:pb-12 w-full space-y-6">
      {/* Profile Header with Dynamic Hover Aura */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="group/header-avatar relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-emerald-500/40 shadow-xl shadow-emerald-950/60 transition-all duration-300 hover:scale-105 hover:ring-emerald-400 shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={profile?.full_name || 'Farmer Avatar'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/header-avatar:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 flex items-center justify-center text-slate-950 font-black text-2xl">
                {(profile?.full_name || 'F')[0].toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {profile?.full_name || t('prof_title')}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold flex items-center gap-1 transition-colors hover:bg-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                {t('dash_verified_farmer')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {profile?.region || 'Ethiopia'} • {tZone(profile?.agro_ecological_zone || 'Weyna Dega')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/90">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>{t('prof_context_active')}</span>
          </div>
        </div>
      </div>

      {/* Form Component */}
      <Suspense fallback={<div className="text-center py-12 text-slate-400 text-sm">Loading...</div>}>
        <ProfileForm initialProfile={profile} onAvatarChange={setAvatarUrl} />
      </Suspense>
    </main>
  );
}
