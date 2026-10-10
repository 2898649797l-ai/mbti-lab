import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.resetModules()
})

describe('deployment share address', () => {
  it.each([
    ['https://personality-preview.pages.dev', '/', 'https://personality-preview.pages.dev/'],
    ['https://personality.example', '/', 'https://personality.example/'],
    ['https://owner.github.io', '/mbti-lab/', 'https://owner.github.io/mbti-lab/'],
  ])('uses %s with base %s', async (origin, base, expected) => {
    vi.resetModules()
    vi.stubEnv('BASE_URL', base)
    vi.stubGlobal('window', { location: { origin, href: `${origin}/#/result` } })
    const { APP_URL } = await import('../src/config.js')
    expect(APP_URL).toBe(expected)
  })
})
