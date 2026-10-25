/**
 * ROOT – AGENT 4: ADVISOR AGENT
 * Synthesizes council findings into a low-literacy, structured Advice Card.
 * Balances organic treatments, community wisdom, and local agro-ecological realities.
 */

import { 
  CouncilContextInput, 
  DiagnosticAgentOutput, 
  LocalContextAgentOutput, 
  CommunityKnowledgeAgentOutput, 
  AdviceCardInsertPayload 
} from './types';

export async function executeAdvisorAgent(
  input: CouncilContextInput,
  diagnostic: DiagnosticAgentOutput,
  localContext: LocalContextAgentOutput,
  communityKnowledge: CommunityKnowledgeAgentOutput,
  agentRunId?: string
): Promise<AdviceCardInsertPayload> {
  // 1. Synthesize immediate actions combining diagnostic priority and local culture
  const immediateActions: string[] = [
    ...diagnostic.preliminaryActions.slice(0, 3),
  ];
  if (localContext.culturalPractices.length > 0) {
    immediateActions.push(localContext.culturalPractices[0]);
  }

  // 2. Synthesize organic remedies combining specialist advice and peer-verified solutions
  const organicRemedies: string[] = [];

  // Add peer-verified community wisdom if present
  if (communityKnowledge.verifiedRemedies.length > 0) {
    const topRemedy = communityKnowledge.verifiedRemedies[0];
    organicRemedies.push(
      `Community-Verified Remedy (${topRemedy.verifiedCount} farmers): ${topRemedy.solution}`
    );
  }

  // Add localized remedies from the agro-ecological zone
  for (const remedy of localContext.localizedRemedies) {
    if (!organicRemedies.includes(remedy) && organicRemedies.length < 4) {
      organicRemedies.push(remedy);
    }
  }

  // 3. Chemical contingency remedies (only threshold-based, with safety alerts)
  const chemicalRemedies: string[] = [];
  if (diagnostic.urgency === 'critical' || diagnostic.urgency === 'high') {
    chemicalRemedies.push(
      `Threshold Intervention: Use recommended registered fungicide/pesticide only if >20% of field shows active lesions before flowering. Always wear protective cloth mask and spray downwind.`
    );
  }

  // 4. Preventive measures for subsequent seasons
  const preventiveMeasures: string[] = [
    `Mandatory crop rotation: Follow ${input.cropType} next season with nitrogen-fixing pulses (Faba bean / Bakela or Chickpea / Shimbra).`,
    `Source clean, certified resistant seeds approved by the Ethiopian Institute of Agricultural Research (EIAR) or local Woreda Cooperatives.`,
    `Maintain 20cm row spacing rather than heavy broadcast sowing to improve sunlight penetration and air circulation.`,
  ];

  // 5. Plain-language low-literacy summary
  const agentSummary = `The Root 5-Agent Council diagnosed "${diagnostic.diagnosisName}" with ${diagnostic.confidenceScore}% confidence. Adapted for ${localContext.agroZone} (${localContext.altitudeRange}) during the ${localContext.seasonRecommendation.split('–')[0]} season. ${communityKnowledge.farmerWisdomSummary} Primary focus: immediate non-toxic field sanitation and low-cost bio-extracts.`;

  return {
    question_id: input.questionId,
    agent_run_id: agentRunId || null,
    diagnosis_name: diagnostic.diagnosisName,
    scientific_name: diagnostic.scientificName || null,
    confidence_score: diagnostic.confidenceScore,
    urgency: diagnostic.urgency,
    primary_crop: input.cropType,
    visual_indicators: diagnostic.visualIndicators,
    probable_causes: diagnostic.probableCauses,
    immediate_actions: immediateActions,
    organic_remedies: organicRemedies,
    chemical_remedies: chemicalRemedies,
    preventive_measures: preventiveMeasures,
    local_context_notes: localContext.contextNotes,
    recommended_season_action: localContext.seasonRecommendation,
    helpful_votes: 0,
    unhelpful_votes: 0,
    agent_summary: agentSummary,
  };
}
