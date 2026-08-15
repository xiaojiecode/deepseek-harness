/** OpenCode Zen/Go management endpoints and defensive response parsing. */

import { INVALID_CREDENTIAL_CODE, LlmError, normalizeApiKey } from '@deepseek-ai/dsh-llm'
import type {
  LlmDiscoveredModel,
  LlmSubscriptionUsageSnapshot,
  LlmSubscriptionUsageWindow,
} from '@deepseek-ai/dsh-llm'
import { attributionHeaders } from '@deepseek-ai/dsh-llm'
import { catalogModels } from './catalog.ts'
import type { PiAiModelProfile } from './config.ts'

export const OPENCODE_GO_MODELS_URL = 'https://opencode.ai/zen/go/v1/models'
export const OPENCODE_GO_USAGE_URL = 'https://opencode.ai/zen/go/v1/usage'

const MAX_RESPONSE_BYTES = 4 * 1024 * 1024

function checkedKey(raw: string): string {
  const result = normalizeApiKey(raw)
  if (result.ok) return result.value
  throw new LlmError('OpenCode API key is invalid', INVALID_CREDENTIAL_CODE)
}

async function readJson(response: Response, url: string, signal?: AbortSignal): Promise<unknown> {
  if (!response.ok) {
    if (response.status === 401) throw new LlmError('OpenCode API key is invalid', 'INVALID_CREDENTIAL')
    if (response.status === 403) throw new LlmError('OpenCode Go subscription is not active', 'GO_SUBSCRIPTION_REQUIRED')
    throw new LlmError(`OpenCode answered ${response.status}`, 'USAGE_QUERY_FAILED')
  }
  if (signal?.aborted) throw new LlmError('OpenCode request aborted', 'ABORTED')
  const length = Number(response.headers.get('content-length') ?? Number.NaN)
  if (Number.isFinite(length) && length > MAX_RESPONSE_BYTES) throw new LlmError('OpenCode response is too large', 'USAGE_QUERY_FAILED')
  const text = await response.text()
  if (text.length > MAX_RESPONSE_BYTES) throw new LlmError('OpenCode response is too large', 'USAGE_QUERY_FAILED')
  try { return JSON.parse(text) } catch (error) {
    throw new LlmError(`OpenCode ${url} did not answer with JSON`, 'USAGE_QUERY_FAILED', { cause: error })
  }
}

async function get(url: string, apiKey: string, signal?: AbortSignal): Promise<unknown> {
  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json', authorization: `Bearer ${checkedKey(apiKey)}`, ...attributionHeaders() },
      ...signal === undefined ? {} : { signal },
    })
    return await readJson(response, url, signal)
  } catch (error) {
    if (signal?.aborted) throw new LlmError('OpenCode request aborted', 'ABORTED', { cause: error })
    if (error instanceof LlmError) throw error
    throw new LlmError('OpenCode request failed', 'USAGE_QUERY_FAILED', { cause: error })
  }
}

function positive(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : undefined
}

function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

/** Parse the OpenAI-compatible model listing used by Zen Go. */
export function parseOpenCodeGoModels(body: unknown): LlmDiscoveredModel[] {
  const rows = (body as { data?: unknown } | null)?.data
  if (!Array.isArray(rows)) throw new LlmError('OpenCode model listing is invalid', 'USAGE_QUERY_FAILED')
  const seen = new Set<string>()
  return rows.flatMap((row) => {
    const item = row as Record<string, unknown> | null
    const id = text(item?.id)
    if (id === undefined || seen.has(id)) return []
    seen.add(id)
    const name = text(item?.name)
    return [{ id, ...name === undefined ? {} : { name } }]
  })
}

/** Fetch the current Go model ids for connection validation and sync. */
export async function fetchOpenCodeGoModels(apiKey: string, signal?: AbortSignal): Promise<LlmDiscoveredModel[]> {
  return parseOpenCodeGoModels(await get(OPENCODE_GO_MODELS_URL, apiKey, signal))
}

/** Convert a management listing to locally known pi-ai model metadata. */
export function importOpenCodeGoModels(listed: readonly LlmDiscoveredModel[]): PiAiModelProfile[] {
  const known = catalogModels('opencode-go')
  return listed.flatMap((model) => {
    const base = known.get(model.id)
    if (base === undefined) return []
    return [{
      id: model.id,
      name: base.name,
      contextWindow: base.contextWindow,
      maxTokens: base.maxTokens,
      input: [...base.input],
      ...base.reasoning ? {} : { reasoningEfforts: false as const },
    }]
  })
}

function usageWindow(id: '5h' | '1w' | '1m', raw: unknown): LlmSubscriptionUsageWindow | undefined {
  const row = raw as Record<string, unknown> | null
  if (row === null || typeof row !== 'object') return undefined
  const used = positive(row.used ?? row.usage ?? row.consumed)
  const limit = positive(row.limit ?? row.total ?? row.max)
  const percent = positive(row.percent ?? row.percentage ?? row.usedPercent)
    ?? (used !== undefined && limit !== undefined && limit > 0 ? (used / limit) * 100 : undefined)
  if (percent === undefined || percent > 100) return undefined
  const resetValue = row.resetsAt ?? row.resetAt ?? row.reset_at
  const resetsAt = text(resetValue)
    ?? (typeof resetValue === 'number' && Number.isFinite(resetValue)
      ? new Date(resetValue < 10_000_000_000 ? resetValue * 1000 : resetValue).toISOString()
      : undefined)
  return { id, percent, status: row.status === 'rate-limited' ? 'rate-limited' : 'ok', ...resetsAt === undefined ? {} : { resetsAt } }
}

/** Parse the management usage payload into the stable host contract. */
export function parseOpenCodeGoUsage(body: unknown, fetchedAt = new Date().toISOString()): LlmSubscriptionUsageSnapshot {
  const root = body as Record<string, unknown> | null
  const source = (root?.windows ?? root?.usage ?? root?.limits ?? root?.data ?? root) as Record<string, unknown> | null
  const aliases: Record<'5h' | '1w' | '1m', string[]> = {
    // OpenCode Go calls the rolling five-hour window "rolling" in its
    // management response; keep the descriptive aliases for compatibility
    // with older/proxy responses.
    '5h': ['rolling', '5h', 'fiveHour', 'five_hour', 'hour', 'hourly'],
    '1w': ['1w', 'week', 'weekly'],
    '1m': ['1m', 'month', 'monthly'],
  }
  const windows = (['5h', '1w', '1m'] as const).flatMap((id) => {
    const row = aliases[id].map(key => usageWindow(id, source?.[key])).find(value => value !== undefined)
    return row === undefined ? [] : [row]
  })
  if (windows.length !== 3) throw new LlmError('OpenCode usage response is invalid', 'USAGE_QUERY_FAILED')
  return { provider: 'opencode-go', fetchedAt, windows }
}

/** Fetch and normalize current Go subscription usage. */
export async function fetchOpenCodeGoUsage(apiKey: string, signal?: AbortSignal): Promise<LlmSubscriptionUsageSnapshot> {
  return parseOpenCodeGoUsage(await get(OPENCODE_GO_USAGE_URL, apiKey, signal))
}
