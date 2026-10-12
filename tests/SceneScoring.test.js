import { describe, it, expect } from 'vitest'
import {
  sceneTests,
  testRegistry,
  sceneReport,
  validSceneResult,
} from '../src/data/testRegistry.js'
import { scoreBand } from '../src/utils/sceneScoring.js'
import { useTest } from '../src/composables/useTest.js'
import { questionsForMode } from '../src/composables/useDraftStore.js'
describe('balanced scene scoring', () => {
  it.each(Object.keys(sceneTests))(
    '%s scores neutral and opposite patterns without inventing certainty',
    (id) => {
      const test = testRegistry[id]
      for (let axis = 0; axis < 2; axis++) {
        const rows = test.questions.filter((q) => q.axis === axis)
        expect(rows).toHaveLength(6)
        expect(rows.filter((q) => q.reverse)).toHaveLength(3)
      }
      expect(test.score(Array(12).fill(3)).scores).toEqual([50, 50])
      expect(test.score(test.questions.map((q) => (q.reverse ? 1 : 5))).scores).toEqual([100, 100])
      expect(test.score(test.questions.map((q) => (q.reverse ? 5 : 1))).scores).toEqual([0, 0])
      expect(
        test.score(
          test.questions.map((q) => (q.axis === 0 ? (q.reverse ? 1 : 5) : q.reverse ? 5 : 1)),
        ).scores,
      ).toEqual([100, 0])
      for (const locale of ['zh', 'en'])
        expect(
          sceneReport(test.score(Array(12).fill(3)), locale).axes.every(
            (a) => a.band === 'middle' && a.script && a.friendship && a.close,
          ),
        ).toBe(true)
    },
  )
  it('changes only the affected axis and reverses item direction', () => {
    const test = testRegistry.chat,
      answers = Array(12).fill(3)
    answers[0] = 5
    expect(test.score(answers).scores).toEqual([58, 50])
    answers[0] = 3
    answers[2] = 5
    expect(test.score(answers).scores).toEqual([42, 50])
  })
  it('preserves middle boundaries and rejects incomplete or invalid inputs', () => {
    for (const n of [45, 50, 55]) expect(scoreBand(n)).toBe('middle')
    expect(scoreBand(44)).toBe('right')
    expect(scoreBand(56)).toBe('left')
    for (const answers of [[], Array(12).fill(null), Array(12).fill(6), Array(12).fill('3')])
      expect(() => testRegistry.chat.score(answers)).toThrow()
    expect(validSceneResult({ testId: 'chat', version: '2', scores: [50, 50] })).toBe(false)
    expect(sceneReport({ testId: 'missing', version: '1', scores: [50, 50] })).toBeNull()
  })
  it.each(['short', 'full'])('MBTI registry adapter retains the original %s scoring', (mode) => {
    const questions = questionsForMode(mode),
      answers = questions.map((_, i) => (i % 3 === 0 ? 'a' : 'b')),
      legacy = useTest()
    legacy.loadQuestions(questions, false)
    legacy.answers.value = answers
    expect(testRegistry.mbti.score(answers, mode)).toEqual(legacy.result.value)
  })
})
