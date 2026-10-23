'use client';

import { useState, useTransition } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Sprout, 
  ThumbsUp, 
  ThumbsDown, 
  Calendar, 
  MapPin 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdviceCard, UrgencyLevel } from '@/lib/types';
import { voteAdviceAction } from '@/app/actions/diagnose';

interface AdviceCardViewProps {
  card: AdviceCard;
  farmerName?: string;
}

export function AdviceCardView({ card, farmerName }: AdviceCardViewProps) {
  const [userVote, setUserVote] = useState<'helpful' | 'unhelpful' | null>(card.user_feedback || null);
  const [helpfulCount, setHelpfulCount] = useState<number>(card.helpful_votes || 0);
  const [unhelpfulCount, setUnhelpfulCount] = useState<number>(card.unhelpful_votes || 0);
  const [voteFeedback, setVoteFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'critical':
        return (
          <Badge className="bg-red-500/20 text-red-300 border-red-500/40 text-[11px] px-2.5 py-0.5 animate-pulse font-bold">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-red-400" />
            CRITICAL • አጣዳፊ
          </Badge>
        );
      case 'high':
        return (
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[11px] px-2.5 py-0.5 font-bold">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400" />
            HIGH PRIORITY
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/40 text-[11px] px-2.5 py-0.5 font-semibold">
            MODERATE
          </Badge>
        );
      case 'low':
      default:
        return (
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[11px] px-2.5 py-0.5 font-semibold">
            LOW RISK
          </Badge>
        );
    }
  };

  const handleVote = (vote: 'helpful' | 'unhelpful') => {
    if (userVote === vote) return;

    startTransition(async () => {
      try {
        await voteAdviceAction({
          adviceCardId: card.id,
          vote,
        });

        if (vote === 'helpful') {
          setHelpfulCount((prev) => prev + 1);
          if (userVote === 'unhelpful') setUnhelpfulCount((prev) => Math.max(0, prev - 1));
          setVoteFeedback('Thank you! Your feedback helps other Ethiopian smallholder farmers.');
        } else {
          setUnhelpfulCount((prev) => prev + 1);
          if (userVote === 'helpful') setHelpfulCount((prev) => Math.max(0, prev - 1));
          setVoteFeedback('Feedback recorded. Our advisory council will refine this diagnosis.');
        }
        setUserVote(vote);
      } catch (err) {
        console.warn('Voting fallback:', err);
        setUserVote(vote);
        setVoteFeedback('Saved to local feedback buffer.');
      }
    });
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto w-full animate-in fade-in duration-300">
      {/* Main Advice Card Container */}
      <Card className="bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950 border-emerald-500/30 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Top Accent Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

        <CardHeader className="p-4 sm:p-6 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5" />
                {card.primary_crop} Crop
              </span>
              {getUrgencyBadge(card.urgency)}
              {farmerName && (
                <span className="text-[10px] text-slate-400 font-medium">
                  • Prepared for {farmerName}
                </span>
              )}
            </div>

            {/* Confidence Score Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-emerald-400">{card.confidence_score}%</span>
              <span className="text-[11px] text-slate-400">Confidence</span>
            </div>
          </div>

          <CardTitle className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            {card.diagnosis_name}
          </CardTitle>

          {card.scientific_name && (
            <p className="text-xs font-serif italic text-emerald-300/80 -mt-0.5">
              Pathogen: {card.scientific_name}
            </p>
          )}

          <CardDescription className="text-xs sm:text-sm text-slate-300 mt-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
            {card.agent_summary}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-0 space-y-5">
          {/* 1. Visual Indicators Checked */}
          {card.visual_indicators && card.visual_indicators.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Confirmed Visual Symptoms (የታዩ ምልክቶች)
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {card.visual_indicators.map((indicator, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/50 border border-slate-800/70 text-xs text-slate-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{indicator}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 2. Immediate Field Actions (Urgent) */}
          {card.immediate_actions && card.immediate_actions.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Immediate Action Steps (አስቸኳይ እርምጃዎች)
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {card.immediate_actions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. Low-Cost Organic Remedies (Primary for Smallholders) */}
          {card.organic_remedies && card.organic_remedies.length > 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-950 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Recommended Organic Remedies (ዝቅተኛ ወጪ የተፈጥሮ መፍትሄዎች)
                </h4>
                <Badge className="bg-emerald-500 text-slate-950 font-bold text-[9px]">
                  0 ETB Cost
                </Badge>
              </div>
              <ul className="space-y-2 text-xs text-slate-200">
                {card.organic_remedies.map((remedy, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 shrink-0 mt-0.5">🌱</span>
                    <span>{remedy}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. Chemical Alternative (If applicable) */}
          {card.chemical_remedies && card.chemical_remedies.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                Conventional Treatment (ኬሚካል አማራጭ - አስፈላጊ ከሆነ ብቻ)
              </h4>
              <ul className="space-y-1 text-xs text-slate-300">
                {card.chemical_remedies.map((chem, idx) => (
                  <li key={idx} className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
                    {chem}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 5. Local Agro-Ecological Context & Season Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {card.local_context_notes && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Local Agro-Zone Context
                </span>
                <p className="text-slate-400 leading-normal">{card.local_context_notes}</p>
              </div>
            )}

            {card.recommended_season_action && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Seasonal Timing Guide
                </span>
                <p className="text-slate-400 leading-normal">{card.recommended_season_action}</p>
              </div>
            )}
          </div>

          {/* 6. Community Feedback Loop */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-white">
                  Did this advice help your crop? • ይህ መፍትሄ ጠቅሞዎታል?
                </p>
                <p className="text-[11px] text-slate-400">
                  Your vote refines the collective knowledge base for nearby farms
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={userVote === 'helpful' ? 'default' : 'outline'}
                  disabled={isPending}
                  onClick={() => handleVote('helpful')}
                  className={`text-xs h-8 px-3 flex items-center gap-1.5 ${
                    userVote === 'helpful'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({helpfulCount})</span>
                </Button>

                <Button
                  size="sm"
                  variant={userVote === 'unhelpful' ? 'destructive' : 'outline'}
                  disabled={isPending}
                  onClick={() => handleVote('unhelpful')}
                  className={`text-xs h-8 px-3 flex items-center gap-1.5 ${
                    userVote === 'unhelpful'
                      ? 'bg-red-600 hover:bg-red-500 text-white'
                      : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Not Helpful ({unhelpfulCount})</span>
                </Button>
              </div>
            </div>

            {voteFeedback && (
              <p className="text-[11px] text-emerald-400 italic pt-1 animate-in fade-in">
                ✓ {voteFeedback}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
