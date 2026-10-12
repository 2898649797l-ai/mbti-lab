<template>
  <div class="app-shell">
    <RouterView />
    <footer
      v-if="
        route.path !== '/test' &&
        (!route.path.startsWith('/quiz/') || route.path.endsWith('/result'))
      "
      class="site-footer"
      :class="{ 'result-footer': route.path === '/result' }"
    >
      <p>{{ $t('app.privacy') }}</p>
      <p>{{ $t('app.disclaimer') }}</p>
    </footer>
  </div>
</template>
<script setup>
import { RouterView, useRoute } from 'vue-router'
import { watch } from 'vue'
import './styles/features.css'
import { useI18n } from 'vue-i18n'
const route = useRoute()
const { t, locale } = useI18n()
watch(
  locale,
  (value) => {
    document.documentElement.lang = value
    document.title = t('app.title')
  },
  { immediate: true },
)
</script>
<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
:root {
  --cream: #fffaf1;
  --cream-border: #e9dfcf;
  --gold: #93612d;
  --ink: #272139;
  --ink-light: #655d73;
  --blue: #6840c8;
  --blue-mid: #7955ce;
  --blue-light: #eee6ff;
  --white: #fff;
  --bg: #fffaf1;
  --radius: 22px;
  --shadow: 0 6px 24px #42315e0a;
}
html {
  background: #ede8e1;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
  color: var(--ink);
  font-size: 16px;
  line-height: 1.6;
}
button,
input,
textarea {
  font: inherit;
}
button,
a {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
button {
  cursor: pointer;
}
button:disabled {
  cursor: default;
}
a {
  color: var(--blue);
  text-decoration: none;
}
button:focus-visible,
a:focus-visible,
textarea:focus-visible {
  outline: 3px solid var(--blue);
  outline-offset: 3px;
}
.app-shell {
  width: 100%;
  max-width: 480px;
  margin: auto;
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--bg);
  overflow-wrap: anywhere;
}
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: calc(14px + env(safe-area-inset-top)) 20px 14px;
}
.brand-mark {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 16px;
}
.brand-dot {
  width: 20px;
  height: 20px;
  border-radius: 7px;
  background: var(--blue);
  transform: rotate(-12deg);
  display: inline-block;
}
.text-button {
  border: 0;
  background: transparent;
  min-height: 44px;
  padding: 8px 10px;
  color: var(--ink-light);
  display: inline-flex;
  align-items: center;
}
.primary-button,
.secondary-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 54px;
  border-radius: 18px;
  padding: 14px 20px;
  font-weight: 700;
  text-align: center;
  border: 1px solid transparent;
}
.primary-button {
  color: white;
  background: var(--blue);
}
.primary-button:disabled {
  opacity: 0.65;
}
.secondary-button {
  background: white;
  border-color: var(--cream-border);
  color: var(--ink);
}
.notice {
  padding: 12px 16px;
  background: #fff0d7;
  color: #674518;
  border-radius: 14px;
  font-size: 16px;
}
.site-footer {
  padding: 24px 20px calc(28px + env(safe-area-inset-bottom));
  font-size: 12px;
  color: var(--ink-light);
  line-height: 1.8;
}
.site-footer p + p {
  margin-top: 8px;
}
.result-footer {
  padding-bottom: calc(108px + env(safe-area-inset-bottom));
}
.section-title {
  font-size: 20px;
  margin-bottom: 12px;
  line-height: 1.4;
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
</style>
