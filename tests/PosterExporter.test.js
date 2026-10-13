import { mount, flushPromises } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { describe, it, expect, afterEach, vi } from "vitest";
import PosterExporter from "../src/components/PosterExporter.vue";
import { createSnapshot, profileUrl } from "../src/utils/profileSnapshot.js";
import { APP_URL } from "../src/config.js";
import zh from "../src/locales/zh.json";
import en from "../src/locales/en.json";
let wrapper;
afterEach(() => wrapper?.unmount());
const model = {
  kind: "pair",
  kicker: "朋友对照",
  title: "ENFJ × ISTP",
  subtitle: "同一件事，不同入口",
  lines: ["一起讨论"],
  tags: ["友情"],
};
function open(capture = vi.fn().mockResolvedValue("data:image/png;base64,QA")) {
  const stub = {
    name: "SocialPoster",
    props: ["model", "url"],
    setup(_props, { expose }) {
      expose({ capture });
    },
    template: "<div/>",
  };
  wrapper = mount(PosterExporter, {
    props: { model },
    global: {
      plugins: [
        createI18n({ legacy: false, locale: "zh", messages: { zh, en } }),
      ],
      stubs: { SocialPoster: stub },
    },
  });
  return capture;
}
async function click(text) {
  await wrapper
    .findAll("button")
    .find((b) => b.text() === text)
    .trigger("click");
  await flushPromises();
}
describe("reviewed QR destinations", () => {
  it("also previews supplied snapshots before enabling their QR target", async () => {
    open();
    const url = profileUrl(
      createSnapshot({ result: { type: "INFP" }, name: "Preview" }),
    );
    await wrapper.setProps({ snapshotUrl: url });
    expect(wrapper.findAll("option")).toHaveLength(1);
    await click("读取并预览二维码主页");
    expect(wrapper.text()).toContain("Preview");
    await wrapper.find("select").setValue("profile");
    await click("生成1080×1440图片");
    expect(wrapper.find(".generated-preview").exists()).toBe(true);
    await wrapper.setProps({ model: { ...model, subtitle: "new" } });
    expect(wrapper.find(".generated-preview").exists()).toBe(false);
    expect(wrapper.findAll("option")).toHaveLength(1);
  });
  it("discards an in-flight image or error after its content changes", async () => {
    let finish;
    open(() => new Promise((resolve) => (finish = resolve)));
    await wrapper.find("button.primary-button").trigger("click");
    await wrapper.setProps({ model: { ...model, title: "changed" } });
    finish("data:image/png;base64,OLD");
    await flushPromises();
    expect(wrapper.find(".generated-preview").exists()).toBe(false);
  });
  it("defaults to home, accepts a previewed same-site snapshot and resets on edited input", async () => {
    open();
    expect(wrapper.findComponent({ name: "SocialPoster" }).props("url")).toBe(
      APP_URL,
    );
    const url = profileUrl(
      createSnapshot({ result: { type: "ENFJ" }, name: "测试" }),
    );
    await wrapper.find("textarea").setValue(url);
    await click("读取并预览二维码主页");
    expect(wrapper.text()).toContain("测试");
    expect(wrapper.findComponent({ name: "SocialPoster" }).props("url")).toBe(
      APP_URL,
    );
    await wrapper.find("select").setValue("profile");
    expect(wrapper.findComponent({ name: "SocialPoster" }).props("url")).toBe(
      url,
    );
    await click("生成1080×1440图片");
    expect(wrapper.find(".generated-preview").exists()).toBe(true);
    await wrapper.find("textarea").setValue(url + "broken");
    expect(wrapper.find(".generated-preview").exists()).toBe(false);
    expect(wrapper.findComponent({ name: "SocialPoster" }).props("url")).toBe(
      APP_URL,
    );
  });
  it("does not offer a profile QR for a cross-site or unknown-version input", async () => {
    open();
    await wrapper.find("textarea").setValue("https://other.test/#/p/abc");
    await click("读取并预览二维码主页");
    expect(wrapper.find('[role="alert"]').text()).toContain("当前本站");
    expect(wrapper.findAll("option")).toHaveLength(1);
  });
  it("permits a retry after capture failure and clears output after content changes", async () => {
    const capture = vi
      .fn()
      .mockRejectedValueOnce(new Error("export failed"))
      .mockResolvedValueOnce("data:image/png;base64,QA");
    open(capture);
    await click("生成1080×1440图片");
    expect(wrapper.find('[role="alert"]').text()).toContain("海报生成失败");
    await click("生成1080×1440图片");
    expect(wrapper.find(".generated-preview").exists()).toBe(true);
    await wrapper.setProps({ model: { ...model, title: "Changed" } });
    expect(wrapper.find(".generated-preview").exists()).toBe(false);
  });
});
