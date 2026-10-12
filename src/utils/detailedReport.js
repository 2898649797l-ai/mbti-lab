import { types } from '../data/types.js'
import { reportStories } from '../data/reportStories.js'
export const REPORT_VERSION = 'r1'
export const DIMENSIONS = [{key:'EI',letters:['E','I']},{key:'NS',letters:['N','S']},{key:'FT',letters:['F','T']},{key:'JP',letters:['J','P']}]
export const SECTION_IDS = ['core','daily','friendship','close','work','blindspots','growth']
export const dimensionStories = {
  E:['参与讨论时，边表达边整理想法可能更自然；给安静的人一点接话时间，也为自己留出不需要回应任何人的休息。','Thinking aloud may feel natural in a discussion. Leave quiet people time to join, and keep some rest without needing to respond.'],
  I:['参与讨论时，先想清楚再表达可能更舒服；可以提前说明自己需要整理，不必把安静解释为缺少兴趣，也不必等到完美才开口。','Preparing a thought may feel comfortable. Explain the need for time; quiet is not necessarily disinterest, and a thought need not be perfect to share.'],
  N:['听到一段经历时，你可能先联想到背后的意义或其他可能；也可以先确认当下发生的具体事情，让理解有事实可以落脚。','A story may prompt meaning and possibilities. Check what concretely happened too, giving interpretation a factual starting point.'],
  S:['听到一段经历时，你可能先留意发生了什么、哪里需要实际支持；也可以问问这件事对对方意味着什么，让细节与感受连接。','A story may prompt attention to events and practical support. Ask what it means to the person too, connecting details with feelings.'],
  F:['回应分歧时，你可能先顾及这件事对人的影响；照顾感受不等于回避判断，可以把自己的要求和对他人的理解一起说出来。','In disagreement, the impact on people may come first. Care need not avoid a judgment: state your requirement and your understanding together.'],
  T:['回应分歧时，你可能先检查依据和可行办法；说明理由时也留意对方怎样接收，准确和有温度的表达可以同时做到。','In disagreement, evidence and workable solutions may come first. Notice how the explanation lands; precision and warmth can coexist.'],
  J:['安排活动时，明确时间和步骤可能让你安心；也为临时变化预留一个可协商的位置，区分重要约定与可以调整的小细节。','Clear times and steps may reassure you. Leave a negotiable space for change, distinguishing important commitments from flexible details.'],
  P:['安排活动时，保留选择可能让你更轻松；关键承诺仍可约定清楚的确认时间，不必用固定全部细节来换取可靠。','Keeping options may feel comfortable. Give key commitments a confirmation time; reliability does not require fixing every detail.'],
}
const balanced = {
  EI:['这次 E/I 两侧接近：你可能在熟悉话题里愿意表达，在陌生或疲惫的情境里需要安静。先观察当时的精力与关系，不必用“强烈外向”或“始终内向”概括自己。','E/I is close in this answer set. A familiar topic may invite participation while fatigue or an unfamiliar setting calls for quiet. Consider energy and context rather than a strong categorical description.'],
  NS:['这次 N/S 两侧接近：你可以从具体经历切入，也会关心背后的可能。先确认事实，再讨论意义，未必要固定使用一种理解方式。','N/S is close in this answer set. Concrete experience and its possibilities may both matter. Check facts before discussing meaning without fixing one approach.'],
  FT:['这次 F/T 两侧接近：你可能同时考虑人的感受与方案的依据。两者不是互相排斥的能力，不同情境下的优先顺序也可能改变。','F/T is close in this answer set. Feelings and evidence can both matter; they are not mutually exclusive abilities, and priorities may change with context.'],
  JP:['这次 J/P 两侧接近：你可能想把重要安排讲清楚，也希望小事留有余地。可以对关键承诺设时间，其他步骤保留弹性。','J/P is close in this answer set. Important plans may need clarity while smaller details stay open. Set times for commitments and allow flexibility elsewhere.'],
}
const contrast = [
  ['同一场聚会，{a}的故事侧重在互动里整理想法，{b}的故事侧重先留出整理时间；这不是谁更会交朋友。','At the same gathering, {a} illustrates thinking through interaction, while {b} illustrates preparing time alone. This is not a ranking of social skill.'],
  ['同一个邀约，{a}的故事侧重可能性和意义，{b}的故事侧重具体体验与条件；两种关注可以互相补充。','For the same invitation, {a} illustrates possibilities and meaning, while {b} illustrates concrete experience and conditions. Both can contribute.'],
  ['同一次分歧，{a}的故事先看对人的影响，{b}的故事先检查依据和办法；实际的人可以兼顾两者。','In the same disagreement, {a} illustrates impact on people, while {b} illustrates evidence and workable options. Real people can consider both.'],
  ['同一次改计划，{a}的故事重视明确约定，{b}的故事重视调整空间；可靠与灵活都不是某一类人的专属。','When a plan changes, {a} illustrates clear agreements and {b} room to adapt. Reliability and flexibility belong to everyone.'],
]
export function isType(type) { return typeof type === 'string' && Object.hasOwn(types,type) }
export function validPercents(p) { return !!p && DIMENSIONS.every(({key,letters}) => letters.every(l => Number.isFinite(p[key]?.[l]) && p[key][l]>=0 && p[key][l]<=100) && Math.abs(p[key][letters[0]]+p[key][letters[1]]-100)<=1) }
export function getDimensionInterpretations(percents, locale='zh') {
  if (!validPercents(percents)) return []
  const language=locale==='en'?1:0
  return DIMENSIONS.map(({key,letters}) => {
    const score=percents[key][letters[0]], close=score>=45&&score<=55, letter=score>=50?letters[0]:letters[1]
    return {key,letter,close,text:(close?balanced[key]:dimensionStories[letter])[language]}
  })
}
export function getNeighbors(type,locale='zh') {
  if (!isType(type)) return []
  const language=locale==='en'?1:0
  return DIMENSIONS.map(({letters},index) => {
    const other=letters.find(l=>l!==type[index]), neighbor=type.slice(0,index)+other+type.slice(index+1)
    const first=type[index]===letters[0]?type:neighbor, second=first===type?neighbor:type
    return {type:neighbor,text:contrast[index][language].replace('{a}',first).replace('{b}',second)}
  })
}
export function getDetailedReport(type,locale='zh',percents=null) {
  if(!isType(type)) return null
  const language=locale==='en'?1:0, data=types[type], story=reportStories[type], notes=getDimensionInterpretations(percents,locale)
  const note=i=>notes[i]?.text||dimensionStories[type[i]][language]
  return {version:REPORT_VERSION,sections:SECTION_IDS.map((id,i)=>({id,paragraphs:[story[i][language],...(i===1?[note(0)]:i===2?[note(2)]:i===3?[note(1)]:i===4?[note(3)]:[])]})),quirks:story[7][language],neighbors:getNeighbors(type,locale),strengths:data.strengths[locale]}
}
