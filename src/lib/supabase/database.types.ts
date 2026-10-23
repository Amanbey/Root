/**
 * ROOT – SUPABASE DATABASE TYPE DEFINITIONS
 * Auto-generated and maintained schema types for PostgreSQL + pgvector
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AgroEcologicalZoneEnum = 'Dega' | 'Weyna Dega' | 'Kolla' | 'Bereha';
export type AdviceUrgencyEnum = 'low' | 'medium' | 'high' | 'critical';
export type QuestionStatusEnum = 'queued' | 'analyzing' | 'completed' | 'failed';

export interface Database {
  public: {
    Tables: {
      farmer_profiles: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          full_name: string;
          region: string;
          zone_name: string | null;
          woreda: string | null;
          agro_ecological_zone: AgroEcologicalZoneEnum;
          main_crops: string[];
          preferred_language: string;
          farm_size_hectares: number | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          phone?: string | null;
          full_name: string;
          region?: string;
          zone_name?: string | null;
          woreda?: string | null;
          agro_ecological_zone?: AgroEcologicalZoneEnum;
          main_crops?: string[];
          preferred_language?: string;
          farm_size_hectares?: number | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          full_name?: string;
          region?: string;
          zone_name?: string | null;
          woreda?: string | null;
          agro_ecological_zone?: AgroEcologicalZoneEnum;
          main_crops?: string[];
          preferred_language?: string;
          farm_size_hectares?: number | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          crop_type: string;
          symptoms_description: string;
          photo_url: string | null;
          region: string | null;
          agro_zone: AgroEcologicalZoneEnum | null;
          status: QuestionStatusEnum;
          is_offline_submission: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          crop_type: string;
          symptoms_description: string;
          photo_url?: string | null;
          region?: string | null;
          agro_zone?: AgroEcologicalZoneEnum | null;
          status?: QuestionStatusEnum;
          is_offline_submission?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          crop_type?: string;
          symptoms_description?: string;
          photo_url?: string | null;
          region?: string | null;
          agro_zone?: AgroEcologicalZoneEnum | null;
          status?: QuestionStatusEnum;
          is_offline_submission?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      agent_runs: {
        Row: {
          id: string;
          question_id: string;
          model_used: string;
          status: string;
          execution_summary: string | null;
          total_duration_ms: number | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          question_id: string;
          model_used?: string;
          status?: string;
          execution_summary?: string | null;
          total_duration_ms?: number | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          question_id?: string;
          model_used?: string;
          status?: string;
          execution_summary?: string | null;
          total_duration_ms?: number | null;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      agent_timeline_logs: {
        Row: {
          id: string;
          agent_run_id: string;
          agent_role: string;
          step_title: string;
          status: string;
          input_preview: string | null;
          output_payload: Json | null;
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          agent_run_id: string;
          agent_role: string;
          step_title: string;
          status?: string;
          input_preview?: string | null;
          output_payload?: Json | null;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          agent_run_id?: string;
          agent_role?: string;
          step_title?: string;
          status?: string;
          input_preview?: string | null;
          output_payload?: Json | null;
          started_at?: string;
          completed_at?: string | null;
        };
      };
      advice_cards: {
        Row: {
          id: string;
          question_id: string;
          agent_run_id: string | null;
          diagnosis_name: string;
          scientific_name: string | null;
          confidence_score: number;
          urgency: AdviceUrgencyEnum;
          primary_crop: string;
          visual_indicators: string[];
          probable_causes: string[];
          immediate_actions: string[];
          organic_remedies: string[];
          chemical_remedies: string[];
          preventive_measures: string[];
          local_context_notes: string | null;
          recommended_season_action: string | null;
          helpful_votes: number;
          unhelpful_votes: number;
          agent_summary: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          agent_run_id?: string | null;
          diagnosis_name: string;
          scientific_name?: string | null;
          confidence_score: number;
          urgency?: AdviceUrgencyEnum;
          primary_crop: string;
          visual_indicators?: string[];
          probable_causes?: string[];
          immediate_actions?: string[];
          organic_remedies?: string[];
          chemical_remedies?: string[];
          preventive_measures?: string[];
          local_context_notes?: string | null;
          recommended_season_action?: string | null;
          helpful_votes?: number;
          unhelpful_votes?: number;
          agent_summary: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          agent_run_id?: string | null;
          diagnosis_name?: string;
          scientific_name?: string | null;
          confidence_score?: number;
          urgency?: AdviceUrgencyEnum;
          primary_crop?: string;
          visual_indicators?: string[];
          probable_causes?: string[];
          immediate_actions?: string[];
          organic_remedies?: string[];
          chemical_remedies?: string[];
          preventive_measures?: string[];
          local_context_notes?: string | null;
          recommended_season_action?: string | null;
          helpful_votes?: number;
          unhelpful_votes?: number;
          agent_summary?: string;
          created_at?: string;
        };
      };
      community_knowledge: {
        Row: {
          id: string;
          source_advice_card_id: string | null;
          crop_type: string;
          problem_title: string;
          symptoms: string;
          proven_solution: string;
          region: string;
          agro_zone: AgroEcologicalZoneEnum;
          verified_by_farmers_count: number;
          embedding: number[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          source_advice_card_id?: string | null;
          crop_type: string;
          problem_title: string;
          symptoms: string;
          proven_solution: string;
          region: string;
          agro_zone?: AgroEcologicalZoneEnum;
          verified_by_farmers_count?: number;
          embedding?: number[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          source_advice_card_id?: string | null;
          crop_type?: string;
          problem_title?: string;
          symptoms?: string;
          proven_solution?: string;
          region?: string;
          agro_zone?: AgroEcologicalZoneEnum;
          verified_by_farmers_count?: number;
          embedding?: number[] | null;
          created_at?: string;
        };
      };
      advice_feedback: {
        Row: {
          id: string;
          advice_card_id: string;
          user_id: string | null;
          vote: 'helpful' | 'unhelpful';
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          advice_card_id: string;
          user_id?: string | null;
          vote: 'helpful' | 'unhelpful';
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          advice_card_id?: string;
          user_id?: string | null;
          vote?: 'helpful' | 'unhelpful';
          comment?: string | null;
          created_at?: string;
        };
      };
    };
    Functions: {
      match_community_knowledge: {
        Args: {
          query_embedding: number[];
          match_threshold?: number;
          match_count?: number;
          filter_crop?: string | null;
          filter_region?: string | null;
        };
        Returns: {
          id: string;
          crop_type: string;
          problem_title: string;
          symptoms: string;
          proven_solution: string;
          region: string;
          agro_zone: AgroEcologicalZoneEnum;
          verified_by_farmers_count: number;
          similarity: number;
        }[];
      };
    };
  };
}
