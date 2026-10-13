import { mount, flushPromises } from "@vue/test-utils";
import { nextTick } from "vue";
import { createI18n } from "vue-i18n";
import { createRouter, createMemoryHistory } from "vue-router";
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import TestView from "../src/views/TestView.vue";
import HomeView from "../src/views/HomeView.vue";
import {
  DRAFT_KEY,
  questionsForMode,
  useDraftStore,
} from "../src/composables/useDraftStore.js";
import { useResultStore } from "../src/composables/useResultStore.js";
import { useTest } from "../src/composables/useTest.js";
import { questions } from "../src/data/questions.js";
import zh from "../src/locales/zh.json";
import en from "../src/locales/en.json";
let wrapper, router;
function storage() {
  const map = new Map();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    clear: () => map.clear(),
  };
}
const seedResult = {
  type: "INFP",
  percents: {
    EI: { E: 30, I: 70 },
    NS: { N: 60, S: 40 },
    FT: { F: 60, T: 40 },
    JP: { J: 45, P: 55 },
  },
};
beforeEach(() => {
  vi.stubGlobal("scrollTo", vi.fn());
  vi.stubGlobal("localStorage", storage());
  vi.stubGlobal("sessionStorage", storage());
  useResultStore().submit(seedResult);
  useResultStore().load();
  localStorage.clear();
  sessionStorage.clear();
  vi.useFakeTimers();
});
afterEach(() => {
  wrapper?.unmount();
  wrapper = null;
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
async function open(path = "/test?mode=short") {
  router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: HomeView },
      { path: "/test", component: TestView },
      { path: "/result", component: { template: "<p>result</p>" } },
      { path: "/types", component: { template: "<p>types</p>" } },
    ],
  });
  await router.push(path);
  await router.isReady();
  wrapper = mount(
    { template: "<RouterView />" },
    {
      global: {
        plugins: [
          router,
          createI18n({ legacy: false, locale: "zh", messages: { zh, en } }),
        ],
      },
    },
  );
  await nextTick();
}
async function select(choice = "a") {
  await wrapper.findAll(".option")[choice === "a" ? 0 : 1].trigger("click");
  await vi.advanceTimersByTimeAsync(280);
  await nextTick();
  await flushPromises();
}
describe("complete questionnaire flow", () => {
  it.each(["short", "full"])(
    "delivers an all-answered %s draft after refresh",
    async (mode) => {
      const count = questionsForMode(mode).length;
      useDraftStore().save(mode, Array(count).fill("a"), count - 1);
      await open("/test?mode=" + mode);
      await flushPromises();
      expect(router.currentRoute.value.path).toBe("/result");
      expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
      expect(
        JSON.parse(localStorage.getItem("mbti_lab_result")).type,
      ).toHaveLength(4);
    },
  );
  it.each(["short", "full"])(
    "completes %s with unchanged scoring and clears draft",
    async (mode) => {
      await open("/test?mode=" + mode);
      const expected = useTest();
      expected.loadQuestions(questions, mode === "short");
      const count = questionsForMode(mode).length;
      expect(count).toBe(mode === "short" ? 60 : 93);
      for (let i = 0; i < count; i++) {
        expected.answer(i % 2 ? "b" : "a");
        await select(i % 2 ? "b" : "a");
      }
      expect(router.currentRoute.value.path).toBe("/result");
      expect(JSON.parse(localStorage.getItem("mbti_lab_result"))).toMatchObject(
        expected.result.value,
      );
      expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
    },
  );
  it("restores the cursor after remount, shows and updates the earlier answer", async () => {
    await open();
    await select("a");
    await select("b");
    await select("a");
    wrapper.unmount();
    await open("/test");
    expect(wrapper.find(".progress-caption").text()).toContain("第 4 / 60 题");
    await wrapper.find(".test-footer button").trigger("click");
    expect(wrapper.findAll(".option")[0].attributes("aria-pressed")).toBe(
      "true",
    );
    await select("b");
    expect(JSON.parse(localStorage.getItem(DRAFT_KEY)).answers[2]).toBe("b");
    expect(wrapper.find(".progress-caption").text()).toContain("第 4 / 60 题");
  });
  it("locks repeated clicks and persists the selected answer before the transition", async () => {
    await open();
    await wrapper.findAll(".option")[0].trigger("click");
    expect(wrapper.findAll(".option")[1].attributes("disabled")).toBeDefined();
    wrapper
      .findComponent(TestView)
      .findComponent({ name: "QuestionCard" })
      .vm.$emit("answer", "b");
    expect(JSON.parse(localStorage.getItem(DRAFT_KEY)).answers[0]).toBe("a");
    wrapper.unmount();
    await open("/test");
    expect(wrapper.findAll(".option")[0].attributes("aria-pressed")).toBe(
      "true",
    );
    await select("a");
    expect(wrapper.find(".progress-caption").text()).toContain("第 2 / 60 题");
  });
  it("still finishes when both storages reject writes and reads", async () => {
    for (const target of [localStorage, sessionStorage])
      for (const method of ["getItem", "setItem", "removeItem"])
        target[method] = () => {
          throw new Error("denied");
        };
    await open();
    expect(wrapper.find(".notice").text()).toContain("无法保存");
    for (let i = 0; i < 60; i++) await select();
    expect(router.currentRoute.value.path).toBe("/result");
    expect(router.currentRoute.value.query.unsaved).toBe("1");
    expect(useResultStore().load().type).toHaveLength(4);
  });
});
describe("home draft decisions", () => {
  it("requires restart confirmation, cancellation keeps the draft and result", async () => {
    await open();
    await select();
    wrapper.unmount();
    useResultStore().submit(seedResult);
    await open("/");
    const before = localStorage.getItem(DRAFT_KEY);
    expect(wrapper.find(".primary-button").text()).toContain("继续答题");
    await wrapper.find(".start-options .secondary-button").trigger("click");
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
    await wrapper.find(".confirm-dialog .secondary-button").trigger("click");
    expect(localStorage.getItem(DRAFT_KEY)).toBe(before);
    await wrapper.find(".full-button").trigger("click");
    await wrapper.find(".confirm-dialog .primary-button").trigger("click");
    await flushPromises();
    expect(wrapper.find(".progress-caption").text()).toContain("第 1 / 93 题");
    expect(JSON.parse(localStorage.getItem("mbti_lab_result")).type).toBe(
      "INFP",
    );
  });
});
