/**
 * ROOT – AGENT 1: DIAGNOSTIC AGENT
 * Analyzes crop symptoms, leaf blight patterns, pustule morphology, and pest manifestations.
 */

import { runDiagnosticAgent } from '@/lib/ollama/diagnose';
import { CouncilContextInput, DiagnosticAgentOutput } from './types';

export async function executeDiagnosticAgent(
  input: CouncilContextInput
): Promise<DiagnosticAgentOutput> {
  const result = await runDiagnosticAgent({
    cropType: input.cropType,
    symptoms: input.symptoms,
    region: input.region,
    agroZone: input.agroZone,
    photoUrl: input.photoUrl,
  });

  const card = result.adviceCard;

  return {
    diagnosisName: card.diagnosis_name,
    scientificName: card.scientific_name,
    confidenceScore: card.confidence_score,
    urgency: card.urgency,
    visualIndicators: card.visual_indicators,
    probableCauses: card.probable_causes,
    preliminaryActions: card.immediate_actions,
    reasoning: card.agent_summary,
    engineUsed: result.engineUsed === 'ollama' ? 'ollama' : 'offline_expert',
    modelUsed: result.modelUsed,
  };
}
