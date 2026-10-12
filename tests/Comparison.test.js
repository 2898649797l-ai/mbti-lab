import {describe,it,expect} from 'vitest'
import {compareTypes} from '../src/utils/comparison.js'
const percents={EI:{E:53,I:47},NS:{N:67,S:33},FT:{F:67,T:33},JP:{J:87,P:13}}
describe('permission-aware type comparison',()=>{
 it('does not invent numeric scores when either party has no permitted percentages',()=>{
  for(const [a,b] of [[{type:'ENFJ'},{type:'ISTP'}],[{type:'ENFJ',percents},{type:'ISTP'}]]){
   const comparison=compareTypes(a,b);expect(comparison.hasNumbers).toBe(false)
   expect(comparison.dimensions.every(d=>d.own===undefined&&d.friend===undefined)).toBe(true)
  }
 })
 it('near-middle values do not become strong opposition, even with different letters',()=>{
  const comparison=compareTypes({type:'ENFJ',percents},{type:'INFJ',percents:{...percents,EI:{E:47,I:53}}})
  expect(comparison.hasNumbers).toBe(true);expect(comparison.dimensions[0].near).toBe(true)
  expect(comparison.dimensions[0].detail).toContain('不能只凭');expect(comparison.dimensions[0].advice).toContain('具体情境')
 })
 it('changes the discussion prompt by relationship context and language',()=>{
  expect(compareTypes({type:'ENFJ'},{type:'ISTP'},'friendship').question).toContain('邀约')
  expect(compareTypes({type:'ENFJ'},{type:'ISTP'},'close','en').question).toContain('reconnect')
  expect(compareTypes({type:'XXXX'},{type:'ENFJ'})).toBeNull()
 })
})
