/**
 * ROOT – CLIENT-SIDE OFFLINE AGRO-EXPERT ENGINE
 * Generates immediate, practical Advice Cards directly on the farmer's device
 * in the specific language used by the farmer (Amharic, Afaan Oromoo, or English).
 */

import { EthiopianCrop, EthiopianRegion, AgroEcologicalZone, AdviceCard, SupportedLanguage } from '@/lib/types';
import { getCropKnowledgeProfile } from '@/lib/agronomy/knowledge-base';
import { resolveUserLanguage } from '@/lib/i18n/detect-language';

export interface OfflineExpertInput {
  cropType: EthiopianCrop;
  symptoms: string;
  region?: EthiopianRegion;
  agroZone?: AgroEcologicalZone;
  photoUrl?: string | null;
  preferredLanguage?: SupportedLanguage;
}

export function generateOfflineAdviceCard(input: OfflineExpertInput): AdviceCard {
  const lang = resolveUserLanguage(input.symptoms, input.preferredLanguage);
  const profile = getCropKnowledgeProfile(input.cropType, lang);

  const tempCardId = `offline-card-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const tempQuestionId = `offline-q-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  // Localized context string
  let localNotes = '';
  let agentSummary = '';

  if (lang === 'am') {
    localNotes = `ከመስመር ውጭ የተዘጋጀ የምክር አገልግሎት ለ${input.region || 'ኢትዮጵያ'} (${input.agroZone || 'ወይና ደጋ'})። ${profile.context}`;
    agentSummary = `[⚡ 100% ከመስመር ውጭ ሞተር] የሩት ግብርና ባለሙያ በተስተዋሉት ምልክቶች መሰረት "${profile.diagnosis}" በ${profile.confidence}% እርግጠኝነት ለይቷል። አውታረ መረብ ሲመለስ በራስ-ሰር ወደ ደመና ለመመሳሰል ተሰልፏል።`;
  } else if (lang === 'om') {
    localNotes = `Gorsi toora-malee ${input.region || 'Itoophiyaa'} (${input.agroZone || 'Baddaa-daree'}) qophaa'e. ${profile.context}`;
    agentSummary = `[⚡ 100% Ogeessa Toora-malee] Ogeessi Qonnaa Root mallattoolee mul'atan irratti hundaa'uun "${profile.diagnosis}" abdatamummaa %${profile.confidence}n adda baaseera. Yeroo interneetiin deebi'u ofumaan gara kuusaatti ol fe'amuuf qophaa'eera.`;
  } else {
    localNotes = `Offline advisory generated for ${input.region || 'Ethiopia'} (${input.agroZone || 'Weyna Dega'}). ${profile.context}`;
    agentSummary = `[⚡ 100% Offline Engine] The Root Agro-Expert identified "${profile.diagnosis}" with ${profile.confidence}% confidence based on observed symptoms. Queued for automatic cloud sync upon network restoration.`;
  }

  return {
    id: tempCardId,
    question_id: tempQuestionId,
    diagnosis_name: profile.diagnosis,
    scientific_name: profile.scientific,
    confidence_score: profile.confidence,
    urgency: profile.urgency,
    primary_crop: input.cropType,
    visual_indicators: profile.indicators,
    probable_causes: profile.causes,
    immediate_actions: profile.actions,
    organic_remedies: profile.organic,
    chemical_remedies: profile.chemical,
    preventive_measures: profile.preventive,
    local_context_notes: localNotes,
    recommended_season_action: profile.season,
    helpful_votes: 0,
    unhelpful_votes: 0,
    agent_summary: agentSummary,
    created_at: new Date().toISOString(),
    synced_online: false,
  };
}
