import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory, RouterView } from 'vue-router'
import { createI18n } from 'vue-i18n'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import SceneQuizView from '../src/views/SceneQuizView.vue'
import SceneResultView from '../src/views/SceneResultView.vue'
import ProfileBuilderView from '../src/views/ProfileBuilderView.vue'
import { useSceneStore } from '../src/composables/useSceneStore.js'
import { decodeSnapshot } from '../src/utils/profileSnapshot.js'
import zh from '../src/locales/zh.json'
import en from '../src/locales/en.json'
let wrapper, router
beforeEach(() => {
  vi.useFakeTimers()
  localStorage.clear()
  sessionStorage.clear()
  vi.stubGlobal('scrollTo', vi.fn())
})
afterEach(() => {
  wrapper?.unmount()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})
async function open(path) {
  router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/quiz/:testId', component: SceneQuizView },
      { path: '/quiz/:testId/result', component: SceneResultView },
      { path: '/profile', component: ProfileBuilderView },
      { path: '/explore', component: { template: '<div/>' } },
      { path: '/', component: { template: '<div/>' } },
    ],
  })
  await router.push(path)
  await router.isReady()
  wrapper = mount(
    { components: { RouterView }, template: '<RouterView/>' },
    {
      global: {
        plugins: [router, createI18n({ legacy: false, locale: 'zh', messages: { zh, en } })],
        stubs: { PosterExporter: true },
      },
    },
  )
  await flushPromises()
}
describe('scene quiz interactions', () => {
  it('locks answers and back during feedback, and cancels on test switch', async () => {
    await open('/quiz/chat')
    await wrapper.findAll('input[type="radio"]')[4].setValue(true)
    expect(wrapper.findAll('input[type="radio"]').every(r => r.element.disabled)).toBe(true)
    await wrapper.find('.quiz-actions .secondary-button').trigger('click')
    expect(useSceneStore().loadDraft('chat').draft.currentIndex).toBe(0)
    await router.push('/quiz/boundaries')
    await flushPromises()
    await vi.advanceTimersByTimeAsync(280)
    expect(wrapper.text()).toContain('1 / 12')
    expect(useSceneStore().loadDraft('boundaries').draft).toBeNull()
  })
  it('delivers an all-answered restored draft without another click', async () => {
    useSceneStore().saveDraft('chat', Array(12).fill(3), 11)
    await open('/quiz/chat')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/quiz/chat/result')
    expect(useSceneStore().loadDraft('chat').draft).toBeNull()
  })
  it('cancels feedback on exit but keeps the chosen answer', async () => {
    await open('/quiz/chat')
    await wrapper.findAll('input[type="radio"]')[3].setValue(true)
    await router.push('/explore')
    await flushPromises()
    await vi.advanceTimersByTimeAsync(280)
    expect(useSceneStore().loadDraft('chat').draft.currentIndex).toBe(0)
    expect(useSceneStore().loadDraft('chat').draft.answers[0]).toBe(4)
  })
  it('saves each choice, restores after remount and permits earlier answer changes', async () => {
    await open('/quiz/chat')
    await wrapper.findAll('input[type="radio"]')[4].setValue(true)
    await vi.advanceTimersByTimeAsync(280)
    await wrapper.findAll('input[type="radio"]')[1].setValue(true)
    await vi.advanceTimersByTimeAsync(280)
    await wrapper.find('.quiz-actions .secondary-button').trigger('click')
    await wrapper.find('.quiz-actions .secondary-button').trigger('click')
    expect(wrapper.findAll('input[type="radio"]')[4].element.checked).toBe(true)
    await wrapper.findAll('input[type="radio"]')[0].setValue(true)
    wrapper.unmount()
    await open('/quiz/chat')
    expect(wrapper.findAll('input[type="radio"]')[0].element.checked).toBe(true)
    expect(useSceneStore().loadDraft('chat').draft.answers[1]).toBe(2)
  })
  it.each(['boundaries', 'repair'])(
    'completes %s independently and keeps old MBTI result untouched',
    async (id) => {
      localStorage.setItem('mbti_lab_result', 'preserve-me')
      await open('/quiz/' + id)
      expect(wrapper.find('.quiz-actions .secondary-button').attributes('disabled')).toBeDefined()
      for (let i = 0; i < 12; i++) {
        await wrapper.findAll('input[type="radio"]')[2].setValue(true)
        await vi.advanceTimersByTimeAsync(280)
        await flushPromises()
      }
      expect(router.currentRoute.value.path).toBe('/quiz/' + id + '/result')
      expect(wrapper.text()).toContain('随情境调整')
      expect(wrapper.text()).toContain('可以尝试这样说')
      expect(useSceneStore().readResult(id).scores).toEqual([50, 50])
      expect(useSceneStore().loadDraft(id).draft).toBeNull()
      expect(localStorage.getItem('mbti_lab_result')).toBe('preserve-me')
    },
  )
  it('shares scene results without requiring or inventing a personality type', async () => {
    useSceneStore().saveResult({ testId: 'chat', version: '1', scores: [100, 0] })
    await open('/profile')
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    expect(checkboxes.every((c) => !c.element.checked)).toBe(true)
    await checkboxes[0].setValue(true)
    await wrapper.find('button.primary-button').trigger('click')
    const href = wrapper
        .findAll('a')
        .find((a) => a.attributes('href')?.startsWith('/p/'))
        .attributes('href'),
      snapshot = decodeSnapshot(href.slice(3))
    expect(snapshot.m).toBeUndefined()
    expect(snapshot.s).toEqual([{ id: 'chat', v: '1', a: [100, 0] }])
    expect(wrapper.text()).toContain('没有公开人格类型')
  })
  it('unknown tests have a recovery route instead of an exception', async () => {
    await open('/quiz/missing')
    expect(wrapper.text()).toContain('没有找到这项小测')
    expect(wrapper.find('a.primary-button').attributes('href')).toBe('/explore')
  })
})
