'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  Cpu, 
  Compass, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Loader2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { AgentRole, StageStatus } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n/language-context';
import { TranslationKey } from '@/lib/i18n/translations';

export interface TimelineStepItem {
  id: string;
  role: AgentRole;
  title: string;
  status: StageStatus;
  summary?: string | null;
  inputPreview?: string | null;
  outputPayload?: Record<string, unknown> | null;
  durationMs?: number | null;
  completedAt?: string | null;
}

interface AgentCouncilTimelineProps {
  steps: TimelineStepItem[];
  isLive?: boolean;
  activeRole?: AgentRole;
  progressPercent?: number;
  modelUsed?: string;
  executionSummary?: string | null;
}

interface AgentMetadata {
  labelKey: TranslationKey;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
}

const AGENTS_META: Record<AgentRole, AgentMetadata> = {
  orchestrator: {
    labelKey: 'timeline_agent_orchestrator',
    description: 'Manages multi-agent dispatch, parameter validation, and council timeline synchronization.',
    icon: Cpu,
    accentColor: 'text-sky-400 border-sky-500/30 bg-sky-950/40',
    badgeBg: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  },
  diagnostic: {
    labelKey: 'timeline_agent_diagnostic',
    description: 'Analyzes leaf lesions, spore morphology, chlorosis, and insect damage patterns.',
    icon: Bot,
    accentColor: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  },
  local_context: {
    labelKey: 'timeline_agent_context',
    description: 'Adapts diagnoses to Ethiopian agro-ecological zones (Dega, Weyna Dega, Kolla) & Belg/Meher seasons.',
    icon: Compass,
    accentColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  },
  knowledge: {
    labelKey: 'timeline_agent_knowledge',
    description: 'Searches peer-verified remedies tested and upvoted by neighboring Ethiopian smallholders.',
    icon: BookOpen,
    accentColor: 'text-purple-400 border-purple-500/30 bg-purple-950/40',
    badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  },
  advisor: {
    labelKey: 'timeline_agent_advisor',
    description: 'Synthesizes council findings into an actionable, low-literacy structured Advice Card.',
    icon: Award,
    accentColor: 'text-teal-400 border-teal-500/30 bg-teal-950/40',
    badgeBg: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
  },
  critic: {
    labelKey: 'timeline_agent_critic',
    description: 'Validates treatment safety and ensures non-toxic organic remedies are prioritized.',
    icon: ShieldAlert,
    accentColor: 'text-rose-400 border-rose-500/30 bg-rose-950/40',
    badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  },
};

export function AgentCouncilTimeline({
  steps,
  isLive = false,
  activeRole,
  progressPercent = 100,
  modelUsed = 'llama3.1:8b',
  executionSummary,
}: AgentCouncilTimelineProps) {
  const { t } = useLanguage();
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedStepId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/40">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                {t('timeline_council_title')}
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              {t('timeline_council_sub')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Badge variant="outline" className="border-slate-700 bg-slate-950/70 text-slate-300 text-[10px]">
            Model: {modelUsed}
          </Badge>
          {isLive ? (
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] animate-pulse">
              ● Deliberating Live
            </Badge>
          ) : (
            <Badge className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
              ✓ Deliberation Complete
            </Badge>
          )}
        </div>
      </div>

      {/* Live Progress Bar (if live or active) */}
      {isLive && (
        <div className="space-y-1.5 px-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Council Deliberation in Progress...</span>
            </span>
            <span className="text-slate-300 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-500 ease-out shadow-sm shadow-emerald-500/50"
              style={{ width: `${Math.max(5, Math.min(100, progressPercent))}%` }}
            />
          </div>
        </div>
      )}

      {/* Timeline Steps Stack */}
      <div className="relative pl-7 sm:pl-8 space-y-3 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500/60 before:via-teal-500/30 before:to-slate-800">
        {steps.map((step, idx) => {
          const meta = AGENTS_META[step.role] || AGENTS_META['orchestrator'];
          const Icon = meta.icon;
          const isCurrent = isLive && (activeRole === step.role || step.status === 'running');
          const isDone = step.status === 'completed';
          const isExpanded = expandedStepId === step.id;

          return (
            <div key={step.id || idx} className="relative group">
              {/* Timeline Node Icon Indicator */}
              <div
                className={`absolute -left-7 sm:-left-8 top-3.5 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-950/60 ring-2 ring-emerald-500/20'
                    : isCurrent
                    ? 'bg-amber-950 border-amber-400 text-amber-300 shadow-md shadow-amber-950/60 animate-pulse ring-4 ring-amber-500/20'
                    : 'bg-slate-950 border-slate-700 text-slate-500'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
              </div>

              {/* Step Card Body */}
              <Card
                className={`border transition-all duration-200 backdrop-blur-sm ${
                  isCurrent
                    ? 'border-emerald-500/50 bg-slate-900/90 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/20'
                    : isDone
                    ? 'border-slate-800/90 bg-slate-900/60 hover:border-slate-700'
                    : 'border-slate-900 bg-slate-950/40 opacity-70'
                }`}
              >
                <CardContent className="p-3 sm:p-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg border text-xs font-semibold shrink-0 ${meta.accentColor}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-white tracking-wide">
                            {t(meta.labelKey)}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug">
                          {step.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-1 sm:pt-0 border-t border-slate-800/50 sm:border-t-0">
                      {step.durationMs !== undefined && step.durationMs !== null && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {step.durationMs}ms
                        </span>
                      )}

                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-mono ${
                          isDone
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                            : isCurrent
                            ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 animate-pulse'
                            : 'border-slate-800 bg-slate-950 text-slate-500'
                        }`}
                      >
                        {step.status}
                      </Badge>

                      {(step.inputPreview || step.outputPayload) && (
                        <button
                          type="button"
                          onClick={() => toggleExpand(step.id)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                          title="Toggle details"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Summary preview if present */}
                  {step.summary && (
                    <p className="text-xs text-slate-300 font-medium pl-3 sm:pl-4 border-l-2 border-emerald-500/50 leading-relaxed">
                      {step.summary}
                    </p>
                  )}

                  {/* Expandable details panel */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                      {step.inputPreview && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                            Agent Input Context:
                          </span>
                          <div className="p-2 rounded bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap">
                            {step.inputPreview}
                          </div>
                        </div>
                      )}

                      {step.outputPayload && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                            Deliberation Output Payload:
                          </span>
                          <pre className="p-2.5 rounded bg-slate-950/90 border border-slate-800 font-mono text-[10px] text-emerald-300 overflow-x-auto max-h-48">
                            {JSON.stringify(step.outputPayload, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Execution Summary Footer Banner */}
      {executionSummary && (
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/20 flex items-start gap-3 text-xs text-slate-300">
          <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white text-[11px] uppercase tracking-wider block">
              Council Consensus Verdict
            </span>
            <p className="leading-relaxed text-slate-300">
              {executionSummary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
