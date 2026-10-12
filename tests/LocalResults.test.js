import { describe, it, beforeEach, expect, vi, afterEach } from 'vitest'
import { readLocalResults } from '../src/utils/localResults.js'
import { useSceneStore, sceneResultKey } from '../src/composables/useSceneStore.js'
import { useDraftStore } from '../src/composables/useDraftStore.js'
const scenes = useSceneStore()
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); ['chat','boundaries','repair'].forEach(id => scenes.clearDraft(id)) })
afterEach(() => vi.restoreAllMocks())
describe('local result center', () => {
  it('has an honest empty state', () => { expect(readLocalResults().drafts).toEqual([]); expect(readLocalResults().results).toEqual([]) })
  it('keeps drafts alongside results and sorts undated old records last', () => {
    useDraftStore().save('short', Array(60).fill(null), 0)
    for (const [id, completedAt] of [['chat',20],['repair',40],['boundaries',undefined]]) {
      localStorage.setItem(sceneResultKey(id), JSON.stringify({ testId:id,version:'1',scores:[50,50],...(completedAt ? {completedAt} : {}) }))
    }
    const state = readLocalResults()
    expect(state.drafts[0].id).toBe('personality')
    expect(state.results.map(r=>r.id)).toEqual(['repair','chat','boundaries'])
  })
  it('does not hide readable entries when another key fails', () => {
    localStorage.setItem(sceneResultKey('repair'), JSON.stringify({testId:'repair',version:'1',scores:[50,50]}))
    const read = Storage.prototype.getItem
    vi.spyOn(Storage.prototype,'getItem').mockImplementation(function(key){ if(key.includes('chat')) throw Error('denied'); return read.call(this,key) })
    expect(readLocalResults().available).toBe(false)
    expect(readLocalResults().results.map(r=>r.id)).toContain('repair')
  })
})
