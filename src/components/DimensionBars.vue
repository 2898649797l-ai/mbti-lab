<template>
  <div class="dim-bars">
    <div v-for="(letters, key) in dimensions" :key="key" class="dim-row">
      <div class="dim-labels">
        <span>{{ labels[key][0] }}</span
        ><span>{{ labels[key][1] }}</span>
      </div>
      <div class="bar-track">
        <div
          class="bar-fill"
          :style="{ width: percents[key][letters[0]] + '%' }"
        />
        <div class="bar-divider" />
      </div>
      <div class="dim-pcts">
        <span>{{ percents[key][letters[0]] }}%</span
        ><span
          v-if="Math.abs(percents[key][letters[0]] - 50) <= 5"
          class="close-label"
          >{{ $t("result.close") }}</span
        ><span>{{ percents[key][letters[1]] }}%</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
defineProps({ percents: Object });
const { tm } = useI18n();
const labels = computed(() => tm("result.dimLabel"));
const dimensions = {
  EI: ["E", "I"],
  NS: ["N", "S"],
  FT: ["F", "T"],
  JP: ["J", "P"],
};
</script>
<style scoped>
.dim-bars {
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 100%;
}
.dim-labels,
.dim-pcts {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 14px;
  color: var(--ink-light);
}
.dim-labels span:last-child {
  text-align: right;
}
.bar-track {
  height: 10px;
  margin: 8px 0;
  background: #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}
.bar-fill {
  height: 100%;
  background: var(--blue);
  border-radius: 10px;
}
.bar-divider {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: white;
}
.dim-pcts {
  color: var(--blue);
  font-weight: 700;
}
.close-label {
  font-size: 11px;
  text-align: center;
  color: var(--ink-light);
}
</style>
