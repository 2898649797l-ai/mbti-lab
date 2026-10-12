import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
let store, keys
beforeEach(async () => {
  vi.resetModules()
  localStorage.clear()
  const module = await import('../src/composables/useSceneStore.js')
  store = module.useSceneStore()
  keys = module
})
afterEach(() => vi.unstubAllGlobals())
describe('independent per-test storage', () => {
  it('restores selected answers and backtracking without affecting other drafts or old MBTI data', () => {
    localStorage.setItem('mbti_lab_result', 'old-mbti-result')
    const a = Array(12).fill(null)
    a[0] = 5
    a[1] = 2
    store.saveDraft('chat', a, 1)
    store.saveDraft('repair', Array(12).fill(null), 0)
    a[0] = 1
    store.saveDraft('chat', a, 0)
    expect(store.loadDraft('chat').draft.answers.slice(0, 2)).toEqual([1, 2])
    store.clearDraft('chat')
    expect(store.loadDraft('repair').draft.currentIndex).toBe(0)
    expect(localStorage.getItem('mbti_lab_result')).toBe('old-mbti-result')
  })
  it.each([
    '{broken',
    JSON.stringify({
      testId: 'chat',
      version: '0',
      answers: Array(12).fill(null),
      currentIndex: 0,
    }),
    JSON.stringify({
      testId: 'repair',
      version: '1',
      answers: Array(12).fill(null),
      currentIndex: 0,
    }),
    JSON.stringify({
      testId: 'chat',
      version: '1',
      answers: Array(12).fill(null),
      currentIndex: 5,
    }),
  ])('rejects damaged, incompatible or mismatched drafts', (raw) => {
    localStorage.setItem(keys.sceneDraftKey('chat'), raw)
    expect(store.loadDraft('chat').invalid).toBe(true)
    expect(store.loadDraft('chat').draft).toBeNull()
  })
  it('a new unsaved result wins over old stored results and remains usable in memory', () => {
    const previous = JSON.stringify({ testId: 'chat', version: '1', scores: [0, 0] })
    vi.stubGlobal('localStorage', {
      getItem: () => previous,
      setItem() {
        throw new Error('quota')
      },
      removeItem() {
        throw new Error('blocked')
      },
    })
    expect(store.saveResult({ testId: 'chat', version: '1', scores: [50, 50] })).toBe(false)
    expect(store.readResult('chat').scores).toEqual([50, 50])
    expect(store.saveDraft('repair', Array(12).fill(null), 0)).toBe(false)
    expect(store.loadDraft('repair').available).toBe(false)
    expect(store.loadDraft('repair').draft).not.toBeNull()
  })
  it('separates recent results, ignores invalid versions and never writes raw answers into results', () => {
    store.saveResult({ testId: 'chat', version: '1', scores: [50, 75] })
    store.saveResult({ testId: 'repair', version: '1', scores: [100, 0] })
    expect(store.readResult('chat').scores).toEqual([50, 75])
    expect(store.readResult('repair').scores).toEqual([100, 0])
    localStorage.setItem(
      keys.sceneResultKey('boundaries'),
      JSON.stringify({ testId: 'boundaries', version: '0', scores: [50, 50] }),
    )
    expect(store.readResult('boundaries')).toBeNull()
    expect(JSON.parse(localStorage.getItem(keys.sceneResultKey('chat'))).answers).toBeUndefined()
  })
})
