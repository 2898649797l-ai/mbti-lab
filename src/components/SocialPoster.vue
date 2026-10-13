<template>
  <div ref="card" class="social-poster" aria-hidden="true">
    <div class="poster-inner" :class="model.kind">
      <div class="poster-top">
        <span>{{ $t("app.title") }}</span
        ><span>{{ model.kicker }}</span>
      </div>
      <div
        ref="textBlock"
        class="poster-content"
        :style="{ '--text-scale': textScale }"
      >
        <div class="poster-title">{{ model.title }}</div>
        <div class="poster-subtitle">{{ model.subtitle }}</div>
        <p v-if="model.description" class="poster-description">
          {{ model.description }}
        </p>
        <div class="poster-lines">
          <p v-for="(line, i) in model.lines.slice(0, 3)" :key="i">
            {{ line }}
          </p>
        </div>
        <div class="poster-tags">
          <span v-for="tag in uniqueTags" :key="tag">{{ tag }}</span>
        </div>
      </div>
      <div class="poster-bottom">
        <div>
          <strong>{{ $t("social.scan") }}</strong>
          <p>{{ $t("share.posterNote") }}</p>
        </div>
        <img v-if="qr" :src="qr" alt="" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, nextTick, computed } from "vue";
import QRCode from "qrcode";
const props = defineProps({
  model: { type: Object, required: true },
  url: { type: String, required: true },
});
const textBlock = ref(null),
  textScale = ref(1);
const card = ref(null),
  qr = ref("");
const uniqueTags = computed(() =>
  [...new Set(props.model.tags || [])].slice(0, 3),
);
async function capture() {
  const target = props.url;
  qr.value = await QRCode.toDataURL(target, {
    width: 512,
    margin: 4,
    errorCorrectionLevel: "M",
    color: { dark: "#272139", light: "#ffffff" },
  });
  await nextTick();
  if (document.fonts?.ready) await document.fonts.ready;
  await Promise.all(
    [...card.value.querySelectorAll("img")].map((img) =>
      img.decode ? img.decode() : Promise.resolve(),
    ),
  );
  textScale.value = 1;
  await nextTick();
  while (
    textBlock.value.scrollHeight > textBlock.value.clientHeight + 1 &&
    textScale.value > 0.7
  ) {
    textScale.value -= 0.05;
    await nextTick();
  }
  if (textBlock.value.scrollHeight > textBlock.value.clientHeight + 1)
    throw new Error("Card content does not fit");
  if (props.url !== target) throw new Error("Target changed; export again");
  const { default: html2canvas } = await import("html2canvas");
  const canvas = await html2canvas(card.value, {
    scale: 2,
    width: 540,
    height: 720,
    useCORS: true,
    backgroundColor: null,
    onclone: (_doc, element) => {
      element.style.visibility = "visible";
    },
  });
  return canvas.toDataURL("image/png");
}
defineExpose({ capture });
</script>
<style scoped>
.social-poster {
  position: fixed;
  left: 0;
  top: 0;
  width: 540px;
  height: 720px;
  visibility: hidden;
  pointer-events: none;
  z-index: -1;
  contain: strict;
}
.poster-inner {
  width: 540px;
  height: 720px;
  padding: 36px 40px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  color: #25262c;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
}
.poster-content {
  flex: 1;
  min-height: 0;
  padding-bottom: 16px;
  overflow-wrap: anywhere;
}
.poster-description {
  font-size: calc(20px * var(--text-scale));
  line-height: 1.55;
  margin-top: 12px;
}
.poster-top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 16px;
  font-weight: 700;
}
.poster-top span:last-child {
  font-size: 12px;
}
.poster-title {
  font-size: calc(44px * var(--text-scale));
  line-height: 1.2;
  font-weight: 900;
  margin-top: 24px;
  overflow-wrap: anywhere;
}
.poster-subtitle {
  font-size: calc(21px * var(--text-scale));
  line-height: 1.5;
  margin-top: 12px;
}
.poster-lines {
  display: grid;
  gap: 12px;
  margin-top: 24px;
}
.poster-lines p {
  font-size: calc(19px * var(--text-scale));
  line-height: 1.55;
  border-left: 3px solid #6840c8;
  padding-left: 12px;
}
.poster-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 20px;
}
.poster-tags span {
  padding: 6px 10px;
  border: 1px solid #e1e3e8;
  background: #f1edfa;
  color: #6840c8;
  border-radius: 10px;
  font-size: calc(14px * var(--text-scale));
}
.poster-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-top: 0;
  padding-top: 18px;
  border-top: 1px solid #e1e3e8;
}
.poster-bottom strong {
  font-size: 17px;
}
.poster-bottom p {
  font-size: 12px;
  margin-top: 8px;
}
.poster-bottom img {
  width: 132px;
  height: 132px;
  flex-shrink: 0;
  border-radius: 6px;
  background: white;
}
</style>
