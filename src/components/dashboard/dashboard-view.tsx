'use client';

import Link from 'next/link';
import { 
  Bot, 
  Leaf, 
  Compass, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  PlusCircle, 
  Users, 
  HardDrive, 
  ArrowRight, 
  History, 
  ShieldCheck, 
  Sparkles,
  Award
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { FarmerProfile } from '@/lib/types';
import { FarmerDashboardSummary } from '@/lib/supabase/db-helpers';
import { SeasonalAdvisory } from '@/lib/agronomy/seasonal-calendar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OfflineSavedCardsClient } from '@/components/advice/offline-saved-cards-client';

interface DashboardViewProps {
  profile: FarmerProfile;
  summary: FarmerDashboardSummary;
  seasonData: SeasonalAdvisory;
}

export function DashboardView({ profile, summary, seasonData }: DashboardViewProps) {
  const { t, language } = useLanguage();

  const seasonName = seasonData.localName[language] || seasonData.localName.en;
  const seasonDesc = seasonData.monthsDescription[language] || seasonData.monthsDescription.en;
  const primaryFocus = seasonData.primaryFocus[language] || seasonData.primaryFocus.en;
  const criticalActions = seasonData.criticalActions[language] || seasonData.criticalActions.en;
  const pestWarnings = seasonData.pestWarnings[language] || seasonData.pestWarnings.en;
  const zoneTip = seasonData.zoneSpecificTips[profile.agro_ecological_zone]
    ? seasonData.zoneSpecificTips[profile.agro_ecological_zone][language] || seasonData.zoneSpecificTips[profile.agro_ecological_zone].en
    : null;

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* 1. Farmer Welcome & Profile Banner */}
      <section className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-emerald-950/60 border border-emerald-400/40 shrink-0">
              {(profile.full_name || 'Farmer')[0].toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {profile.full_name}
                </h1>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px] font-bold py-0.5">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  {t('dash_verified_farmer')}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {profile.region} {profile.zone_name ? `• ${profile.zone_name}` : ''}
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Compass className="w-3.5 h-3.5 text-teal-400" />
                  {profile.agro_ecological_zone}
                </span>
                {profile.farm_size_hectares && (
                  <span className="text-slate-400 hidden xs:inline">
                    • {profile.farm_size_hectares} Hectares
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="/profile"
              className="w-full sm:w-auto text-center px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              {language === 'am' ? 'መገለጫ አሻሽል' : language === 'om' ? 'Eenyummaa Fooyyessi' : 'Edit Farm Profile'}
            </Link>
            <Link
              href="/diagnose"
              className="w-full sm:w-auto text-center px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950/60 transition-transform active:scale-95 flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('action_ask_question')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Scoreboard */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-slate-900/70 border-slate-800/90 shadow-md">
          <CardHeader className="p-3.5 sm:p-4 pb-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] sm:text-xs font-medium">{t('dash_total_inquiries')}</span>
              <History className="w-4 h-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-4 pt-1">
            <div className="text-xl sm:text-2xl font-black text-white">{summary.totalQuestions}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {language === 'am' ? 'የተጠየቁ የሰብል ጥያቄዎች' : language === 'om' ? 'Qorannoowwan dhiyaatan' : 'Field diagnostic queries'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/70 border-slate-800/90 shadow-md">
          <CardHeader className="p-3.5 sm:p-4 pb-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] sm:text-xs font-medium">{t('dash_confirmed_resolutions')}</span>
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
            </div>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-4 pt-1">
            <div className="text-xl sm:text-2xl font-black text-emerald-400">{summary.resolvedDiagnoses}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {summary.totalQuestions > 0
                ? `${Math.round((summary.resolvedDiagnoses / summary.totalQuestions) * 100)}% Resolved with Advice`
                : '100% Multi-Agent AI ready'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/70 border-slate-800/90 shadow-md">
          <CardHeader className="p-3.5 sm:p-4 pb-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] sm:text-xs font-medium">{t('dash_active_crops')}</span>
              <Leaf className="w-4 h-4 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-4 pt-1">
            <div className="text-xl sm:text-2xl font-black text-white">
              {profile.main_crops?.length || 0}
            </div>
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {(profile.main_crops || []).slice(0, 3).map((crop) => (
                <span
                  key={crop}
                  className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-300 border border-slate-700/60"
                >
                  {crop}
                </span>
              ))}
              {(profile.main_crops || []).length > 3 && (
                <span className="text-[9px] text-slate-500">+{profile.main_crops.length - 3}</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/70 border-slate-800/90 shadow-md">
          <CardHeader className="p-3.5 sm:p-4 pb-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] sm:text-xs font-medium">{t('dash_offline_ready')}</span>
              <HardDrive className="w-4 h-4 text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-4 pt-1">
            <div className="text-xl sm:text-2xl font-black text-cyan-400">IndexedDB</div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {t('status_cached_ready')}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 3. Ethiopian Agro-Ecological Season Radar */}
      <section className="p-4 sm:p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{seasonName}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {seasonData.season}
                </span>
              </h2>
              <p className="text-xs text-slate-400">{seasonDesc}</p>
            </div>
          </div>

          <div className="text-xs text-emerald-400 font-medium">
            {profile.agro_ecological_zone} • {profile.region}
          </div>
        </div>

        {/* Primary Season Focus */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <strong className="text-emerald-400 font-semibold block sm:inline mr-2">
            {language === 'am' ? 'የወቅቱ ዋና ትኩረት፦' : language === 'om' ? 'Xiyyeeffannoo Waqtii:' : 'Seasonal Priority:'}
          </strong>
          {primaryFocus}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Critical Seasonal Actions */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'am' ? 'ወቅታዊ ተግባራት' : language === 'om' ? 'Tarkaanfiiwwan Waqtii' : 'Critical Seasonal Actions'}</span>
            </h3>
            <ul className="space-y-1.5">
              {criticalActions.slice(0, 3).map((action, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pest & Pathogen Warning */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'am' ? 'የተባይ እና በሽታ ማስጠንቀቂያ' : language === 'om' ? 'Akeekkachiisa Ilbiisotaa' : 'Active Seasonal Pest Alerts'}</span>
            </h3>
            <ul className="space-y-1.5">
              {pestWarnings.slice(0, 3).map((warning, idx) => (
                <li key={idx} className="text-xs text-amber-200/90 flex items-start gap-2 bg-amber-950/20 p-2 rounded-lg border border-amber-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Zone Specific Tip */}
        {zoneTip && (
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>{profile.agro_ecological_zone}:</strong> {zoneTip}
            </span>
          </div>
        )}
      </section>

      {/* 4. Quick Action Center */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          {t('dash_quick_actions')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <Link
            href="/diagnose"
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all flex items-center justify-between group min-h-[56px] shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{t('action_ask_question')}</div>
                <div className="text-[10px] text-slate-400">
                  {language === 'am' ? 'የሰብል ፎቶ ወይም ምልክቶችን ይላኩ' : language === 'om' ? 'Suuraa fi mallattoolee ergi' : 'Submit photo or leaf symptoms'}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </Link>

          <Link
            href="/community"
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all flex items-center justify-between group min-h-[56px] shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {language === 'am' ? 'የገበሬዎች ተሞክሮ' : language === 'om' ? 'Muuxannoo Hawaasaa' : 'Community Remedies'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {language === 'am' ? 'በአርሶ አደሮች የተረጋገጡ መፍትሔዎች' : language === 'om' ? 'Furmaata mirkanaa’e ilaali' : 'Peer-verified regional solutions'}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
          </Link>

          <Link
            href="/profile"
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all flex items-center justify-between group min-h-[56px] shadow-sm sm:col-span-2 md:col-span-1"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {language === 'am' ? 'የእርሻ መገለጫ' : language === 'om' ? 'Eenyummaa Qonnaa' : 'Farm Profile'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {language === 'am' ? 'ዞን እና ዋና ሰብሎችን ያዘምኑ' : language === 'om' ? 'Kuta qilleensaa haaromsi' : 'Update zone and registered crops'}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </Link>
        </div>
      </section>

      {/* 5. Persistent Offline Saved Cards (IndexedDB) */}
      <section className="space-y-3">
        <OfflineSavedCardsClient />
      </section>

      {/* 6. Recent Diagnoses Feed */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <span>{t('dash_recent_diagnoses')}</span>
          </h2>
          <Link
            href="/diagnose"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            {language === 'am' ? 'ሁሉንም ይመልከቱ' : language === 'om' ? 'Hunda Ilaali' : 'View All'} &rarr;
          </Link>
        </div>

        {summary.recentQuestions.length === 0 ? (
          <Card className="bg-slate-900/40 border-slate-800 text-center py-8 px-4">
            <CardContent className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Bot className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {t('dash_no_diagnoses_yet')}
              </p>
              <Link href="/diagnose">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/60"
                >
                  {t('dash_start_first_diagnosis')}
                </button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {summary.recentQuestions.map((q) => (
              <Card
                key={q.id}
                className="bg-slate-900/70 border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-[10px]">
                        {q.crop_type}
                      </Badge>
                      <Badge variant="outline" className="border-slate-800 text-slate-400 text-[10px]">
                        {q.agro_zone || 'Weyna Dega'}
                      </Badge>
                    </div>
                    {q.advice_card && (
                      <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{q.advice_card.confidence_score}% Confirmed</span>
                      </div>
                    )}
                  </div>

                  <CardTitle className="text-sm font-bold text-white leading-snug">
                    {q.advice_card?.diagnosis_name || q.title}
                  </CardTitle>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 italic">
                    &ldquo;{q.symptoms_description}&rdquo;
                  </p>
                </CardHeader>

                <CardContent className="p-4 pt-2">
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <span className="text-[10px] text-slate-500">
                      {new Date(q.created_at).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/diagnose/${q.id}`}
                      className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      <span>{t('action_view_advice')}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 7. Peer Remedy Knowledge Spotlight */}
      {summary.peerRemedies.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-400" />
              <span>{t('dash_community_spotlight')}</span>
            </h2>
            <Link
              href="/community"
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold"
            >
              {language === 'am' ? 'የማህበረሰብ ማዕከል' : language === 'om' ? 'Wiirtuu Hawaasaa' : 'Community Hub'} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {summary.peerRemedies.map((remedy) => (
              <div
                key={remedy.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-teal-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-teal-300 px-2 py-0.5 rounded bg-teal-950/60 border border-teal-500/30">
                    {remedy.crop_type}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {remedy.verified_by_farmers_count} {t('action_verified_by_farmers')}
                  </span>
                </div>
                <div className="text-xs font-bold text-white line-clamp-1">{remedy.problem_title}</div>
                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                  {remedy.proven_solution}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
