/**
 * ROOT – SUPABASE DATABASE QUERY HELPERS
 * Type-safe abstraction layer for questions, agent runs, advice cards & community knowledge.
 * Uses 100% real Supabase database operations with zero mock data.
 */

import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { Database, Json } from '@/lib/supabase/database.types';
import { AdviceCard, EthiopianCrop, EthiopianRegion, AgroEcologicalZone, AgentRunDetails, AgentTimelineStepLog, AgentRole, StageStatus } from '@/lib/types';

export type QuestionRow = Database['public']['Tables']['questions']['Row'];
export type AdviceCardRow = Database['public']['Tables']['advice_cards']['Row'];
export type CommunityKnowledgeRow = Database['public']['Tables']['community_knowledge']['Row'];

/**
 * 1. CREATE A NEW QUESTION (Real Database)
 */
export async function createQuestion(params: {
  userId?: string | null;
  title: string;
  cropType: EthiopianCrop;
  symptomsDescription: string;
  photoUrl?: string | null;
  region?: EthiopianRegion;
  agroZone?: AgroEcologicalZone;
  isOffline?: boolean;
}): Promise<QuestionRow> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from('questions')
    .insert({
      user_id: params.userId || null,
      title: params.title,
      crop_type: params.cropType,
      symptoms_description: params.symptomsDescription,
      photo_url: params.photoUrl || null,
      region: params.region || 'Oromia',
      agro_zone: params.agroZone || 'Weyna Dega',
      status: 'queued',
      is_offline_submission: !!params.isOffline,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to create question in database: ${error?.message || 'Unknown database error'}`);
  }

  return data;
}

/**
 * 2. GET QUESTION BY ID (Real Database)
 */
export async function getQuestionById(questionId: string): Promise<QuestionRow | null> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', questionId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * 3. RECORD MULTI-AGENT RUN (Real Database)
 */
export async function createAgentRun(questionId: string, modelUsed = 'llama3.1:8b') {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from('agent_runs')
    .insert({
      question_id: questionId,
      model_used: modelUsed,
      status: 'running',
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to initialize agent run in database: ${error?.message || 'Unknown error'}`);
  }

  return data;
}

/**
 * 4. LOG AGENT TIMELINE STEP (Real Database)
 */
export async function logAgentTimelineStep(params: {
  agentRunId: string;
  agentRole: string;
  stepTitle: string;
  status: 'running' | 'completed' | 'failed';
  inputPreview?: string;
  outputPayload?: Record<string, unknown>;
}) {
  const supabase = await createServerSupabase();

  const { error } = await supabase.from('agent_timeline_logs').insert({
    agent_run_id: params.agentRunId,
    agent_role: params.agentRole,
    step_title: params.stepTitle,
    status: params.status,
    input_preview: params.inputPreview || null,
    output_payload: (params.outputPayload as unknown as Json) || null,
    completed_at: params.status !== 'running' ? new Date().toISOString() : null,
  });

  if (error) {
    console.error('Failed to log agent timeline step:', error.message);
  }
}

/**
 * 4b. UPDATE AGENT RUN STATUS & SUMMARY (Real Database)
 */
export async function updateAgentRun(params: {
  id: string;
  status: 'running' | 'completed' | 'failed';
  executionSummary?: string | null;
  totalDurationMs?: number | null;
}) {
  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from('agent_runs')
    .update({
      status: params.status,
      execution_summary: params.executionSummary || null,
      total_duration_ms: params.totalDurationMs || null,
      completed_at: params.status !== 'running' ? new Date().toISOString() : null,
    })
    .eq('id', params.id);

  if (error) {
    console.error('Failed to update agent run:', error.message);
  }
}

/**
 * 4c. GET AGENT RUN WITH TIMELINE LOGS (Real Database)
 */
