import {DIMENSIONS,isType,validPercents} from './detailedReport.js'
const copy={
 EI:{same:[['安排活动时，双方都可以先说清自己今天有多少社交精力。','For an invitation, each person can state today’s social energy.'],['先约定互动时长，再留一点各自休息的空间。','Agree on time together and leave room for separate rest.']],different:[['一个人可能边聊边想，另一个人可能想好再说；慢一点接话不必读成没兴趣。','One may think aloud while the other prepares a response. A slower reply need not mean disinterest.'],['表达较快的一方留出停顿，整理较慢的一方给一个回应时间。','The faster speaker can pause; the person preparing a response can offer a time to return.']]},
 NS:{same:[['谈计划时，可以同时核对具体条件和期待的体验。','Discuss practical constraints alongside the experience you hope for.'],['不要假设相同字母就代表想去同一个地方，直接问偏好。','A shared letter does not mean the same destination; ask about preferences.']],different:[['一个人可能先聊意义与可能，另一个人可能先问实际安排；这两种入口可以补充信息。','One may start with meaning and possibilities, the other with practical arrangements. Both add information.'],['谈愿景的一方给一个具体例子，谈细节的一方也问这件事为什么重要。','Offer a concrete example for a broad idea, and ask why a detail matters.']]},
 FT:{same:[['支持对方前，先确认今天需要被听见还是一起找办法。','Before helping, ask whether listening or problem-solving is wanted today.'],['即使侧重点相近，也把感受与具体请求分别说明。','Even with similar emphasis, name feelings and concrete requests separately.']],different:[['一个人可能先看对人的影响，另一个人可能先看依据与办法；不同优先顺序不等于不关心。','One may prioritize people’s experience, the other evidence and solutions. Different priorities do not imply a lack of care.'],['先复述对方最在意的部分，再讨论可以改变的具体行为。','Reflect what matters most to the other person, then discuss one behavior that can change.']]},
 JP:{same:[['安排变化时，重新确认关键约定，别只依靠默契。','When plans change, reconfirm commitments instead of relying on assumptions.'],['把必须确定的事和可以临时调整的事分开。','Separate what must be confirmed from what can stay flexible.']],different:[['一个人可能想先定好时间，另一个人可能想留出选择；可靠与灵活可以一起协商。','One may want a set time while the other keeps options open. Reliability and flexibility can be negotiated together.'],['确定一个确认期限，并保留一个可调整的备选方案。','Set a confirmation deadline and keep one flexible alternative.']]},
}
export function compareTypes(own,friend,context='friendship',locale='zh'){
 if(!isType(own?.type)||!isType(friend?.type))return null
 const lang=locale==='en'?1:0,hasNumbers=validPercents(own.percents)&&validPercents(friend.percents)
 const dimensions=DIMENSIONS.map((d,i)=>{
  const near=hasNumbers&&[own,friend].some(x=>x.percents[d.key][d.letters[0]]>=45&&x.percents[d.key][d.letters[0]]<=55)
  const same=own.type[i]===friend.type[i],lines=copy[d.key][same?'same':'different']
  return {key:d.key,same,near,detail:near?(lang?'At least one answer set is near the middle here. The letters alone do not establish a strong difference.':'这里至少一方的答题倾向接近中间，不能只凭不同字母推断强烈对立。'):lines[0][lang],advice:near?(lang?'Ask what each person needs in this particular situation rather than guessing from a type.':'先说清各自在这次具体情境中需要什么，不必根据类型猜测。'):lines[1][lang],...(hasNumbers?{own:own.percents[d.key][d.letters[0]],friend:friend.percents[d.key][d.letters[0]],letter:d.letters[0]}:{})}
 })
 return {dimensions,hasNumbers,question:context==='close'?(lang?'When we disagree, how long a pause feels helpful, and when shall we reconnect?':'发生分歧时，我们各自需要暂停多久？怎样约定重新联系的时间？'):(lang?'For our next invitation, what should be confirmed early and what can stay open?':'下一次邀约，哪些事需要提前确认，哪些事可以留到当天再决定？')}
}
