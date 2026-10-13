<template>
  <header class="page-header">
    <router-link to="/" class="text-button">{{
      $t("types.backHome")
    }}</router-link
    ><LangToggle />
  </header>
  <main class="feature-main">
    <h1>{{ $t("social.myProfile") }}</h1>
    <p class="feature-muted">{{ $t("social.buildIntro") }}</p>
    <p class="flow-step">1 · {{ $t("ux.selectPublic") }}</p>
    <section class="feature-card">
      <label class="feature-label"
        >{{ $t("social.nickname")
        }}<input
          v-model="name"
          class="feature-input"
          maxlength="40"
          autocomplete="off"
      /></label>
      <p class="feature-muted">{{ Array.from(name.trim()).length }} / 20</p>
      <label v-if="result" class="feature-check"
        ><input v-model="includeType" type="checkbox" />{{
          $t("social.includeType")
        }}
        · {{ result.type }}</label
      >
      <label v-if="result && includeType" class="feature-check"
        ><input v-model="includePercents" type="checkbox" />{{
          $t("social.includePercents")
        }}</label
      >
      <label
        v-for="scene in recentScenes"
        :key="scene.testId"
        class="feature-check"
        ><input
          v-model="selectedScenes"
          type="checkbox"
          :value="scene.testId"
        />{{
          $t("social.includeScene", { name: $t("scene.names." + scene.testId) })
        }}</label
      >
      <p class="feature-muted">{{ $t("social.privacyWarning") }}</p>
    </section>
    <p v-if="visibleError" role="alert" class="notice">
      {{ $t("social.errors." + visibleError) }}
    </p>
    <p v-if="!result && !recentScenes.length" class="notice">
      {{ $t("social.noResult") }}
    </p>
    <template v-if="draft"
      ><h2 class="preview-heading">{{ $t("social.visiblePreview") }}</h2>
      <section class="feature-card public-summary">
        <p class="flow-step">2 · {{ $t("ux.summaryPreview") }}</p>
        <h3>{{ name.trim() || $t("social.unnamed") }}</h3>
        <template v-if="previewProfile"
          ><strong>{{ draft.m.t }} · {{ previewProfile.nickname }}</strong>
          <p>{{ previewProfile.summary }}</p>
          <ul>
            <li
              v-for="line in previewProfile.report.highlights ||
              previewProfile.report.quirks"
              :key="line"
            >
              {{ line }}
            </li>
          </ul></template
        >
        <p v-else>{{ $t("social.sceneOnly") }}</p>
        <template v-if="includePercents"
          ><h3>{{ $t("social.sharedDimensions") }}</h3>
          <DimensionBars :percents="result.percents"
        /></template>
        <section v-for="scene in previewScenes" :key="scene.id">
          <h3>{{ scene.title }}</h3>
          <p v-for="axis in scene.axes" :key="axis.id">
            {{ axis.label }} · {{ axis.score }} / 100<br />{{ axis.summary }}
          </p>
        </section>
      </section>
      <details class="feature-card">
        <summary>{{ $t("ux.fullPreview") }}</summary>
        <SnapshotBody :snapshot="draft" />
      </details>
      <p class="flow-step">3 · {{ $t("social.createLink") }}</p>
      <button class="primary-button" @click="generate">
        {{ $t("social.createLink") }}
      </button></template
    >
    <section v-if="link" class="feature-card">
      <h2>{{ $t("social.readyLink") }}</h2>
      <p class="feature-muted">{{ $t("social.linkFixed") }}</p>
      <CopyText :value="link" :label="$t('share.copyLink')" /><router-link
        :to="'/p/' + encodeSnapshot(published)"
        class="text-button"
        >{{ $t("social.openProfile") }} →</router-link
      >
    </section>
    <button v-if="draft" class="secondary-button" @click="showShare = true">
      {{ $t("social.cardPreview") }} →
    </button>
    <ShareSheet
      v-if="showShare && draft"
      :model="posterModel"
      :snapshot-url="link"
      :caption="shareCaption"
      @close="showShare = false"
    />
  </main>
