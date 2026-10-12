<template>
  <div class="home">
    <header class="page-header">
      <span class="brand-mark"><i class="brand-dot" aria-hidden="true" />{{ $t('app.title') }}</span
      ><LangToggle />
    </header>
    <main class="home-main">
      <div class="eyebrow">{{ $t('home.eyebrow') }}</div>
      <h1>{{ $t('home.headline') }}</h1>
      <p class="intro">{{ $t('app.subtitle') }}</p>
      <div class="personality-orbit" aria-hidden="true">
        <span class="orbit-sticker sticker-one">INFP</span><span class="orbit-star">✳</span
        ><span class="orbit-sticker sticker-two">ENTP</span
        ><span class="orbit-sticker sticker-three">ISFJ</span
        ><span class="orbit-caption">{{ $t('home.orbit') }}</span>
      </div>
      <p v-if="invalid" role="status" class="notice">{{ $t('test.invalidDraft') }}</p>
      <p v-if="!storageAvailable" role="status" class="notice">{{ $t('test.storageWarning') }}</p>
      <div class="start-options">
        <template v-if="draft"
          ><button class="primary-button" @click="resume">{{ $t('home.continue') }} →</button>
          <p class="draft-caption">
            {{
              $t('home.draftProgress', {
                current: draft.currentIndex + 1,
                total: draft.answers.length,
              })
            }}
          </p>
          <button class="secondary-button" @click="start('short')">
            {{ $t('home.restartShort') }}
          </button></template
        >
        <button v-else class="primary-button" @click="start('short')">
          {{ $t('home.startShort') }} →
        </button>
        <p class="mode-caption">{{ $t('home.shortDesc') }} · {{ $t('home.free') }}</p>
        <button class="full-button" @click="start('full')">
          {{ $t('home.startFull') }} <span>{{ $t('home.fullDesc') }}</span> →
        </button>
      </div>
      <router-link v-if="lastResult" to="/result" class="history-card"
        ><span
          >{{ $t('home.lastResultLabel') }} <strong>{{ lastResult.type }}</strong></span
        ><span>{{ $t('home.viewLastResult') }}</span></router-link
      >
      <section class="explore-card">
        <span class="explore-symbol" aria-hidden="true">✦</span>
        <div>
          <h2>{{ $t('home.exploreTitle') }}</h2>
          <p>{{ $t('home.exploreDesc') }}</p>
          <router-link to="/types">{{ $t('home.browseTypes') }} →</router-link>
        </div>
      </section>
      <button class="text-button recommend" @click="showPanel = true">
        {{ $t('share.shareApp') }} ↗
      </button>
      <nav class="feature-nav" :aria-label="$t('social.navigation')"><router-link to="/profile">{{ $t('social.myProfile') }} →</router-link><router-link to="/compare">{{ $t('social.compareTitle') }} →</router-link></nav>
    </main>
    <SharePanel v-if="showPanel" @close="showPanel = false" />
    <div
      v-if="pendingMode"
      class="confirm-overlay"
      @click.self="pendingMode = null"
      @keydown.esc="pendingMode = null"
    >
      <section
        ref="confirmRef"
        class="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="restart-title"
        @keydown.tab="trapFocus"
      >
        <h2 id="restart-title">{{ $t('home.restartTitle') }}</h2>
        <p>{{ $t('home.restartBody') }}</p>
        <button class="primary-button" @click="confirmStart">{{ $t('home.confirmRestart') }}</button
        ><button class="secondary-button" @click="pendingMode = null">
          {{ $t('home.keepDraft') }}
        </button>
      </section>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import LangToggle from '../components/LangToggle.vue'
import SharePanel from '../components/SharePanel.vue'
import { useResultStore } from '../composables/useResultStore.js'
import { useDraftStore } from '../composables/useDraftStore.js'
const router = useRouter(),
  store = useDraftStore()
const lastResult = ref(null),
  draft = ref(null),
  invalid = ref(false),
  storageAvailable = ref(true),
  showPanel = ref(false),
  pendingMode = ref(null)
