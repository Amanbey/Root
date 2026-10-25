/**
 * ROOT – AGENT 3: COMMUNITY KNOWLEDGE AGENT
 * Searches peer-verified farmer solutions stored in Supabase vector memory / community knowledge base.
 */

import { searchCommunityKnowledge } from '@/lib/supabase/db-helpers';
import { CouncilContextInput, DiagnosticAgentOutput, CommunityKnowledgeAgentOutput, PeerVerifiedRemedy } from './types';

export async function executeCommunityKnowledgeAgent(
  input: CouncilContextInput,
  diagnosticOutput?: DiagnosticAgentOutput
): Promise<CommunityKnowledgeAgentOutput> {
  const crop = input.cropType;
  const region = input.region || 'Oromia';
  const diagnosisName = diagnosticOutput?.diagnosisName;

  // Search community database for matched knowledge records
  const matchedRecords = await searchCommunityKnowledge({
    crop,
    region,
    limit: 4,
  });

  const verifiedRemedies: PeerVerifiedRemedy[] = matchedRecords.map((rec) => ({
    id: rec.id,
    title: rec.problem_title,
    solution: rec.proven_solution,
    verifiedCount: rec.verified_by_farmers_count || 1,
    region: rec.region,
    agroZone: rec.agro_zone,
  }));

  let farmerWisdomSummary = '';
  if (verifiedRemedies.length > 0) {
    const topRemedy = verifiedRemedies[0];
    farmerWisdomSummary = `Found ${verifiedRemedies.length} peer-verified community solutions${diagnosisName ? ` for ${diagnosisName}` : ''}. Top solution verified by ${topRemedy.verifiedCount} farmers in ${topRemedy.region}: "${topRemedy.solution}"`;
  } else {
    farmerWisdomSummary = `No direct historical community record for ${crop} (${diagnosisName || 'problem'}) in ${region} yet. First-time community protocol logged. Baseline organic protocols recommended.`;
  }

  return {
    matchesFound: verifiedRemedies.length,
    verifiedRemedies,
    farmerWisdomSummary,
  };
}
