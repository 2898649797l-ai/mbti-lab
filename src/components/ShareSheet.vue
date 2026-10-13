<template>
  <div
    class="share-sheet-overlay"
    @click.self="$emit('close')"
    @keydown.esc="$emit('close')"
  >
    <section
      ref="panel"
      class="share-sheet"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sheet-title"
      @keydown.tab="trap"
    >
      <header>
        <h2 id="sheet-title">{{ $t("ux.share") }}</h2>
        <button ref="close" class="text-button" @click="$emit('close')">
          {{ $t("share.close") }} ×
        </button>
      </header>
      <PosterExporter
        :model="model"
        :snapshot-url="snapshotUrl"
        :caption="caption"
      />
    </section>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import PosterExporter from "./PosterExporter.vue";
defineProps({
  model: { type: Object, required: true },
  snapshotUrl: { type: String, default: "" },
  caption: { type: String, default: "" },
});
defineEmits(["close"]);
const panel = ref(null),
  close = ref(null);
let previous, overflow;
onMounted(async () => {
  previous = document.activeElement;
  overflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  await nextTick();
  close.value?.focus();
});
onUnmounted(() => {
  document.body.style.overflow = overflow;
  previous?.focus?.();
});
function trap(event) {
  const items = [
    ...panel.value.querySelectorAll(
      "button,a[href],input,select,textarea,summary",
    ),
  ].filter((el) => !el.disabled && el.getClientRects().length);
  if (event.shiftKey && document.activeElement === items[0]) {
    event.preventDefault();
    items.at(-1)?.focus();
  } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
    event.preventDefault();
    items[0]?.focus();
  }
}
</script>
<style scoped>
.share-sheet-overlay {
  position: fixed;
  inset: 0;
  background: #25262c70;
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.share-sheet {
  width: 100%;
  max-width: 480px;
  max-height: 94dvh;
  overflow: auto;
  background: #fff;
  border-radius: 18px 18px 0 0;
  padding: 16px 16px calc(24px + env(safe-area-inset-bottom));
  overscroll-behavior: contain;
}
.share-sheet header {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.share-sheet h2 {
  font-size: 22px;
}
.share-sheet :deep(.feature-card) {
  padding: 16px;
  border-radius: 12px;
}
</style>