export async function getAgentRunWithTimeline(questionId: string): Promise<AgentRunDetails | null> {
  const supabase = await createServerSupabase();

  const { data: run, error: runError } = await supabase
    .from('agent_runs')
    .select('*')
    .eq('question_id', questionId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (runError || !run) {
    return null;
  }

  const { data: steps, error: stepsError } = await supabase
    .from('agent_timeline_logs')
    .select('*')
    .eq('agent_run_id', run.id)
    .order('started_at', { ascending: true });

  if (stepsError) {
    console.error('Failed to retrieve timeline steps:', stepsError.message);
  }

  const timelineSteps: AgentTimelineStepLog[] = (steps || []).map((s) => ({
    id: s.id,
    agent_run_id: s.agent_run_id,
    agent_role: s.agent_role as AgentRole,
    step_title: s.step_title,
    status: s.status as StageStatus,
    input_preview: s.input_preview,
    output_payload: s.output_payload as Record<string, unknown> | null,
    started_at: s.started_at,
    completed_at: s.completed_at,
    duration_ms: s.completed_at
      ? Math.max(0, new Date(s.completed_at).getTime() - new Date(s.started_at).getTime())
      : undefined,
  }));

  return {
    ...run,
    timeline_steps: timelineSteps,
  };
}

/**
 * 5. CREATE STRUCTURED ADVICE CARD (Real Database)
 */
export async function createAdviceCard(
  card: Omit<Database['public']['Tables']['advice_cards']['Insert'], 'id' | 'created_at'>
): Promise<AdviceCard> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from('advice_cards')
    .insert(card)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to save Advice Card in database: ${error?.message || 'Unknown error'}`);
  }

  return {
    ...data,
    scientific_name: data.scientific_name || undefined,
    local_context_notes: data.local_context_notes || '',
    recommended_season_action: data.recommended_season_action || undefined,
    primary_crop: data.primary_crop as EthiopianCrop,
  };
}

/**
 * 6. GET ADVICE CARD BY QUESTION ID (Real Database)
 */
export async function getAdviceCardByQuestionId(questionId: string): Promise<AdviceCard | null> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from('advice_cards')
    .select('*')
    .eq('question_id', questionId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    ...data,
    scientific_name: data.scientific_name || undefined,
    local_context_notes: data.local_context_notes || '',
    recommended_season_action: data.recommended_season_action || undefined,
    primary_crop: data.primary_crop as EthiopianCrop,
  };
}

/**
 * 7. SUBMIT ADVICE FEEDBACK (Real Database Voting Loop)
 */
export async function submitAdviceFeedback(params: {
  adviceCardId: string;
  userId?: string | null;
  vote: 'helpful' | 'unhelpful';
  comment?: string;
}) {
  const supabase = await createServerSupabase();

  const { error } = await supabase.from('advice_feedback').upsert(
    {
      advice_card_id: params.adviceCardId,
      user_id: params.userId || null,
      vote: params.vote,
      comment: params.comment || null,
    },
    { onConflict: 'advice_card_id,user_id' }
  );

  if (error) {
    throw new Error(`Failed to submit feedback: ${error.message}`);
  }

  // Phase 6 Feedback Loop: If vote is helpful, promote or increment community knowledge
  if (params.vote === 'helpful') {
    try {
      const { data: card } = await supabase
        .from('advice_cards')
        .select('*')
        .eq('id', params.adviceCardId)
        .single();

      if (card && card.organic_remedies && card.organic_remedies.length > 0) {
        const { data: existing } = await supabase
          .from('community_knowledge')
          .select('id, verified_by_farmers_count')
          .eq('source_advice_card_id', card.id)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('community_knowledge')
            .update({ verified_by_farmers_count: (existing.verified_by_farmers_count || 1) + 1 })
            .eq('id', existing.id);
        } else {
          const { data: q } = await supabase
            .from('questions')
            .select('region, agro_zone')
            .eq('id', card.question_id)
            .single();

          await supabase.from('community_knowledge').insert({
            source_advice_card_id: card.id,
            crop_type: card.primary_crop,
            problem_title: `${card.diagnosis_name} (${card.primary_crop})`,
            symptoms: (card.visual_indicators || []).join(', ') || card.agent_summary,
            proven_solution: card.organic_remedies.join('. ') || (card.immediate_actions || []).join('. '),
            region: q?.region || 'Oromia',
            agro_zone: q?.agro_zone || 'Weyna Dega',
            verified_by_farmers_count: (card.helpful_votes || 0) + 1,
          });
        }
      }
    } catch (feedbackErr) {
      console.warn('Community knowledge bridge notice:', feedbackErr);
    }
  }

  return { success: true };
}

/**
 * 8. SEARCH COMMUNITY KNOWLEDGE (Real Database Query)
 */
export async function searchCommunityKnowledge(params: {
  embedding?: number[];
  query?: string;
  crop?: string;
  region?: string;
  agroZone?: string;
  limit?: number;
}): Promise<CommunityKnowledgeRow[]> {
  const supabase = await createServerSupabase();

  // If embedding is supplied, invoke pgvector RPC function
  if (params.embedding && params.embedding.length > 0) {
    const { data, error } = await supabase.rpc(
      'match_community_knowledge' as never,
      {
        query_embedding: params.embedding,
        match_threshold: 0.65,
        match_count: params.limit || 5,
        filter_crop: params.crop || null,
        filter_region: params.region || null,
      } as never
    );

    if (!error && data) {
      return data;
    }
  }

  // Relational multi-field query against real database
  let queryBuilder = supabase.from('community_knowledge').select('*');

  if (params.crop) {
    queryBuilder = queryBuilder.ilike('crop_type', `%${params.crop}%`);
  }
  if (params.region) {
    queryBuilder = queryBuilder.ilike('region', `%${params.region}%`);
  }
  if (params.agroZone) {
    queryBuilder = queryBuilder.eq('agro_zone', params.agroZone);
  }
  if (params.query && params.query.trim()) {
    const term = params.query.trim();
    queryBuilder = queryBuilder.or(
      `problem_title.ilike.%${term}%,symptoms.ilike.%${term}%,proven_solution.ilike.%${term}%`
    );
  }

  const { data, error } = await queryBuilder
    .order('verified_by_farmers_count', { ascending: false })
    .limit(params.limit || 30);

  if (error) {
    console.error('Error querying community knowledge:', error.message);
    return [];
  }

  return data || [];
}

/**
 * 9. UPVOTE COMMUNITY REMEDY (Real Database Peer Verification)
 */
export async function upvoteCommunityRemedy(id: string): Promise<number> {
  const supabase = await createServerSupabase();

  // Read current count from real database
  const { data: item, error: fetchError } = await supabase
    .from('community_knowledge')
    .select('verified_by_farmers_count')
    .eq('id', id)
    .single();

  if (fetchError || !item) {
    throw new Error('Remedy record not found in database');
  }

  const currentCount = item.verified_by_farmers_count || 1;
  const newCount = currentCount + 1;

  const { error: updateError } = await supabase
    .from('community_knowledge')
    .update({ verified_by_farmers_count: newCount })
    .eq('id', id);

  if (updateError) {
    throw new Error(`Failed to update verification count: ${updateError.message}`);
  }

  return newCount;
}

/**
 * 10. CREATE COMMUNITY REMEDY (Real Database Insertion)
 */
export async function createCommunityRemedy(item: {
  cropType: string;
  problemTitle: string;
  symptoms: string;
  provenSolution: string;
  region: string;
  agroZone: string;
}): Promise<CommunityKnowledgeRow> {
  const supabase = await createServerSupabase();

  const newRecord = {
    crop_type: item.cropType,
    problem_title: item.problemTitle,
    symptoms: item.symptoms,
    proven_solution: item.provenSolution,
    region: item.region,
    agro_zone: item.agroZone as AgroEcologicalZone,
    verified_by_farmers_count: 1,
  };

  const { data, error } = await supabase
    .from('community_knowledge')
    .insert(newRecord)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to create remedy in database: ${error?.message || 'Unknown error'}`);
  }

  return data;
}

