<template>
  <div class="result-page">
    <header class="page-header">
      <router-link to="/" class="text-button">{{ $t('types.backHome') }}</router-link
      ><LangToggle />
    </header>
    <main class="result-main">
      <template v-if="result">
        <p v-if="route.query.unsaved === '1'" role="status" class="notice">
          {{ $t('result.storageWarning') }}
        </p>
        <ResultCard :type="result.type" :percents="result.percents"
          ><template #action
            ><button class="hero-save" :disabled="generating" @click="savePoster">
              {{ $t('result.shareBtn') }} ↓
            </button></template
          ></ResultCard
        >
        <div class="actions">
          <router-link to="/profile" class="secondary-button">{{ $t('social.myProfile') }} →</router-link>
          <router-link to="/compare" class="secondary-button">{{ $t('social.compareTitle') }} →</router-link>
          <button class="secondary-button btn-share" @click="showPanel = true">
            {{ $t('share.copyText') }} ↗</button
          ><router-link to="/" class="text-button btn-retake">{{
            $t('result.retake')
          }}</router-link>
        </div>
        <p v-if="generating" class="poster-status" role="status">{{ $t('share.generating') }}</p>
        <div v-if="exportError" class="poster-status" role="alert">
          <p>{{ $t('share.exportError') }}</p>
          <button class="secondary-button" @click="savePoster">{{ $t('share.retry') }}</button>
        </div>
        <section v-if="posterUrl" ref="previewRef" class="poster-preview" aria-live="polite">
          <h2 class="section-title">{{ $t('share.shareResult') }}</h2>
          <p>{{ $t('share.saveHint') }}</p>
          <img :src="posterUrl" :alt="$t('share.posterAlt', { type: result.type })" /><a
            class="primary-button"
            :href="posterUrl"
            :download="'mbti-' + result.type + '.png'"
            >{{ $t('share.saveImage') }} ↓</a
          ><button class="secondary-button" @click="showPanel = true">
            {{ $t('share.copyText') }}
          </button>
        </section>
        <SharePanel
          v-if="showPanel"
          :type="result.type"
          :onSaveImage="savePoster"
          @close="showPanel = false"
        />
        <ShareCard ref="shareCardRef" :type="result.type" />
      </template>
      <div v-else class="no-result">
        <p>{{ $t('result.notFound') }}</p>
        <router-link to="/" class="secondary-button">{{ $t('result.backHome') }}</router-link>
      </div>
    </main>
    <div v-if="result" class="result-dock">
      <button class="primary-button" :disabled="generating" @click="savePoster">
        {{ $t(generating ? 'share.generating' : 'result.shareBtn') }} ↓
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import LangToggle from '../components/LangToggle.vue'
import ResultCard from '../components/ResultCard.vue'
import ShareCard from '../components/ShareCard.vue'
import SharePanel from '../components/SharePanel.vue'
import { useResultStore } from '../composables/useResultStore.js'
const route = useRoute()
const result = ref(null),
  shareCardRef = ref(null),
  showPanel = ref(false),
  posterUrl = ref(''),
  generating = ref(false),
  exportError = ref(false),
  previewRef = ref(null)
async function savePoster() {
  if (generating.value) return
  if (posterUrl.value) {
    previewRef.value?.scrollIntoView?.({ block: 'start' })
    return
  }
  generating.value = true
  exportError.value = false
  try {
    posterUrl.value = await shareCardRef.value.capture()
    await nextTick()
    previewRef.value?.scrollIntoView?.({ block: 'start' })
  } catch {
    exportError.value = true
  } finally {
    generating.value = false
  }
}
onMounted(() => {
  result.value = useResultStore().load()
})
</script>
<style scoped>
.result-main {
  padding: 8px 20px 24px;
}
.notice {
  margin-bottom: 16px;
}
.hero-save {
  margin-top: 24px;
  border: 0;
  border-radius: 16px;
  background: white;
  color: #422681;
  padding: 14px 16px;
  min-height: 54px;
  width: 100%;
  font-weight: 700;
}
.actions {
  display: grid;
  gap: 12px;
  margin: 24px 0;
}
.btn-retake {
  justify-content: center;
}
.poster-status {
  padding: 16px;
  border-radius: 16px;
  background: #fff0d7;
  margin: 16px 0;
}
.poster-status button {
  margin-top: 12px;
}
.poster-preview {
  scroll-margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 0;
}
.poster-preview p {
  font-size: 14px;
  color: var(--ink-light);
}
.poster-preview img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
}
.poster-preview h2 {
  margin: 0;
}
.result-dock {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
  background: #fffaf1f5;
  border-top: 1px solid var(--cream-border);
  z-index: 50;
}
.no-result {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  text-align: center;
}
.hero-save:disabled {
  opacity: 0.6;
}
</style>
