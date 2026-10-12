<template>
  <div>
    <section class="feature-card snapshot-hero">
      <p class="feature-muted">{{ $t('social.sharedSnapshot') }}</p>
      <h1>{{ snapshot.n || $t('social.unnamed') }}</h1>
      <template v-if="profile"
        ><strong class="snapshot-type">{{ snapshot.m.t }} · {{ profile.nickname }}</strong>
        <p>{{ profile.summary }}</p>
        <div class="feature-tags">
          <span v-for="tag in profile.tags" :key="tag">{{ tag }}</span>
        </div></template
      >
      <p v-else>{{ $t('social.sceneOnly') }}</p>
    </section>
    <section v-if="percents" class="feature-card">
      <h2>{{ $t('social.sharedDimensions') }}</h2>
      <p class="feature-muted">{{ $t('result.percentNote') }}</p>
      <DimensionBars :percents="percents" />
    </section>
    <section v-for="report in sceneReports" :key="report.id" class="feature-card">
      <h2>{{ report.title }}</h2>
      <p class="feature-muted">{{ $t('scene.scoreNote') }}</p>
      <div v-for="axis in report.axes" :key="axis.id">
        <strong>{{ axis.label }}</strong>
        <p>{{ $t('scene.scoreLabel') }} {{ axis.score }} / 100</p>
        <p>{{ axis.summary }}</p>
      </div>
      <details>
        <summary>{{ $t('scene.details') }}</summary>
        <SceneReportBody
          :result="{
            testId: report.id,
            version: report.version,
            scores: report.axes.map((a) => a.score),
          }"
        />
      </details>
    </section>
    <template v-if="profile"
      ><details
        class="feature-card"
        v-for="section in profile.report.sections"
        :key="section.id"
        :open="section.id === 'core'"
      >
        <summary>{{ $t('report.sections.' + section.id) }}</summary>
        <p v-for="text in section.paragraphs" :key="text">{{ text }}</p>
      </details>
      <details class="feature-card">
        <summary>{{ $t('report.neighbors') }}</summary>
        <div v-for="neighbor in profile.report.neighbors" :key="neighbor.type">
          <strong>{{ snapshot.m.t }} / {{ neighbor.type }}</strong>
          <p>{{ neighbor.text }}</p>
        </div>
      </details>
      <section class="feature-card manual-card">
        <h2>{{ $t('report.manual') }}</h2>
        <p v-for="line in profile.report.quirks" :key="line">{{ line }}</p>
      </section></template
    >
    <p class="feature-muted">{{ $t('social.snapshotNote') }}</p>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DimensionBars from './DimensionBars.vue'
import SceneReportBody from './SceneReportBody.vue'
import { sharedSceneReport } from '../data/testRegistry.js'
import { snapshotProfile, snapshotPercents } from '../utils/profileSnapshot.js'
const props = defineProps({ snapshot: { type: Object, required: true } })
const { locale } = useI18n()
const profile = computed(() => snapshotProfile(props.snapshot, locale.value)),
  percents = computed(() => snapshotPercents(props.snapshot))
const sceneReports = computed(() => props.snapshot.s.map((s) => sharedSceneReport(s, locale.value)))
</script>
<style scoped>
.snapshot-hero {
  background: #eee6ff;
}
.snapshot-type {
  display: block;
  font-size: 24px;
  margin: 16px 0;
}
.manual-card {
  background: #edf5dd;
}
summary {
  min-height: 44px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  padding: 8px 0;
}
details p {
  margin-top: 16px;
  line-height: 1.85;
}
</style>
