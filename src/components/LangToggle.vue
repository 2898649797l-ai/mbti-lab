<template>
  <button class="lang-toggle" @click="toggle" :aria-label="$t('app.switchLanguage')">
    {{ locale === 'zh' ? 'EN' : '中文' }}
  </button>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
function toggle() {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}
</script>
<style scoped>
.lang-toggle {
  min-width: 44px;
  min-height: 44px;
  padding: 8px 10px;
  border-radius: 14px;
  border: 1px solid var(--cream-border);
  background: white;
  color: var(--ink);
  font-size: 16px;
  font-weight: 700;
}
</style>
