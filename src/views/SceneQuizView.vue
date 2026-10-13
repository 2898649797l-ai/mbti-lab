<template>
  <header class="page-header">
    <router-link to="/explore" class="text-button">{{
      $t("test.exit")
    }}</router-link
    ><LangToggle />
  </header>
  <main v-if="test" class="feature-main scene-quiz">
    <p class="feature-eyebrow">
      {{ test.title[locale] }} · {{ $t("scene.twelve") }}
    </p>
    <div class="scene-progress">
      <span>{{ $t("test.progress", { current: index + 1, total: 12 }) }}</span
      ><progress
        :value="index + 1"
        max="12"
        :aria-label="$t('test.progressLabel')"
      />
    </div>
    <p v-if="invalid" role="status" class="notice">
      {{ $t("test.invalidDraft") }}
    </p>
    <p v-if="!available" role="status" class="notice">
      {{ $t("test.storageWarning") }}
    </p>
    <h1 class="scene-question">{{ test.questions[index].prompt[locale] }}</h1>
    <p class="feature-muted">
      {{ $t("scene.answerHint") }} · {{ $t("ux.auto") }}
    </p>
    <fieldset class="scene-choices">
      <legend class="sr-only">{{ $t("scene.scaleLabel") }}</legend>
      <button
        v-for="choice in choices"
        :key="choice"
        type="button"
        :class="{ selected: answers[index] === choice }"
        :aria-pressed="answers[index] === choice"
        :disabled="submitting"
        @click="choose(choice)"
      >
        {{ $t("scene.scale." + choice) }}
      </button>
    </fieldset>
    <div class="quiz-actions">
      <button
        class="secondary-button"
        :disabled="index === 0 || submitting"
        @click="back"
      >
        {{ $t("test.prev") }}
      </button>
    </div>
    <p class="feature-muted" role="status">
      {{ $t(available ? "test.saved" : "test.unsaved") }}
    </p>
    <button
      class="text-button"
      :disabled="submitting"
      @click="confirmRestart = true"
    >
      {{ $t("scene.restart") }}
    </button>
    <section
      v-if="confirmRestart"
      class="feature-card"
      role="group"
      :aria-label="$t('scene.restart')"
    >
      <p>{{ $t("scene.restartHint") }}</p>
      <button class="primary-button" @click="restart">
        {{ $t("home.confirmRestart") }}</button
      ><button class="secondary-button" @click="confirmRestart = false">
        {{ $t("home.keepDraft") }}
      </button>
    </section>
    <section v-if="failure" class="notice" role="alert">
      <p>{{ $t("ux.resultFailure") }}</p>
      <button class="secondary-button" @click="finish">
        {{ $t("ux.retry") }}
      </button>
    </section>
  </main>
  <main v-else class="feature-main">
    <h1>{{ $t("scene.unknown") }}</h1>
    <router-link to="/explore" class="primary-button">{{
      $t("scene.exploreTitle")
    }}</router-link>
  </main>
</template>
<script setup>
import { ref, computed, watch, onUnmounted, nextTick } from "vue";
import {
  useRoute,
  useRouter,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
} from "vue-router";
import { useI18n } from "vue-i18n";
import LangToggle from "../components/LangToggle.vue";
import { getSceneDefinition, testRegistry } from "../data/testRegistry.js";
import { useSceneStore } from "../composables/useSceneStore.js";
const { locale } = useI18n(),
  route = useRoute(),
  router = useRouter(),
  store = useSceneStore(),
  choices = [1, 2, 3, 4, 5];
const id = computed(() => String(route.params.testId)),
  test = computed(() => getSceneDefinition(id.value)),
  answers = ref([]),
  index = ref(0),
  invalid = ref(false),
  available = ref(true),
  confirmRestart = ref(false),
  submitting = ref(false),
  failure = ref(false);
let timer = null;
function cancel() {
  clearTimeout(timer);
  timer = null;
}
onUnmounted(cancel);
onBeforeRouteLeave(cancel);
onBeforeRouteUpdate(cancel);
watch(
  id,
  () => {
    cancel();
    confirmRestart.value = route.query.restart === "1";
    submitting.value = false;
    failure.value = false;
    if (!test.value) return;
    const state = store.loadDraft(id.value);
    invalid.value = state.invalid;
    available.value = state.available;
    answers.value = state.draft
      ? [...state.draft.answers]
      : Array(12).fill(null);
    index.value = state.draft?.currentIndex || 0;
    if (answers.value.every((a) => a !== null)) {
      const restoredId = id.value;
      nextTick(() => {
        if (id.value === restoredId) finish();
      });
    }
  },
  { immediate: true },
);
function save() {
  available.value = store.saveDraft(id.value, answers.value, index.value);
}
function choose(choice) {
  if (submitting.value || !choices.includes(choice)) return;
  submitting.value = true;
  answers.value[index.value] = choice;
  failure.value = false;
  save();
  timer = setTimeout(() => {
    timer = null;
    if (index.value === 11) finish();
    else {
      index.value++;
      save();
      submitting.value = false;
      scroll();
    }
  }, 280);
}
function scroll() {
  nextTick(() => window.scrollTo?.({ top: 0, behavior: "instant" }));
}
function back() {
  if (!submitting.value && index.value > 0) {
    index.value--;
    save();
    scroll();
  }
}
function finish() {
  if (!test.value || !answers.value.every((a) => a !== null)) return;
  submitting.value = true;
  try {
    const result = testRegistry[id.value].score(answers.value),
      saved = store.saveResult(result);
    store.clearDraft(id.value);
    router.push({
      path: "/quiz/" + id.value + "/result",
      query: saved ? {} : { unsaved: "1" },
    });
  } catch {
    failure.value = true;
    submitting.value = false;
  }
}
function restart() {
  cancel();
  submitting.value = false;
  store.clearDraft(id.value);
  answers.value = Array(12).fill(null);
  index.value = 0;
  invalid.value = false;
  confirmRestart.value = false;
  failure.value = false;
  save();
}
</script>
<style scoped>
.scene-progress {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: var(--blue);
}
progress {
  width: 100%;
  height: 10px;
  accent-color: var(--blue);
}
.scene-question {
  font-size: 23px !important;
  line-height: 1.6 !important;
}
.scene-choices {
  border: 0;
  display: grid;
  gap: 10px;
  min-width: 0;
}
.scene-choices button {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 54px;
  border: 1px solid var(--cream-border);
  background: white;
  border-radius: 16px;
  padding: 12px 16px;
  cursor: pointer;
}
.scene-choices button.selected {
  border: 2px solid var(--blue);
  background: var(--blue-light);
  padding: 11px 15px;
}
.scene-choices button {
  text-align: left;
  color: var(--ink);
  font-size: 16px;
}
.scene-choices button:disabled {
  cursor: default;
}
.quiz-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  position: sticky;
  bottom: 0;
  padding: 12px 0 calc(12px + env(safe-area-inset-bottom));
  background: var(--cream);
  z-index: 5;
}
.quiz-actions button {
  padding: 12px 8px;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
