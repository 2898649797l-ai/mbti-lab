import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, it, expect } from 'vitest'
import { types } from '../src/data/types.js'
import ResultCard from '../src/components/ResultCard.vue'
import zh from '../src/locales/zh.json'
import en from '../src/locales/en.json'
describe('editorial profiles', () => {
  it('contains 16 complete bilingual profiles', () => {
    expect(Object.keys(types)).toHaveLength(16)
    for (const data of Object.values(types))
      for (const locale of ['zh', 'en']) {
        for (const field of ['nickname', 'tagline', 'workStyle'])
          expect(data[field][locale].length).toBeGreaterThan(0)
        for (const [field, count] of Object.entries({
          daily: 3,
          strengths: 3,
          pitfalls: 2,
          growth: 2,
        }))
          expect(data[field][locale]).toHaveLength(count)
      }
  })
  it.each(Object.keys(types))(
    'renders %s without unverified claims or invented assessment scores',
    (type) => {
      const wrapper = mount(ResultCard, {
        props: { type },
        global: { plugins: [createI18n({ legacy: false, locale: 'zh', messages: { zh, en } })] },
      })
      expect(wrapper.text()).not.toMatch(/全球占比|名人|最佳匹配|认知功能栈|65%/)
      expect(wrapper.text()).toContain(types[type].tagline.zh)
      expect(wrapper.find('.viz-section').exists()).toBe(false)
      wrapper.unmount()
    },
  )
})
