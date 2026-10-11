<template>
  <div class="progress-block">
    <div class="progress-caption">
      <span>{{ $t('test.progress', { current: current + 1, total }) }}</span
      ><span>{{ Math.round(((current + 1) / total) * 100) }}%</span>
    </div>
    <div
      class="progress-track"
      role="progressbar"
      :aria-label="$t('test.progressLabel')"
      :aria-valuenow="current + 1"
      :aria-valuemin="1"
      :aria-valuemax="total"
    >
      <div :style="{ width: ((current + 1) / total) * 100 + '%' }" />
    </div>
  </div>
</template>
<script setup>
defineProps({ current: Number, total: Number })
</script>
<style scoped>
.progress-block {
  flex: 1;
  min-width: 0;
}
.progress-caption {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: var(--ink-light);
  margin-bottom: 8px;
}
.progress-track {
  height: 7px;
  border-radius: 10px;
  background: var(--blue-light);
  overflow: hidden;
}
.progress-track > div {
  height: 100%;
  background: var(--blue);
  border-radius: 10px;
  transition: width 0.2s;
}
</style>
