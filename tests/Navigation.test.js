import { mount, flushPromises } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import { createI18n } from "vue-i18n";
import { describe, it, expect } from "vitest";
import App from "../src/App.vue";
import zh from "../src/locales/zh.json";
import en from "../src/locales/en.json";
describe("navigation surfaces", () => {
  it.each([
    ["/", true],
    ["/explore", true],
    ["/me", true],
    ["/types?type=XXXX", true],
    ["/types?type=ENFJ", false],
    ["/test", false],
    ["/quiz/chat", false],
    ["/quiz/chat/result", false],
    ["/result", false],
    ["/p/sample", false],
  ])("%s has main tabs = %s", async (path, visible) => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/:pathMatch(.*)*",
          component: { template: "<main>page</main>" },
        },
      ],
    });
    await router.push(path);
    await router.isReady();
    const wrapper = mount(App, {
      global: {
        plugins: [
          router,
          createI18n({ legacy: false, locale: "zh", messages: { zh, en } }),
        ],
      },
    });
    await flushPromises();
    expect(wrapper.find(".bottom-nav").exists()).toBe(visible);
    if (visible)
      expect(wrapper.findAll(".bottom-nav a").map((a) => a.text())).toEqual([
        "测试",
        "探索",
        "结果",
      ]);
    wrapper.unmount();
  });
});
