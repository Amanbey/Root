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
import { upvoteRemedyAction, submitRemedyAction } from '@/app/community/actions';

interface CommunityViewProps {
  initialItems: CommunityKnowledgeRow[];
  currentCrop: string;
  currentRegion: string;
  currentQuery: string;
  currentAgroZone: string;
}

const CROP_FILTER_CHIPS: Array<{ name: string; label: string; icon: string }> = [
  { name: '', label: 'All Crops (ሁሉም)', icon: '🌾' },
  { name: 'Teff', label: 'Teff (ጤፍ)', icon: '🌱' },
  { name: 'Wheat', label: 'Wheat (ስንዴ)', icon: '🌾' },
  { name: 'Maize', label: 'Maize (በቆሎ)', icon: '🌽' },
  { name: 'Coffee', label: 'Coffee (ቡና)', icon: '☕' },
  { name: 'Potato', label: 'Potato (ድንች)', icon: '🥔' },
  { name: 'Barley', label: 'Barley (ገብስ)', icon: '🌾' },
  { name: 'Chickpea', label: 'Chickpea (ሽንብራ)', icon: '🥜' },
  { name: 'Enset', label: 'Enset (እንሰት)', icon: '🌴' },
];

const ETHIOPIAN_REGIONS = [
  'All Regions (ሁሉም ክልሎች)',
  'Oromia',
  'Amhara',
  'Tigray',
  'Sidama',
  'SNNPR',
  'Somali',
  'Benishangul-Gumuz',
];

