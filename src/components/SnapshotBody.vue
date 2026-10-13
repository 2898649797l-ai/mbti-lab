<template>
  <div>
    <section class="feature-card snapshot-hero">
      <p class="feature-muted">{{ $t("social.sharedSnapshot") }}</p>
      <h1>{{ snapshot.n || $t("social.unnamed") }}</h1>
      <template v-if="profile"
        ><strong class="snapshot-type"
          >{{ snapshot.m.t }} · {{ profile.nickname }}</strong
        >
        <p>{{ profile.summary }}</p>
        <div class="feature-tags">
          <span v-for="tag in profile.tags" :key="tag">{{ tag }}</span>
        </div></template
      >
      <p v-else>{{ $t("social.sceneOnly") }}</p>
    </section>
    <section v-if="profile?.report.highlights" class="feature-card">
      <h2>{{ $t("ux.overview") }}</h2>
      <p v-for="line in profile.report.highlights" :key="line">{{ line }}</p>
    </section>
    <details ref="contents" class="feature-card">
      <summary>{{ $t("ux.contents") }}</summary>
      <nav class="report-toc" :aria-label="$t('ux.contents')">
        <template v-if="profile"
          ><button
            v-for="section in profile.report.sections"
            :key="section.id"
            @click="reader?.jump(section.id)"
          >
            {{ $t("report.sections." + section.id) }}
          </button></template
        ><button
          v-for="report in sceneReports"
          :key="report.id"
          @click="jumpScene(report.id)"
        >
          {{ report.title }}
        </button>
      </nav>
    </details>
    <section v-if="percents" class="feature-card">
      <h2>{{ $t("social.sharedDimensions") }}</h2>
      <p class="feature-muted">{{ $t("result.percentNote") }}</p>
      <DimensionBars :percents="percents" />
    </section>
    <section
      v-for="report in sceneReports"
      :key="report.id"
      :ref="(el) => (sceneSections[report.id] = el)"
      class="feature-card shared-scene"
    >
      <h2>{{ report.title }}</h2>
      <p class="feature-muted">{{ $t("scene.scoreNote") }}</p>
      <div v-for="axis in report.axes" :key="axis.id">
        <strong>{{ axis.label }}</strong>
        <p>{{ $t("scene.scoreLabel") }} {{ axis.score }} / 100</p>
        <p>{{ axis.summary }}</p>
      </div>
      <details>
        <summary>{{ $t("scene.details") }}</summary>
        <SceneReportBody
          :result="{
            testId: report.id,
            version: report.version,
            scores: report.axes.map((a) => a.score),
          }"
        />
      </details>
    </section>
    <ReportReader
      ref="reader"
      v-if="profile"
      :report="profile.report"
      :overview="false"
      :show-contents="false"
    />
    <p class="feature-muted">{{ $t("social.snapshotNote") }}</p>
  </div>
</template>
<script setup>
import ReportReader from "./ReportReader.vue";
import { computed, ref, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import DimensionBars from "./DimensionBars.vue";
import SceneReportBody from "./SceneReportBody.vue";
import { sharedSceneReport } from "../data/testRegistry.js";
import { snapshotProfile, snapshotPercents } from "../utils/profileSnapshot.js";
const props = defineProps({ snapshot: { type: Object, required: true } });
const { locale } = useI18n();
const profile = computed(() => snapshotProfile(props.snapshot, locale.value)),
  percents = computed(() => snapshotPercents(props.snapshot));
const reader = ref(null),
  contents = ref(null),
  sceneSections = {};
async function jumpScene(id) {
  const section = sceneSections[id];
  if (!section) return;
  section.querySelector("details").open = true;
  await nextTick();
  section.scrollIntoView?.({ block: "start", behavior: "instant" });
}
defineExpose({
  contents: () => {
    contents.value.open = true;
    contents.value.scrollIntoView?.({ block: "start", behavior: "instant" });
  },
});
const sceneReports = computed(() =>
  props.snapshot.s.map((s) => sharedSceneReport(s, locale.value)),
);
</script>
<style scoped>
.shared-scene {
  scroll-margin: 20px;
}
.snapshot-hero {
  background: #f8f9fb;
}
.snapshot-type {
  display: block;
  font-size: 24px;
  margin: 16px 0;
}
.manual-card {
  background: #f8f9fb;
}
summary {
  min-height: 44px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  padding: 8px 0;
}
details p {
  margin-top: 16px;
  line-height: 1.85;
}
</style>
