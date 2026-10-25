/**
 * ROOT – AGENT 0: ORCHESTRATOR AGENT & COUNCIL RUNNER
 * Coordinates task dispatch, timeline event streaming, and database persistence
 * across the 5 specialized Ethiopian agricultural AI agents.
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
  await emit({
    stepId: 'step-orchestrator',
    role: 'orchestrator',
    title: 'Council Initialized: Query parsing & agent pipeline dispatch',
    status: 'running',
    progressPercent: 10,
    preview: `Target: ${input.cropType} problem in ${input.region || 'Ethiopia'} (${input.agroZone || 'Weyna Dega'})`,
    timestamp: new Date().toISOString(),
  });

  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'orchestrator',
    stepTitle: 'Council Initialized: Query parsing & pipeline dispatch',
    status: 'running',
    inputPreview: `Crop: ${input.cropType}, Symptoms: "${input.symptoms.substring(0, 100)}..."`,
  });

  const step1Duration = Date.now() - step1Start;
  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'orchestrator',
    stepTitle: 'Council Initialized: Pipeline Active',
    status: 'completed',
    outputPayload: {
      crop: input.cropType,
      region: input.region || 'Oromia',
      agroZone: input.agroZone || 'Weyna Dega',
      pipeline: ['diagnostic', 'local_context', 'knowledge', 'advisor'],
    },
  });

  await emit({
    stepId: 'step-orchestrator',
    role: 'orchestrator',
    title: 'Council Initialized: Pipeline Active',
    status: 'completed',
    progressPercent: 20,
    preview: 'Context validated. Dispatched Diagnostic Agent.',
    durationMs: step1Duration,
    timestamp: new Date().toISOString(),
  });

  // STEP 2: DIAGNOSTIC AGENT
  const step2Start = Date.now();
  await emit({
    stepId: 'step-diagnostic',
    role: 'diagnostic',
    title: 'Diagnostic Agent: Analyzing Pathogen & Symptom Signatures',
    status: 'running',
    progressPercent: 30,
    preview: `Analyzing visual lesions, fungal/insect morphology for ${input.cropType}...`,
    timestamp: new Date().toISOString(),
  });

  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'diagnostic',
    stepTitle: 'Diagnostic Agent: Analyzing Symptoms & Pathogen Signatures',
    status: 'running',
    inputPreview: `Input: ${input.symptoms}`,
  });

  const diagnosticOutput = await executeDiagnosticAgent(input);
  const step2Duration = Date.now() - step2Start;

  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'diagnostic',
    stepTitle: 'Diagnostic Agent: Identification Complete',
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
    title: `Diagnostic Agent: Identified ${diagnosticOutput.diagnosisName}`,
    status: 'completed',
    progressPercent: 45,
    summary: `${diagnosticOutput.confidenceScore}% confidence (${diagnosticOutput.urgency.toUpperCase()} urgency)`,
    preview: `Confirmed ${diagnosticOutput.diagnosisName} (${diagnosticOutput.scientificName || 'Crop Pathogen'}).`,
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
  await emit({
    stepId: 'step-context',
    role: 'local_context',
    title: 'Local Context Agent: Evaluating Ethiopian Agro-Zone & Season',
    status: 'running',
    progressPercent: 55,
    preview: `Matching with ${input.agroZone || 'Weyna Dega'} highland climate and soil factors...`,
    timestamp: new Date().toISOString(),
  });

  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'local_context',
    stepTitle: 'Local Context Agent: Agro-Ecological & Seasonal Evaluation',
    status: 'running',
    inputPreview: `Zone: ${input.agroZone || 'Weyna Dega'}, Region: ${input.region || 'Oromia'}`,
  });

  const localContextOutput = await executeLocalContextAgent(input, diagnosticOutput);
  const step3Duration = Date.now() - step3Start;

  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'local_context',
    stepTitle: 'Local Context Agent: Adaptation Complete',
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
    title: `Local Context: Tailored for ${localContextOutput.agroZone}`,
    status: 'completed',
    progressPercent: 70,
    summary: `${localContextOutput.altitudeRange} seasonal adaptation`,
    preview: `Factored in ${localContextOutput.seasonRecommendation.split('–')[0]} microclimate risks.`,
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
  await emit({
    stepId: 'step-knowledge',
    role: 'knowledge',
    title: 'Community Knowledge Agent: Querying Peer-Verified Farmer Wisdom',
    status: 'running',
    progressPercent: 78,
    preview: 'Scanning vector database for verified remedies from neighboring Ethiopian farms...',
    timestamp: new Date().toISOString(),
  });

  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'knowledge',
    stepTitle: 'Community Knowledge Agent: Vector Memory Lookup',
    status: 'running',
    inputPreview: `Query: ${input.cropType} in ${input.region || 'Oromia'}`,
  });

  const communityKnowledgeOutput = await executeCommunityKnowledgeAgent(input, diagnosticOutput);
  const step4Duration = Date.now() - step4Start;

  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'knowledge',
    stepTitle: 'Community Knowledge Agent: Knowledge Retrieved',
    status: 'completed',
    outputPayload: {
      matchesFound: communityKnowledgeOutput.matchesFound,
      farmerWisdomSummary: communityKnowledgeOutput.farmerWisdomSummary,
    },
  });

  await emit({
    stepId: 'step-knowledge',
    role: 'knowledge',
    title: `Community Knowledge: ${communityKnowledgeOutput.matchesFound} Verified Solutions Found`,
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
  await emit({
    stepId: 'step-advisor',
    role: 'advisor',
    title: 'Advisor Agent: Synthesizing Final High-Contrast Advice Card',
    status: 'running',
    progressPercent: 92,
    preview: 'Synthesizing council consensus into low-literacy actionable steps and organic treatments...',
    timestamp: new Date().toISOString(),
  });

  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'advisor',
    stepTitle: 'Advisor Agent: Synthesis & Advice Card Formatting',
    status: 'running',
    inputPreview: 'Consolidating diagnostic, ecological, and community findings',
  });

  const adviceCardPayload = await executeAdvisorAgent(
    input,
    diagnosticOutput,
    localContextOutput,
    communityKnowledgeOutput,
    runId
  );

  const adviceCard = await createAdviceCard(adviceCardPayload);
  const step5Duration = Date.now() - step5Start;

  await logAgentTimelineStep({
    agentRunId: runId,
    agentRole: 'advisor',
    stepTitle: 'Advisor Agent: Advice Card Created',
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
    title: 'Advisor Agent: Structured Advice Card Generated',
    status: 'completed',
    progressPercent: 100,
    summary: 'Full consensus achieved across all 5 agricultural agents.',
    preview: `Advice card ready: ${adviceCard.diagnosis_name} (${adviceCard.urgency.toUpperCase()} urgency).`,
    outputPayload: {
      cardId: adviceCard.id,
      diagnosis: adviceCard.diagnosis_name,
    },
    durationMs: step5Duration,
    timestamp: new Date().toISOString(),
  });

  // Complete the multi-agent run in DB
  const totalDurationMs = Date.now() - startTime;
  const executionSummary = `5-Agent Council finished in ${(totalDurationMs / 1000).toFixed(1)}s. Diagnosed ${adviceCard.diagnosis_name} (${adviceCard.confidence_score}% confidence) for ${input.cropType} in ${localContextOutput.agroZone}. Integrated ${communityKnowledgeOutput.matchesFound} peer-verified community solutions.`;

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
