/**
 * ROOT – SUPABASE DATABASE QUERY HELPERS
 * Type-safe abstraction layer for questions, agent runs, advice cards & community knowledge
 */

import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { Database, Json } from '@/lib/supabase/database.types';
import { AdviceCard, EthiopianCrop, EthiopianRegion, AgroEcologicalZone } from '@/lib/types';

export type QuestionRow = Database['public']['Tables']['questions']['Row'];
export type AdviceCardRow = Database['public']['Tables']['advice_cards']['Row'];
export type CommunityKnowledgeRow = Database['public']['Tables']['community_knowledge']['Row'];

function isPlaceholderMode() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !url || url.includes('placeholder.supabase.co');
}

/**
 * 1. CREATE A NEW QUESTION
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

  if (isPlaceholderMode()) {
    return {
      id: `local-q-${Date.now()}`,
      user_id: params.userId || null,
      title: params.title,
      crop_type: params.cropType,
      symptoms_description: params.symptomsDescription,
      photo_url: params.photoUrl || null,
      region: params.region || 'Oromia',
      agro_zone: params.agroZone || 'Weyna Dega',
      status: 'queued',
      is_offline_submission: !!params.isOffline,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  const { data, error } = await supabase
    .from('questions')
    .insert({
      user_id: params.userId || null,
      title: params.title,
      crop_type: params.cropType,
      symptoms_description: params.symptomsDescription,
      photo_url: params.photoUrl || null,
      region: params.region,
      agro_zone: params.agroZone,
      status: 'queued',
      is_offline_submission: !!params.isOffline,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to create question: ${error?.message}`);
  }

  return data;
}

/**
 * 2. GET QUESTION BY ID
 */
