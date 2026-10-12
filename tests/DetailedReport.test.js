import { describe,it,expect } from 'vitest'
import { getDetailedReport,getDimensionInterpretations,getNeighbors } from '../src/utils/detailedReport.js'
import { types } from '../src/data/types.js'
describe('context-aware editorial report',()=>{
 it('softens every near-middle dimension, including opposite type labels',()=>{
  const percents={EI:{E:53,I:47},NS:{N:45,S:55},FT:{F:50,T:50},JP:{J:55,P:45}},notes=getDimensionInterpretations(percents)
  expect(notes.every(n=>n.close)).toBe(true);expect(notes[0].text).toContain('不必用')
  for(const type of ['ENFJ','ISTP'])expect(getDetailedReport(type,'zh',percents).sections.find(s=>s.id==='daily').paragraphs[1]).toBe(notes[0].text)
 })
 it('handles strong preferences and malformed percentages without making up scores',()=>{
  const notes=getDimensionInterpretations({EI:{E:20,I:80},NS:{N:80,S:20},FT:{F:20,T:80},JP:{J:80,P:20}},'en')
  expect(notes.map(n=>n.letter)).toEqual(['I','N','T','J']);expect(notes.every(n=>!n.close)).toBe(true)
  expect(getDimensionInterpretations({EI:{E:80,I:80}})).toEqual([]);expect(getDimensionInterpretations(null)).toEqual([]);expect(getDetailedReport('XXXX')).toBe(null)
 })
 it('compares all types with their four one-letter neighbors in both languages',()=>{
  for(const type of Object.keys(types))for(const locale of ['zh','en']){
   const neighbors=getNeighbors(type,locale);expect(neighbors).toHaveLength(4)
   for(const other of neighbors){expect([...other.type].filter((l,i)=>l!==type[i])).toHaveLength(1);expect(other.text).toContain(type);expect(other.text).toContain(other.type);expect(getNeighbors(other.type,locale).find(n=>n.type===type).text).toBe(other.text)}
  }
 })
})
