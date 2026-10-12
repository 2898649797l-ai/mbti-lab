import { useDraftStore } from '../composables/useDraftStore.js'
import { useResultStore } from '../composables/useResultStore.js'
import { useSceneStore, sceneResultKey } from '../composables/useSceneStore.js'
import { sceneTests } from '../data/testRegistry.js'

// Read each entry independently: one denied/corrupt key must not hide other tests.
export function readLocalResults() {
  const drafts = [], results = [], issues = []
  const personality = useDraftStore().load()
  if (personality.draft) drafts.push({ id: 'personality', ...personality.draft, path: '/test' })
  if (personality.invalid) issues.push('invalid')
  let available = personality.available
  function persistent(key, entry) {
    try { return JSON.stringify(JSON.parse(localStorage.getItem(key))) === JSON.stringify(entry) }
    catch { available = false; return false }
  }
  const result = useResultStore().peek()
  if (result) results.push({ id: 'personality', ...result, path: '/result', saved: persistent('mbti_lab_result', result) })
  const scenes = useSceneStore()
  for (const id of Object.keys(sceneTests)) {
    const state = scenes.loadDraft(id)
    available &&= state.available
    if (state.invalid) issues.push(id)
    if (state.draft) drafts.push({ id, ...state.draft, path: '/quiz/' + id })
    const entry = scenes.readResult(id)
    if (entry) results.push({ id, ...entry, path: '/quiz/' + id + '/result', saved: persistent(sceneResultKey(id), entry) })
  }
  results.sort((a, b) => (Number.isFinite(b.completedAt) ? b.completedAt : 0) - (Number.isFinite(a.completedAt) ? a.completedAt : 0))
  return { drafts, results, available, issues }
}
