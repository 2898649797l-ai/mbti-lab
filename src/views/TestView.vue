<template>
  <div class="test-page">
    <header class="page-header">
      <router-link class="text-button" to="/">{{ $t('test.exit') }}</router-link
      ><LangToggle />
    </header>
    <main class="test-main">
      <ProgressBar :current="currentIndex" :total="questions.length" />
      <p v-if="invalid" role="status" class="notice">{{ $t('test.invalidDraft') }}</p>
      <p v-if="!storageAvailable" role="status" class="notice">{{ $t('test.storageWarning') }}</p>
      <div class="question-heading">
        <span class="question-kicker">{{
          $t(mode === 'short' ? 'home.startShort' : 'home.startFull')
        }}</span>
        <h1>{{ $t('test.prompt') }}</h1>
        <p>{{ $t('test.hint') }}</p>
      </div>
      <QuestionCard
        v-if="currentQuestion"
        :question="currentQuestion"
        :selected="answers[currentIndex]"
        :disabled="busy"
        @answer="onAnswer"
      />
      <p class="saved-note" role="status">
        {{ $t(busy ? 'test.next' : storageAvailable ? 'test.saved' : 'test.unsaved') }}
      </p>
    </main>
    <footer class="test-footer">
      <button class="secondary-button" :disabled="busy || currentIndex === 0" @click="back">
        {{ $t('test.prev') }}</button
      ><span>{{ $t('test.exitHint') }}</span>
    </footer>
  </div>
</template>
<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ProgressBar from '../components/ProgressBar.vue'
import QuestionCard from '../components/QuestionCard.vue'
import LangToggle from '../components/LangToggle.vue'
import { useTest } from '../composables/useTest.js'
import { useResultStore } from '../composables/useResultStore.js'
import { useDraftStore } from '../composables/useDraftStore.js'
import { questions as allQuestions } from '../data/questions.js'
const router = useRouter(),
  route = useRoute(),
  draftStore = useDraftStore()
const { questions, currentIndex, answers, loadQuestions, answer, goBack, isComplete, result } =
  useTest()
const mode = ref('short'),
  busy = ref(false),
  invalid = ref(false),
  storageAvailable = ref(true)
let nextTimer = null
const currentQuestion = computed(() => questions.value[currentIndex.value] ?? null)
function persist() {
  storageAvailable.value = draftStore.save(mode.value, answers.value, currentIndex.value)
}
function finish() {
  const persisted = useResultStore().submit(result.value)
  draftStore.clear()
  router.replace({ path: '/result', query: persisted ? {} : { unsaved: '1' } })
}
onMounted(() => {
  const state = draftStore.load()
  invalid.value = state.invalid
  storageAvailable.value = state.available
  mode.value = state.draft ? state.draft.mode : route.query.mode === 'full' ? 'full' : 'short'
  loadQuestions(allQuestions, mode.value === 'short')
  if (state.draft) {
    answers.value = [...state.draft.answers]
    currentIndex.value = state.draft.currentIndex
  }
  if (isComplete.value) finish()
  else persist()
})
function onAnswer(choice) {
  if (busy.value || !['a', 'b'].includes(choice)) return
  busy.value = true
  answer(choice, false)
  persist()
  nextTimer = setTimeout(() => {
    if (currentIndex.value === questions.value.length - 1 && isComplete.value) finish()
    else {
      currentIndex.value++
      persist()
      busy.value = false
      window.scrollTo?.({ top: 0, behavior: 'instant' })
    }
  }, 280)
}
function back() {
  if (!busy.value) {
    goBack()
    window.scrollTo?.({ top: 0, behavior: 'instant' })
    persist()
  }
}
onUnmounted(() => clearTimeout(nextTimer))
</script>
<style scoped>
.test-page {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
.test-main {
  padding: 8px 20px 24px;
  flex: 1;
}
.question-heading {
  margin: 34px 0 24px;
}
.question-kicker {
  color: var(--blue);
  font-size: 13px;
  font-weight: 700;
}
h1 {
  font-size: 27px;
  line-height: 1.35;
  margin: 8px 0 12px;
}
.question-heading p {
  color: var(--ink-light);
  font-size: 16px;
}
.notice {
  margin-top: 16px;
}
.saved-note {
  color: var(--ink-light);
  font-size: 12px;
  text-align: center;
  margin: 20px 0 0;
}
.test-footer {
  padding: 16px 20px calc(20px + env(safe-area-inset-bottom));
}
.test-footer button:disabled {
  opacity: 0.4;
}
.test-footer span {
  display: block;
  text-align: center;
  margin-top: 10px;
  font-size: 12px;
  color: var(--ink-light);
}
</style>