export async function getQuestionById(questionId: string): Promise<QuestionRow | null> {
  const supabase = await createServerSupabase();

  if (isPlaceholderMode()) {
    return {
      id: questionId,
      user_id: 'demo-farmer-id',
      title: 'Yellow rust lesions on wheat leaves',
      crop_type: 'Wheat',
      symptoms_description: 'Leaves show powdery yellow stripes along the veins after heavy morning dew.',
      photo_url: null,
      region: 'Oromia',
      agro_zone: 'Weyna Dega',
      status: 'completed',
      is_offline_submission: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', questionId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * 3. RECORD MULTI-AGENT RUN
 */
export async function createAgentRun(questionId: string, modelUsed = 'llama3.1:8b') {
  const supabase = await createServerSupabase();

  if (isPlaceholderMode()) {
    return { id: `run-${Date.now()}`, question_id: questionId };
  }

  const { data, error } = await supabase
    .from('agent_runs')
    .insert({
      question_id: questionId,
      model_used: modelUsed,
      status: 'running',
    })
    .select()
    .single();

  if (error) {
    console.warn('Failed to record agent run:', error.message);
    return { id: `local-run-${Date.now()}`, question_id: questionId };
  }

  return data;
}

/**
 * 4. LOG AGENT TIMELINE STEP
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

  if (isPlaceholderMode()) {
    return;
  }

  await supabase.from('agent_timeline_logs').insert({
    agent_run_id: params.agentRunId,
    agent_role: params.agentRole,
    step_title: params.stepTitle,
    status: params.status,
    input_preview: params.inputPreview || null,
    output_payload: (params.outputPayload as unknown as Json) || null,
    completed_at: params.status !== 'running' ? new Date().toISOString() : null,
  });
}

/**
 * 5. CREATE STRUCTURED ADVICE CARD
 */
export async function createAdviceCard(
  card: Omit<Database['public']['Tables']['advice_cards']['Insert'], 'id' | 'created_at'>
): Promise<AdviceCard> {
  const supabase = await createServerSupabase();

  if (isPlaceholderMode()) {
    return {
      id: `card-${Date.now()}`,
      question_id: card.question_id,
      diagnosis_name: card.diagnosis_name,
      scientific_name: card.scientific_name || undefined,
      confidence_score: card.confidence_score,
      urgency: card.urgency || 'medium',
      primary_crop: card.primary_crop as EthiopianCrop,
      visual_indicators: card.visual_indicators || [],
      probable_causes: card.probable_causes || [],
      immediate_actions: card.immediate_actions || [],
      organic_remedies: card.organic_remedies || [],
      preventive_measures: card.preventive_measures || [],
      local_context_notes: card.local_context_notes || '',
      recommended_season_action: card.recommended_season_action || undefined,
      helpful_votes: 0,
      unhelpful_votes: 0,
      agent_summary: card.agent_summary,
      created_at: new Date().toISOString(),
    };
  }

  const { data, error } = await supabase
    .from('advice_cards')
    .insert(card)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to save Advice Card: ${error?.message}`);
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
 * 6. GET ADVICE CARD BY QUESTION ID
 */
export async function getAdviceCardByQuestionId(questionId: string): Promise<AdviceCard | null> {
  const supabase = await createServerSupabase();

  if (isPlaceholderMode()) {
    return {
      id: `card-mock-${questionId}`,
      question_id: questionId,
      diagnosis_name: 'Stripe Rust (Yellow Rust)',
      scientific_name: 'Puccinia striiformis',
      confidence_score: 92,
      urgency: 'high',
      primary_crop: 'Wheat',
      visual_indicators: [
        'Linear parallel lines of yellow pustules along leaf blades',
        'Chlorotic leaf yellowing and necrosis',
        'Powdery fungal spores transferring on finger touch',
      ],
      probable_causes: [
        'Extended cool and humid conditions common to Weyna Dega / Dega zones',
        'High planting density restricting airflow',
        'Susceptible traditional wheat cultivar without genetic resistance',
      ],
      immediate_actions: [
        'Remove severely infected lower flag leaves and bury them outside field borders',
        'Avoid overhead irrigation or watering late in the afternoon',
        'Dust fine wood ash mixed with dry slaked lime along infected row borders',
      ],
      organic_remedies: [
        'Neem extract spray: 50g crushed neem seeds steeped in 1L water with mild soap surfactant',
        'Compost tea foliar spray to cultivate beneficial phyllosphere bacteria',
      ],
      preventive_measures: [
        'Rotate wheat next season with faba bean or chickpea to break rust spore cycle',
        'Use certified resistant seed varieties recommended by Ethiopian Agricultural Research Institute (EIAR)',
      ],
      local_context_notes:
        'Common in Ethiopian highlands between 1800m - 2800m during the main Meher season. Early action saves up to 40% yield loss.',
      helpful_votes: 18,
      unhelpful_votes: 1,
      agent_summary:
        'The Diagnostic Agent identified classic Puccinia striiformis stripe rust. Local Context Agent tailored the response to the Weyna Dega midlands with low-cost organic remedies.',
      created_at: new Date().toISOString(),
    };
  }

  const { data, error } = await supabase
    .from('advice_cards')
    .select('*')
    .eq('question_id', questionId)
    .single();

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
 * 7. SUBMIT ADVICE FEEDBACK (VOTING LOOP)
 */
export async function submitAdviceFeedback(params: {
  adviceCardId: string;
  userId?: string | null;
  vote: 'helpful' | 'unhelpful';
  comment?: string;
}) {
  const supabase = await createServerSupabase();

  if (isPlaceholderMode()) {
    return { success: true };
  }

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

  return { success: true };
}

/**
 * 8. SEARCH COMMUNITY KNOWLEDGE (VECTOR SIMILARITY)
 */
export async function searchCommunityKnowledge(params: {
  embedding?: number[];
  crop?: string;
  region?: string;
  limit?: number;
}): Promise<CommunityKnowledgeRow[]> {
  const supabase = await createServerSupabase();

  if (isPlaceholderMode()) {
    // Return sample peer-verified Ethiopian knowledge
    return [
      {
        id: 'ck-seed-1',
        source_advice_card_id: null,
        crop_type: params.crop || 'Teff',
        problem_title: 'Teff Rust & Leaf Blotch (የጤፍ ዝገት)',
        symptoms: 'Orange-brown pustules on stems and lower leaves, premature leaf yellowing.',
        proven_solution:
          'Mix wood ash with diluted neem extract (50ml neem per 10L water). Spray early morning during tillering.',
        region: params.region || 'Oromia',
        agro_zone: 'Weyna Dega',
        verified_by_farmers_count: 42,
        embedding: null,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ck-seed-2',
        source_advice_card_id: null,
        crop_type: 'Maize',
        problem_title: 'Fall Armyworm Infestation (አባጨጓሬ)',
        symptoms: 'Windowpane leaf damage and frass on whorls.',
        proven_solution:
          'Apply clean wood ash directly into whorls. Intercrop with Desmodium and Napier grass.',
        region: 'Oromia',
        agro_zone: 'Kolla',
        verified_by_farmers_count: 114,
        embedding: null,
        created_at: new Date().toISOString(),
      },
    ];
  }

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

  // Fallback to relational query
  let query = supabase.from('community_knowledge').select('*');
  if (params.crop) {
    query = query.ilike('crop_type', `%${params.crop}%`);
  }
  if (params.region) {
    query = query.ilike('region', `%${params.region}%`);
  }

  const { data } = await query.order('verified_by_farmers_count', { ascending: false }).limit(params.limit || 10);
  return data || [];
}
