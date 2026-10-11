<template>
  <div ref="chartEl" class="radar-chart" role="img" :aria-label="$t('result.radarNote')" />
</template>
<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([RadarChart, CanvasRenderer])
const props = defineProps({ percents: Object })
const chartEl = ref(null)
let chart, observer
function option(p) {
  return {
    animation: !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    radar: {
      indicator: [
        { name: 'E', max: 100 },
        { name: 'N', max: 100 },
        { name: 'F', max: 100 },
        { name: 'J', max: 100 },
      ],
      radius: '62%',
      center: ['50%', '50%'],
      splitNumber: 3,
      axisName: { color: '#6840c8', fontSize: 14, fontWeight: 600 },
      splitLine: { lineStyle: { color: '#e2d6f5' } },
      splitArea: { areaStyle: { color: ['#faf7ff', '#f3edff'] } },
      axisLine: { lineStyle: { color: '#e2d6f5' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [p.EI.E, p.NS.N, p.FT.F, p.JP.J],
            areaStyle: { color: 'rgba(104,64,200,.22)' },
            lineStyle: { color: '#6840c8', width: 2 },
            itemStyle: { color: '#6840c8' },
          },
        ],
      },
    ],
  }
}
onMounted(() => {
  chart = echarts.init(chartEl.value)
  if (props.percents) chart.setOption(option(props.percents))
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(() => chart?.resize())
    observer.observe(chartEl.value)
  }
})
watch(
  () => props.percents,
  (p) => {
    if (p && chart) chart.setOption(option(p))
  },
)
onUnmounted(() => {
  observer?.disconnect()
  chart?.dispose()
  chart = null
})
</script>
<style scoped>
.radar-chart {
  width: 100%;
  height: 250px;
  margin-top: 12px;
}
</style>
