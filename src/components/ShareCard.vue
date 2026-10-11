<template>
  <div ref="cardEl" class="share-card" aria-hidden="true">
    <div class="sc-bg" :style="theme.bgStyle">
      <div class="sc-shape" :style="{ color: theme.accent }">✳</div>
      <div class="sc-body">
        <div class="sc-topbar">
          <span class="sc-site">{{ $t('app.title') }}</span
          ><span class="sc-number">16 PERSONALITIES</span>
        </div>
        <div class="sc-label">{{ $t('share.posterTitle') }}</div>
        <div class="sc-type" :style="{ color: theme.accent }">{{ type }}</div>
        <div class="sc-nickname">{{ data.nickname[locale] }}</div>
        <div class="sc-desc">{{ data.tagline[locale] }}</div>
        <div class="sc-strengths">
          <span v-for="s in data.strengths[locale]" :key="s" class="sc-tag">{{ s }}</span>
        </div>
        <div class="sc-footer">
          <div>
            <div class="sc-scan-label">{{ $t('share.scanLabel') }}</div>
            <div class="sc-note">{{ $t('share.posterNote') }}</div>
          </div>
          <img v-if="qrDataUrl" class="sc-qr" :src="qrDataUrl" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import QRCode from 'qrcode'
import { types } from '../data/types.js'
import { APP_URL } from '../config.js'
import { getShareTheme } from '../utils/shareTheme.js'
const props = defineProps({ type: String })
const { locale } = useI18n()
const cardEl = ref(null),
  qrDataUrl = ref('')
const data = computed(() => types[props.type])
const theme = computed(() => getShareTheme(props.type))
let qrReady
function prepareQr() {
  if (!qrReady)
    qrReady = QRCode.toDataURL(APP_URL, {
      width: 192,
      margin: 4,
      errorCorrectionLevel: 'M',
      color: { dark: '#272139', light: '#ffffff' },
    })
      .then((url) => {
        qrDataUrl.value = url
        return url
      })
      .catch((error) => {
        qrReady = null
        throw error
      })
  return qrReady
}
// Generate on mount for immediate preview; capture retries a failed request.
prepareQr().catch(() => {})
async function capture() {
  const { default: html2canvas } = await import('html2canvas')
  await prepareQr()
  await nextTick()
  if (document.fonts?.ready) await document.fonts.ready
  const images = [...cardEl.value.querySelectorAll('img')]
  await Promise.all(images.map((img) => (img.decode ? img.decode() : Promise.resolve())))
  const canvas = await html2canvas(cardEl.value, {
    scale: 2,
    width: 540,
    height: 720,
    useCORS: true,
    backgroundColor: null,
    onclone: (_doc, element) => {
      element.style.visibility = 'visible'
    },
  })
  return canvas.toDataURL('image/png')
}
defineExpose({ capture })
</script>
<style scoped>
.share-card {
  position: fixed;
  top: 0;
  left: 0;
  width: 540px;
  height: 720px;
  visibility: hidden;
  pointer-events: none;
  z-index: -1;
  contain: strict;
}
.sc-bg {
  width: 540px;
  height: 720px;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
}
.sc-shape {
  position: absolute;
  font-size: 330px;
  line-height: 1;
  top: 92px;
  right: -100px;
  opacity: 0.18;
  transform: rotate(-12deg);
}
.sc-body {
  position: relative;
  padding: 38px 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: white;
}
.sc-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sc-site {
  font-size: 20px;
  font-weight: 700;
}
.sc-number {
  font-size: 12px;
  letter-spacing: 0.1em;
  opacity: 0.65;
}
.sc-label {
  font-size: 13px;
  letter-spacing: 0.1em;
  margin-top: 38px;
  opacity: 0.8;
}
.sc-type {
  font-size: 100px;
  font-weight: 900;
  letter-spacing: 3px;
  line-height: 1.2;
  margin-top: 6px;
}
.sc-nickname {
  font-size: 32px;
  font-weight: 700;
  margin-top: 4px;
}
.sc-desc {
  font-size: 22px;
  line-height: 1.65;
  margin-top: 24px;
  max-width: 420px;
}
.sc-strengths {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}
.sc-tag {
  padding: 7px 12px;
  border: 1px solid #ffffff80;
  border-radius: 12px;
  font-size: 16px;
  line-height: 1.6;
}
.sc-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid #ffffff40;
}
.sc-scan-label {
  font-size: 18px;
  font-weight: 700;
}
.sc-note {
  margin-top: 6px;
  font-size: 13px;
  max-width: 290px;
  opacity: 0.8;
}
.sc-qr {
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  background: white;
  border-radius: 8px;
}
</style>
