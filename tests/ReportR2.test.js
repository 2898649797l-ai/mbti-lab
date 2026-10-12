import { describe, it, expect, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createRouter,createMemoryHistory } from 'vue-router'
import r1 from '../src/data/reportVersions/r1.json'
import r2 from '../src/data/reportVersions/r2.json'
import { getDetailedReport, SECTION_IDS } from '../src/utils/detailedReport.js'
import { createSnapshot,snapshotProfile,encodeSnapshot,decodeSnapshot } from '../src/utils/profileSnapshot.js'
import ReportReader from '../src/components/ReportReader.vue'
import zh from '../src/locales/zh.json'
import en from '../src/locales/en.json'
describe('r2 content and compatibility', () => {
  it('has complete natural bilingual reports and 1200–1600 Chinese body characters including growth actions', () => {
    expect(Object.keys(r2.profiles)).toHaveLength(16)
    for(const [type,p] of Object.entries(r2.profiles)) for(const lang of ['zh','en']) {
      const report=p.reports[lang]
      expect(report).toEqual(getDetailedReport(type,lang))
      expect(report.sections.map(s=>s.id)).toEqual(SECTION_IDS)
      expect(report.highlights).toHaveLength(3);expect(report.actions).toHaveLength(3)
      expect(p.nickname).toEqual(r1.profiles[type].nickname)
      for(const a of report.actions) for(const f of ['context','step','phrase'])expect(a[f].length).toBeGreaterThan(5)
      if(lang==='zh') {
        const count=(report.sections.flatMap(s=>s.paragraphs).join('')+report.actions.flatMap(a=>Object.values(a)).join('')).match(/[\u4e00-\u9fff]/g).length
        expect(count).toBeGreaterThanOrEqual(1200); expect(count).toBeLessThanOrEqual(1600)
      }
    }
  })
  it('keeps the published r1 byte-for-byte and refuses to overwrite either release', () => {
    const hash = createHash('sha256').update(readFileSync('src/data/reportVersions/r1.json')).digest('hex')
    expect(hash).toBe('04adc656fc10c49b73e860add708f4946d90d071fbdbba960edb416387bb9413')
    for(const version of ['r1','r2'])expect(()=>execFileSync(process.execPath,['scripts/freeze-reports.mjs',version],{stdio:'pipe'})).toThrow()
  })
  it('new snapshots use r2 while old r1 links retain their original report', () => {
    const fresh=createSnapshot({result:{type:'ENFJ'}}),old={...fresh,r:'r1'}
    expect(fresh.r).toBe('r2')
    expect(snapshotProfile(decodeSnapshot(encodeSnapshot(old))).report).toEqual(r1.profiles.ENFJ.reports.zh)
    expect(snapshotProfile(fresh).report.actions).toHaveLength(3)
    expect(snapshotProfile(old).report.actions).toBeUndefined()
  })
  it('contents opens the target while independent sections stay open', async () => {
    const router=createRouter({history:createMemoryHistory(),routes:[{path:'/:pathMatch(.*)*',component:{template:'<div/>'}}]})
    await router.push('/');await router.isReady()
    const wrapper=mount(ReportReader,{props:{report:getDetailedReport('INFP')},global:{plugins:[router,createI18n({legacy:false,locale:'zh',messages:{zh,en}})]}})
    const spy=vi.fn();wrapper.find('#report-close').element.scrollIntoView=spy
    await wrapper.findAll('.report-toc button')[3].trigger('click')
    expect(wrapper.find('#report-close').element.open).toBe(true)
    expect(wrapper.find('#report-core').element.open).toBe(true)
    expect(spy).toHaveBeenCalled();expect(wrapper.find('a[href="/quiz/boundaries"]').exists()).toBe(true)
    wrapper.unmount()
  })
})
