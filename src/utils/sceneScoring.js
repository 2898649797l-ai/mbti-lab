export function scoreScene(answers, definition) {
  if (
    !definition ||
    !Array.isArray(answers) ||
    answers.length !== definition.questions.length ||
    !answers.every((a) => Number.isInteger(a) && a >= 1 && a <= 5)
  )
    throw new Error('incomplete')
  const scores = definition.axes.map((_, axis) => {
    const entries = definition.questions
      .map((q, i) => ({ q, a: answers[i] }))
      .filter((x) => x.q.axis === axis)
    return Math.round(
      (entries.reduce((sum, { q, a }) => sum + (q.reverse ? 5 - a : a - 1), 0) /
        (entries.length * 4)) *
        100,
    )
  })
  return { testId: definition.id, version: definition.version, scores }
}
export function scoreBand(value) {
  if (!Number.isFinite(value) || value < 0 || value > 100) throw new Error('invalid score')
  return value >= 45 && value <= 55 ? 'middle' : value > 55 ? 'left' : 'right'
}