const confirmRef = ref(null)
let previousFocus
watch(pendingMode, async (mode) => {
  if (mode) {
    previousFocus = document.activeElement
    await nextTick()
    confirmRef.value?.querySelector('.secondary-button')?.focus()
  } else previousFocus?.focus?.()
})
function trapFocus(e) {
  const buttons = [...confirmRef.value.querySelectorAll('button')]
  if (e.shiftKey && document.activeElement === buttons[0]) {
    e.preventDefault()
    buttons.at(-1).focus()
  } else if (!e.shiftKey && document.activeElement === buttons.at(-1)) {
    e.preventDefault()
    buttons[0].focus()
  }
}
onMounted(() => {
  lastResult.value = useResultStore().load()
  const state = store.load()
  draft.value = state.draft
  invalid.value = state.invalid
  storageAvailable.value = state.available
})
function start(mode) {
  if (draft.value) pendingMode.value = mode
  else launch(mode)
}
function launch(mode) {
  store.clear()
  router.push({ path: '/test', query: { mode } })
}
function confirmStart() {
  const mode = pendingMode.value
  pendingMode.value = null
  launch(mode)
}
function resume() {
  router.push('/test')
}
</script>
<style scoped>
.home-main {
  padding: 16px 20px 12px;
}
.eyebrow {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 30px;
  background: #ede6ff;
  color: var(--blue);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
}
h1 {
  font-size: clamp(34px, 10vw, 44px);
  line-height: 1.22;
  letter-spacing: -0.04em;
  margin: 18px 0 12px;
  white-space: pre-line;
}
.intro {
  font-size: 16px;
  max-width: 340px;
  color: var(--ink-light);
}
.personality-orbit {
  height: 170px;
  position: relative;
  margin: 12px 0 20px;
  overflow: hidden;
}
.orbit-star {
  position: absolute;
  left: 38%;
  top: 4px;
  font-size: 106px;
  line-height: 1;
  color: var(--blue);
  transform: rotate(8deg);
}
.orbit-sticker {
  position: absolute;
  padding: 8px 16px;
  border-radius: 14px;
  font-size: 21px;
  font-weight: 900;
  letter-spacing: 0.05em;
  border: 2px solid var(--ink);
  box-shadow: 3px 3px 0 var(--ink);
}
.sticker-one {
  top: 28px;
  left: 3%;
  background: #d9f27b;
  transform: rotate(-12deg);
}
.sticker-two {
  top: 74px;
  right: 1%;
  background: #ffb79a;
  transform: rotate(10deg);
}
.sticker-three {
  top: 103px;
  left: 12%;
  background: #e2d3ff;
  transform: rotate(-5deg);
}
.orbit-caption {
  position: absolute;
  bottom: 0;
  right: 6%;
  font-size: 12px;
  color: var(--ink-light);
}
.start-options {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}
.mode-caption,
.draft-caption {
  text-align: center;
  font-size: 13px;
  color: var(--ink-light);
}
.full-button {
  border: 0;
  min-height: 54px;
  text-align: center;
  background: transparent;
  font-weight: 700;
  color: var(--ink);
  padding: 12px 0;
}
.full-button span {
  display: block;
  font-size: 12px;
  font-weight: 400;
  color: var(--ink-light);
}
.history-card {
  margin: 12px 0 20px;
  padding: 16px;
  border-radius: 16px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}
.history-card strong {
  color: var(--blue);
}
.explore-card {
  margin-top: 24px;
  display: flex;
  gap: 16px;
  border-top: 1px solid var(--cream-border);
  padding-top: 24px;
}
.explore-symbol {
  color: var(--blue);
  font-size: 40px;
}
.explore-card h2 {
  font-size: 18px;
}
.explore-card p {
  color: var(--ink-light);
  font-size: 14px;
  margin: 6px 0;
}
.explore-card a {
  font-size: 14px;
  display: inline-flex;
  min-height: 44px;
  align-items: center;
}
.recommend {
  margin-top: 12px;
  width: 100%;
  justify-content: center;
}
.notice {
  margin-bottom: 12px;
}
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: #27213980;
  z-index: 300;
  display: grid;
  place-items: center;
  padding: 20px;
}
.confirm-dialog {
  background: var(--cream);
  padding: 24px;
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
}
.confirm-dialog h2 {
  font-size: 22px;
}
.confirm-dialog p {
  margin: 12px 0 20px;
}
.confirm-dialog button + button {
  margin-top: 10px;
}
</style>