/**
 * 11. GET USER QUESTIONS (Real Database)
 */
export async function getUserQuestions(userId: string): Promise<Array<QuestionRow & { advice_card?: { id: string; diagnosis_name: string; urgency: string; confidence_score: number } | null }>> {
  const supabase = await createServerSupabase();

  const { data: questions, error } = await supabase
    .from('questions')
    .select(`
      *,
      advice_cards (
        id,
        diagnosis_name,
        urgency,
        confidence_score
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error || !questions) {
    return [];
  }

  return (questions as unknown as Array<QuestionRow & { advice_cards: Array<{ id: string; diagnosis_name: string; urgency: string; confidence_score: number }> }>).map((q) => ({
    ...q,
    advice_card: q.advice_cards && q.advice_cards.length > 0 ? q.advice_cards[0] : null,
  }));
}

export interface FarmerDashboardSummary {
  totalQuestions: number;
  resolvedDiagnoses: number;
  recentQuestions: Array<QuestionRow & { advice_card?: { id: string; diagnosis_name: string; urgency: string; confidence_score: number } | null }>;
  peerRemedies: CommunityKnowledgeRow[];
}

/**
 * 12. GET FARMER DASHBOARD SUMMARY (Real Database)
 */
export async function getFarmerDashboardSummary(userId: string, mainCrops: string[] = []): Promise<FarmerDashboardSummary> {
  const questions = await getUserQuestions(userId);
  const totalQuestions = questions.length;
  const resolvedDiagnoses = questions.filter((q) => q.advice_card !== null).length;

  // Query relevant community knowledge remedies for farmer's main crops
  let peerRemedies: CommunityKnowledgeRow[] = [];
  try {
    const supabase = await createServerSupabase();
    let query = supabase.from('community_knowledge').select('*');
    if (mainCrops.length > 0) {
      query = query.in('crop_type', mainCrops);
    }
    const { data } = await query
      .order('verified_by_farmers_count', { ascending: false })
      .limit(4);
    peerRemedies = data || [];
  } catch (e) {
    console.warn('Dashboard community spotlight notice:', e);
  }

  return {
    totalQuestions,
    resolvedDiagnoses,
    recentQuestions: questions,
    peerRemedies,
  };
}
