import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, it, expect, vi } from 'vitest'
import ShareCard from '../src/components/ShareCard.vue'
import { types } from '../src/data/types.js'
import zh from '../src/locales/zh.json'
import en from '../src/locales/en.json'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import { APP_URL } from '../src/config.js'
vi.mock('qrcode', () => ({
  default: { toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,MOCK') },
}))
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({ toDataURL: () => 'data:image/png;base64,POSTER' }),
}))
function mountCard(type = 'INFJ', locale = 'zh') {
  return mount(ShareCard, {
    props: { type },
    global: { plugins: [createI18n({ legacy: false, locale, messages: { zh, en } })] },
  })
}
describe('portrait share cards', () => {
  it.each(Object.keys(types))('renders the %s profile in both languages', async (type) => {
    for (const locale of ['zh', 'en']) {
      const wrapper = mountCard(type, locale)
      await flushPromises()
      expect(wrapper.find('img.sc-qr').attributes('src')).toBe('data:image/png;base64,MOCK')
      expect(wrapper.text()).toContain(types[type].tagline[locale])
      expect(wrapper.findAll('.sc-tag')).toHaveLength(3)
      expect(wrapper.text()).not.toMatch(
        /全球占比|Best Match|Cognitive Stack|octopusgarage.github.io/,
      )
      wrapper.unmount()
    }
  })
  it('exports at 1080 × 1440 with a plain-homepage QR and visible clone', async () => {
    const wrapper = mountCard()
    await flushPromises()
    wrapper.find('img').element.decode = () => Promise.resolve()
    expect(await wrapper.vm.capture()).toBe('data:image/png;base64,POSTER')
    expect(QRCode.toDataURL).toHaveBeenCalledWith(
      APP_URL,
      expect.objectContaining({ margin: 4, errorCorrectionLevel: 'M' }),
    )
    expect(html2canvas).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ scale: 2, width: 540, height: 720 }),
    )
    const options = html2canvas.mock.calls.at(-1)[1],
      clone = { style: {} }
    options.onclone(null, clone)
    expect(clone.style.visibility).toBe('visible')
    wrapper.unmount()
  })
  it('retries a failed QR instead of exporting a card without one', async () => {
    QRCode.toDataURL.mockRejectedValueOnce(new Error('QR failed'))
    const wrapper = mountCard()
    await flushPromises()
    await wrapper.vm.capture()
    expect(wrapper.find('img.sc-qr').exists()).toBe(true)
    wrapper.unmount()
  })
})
