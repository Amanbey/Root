/**
 * ROOT – Agricultural Advisory Platform
 * Core Domain TypeScript Type Definitions
 */

export type AgroEcologicalZone = 
  | 'Dega'          // Highland (>2,400m)
  | 'Weyna Dega'    // Midland (1,500m - 2,400m)
  | 'Kolla'         // Lowland (500m - 1,500m)
  | 'Bereha';       // Arid/Desert (<500m)

export type EthiopianRegion =
  | 'Oromia'
  | 'Amhara'
  | 'Tigray'
  | 'Sidama'
  | 'Central Ethiopia'
  | 'South Ethiopia'
  | 'Somali'
  | 'Afar'
  | 'Benishangul-Gumuz'
  | 'Gambela'
  | 'Harari'
  | 'Addis Ababa'
  | 'Dire Dawa';

export type EthiopianCrop =
  | 'Teff'
  | 'Wheat'
  | 'Maize'
  | 'Coffee'
  | 'Barley'
  | 'Sorghum'
  | 'Enset'
  | 'Faba Bean'
  | 'Chickpea'
  | 'Sesame'
  | 'Potato'
  | 'Tomato'
  | 'Onion'
  | 'Other';

export type SupportedLanguage = 'en' | 'am' | 'om';

export interface FarmerProfile {
  id: string;
  email?: string;
  phone?: string;
  full_name: string;
  region: EthiopianRegion;
  zone_name?: string;
  woreda?: string;
  agro_ecological_zone: AgroEcologicalZone;
  main_crops: EthiopianCrop[];
  preferred_language: SupportedLanguage;
  farm_size_hectares?: number;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export type QuestionStatus = 'queued' | 'analyzing' | 'completed' | 'failed';

export interface QuestionSubmission {
  id: string;
  user_id?: string;
  title: string;
  crop_type: EthiopianCrop;
  symptoms_description: string;
  photo_url?: string;
  photo_base64?: string;
  region?: EthiopianRegion;
  agro_zone?: AgroEcologicalZone;
  status: QuestionStatus;
  is_offline_submission?: boolean;
  created_at: string;
}

export type AgentRole = 
  | 'orchestrator'
  | 'diagnostic'
  | 'local_context'
  | 'knowledge'
  | 'advisor'
  | 'critic';

export type StageStatus = 'idle' | 'running' | 'completed' | 'failed';

export interface AgentTimelineStep {
  id: string;
  role: AgentRole;
  title: string;
  agentLabel: string;
  status: StageStatus;
  summary?: string;
  outputPreview?: string;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
}

export interface AgentTimelineStepLog {
  id: string;
  agent_run_id: string;
  agent_role: AgentRole;
  step_title: string;
  status: StageStatus;
  input_preview?: string | null;
  output_payload?: Record<string, unknown> | null;
  started_at: string;
  completed_at?: string | null;
  duration_ms?: number;
}

export interface AgentRunDetails {
  id: string;
  question_id: string;
  model_used: string;
  status: string;
  execution_summary?: string | null;
  total_duration_ms?: number | null;
  created_at: string;
  completed_at?: string | null;
  timeline_steps: AgentTimelineStepLog[];
}

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface AdviceCard {
  id: string;
  question_id: string;
  diagnosis_name: string;
  scientific_name?: string;
  confidence_score: number; // 0 - 100
  urgency: UrgencyLevel;
  primary_crop: EthiopianCrop;
  visual_indicators: string[];
  probable_causes: string[];
  immediate_actions: string[];
  organic_remedies: string[];
  chemical_remedies?: string[];
  preventive_measures: string[];
  local_context_notes: string;
  recommended_season_action?: string;
  helpful_votes: number;
  unhelpful_votes: number;
  user_feedback?: 'helpful' | 'unhelpful' | null;
  agent_summary: string;
  created_at: string;
  synced_online?: boolean;
}

export interface OfflineQueueItem {
  id: string;
  type: 'submit_question' | 'vote_advice' | 'update_profile' | 'register_farmer';
  payload: Record<string, unknown>;
  createdAt: number;
  attempts: number;
  status: 'pending' | 'syncing' | 'failed';
  error?: string;
}
