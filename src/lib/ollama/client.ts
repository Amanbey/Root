/**
 * Ollama Local AI Client Configuration & Helper
 * Connects to local Ollama instance (default: http://localhost:11434)
 */

export interface OllamaStatus {
  isAvailable: boolean;
  model: string;
  availableModels: string[];
  latencyMs?: number;
  error?: string;
}

export function getOllamaBaseUrl(): string {
  return process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
}

export function getOllamaModel(): string {
  return process.env.OLLAMA_MODEL || 'llama3.1:8b';
}

/**
 * Checks if local Ollama daemon is reachable and which models are installed
 */
export async function checkOllamaHealth(): Promise<OllamaStatus> {
  const baseUrl = getOllamaBaseUrl();
  const configuredModel = getOllamaModel();
  const startTime = Date.now();

  try {
    const res = await fetch(`${baseUrl}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000), // 3 second timeout for local check
    });

    if (!res.ok) {
      return {
        isAvailable: false,
        model: configuredModel,
        availableModels: [],
        error: `Ollama returned HTTP ${res.status}`,
      };
    }

    const data = (await res.json()) as { models?: Array<{ name: string }> };
    const availableModels = (data.models || []).map((m) => m.name);

    return {
      isAvailable: true,
      model: configuredModel,
      availableModels,
      latencyMs: Date.now() - startTime,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Connection failed';
    return {
      isAvailable: false,
      model: configuredModel,
      availableModels: [],
      error: `Could not reach Ollama at ${baseUrl} (${errorMsg})`,
    };
  }
}
