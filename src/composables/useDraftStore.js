import { questions } from '../data/questions.js'
export const DRAFT_KEY = 'personality_explorer_draft'
export const QUESTIONNAIRE_VERSION = 'original-93-v1'
export const questionsForMode = (mode) =>
  mode === 'short' ? questions.filter((q) => q.short) : questions
function valid(d) {
  if (!d || d.version !== QUESTIONNAIRE_VERSION || !['short', 'full'].includes(d.mode)) return false
  const count = questionsForMode(d.mode).length
  return (
    Array.isArray(d.answers) &&
    d.answers.length === count &&
    Number.isInteger(d.currentIndex) &&
    d.currentIndex >= 0 &&
    d.currentIndex < count &&
    d.answers.every((a) => a === null || a === 'a' || a === 'b') &&
    d.answers.slice(0, d.currentIndex).every((a) => a !== null)
  )
}
export function useDraftStore() {
  function clear() {
    try {
      localStorage.removeItem(DRAFT_KEY)
      return true
    } catch {
      return false
    }
  }
  function load() {
    let raw
    try {
      raw = localStorage.getItem(DRAFT_KEY)
    } catch {
      return { draft: null, invalid: false, available: false }
    }
    if (raw === null) return { draft: null, invalid: false, available: true }
    let d
    try {
      d = JSON.parse(raw)
    } catch {
      /* handled below */
    }
    if (!valid(d)) return { draft: null, invalid: true, available: clear() }
    return { draft: d, invalid: false, available: true }
  }
  function save(mode, answers, currentIndex) {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          version: QUESTIONNAIRE_VERSION,
          mode,
          answers: [...answers],
          currentIndex,
        }),
      )
      return true
    } catch {
      return false
    }
  }
  return { load, save, clear }
}
