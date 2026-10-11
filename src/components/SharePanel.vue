<template>
  <Teleport to="body">
    <div class="sp-overlay" @click.self="$emit('close')">
      <section
        ref="sheet"
        class="sp-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
        tabindex="-1"
        @keydown="onKeydown"
      >
        <header class="sp-header">
          <h2 id="share-title">{{ $t(type ? 'share.shareResult' : 'share.shareApp') }}</h2>
          <button class="text-button" @click="$emit('close')">{{ $t('share.close') }} ×</button>
        </header>
        <div v-if="type" data-section="result">
          <button class="primary-button" data-action="save-image" @click="saveImage">
            {{ $t('result.shareBtn') }} ↓
          </button>
          <p class="sp-help">{{ $t('share.help') }}</p>
          <button class="secondary-button" data-action="copy-text" @click="copyCaption">
            {{ captionCopied ? $t('share.copied') : $t('share.copyText') }}
          </button>
        </div>
        <p v-if="copyFailed" role="status" class="notice">{{ $t('share.copyFailed') }}</p>
        <textarea
          v-if="type || copyFailed"
          class="caption-field"
          readonly
          :value="caption"
          :aria-label="$t('share.textLabel')"
        />
        <div data-section="app">
          <button class="text-button copy-link" data-action="copy-link" @click="copyLink">
            {{ copied ? $t('share.copied') : $t('share.copyLink') }} ↗
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { APP_URL } from '../config.js'
import { types } from '../data/types.js'
const props = defineProps({
  type: { type: String, default: null },
  onSaveImage: { type: Function, default: null },
})
const emit = defineEmits(['close'])
const { t, locale } = useI18n()
const copied = ref(false),
  captionCopied = ref(false),
  copyFailed = ref(false),
  sheet = ref(null)
const caption = computed(() =>
  props.type
    ? t('share.caption', {
        type: props.type,
        nickname: types[props.type].nickname[locale.value],
        tagline: types[props.type].tagline[locale.value],
        url: APP_URL,
      })
    : t('share.appCaption', { url: APP_URL }),
)
let timer, oldFocus
async function copy(text, target) {
  copyFailed.value = false
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
    await navigator.clipboard.writeText(text)
    target.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      copied.value = false
      captionCopied.value = false
    }, 2000)
  } catch {
    copyFailed.value = true
    await nextTick()
    sheet.value?.querySelector('textarea')?.focus()
  }
}
function copyLink() {
  copy(APP_URL, copied)
}
function copyCaption() {
  copy(caption.value, captionCopied)
}
function saveImage() {
  props.onSaveImage?.()
  emit('close')
}
function onKeydown(e) {
  if (e.key === 'Escape') {
    emit('close')
    return
  }
  if (e.key !== 'Tab') return
  const els = [...sheet.value.querySelectorAll('button, textarea')]
  if (e.shiftKey && document.activeElement === els[0]) {
    e.preventDefault()
    els.at(-1)?.focus()
  } else if (!e.shiftKey && document.activeElement === els.at(-1)) {
    e.preventDefault()
    els[0]?.focus()
  }
}
onMounted(() => {
  oldFocus = document.activeElement
  sheet.value?.querySelector('button')?.focus()
})
onUnmounted(() => {
  clearTimeout(timer)
  oldFocus?.focus?.()
})
</script>
<style scoped>
.sp-overlay {
  position: fixed;
  inset: 0;
  background: #27213980;
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.sp-sheet {
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  max-height: 90dvh;
  overflow-y: auto;
  background: var(--cream);
  border-radius: 26px 26px 0 0;
  padding: 20px 20px calc(20px + env(safe-area-inset-bottom));
  animation: enter 0.2s ease-out;
}
.sp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 16px;
}
.sp-header h2 {
  font-size: 20px;
}
.sp-header button {
  flex-shrink: 0;
}
.sp-help {
  font-size: 14px;
  color: var(--ink-light);
  margin: 12px 0;
}
.caption-field {
  width: 100%;
  min-height: 160px;
  border: 1px solid var(--cream-border);
  border-radius: 16px;
  padding: 14px;
  font-size: 16px;
  line-height: 1.7;
  color: var(--ink);
  background: white;
  resize: vertical;
  margin-top: 14px;
}
.copy-link {
  width: 100%;
  justify-content: center;
  margin-top: 8px;
}
.notice {
  margin-top: 12px;
}
@keyframes enter {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
