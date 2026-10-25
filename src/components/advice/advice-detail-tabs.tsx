'use client';

import { useState } from 'react';
import { AdviceCard, AgentRunDetails } from '@/lib/types';
import { AdviceCardView } from '@/components/advice/advice-card-view';
import { AgentCouncilTimeline, TimelineStepItem } from '@/components/agents/agent-council-timeline';
import { Award, Bot } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

interface AdviceDetailTabsProps {
  card: AdviceCard;
  farmerName?: string | null;
  agentRun?: AgentRunDetails | null;
}

export function AdviceDetailTabs({ card, farmerName, agentRun }: AdviceDetailTabsProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'card' | 'timeline'>('card');

  const timelineSteps: TimelineStepItem[] = (agentRun?.timeline_steps || []).map((s) => ({
    id: s.id,
    role: s.agent_role,
    title: s.step_title,
    status: s.status,
    inputPreview: s.input_preview,
    outputPayload: s.output_payload,
    durationMs: s.duration_ms,
    completedAt: s.completed_at,
  }));

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg shadow-slate-950/50 max-w-md mx-auto w-full">
        <button
          type="button"
          onClick={() => setActiveTab('card')}
          className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all touch-manipulation min-h-[40px] ${
            activeTab === 'card'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-400/60 shadow-[0_0_20px_-3px_rgba(16,185,129,0.5)] ring-1 ring-emerald-400/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60 hover:border hover:border-slate-700'
          }`}
        >
          <Award className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{t('action_view_advice')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all touch-manipulation min-h-[40px] ${
            activeTab === 'timeline'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-400/60 shadow-[0_0_20px_-3px_rgba(16,185,129,0.5)] ring-1 ring-emerald-400/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60 hover:border hover:border-slate-700'
          }`}
        >
          <Bot className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{t('home_council_title')}</span>
          {timelineSteps.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-950 border border-emerald-500/40 text-emerald-300 shrink-0">
              {timelineSteps.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'card' ? (
        <div className="animate-in fade-in duration-200">
          <AdviceCardView card={card} farmerName={farmerName || undefined} />
        </div>
      ) : (
        <div className="animate-in fade-in duration-200">
          <AgentCouncilTimeline
            steps={timelineSteps}
            isLive={false}
            modelUsed={agentRun?.model_used || 'llama3.1:8b'}
            executionSummary={agentRun?.execution_summary}
          />
        </div>
      )}
    </div>
  );
}
