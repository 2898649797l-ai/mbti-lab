<template>
  <div class="question-card">
    <div class="options">
      <button
        v-for="choice in ['a', 'b']"
        :key="choice"
        class="option"
        :class="{ selected: selected === choice }"
        :disabled="disabled"
        :aria-pressed="selected === choice"
        @click="$emit('answer', choice)"
      >
        <span class="option-letter">{{ choice.toUpperCase() }}</span
        ><span class="option-text">{{ question[locale][choice] }}</span
        ><span class="option-check" aria-hidden="true">{{ selected === choice ? '✓' : '' }}</span>
      </button>
    </div>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
defineProps({ question: Object, selected: String, disabled: Boolean })
defineEmits(['answer'])
</script>
<style scoped>
.options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 22px 16px;
  min-height: 94px;
  background: white;
  border: 2px solid #e9dfcf;
  border-radius: 22px;
  text-align: left;
  color: var(--ink);
  transition:
    border-color 0.12s,
    background 0.12s;
}
.option.selected {
  border-color: var(--blue);
  background: var(--blue-light);
}
.option:disabled {
  opacity: 1;
  color: var(--ink);
}
.option-letter {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  background: #f4efff;
  color: var(--blue);
  border-radius: 10px;
  font-size: 16px;
  font-weight: 800;
}
.option.selected .option-letter {
  color: white;
  background: var(--blue);
}
.option-text {
  flex: 1;
  font-size: 17px;
  line-height: 1.7;
}
.option-check {
  width: 14px;
  flex-shrink: 0;
  color: var(--blue);
  font-weight: 800;
}
</style>
