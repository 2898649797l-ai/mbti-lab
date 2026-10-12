<template>
  <div v-if="report" class="scene-report-body">
    <section v-for="axis in report.axes" :key="axis.id" class="feature-card">
      <h2>{{ axis.label }}</h2>
      <div class="axis-labels">
        <span>{{ axis.left }}</span
        ><span>{{ axis.right }}</span>
      </div>
      <div
        class="scene-track"
        role="img"
        :aria-label="axis.label + ' ' + $t('scene.scoreLabel') + ' ' + axis.score"
      >
        <div :style="{ width: axis.score + '%' }" />
        <span />
      </div>
      <p class="feature-muted">
        {{ $t('scene.scoreLabel') }} {{ axis.score }} / 100 ·
        {{
          axis.band === 'middle'
            ? $t('scene.flexible')
            : $t('scene.leans', { side: axis.band === 'left' ? axis.left : axis.right })
        }}
      </p>
      <p>{{ axis.summary }}</p>
      <h3>{{ $t('social.friendship') }}</h3>
      <p>{{ axis.friendship }}</p>
      <h3>{{ $t('social.close') }}</h3>
      <p>{{ axis.close }}</p>
      <blockquote>
        <strong>{{ $t('scene.script') }}</strong>
        <p>{{ axis.script }}</p>
      </blockquote>
    </section>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { sceneReport } from '../data/testRegistry.js'
const props = defineProps({ result: { type: Object, required: true } }),
  { locale } = useI18n()
const report = computed(() => sceneReport(props.result, locale.value))
</script>
<style scoped>
.scene-report-body {
  display: grid;
  gap: 16px;
}
.axis-labels {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 13px;
  color: var(--ink-light);
}
.axis-labels span:last-child {
  text-align: right;
}
.scene-track {
  height: 10px;
  background: #ffcfb5;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}
.scene-track div {
  height: 100%;
  background: var(--blue);
}
.scene-track span {
  position: absolute;
  left: 50%;
  top: 0;
  height: 100%;
  width: 2px;
  background: white;
}
h3 {
  font-size: 16px;
  color: var(--blue);
}
blockquote {
  background: #f2edff;
  padding: 16px;
  border-radius: 16px;
  display: grid;
  gap: 10px;
}
</style>
