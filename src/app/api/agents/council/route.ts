/**
 * ROOT – MULTI-AGENT COUNCIL SSE STREAMING ROUTE
 * Streams real-time timeline steps and deliberations to the browser via Server-Sent Events.
 */

import { NextRequest } from 'next/server';
import { runAgriculturalCouncil } from '@/lib/agents/orchestrator';
import { CouncilContextInput, CouncilStepEvent } from '@/lib/agents/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CouncilContextInput;

    if (!body.cropType || !body.symptoms) {
      return new Response(JSON.stringify({ error: 'Missing required cropType or symptoms' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (eventName: string, data: unknown) => {
          const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        };

        try {
          const result = await runAgriculturalCouncil(body, {
            onEvent: (event: CouncilStepEvent) => {
              sendEvent('step', event);
            },
          });

          sendEvent('complete', {
            success: true,
            runId: result.runId,
            questionId: result.questionId,
            adviceCardId: result.adviceCard.id,
            diagnosisName: result.adviceCard.diagnosis_name,
            totalDurationMs: result.totalDurationMs,
            executionSummary: result.executionSummary,
          });

          controller.close();
        } catch (err: unknown) {
          const errorMsg = err instanceof Error ? err.message : 'Council execution error';
          sendEvent('error', { error: errorMsg });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
