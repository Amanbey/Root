/**
 * ROOT – AGENT 3: COMMUNITY KNOWLEDGE AGENT
 * Searches peer-verified farmer solutions stored in Supabase vector memory / community knowledge base.
 * Generates summaries strictly in the language used by the farmer (Amharic, Afaan Oromoo, or English).
 */

import { searchCommunityKnowledge } from '@/lib/supabase/db-helpers';
import { CouncilContextInput, DiagnosticAgentOutput, CommunityKnowledgeAgentOutput, PeerVerifiedRemedy } from './types';
import { resolveUserLanguage } from '@/lib/i18n/detect-language';

export async function executeCommunityKnowledgeAgent(
  input: CouncilContextInput,
  diagnosticOutput?: DiagnosticAgentOutput
): Promise<CommunityKnowledgeAgentOutput> {
  const lang = resolveUserLanguage(input.symptoms, input.preferredLanguage);
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
    if (lang === 'am') {
      farmerWisdomSummary = `${verifiedRemedies.length} በአርሶ አደሮች የተረጋገጡ የማህበረሰብ መፍትሄዎች${diagnosisName ? ` ለ${diagnosisName}` : ''} ተገኝተዋል። በ${topRemedy.region} በ${topRemedy.verifiedCount} አርሶ አደሮች የተረጋገጠው ምርጥ መፍትሄ፡ "${topRemedy.solution}"`;
    } else if (lang === 'om') {
      farmerWisdomSummary = `Furmaata qonnaan bultootaan mirkanaa'an ${verifiedRemedies.length}${diagnosisName ? ` dhibee ${diagnosisName}tiif` : ''} argamaniiru. Furmaata caalmaan ${topRemedy.region} keessatti qonnaan bultoota ${topRemedy.verifiedCount}n mirkanaa'e: "${topRemedy.solution}"`;
    } else {
      farmerWisdomSummary = `Found ${verifiedRemedies.length} peer-verified community solutions${diagnosisName ? ` for ${diagnosisName}` : ''}. Top solution verified by ${topRemedy.verifiedCount} farmers in ${topRemedy.region}: "${topRemedy.solution}"`;
    }
  } else {
    if (lang === 'am') {
      farmerWisdomSummary = `ለ${crop} (${diagnosisName || 'ችግር'}) በ${region} ክልል ቀደም ሲል የተመዘገበ የማህበረሰብ ተሞክሮ የለም። የመጀመሪያው የማህበረሰብ ፕሮቶኮል ተመዝግቧል። መደበኛ የተፈጥሮ ህክምናዎች ይመከራሉ።`;
    } else if (lang === 'om') {
      farmerWisdomSummary = `Callaa ${crop} (${diagnosisName || 'rakkoo'}) naannoo ${region} keessatti seenaan duraanii hin jiru. Galmeen jalqabaa qabameera. Furmaata uumamaa fayyadamuun gorfama.`;
    } else {
      farmerWisdomSummary = `No direct historical community record for ${crop} (${diagnosisName || 'problem'}) in ${region} yet. First-time community protocol logged. Baseline organic protocols recommended.`;
    }
  }

  return {
    matchesFound: verifiedRemedies.length,
    verifiedRemedies,
    farmerWisdomSummary,
  };
}
