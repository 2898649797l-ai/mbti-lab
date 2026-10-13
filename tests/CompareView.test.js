import { mount, flushPromises } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import { createI18n } from "vue-i18n";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import CompareView from "../src/views/CompareView.vue";
import {
  createSnapshot,
  profileUrl,
  encodeSnapshot,
} from "../src/utils/profileSnapshot.js";
import zh from "../src/locales/zh.json";
import en from "../src/locales/en.json";
const result = {
  type: "ENFJ",
  percents: {
    EI: { E: 53, I: 47 },
    NS: { N: 70, S: 30 },
    FT: { F: 70, T: 30 },
    JP: { J: 80, P: 20 },
  },
};
let wrapper;
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem("mbti_lab_result", JSON.stringify(result));
});
afterEach(() => wrapper?.unmount());
async function open(query = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/compare", component: CompareView },
      { path: "/:pathMatch(.*)*", component: { template: "<div/>" } },
    ],
  });
  await router.push({ path: "/compare", query });
  await router.isReady();
  wrapper = mount(CompareView, {
    global: {
      plugins: [
        router,
        createI18n({ legacy: false, locale: "zh", messages: { zh, en } }),
      ],
      stubs: { ShareSheet: true },
    },
  });
  await flushPromises();
}
describe("explicit comparison and permissions", () => {
  it("shows code and nickname, waits for submit, then offers three questions", async () => {
    await open();
    expect(wrapper.findAll("select")[0].text()).toContain("ENFJ · 同行召集人");
    await wrapper.findAll("select")[1].setValue("ISTP");
    expect(wrapper.find(".discussion").exists()).toBe(false);
    await wrapper.find(".view-comparison").trigger("click");
    expect(wrapper.find(".discussion li").exists()).toBe(true);
    expect(wrapper.findAll(".discussion li")).toHaveLength(3);
    expect(wrapper.find(".score-comparison").exists()).toBe(false);
    await wrapper.findAll("select")[2].setValue("close");
    expect(wrapper.find(".discussion").exists()).toBe(false);
  });
  it("requires both numeric permissions and clears imported state when source switches", async () => {
    const snapshot = createSnapshot({
      result: { ...result, type: "INFJ" },
      includePercents: true,
      name: "QA",
    });
    await open({ friend: encodeSnapshot(snapshot) });
    expect(wrapper.find('input[value="link"]').element.checked).toBe(true);
    await wrapper.find(".view-comparison").trigger("click");
    expect(wrapper.find(".score-comparison").exists()).toBe(false);
    await wrapper.find('input[type="checkbox"]').setValue(true);
    await wrapper.find(".view-comparison").trigger("click");
    expect(wrapper.find(".score-comparison").exists()).toBe(true);
    await wrapper.find('input[value="manual"]').setValue(true);
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(false);
    expect(wrapper.findAll("select")[1].element.value).toBe("");
    expect(wrapper.find(".discussion").exists()).toBe(false);
    await wrapper.find('input[value="link"]').setValue(true);
    await wrapper.find("textarea").setValue(profileUrl(snapshot));
    await wrapper
      .findAll("button")
      .find((b) => b.text() === zh.social.readLink)
      .trigger("click");
    expect(wrapper.find('input[type="checkbox"]').element.checked).toBe(false);
    await wrapper.find("textarea").setValue("changed");
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(false);
    expect(wrapper.find(".view-comparison").element.disabled).toBe(true);
  });
});
