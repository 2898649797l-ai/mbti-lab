<template>
  <header class="page-header">
    <router-link to="/" class="text-button">{{
      $t("types.backHome")
    }}</router-link
    ><LangToggle />
  </header>
  <main class="feature-main">
    <template v-if="snapshot"
      ><SnapshotBody ref="body" :snapshot="snapshot" /><router-link
        v-if="snapshot.m"
        :to="{ path: '/compare', query: { friend: payload } }"
        class="primary-button"
        >{{ $t("social.compareMe") }} →</router-link
      ><router-link to="/profile" class="secondary-button">{{
        $t("social.myProfile")
      }}</router-link></template
    >
    <section v-else class="feature-card">
      <h1>{{ $t("social.unavailable") }}</h1>
      <p role="alert">{{ $t("social.errors." + error) }}</p>
      <router-link to="/" class="text-button">{{
        $t("types.backHome")
      }}</router-link>
    </section>
  </main>
  <ReportDock
    v-if="snapshot"
    @contents="body?.contents()"
    @share="showShare = true"
  /><ShareSheet
    v-if="snapshot && showShare"
    :model="posterModel"
    :snapshot-url="shareUrl"
    @close="showShare = false"
  />
</template>
<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import ShareSheet from "../components/ShareSheet.vue";
import ReportDock from "../components/ReportDock.vue";
import { snapshotProfile, profileUrl } from "../utils/profileSnapshot.js";
import { sharedSceneReport } from "../data/testRegistry.js";
import { useRoute } from "vue-router";
import LangToggle from "../components/LangToggle.vue";
import SnapshotBody from "../components/SnapshotBody.vue";
import { decodeSnapshot, MAX_PROFILE_URL } from "../utils/profileSnapshot.js";
const showShare = ref(false),
  body = ref(null),
  { locale, t } = useI18n();
const route = useRoute(),
  payload = computed(() => String(route.params.payload || ""));
const parsed = computed(() => {
  try {
    if (window.location.href.length > MAX_PROFILE_URL)
      throw { code: "tooLong" };
    return { snapshot: decodeSnapshot(payload.value) };
  } catch (e) {
    return { error: e.code || "invalid" };
  }
});
const snapshot = computed(() => parsed.value.snapshot),
  error = computed(() => parsed.value.error);
const shareUrl = computed(() =>
  snapshot.value ? profileUrl(snapshot.value) : "",
);
const posterModel = computed(() => {
  const p = snapshotProfile(snapshot.value, locale.value);
  if (p)
    return {
      kind: "personal",
      kicker: t("social.sharedSnapshot"),
      title: snapshot.value.m.t + " · " + p.nickname,
      subtitle: snapshot.value.n || p.nickname,
      description: p.summary,
      lines: p.report.highlights || p.report.quirks,
      tags: p.tags,
    };
  const r = sharedSceneReport(snapshot.value.s[0], locale.value);
  return {
    kind: "scene",
    kicker: t("scene.eyebrow"),
    title: r.title,
    subtitle: snapshot.value.n || t("scene.posterSubtitle"),
    lines: r.axes.map((a) => a.share),
    tags: [],
  };
});
</script>
<style scoped>
.feature-main {
  padding-bottom: 110px;
}
</style>
