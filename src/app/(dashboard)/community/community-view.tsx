'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Users, 
  Sprout, 
  ThumbsUp, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Search, 
  X, 
  Plus, 
  Copy, 
  Check, 
  Loader2, 
  CheckCircle2, 
  Share2, 
  AlertCircle 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CommunityKnowledgeRow } from '@/lib/supabase/db-helpers';
import { upvoteRemedyAction, submitRemedyAction } from '@/app/actions/community';
import { useLanguage } from '@/lib/i18n/language-context';

interface CommunityViewProps {
  initialItems: CommunityKnowledgeRow[];
  currentCrop: string;
  currentRegion: string;
  currentQuery: string;
  currentAgroZone: string;
}

const CROPS_RAW = [
  { name: '', icon: '🌾' },
  { name: 'Teff', icon: '🌱' },
  { name: 'Wheat', icon: '🌾' },
  { name: 'Maize', icon: '🌽' },
  { name: 'Coffee', icon: '☕' },
  { name: 'Potato', icon: '🥔' },
  { name: 'Barley', icon: '🌾' },
  { name: 'Chickpea', icon: '🥜' },
  { name: 'Enset', icon: '🌴' },
];

const ETHIOPIAN_REGIONS_LIST = [
  'Oromia',
  'Amhara',
  'Tigray',
  'Sidama',
  'Central Ethiopia',
  'South Ethiopia',
  'Somali',
  'Benishangul-Gumuz',
  'Afar',
];

const AGRO_ZONES_LIST = [
  'Weyna Dega',
  'Dega',
  'Kolla',
  'Bereha',
];

