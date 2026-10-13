<template>
  <div class="report-reader">
    <section
      v-if="overview && report.highlights?.length"
      class="feature-card overview"
    >
      <h2>{{ $t("ux.overview") }}</h2>
      <ul>
        <li v-for="line in report.highlights" :key="line">{{ line }}</li>
      </ul>
    </section>
    <details
      v-if="showContents"
      ref="contents"
      class="feature-card report-contents"
      id="report-contents"
    >
      <summary>{{ $t("ux.contents") }}</summary>
      <nav class="report-toc" :aria-label="$t('ux.contents')">
        <button
          v-for="section in report.sections"
          :key="section.id"
          @click="jump(section.id)"
        >
          {{ $t("report.sections." + section.id) }}
        </button>
      </nav>
    </details>
    <details
      v-for="section in report.sections"
      :key="section.id"
      :ref="(el) => (sections[section.id] = el)"
      class="feature-card report-section"
      :id="'report-' + section.id"
      :open="section.id === 'core'"
    >
      <summary>{{ $t("report.sections." + section.id) }}</summary>
      <p v-for="paragraph in section.paragraphs" :key="paragraph">
        {{ paragraph }}
      </p>
      <div
        v-if="section.id === 'growth' && report.actions?.length"
        class="growth-actions"
      >
        <article v-for="item in report.actions" :key="item.context">
          <h3>{{ item.context }}</h3>
          <p>{{ item.step }}</p>
          <blockquote>{{ item.phrase }}</blockquote>
        </article>
      </div>
      <router-link
        v-if="related[section.id]"
        :to="'/quiz/' + related[section.id]"
        class="related-link"
        >{{ $t("ux.related") }} ·
        {{ $t("ux.sceneNames." + related[section.id]) }} →</router-link
      >
    </details>
    <details class="feature-card report-section">
      <summary>{{ $t("report.neighbors") }}</summary>
      <p class="feature-muted">{{ $t("report.neighborNote") }}</p>
      <div v-for="neighbor in report.neighbors" :key="neighbor.type">
        <router-link :to="{ path: '/types', query: { type: neighbor.type } }">{{
          neighbor.type
        }}</router-link>
        <p>{{ neighbor.text }}</p>
      </div>
    </details>
    <section
      v-if="!report.highlights && report.quirks?.length"
      class="feature-card"
    >
      <h2>{{ $t("report.manual") }}</h2>
      <p v-for="line in report.quirks" :key="line">{{ line }}</p>
    </section>
  </div>
</template>
<script setup>
import { nextTick, ref } from "vue";
defineProps({
  report: { type: Object, required: true },
  overview: { type: Boolean, default: true },
  showContents: { type: Boolean, default: true },
});
const sections = {},
  contents = ref(null),
  related = { friendship: "chat", close: "boundaries", blindspots: "repair" };
async function jump(id) {
  const el = sections[id];
  if (!el) return;
  el.open = true;
  await nextTick();
  el.scrollIntoView?.({ block: "start", behavior: "instant" });
  el.querySelector("summary")?.focus({ preventScroll: true });
}
defineExpose({
  jump,
  contents: () => {
    if (!contents.value) return;
    contents.value.open = true;
    contents.value.scrollIntoView?.({ block: "start", behavior: "instant" });
  },
});
</script>
<style scoped>
.report-reader {
  display: grid;
  gap: 16px;
  margin-top: 20px;
}
.overview ul {
  padding-left: 22px;
}
.overview li + li {
  margin-top: 10px;
}
summary {
  min-height: 44px;
  font-size: 19px;
  font-weight: 700;
  cursor: pointer;
  padding: 8px 0;
}
.report-section,
.report-contents {
  scroll-margin: 20px;
}
.report-section p {
  line-height: 1.85;
}
.growth-actions {
  display: grid;
  gap: 18px;
}
.growth-actions h3 {
  font-size: 17px;
}
.growth-actions article {
  padding-top: 16px;
  border-top: 1px solid var(--cream-border);
}
blockquote {
  padding: 12px 16px;
  background: #f1edfa;
  border-radius: 10px;
  margin-top: 10px;
}
.related-link {
  min-height: 44px;
  display: flex;
  align-items: center;
}
.feature-card {
  margin: 0;
}
</style>
