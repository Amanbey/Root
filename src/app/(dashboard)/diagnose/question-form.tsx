'use client';

import { useState, useRef, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Camera, 
  X, 
  Sprout, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  ArrowRight,
  Bot,
  WifiOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EthiopianCrop, EthiopianRegion, AgroEcologicalZone, FarmerProfile, AdviceCard } from '@/lib/types';
import { submitCropQuestionAction } from '@/app/actions/diagnose';
import { generateOfflineAdviceCard } from '@/lib/offline/offline-expert';
import { saveOfflineQuestion, enqueueOfflineItem, cacheAdviceCardLocally } from '@/lib/offline/db';
import { requestBackgroundSync } from '@/lib/offline/sync-manager';
import { AdviceCardView } from '@/components/advice/advice-card-view';
import { AgentCouncilTimeline, TimelineStepItem } from '@/components/agents/agent-council-timeline';
import { AgentRole } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/language-context';

interface QuestionFormProps {
  initialProfile?: FarmerProfile | null;
}

const CROPS_KEYS: Array<{ name: EthiopianCrop; icon: string }> = [
  { name: 'Teff', icon: '🌱' },
  { name: 'Wheat', icon: '🌾' },
  { name: 'Maize', icon: '🌽' },
  { name: 'Coffee', icon: '☕' },
  { name: 'Barley', icon: '🌾' },
  { name: 'Enset', icon: '🌿' },
  { name: 'Faba Bean', icon: '🫘' },
  { name: 'Potato', icon: '🥔' },
  { name: 'Tomato', icon: '🍅' },
  { name: 'Onion', icon: '🧅' },
];

