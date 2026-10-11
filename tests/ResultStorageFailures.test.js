import { describe, it, expect, afterEach, vi } from 'vitest'
import { useResultStore } from '../src/composables/useResultStore.js'
const old = {
  type: 'INFP',
  percents: {
    EI: { E: 30, I: 70 },
    NS: { N: 65, S: 35 },
    FT: { F: 60, T: 40 },
    JP: { J: 45, P: 55 },
  },
}
const latest = { ...old, type: 'ENFP' }
afterEach(() => vi.unstubAllGlobals())
describe('result storage failure recovery', () => {
  it('a blocked session write does not display an older result', () => {
    const map = new Map()
    vi.stubGlobal('sessionStorage', {
      getItem: () => JSON.stringify(old),
      setItem: () => {
        throw Error('quota')
      },
      removeItem: vi.fn(),
    })
    vi.stubGlobal('localStorage', {
      getItem: (k) => map.get(k) ?? null,
      setItem: (k, v) => map.set(k, v),
    })
    const store = useResultStore()
    expect(store.submit(latest)).toBe(true)
    expect(store.load().type).toBe('ENFP')
  })
  it('keeps an in-memory result when every storage operation is denied', () => {
    const denied = () => {
      throw Error('denied')
    }
    vi.stubGlobal('sessionStorage', { getItem: denied, setItem: denied, removeItem: denied })
    vi.stubGlobal('localStorage', { getItem: denied, setItem: denied })
    const store = useResultStore()
    expect(store.submit(latest)).toBe(false)
    expect(store.load().type).toBe('ENFP')
    expect(store.load().type).toBe('ENFP')
  })
})
