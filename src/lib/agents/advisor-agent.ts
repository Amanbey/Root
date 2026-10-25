/**
 * ROOT – AGENT 4: ADVISOR AGENT
 * Synthesizes council findings into a low-literacy, structured Advice Card.
 * Balances organic treatments, community wisdom, and local agro-ecological realities.
 * Outputs strictly in the specific language used by the farmer (Amharic, Afaan Oromoo, or English).
 */

import { 
  CouncilContextInput, 
  DiagnosticAgentOutput, 
  LocalContextAgentOutput, 
  CommunityKnowledgeAgentOutput, 
  AdviceCardInsertPayload 
} from './types';
import { resolveUserLanguage } from '@/lib/i18n/detect-language';

export async function executeAdvisorAgent(
  input: CouncilContextInput,
  diagnostic: DiagnosticAgentOutput,
  localContext: LocalContextAgentOutput,
  communityKnowledge: CommunityKnowledgeAgentOutput,
  agentRunId?: string
): Promise<AdviceCardInsertPayload> {
  const lang = resolveUserLanguage(input.symptoms, input.preferredLanguage);

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
    if (lang === 'am') {
      organicRemedies.push(
        `በማህበረሰብ የተረጋገጠ መፍትሄ (${topRemedy.verifiedCount} አርሶ አደሮች)፡ ${topRemedy.solution}`
      );
    } else if (lang === 'om') {
      organicRemedies.push(
        `Furmaata hawaasaan mirkanaa'e (qonnaan bultoota ${topRemedy.verifiedCount}): ${topRemedy.solution}`
      );
    } else {
      organicRemedies.push(
        `Community-Verified Remedy (${topRemedy.verifiedCount} farmers): ${topRemedy.solution}`
      );
    }
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
    if (lang === 'am') {
      chemicalRemedies.push(
        `የኬሚካል ጣልቃ ገብነት ማስጠንቀቂያ፡ አበባ ከመፈንዳቱ በፊት ከማሳው ከ20% በላይ ንቁ የሆኑ ቁስሎች ከታዩ ብቻ የተመዘገቡ የፈንገስ/የተባይ ማጥፊያዎችን ይጠቀሙ። ሁልጊዜ የጨርቅ ጭንብል ያድርጉና ወደ ንፋሱ አቅጣጫ አይርጩ።`
      );
    } else if (lang === 'om') {
      chemicalRemedies.push(
        `Akeekkachiisa keemikaalaa: Daraaraan osoo hin ba'in dura maasaa keessaa %20 ol yoo dhibame qofa qoricha eeyyamame fayyadamaa. Yeroo hunda haguuggii fuulaa fayyadamaa, bubbee wajjin hin biifinaa.`
      );
    } else {
      chemicalRemedies.push(
        `Threshold Intervention: Use recommended registered fungicide/pesticide only if >20% of field shows active lesions before flowering. Always wear protective cloth mask and spray downwind.`
      );
    }
  }

  // 4. Preventive measures for subsequent seasons
  let preventiveMeasures: string[] = [];
  if (lang === 'am') {
    preventiveMeasures = [
      `የግዴታ የሰብል ማፈራረቅ፡ ከ${input.cropType} በኋላ በሚቀጥለው ወቅት ናይትሮጅን በሚያበለጽጉ ጥራጥሬዎች (ባቄላ ወይም ሽምብራ) ይተኩ።`,
      `በኢትዮጵያ ግብርና ምርምር ኢንስቲትዩት (EIAR) ወይም በወረዳ የህብረት ስራ ማህበራት የተረጋገጡ ንጹህ የበሽታ ተከላካይ ዘሮችን ይጠቀሙ።`,
      `የፀሐይ ብርሃንና የአየር ዝውውር እንዲኖር ጥቅጥቅ አድርጎ ከመበተን ይልቅ በ20 ሳ.ሜ የመስመር ርቀት ይዝሩ።`,
    ];
  } else if (lang === 'om') {
    preventiveMeasures = [
      `Dabaree midhaanii dirqamaa: Callaa ${input.cropType} booda marsaa itti aanutti midhaan dheedhii naayitroojiinii lafaaf kennan (Baaqelaa ykn Shumburaa) facaasaa.`,
      `Dhaabbata Qorannoo Qonnaa Itoophiyaa (EIAR) ykn waldaa hojii gamtaa irraa sanyii qulqulluu dandamannaa qabu fayyadamaa.`,
      `Aduun fi qilleensi sirriitti akka galuuf facaasaa sararaa (seentimeetira 20) fayyadamaa.`,
    ];
  } else {
    preventiveMeasures = [
      `Mandatory crop rotation: Follow ${input.cropType} next season with nitrogen-fixing pulses (Faba bean / Bakela or Chickpea / Shimbra).`,
      `Source clean, certified resistant seeds approved by the Ethiopian Institute of Agricultural Research (EIAR) or local Woreda Cooperatives.`,
      `Maintain 20cm row spacing rather than heavy broadcast sowing to improve sunlight penetration and air circulation.`,
    ];
  }

  // 5. Plain-language low-literacy summary
  let agentSummary = '';
  if (lang === 'am') {
    agentSummary = `የሩት 5ቱ የግብርና ኤጀንቶች ምክር ቤት "${diagnostic.diagnosisName}" በ${diagnostic.confidenceScore}% እርግጠኝነት ለይቷል። ለ${localContext.agroZone} (${localContext.altitudeRange}) ተስማሚ እንዲሆን ተደርጓል። ${communityKnowledge.farmerWisdomSummary} ዋና ትኩረት፡ አፋጣኝ መርዛማ ያልሆነ የማሳ ጽዳት እና አነስተኛ ዋጋ ያላቸው የተፈጥሮ ማከሚያዎች።`;
  } else if (lang === 'om') {
    agentSummary = `Koreen Eejantoota Qonnaa Root 5 "${diagnostic.diagnosisName}" abdatamummaa %${diagnostic.confidenceScore}n adda baaseera. Baddaa-daree ${localContext.agroZone} (${localContext.altitudeRange}) qophaa'eera. ${communityKnowledge.farmerWisdomSummary} Xiyyeeffannoo guddaan: hatattamaan qulqullina maasaa eeguu fi qoricha uumamaa fayyadamuu.`;
  } else {
    agentSummary = `The Root 5-Agent Council diagnosed "${diagnostic.diagnosisName}" with ${diagnostic.confidenceScore}% confidence. Adapted for ${localContext.agroZone} (${localContext.altitudeRange}) during the ${localContext.seasonRecommendation.split('–')[0]} season. ${communityKnowledge.farmerWisdomSummary} Primary focus: immediate non-toxic field sanitation and low-cost bio-extracts.`;
  }

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
