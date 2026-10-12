<template>
  <header class="page-header"><span class="brand-mark">{{ $t('app.title') }}</span><LangToggle /></header>
  <main class="feature-main">
    <h1>{{ $t('ux.resultsTitle') }}</h1><p class="feature-muted">{{ $t('ux.localOnly') }}</p>
    <p v-if="!state.available" role="status" class="notice">{{ $t('test.storageWarning') }}</p>
    <p v-if="state.issues.length" role="status" class="notice">{{ $t('test.invalidDraft') }}</p>
    <section v-if="state.drafts.length" class="result-group"><h2>{{ $t('ux.unfinished') }}</h2>
      <article v-for="entry in state.drafts" :key="entry.id" class="feature-card">
        <h3>{{ title(entry.id) }}</h3><p>{{ $t('home.draftProgress', { current: entry.currentIndex + 1, total: entry.answers.length }) }}</p>
        <router-link :to="entry.path" class="primary-button">{{ $t('home.continue') }}</router-link>
      </article>
    </section>
    <section v-if="state.results.length" class="result-group"><h2>{{ $t('ux.completed') }}</h2>
      <article v-for="entry in state.results" :key="entry.id" class="feature-card">
        <h3>{{ title(entry.id) }} <span v-if="entry.type">· {{ entry.type }}</span></h3>
        <p class="feature-muted">{{ date(entry.completedAt) }}</p>
        <p v-if="!entry.saved" class="notice">{{ $t('test.unsaved') }}</p>
        <router-link :to="entry.path" class="primary-button">{{ $t('ux.view') }}</router-link>
        <router-link :to="entry.id === 'personality' ? '/?restart=1' : '/quiz/' + entry.id + '?restart=1'" class="secondary-button">{{ $t('ux.retest') }}</router-link>
      </article>
    </section>
    <section v-if="!state.drafts.length && !state.results.length" class="feature-card"><h2>{{ $t('ux.empty') }}</h2><p>{{ $t('ux.emptyHint') }}</p><router-link to="/" class="primary-button">{{ $t('home.startShort') }}</router-link></section>
  </main>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import LangToggle from '../components/LangToggle.vue'
import { readLocalResults } from '../utils/localResults.js'
import { sceneTests } from '../data/testRegistry.js'
const { t, locale } = useI18n(), state = readLocalResults()
const title = id => id === 'personality' ? t('ux.personality') : sceneTests[id].title[locale.value]
const date = value => Number.isFinite(value) ? new Date(value).toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US') : t('ux.unknownDate')
</script>
