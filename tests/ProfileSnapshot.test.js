import {describe,it,expect} from 'vitest'
import {createSnapshot,encodeSnapshot,decodeSnapshot,profileUrl,snapshotFromUrl,snapshotProfile,SnapshotError} from '../src/utils/profileSnapshot.js'
const result={type:'ENFJ',percents:{EI:{E:53,I:47},NS:{N:67,S:33},FT:{F:67,T:33},JP:{J:87,P:13}},answers:['a','b'],completedAt:123}
describe('portable result snapshots',()=>{
 it('round-trips Chinese and emoji without publishing answers or default-private scores',()=>{
  const s=createSnapshot({result,name:'小雨 🌦️'}),decoded=decodeSnapshot(encodeSnapshot(s))
  expect(decoded).toEqual(s);expect(decoded.m).toEqual({t:'ENFJ'})
  expect(JSON.stringify(decoded)).not.toMatch(/answers|completedAt|percents/)
  expect(profileUrl(s,'https://example.test/')).toMatch(/^https:\/\/example.test\/#\/p\//)
 })
 it('shares only explicitly chosen scores and scene summaries',()=>{
  const s=createSnapshot({result,includePercents:true,scenes:[{testId:'chat',version:'1',scores:[50,75],answers:[5,1]}]})
  expect(s.m.p).toEqual([53,67,67,87]);expect(s.s).toEqual([{id:'chat',v:'1',a:[50,75]}])
  const p=snapshotProfile(decodeSnapshot(encodeSnapshot(s)))
  expect(p.report.sections.find(x=>x.id==='daily').paragraphs[1]).toContain('两侧接近')
  expect(snapshotProfile(s,'en').report.sections[0].paragraphs[0]).toMatch(/shared direction/)
 })
 it('supports a scene-only profile without inventing an MBTI result',()=>{
  const s=createSnapshot({scenes:[{testId:'repair',version:'1',scores:[50,50]}]})
  expect(s.m).toBeUndefined();expect(snapshotProfile(s)).toBeNull();expect(decodeSnapshot(encodeSnapshot(s))).toEqual(s)
 })
 it.each(['!','AAAA','eyJ2Ijo5fQ','a'.repeat(2001)])('rejects damaged payload %s',(payload)=>{expect(()=>decodeSnapshot(payload)).toThrow(SnapshotError)})
 it('rejects unknown report versions, unknown fields and ambiguous values',()=>{
  const s=createSnapshot({result})
  for(const bad of [{...s,r:'__proto__'},{...s,r:'r2'},{...s,v:2},{...s,answers:[]},{...s,m:{t:'XXXX'}},{...s,m:{t:'ENFJ',p:[NaN,50,50,50]}},{...s,s:[{id:'chat',v:'2',a:[50,50]}]}])expect(()=>encodeSnapshot(bad)).toThrow()
 })
 it('enforces 20 Unicode characters and the full URL limit',()=>{
  expect(()=>createSnapshot({result,name:'🙂'.repeat(20)})).not.toThrow()
  expect(()=>createSnapshot({result,name:'🙂'.repeat(21)})).toThrow()
  expect(()=>profileUrl(createSnapshot({result}),'https://example.test/'+ 'a'.repeat(1980))).toThrow('tooLong')
 })
 it('accepts only the current site and base path for friend imports',()=>{
  const base='https://example.test/mbti/',url=profileUrl(createSnapshot({result}),base)
  expect(snapshotFromUrl(url,base).m.t).toBe('ENFJ')
  for(const bad of [url.replace('example.test','evil.test'),url.replace('/mbti/','/'),url.replace('#/p/','?x=1#/p/'),'javascript:alert(1)'])expect(()=>snapshotFromUrl(bad,base)).toThrow()
 })
})
