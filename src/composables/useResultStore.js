const SESSION_KEY = 'mbti_result'
const HISTORY_KEY = 'mbti_lab_result'
const TYPE_POSITIONS = [
  ['E', 'I'],
  ['N', 'S'],
  ['T', 'F'],
  ['J', 'P'],
]
const DIMENSIONS = [
  { key: 'EI', letters: ['E', 'I'] },
  { key: 'NS', letters: ['N', 'S'] },
  { key: 'FT', letters: ['F', 'T'] },
  { key: 'JP', letters: ['J', 'P'] },
]
let volatileResult = null
let handoffResult = null
function parseEntry(raw) {
  if (!raw) return null
  let value
  try {
    value = JSON.parse(raw)
  } catch {
    return null
  }
  if (!value || typeof value !== 'object' || typeof value.type !== 'string') return null
  const type = value.type.trim().toUpperCase()
  if (type.length !== 4 || !TYPE_POSITIONS.every((options, i) => options.includes(type[i])))
    return null
  if (
    !DIMENSIONS.every(({ key, letters }) =>
      letters.every(
        (letter) =>
          Number.isFinite(value.percents?.[key]?.[letter]) &&
          value.percents[key][letter] >= 0 &&
          value.percents[key][letter] <= 100,
      ),
    )
  )
    return null
  return { ...value, type }
}
export function useResultStore() {
  function submit(result) {
    const entry = { ...result, completedAt: Date.now() }
    handoffResult = entry
    let persisted = false
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(entry))
    } catch {
      /* use memory */
    }
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(entry))
      persisted = true
    } catch {
      /* use memory */
    }
    volatileResult = persisted ? null : entry
    return persisted
  }
  function load() {
    // A newly completed test wins even if a failed session write left an old entry.
    if (handoffResult) {
      const fresh = handoffResult
      handoffResult = null
      try {
        sessionStorage.removeItem(SESSION_KEY)
      } catch {
        /* unavailable */
      }
      return fresh
    }
    let fresh = null
    try {
      fresh = parseEntry(sessionStorage.getItem(SESSION_KEY))
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      /* fallback */
    }
    if (fresh) return fresh
    if (volatileResult) return volatileResult
    try {
      return parseEntry(localStorage.getItem(HISTORY_KEY))
    } catch {
      return null
    }
  }
  return { submit, load }
}
