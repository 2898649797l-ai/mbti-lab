import { sceneTestsV1 } from './scenes/v1.js'
import { scoreScene, scoreBand } from '../utils/sceneScoring.js'
import { questionsForMode, QUESTIONNAIRE_VERSION } from '../composables/useDraftStore.js'
import { useTest } from '../composables/useTest.js'
import { DIMENSIONS, getDetailedReport } from '../utils/detailedReport.js'
export const SCENE_VERSIONS = { 1: sceneTestsV1 }
export const sceneTests = sceneTestsV1
export const testRegistry = {
  mbti: {
    id: 'mbti',
    version: QUESTIONNAIRE_VERSION,
    kind: 'binary',
    modes: ['short', 'full'],
    axes: DIMENSIONS,
    questions: questionsForMode,
    report: (result, locale) => getDetailedReport(result.type, locale, result.percents),
    score(answers, mode = 'full') {
      if (
        !['short', 'full'].includes(mode) ||
        !Array.isArray(answers) ||
        answers.length !== questionsForMode(mode).length ||
        !answers.every((a) => a === 'a' || a === 'b')
      )
        throw new Error('incomplete')
      const test = useTest()
      test.loadQuestions(questionsForMode(mode), false)
      test.answers.value = [...answers]
      return test.result.value
    },
  },
  ...Object.fromEntries(
    Object.entries(sceneTests).map(([id, data]) => [
      id,
      {
        ...data,
        kind: 'likert',
        score: (answers) => scoreScene(answers, data),
        report: (result, locale) => sceneReport(result, locale),
      },
    ]),
  ),
}
export function getSceneDefinition(id, version = '1') {
  return Object.hasOwn(SCENE_VERSIONS, version) && Object.hasOwn(SCENE_VERSIONS[version], id)
    ? SCENE_VERSIONS[version][id]
    : null
}
export function validSceneResult(result) {
  return (
    !!result &&
    !!getSceneDefinition(result.testId, result.version) &&
    Array.isArray(result.scores) &&
    result.scores.length === 2 &&
    result.scores.every((n) => Number.isInteger(n) && n >= 0 && n <= 100)
  )
}
export function sceneReport(result, locale = 'zh') {
  if (!validSceneResult(result)) return null
  const definition = getSceneDefinition(result.testId, result.version)
  const axes = definition.axes.map((axis, i) => {
    const score = result.scores[i],
      band = scoreBand(score),
      copy = axis.bands[band]
    return {
      id: axis.id,
      score,
      band,
      left: axis.left[locale],
      right: axis.right[locale],
      label: axis.left[locale] + ' ↔ ' + axis.right[locale],
      ...Object.fromEntries(Object.entries(copy).map(([key, value]) => [key, value[locale]])),
    }
  })
  return { id: result.testId, version: result.version, title: definition.title[locale], axes }
}
export function sharedSceneReport(scene, locale) {
  return sceneReport({ testId: scene.id, version: scene.v, scores: scene.a }, locale)
}