const AGRO_ZONES = [
  'All Agro-Zones (ሁሉም ቀጠናዎች)',
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

    // Optimistically update
    setUserVotedMap((prev) => ({ ...prev, [id]: true }));
    setVerifiedMap((prev) => ({ ...prev, [id]: (prev[id] ?? currentCount) + 1 }));

    try {
      await upvoteRemedyAction(id);
    } catch {
      // Revert if error
      setUserVotedMap((prev) => ({ ...prev, [id]: false }));
      setVerifiedMap((prev) => ({ ...prev, [id]: currentCount }));
    }
  };

  const handleCopyRecipe = (item: CommunityKnowledgeRow) => {
    const text = `🌿 Root Ethiopian Farmer Solution:
Problem: ${item.problem_title} (${item.crop_type})
Symptoms: ${item.symptoms}
Proven Solution: ${item.proven_solution}
Region: ${item.region} • Agro-Zone: ${item.agro_zone}
Verified by ${item.verified_by_farmers_count} farmers.`;

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
      {/* Header & Share Trigger */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Peer-Verified Solutions ({initialItems.length})
          </h2>
          <p className="text-xs text-slate-400">
            Organic and local farmer remedies verified across Ethiopian agricultural zones
          </p>
        </div>

        <Button
          onClick={() => setIsShareModalOpen(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs h-10 px-4 rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 touch-manipulation"
        >
          <Plus className="w-4 h-4" />
          <span>Share a Proven Remedy • መፍትሄ ያካፍሉ</span>
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
              placeholder="Search symptoms, pests, or organic recipes (e.g. wood ash, rust, armyworm)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950/80 border-slate-800 pl-9 pr-9 text-white placeholder:text-slate-500 text-sm h-11 rounded-xl focus:border-emerald-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Button
            type="submit"
            size="sm"
            className="h-11 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shrink-0 touch-manipulation"
          >
            Search
          </Button>
        </form>

        {/* Crop Filter Chips */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none touch-manipulation">
            {CROP_FILTER_CHIPS.map((chip) => {
              const isSelected = currentCrop.toLowerCase() === chip.name.toLowerCase();
              return (
                <button
                  key={chip.name}
                  type="button"
                  onClick={() => updateFilters({ crop: chip.name })}
                  className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 shrink-0 transition-all touch-manipulation active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span>{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Region & Agro-Zone Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800/60">
          <div>
            <Label className="text-[11px] text-slate-400 mb-1 block">Filter by Region (በክልል):</Label>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                updateFilters({ region: e.target.value });
              }}
              className="w-full h-9 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 px-2.5 focus:border-emerald-500 focus:outline-none"
            >
              {ETHIOPIAN_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-[11px] text-slate-400 mb-1 block">Filter by Agro-Zone (በቀጠና):</Label>
            <select
              value={selectedAgroZone}
              onChange={(e) => {
                setSelectedAgroZone(e.target.value);
                updateFilters({ zone: e.target.value });
              }}
              className="w-full h-9 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 px-2.5 focus:border-emerald-500 focus:outline-none"
            >
              {AGRO_ZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Active Filter Indicator */}
      {(currentQuery || currentCrop || (currentRegion && !currentRegion.startsWith('All')) || (currentAgroZone && !currentAgroZone.startsWith('All'))) && (
        <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/40 px-3 py-2 rounded-xl border border-slate-800">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Showing results for:{' '}
              <strong className="text-white">
                {[currentCrop, currentQuery, currentRegion, currentAgroZone].filter((x) => x && !x.startsWith('All')).join(' • ') || 'All'}
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
            Reset All Filters
          </button>
        </div>
      )}

      {/* Knowledge Cards Grid */}
      {initialItems.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No peer remedies matched this filter</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Be the first farmer to share a tested remedy for this crop or symptom, or ask our 5-agent agronomy council directly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <Button
              onClick={() => setIsShareModalOpen(true)}
              variant="outline"
              className="w-full sm:w-auto border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40 text-xs"
            >
              Share Your Solution
            </Button>
            <Button
              onClick={() => router.push('/diagnose')}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
            >
              Start New Diagnosis
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
                className="bg-slate-900/75 border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between backdrop-blur-sm shadow-xl shadow-slate-950/40"
              >
                <CardHeader className="p-4 sm:p-5 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className="border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-[10px] font-bold">
                        {item.crop_type}
                      </Badge>
                      <Badge variant="outline" className="border-slate-700 bg-slate-950 text-slate-300 text-[10px]">
                        {item.agro_zone || 'Weyna Dega'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full shrink-0 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{currentCount} Farmers Verified</span>
                    </div>
                  </div>

                  <CardTitle className="text-sm sm:text-base font-bold text-white leading-snug">
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
                  <div className="p-3.5 rounded-xl bg-emerald-950/25 border border-emerald-500/30 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Proven Organic Treatment (የተረጋገጠ መፍትሄ)
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
                        className="h-8 px-2 text-slate-400 hover:text-white hover:bg-slate-800 text-[11px] touch-manipulation"
                        title="Copy formula to share with neighbors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[10px] ml-1">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[10px] ml-1">Share</span>
                          </>
                        )}
                      </Button>

                      {/* Upvote Button */}
                      <Button
                        size="sm"
                        variant={hasVoted ? 'default' : 'outline'}
                        onClick={() => handleUpvote(item.id, item.verified_by_farmers_count)}
                        disabled={hasVoted}
                        className={`h-8 px-2.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 touch-manipulation transition-all active:scale-95 ${
                          hasVoted
                            ? 'bg-emerald-600 text-white border-transparent'
                            : 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/50 hover:text-white'
                        }`}
                        title="Confirm you have verified or used this remedy"
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-current' : ''}`} />
                        <span>{hasVoted ? 'Verified ✓' : 'I Verified This'}</span>
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <Card className="w-full max-w-lg bg-slate-900 border-slate-800 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
            <CardHeader className="pb-3 border-b border-slate-800/80 sticky top-0 bg-slate-900 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg font-bold text-white">
                      Share a Proven Remedy
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      የተረጋገጠ የግብርና መፍትሄዎን ለሌሎች አርሶ አደሮች ያካፍሉ
                    </CardDescription>
                  </div>
                </div>

                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4">
              {submitSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h3 className="text-base font-bold text-white">Remedy Shared Successfully!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Thank you! Your organic formula is now added to the peer-verified community knowledge base.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleShareSubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-300">Crop Type (ሰብል):</Label>
                      <select
                        value={newCrop}
                        onChange={(e) => setNewCrop(e.target.value)}
                        className="w-full h-10 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white px-2.5 focus:border-emerald-500"
                      >
                        {CROP_FILTER_CHIPS.filter((c) => c.name).map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-300">Agro-Ecological Zone:</Label>
                      <select
                        value={newZone}
                        onChange={(e) => setNewZone(e.target.value as 'Dega' | 'Weyna Dega' | 'Kolla' | 'Bereha')}
                        className="w-full h-10 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white px-2.5 focus:border-emerald-500"
                      >
                        <option value="Weyna Dega">Weyna Dega (Midland 1500–2400m)</option>
                        <option value="Dega">Dega (Highland &gt;2400m)</option>
                        <option value="Kolla">Kolla (Lowland 500–1500m)</option>
                        <option value="Bereha">Bereha (Arid &lt;500m)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">
                      Problem Title (የበሽታው ወይም የተባዩ ስም):
                    </Label>
                    <Input
                      required
                      placeholder="e.g. Stem borer on Sorghum / የጤፍ ዝገት"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 text-xs sm:text-sm h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">
                      Observed Symptoms (የታዩት ምልክቶች):
                    </Label>
                    <Textarea
                      required
                      rows={2}
                      placeholder="Describe what leaves, stems, or fruits looked like..."
                      value={newSymptoms}
                      onChange={(e) => setNewSymptoms(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 text-xs leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">
                      Proven Solution / Organic Formula (የተሞከረና የሰራ መፍትሄ):
                    </Label>
                    <Textarea
                      required
                      rows={3}
                      placeholder="Detailed preparation steps (e.g. 50g neem seeds, wood ash ratio, timing of application)..."
                      value={newSolution}
                      onChange={(e) => setNewSolution(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 text-xs leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">Region (ክልል):</Label>
                    <select
                      value={newRegion}
                      onChange={(e) => setNewRegion(e.target.value)}
                      className="w-full h-10 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white px-2.5 focus:border-emerald-500"
                    >
                      {ETHIOPIAN_REGIONS.filter((r) => !r.startsWith('All')).map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsShareModalOpen(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-lg flex items-center gap-1.5"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Publish Remedy</span>
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
