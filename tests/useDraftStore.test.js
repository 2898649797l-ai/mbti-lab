import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  useDraftStore,
  DRAFT_KEY,
  QUESTIONNAIRE_VERSION,
  questionsForMode,
} from '../src/composables/useDraftStore.js'
let storage
beforeEach(() => {
  const map = new Map()
  storage = {
    getItem: vi.fn((k) => map.get(k) ?? null),
    setItem: vi.fn((k, v) => map.set(k, v)),
    removeItem: vi.fn((k) => map.delete(k)),
  }
  vi.stubGlobal('localStorage', storage)
})
afterEach(() => vi.unstubAllGlobals())
const draft = (mode = 'short') => ({
  version: QUESTIONNAIRE_VERSION,
  mode,
  currentIndex: 2,
  answers: questionsForMode(mode).map((_, i) => (i < 2 ? 'a' : null)),
})
describe('draft persistence', () => {
  it.each(['short', 'full'])('round-trips %s mode and edited answers', (mode) => {
    const store = useDraftStore(),
      d = draft(mode)
    d.answers[0] = 'b'
    expect(store.save(mode, d.answers, d.currentIndex)).toBe(true)
    expect(store.load().draft).toEqual(d)
    expect(store.clear()).toBe(true)
    expect(store.load().draft).toBeNull()
  })
  it.each([
    ['malformed JSON', '{oops'],
    ['old version', { ...draft(), version: 'old' }],
    ['wrong mode', { ...draft(), mode: 'unknown' }],
    ['wrong length', { ...draft(), answers: ['a'] }],
    ['invalid answer', { ...draft(), answers: draft().answers.map((v, i) => (i === 0 ? 'x' : v)) }],
    ['cursor out of bounds', { ...draft(), currentIndex: 60 }],
    ['gap before cursor', { ...draft(), currentIndex: 5 }],
  ])('rejects and removes %s', (_, d) => {
    storage.setItem(DRAFT_KEY, typeof d === 'string' ? d : JSON.stringify(d))
    expect(useDraftStore().load()).toEqual({ draft: null, invalid: true, available: true })
    expect(storage.getItem(DRAFT_KEY)).toBeNull()
  })
  it('does not throw when reads, writes or deletes are blocked', () => {
    for (const method of ['getItem', 'setItem', 'removeItem'])
      storage[method].mockImplementation(() => {
        throw new Error('blocked')
      })
    const store = useDraftStore()
    expect(store.load()).toEqual({ draft: null, invalid: false, available: false })
    expect(store.save('short', draft().answers, 2)).toBe(false)
    expect(store.clear()).toBe(false)
  })
})
