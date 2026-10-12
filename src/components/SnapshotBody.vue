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
    <ReportReader v-if="profile" :report="profile.report" />
    <p class="feature-muted">{{ $t('social.snapshotNote') }}</p>
  </div>
</template>
<script setup>
import ReportReader from './ReportReader.vue'
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
  background: #f8f9fb;
}
.snapshot-type {
  display: block;
  font-size: 24px;
  margin: 16px 0;
}
.manual-card {
  background: #f8f9fb;
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
