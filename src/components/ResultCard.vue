<template>
  <article class="result-card">
    <section class="type-hero" :style="theme.bgStyle">
      <span class="hero-eyebrow">{{ $t('result.yourType') }}</span>
      <h1 class="type-letters" :style="{ color: theme.accent }">{{ type }}</h1>
      <h2 class="type-nickname">{{ data.nickname[locale] }}</h2>
      <p class="hero-tagline">{{ data.tagline[locale] }}</p>
      <slot name="action" />
    </section>
    <section v-if="percents" class="report-section viz-section">
      <h2 class="section-title">{{ $t('result.dimensions') }}</h2>
      <p class="explain">{{ $t('result.percentNote') }}</p>
      <DimensionBars :percents="percents" />
      <p class="explain near-note">{{ $t('result.closeNote') }}</p>
      <RadarChart :percents="percents" />
      <p class="chart-note">{{ $t('result.radarNote') }}</p>
    </section>
    <section class="report-section">
      <h2 class="section-title">{{ $t('result.daily') }}</h2>
      <ul class="daily-list">
        <li v-for="item in data.daily[locale]" :key="item">{{ item }}</li>
      </ul>
    </section>
    <section class="report-section">
      <h2 class="section-title">{{ $t('result.strengths') }}</h2>
      <div class="tags">
        <span v-for="item in data.strengths[locale]" :key="item" class="tag">{{ item }}</span>
      </div>
    </section>
    <section class="report-section">
      <h2 class="section-title">{{ $t('result.pitfalls') }}</h2>
      <ul>
        <li v-for="item in data.pitfalls[locale]" :key="item">{{ item }}</li>
      </ul>
    </section>
    <section class="report-section growth-section">
      <h2 class="section-title">{{ $t('result.growth') }}</h2>
      <ol>
        <li v-for="item in data.growth[locale]" :key="item">{{ item }}</li>
      </ol>
    </section>
    <section class="report-section">
      <h2 class="section-title">{{ $t('result.workStyle') }}</h2>
      <p>{{ data.workStyle[locale] }}</p>
    </section>
    <p class="profile-note">{{ $t('result.profileNote') }}</p>
  </article>
</template>
<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DimensionBars from './DimensionBars.vue'
import RadarChart from './RadarChart.vue'
import { types } from '../data/types.js'
import { getShareTheme } from '../utils/shareTheme.js'
const props = defineProps({ type: String, percents: Object })
const { locale } = useI18n()
const data = computed(() => types[props.type])
const theme = computed(() => getShareTheme(props.type))
</script>
<style scoped>
.type-hero {
  padding: 32px 24px;
  border-radius: 28px;
  color: white;
  position: relative;
  overflow: hidden;
}
.hero-eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #ffffffcc;
}
.type-letters {
  font-size: clamp(52px, 18vw, 72px);
  letter-spacing: 0.04em;
  line-height: 1.2;
  margin-top: 14px;
  animation: reveal 0.3s ease-out;
}
.type-nickname {
  font-size: 24px;
  margin: 4px 0 14px;
}
.hero-tagline {
  font-size: 17px;
  line-height: 1.7;
  max-width: 340px;
}
.report-section {
  background: white;
  border: 1px solid var(--cream-border);
  border-radius: 24px;
  padding: 24px 20px;
  margin-top: 16px;
}
.report-section p,
li {
  font-size: 16px;
  line-height: 1.85;
}
.report-section ul,
.report-section ol {
  padding-left: 20px;
  display: grid;
  gap: 12px;
}
.report-section li::marker {
  color: var(--blue);
}
.explain {
  color: var(--ink-light);
  margin-bottom: 20px;
  font-size: 14px !important;
}
.near-note {
  margin: 16px 0 0;
}
.viz-section {
  display: flex;
  flex-direction: column;
}
.chart-note {
  color: var(--ink-light);
  font-size: 12px !important;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.tag {
  font-size: 16px;
  padding: 8px 14px;
  background: var(--blue-light);
  color: #5428ae;
  border-radius: 12px;
}
.growth-section {
  background: #edf5dd;
  border-color: #d7e4bd;
}
.profile-note {
  color: var(--ink-light);
  font-size: 13px;
  padding: 22px 4px 0;
}
@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
