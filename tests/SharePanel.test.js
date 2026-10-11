import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import SharePanel from '../src/components/SharePanel.vue'
import zh from '../src/locales/zh.json'
import en from '../src/locales/en.json'
import { APP_URL } from '../src/config.js'
let wrapper
afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  vi.unstubAllGlobals()
})
function mountPanel(props = {}) {
  wrapper = mount(SharePanel, {
    props,
    global: { plugins: [createI18n({ legacy: false, locale: 'zh', messages: { zh, en } })] },
    attachTo: document.body,
  })
}
describe('mobile sharing sheet', () => {
  beforeEach(() => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })
  })
  it('only offers the app link without a personal result', () => {
    mountPanel()
    expect(document.querySelector('[data-section="result"]')).toBeNull()
    expect(document.querySelector('[data-section="app"]')).not.toBeNull()
  })
  it('copies a type caption and plain app URL, without answers or score parameters', async () => {
    mountPanel({ type: 'INFJ' })
    document.querySelector('[data-action="copy-text"]').click()
    await flushPromises()
    const text = navigator.clipboard.writeText.mock.calls[0][0]
    expect(text).toContain('INFJ')
    expect(text).toContain('心事观察员')
    expect(text).toContain(APP_URL)
    expect(text).not.toMatch(/percents|answers|mbti_result/)
    document.querySelector('[data-action="copy-link"]').click()
    await flushPromises()
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith(APP_URL)
    expect(document.querySelector('[data-action="copy-link"]').textContent).toContain('已复制')
  })
  it('shows a manual copy fallback when the clipboard is unavailable', async () => {
    navigator.clipboard.writeText.mockRejectedValue(new Error('denied'))
    mountPanel()
    document.querySelector('[data-action="copy-link"]').click()
    await flushPromises()
    expect(document.querySelector('[role="status"]').textContent).toContain('手动复制')
    expect(document.querySelector('textarea').value).toContain(APP_URL)
  })
  it('calls the export callback and closes', () => {
    const onSaveImage = vi.fn()
    mountPanel({ type: 'INFJ', onSaveImage })
    document.querySelector('[data-action="save-image"]').click()
    expect(onSaveImage).toHaveBeenCalledOnce()
    expect(wrapper.emitted('close')).toBeTruthy()
  })
  it('closes on backdrop and Escape', async () => {
    mountPanel()
    document.querySelector('.sp-overlay').click()
    document
      .querySelector('.sp-sheet')
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(wrapper.emitted('close')).toHaveLength(2)
  })
})
