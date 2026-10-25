/**
 * ROOT – OLLAMA AI INFERENCE & DIAGNOSTIC AGENT ENGINE
 * Connects to local Ollama (Llama 3.1 8B / Qwen2.5 14B) with resilient offline fallback
 * Strictly responds in the language used by the user (Amharic, Afaan Oromoo, or English).
 */

import { getOllamaBaseUrl, getOllamaModel } from '@/lib/ollama/client';
import { EthiopianCrop, EthiopianRegion, AgroEcologicalZone, AdviceCard, UrgencyLevel, SupportedLanguage } from '@/lib/types';
import { getCropKnowledgeProfile } from '@/lib/agronomy/knowledge-base';
import { resolveUserLanguage, LANGUAGE_LABELS } from '@/lib/i18n/detect-language';

export interface DiagnoseRequest {
  cropType: EthiopianCrop;
  symptoms: string;
  region?: EthiopianRegion;
  agroZone?: AgroEcologicalZone;
  photoUrl?: string | null;
  photoBase64?: string | null;
  preferredLanguage?: SupportedLanguage;
}

export interface DiagnosticAgentResult {
  adviceCard: Omit<AdviceCard, 'id' | 'question_id' | 'created_at' | 'helpful_votes' | 'unhelpful_votes'>;
  engineUsed: 'ollama' | 'offline_expert' | 'gemini_fallback';
  modelUsed: string;
  durationMs: number;
}

/**
 * Resolves diagnosis via local Ollama daemon or offline expert fallback
 * Always returns advice in the user's specific requested language.
 */
