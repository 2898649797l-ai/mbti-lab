<template>
  <header class="page-header">
    <router-link to="/" class="text-button">{{
      $t("types.backHome")
    }}</router-link
    ><LangToggle />
  </header>
  <main class="feature-main">
    <h1>{{ $t("social.compareTitle") }}</h1>
    <p class="feature-muted">{{ $t("social.compareIntro") }}</p>
    <section class="feature-card">
      <fieldset class="source-choice">
        <legend>{{ $t("ux.source") }}</legend>
        <label class="feature-check"
          ><input
            v-model="source"
            value="manual"
            type="radio"
            name="friend-source"
          />{{ $t("ux.manual") }}</label
        ><label class="feature-check"
          ><input
            v-model="source"
            value="link"
            type="radio"
            name="friend-source"
          />{{ $t("ux.fromLink") }}</label
        >
      </fieldset>
    </section>
    <section class="feature-card">
      <label class="feature-label"
        >{{ $t("social.ownType")
        }}<select
          v-model="ownType"
          :aria-label="$t('social.ownType')"
          class="feature-input"
        >
          <option value="">{{ $t("social.chooseType") }}</option>
          <option v-for="type in codes" :key="type" :value="type">
            {{ type }} · {{ types[type].nickname[locale] }}
          </option>
        </select></label
      >
      <label v-if="source === 'manual'" class="feature-label"
        >{{ $t("social.friendType")
        }}<select
          v-model="friendType"
          :aria-label="$t('social.friendType')"
          @change="clearFriend"
          class="feature-input"
        >
          <option value="">{{ $t("social.chooseType") }}</option>
          <option v-for="type in codes" :key="type" :value="type">
            {{ type }} · {{ types[type].nickname[locale] }}
          </option>
        </select></label
      >
      <template v-if="source === 'link'"
        ><label class="feature-label"
          >{{ $t("social.friendLink")
          }}<textarea v-model="input" class="feature-input" rows="2" /></label
        ><button class="secondary-button" @click="readFriend">
          {{ $t("social.readLink") }}
        </button></template
      >
      <p v-if="error" role="alert" class="notice">
        {{ $t("social.errors." + error) }}
      </p>
      <p v-if="friendSnapshot" class="feature-muted">
        {{ $t("social.imported", { name: friendSnapshot.n || friendType }) }}
      </p>
      <label
        v-if="friendSnapshot?.m?.p && ownResult && ownType === ownResult.type"
        class="feature-check"
        ><input v-model="ownNumbers" type="checkbox" />{{
          $t("social.useOwnNumbers")
        }}</label
      >
      <label class="feature-label"
        >{{ $t("social.context")
        }}<select
          v-model="context"
          :aria-label="$t('social.context')"
          class="feature-input"
        >
          <option value="friendship">{{ $t("social.friendship") }}</option>
          <option value="close">{{ $t("social.close") }}</option>
        </select></label
      ><button
        class="primary-button view-comparison"
        :disabled="!ownType || !friendType"
        @click="submitted = true"
      >
        {{ $t("ux.compare") }}
      </button>
    </section>
    <p v-if="!comparison" class="feature-muted">{{ $t("ux.notReady") }}</p>
    <template v-if="comparison"
      ><section class="feature-card">
        <h2>{{ ownType }} × {{ friendType }}</h2>
        <p>{{ $t("social.comparisonNote") }}</p>
        <p>
          {{
            comparison.hasNumbers
              ? $t("social.numericNote")
              : $t("social.typeOnly")
          }}
        </p>
      </section>
      <section class="feature-card">
        <h2>{{ $t("social.common") }}</h2>
        <p>{{ commonText }}</p>
      </section>
      <section class="feature-card">
        <h2>{{ $t("ux.differences") }}</h2>
        <p v-if="differenceText">{{ differenceText }}</p>
        <p v-if="comparison.dimensions.every((d) => d.same)">
          {{ $t("ux.same") }}
        </p>
      </section>
      <section
        v-for="d in comparison.dimensions"
        :key="d.key"
        class="feature-card"
      >
        <h2>
          {{ d.key }} ·
          {{
            $t(
              d.near
                ? "social.near"
                : d.same
                  ? "social.sharedFocus"
                  : "social.differentFocus",
            )
          }}
        </h2>
        <p>{{ d.detail }}</p>
        <p class="comparison-tip">
          {{ $t("social.tryTogether") }}：{{ d.advice }}
        </p>
        <p v-if="comparison.hasNumbers" class="score-comparison">
          {{ $t("social.me") }} {{ d.letter }} {{ d.own }}% ·
          {{ $t("social.friend") }} {{ d.letter }} {{ d.friend }}%
        </p>
      </section>
      <section class="feature-card discussion">
        <h2>{{ $t("social.question") }}</h2>
        <ol>
          <li v-for="question in comparison.questions" :key="question">
            {{ question }}
          </li>
        </ol>
      </section>
      <button class="primary-button" @click="showShare = true">
        {{ $t("ux.share") }}</button
      ><ShareSheet
        v-if="showShare"
        :model="posterModel"
        :caption="caption"
        @close="showShare = false"
    /></template>
  </main>
