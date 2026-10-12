<template>
  <article v-if="data" class="result-card">
    <section class="type-hero" >
      <span class="hero-eyebrow">{{ $t('result.yourType') }}</span>
      <h1 class="type-letters" >{{ type }}</h1>
      <h2 class="type-nickname">{{ data.nickname[locale] }}</h2>
      <p class="hero-tagline">{{ data.tagline[locale] }}</p>
      <div class="hero-tags"><span v-for="tag in report.strengths" :key="tag">{{ tag }}</span></div>
      <ul class="hero-highlights"><li v-for="line in report.highlights" :key="line">{{ line }}</li></ul>
      <slot name="action" />
    </section>
    <section v-if="percents" class="report-section viz-section">
      <h2 class="section-title">{{ $t('result.dimensions') }}</h2><p class="explain">{{ $t('result.percentNote') }}</p>
      <DimensionBars :percents="percents" />

      <details class="chart-details" @toggle="chartOpen=$event.target.open"><summary>{{ $t('report.showChart') }}</summary><RadarChart v-if="chartOpen" :percents="percents" /><p class="chart-note">{{ $t('result.radarNote') }}</p></details>
    </section>
    <p class="profile-note">{{ $t('report.editorialNote') }}</p>
    <ReportReader ref="reader" :report="report" :overview="false" />
    <p class="profile-note">{{ $t('result.profileNote') }}</p>
  </article>
</template>
<script setup>
import { computed,ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DimensionBars from './DimensionBars.vue'
import RadarChart from './RadarChart.vue'
import { types } from '../data/types.js'
import ReportReader from './ReportReader.vue'
import { getDetailedReport } from '../utils/detailedReport.js'
const props=defineProps({type:String,percents:Object})
const {locale}=useI18n()
const chartOpen=ref(false)
const data=computed(()=>types[props.type])
const reader=ref(null)
defineExpose({contents:()=>reader.value?.contents()})
const report=computed(()=>getDetailedReport(props.type,locale.value,props.percents))
</script>
<style scoped>
.hero-highlights{padding-left:22px;margin-top:18px}.hero-highlights li+li{margin-top:6px}
.type-hero{padding:32px 24px;border-radius:14px;color:var(--ink);background:#f8f9fb;border:1px solid var(--cream-border)}.hero-eyebrow{font-size:12px;font-weight:700;letter-spacing:.12em;color:var(--ink-light)}.type-letters{font-size:clamp(52px,18vw,72px);letter-spacing:.04em;line-height:1.2;margin-top:14px}.type-nickname{font-size:24px;margin:4px 0 14px}.hero-tagline{font-size:17px;line-height:1.7}
.hero-tags,.tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}.hero-tags span{padding:4px 9px;border:1px solid var(--cream-border);color:var(--blue);background:#f1edfa;border-radius:10px;font-size:13px}.report-section{background:white;border:1px solid var(--cream-border);border-radius:14px;padding:22px 20px;margin-top:16px}.report-section p{font-size:16px;line-height:1.85}summary{min-height:44px;cursor:pointer;font-size:19px;font-weight:750;line-height:1.5;padding:6px 0}summary::marker{color:var(--blue)}.section-body{padding-top:10px}.section-body p+p{margin-top:16px;border-top:1px solid var(--cream-border);padding-top:16px}.explain{color:var(--ink-light);margin-bottom:20px;font-size:14px!important}.near-note{margin:16px 0}.chart-details{margin-top:14px}.chart-details summary{font-size:15px;color:var(--blue)}.chart-note{color:var(--ink-light);font-size:12px!important}.tag{font-size:14px;padding:6px 10px;background:var(--blue-light);color:#5428ae;border-radius:10px}.profile-note{color:var(--ink-light);font-size:13px;padding:20px 4px 0}.neighbor{padding:12px 0}.neighbor strong{color:var(--blue)}.neighbor+.neighbor{border-top:1px solid var(--cream-border)}.social-manual{background:#edf5dd;border-color:#d7e4bd}.quote{border-left:3px solid #8caa55;padding-left:12px;margin:12px 0}
</style>
