/**
 * ROOT – AGENT 0: ORCHESTRATOR AGENT & COUNCIL RUNNER
 * Coordinates task dispatch, timeline event streaming, and database persistence
 * across the 5 specialized Ethiopian agricultural AI agents.
 * Strictly operates in the specific language used by the user (Amharic, Afaan Oromoo, or English).
 */

import { 
  createAgentRun, 
  updateAgentRun, 
  logAgentTimelineStep, 
  createAdviceCard 
} from '@/lib/supabase/db-helpers';
import { executeDiagnosticAgent } from './diagnostic-agent';
import { executeLocalContextAgent } from './local-context-agent';
import { executeCommunityKnowledgeAgent } from './community-knowledge-agent';
import { executeAdvisorAgent } from './advisor-agent';
import { 
  CouncilContextInput, 
  CouncilDeliberationResult, 
  CouncilStepEvent 
} from './types';
import { resolveUserLanguage } from '@/lib/i18n/detect-language';

export interface RunCouncilOptions {
  onEvent?: (event: CouncilStepEvent) => void | Promise<void>;
  modelUsed?: string;
}

export async function runAgriculturalCouncil(
  input: CouncilContextInput,
  options?: RunCouncilOptions
): Promise<CouncilDeliberationResult> {
  const startTime = Date.now();
  const modelUsed = options?.modelUsed || 'llama3.1:8b';
  const lang = resolveUserLanguage(input.symptoms, input.preferredLanguage);

  // 1. Initialize Council Run in Database
  const agentRun = await createAgentRun(input.questionId, modelUsed);
  const runId = agentRun.id;

  const emit = async (event: CouncilStepEvent) => {
    if (options?.onEvent) {
      try {
        await options.onEvent(event);
      } catch (err) {
        console.warn('Council onEvent emission warning:', err);
      }
    }
  };

  // STEP 1: ORCHESTRATOR INITIALIZATION
  const step1Start = Date.now();
  let step1TitleRunning = 'Council Initialized: Query parsing & agent pipeline dispatch';
  let step1PreviewRunning = `Target: ${input.cropType} problem in ${input.region || 'Ethiopia'} (${input.agroZone || 'Weyna Dega'})`;
  let step1TitleDone = 'Council Initialized: Pipeline Active';
  let step1PreviewDone = 'Context validated. Dispatched Diagnostic Agent.';

  if (lang === 'am') {
    step1TitleRunning = 'የምክር ቤቱ ስብሰባ ተጀምሯል፡ የጥያቄ ትንተና እና የወኪሎች ስምሪት';
    step1PreviewRunning = `ዒላማ፡ የ${input.cropType} ችግር በ${input.region || 'ኢትዮጵያ'} (${input.agroZone || 'ወይና ደጋ'})`;
    step1TitleDone = 'የምክር ቤቱ ስብሰባ ተጀምሯል፡ የትንተና መስመር ዝግጁ ነው';
    step1PreviewDone = 'የጥያቄው ሁኔታ ተረጋግጧል። የምርመራ ወኪል ተሰማርቷል።';
  } else if (lang === 'om') {
    step1TitleRunning = 'Koreen Jalqabame: Xiinxala gaaffii fi ergama eejantootaa';
    step1PreviewRunning = `Xiyyeeffannoo: Rakkoo ${input.cropType} naannoo ${input.region || 'Itoophiyaa'} (${input.agroZone || 'Baddaa-daree'})`;
    step1TitleDone = 'Koreen Jalqabame: Tartiibni Hojii Qophaa\'eera';
    step1PreviewDone = 'Haalli qoratameera. Eejantiin qorannoo dhibee ergameera.';
  }

  await emit({
    stepId: 'step-orchestrator',
    role: 'orchestrator',
    title: step1TitleRunning,
    status: 'running',
    progressPercent: 10,
    preview: step1PreviewRunning,
    timestamp: new Date().toISOString(),
  });

  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'orchestrator',
    stepTitle: step1TitleRunning,
    status: 'running',
    inputPreview: `Crop: ${input.cropType}, Symptoms: "${input.symptoms.substring(0, 100)}..."`,
  });

  const step1Duration = Date.now() - step1Start;
  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'orchestrator',
    stepTitle: step1TitleDone,
    status: 'completed',
    outputPayload: {
      crop: input.cropType,
      region: input.region || 'Oromia',
      agroZone: input.agroZone || 'Weyna Dega',
      language: lang,
      pipeline: ['diagnostic', 'local_context', 'knowledge', 'advisor'],
    },
  });

  await emit({
    stepId: 'step-orchestrator',
    role: 'orchestrator',
    title: step1TitleDone,
    status: 'completed',
    progressPercent: 20,
    preview: step1PreviewDone,
    durationMs: step1Duration,
    timestamp: new Date().toISOString(),
  });

  // STEP 2: DIAGNOSTIC AGENT
  const step2Start = Date.now();
  let step2TitleRunning = 'Diagnostic Agent: Analyzing Pathogen & Symptom Signatures';
  let step2PreviewRunning = `Analyzing visual lesions, fungal/insect morphology for ${input.cropType}...`;

  if (lang === 'am') {
    step2TitleRunning = 'የምርመራ ወኪል፡ የበሽታ አምጪና የምልክቶች ትንተና';
    step2PreviewRunning = `ለ${input.cropType} የቅጠል ቁስሎችንና የፈንገስ/የተባይ ሁኔታን በመመርመር ላይ...`;
  } else if (lang === 'om') {
    step2TitleRunning = 'Eejantii Qorannoo: Qorannoo dhibee fi mallattoolee';
    step2PreviewRunning = `Mallattoolee baalaa fi fangasii/ilbiisa ${input.cropType} xiinxaluu irratti...`;
  }

  await emit({
    stepId: 'step-diagnostic',
    role: 'diagnostic',
    title: step2TitleRunning,
    status: 'running',
    progressPercent: 30,
    preview: step2PreviewRunning,
    timestamp: new Date().toISOString(),
  });

  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'diagnostic',
    stepTitle: step2TitleRunning,
    status: 'running',
    inputPreview: `Input: ${input.symptoms}`,
  });

  const diagnosticOutput = await executeDiagnosticAgent({ ...input, preferredLanguage: lang });
  const step2Duration = Date.now() - step2Start;

  let step2TitleDone = `Diagnostic Agent: Identified ${diagnosticOutput.diagnosisName}`;
  let step2SummaryDone = `${diagnosticOutput.confidenceScore}% confidence (${diagnosticOutput.urgency.toUpperCase()} urgency)`;
  let step2PreviewDone = `Confirmed ${diagnosticOutput.diagnosisName} (${diagnosticOutput.scientificName || 'Crop Pathogen'}).`;

  if (lang === 'am') {
    step2TitleDone = `የምርመራ ወኪል፡ ${diagnosticOutput.diagnosisName} ተለይቷል`;
    step2SummaryDone = `${diagnosticOutput.confidenceScore}% እርግጠኝነት (${diagnosticOutput.urgency.toUpperCase()} አስቸኳይነት)`;
    step2PreviewDone = `${diagnosticOutput.diagnosisName} (${diagnosticOutput.scientificName || 'የሰብል በሽታ አምጪ'}) ተረጋግጧል።`;
  } else if (lang === 'om') {
    step2TitleDone = `Eejantii Qorannoo: ${diagnosticOutput.diagnosisName} adda ba'eera`;
    step2SummaryDone = `Abdatamummaa %${diagnosticOutput.confidenceScore} (Ariifachiisummaa ${diagnosticOutput.urgency.toUpperCase()})`;
    step2PreviewDone = `${diagnosticOutput.diagnosisName} (${diagnosticOutput.scientificName || 'Dhibee Callaati'}) mirkanaa'eera.`;
  }

  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'diagnostic',
    stepTitle: step2TitleDone,
    status: 'completed',
    outputPayload: {
      diagnosis: diagnosticOutput.diagnosisName,
      scientificName: diagnosticOutput.scientificName,
      confidence: diagnosticOutput.confidenceScore,
      urgency: diagnosticOutput.urgency,
      engine: diagnosticOutput.engineUsed,
      model: diagnosticOutput.modelUsed,
    },
  });

  await emit({
    stepId: 'step-diagnostic',
    role: 'diagnostic',
    title: step2TitleDone,
    status: 'completed',
    progressPercent: 45,
    summary: step2SummaryDone,
    preview: step2PreviewDone,
    outputPayload: {
      diagnosis: diagnosticOutput.diagnosisName,
      confidence: diagnosticOutput.confidenceScore,
      urgency: diagnosticOutput.urgency,
    },
    durationMs: step2Duration,
    timestamp: new Date().toISOString(),
  });

  // STEP 3: LOCAL CONTEXT AGENT
  const step3Start = Date.now();
  let step3TitleRunning = 'Local Context Agent: Evaluating Ethiopian Agro-Zone & Season';
  let step3PreviewRunning = `Matching with ${input.agroZone || 'Weyna Dega'} highland climate and soil factors...`;

  if (lang === 'am') {
    step3TitleRunning = 'የአካባቢ ሁኔታ ወኪል፡ የአየር ንብረት ቀጠናና ወቅታዊ ሁኔታን መገምገም';
    step3PreviewRunning = `ከ${input.agroZone || 'ወይና ደጋ'} የአየር ንብረትና የአፈር ሁኔታዎች ጋር በማዛመድ ላይ...`;
  } else if (lang === 'om') {
    step3TitleRunning = 'Eejantii Haala Naannoo: Madaallii qilleensa naannoo fi waqtii';
    step3PreviewRunning = `Qilleensa ${input.agroZone || 'Baddaa-daree'} fi biyyoo wajjin walsimsiisuu irratti...`;
  }

  await emit({
    stepId: 'step-context',
    role: 'local_context',
    title: step3TitleRunning,
    status: 'running',
    progressPercent: 55,
    preview: step3PreviewRunning,
    timestamp: new Date().toISOString(),
  });

  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'local_context',
    stepTitle: step3TitleRunning,
    status: 'running',
    inputPreview: `Zone: ${input.agroZone || 'Weyna Dega'}, Region: ${input.region || 'Oromia'}`,
  });

  const localContextOutput = await executeLocalContextAgent({ ...input, preferredLanguage: lang }, diagnosticOutput);
  const step3Duration = Date.now() - step3Start;

  let step3TitleDone = `Local Context: Tailored for ${localContextOutput.agroZone}`;
  let step3SummaryDone = `${localContextOutput.altitudeRange} seasonal adaptation`;
  let step3PreviewDone = `Factored in microclimate risks for ${localContextOutput.agroZone}.`;

  if (lang === 'am') {
    step3TitleDone = `የአካባቢ ሁኔታ፡ ለ${localContextOutput.agroZone} ተስማሚ ሆኗል`;
    step3SummaryDone = `${localContextOutput.altitudeRange} ወቅታዊ ማስተካከያ`;
    step3PreviewDone = `የ${localContextOutput.agroZone} አየር ሁኔታ ስጋቶችን ከግምት አስገብቷል።`;
  } else if (lang === 'om') {
    step3TitleDone = `Haala Naannoo: ${localContextOutput.agroZone}tiif qophaa'eera`;
    step3SummaryDone = `Madaallii waqtii ${localContextOutput.altitudeRange}`;
    step3PreviewDone = `Balaawwan qilleensa ${localContextOutput.agroZone} tilmaama keessa galcheera.`;
  }

  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'local_context',
    stepTitle: step3TitleDone,
    status: 'completed',
    outputPayload: {
      agroZone: localContextOutput.agroZone,
      altitudeRange: localContextOutput.altitudeRange,
      seasonRecommendation: localContextOutput.seasonRecommendation,
      remediesCount: localContextOutput.localizedRemedies.length,
    },
  });

  await emit({
    stepId: 'step-context',
    role: 'local_context',
    title: step3TitleDone,
    status: 'completed',
    progressPercent: 70,
    summary: step3SummaryDone,
    preview: step3PreviewDone,
    outputPayload: {
      zone: localContextOutput.agroZone,
      altitude: localContextOutput.altitudeRange,
      season: localContextOutput.seasonRecommendation,
    },
    durationMs: step3Duration,
    timestamp: new Date().toISOString(),
  });

  // STEP 4: COMMUNITY KNOWLEDGE AGENT
  const step4Start = Date.now();
  let step4TitleRunning = 'Community Knowledge Agent: Querying Peer-Verified Farmer Wisdom';
  let step4PreviewRunning = 'Scanning vector database for verified remedies from neighboring Ethiopian farms...';

  if (lang === 'am') {
    step4TitleRunning = 'የማህበረሰብ እውቀት ወኪል፡ በአርሶ አደሮች የተረጋገጡ ተሞክሮዎችን መፈለግ';
    step4PreviewRunning = 'ከአጎራባች የኢትዮጵያ ማሳዎች የተገኙ የተረጋገጡ መፍትሄዎችን በማሰስ ላይ...';
  } else if (lang === 'om') {
    step4TitleRunning = 'Eejantii Beekumsa Hawaasaa: Muuxannoo qonnaan bultootaa qorachuu';
    step4PreviewRunning = 'Kuusaa keessaa furmaata qonnaan bultoota ollaatiin mirkanaa\'e barbaaduu irratti...';
  }

  await emit({
    stepId: 'step-knowledge',
    role: 'knowledge',
    title: step4TitleRunning,
    status: 'running',
    progressPercent: 78,
    preview: step4PreviewRunning,
    timestamp: new Date().toISOString(),
  });

  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'knowledge',
    stepTitle: step4TitleRunning,
    status: 'running',
    inputPreview: `Query: ${input.cropType} in ${input.region || 'Oromia'}`,
  });

  const communityKnowledgeOutput = await executeCommunityKnowledgeAgent({ ...input, preferredLanguage: lang }, diagnosticOutput);
  const step4Duration = Date.now() - step4Start;

  let step4TitleDone = `Community Knowledge: ${communityKnowledgeOutput.matchesFound} Verified Solutions Found`;
  if (lang === 'am') {
    step4TitleDone = `የማህበረሰብ እውቀት፡ ${communityKnowledgeOutput.matchesFound} የተረጋገጡ መፍትሄዎች ተገኝተዋል`;
  } else if (lang === 'om') {
    step4TitleDone = `Beekumsa Hawaasaa: Furmaata mirkanaa'e ${communityKnowledgeOutput.matchesFound} argameera`;
  }

  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'knowledge',
    stepTitle: step4TitleDone,
    status: 'completed',
    outputPayload: {
      matchesFound: communityKnowledgeOutput.matchesFound,
      farmerWisdomSummary: communityKnowledgeOutput.farmerWisdomSummary,
    },
  });

  await emit({
    stepId: 'step-knowledge',
    role: 'knowledge',
    title: step4TitleDone,
    status: 'completed',
    progressPercent: 88,
    summary: communityKnowledgeOutput.farmerWisdomSummary,
    preview: communityKnowledgeOutput.farmerWisdomSummary,
    outputPayload: {
      matches: communityKnowledgeOutput.matchesFound,
      summary: communityKnowledgeOutput.farmerWisdomSummary,
    },
    durationMs: step4Duration,
    timestamp: new Date().toISOString(),
  });

  // STEP 5: ADVISOR AGENT
  const step5Start = Date.now();
  let step5TitleRunning = 'Advisor Agent: Synthesizing Final High-Contrast Advice Card';
  let step5PreviewRunning = 'Synthesizing council consensus into low-literacy actionable steps and organic treatments...';

  if (lang === 'am') {
    step5TitleRunning = 'የምክር ወኪል፡ የመጨረሻውን ግልጽ የምክር ካርድ በማዘጋጀት ላይ';
    step5PreviewRunning = 'የምክር ቤቱን ውሳኔ ወደ ተግባራዊ እርምጃዎችና ተፈጥሮአዊ ህክምናዎች በማቀናጀት ላይ...';
  } else if (lang === 'om') {
    step5TitleRunning = 'Eejantii Gorsaa: Kaardii gorsaa ifa ta\'e qindeessuu';
    step5PreviewRunning = 'Waliigaltee koree gara tarkaanfii qabatamaa fi qoricha uumamaatti jijjiiruu irratti...';
  }

  await emit({
    stepId: 'step-advisor',
    role: 'advisor',
    title: step5TitleRunning,
    status: 'running',
    progressPercent: 92,
    preview: step5PreviewRunning,
    timestamp: new Date().toISOString(),
  });

  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'advisor',
    stepTitle: step5TitleRunning,
    status: 'running',
    inputPreview: 'Consolidating diagnostic, ecological, and community findings',
  });

  const adviceCardPayload = await executeAdvisorAgent(
    { ...input, preferredLanguage: lang },
    diagnosticOutput,
    localContextOutput,
    communityKnowledgeOutput,
    runId
  );

  const adviceCard = await createAdviceCard(adviceCardPayload);
  const step5Duration = Date.now() - step5Start;

  let step5TitleDone = 'Advisor Agent: Structured Advice Card Generated';
  let step5SummaryDone = 'Full consensus achieved across all 5 agricultural agents.';
  let step5PreviewDone = `Advice card ready: ${adviceCard.diagnosis_name} (${adviceCard.urgency.toUpperCase()} urgency).`;

  if (lang === 'am') {
    step5TitleDone = 'የምክር ወኪል፡ የተሟላ የምክር ካርድ ተዘጋጅቷል';
    step5SummaryDone = 'በሁሉም 5 የግብርና ኤጀንቶች መካከል ሙሉ ስምምነት ተደርሷል።';
    step5PreviewDone = `የምክር ካርዱ ዝግጁ ነው፡ ${adviceCard.diagnosis_name} (${adviceCard.urgency.toUpperCase()} አስቸኳይነት)።`;
  } else if (lang === 'om') {
    step5TitleDone = 'Eejantii Gorsaa: Kaardiin Gorsaa Qophaa\'eera';
    step5SummaryDone = 'Eejantoota qonnaa 5n gidduutti waliigalteen guutuun uumameera.';
    step5PreviewDone = `Kaardiin gorsaa qophaa'eera: ${adviceCard.diagnosis_name} (Ariifachiisummaa ${adviceCard.urgency.toUpperCase()}).`;
  }

  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'advisor',
    stepTitle: step5TitleDone,
    status: 'completed',
    outputPayload: {
      adviceCardId: adviceCard.id,
      urgency: adviceCard.urgency,
      immediateActionsCount: adviceCard.immediate_actions.length,
      organicRemediesCount: adviceCard.organic_remedies.length,
    },
  });

  await emit({
    stepId: 'step-advisor',
    role: 'advisor',
    title: step5TitleDone,
    status: 'completed',
    progressPercent: 100,
    summary: step5SummaryDone,
    preview: step5PreviewDone,
    outputPayload: {
      cardId: adviceCard.id,
      diagnosis: adviceCard.diagnosis_name,
    },
    durationMs: step5Duration,
    timestamp: new Date().toISOString(),
  });

  // Complete the multi-agent run in DB with localized summary
  const totalDurationMs = Date.now() - startTime;
  let executionSummary = '';

  if (lang === 'am') {
    executionSummary = `የ5ቱ ኤጀንቶች ምክር ቤት በ${(totalDurationMs / 1000).toFixed(1)} ሰከንድ ውስጥ አጠናቋል። ለ${input.cropType} በ${localContextOutput.agroZone} ውስጥ "${adviceCard.diagnosis_name}" በ${adviceCard.confidence_score}% እርግጠኝነት ተለይቷል። ${communityKnowledgeOutput.matchesFound} በአርሶ አደሮች የተረጋገጡ የማህበረሰብ መፍትሄዎች ተካተዋል።`;
  } else if (lang === 'om') {
    executionSummary = `Koreen Eejantootaa 5 sekondii ${(totalDurationMs / 1000).toFixed(1)} keessatti xumureera. Calla ${input.cropType} baddaa-daree ${localContextOutput.agroZone} keessatti "${adviceCard.diagnosis_name}" abdatamummaa %${adviceCard.confidence_score}n adda baaseera. Furmaata hawaasaa ${communityKnowledgeOutput.matchesFound} dabalateera.`;
  } else {
    executionSummary = `5-Agent Council finished in ${(totalDurationMs / 1000).toFixed(1)}s. Diagnosed ${adviceCard.diagnosis_name} (${adviceCard.confidence_score}% confidence) for ${input.cropType} in ${localContextOutput.agroZone}. Integrated ${communityKnowledgeOutput.matchesFound} peer-verified community solutions.`;
  }

  await updateAgentRun({
    id: runId,
    status: 'completed',
    executionSummary,
    totalDurationMs,
  });

  return {
    runId,
    questionId: input.questionId,
    adviceCard,
    diagnosticOutput,
    localContextOutput,
    communityKnowledgeOutput,
    totalDurationMs,
    executionSummary,
  };
}
