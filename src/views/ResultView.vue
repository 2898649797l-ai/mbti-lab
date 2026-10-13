<template>
  <div class="result-page">
    <header class="page-header">
      <router-link to="/" class="text-button">{{
        $t("types.backHome")
      }}</router-link
      ><LangToggle />
    </header>
    <main class="result-main">
      <template v-if="result">
        <p v-if="route.query.unsaved === '1'" role="status" class="notice">
          {{ $t("result.storageWarning") }}
        </p>
        <ResultCard
          ref="reportRef"
          :type="result.type"
          :percents="result.percents"
          ><template #action
            ><button class="hero-save" @click="showPanel = true">
              {{ $t("result.shareBtn") }} ↓
            </button></template
          ></ResultCard
        >
        <div class="actions">
          <router-link to="/explore" class="secondary-button"
            >{{ $t("scene.more") }} →</router-link
          >
          <router-link to="/profile" class="secondary-button"
            >{{ $t("social.myProfile") }} →</router-link
          >
          <router-link to="/compare" class="secondary-button"
            >{{ $t("social.compareTitle") }} →</router-link
          >
          <button class="secondary-button btn-share" @click="showPanel = true">
            {{ $t("share.copyText") }} ↗</button
          ><router-link to="/" class="text-button btn-retake">{{
            $t("result.retake")
          }}</router-link>
        </div>
        <ShareSheet
          v-if="showPanel"
          :model="posterModel"
          @close="showPanel = false"
        />
      </template>
      <div v-else class="no-result">
        <p>{{ $t("result.notFound") }}</p>
        <router-link to="/" class="secondary-button">{{
          $t("result.backHome")
        }}</router-link>
      </div>
    </main>
    <ReportDock
      v-if="result"
      @contents="reportRef?.contents()"
      @share="showPanel = true"
    />
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import ReportDock from "../components/ReportDock.vue";
const reportRef = ref(null);
import LangToggle from "../components/LangToggle.vue";
import ResultCard from "../components/ResultCard.vue";
import ShareSheet from "../components/ShareSheet.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { personalityPoster } from "../utils/posterModels.js";

import { useResultStore } from "../composables/useResultStore.js";
const route = useRoute();
const { locale } = useI18n();
const result = ref(null),
  showPanel = ref(false);
const posterModel = computed(() =>
  result.value ? personalityPoster(result.value.type, locale.value) : null,
);
onMounted(() => {
  result.value = useResultStore().load();
});
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
  background: var(--blue);
  color: white;
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
.no-result {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  text-align: center;
}
</style>
