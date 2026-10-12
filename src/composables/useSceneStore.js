import { getSceneDefinition, validSceneResult } from '../data/testRegistry.js'
const resultMemory = new Map(),
  draftMemory = new Map()
export const sceneDraftKey = (id) => 'personality_scene_draft_' + id
export const sceneResultKey = (id) => 'personality_scene_result_' + id
const clone = (value) => JSON.parse(JSON.stringify(value))
function validDraft(d, id) {
  const test = getSceneDefinition(id, d?.version)
  return (
    !!test &&
    d.testId === id &&
    Array.isArray(d.answers) &&
    d.answers.length === test.questions.length &&
    Number.isInteger(d.currentIndex) &&
    d.currentIndex >= 0 &&
    d.currentIndex < test.questions.length &&
    d.answers.every((a) => a === null || (Number.isInteger(a) && a >= 1 && a <= 5)) &&
    d.answers.slice(0, d.currentIndex).every((a) => a !== null)
  )
}
export function useSceneStore() {
  function clearDraft(id) {
    draftMemory.delete(id)
    try {
      localStorage.removeItem(sceneDraftKey(id))
      return true
    } catch {
      return false
    }
  }
  function loadDraft(id) {
    if (draftMemory.has(id))
      return { draft: clone(draftMemory.get(id)), invalid: false, available: false }
    let raw
    try {
      raw = localStorage.getItem(sceneDraftKey(id))
    } catch {
      return { draft: null, invalid: false, available: false }
    }
    if (raw === null) return { draft: null, invalid: false, available: true }
    try {
      const d = JSON.parse(raw)
      if (validDraft(d, id) && d.version === getSceneDefinition(id)?.version)
        return { draft: d, invalid: false, available: true }
    } catch {
      /* reject damaged data */
    }
    return { draft: null, invalid: true, available: clearDraft(id) }
  }
  function saveDraft(id, answers, currentIndex) {
    const version = getSceneDefinition(id)?.version,
      value = { testId: id, version, answers: [...answers], currentIndex }
    if (!validDraft(value, id)) throw new Error('invalid draft')
    try {
      localStorage.setItem(sceneDraftKey(id), JSON.stringify(value))
      draftMemory.delete(id)
      return true
    } catch {
      draftMemory.set(id, value)
      return false
    }
  }
  function saveResult(result) {
    if (!validSceneResult(result)) throw new Error('invalid result')
    const entry = { ...clone(result), completedAt: Date.now() }
    resultMemory.set(result.testId, entry)
    try {
      localStorage.setItem(sceneResultKey(result.testId), JSON.stringify(entry))
      return true
    } catch {
      return false
    }
  }
  function readResult(id) {
    if (resultMemory.has(id)) return clone(resultMemory.get(id))
    try {
      const value = JSON.parse(localStorage.getItem(sceneResultKey(id)))
      return validSceneResult(value) && value.testId === id ? value : null
    } catch {
      return null
    }
  }
  return { loadDraft, saveDraft, clearDraft, saveResult, readResult }
}
