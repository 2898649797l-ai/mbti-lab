<template>
  <header class="page-header">
    <router-link to="/" class="text-button">{{ $t('types.backHome') }}</router-link
    ><LangToggle />
  </header>
  <main class="feature-main">
    <p class="feature-eyebrow">{{ $t('scene.eyebrow') }}</p>
    <h1>{{ $t('scene.exploreTitle') }}</h1>
    <p class="feature-muted">{{ $t('scene.intro') }}</p>
    <section v-for="entry in entries" :key="entry.test.id" class="feature-card explore-scene">
      <span class="scene-number">0{{ entry.number }}</span>
      <h2>{{ entry.test.title[locale] }}</h2>
      <p>{{ entry.test.description[locale] }}</p>
      <p class="feature-muted">{{ $t('scene.twelve') }}</p>
      <p v-if="entry.draft.invalid" class="notice">{{ $t('test.invalidDraft') }}</p>
      <p v-if="!entry.draft.available" class="notice">{{ $t('test.storageWarning') }}</p>
      <router-link :to="'/quiz/' + entry.test.id" class="primary-button"
        >{{
          entry.draft.draft
            ? $t('scene.continue', { current: entry.draft.draft.currentIndex + 1 })
            : $t('scene.start')
        }}
        →</router-link
      >
      <router-link
        v-if="entry.result"
        :to="'/quiz/' + entry.test.id + '/result'"
        class="secondary-button"
        >{{ $t('scene.lastResult') }} →</router-link
      >
    </section>
    <router-link to="/profile" class="secondary-button">{{ $t('social.myProfile') }} →</router-link
    ><router-link to="/compare" class="secondary-button"
      >{{ $t('social.compareTitle') }} →</router-link
    >
  </main>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import LangToggle from '../components/LangToggle.vue'
import { sceneTests } from '../data/testRegistry.js'
import { useSceneStore } from '../composables/useSceneStore.js'
const { locale } = useI18n(),
  store = useSceneStore()
const entries = Object.values(sceneTests).map((test, i) => ({
  test,
  number: i + 1,
  draft: store.loadDraft(test.id),
  result: store.readResult(test.id),
}))
</script>
<style scoped>
.scene-number {
  color: var(--blue);
  font-size: 32px;
  font-weight: 850;
}
.feature-eyebrow {
  color: var(--blue);
  font-size: 14px;
  font-weight: 700;
}


</style>