export function CommunityView({
  initialItems,
  currentCrop,
  currentRegion,
  currentQuery,
  currentAgroZone,
}: CommunityViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, tCrop, tZone } = useLanguage();

  const [searchTerm, setSearchTerm] = useState(currentQuery);
  const [selectedRegion, setSelectedRegion] = useState(currentRegion);
  const [selectedAgroZone, setSelectedAgroZone] = useState(currentAgroZone);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [verifiedMap, setVerifiedMap] = useState<Record<string, number>>({});
  const [userVotedMap, setUserVotedMap] = useState<Record<string, boolean>>({});

  // Share Remedy Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form inputs for new remedy
  const [newCrop, setNewCrop] = useState('Teff');
  const [newTitle, setNewTitle] = useState('');
  const [newSymptoms, setNewSymptoms] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newRegion, setNewRegion] = useState('Oromia');
  const [newZone, setNewZone] = useState<'Dega' | 'Weyna Dega' | 'Kolla' | 'Bereha'>('Weyna Dega');

  const updateFilters = (params: { crop?: string; region?: string; q?: string; zone?: string }) => {
    const nextParams = new URLSearchParams(searchParams?.toString() || '');

    if (params.crop !== undefined) {
      if (params.crop) nextParams.set('crop', params.crop);
      else nextParams.delete('crop');
    }

    if (params.region !== undefined) {
      if (params.region && !params.region.startsWith('All')) nextParams.set('region', params.region);
      else nextParams.delete('region');
    }

    if (params.zone !== undefined) {
      if (params.zone && !params.zone.startsWith('All')) nextParams.set('zone', params.zone);
      else nextParams.delete('zone');
    }

    if (params.q !== undefined) {
      if (params.q.trim()) nextParams.set('q', params.q.trim());
      else nextParams.delete('q');
    }

    router.push(`/community?${nextParams.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchTerm });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    updateFilters({ q: '' });
  };

  const handleUpvote = async (id: string, currentCount: number) => {
    if (userVotedMap[id]) return;

    setUserVotedMap((prev) => ({ ...prev, [id]: true }));
    setVerifiedMap((prev) => ({ ...prev, [id]: (prev[id] ?? currentCount) + 1 }));

    try {
      await upvoteRemedyAction(id);
    } catch {
      setUserVotedMap((prev) => ({ ...prev, [id]: false }));
      setVerifiedMap((prev) => ({ ...prev, [id]: currentCount }));
    }
  };

  const handleCopyRecipe = (item: CommunityKnowledgeRow) => {
    const text = `🌿 ${t('brand_name')} Farmer Solution:
${t('diag_title')}: ${item.problem_title} (${tCrop(item.crop_type)})
${t('card_visual_symptoms')}: ${item.symptoms}
${t('card_organic_remedies')}: ${item.proven_solution}
${t('dash_region')}: ${item.region} • ${t('dash_agro_zone')}: ${tZone(item.agro_zone)}
${item.verified_by_farmers_count} ${t('action_verified_by_farmers')}.`;

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const formData = new FormData();
    formData.append('cropType', newCrop);
    formData.append('problemTitle', newTitle);
    formData.append('symptoms', newSymptoms);
    formData.append('provenSolution', newSolution);
    formData.append('region', newRegion);
    formData.append('agroZone', newZone);

    startSubmitTransition(async () => {
      const result = await submitRemedyAction(null, formData);
      if (!result.success) {
        setSubmitError(result.error || 'Failed to submit remedy');
      } else {
        setSubmitSuccess(true);
        setTimeout(() => {
          setIsShareModalOpen(false);
          setSubmitSuccess(false);
          setNewTitle('');
          setNewSymptoms('');
          setNewSolution('');
        }, 1500);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Users className="w-3.5 h-3.5" />
          <span>{t('comm_badge')}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            {t('comm_title')}
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          {t('comm_subtitle')}
        </p>
      </div>

      {/* Header & Share Trigger */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>{t('comm_title')} ({initialItems.length})</span>
          </h2>
          <p className="text-xs text-slate-400">
            {t('comm_subtitle')}
          </p>
        </div>

        <Button
          onClick={() => setIsShareModalOpen(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs h-10 px-4 rounded-xl shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 touch-manipulation"
        >
          <Plus className="w-4 h-4" />
          <span>{t('comm_btn_share')}</span>
        </Button>
      </div>

      {/* Interactive Search & Filter Controls */}
      <div className="space-y-3 bg-slate-900/60 p-3.5 sm:p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder={t('comm_search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950/80 border-slate-800/80 pl-9 pr-9 text-white placeholder:text-slate-500 text-sm h-11 rounded-xl focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 hover:border-slate-700 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Button
            type="submit"
            size="sm"
            className="h-11 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl border border-emerald-400/40 shadow-[0_0_15px_-2px_rgba(16,185,129,0.35)] hover:shadow-[0_0_25px_-2px_rgba(16,185,129,0.5)] hover:border-emerald-300 hover:ring-1 hover:ring-emerald-400/40 shrink-0 touch-manipulation transition-all"
          >
            {t('action_search')}
          </Button>
        </form>

        {/* Crop Filter Chips */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none touch-manipulation">
            {CROPS_RAW.map((chip) => {
              const isSelected = currentCrop.toLowerCase() === chip.name.toLowerCase();
              const label = chip.name ? tCrop(chip.name) : t('comm_filter_all_crops');
              return (
                <button
                  key={chip.name || 'all'}
                  type="button"
                  onClick={() => updateFilters({ crop: chip.name })}
                  className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 shrink-0 transition-all duration-200 touch-manipulation hover:-translate-y-0.5 active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-[0_0_15px_-3px_rgba(16,185,129,0.45)] ring-1 ring-emerald-400/50'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white hover:border-emerald-500/50 hover:ring-1 hover:ring-emerald-400/30 hover:shadow-[0_0_12px_-2px_rgba(16,185,129,0.25)] hover:bg-slate-900/80'
                  }`}
                >
                  <span>{chip.icon}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Region & Agro-Zone Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800/60">
          <div>
            <Label className="text-[11px] text-slate-400 mb-1 block">{t('prof_region')}:</Label>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                updateFilters({ region: e.target.value });
              }}
              className="w-full h-9 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-slate-200 px-2.5 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 hover:border-slate-700 focus:outline-none transition-all"
            >
              <option value="">{t('comm_filter_all_regions')}</option>
              {ETHIOPIAN_REGIONS_LIST.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-[11px] text-slate-400 mb-1 block">{t('prof_agro_zone')}:</Label>
            <select
              value={selectedAgroZone}
              onChange={(e) => {
                setSelectedAgroZone(e.target.value);
                updateFilters({ zone: e.target.value });
              }}
              className="w-full h-9 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-slate-200 px-2.5 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 hover:border-slate-700 focus:outline-none transition-all"
            >
              <option value="">{t('comm_filter_all_crops')}</option>
              {AGRO_ZONES_LIST.map((z) => (
                <option key={z} value={z}>
                  {tZone(z)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Active Filter Indicator */}
      {(currentQuery || currentCrop || selectedRegion || selectedAgroZone) && (
        <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/40 px-3 py-2 rounded-xl border border-slate-800">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              <strong className="text-white">
                {[currentCrop ? tCrop(currentCrop) : '', currentQuery, selectedRegion, selectedAgroZone ? tZone(selectedAgroZone) : ''].filter(Boolean).join(' • ') || t('comm_filter_all_crops')}
              </strong>
            </span>
          </span>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedRegion('');
              setSelectedAgroZone('');
              router.push('/community');
            }}
            className="text-emerald-400 hover:underline text-[11px] font-semibold"
          >
            {t('action_refresh')}
          </button>
        </div>
      )}

      {/* Knowledge Cards Grid */}
      {initialItems.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">{t('comm_empty_title')}</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {t('comm_empty_desc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <Button
              onClick={() => setIsShareModalOpen(true)}
              variant="outline"
              className="w-full sm:w-auto border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40 text-xs"
            >
              {t('comm_btn_share')}
            </Button>
            <Button
              onClick={() => router.push('/diagnose')}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
            >
              {t('action_ask_question')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {initialItems.map((item) => {
            const currentCount = verifiedMap[item.id] ?? item.verified_by_farmers_count;
            const hasVoted = userVotedMap[item.id];
            const isCopied = copiedId === item.id;

            return (
              <Card
                key={item.id}
                className="bg-slate-900/75 border-slate-800/80 hover:border-emerald-400/80 hover:ring-1 hover:ring-emerald-400/40 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.35)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between backdrop-blur-sm shadow-xl shadow-slate-950/40 group"
              >
                <CardHeader className="p-4 sm:p-5 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className="border-emerald-500/50 bg-emerald-950/40 text-emerald-300 text-[10px] font-bold shadow-[0_0_10px_-2px_rgba(16,185,129,0.3)]">
                        {tCrop(item.crop_type)}
                      </Badge>
                      <Badge variant="outline" className="border-slate-700 bg-slate-950 text-slate-300 text-[10px]">
                        {tZone(item.agro_zone || 'Weyna Dega')}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-950/60 border border-emerald-500/50 px-2.5 py-0.5 rounded-full shrink-0 shadow-sm shadow-emerald-950/60">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{currentCount} {t('action_verified_by_farmers')}</span>
                    </div>
                  </div>

                  <CardTitle className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-emerald-300 transition-colors">
                    {item.problem_title}
                  </CardTitle>

                  {item.symptoms && (
                    <CardDescription className="text-xs text-slate-300 mt-1 line-clamp-2 italic">
                      &ldquo;{item.symptoms}&rdquo;
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="p-4 sm:p-5 pt-0 space-y-3.5">
                  {/* Proven Solution Box */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/25 border border-emerald-500/30 space-y-1.5 transition-all group-hover:border-emerald-500/60 group-hover:ring-1 group-hover:ring-emerald-400/20 group-hover:shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t('card_organic_remedies')}
                    </span>
                    <p className="text-xs text-slate-100 leading-relaxed font-medium">
                      {item.proven_solution}
                    </p>
                  </div>

                  {/* Meta & Interactive Action Row */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/70 text-xs">
                    <span className="flex items-center gap-1 text-slate-400 text-[11px] truncate">
                      <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                      {item.region || 'Ethiopia'}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Copy / Share Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyRecipe(item)}
                        className="h-8 px-2 text-slate-400 hover:text-white hover:bg-slate-800/80 hover:border-slate-700 text-[11px] touch-manipulation hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[10px] ml-1 font-bold">{t('action_saved')}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[10px] ml-1">{t('action_share_remedy')}</span>
                          </>
                        )}
                      </Button>

                      {/* Upvote Button */}
                      <Button
                        size="sm"
                        variant={hasVoted ? 'default' : 'outline'}
                        onClick={() => handleUpvote(item.id, item.verified_by_farmers_count)}
                        disabled={hasVoted}
                        className={`h-8 px-2.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 touch-manipulation transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
                          hasVoted
                            ? 'bg-emerald-600 text-white border-emerald-400/80 shadow-[0_0_15px_-2px_rgba(16,185,129,0.5)] ring-1 ring-emerald-400/40'
                            : 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/60 hover:text-white hover:border-emerald-400 hover:ring-1 hover:ring-emerald-400/40 hover:shadow-[0_0_18px_-2px_rgba(16,185,129,0.4)]'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-current' : ''}`} />
                        <span>{hasVoted ? t('comm_btn_verified') : t('comm_btn_verify')}</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Share Remedy Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <Card className="w-full max-w-lg bg-slate-900 border border-emerald-500/50 shadow-[0_0_50px_-10px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400/30 text-slate-100 max-h-[92vh] overflow-y-auto">
            <CardHeader className="pb-3 border-b border-slate-800/80 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg font-bold text-white">
                      {t('comm_modal_title')}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      {t('comm_subtitle')}
                    </CardDescription>
                  </div>
                </div>

                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 hover:border hover:border-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4">
              {submitSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h3 className="text-base font-bold text-white">{t('action_saved')}</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {t('card_feedback_thanks')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleShareSubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)] text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-300">{t('comm_modal_crop')}:</Label>
                      <select
                        value={newCrop}
                        onChange={(e) => setNewCrop(e.target.value)}
                        className="w-full h-10 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-white px-2.5 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 hover:border-slate-700 focus:outline-none transition-all"
                      >
                        {CROPS_RAW.filter((c) => c.name).map((c) => (
                          <option key={c.name} value={c.name}>
                            {tCrop(c.name)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-300">{t('comm_modal_zone')}:</Label>
                      <select
                        value={newZone}
                        onChange={(e) => setNewZone(e.target.value as 'Dega' | 'Weyna Dega' | 'Kolla' | 'Bereha')}
                        className="w-full h-10 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-white px-2.5 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 hover:border-slate-700 focus:outline-none transition-all"
                      >
                        <option value="Weyna Dega">{tZone('Weyna Dega')}</option>
                        <option value="Dega">{tZone('Dega')}</option>
                        <option value="Kolla">{tZone('Kolla')}</option>
                        <option value="Bereha">{tZone('Bereha')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">
                      {t('comm_modal_problem')}:
                    </Label>
                    <Input
                      required
                      placeholder={t('comm_modal_problem_placeholder')}
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="bg-slate-950 border-slate-800/80 text-white placeholder:text-slate-500 text-xs sm:text-sm h-10 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 hover:border-slate-700 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">
                      {t('comm_modal_symptoms')}:
                    </Label>
                    <Textarea
                      required
                      rows={2}
                      placeholder={t('comm_modal_symptoms_placeholder')}
                      value={newSymptoms}
                      onChange={(e) => setNewSymptoms(e.target.value)}
                      className="bg-slate-950 border-slate-800/80 text-white placeholder:text-slate-500 text-xs leading-relaxed focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 hover:border-slate-700 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">
                      {t('comm_modal_solution')}:
                    </Label>
                    <Textarea
                      required
                      rows={3}
                      placeholder={t('comm_modal_solution_placeholder')}
                      value={newSolution}
                      onChange={(e) => setNewSolution(e.target.value)}
                      className="bg-slate-950 border-slate-800/80 text-white placeholder:text-slate-500 text-xs leading-relaxed focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 hover:border-slate-700 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">{t('comm_modal_region')}:</Label>
                    <select
                      value={newRegion}
                      onChange={(e) => setNewRegion(e.target.value)}
                      className="w-full h-10 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-white px-2.5 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 hover:border-slate-700 focus:outline-none transition-all"
                    >
                      {ETHIOPIAN_REGIONS_LIST.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsShareModalOpen(false)}
                      className="text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      {t('action_cancel')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs h-10 px-5 rounded-xl border border-emerald-400/50 shadow-[0_0_20px_-3px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_-3px_rgba(16,185,129,0.6)] hover:border-emerald-300 hover:ring-1 hover:ring-emerald-400/40 flex items-center gap-1.5 transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>{t('comm_modal_btn_publishing')}</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{t('comm_modal_btn_publish')}</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
