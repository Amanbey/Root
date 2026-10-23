'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { 
  createQuestion, 
  createAgentRun, 
  logAgentTimelineStep, 
  createAdviceCard, 
  submitAdviceFeedback 
} from '@/lib/supabase/db-helpers';
import { runDiagnosticAgent } from '@/lib/ollama/diagnose';
import { EthiopianCrop, EthiopianRegion, AgroEcologicalZone } from '@/lib/types';

export interface SubmitQuestionPayload {
  title: string;
  cropType: EthiopianCrop;
  symptoms: string;
  photoBase64?: string | null;
  region?: EthiopianRegion;
  agroZone?: AgroEcologicalZone;
}

export interface SubmitQuestionResult {
  success: boolean;
  questionId?: string;
  adviceCardId?: string;
  error?: string;
}

export async function submitCropQuestionAction(payload: SubmitQuestionPayload): Promise<SubmitQuestionResult> {
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    let userId: string | null = null;
    let photoUrl: string | null = null;

    // 1. Get user session if available
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      });

      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;

      // 2. Upload photo to Supabase Storage if provided
      if (payload.photoBase64 && payload.photoBase64.startsWith('data:image')) {
        try {
          const match = payload.photoBase64.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
          if (match) {
            const mimeType = match[1];
            const base64Data = match[2];
            const buffer = Buffer.from(base64Data, 'base64');
            const fileExt = mimeType.split('/')[1] || 'jpg';
            const fileName = `crop-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
              .from('crop-photos')
              .upload(fileName, buffer, { contentType: mimeType, upsert: true });

            if (!uploadError) {
              const { data: publicUrlData } = supabase.storage
                .from('crop-photos')
                .getPublicUrl(fileName);
              photoUrl = publicUrlData.publicUrl;
            }
          }
        } catch (photoErr) {
          console.warn('Photo upload warning:', photoErr);
        }
      }
    }

    // 3. Store the question in Supabase
    const question = await createQuestion({
      userId,
      title: payload.title || `${payload.cropType} Crop Problem`,
      cropType: payload.cropType,
      symptomsDescription: payload.symptoms,
      photoUrl,
      region: payload.region,
      agroZone: payload.agroZone,
      isOffline: false,
    });

    // 4. Initialize Multi-Agent Run in DB
    const agentRun = await createAgentRun(question.id, 'llama3.1:8b');

    // 5. Log Timeline Start
    await logAgentTimelineStep({
      agentRunId: agentRun.id,
      agentRole: 'diagnostic',
      stepTitle: 'Diagnostic Agent: Analyzing Symptoms & Pathogen Signatures',
      status: 'running',
      inputPreview: `Crop: ${payload.cropType}, Symptoms: ${payload.symptoms.substring(0, 100)}...`,
    });

    // 6. Execute AI Diagnosis (Ollama with resilient offline fallback)
    const diagnosisResult = await runDiagnosticAgent({
      cropType: payload.cropType,
      symptoms: payload.symptoms,
      region: payload.region,
      agroZone: payload.agroZone,
      photoUrl,
    });

    // 7. Log Timeline Completion
    await logAgentTimelineStep({
      agentRunId: agentRun.id,
      agentRole: 'diagnostic',
      stepTitle: 'Diagnostic Agent: Identification Complete',
      status: 'completed',
      outputPayload: {
        diagnosis: diagnosisResult.adviceCard.diagnosis_name,
        confidence: diagnosisResult.adviceCard.confidence_score,
        engine: diagnosisResult.engineUsed,
        model: diagnosisResult.modelUsed,
        durationMs: diagnosisResult.durationMs,
      },
    });

    // 8. Create and Persist the Structured Advice Card
    const savedCard = await createAdviceCard({
      question_id: question.id,
      agent_run_id: agentRun.id,
      diagnosis_name: diagnosisResult.adviceCard.diagnosis_name,
      scientific_name: diagnosisResult.adviceCard.scientific_name,
      confidence_score: diagnosisResult.adviceCard.confidence_score,
      urgency: diagnosisResult.adviceCard.urgency,
      primary_crop: payload.cropType,
      visual_indicators: diagnosisResult.adviceCard.visual_indicators,
      probable_causes: diagnosisResult.adviceCard.probable_causes,
      immediate_actions: diagnosisResult.adviceCard.immediate_actions,
      organic_remedies: diagnosisResult.adviceCard.organic_remedies,
      chemical_remedies: diagnosisResult.adviceCard.chemical_remedies || [],
      preventive_measures: diagnosisResult.adviceCard.preventive_measures,
      local_context_notes: diagnosisResult.adviceCard.local_context_notes,
      recommended_season_action: diagnosisResult.adviceCard.recommended_season_action,
      agent_summary: diagnosisResult.adviceCard.agent_summary,
    });

    revalidatePath('/diagnose');
    revalidatePath('/dashboard');

    return {
      success: true,
      questionId: question.id,
      adviceCardId: savedCard.id,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to diagnose crop problem';
    console.error('Diagnostic error:', errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }
}

export async function voteAdviceAction(params: {
  adviceCardId: string;
  userId?: string | null;
  vote: 'helpful' | 'unhelpful';
  comment?: string;
}) {
  return await submitAdviceFeedback(params);
}
