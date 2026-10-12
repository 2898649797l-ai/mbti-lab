<template>
  <header class="page-header">
    <router-link to="/explore" class="text-button">{{ $t('scene.exploreTitle') }}</router-link
    ><LangToggle />
  </header>
  <main class="feature-main">
    <template v-if="report"
      ><section class="feature-card scene-hero">
        <p class="feature-muted">{{ $t('scene.eyebrow') }}</p>
        <h1>{{ report.title }}</h1>
        <p>{{ $t('scene.reportIntro') }}</p>
        <div class="feature-tags">
          <span v-for="a in report.axes" :key="a.id">{{
            a.band === 'middle' ? $t('scene.flexible') : a.band === 'left' ? a.left : a.right
          }}</span>
        </div>
      </section>
      <p v-if="route.query.unsaved === '1'" class="notice" role="status">
        {{ $t('result.storageWarning') }}
      </p>
      <p class="feature-muted">{{ $t('scene.scoreNote') }}</p>
      <SceneReportBody :result="result" />
      <section class="feature-card">
        <h2>{{ $t('scene.summary') }}</h2>
        <p v-for="a in report.axes" :key="a.id">{{ a.share }}</p>
        <CopyText :value="caption" :label="$t('share.copyText')" />
      </section>
      <router-link to="/profile" class="primary-button"
        >{{ $t('scene.shareProfile') }} →</router-link
      ><PosterExporter :model="posterModel" />
      <router-link :to="'/quiz/' + id" class="secondary-button">{{
        $t('scene.retake')
      }}</router-link
      ><router-link to="/explore" class="secondary-button">{{ $t('scene.more') }} →</router-link>
    </template>
    <section v-else class="feature-card">
      <h1>{{ $t('result.notFound') }}</h1>
      <p>{{ $t('scene.resultMissing') }}</p>
      <router-link to="/explore" class="primary-button">{{ $t('scene.exploreTitle') }}</router-link>
    </section>
  </main>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LangToggle from '../components/LangToggle.vue'
import SceneReportBody from '../components/SceneReportBody.vue'
import CopyText from '../components/CopyText.vue'
import PosterExporter from '../components/PosterExporter.vue'
import { useSceneStore } from '../composables/useSceneStore.js'
import { sceneReport } from '../data/testRegistry.js'
import { APP_URL } from '../config.js'
const route = useRoute(),
  { t, locale } = useI18n(),
  id = computed(() => String(route.params.testId)),
  store = useSceneStore()
const result = computed(() => store.readResult(id.value)),
  report = computed(() => sceneReport(result.value, locale.value))
const caption = computed(() =>
  [report.value.title, ...report.value.axes.map((a) => a.share), t('scene.eyebrow'), APP_URL].join(
    '\n',
  ),
)
const posterModel = computed(() => ({
  kind: 'scene',
  kicker: t('scene.eyebrow'),
  title: report.value.title,
  subtitle: t('scene.posterSubtitle'),
  lines: report.value.axes.map((a) => a.share),
  tags: report.value.axes.map((a) =>
    a.band === 'middle' ? t('scene.flexible') : a.band === 'left' ? a.left : a.right,
  ),
}))
</script>
<style scoped>
.scene-hero {
  background: #f8f9fb;
}
</style>
