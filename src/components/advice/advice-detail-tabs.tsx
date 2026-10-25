'use client';

import { useState } from 'react';
import { AdviceCard, AgentRunDetails } from '@/lib/types';
import { AdviceCardView } from '@/components/advice/advice-card-view';
import { AgentCouncilTimeline, TimelineStepItem } from '@/components/agents/agent-council-timeline';
import { Award, Bot } from 'lucide-react';

interface AdviceDetailTabsProps {
  card: AdviceCard;
  farmerName?: string | null;
  agentRun?: AgentRunDetails | null;
}

export function AdviceDetailTabs({ card, farmerName, agentRun }: AdviceDetailTabsProps) {
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
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('card')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'card'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Advice Card (ምክረ ሐሳብ)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'timeline'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>5-Agent Deliberation</span>
          {timelineSteps.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-950 border border-emerald-500/40 text-emerald-300">
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