</template>
<script setup>
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import LangToggle from "../components/LangToggle.vue";
import SnapshotBody from "../components/SnapshotBody.vue";
import CopyText from "../components/CopyText.vue";
import ShareSheet from "../components/ShareSheet.vue";
import DimensionBars from "../components/DimensionBars.vue";
import { useResultStore } from "../composables/useResultStore.js";
import { useSceneStore } from "../composables/useSceneStore.js";
import {
  sceneTests,
  sceneReport,
  sharedSceneReport,
} from "../data/testRegistry.js";
import { APP_URL } from "../config.js";
import {
  createSnapshot,
  profileUrl,
  snapshotProfile,
  encodeSnapshot,
} from "../utils/profileSnapshot.js";
const { locale, t } = useI18n(),
  result = ref(useResultStore().peek()),
  name = ref(""),
  includeType = ref(!!result.value),
  includePercents = ref(false),
  published = ref(null),
  link = ref(""),
  error = ref(""),
  selectedScenes = ref([]),
  showShare = ref(false);
const sceneStore = useSceneStore(),
  recentScenes = Object.keys(sceneTests)
    .map((id) => sceneStore.readResult(id))
    .filter(Boolean);
const options = () => ({
  result: includeType.value ? result.value : null,
  name: name.value,
  includePercents: includePercents.value,
  scenes: recentScenes.filter((s) => selectedScenes.value.includes(s.testId)),
});
const draftState = computed(() => {
  try {
    return { snapshot: createSnapshot(options()) };
  } catch (e) {
    return { error: e.code || "invalid" };
  }
});
const previewProfile = computed(() =>
  draftState.value.snapshot
    ? snapshotProfile(draftState.value.snapshot, locale.value)
    : null,
);
const previewScenes = computed(() =>
  (draftState.value.snapshot?.s || []).map((s) =>
    sharedSceneReport(s, locale.value),
  ),
);
const draft = computed(() => draftState.value.snapshot),
  visibleError = computed(() => error.value || draftState.value.error);
watch(
  [name, includeType, includePercents, selectedScenes],
  () => {
    if (!includeType.value) includePercents.value = false;
    link.value = "";
    published.value = null;
    error.value = "";
  },
  { deep: true },
);
function generate() {
  try {
    const value = createSnapshot(options());
    link.value = profileUrl(value);
    published.value = value;
    error.value = "";
  } catch (e) {
    error.value = e.code || "invalid";
  }
}
const posterModel = computed(() => {
  const p = snapshotProfile(draft.value, locale.value);
  if (p)
    return {
      kind: "personal",
      kicker: t("social.myProfile"),
      title: draft.value.m.t + " · " + p.nickname,
      subtitle: draft.value.n || p.nickname,
      description: p.summary,
      lines: p.report.highlights || p.report.quirks,
      tags: p.tags,
    };
  const first = draft.value.s[0],
    r = sceneReport(
      { testId: first.id, version: first.v, scores: first.a },
      locale.value,
    );
  return {
    kind: "scene",
    kicker: t("scene.eyebrow"),
    title: r.title,
    subtitle: draft.value.n || t("scene.posterSubtitle"),
    lines: r.axes.map((a) => a.share),
    tags: [],
  };
});
const shareCaption = computed(() =>
  [
    posterModel.value.title,
    posterModel.value.subtitle,
    ...posterModel.value.lines,
    link.value || APP_URL,
  ].join("\n"),
);
</script>

<style scoped>
.public-summary ul {
  padding-left: 22px;
}
.public-summary li + li {
  margin-top: 8px;
}
.flow-step {
  color: var(--blue);
  font-weight: 650;
}
summary {
  min-height: 44px;
  padding: 10px 0;
  cursor: pointer;
  font-weight: 650;
}
</style>
