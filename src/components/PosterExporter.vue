<template>
  <section class="feature-card poster-exporter">
    <h2>{{ $t('social.cardPreview') }}</h2>
    <p class="feature-muted">{{ $t('social.beforeExport') }}</p>
    <div class="export-preview">
      <strong>{{ model.title }}</strong>
      <p>{{ model.subtitle }}</p>
      <p v-for="(line, i) in model.lines" :key="i">{{ line }}</p>
      <div class="feature-tags">
        <span v-for="tag in [...new Set(model.tags || [])]" :key="tag">{{ tag }}</span>
      </div>
    </div>
    <details v-if="!snapshotUrl">
      <summary>{{ $t('social.addQrProfile') }}</summary>
      <label class="feature-label"
        >{{ $t('social.qrProfileLink')
        }}<textarea v-model="linkInput" class="feature-input" :disabled="busy" /></label
      ><button class="secondary-button" :disabled="busy" @click="approveLink">
        {{ $t('social.previewQrProfile') }}
      </button>
      <p v-if="linkError" class="notice" role="alert">{{ $t('social.errors.' + linkError) }}</p>
      <div v-if="approvedSnapshot" class="export-preview">
        <strong>{{ approvedSnapshot.n || $t('social.unnamed') }}</strong>
        <p v-if="approvedSnapshot.m">{{ approvedSnapshot.m.t }} · {{ approvedProfile.nickname }}</p>
        <p v-if="approvedProfile">{{ approvedProfile.summary }}</p>
        <template v-if="approvedPercents"
          ><h3>{{ $t('social.sharedDimensions') }}</h3>
          <DimensionBars :percents="approvedPercents"
        /></template>
        <section v-for="scene in approvedScenes" :key="scene.id">
          <h3>{{ scene.title }}</h3>
          <p v-for="axis in scene.axes" :key="axis.id">
            {{ axis.label }} · {{ $t('scene.scoreLabel') }} {{ axis.score }} / 100
          </p>
        </section>
        <p>{{ $t('social.privacyWarning') }}</p>
      </div>
    </details>
    <label class="feature-label"
      >{{ $t('social.qrTarget')
      }}<select v-model="target" class="feature-input" :disabled="busy">
        <option value="home">{{ $t('social.homeQr') }}</option>
        <option v-if="availableSnapshotUrl" value="profile">{{ $t('social.profileQr') }}</option>
      </select></label
    >
    <details>
      <summary>{{ $t('social.actualTarget') }}</summary>
      <p class="target-url">{{ qrTarget }}</p>
    </details>
    <p v-if="target === 'profile'" class="feature-muted">{{ $t('social.privacyWarning') }}</p>
    <button class="primary-button" :disabled="busy" @click="save">
      {{ $t(busy ? 'share.generating' : 'social.generateCard') }}
    </button>
    <p v-if="failed" role="alert" class="notice">{{ $t('share.exportError') }}</p>
    <div v-if="image" class="generated-preview">
      <img :src="image" :alt="model.title" />
      <p class="feature-muted">{{ $t('share.saveHint') }}</p>
      <a class="secondary-button" :href="image" :download="'personality-' + model.kind + '.png'">{{
        $t('share.saveImage')
      }}</a>
    </div>
    <SocialPoster ref="poster" :model="model" :url="qrTarget" />
  </section>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { APP_URL } from '../config.js'
import SocialPoster from './SocialPoster.vue'
import DimensionBars from './DimensionBars.vue'
import { useI18n } from 'vue-i18n'
import { snapshotFromUrl, snapshotProfile, snapshotPercents } from '../utils/profileSnapshot.js'
import { sharedSceneReport } from '../data/testRegistry.js'
const props = defineProps({
  model: { type: Object, required: true },
  snapshotUrl: { type: String, default: '' },
})
const { locale } = useI18n(),
  target = ref('home'),
  busy = ref(false),
  image = ref(''),
  failed = ref(false),
  poster = ref(null),
  linkInput = ref(''),
  approvedLink = ref(''),
  approvedSnapshot = ref(null),
  linkError = ref('')
const availableSnapshotUrl = computed(() => props.snapshotUrl || approvedLink.value),
  approvedProfile = computed(() =>
    approvedSnapshot.value ? snapshotProfile(approvedSnapshot.value, locale.value) : null,
  )
const approvedPercents = computed(() =>
    approvedSnapshot.value ? snapshotPercents(approvedSnapshot.value) : null,
  ),
  approvedScenes = computed(() =>
    (approvedSnapshot.value?.s || []).map((s) => sharedSceneReport(s, locale.value)),
  )
const qrTarget = computed(() =>
  target.value === 'profile' && availableSnapshotUrl.value ? availableSnapshotUrl.value : APP_URL,
)
watch(linkInput, () => {
  approvedLink.value = ''
  approvedSnapshot.value = null
  target.value = 'home'
  linkError.value = ''
})
function approveLink() {
  try {
    approvedSnapshot.value = snapshotFromUrl(linkInput.value)
    approvedLink.value = linkInput.value.trim()
    linkError.value = ''
  } catch (e) {
    approvedLink.value = ''
    approvedSnapshot.value = null
    target.value = 'home'
    linkError.value = e.code || 'invalid'
  }
}
let revision = 0
watch(
  [() => props.model, availableSnapshotUrl, target],
  () => {
    revision++
    image.value = ''
    failed.value = false
    if (!availableSnapshotUrl.value) target.value = 'home'
  },
  { deep: true },
)
async function save() {
  if (busy.value) return
  busy.value = true
  failed.value = false
  const rev = revision
  try {
    const output = await poster.value.capture()
    if (rev === revision) image.value = output
  } catch {
    failed.value = true
  } finally {
    busy.value = false
  }
}
</script>
<style scoped>
.export-preview {
  padding: 18px;
  background: var(--blue-light);
  border-radius: 18px;
  display: grid;
  gap: 10px;
  margin: 16px 0;
}
.export-preview strong {
  font-size: 22px;
}
.target-url {
  font-size: 12px;
  overflow-wrap: anywhere;
  padding: 12px 0;
}
.generated-preview {
  display: grid;
  gap: 14px;
  margin-top: 16px;
}
.generated-preview img {
  width: 100%;
  height: auto;
  border-radius: 16px;
}
.poster-exporter > button {
  margin-top: 16px;
}
summary {
  min-height: 44px;
  cursor: pointer;
  padding: 10px 0;
  color: var(--blue);
}
</style>