</template>
<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import LangToggle from "../components/LangToggle.vue";

import ShareSheet from "../components/ShareSheet.vue";
import { types } from "../data/types.js";
import { useResultStore } from "../composables/useResultStore.js";
import {
  snapshotFromUrl,
  snapshotPercents,
  decodeSnapshot,
} from "../utils/profileSnapshot.js";
import { compareTypes } from "../utils/comparison.js";
import { APP_URL } from "../config.js";
const route = useRoute(),
  { t, locale } = useI18n(),
  codes = Object.keys(types),
  ownResult = useResultStore().peek();
const ownType = ref(ownResult?.type || ""),
  friendType = ref(""),
  friendSnapshot = ref(null),
  input = ref(""),
  error = ref(""),
  context = ref("friendship"),
  ownNumbers = ref(false),
  source = ref("manual"),
  submitted = ref(false),
  showShare = ref(false);
function importFriend(s) {
  submitted.value = false;
  if (!s.m) throw { code: "noType" };
  friendSnapshot.value = s;
  friendType.value = s.m.t;
  ownNumbers.value = false;
  error.value = "";
}
function clearFriend() {
  submitted.value = false;
  friendSnapshot.value = null;
  ownNumbers.value = false;
  error.value = "";
  input.value = "";
}
function readFriend() {
  submitted.value = false;
  try {
    importFriend(snapshotFromUrl(input.value));
  } catch (e) {
    friendSnapshot.value = null;
    friendType.value = "";
    ownNumbers.value = false;
    error.value = e.code || "invalid";
  }
}
watch(
  () => route.query.friend,
  (payload) => {
    if (payload) {
      source.value = "link";
      try {
        importFriend(decodeSnapshot(String(payload)));
      } catch (e) {
        error.value = e.code || "invalid";
      }
    }
  },
  { immediate: true },
);
watch(ownType, () => {
  ownNumbers.value = false;
});
watch([ownType, friendType, context, ownNumbers], () => {
  submitted.value = false;
  showShare.value = false;
});
watch(
  source,
  () => {
    clearFriend();
    friendType.value = "";
    showShare.value = false;
  },
  { flush: "sync" },
);
watch(input, () => {
  if (friendSnapshot.value) {
    friendSnapshot.value = null;
    friendType.value = "";
    ownNumbers.value = false;
  }
  submitted.value = false;
  error.value = "";
  showShare.value = false;
});
const comparison = computed(() =>
  submitted.value
    ? compareTypes(
        {
          type: ownType.value,
          percents:
            ownNumbers.value && ownType.value === ownResult?.type
              ? ownResult.percents
              : null,
        },
        {
          type: friendType.value,
          percents: friendSnapshot.value
            ? snapshotPercents(friendSnapshot.value)
            : null,
        },
        context.value,
        locale.value,
      )
    : null,
);
const commonText = computed(() => {
  const shared = comparison.value.dimensions
    .filter((d) => d.same)
    .map((d) => d.key)
    .join("、");
  return shared
    ? t("social.commonLetters", { shared })
    : t("social.noSharedLetters");
});
const differenceText = computed(() => {
  const different = comparison.value.dimensions
    .filter((d) => !d.same)
    .map((d) => t("ux.axisNames." + d.key))
    .join(locale.value === "zh" ? "、" : ", ");
  return different ? t("ux.differenceSummary", { different }) : "";
});
const caption = computed(
  () =>
    `${ownType.value} × ${friendType.value}\n${t("social.pairTagline")}\n${comparison.value?.question || ""}\n${APP_URL}`,
);
const posterModel = computed(() => ({
  kind: "pair",
  kicker: t("social.compareTitle"),
  title: `${ownType.value} × ${friendType.value}`,
  subtitle: t("social.pairTagline"),
  lines: [
    comparison.value.dimensions.find((d) => !d.same)?.detail || t("ux.same"),
    comparison.value.question,
  ],
  tags: [t("social." + context.value)],
}));
</script>
<style scoped>
.source-choice {
  border: 0;
  display: grid;
  gap: 8px;
}
.source-choice legend {
  font-weight: 700;
  margin-bottom: 10px;
}
.comparison-tip {
  background: #f5f0ff;
  padding: 14px;
  border-radius: 14px;
}
.score-comparison {
  color: var(--blue);
  font-size: 16px;
}
.discussion {
  background: #f8f9fb;
}
.discussion ol {
  padding-left: 24px;
}
.discussion li + li {
  margin-top: 14px;
}
</style>
