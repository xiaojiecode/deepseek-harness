import { describe, expect, it, vi } from 'vitest'
import {
  OPENCODE_GO_MODELS_URL,
  fetchOpenCodeGoModels,
  fetchOpenCodeGoUsage,
  parseOpenCodeGoModels,
  parseOpenCodeGoUsage,
} from '../src/opencode.ts'

describe('OpenCode Go management endpoints', () => {
  it('parses and de-duplicates model ids', () => {
    expect(parseOpenCodeGoModels({ data: [{ id: 'a' }, { id: 'a' }, { id: '' }, { id: 'b', name: 'Bee' }] })).toEqual([
      { id: 'a' }, { id: 'b', name: 'Bee' },
    ])
  })

  it('parses usage percentages from direct and used/limit windows', () => {
    expect(parseOpenCodeGoUsage({ usage: {
      fiveHour: { used: 5, limit: 10, resetAt: '2026-01-01T00:00:00Z' },
      week: { percent: 20 },
      month: { percentage: 30, status: 'rate-limited' },
    } }, '2026-01-01T00:00:00Z')).toEqual({
      provider: 'opencode-go', fetchedAt: '2026-01-01T00:00:00Z', windows: [
        { id: '5h', percent: 50, status: 'ok', resetsAt: '2026-01-01T00:00:00Z' },
        { id: '1w', percent: 20, status: 'ok' },
        { id: '1m', percent: 30, status: 'rate-limited' },
      ],
    })
  })

  it('parses the official Go rolling, weekly, and monthly response shape', () => {
    expect(parseOpenCodeGoUsage({ usage: {
      rolling: { percent: 12, status: 'ok', resetsAt: '2026-01-01T05:00:00Z' },
      weekly: { percent: 34, status: 'ok', resetsAt: '2026-01-07T00:00:00Z' },
      monthly: { percent: 56, status: 'rate-limited', resetsAt: '2026-02-01T00:00:00Z' },
    } }, '2026-01-01T00:00:00Z')).toEqual({
      provider: 'opencode-go', fetchedAt: '2026-01-01T00:00:00Z', windows: [
        { id: '5h', percent: 12, status: 'ok', resetsAt: '2026-01-01T05:00:00Z' },
        { id: '1w', percent: 34, status: 'ok', resetsAt: '2026-01-07T00:00:00Z' },
        { id: '1m', percent: 56, status: 'rate-limited', resetsAt: '2026-02-01T00:00:00Z' },
      ],
    })
  })

  it('maps 401 and 403 to credential-specific failures without leaking the key', async () => {
    const fetch = vi.fn((url: string) => Promise.resolve(new Response('{}', { status: url === OPENCODE_GO_MODELS_URL ? 401 : 403 })))
    vi.stubGlobal('fetch', fetch)
    await expect(fetchOpenCodeGoModels('secret-key')).rejects.toMatchObject({ code: 'INVALID_CREDENTIAL' })
    await expect(fetchOpenCodeGoUsage('secret-key')).rejects.toMatchObject({ code: 'GO_SUBSCRIPTION_REQUIRED' })
    expect(fetch).toHaveBeenCalledWith(OPENCODE_GO_MODELS_URL, expect.anything())
    vi.unstubAllGlobals()
  })
})