export async function runDiagnosticAgent(params: DiagnoseRequest): Promise<DiagnosticAgentResult> {
  const startTime = Date.now();
  const lang = resolveUserLanguage(params.symptoms, params.preferredLanguage);
  const targetLanguageLabel = LANGUAGE_LABELS[lang];

  // 1. Try local Ollama with strict language enforcement
  try {
    const baseUrl = getOllamaBaseUrl();
    const model = getOllamaModel();

    const systemPrompt = `You are the Diagnostic Agent of "Root", an agricultural advisory platform for Ethiopian smallholder farmers.
You specialize in Ethiopian crops (Teff, Wheat, Maize, Coffee, Barley, Enset, Sorghum, Pulses, Vegetables) and Ethiopian agro-ecological zones (Dega, Weyna Dega, Kolla, Bereha).
Analyze the farmer's crop and symptoms carefully.

CRITICAL LANGUAGE REQUIREMENT:
The farmer is communicating in ${targetLanguageLabel}.
You MUST generate ALL output fields entirely in ${targetLanguageLabel} (language code: "${lang}").
Every value in the JSON below MUST be written in ${targetLanguageLabel}:
- diagnosis_name
- visual_indicators (array of strings in ${targetLanguageLabel})
- probable_causes (array of strings in ${targetLanguageLabel})
- immediate_actions (array of strings in ${targetLanguageLabel})
- organic_remedies (array of strings in ${targetLanguageLabel})
- chemical_remedies (array of strings in ${targetLanguageLabel})
- preventive_measures (array of strings in ${targetLanguageLabel})
- local_context_notes (in ${targetLanguageLabel})
- recommended_season_action (in ${targetLanguageLabel})
- agent_summary (in ${targetLanguageLabel})

Output MUST be ONLY valid JSON matching this exact structure:
{
  "diagnosis_name": "Diagnosis name in ${targetLanguageLabel}",
  "scientific_name": "Genus species",
  "confidence_score": 85,
  "urgency": "low" | "medium" | "high" | "critical",
  "primary_crop": "${params.cropType}",
  "visual_indicators": ["symptom in ${targetLanguageLabel}"],
  "probable_causes": ["cause in ${targetLanguageLabel}"],
  "immediate_actions": ["immediate action in ${targetLanguageLabel}"],
  "organic_remedies": ["organic remedy using local resources in ${targetLanguageLabel}"],
  "chemical_remedies": ["accessible chemical option in ${targetLanguageLabel}"],
  "preventive_measures": ["preventive measure in ${targetLanguageLabel}"],
  "local_context_notes": "Localized notes in ${targetLanguageLabel} for ${params.region || 'Ethiopia'}, ${params.agroZone || 'Weyna Dega'}",
  "recommended_season_action": "Seasonal advice in ${targetLanguageLabel}",
  "agent_summary": "Summary in ${targetLanguageLabel}"
}`;

    const userMessage = `Farmer Question:
Language: ${targetLanguageLabel}
Crop: ${params.cropType}
Region: ${params.region || 'Ethiopia'}
Agro-ecological Zone: ${params.agroZone || 'Weyna Dega'}
Observed Symptoms: ${params.symptoms}`;

    const res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: `${systemPrompt}\n\n${userMessage}`,
        stream: false,
        format: 'json',
      }),
      signal: AbortSignal.timeout(12000), // 12 second timeout for local inference
    });

    if (res.ok) {
      const data = (await res.json()) as { response?: string };
      if (data.response) {
        const parsed = JSON.parse(data.response);
        return {
          adviceCard: {
            diagnosis_name: parsed.diagnosis_name || 'Crop Disease / Pest Infestation',
            scientific_name: parsed.scientific_name,
            confidence_score: Number(parsed.confidence_score) || 85,
            urgency: (parsed.urgency as UrgencyLevel) || 'medium',
            primary_crop: params.cropType,
            visual_indicators: parsed.visual_indicators || [params.symptoms],
            probable_causes: parsed.probable_causes || ['Pathogen or environmental stress'],
            immediate_actions: parsed.immediate_actions || ['Isolate affected plants'],
            organic_remedies: parsed.organic_remedies || ['Apply diluted wood ash or neem extract'],
            chemical_remedies: parsed.chemical_remedies || [],
            preventive_measures: parsed.preventive_measures || ['Rotate crops next season'],
            local_context_notes: parsed.local_context_notes || `Advice customized for ${params.region || 'Ethiopia'}`,
            recommended_season_action: parsed.recommended_season_action,
            agent_summary: parsed.agent_summary || 'Diagnosis completed by local Ollama AI model.',
          },
          engineUsed: 'ollama',
          modelUsed: model,
          durationMs: Date.now() - startTime,
        };
      }
    }
  } catch {
    // Ollama not reachable, fall back cleanly to offline agronomic knowledge base
  }

  // 2. Multilingual Offline Expert Engine Fallback
  const matched = getCropKnowledgeProfile(params.cropType, lang);

  let localizedContext = '';
  if (lang === 'am') {
    localizedContext = `${matched.context} (ለ${params.region || 'ክልልዎ'} በ${params.agroZone || 'ወይና ደጋ'} የተዘጋጀ)።`;
  } else if (lang === 'om') {
    localizedContext = `${matched.context} (Gorsi ${params.region || 'naannoo keessan'} keessatti ${params.agroZone || 'Baddaa-daree'} qophaa'e).`;
  } else {
    localizedContext = `${matched.context} (Customized for ${params.region || 'your region'} in ${params.agroZone || 'Weyna Dega'}).`;
  }

  return {
    adviceCard: {
      diagnosis_name: matched.diagnosis,
      scientific_name: matched.scientific,
      confidence_score: matched.confidence,
      urgency: matched.urgency,
      primary_crop: params.cropType,
      visual_indicators: matched.indicators,
      probable_causes: matched.causes,
      immediate_actions: matched.actions,
      organic_remedies: matched.organic,
      chemical_remedies: matched.chemical,
      preventive_measures: matched.preventive,
      local_context_notes: localizedContext,
      recommended_season_action: matched.season,
      agent_summary: matched.summary,
    },
    engineUsed: 'offline_expert',
    modelUsed: `Root Ethiopian Agronomy Engine (${targetLanguageLabel})`,
    durationMs: Date.now() - startTime,
  };
}