export function QuestionForm({ initialProfile }: QuestionFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, tCrop, tZone, language } = useLanguage();

  const [selectedCrop, setSelectedCrop] = useState<EthiopianCrop>(
    initialProfile?.main_crops?.[0] || 'Teff'
  );
  const [title, setTitle] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [region, setRegion] = useState<EthiopianRegion>(initialProfile?.region || 'Oromia');
  const [agroZone, setAgroZone] = useState<AgroEcologicalZone>(
    initialProfile?.agro_ecological_zone || 'Weyna Dega'
  );

  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isDeliberating, setIsDeliberating] = useState(false);
  const [activeRole, setActiveRole] = useState<AgentRole>('orchestrator');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [consensusSummary, setConsensusSummary] = useState<string | undefined>(undefined);
  const [deliberationSteps, setDeliberationSteps] = useState<TimelineStepItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [offlineAdviceCard, setOfflineAdviceCard] = useState<AdviceCard | null>(null);
  const [isOfflineDetected, setIsOfflineDetected] = useState<boolean>(false);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsOfflineDetected(!navigator.onLine);
      const onOnline = () => setIsOfflineDetected(false);
      const onOffline = () => setIsOfflineDetected(true);
      window.addEventListener('online', onOnline);
      window.addEventListener('offline', onOffline);
      return () => {
        window.removeEventListener('online', onOnline);
        window.removeEventListener('offline', onOffline);
      };
    }
  }, []);

  const buildInitialSteps = (): TimelineStepItem[] => [
    {
      id: 'step-orchestrator',
      role: 'orchestrator',
      title: t('diag_council_step_init'),
      status: 'running',
    },
    {
      id: 'step-diagnostic',
      role: 'diagnostic',
      title: t('diag_council_step_diagnostic'),
      status: 'idle',
    },
    {
      id: 'step-context',
      role: 'local_context',
      title: t('diag_council_step_context'),
      status: 'idle',
    },
    {
      id: 'step-knowledge',
      role: 'knowledge',
      title: t('diag_council_step_knowledge'),
      status: 'idle',
    },
    {
      id: 'step-advisor',
      role: 'advisor',
      title: t('diag_council_step_advisor'),
      status: 'idle',
    },
  ];

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Image size must be under 8MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoBase64(reader.result as string);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setErrorMessage('Please describe the symptoms observed on your crop');
      return;
    }

    setErrorMessage(null);
    setOfflineAdviceCard(null);
    setIsDeliberating(true);
    setProgressPercent(10);
    setActiveRole('orchestrator');
    setConsensusSummary(undefined);
    setDeliberationSteps(buildInitialSteps());

    const timer1 = setTimeout(() => {
      setActiveRole('diagnostic');
      setProgressPercent(38);
      setDeliberationSteps((prev) =>
        prev.map((s) =>
          s.role === 'orchestrator'
            ? { ...s, status: 'completed', durationMs: 220 }
            : s.role === 'diagnostic'
            ? { ...s, status: 'running' }
            : s
        )
      );
    }, 800);

    const timer2 = setTimeout(() => {
      setActiveRole('local_context');
      setProgressPercent(64);
      setDeliberationSteps((prev) =>
        prev.map((s) =>
          s.role === 'diagnostic'
            ? { ...s, status: 'completed', durationMs: 350 }
            : s.role === 'local_context'
            ? { ...s, status: 'running' }
            : s
        )
      );
    }, 1800);

    const timer3 = setTimeout(() => {
      setActiveRole('knowledge');
      setProgressPercent(82);
      setDeliberationSteps((prev) =>
        prev.map((s) =>
          s.role === 'local_context'
            ? { ...s, status: 'completed', durationMs: 310 }
            : s.role === 'knowledge'
            ? { ...s, status: 'running' }
            : s
        )
      );
    }, 2800);

    const timer4 = setTimeout(() => {
      setActiveRole('advisor');
      setProgressPercent(92);
      setDeliberationSteps((prev) =>
        prev.map((s) =>
          s.role === 'knowledge'
            ? { ...s, status: 'completed', durationMs: 290 }
            : s.role === 'advisor'
            ? { ...s, status: 'running' }
            : s
        )
      );
    }, 3800);

    const handleOfflineExecution = async () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);

      try {
        const card = generateOfflineAdviceCard({
          cropType: selectedCrop,
          symptoms: symptoms.trim(),
          region,
          agroZone,
          preferredLanguage: language,
        });

        const tempId = card.question_id;

        await saveOfflineQuestion(
          {
            id: tempId,
            title: title.trim() || `${selectedCrop} Issue`,
            crop_type: selectedCrop,
            symptoms_description: symptoms.trim(),
            region,
            agro_zone: agroZone,
            status: 'queued',
            is_offline_submission: true,
            created_at: new Date().toISOString(),
          },
          card
        );

        await enqueueOfflineItem({
          id: tempId,
          type: 'submit_question',
          payload: {
            title: title.trim() || `${selectedCrop} Disease Issue`,
            cropType: selectedCrop,
            symptoms: symptoms.trim(),
            photoBase64,
            region,
            agroZone,
            preferredLanguage: language,
          },
          createdAt: Date.now(),
          attempts: 0,
          status: 'pending',
        });

        await cacheAdviceCardLocally(card);
        await requestBackgroundSync();

        setProgressPercent(100);
        setConsensusSummary(t('status_cached_ready'));
        setDeliberationSteps((prev) =>
          prev.map((s) => ({ ...s, status: 'completed', durationMs: s.durationMs || 250 }))
        );
        setOfflineAdviceCard(card);
      } catch (offlineErr: unknown) {
        setIsDeliberating(false);
        const errStr = offlineErr instanceof Error ? offlineErr.message : 'Offline diagnosis failed';
        setErrorMessage(errStr);
      }
    };

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      handleOfflineExecution();
      return;
    }

    startTransition(async () => {
      try {
        const result = await submitCropQuestionAction({
          title: title.trim() || `${selectedCrop} Disease Issue`,
          cropType: selectedCrop,
          symptoms: symptoms.trim(),
          photoBase64,
          region,
          agroZone,
          preferredLanguage: language,
        });

        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);

        if (result.success && result.questionId) {
          setProgressPercent(100);
          setConsensusSummary(t('diag_council_finished'));
          setDeliberationSteps((prev) =>
            prev.map((s) => ({ ...s, status: 'completed', durationMs: s.durationMs || 300 }))
          );

          setTimeout(() => {
            router.push(`/diagnose/${result.questionId}`);
          }, 1100);
        } else {
          await handleOfflineExecution();
        }
      } catch {
        await handleOfflineExecution();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Live Multi-Agent Council Timeline Modal */}
      {isDeliberating && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-2xl shadow-emerald-950/70 backdrop-blur-xl animate-in fade-in duration-300 space-y-4">
          <AgentCouncilTimeline
            steps={deliberationSteps}
            isLive={progressPercent < 100}
            activeRole={activeRole}
            progressPercent={progressPercent}
            executionSummary={consensusSummary}
          />
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. Crop Selection */}
      <Card className="bg-slate-900/70 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>{t('diag_field_crop')}</span>
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            {t('diag_field_crop_placeholder')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
            {CROPS_KEYS.map((crop) => {
              const isSelected = selectedCrop === crop.name;
              return (
                <button
                  key={crop.name}
                  type="button"
                  onClick={() => setSelectedCrop(crop.name)}
                  className={`p-2 sm:p-2.5 min-h-[72px] sm:min-h-[78px] rounded-xl border text-xs flex flex-col items-center justify-center text-center gap-1 touch-manipulation active:scale-95 transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xl sm:text-2xl">{crop.icon}</span>
                  <span className="text-[11px] leading-tight font-medium text-center line-clamp-2 px-0.5">
                    {tCrop(crop.name)}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 2. Photo Upload */}
      <Card className="bg-slate-900/70 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>{t('diag_field_photo')}</span>
            </div>
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            {t('diag_field_photo_hint')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            capture="environment"
            onChange={handlePhotoSelect}
            className="hidden"
            id="crop-photo-input"
          />

          {photoBase64 ? (
            <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 max-h-64 bg-slate-950 flex items-center justify-center group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoBase64}
                alt="Selected crop symptom preview"
                className="max-h-64 w-full object-contain"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 text-white hover:bg-red-600 transition-colors shadow-lg"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40 hover:bg-slate-950/80 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-white">
                {t('diag_field_photo_hint')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Symptom Description */}
      <Card className="bg-slate-900/70 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{t('diag_field_symptoms')}</span>
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            {t('diag_subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold text-slate-300">
              {t('diag_field_title')}
            </Label>
            <Input
              id="title"
              type="text"
              placeholder={t('diag_field_title_placeholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-500 text-xs h-9 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="q-region" className="text-xs font-semibold text-slate-300">
                {t('diag_field_region')}
              </Label>
              <select
                id="q-region"
                value={region}
                onChange={(e) => setRegion(e.target.value as EthiopianRegion)}
                className="w-full h-11 sm:h-9 px-3 rounded-md bg-slate-950/70 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Oromia">Oromia</option>
                <option value="Amhara">Amhara</option>
                <option value="Tigray">Tigray</option>
                <option value="Sidama">Sidama</option>
                <option value="Central Ethiopia">Central Ethiopia</option>
                <option value="South Ethiopia">South Ethiopia</option>
                <option value="Somali">Somali</option>
                <option value="Benishangul-Gumuz">Benishangul-Gumuz</option>
                <option value="Afar">Afar</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="q-agroZone" className="text-xs font-semibold text-slate-300">
                {t('diag_field_zone')}
              </Label>
              <select
                id="q-agroZone"
                value={agroZone}
                onChange={(e) => setAgroZone(e.target.value as AgroEcologicalZone)}
                className="w-full h-11 sm:h-9 px-3 rounded-md bg-slate-950/70 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Weyna Dega">{tZone('Weyna Dega')}</option>
                <option value="Dega">{tZone('Dega')}</option>
                <option value="Kolla">{tZone('Kolla')}</option>
                <option value="Bereha">{tZone('Bereha')}</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="symptoms" className="text-xs font-semibold text-slate-300">
              {t('diag_field_symptoms')}
            </Label>
            <Textarea
              id="symptoms"
              rows={4}
              required
              placeholder={t('diag_field_symptoms_placeholder')}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-500 text-xs focus:border-emerald-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Generated Offline Advice Card Display */}
      {offlineAdviceCard && (
        <div className="space-y-4 pt-4 border-t border-slate-800 animate-in fade-in duration-300">
          <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>{t('status_cached_ready')}</strong>
              </span>
            </div>
            <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] shrink-0">
              {t('status_queued_local')}
            </Badge>
          </div>

          <AdviceCardView card={offlineAdviceCard} farmerName={initialProfile?.full_name} />
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending || (isDeliberating && progressPercent < 100)}
        className="w-full min-h-[48px] sm:min-h-[50px] py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all touch-manipulation"
      >
        {isPending || (isDeliberating && progressPercent < 100) ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin shrink-0" />
            <span className="truncate">{t('diag_btn_submitting')}</span>
          </>
        ) : isOfflineDetected ? (
          <>
            <WifiOff className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="truncate">{t('status_offline_banner')}</span>
          </>
        ) : (
          <>
            <Bot className="w-5 h-5 shrink-0" />
            <span className="truncate">{t('diag_btn_submit')}</span>
            <ArrowRight className="w-4 h-4 ml-1 shrink-0 hidden sm:inline" />
          </>
        )}
      </Button>
    </form>
  );
}
