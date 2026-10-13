import { mount, flushPromises } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import { createI18n } from "vue-i18n";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import ProfileView from "../src/views/ProfileView.vue";
import ProfileBuilderView from "../src/views/ProfileBuilderView.vue";
import CopyText from "../src/components/CopyText.vue";
import {
  encodeSnapshot,
  createSnapshot,
} from "../src/utils/profileSnapshot.js";
import zh from "../src/locales/zh.json";
import en from "../src/locales/en.json";
let wrapper;
const result = {
  type: "ENFJ",
  percents: {
    EI: { E: 53, I: 47 },
    NS: { N: 67, S: 33 },
    FT: { F: 67, T: 33 },
    JP: { J: 87, P: 13 },
  },
};
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
afterEach(() => {
  wrapper?.unmount();
  vi.unstubAllGlobals();
});
async function render(component, path) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/p/:payload", component: ProfileView },
      { path: "/profile", component: ProfileBuilderView },
      { path: "/", component: { template: "<div/>" } },
      { path: "/compare", component: { template: "<div/>" } },
    ],
  });
  await router.push(path);
  await router.isReady();
  wrapper = mount(component, {
    global: {
      plugins: [
        router,
        createI18n({ legacy: false, locale: "zh", messages: { zh, en } }),
      ],
      stubs: { PosterExporter: true },
    },
  });
  await flushPromises();
  return wrapper;
}
describe("social views and clipboard fallback", () => {
  it("opening another profile never overwrites or consumes local/session results", async () => {
    localStorage.setItem("mbti_lab_result", JSON.stringify(result));
    sessionStorage.setItem("mbti_result", JSON.stringify(result));
    const payload = encodeSnapshot(
      createSnapshot({ result: { ...result, type: "ISTP" }, name: "朋友" }),
    );
    await render(ProfileView, "/p/" + payload);
    expect(wrapper.text()).toContain("ISTP");
    expect(wrapper.text()).not.toContain("主动公开的答题比例");
    expect(JSON.parse(localStorage.getItem("mbti_lab_result"))).toEqual(result);
    expect(JSON.parse(sessionStorage.getItem("mbti_result"))).toEqual(result);
  });
  it("shows damage and unknown-version errors without guessing a report", async () => {
    await render(ProfileView, "/p/not-valid");
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    expect(wrapper.find(".snapshot-type").exists()).toBe(false);
  });
  it("preview hides percentages by default and invalidates a generated link when selection changes", async () => {
    localStorage.setItem("mbti_lab_result", JSON.stringify(result));
    await render(ProfileBuilderView, "/profile");
    expect(wrapper.text()).not.toContain("主动公开的答题比例");
    await wrapper.find("button.primary-button").trigger("click");
    expect(wrapper.findAllComponents(CopyText)).toHaveLength(1);
    await wrapper.findAll('input[type="checkbox"]')[1].setValue(true);
    expect(wrapper.text()).toContain("主动公开的答题比例");
    expect(wrapper.findAllComponents(CopyText)).toHaveLength(0);
  });
  it("keeps manual copy text available when clipboard access is denied", async () => {
    vi.stubGlobal("navigator", {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    wrapper = mount(CopyText, {
      props: { value: "中文分享链接", label: "复制" },
      global: {
        plugins: [
          createI18n({ legacy: false, locale: "zh", messages: { zh, en } }),
        ],
      },
    });
    await wrapper.find("button").trigger("click");
    await flushPromises();
    expect(wrapper.find("textarea").element.value).toBe("中文分享链接");
    expect(wrapper.find('[role="status"]').text()).toContain("手动复制");
  });
});
