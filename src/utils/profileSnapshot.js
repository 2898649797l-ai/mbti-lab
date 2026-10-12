import r1 from '../data/reportVersions/r1.json'
import {APP_URL} from '../config.js'
import {DIMENSIONS,isType,validPercents} from './detailedReport.js'
export const MAX_PROFILE_URL=2000
export const PROFILE_DICTIONARIES={r1}
export const SCENE_IDS=['chat','boundaries','repair']
export class SnapshotError extends Error { constructor(code){super(code);this.code=code} }
const keysOnly=(value,keys)=>!!value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).every(k=>keys.includes(k))
const validScore=n=>Number.isInteger(n)&&n>=0&&n<=100
export function validateSnapshot(s){
  if(!keysOnly(s,['v','r','n','m','s']))throw new SnapshotError('invalid')
  if(s.v!==1||typeof s.r!=='string'||!Object.hasOwn(PROFILE_DICTIONARIES,s.r))throw new SnapshotError('version')
  if(typeof s.n!=='string'||Array.from(s.n).length>20||/[\u0000-\u001f\u007f]/.test(s.n))throw new SnapshotError('invalid')
  if(s.m!==undefined&&(!keysOnly(s.m,['t','p'])||!isType(s.m.t)||(s.m.p!==undefined&&(!Array.isArray(s.m.p)||s.m.p.length!==4||!s.m.p.every(validScore)))))throw new SnapshotError('invalid')
  if(!Array.isArray(s.s)||s.s.length>3||new Set(s.s.map(x=>x?.id)).size!==s.s.length)throw new SnapshotError('invalid')
  for(const scene of s.s){
    if(!keysOnly(scene,['id','v','a'])||!SCENE_IDS.includes(scene.id)||!Array.isArray(scene.a)||scene.a.length!==2||!scene.a.every(validScore))throw new SnapshotError('invalid')
    if(scene.v!=='1')throw new SnapshotError('version')
  }
  if(!s.m&&!s.s.length)throw new SnapshotError('empty')
  return s
}
export function createSnapshot({result=null,name='',includePercents=false,scenes=[]}={}){
  const s={v:1,r:'r1',n:name.trim(),s:scenes.map(x=>({id:x.testId,v:x.version,a:[...x.scores]}))}
  if(result&&isType(result.type)){s.m={t:result.type};if(includePercents){if(!validPercents(result.percents))throw new SnapshotError('invalid');s.m.p=DIMENSIONS.map(d=>Math.round(result.percents[d.key][d.letters[0]]))}}
  return validateSnapshot(s)
}
export function encodeSnapshot(snapshot){
  validateSnapshot(snapshot)
  const bytes=new TextEncoder().encode(JSON.stringify(snapshot))
  return btoa(Array.from(bytes,b=>String.fromCharCode(b)).join('')).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'')
}
export function decodeSnapshot(payload){
  if(typeof payload!=='string'||payload.length>MAX_PROFILE_URL||!/^[A-Za-z0-9_-]+$/.test(payload))throw new SnapshotError('invalid')
  try {
    const raw=atob(payload.replaceAll('-','+').replaceAll('_','/'))
    const s=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(raw,c=>c.charCodeAt(0))))
    return validateSnapshot(s)
  }catch(error){if(error instanceof SnapshotError)throw error;throw new SnapshotError('invalid')}
}
export function profileUrl(s,base=APP_URL){
  const url=base+'#/p/'+encodeSnapshot(s)
  if(url.length>MAX_PROFILE_URL)throw new SnapshotError('tooLong')
  return url
}
export function snapshotFromUrl(value,base=APP_URL){
  if(typeof value!=='string'||value.length>MAX_PROFILE_URL)throw new SnapshotError('tooLong')
  let url,expected
  try{url=new URL(value.trim());expected=new URL(base)}catch{throw new SnapshotError('invalid')}
  if(url.origin!==expected.origin||url.pathname!==expected.pathname||url.username||url.password||url.search||!/^#\/p\/[A-Za-z0-9_-]+$/.test(url.hash))throw new SnapshotError('site')
  return decodeSnapshot(url.hash.slice(4))
}
export function snapshotPercents(s){
  return s.m?.p?Object.fromEntries(DIMENSIONS.map((d,i)=>[d.key,{[d.letters[0]]:s.m.p[i],[d.letters[1]]:100-s.m.p[i]}])):null
}
export function snapshotProfile(s,locale='zh'){
  const dictionary=PROFILE_DICTIONARIES[s.r],data=s.m?dictionary.profiles[s.m.t]:null
  if(!data)return null
  const report=structuredClone(data.reports[locale]),percent=s.m.p
  const slots={daily:0,friendship:2,close:1,work:3}
  if(percent)for(const section of report.sections){
    const i=slots[section.id]
    if(i===undefined)continue
    const d=DIMENSIONS[i],score=percent[i],letter=score>=50?d.letters[0]:d.letters[1]
    section.paragraphs[1]=score>=45&&score<=55?dictionary.balanced[locale][i].text:dictionary.dimensions[letter][locale==='en'?1:0]
  }
  return {nickname:data.nickname[locale],summary:data.tagline[locale],tags:data.strengths[locale],report}
}
