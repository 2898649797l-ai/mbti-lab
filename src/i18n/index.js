import { createI18n } from 'vue-i18n'
import zh from '../locales/zh.json'
import en from '../locales/en.json'
import brand from '../brand.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: {
    zh: { ...zh, app: { ...zh.app, ...brand.zh } },
    en: { ...en, app: { ...en.app, ...brand.en } },
  },
})
