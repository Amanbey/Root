/**
 * ROOT – MULTI-AGENT COUNCIL TYPES & INTERFACES
 * Defines contracts for the 5-agent agricultural council
 */

import { 
  EthiopianCrop, 
  EthiopianRegion, 
  AgroEcologicalZone, 
  UrgencyLevel, 
  AdviceCard,
  AgentRole,
  StageStatus
} from '@/lib/types';
import { Database } from '@/lib/supabase/database.types';

export interface CouncilContextInput {
  questionId: string;
  userId?: string | null;
  cropType: EthiopianCrop;
  symptoms: string;
  photoUrl?: string | null;
  region?: EthiopianRegion;
  agroZone?: AgroEcologicalZone;
}

export interface DiagnosticAgentOutput {
  diagnosisName: string;
  scientificName?: string;
  confidenceScore: number;
  urgency: UrgencyLevel;
  visualIndicators: string[];
  probableCauses: string[];
  preliminaryActions: string[];
  reasoning: string;
  engineUsed: 'ollama' | 'offline_expert';
  modelUsed: string;
}

export interface LocalContextAgentOutput {
  agroZone: AgroEcologicalZone;
  seasonRecommendation: string;
  altitudeRange: string;
  soilFactors: string[];
  localizedRemedies: string[];
  culturalPractices: string[];
  contextNotes: string;
}

export interface PeerVerifiedRemedy {
  id: string;
  title: string;
  solution: string;
  verifiedCount: number;
  region: string;
  agroZone: string;
}

export interface CommunityKnowledgeAgentOutput {
  matchesFound: number;
  verifiedRemedies: PeerVerifiedRemedy[];
  farmerWisdomSummary: string;
}

export type AdviceCardInsertPayload = Omit<
  Database['public']['Tables']['advice_cards']['Insert'],
  'id' | 'created_at'
>;

export interface CouncilStepEvent {
  stepId: string;
  role: AgentRole;
  title: string;
  status: StageStatus;
  progressPercent: number;
  summary?: string;
  preview?: string;
  outputPayload?: Record<string, unknown>;
  durationMs?: number;
  timestamp: string;
}

export interface CouncilDeliberationResult {
  runId: string;
  questionId: string;
  adviceCard: AdviceCard;
  diagnosticOutput: DiagnosticAgentOutput;
  localContextOutput: LocalContextAgentOutput;
  communityKnowledgeOutput: CommunityKnowledgeAgentOutput;
  totalDurationMs: number;
  executionSummary: string;
}
