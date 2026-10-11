<template>
  <div class="types-page">
    <header class="page-header">
      <router-link to="/" class="text-button">← {{ $t('types.backHome') }}</router-link
      ><LangToggle />
    </header>
    <main class="types-main">
      <template v-if="!selected"
        ><div class="types-intro">
          <span class="eyebrow">16 PERSONALITIES</span>
          <h1>{{ $t('types.title') }}</h1>
          <p>{{ $t('home.exploreDesc') }}</p>
        </div>
        <div class="type-grid">
          <button
            v-for="(data, code) in types"
            :key="code"
            class="type-chip"
            @click="selected = code"
          >
            <span class="chip-code">{{ code }}</span
            ><span>{{ data.nickname[locale] }}</span
            ><span class="chip-tagline">{{ data.tagline[locale] }}</span>
          </button>
        </div>
      </template>
      <template v-else
        ><button class="text-button detail-back" @click="selected = null">
          ← {{ $t('types.backToList') }}</button
        ><ResultCard :type="selected"
      /></template>
    </main>
  </div>
</template>
<script setup>
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import LangToggle from '../components/LangToggle.vue'
import ResultCard from '../components/ResultCard.vue'
import { types } from '../data/types.js'
const { locale } = useI18n()
const selected = ref(null)
watch(selected, async () => {
  await nextTick()
  window.scrollTo?.({ top: 0 })
})
</script>
<style scoped>
.types-main {
  padding: 12px 20px 20px;
}
.types-intro {
  margin-bottom: 24px;
}
.eyebrow {
  font-size: 12px;
  color: var(--blue);
  font-weight: 800;
  letter-spacing: 0.15em;
}
h1 {
  font-size: 28px;
  margin: 10px 0;
}
.types-intro p {
  color: var(--ink-light);
  font-size: 16px;
}
.type-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.type-chip {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  border: 1px solid var(--cream-border);
  background: white;
  border-radius: 20px;
  padding: 18px 14px;
  text-align: left;
  color: var(--ink);
}
.chip-code {
  color: var(--blue);
  font-size: 26px;
  font-weight: 900;
}
.chip-tagline {
  font-size: 12px;
  line-height: 1.7;
  color: var(--ink-light);
}
.detail-back {
  margin-bottom: 12px;
}
</style>
