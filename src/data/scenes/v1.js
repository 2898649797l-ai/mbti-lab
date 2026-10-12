// Original life-scene prompts and editorial interpretations. Published v1 stays immutable.
const text = (zh, en) => ({ zh, en })
const band = (summary, friendship, close, script, share) => ({
  summary,
  friendship,
  close,
  script,
  share,
})
const middle = band(
  text(
    '这次两侧接近。你的回应可能随关系、精力和事件的重要性改变，不必固定成一种风格。',
    'The two sides are close in this answer set. Relationship, energy and the event’s importance may change your response; no fixed style is required.',
  ),
  text(
    '和朋友先确认这一次想怎样相处，不必让上次的习惯代表每次需要。',
    'Ask how a friend wants to interact this time rather than letting a previous habit define every occasion.',
  ),
  text(
    '把今天的需要说出来，允许彼此在不同日子采用不同节奏。',
    'State today’s needs and allow different rhythms on different days.',
  ),
  text('“这次我更需要……你今天呢？”', '“This time I need… What about you today?”'),
  text('随情境调整，先问今天需要什么。', 'Adapt to context; ask what is needed today.'),
)
const middleContext = {
  pace: [
    text(
      '熟悉话题可以即时聊，重要问题可以先整理；这次不需要固定一种开口节奏。',
      'A familiar topic can invite immediate talk; an important issue can allow preparation. No single speaking pace is required.',
    ),
    text(
      '“这个话题我想边聊边想；那个问题我晚点认真回复。”',
      '“I can think aloud about this; I will reply carefully to the other question later.”',
    ),
    text(
      '聊天节奏看情境，重要问题留整理时间。',
      'Conversation pace can flex; important issues get thinking time.',
    ),
  ],
  response: [
    text(
      '陪着听与一起找办法都可能适合你；先确认对方这次需要哪一种支持。',
      'Listening and problem-solving may both suit you. Ask which support is wanted this time.',
    ),
    text(
      '“今天你想被听见，还是一起找个办法？”',
      '“Would you like listening today, or a solution together?”',
    ),
    text('支持方式不固定，先问这次需要什么。', 'Support can vary; ask what is needed this time.'),
  ],
  connection: [
    text(
      '联系与独立空间都可能让你舒服；忙碌程度改变时，可以重新协商联系频率。',
      'Contact and independence can both feel comfortable. Revisit frequency when schedules change.',
    ),
    text(
      '“这周忙，少联系一点；周末我们认真聊。”',
      '“This week is busy; less contact now, a proper conversation at the weekend.”',
    ),
    text('可以常联系，也可以忙时留一点空间。', 'Stay connected and leave space during busy days.'),
  ],
  boundary: [
    text(
      '有些限制你能直接说，有些需要先整理。重要边界最终都值得用明确话语表达。',
      'Some limits can be stated directly; others need preparation. Important boundaries still deserve explicit words.',
    ),
    text(
      '“这件事我可以直接说明；另一件让我先想想怎样表达。”',
      '“I can state this directly; let me prepare my words for the other issue.”',
    ),
    text(
      '边界表达可以渐进，重要限制要讲明。',
      'Boundaries can unfold; important limits get clear words.',
    ),
  ],
  timing: [
    text(
      '及时讨论与暂停都可能适合你，先确认这次双方有没有余力，再约好重新联系的时间。',
      'Prompt talk or a pause may both suit you. Check capacity and agree on when to reconnect.',
    ),
    text(
      '“现在能聊我们就聊；需要休息就约一个回来谈的时间。”',
      '“We can talk if ready; if not, let us agree on a time to return.”',
    ),
    text(
      '修复节奏看余力，暂停也约好回程。',
      'Repair follows capacity, with a return time after a pause.',
    ),
  ],
  repair: [
    text(
      '感受与具体问题都值得处理；这次可以先问哪一个入口更能帮助双方继续谈。',
      'Feelings and concrete issues both deserve attention. Ask which starting point helps the conversation continue.',
    ),
    text(
      '“我们先说感受，还是先确认发生了什么？两件事都会谈。”',
      '“Feelings first, or what happened first? We will address both.”',
    ),
    text(
      '感受和办法都重要，入口可以一起选。',
      'Feelings and solutions matter; choose an entry together.',
    ),
  ],
}
const middleAdvice = {
  pace: [
    text(
      '群聊里可以先给一个初步回应，复杂意见再约时间补充。',
      'Give a brief first reply in a group; arrange time to add a more complex thought.',
    ),
    text(
      '先说明这次想即时聊还是需要整理，别让亲近的人只能猜。',
      'Say whether this conversation needs immediate talk or preparation, rather than leaving someone close to guess.',
    ),
  ],
  response: [
    text(
      '朋友倾诉时，先让他选择听一听还是一起找办法。',
      'Let a friend choose listening or problem-solving.',
    ),
    text(
      '先确认感受，再一起决定需要一个拥抱、建议还是具体行动。',
      'Acknowledge the feeling, then choose reassurance, advice or concrete action together.',
    ),
  ],
  connection: [
    text(
      '邀约时说清这周的空闲，不把上周的联系频率当作固定要求。',
      'State this week’s availability without treating last week’s contact frequency as a permanent requirement.',
    ),
    text(
      '忙碌时约一个简短告知和下次共同时间，把空间与联系一起安排。',
      'During a busy period, agree on a brief signal and the next shared time, planning both space and contact.',
    ),
  ],
  boundary: [
    text(
      '可以先整理措辞，再把一项限制明说，不让朋友反复猜提示。',
      'Prepare your words, then state one limit explicitly so a friend need not keep guessing at hints.',
    ),
    text(
      '先说一个具体行为带来的负担，再协商双方愿意承担的范围。',
      'Name the burden of one behavior and discuss what each person can take on.',
    ),
  ],
  timing: [
    text(
      '谈分歧前先问现在有没有余力；不能谈就共同约一个时间。',
      'Check capacity before discussing disagreement; agree on a time if now does not work.',
    ),
    text(
      '把“要不要暂停”和“会不会回来谈”分开，暂停也保持明确约定。',
      'Separate taking a pause from returning to talk, keeping a clear agreement for both.',
    ),
  ],
  repair: [
    text(
      '把事实和感受各说一句，再选一件能改变的小事。',
      'Give one sentence each for the facts and feelings, then choose a small change.',
    ),
    text(
      '先问今天需要从感受还是问题开始，两部分都保留讨论位置。',
      'Ask whether today needs feelings or the issue first, while leaving room for both.',
    ),
  ],
}
const axis = (id, left, right, leftBand, rightBand) => ({
  id,
  left,
  right,
  bands: {
    left: leftBand,
    middle: {
      ...middle,
      summary: middleContext[id][0],
      script: middleContext[id][1],
      share: middleContext[id][2],
      friendship: middleAdvice[id][0],
      close: middleAdvice[id][1],
    },
    right: rightBand,
  },
})
const chatAxes = [
  axis(
    'pace',
    text('即时表达', 'Express in the moment'),
    text('整理后表达', 'Prepare before speaking'),
    band(
      text(
        '你这次更靠近即时表达：说出来的过程可能帮助你整理思路。它不代表每句话都是最终立场，重要讨论仍可以留一次回看。',
        'Your answers lean toward expressing in the moment. Speaking may organize a thought; each sentence need not be a final position. Revisit important discussions.',
      ),
      text(
        '群聊里可以先说明“我边说边想”，并停一下，让较慢回应的人也有入口。',
        'Tell a group you are thinking aloud, then pause so someone preparing a response can join.',
      ),
      text(
        '亲近的人未必能立即跟上你的思路。把试探性的想法与已经决定的事区分开。',
        'A close person may not immediately follow your thinking. Distinguish an exploratory thought from a decision.',
      ),
      text(
        '“这是我刚想到的，不是最后决定。你可以慢慢说。”',
        '“This is a first thought, not a final decision. Take your time.”',
      ),
      text('边聊边整理，也给对方留停顿。', 'Think aloud and leave room for a pause.'),
    ),
    band(
      text(
        '你这次更靠近整理后表达：先想清楚再回应可能更舒服。安静不等于拒绝参与，也可以先给一个简短的状态说明。',
        'Your answers lean toward preparing before speaking. Quiet need not reject participation; a short status update can explain the pause.',
      ),
      text(
        '朋友等回复时，给一个大致时间比一直沉默更容易减少误解。',
        'Give a friend an approximate reply time instead of unexplained silence.',
      ),
      text(
        '需要空间时说明暂停的用途和重新联系的时间，让对方不用猜是不是关系出了问题。',
        'Explain the purpose of a pause and when to reconnect, so a loved one need not guess about the relationship.',
      ),
      text(
        '“我在认真想，今晚再给你完整回应。”',
        '“I am considering this carefully; I will reply fully tonight.”',
      ),
      text('先整理再表达，安静附带回应时间。', 'Prepare first, with a time to reconnect.'),
    ),
  ),
  axis(
    'response',
    text('情绪回应', 'Acknowledge feelings'),
    text('解决问题', 'Work on the problem'),
    band(
      text(
        '你这次更靠近先回应情绪：被理解可能是你认为支持的重要入口。也要留意对方是否正在请求资源或行动，不必只停在共鸣。',
        'Your answers lean toward acknowledging feelings first. Understanding may be an important entry to support; notice requests for resources or action too.',
      ),
      text(
        '听朋友倾诉后，问问他想继续说还是一起找下一步，给支持一个选择。',
        'After listening, ask whether a friend wants more space to speak or a next step.',
      ),
      text(
        '表达理解之后，也把这次需要改变的具体行为说清楚，避免只有安慰没有协商。',
        'After understanding, name a specific behavior to change so comfort can lead to negotiation.',
      ),
      text(
        '“这确实让你难受。你想继续说，还是我们一起想办法？”',
        '“That sounds painful. More listening, or shall we think about a next step?”',
      ),
      text('先接住心情，再确认要不要找办法。', 'Meet the feeling, then ask about solutions.'),
    ),
    band(
      text(
        '你这次更靠近先找解决办法：实际行动可能让你感到支持落了地。对方却可能需要先把经历说完整，办法的时机与质量同样重要。',
        'Your answers lean toward solutions first. Action may make support tangible, while the other person may need to finish the story. Timing matters as much as quality.',
      ),
      text(
        '给建议前先问朋友是否想听，避免把帮助变成额外作业。',
        'Ask whether advice is welcome before turning help into another assignment.',
      ),
      text(
        '先复述对方最在意的一句，再提出一个可讨论的小方案，让感受与行动都被看见。',
        'Reflect what matters most, then propose one small option so both feelings and action are recognized.',
      ),
      text(
        '“我想到一个办法。你现在想听，还是先让我陪你说完？”',
        '“I have an idea. Would you like it now, or should I listen first?”',
      ),
      text('办法准备好了，先问对方需不需要。', 'A solution is ready; check whether it is wanted.'),
    ),
  ),
]
const boundaryAxes = [
  axis(
    'connection',
    text('频繁连接', 'Frequent connection'),
    text('保留空间', 'Room for independence'),
    band(
      text(
        '你这次更靠近频繁连接：日常联系可能让你更容易感受到关系的存在。回复的频率却不是关心的唯一证据，也需要考虑双方的时间。',
        'Your answers lean toward frequent connection. Everyday contact may make closeness tangible, but reply frequency is not the only evidence of care; both schedules matter.',
      ),
      text(
        '把想联系的频率当作偏好说明，而不是默认朋友必须遵守的规则。',
        'State preferred contact frequency as a preference, not a rule a friend must automatically obey.',
      ),
      text(
        '商量忙碌时怎样简单告知，给联系和暂时没有精力都留出合理位置。',
        'Agree on a brief signal during busy periods, allowing both connection and low-energy days.',
      ),
      text(
        '“我喜欢常联系，忙的时候简单告诉我就好。你舒服的频率是什么？”',
        '“I like regular contact. A brief busy signal helps. What frequency feels good to you?”',
      ),
      text('喜欢常联系，也允许各自忙碌。', 'Regular contact with room for busy days.'),
    ),
    band(
      text(
        '你这次更靠近保留空间：独立活动可能帮助你维持自己的节奏。需要空间不等于不重视关系，主动说明可以让边界更容易被理解。',
        'Your answers lean toward independence. Separate activities may support your rhythm. Space does not mean indifference, and explanation helps others understand the boundary.',
      ),
      text(
        '无法频繁参与时，说明你愿意怎样保持联系，不必只在被追问后解释。',
        'Say how you would like to stay in touch when frequent participation is difficult.',
      ),
      text(
        '把独处的需要与下一次共同时间一起表达，让独立与可依赖的回应兼容。',
        'Pair the need for alone time with the next shared time, keeping independence and reliability together.',
      ),
      text(
        '“我今晚想自己休息，周六一起吃饭可以吗？”',
        '“I want time alone tonight. Could we have a meal on Saturday?”',
      ),
      text('需要自己的空间，也留一个相聚时间。', 'Keep space and a time to meet again.'),
    ),
  ),
  axis(
    'boundary',
    text('直接表达边界', 'State boundaries directly'),
    text('逐步表达边界', 'Express boundaries gradually'),
    band(
      text(
        '你这次更靠近直接表达：把能做与不能做讲清楚可能让你安心。清楚不必显得冷硬，可以同时说明真实限制和愿意提供的帮助。',
        'Your answers lean toward direct boundaries. Knowing what you can and cannot do may reassure you. Clarity can include a limitation and the help still available.',
      ),
      text(
        '拒绝邀约时讲明自己不能参加即可，不必评价朋友的选择。',
        'Decline an invitation by naming your availability, without judging the friend’s choice.',
      ),
      text(
        '重要边界说清具体行为，并邀请对方说明自己的需要；边界不是替对方决定。',
        'Name the specific boundary and invite the other person’s needs. A boundary does not decide for them.',
      ),
      text(
        '“这部分我今天不能承担，但我可以帮你确认下一步。”',
        '“I cannot take this part today, but I can help clarify the next step.”',
      ),
      text('清楚说明容量，温柔不靠含糊。', 'Name capacity clearly; kindness need not be vague.'),
    ),
    band(
      text(
        '你这次更靠近逐步表达：可能会先用语气、距离或小提示传达不舒服。它能给自己缓冲，但别人未必准确读到，重要边界需要最后落到明确话语。',
        'Your answers lean toward gradual expression through tone, distance or small hints. It offers a buffer, but others may not read it accurately; important boundaries still need explicit words.',
      ),
      text(
        '先给自己整理时间，再用一句具体说明代替长期暗示，减少朋友只能猜的负担。',
        'Take time to organize, then offer one explicit sentence rather than prolonged hints.',
      ),
      text(
        '不必一次解释所有感受，先指出一件希望调整的事，再商量双方可接受的方式。',
        'You need not explain every feeling at once. Name one desired adjustment and discuss a workable agreement.',
      ),
      text(
        '“我想了想，这样安排让我有点吃不消。我们能改这一部分吗？”',
        '“I have thought about it; this arrangement feels too much. Can we change this part?”',
      ),
      text('可以慢慢整理，边界最终要说清楚。', 'Take time, then give the boundary clear words.'),
    ),
  ),
]
const repairAxes = [
  axis(
    'timing',
    text('立即讨论', 'Discuss promptly'),
    text('暂停后讨论', 'Pause before discussion'),
    band(
      text(
        '你这次更靠近及时讨论：问题悬着可能让你不舒服，想尽快知道彼此的意思。及时不等于当场逼出答案，双方有余力时再谈通常更有帮助。',
        'Your answers lean toward prompt discussion. Unresolved issues may feel uncomfortable. Promptness need not force an immediate answer; both people need capacity.',
      ),
      text(
        '和朋友先确认现在是否适合谈，再把问题缩小到一件具体的事。',
        'Check whether now is a good time, then focus on one concrete issue.',
      ),
      text(
        '如果对方需要暂停，约一个双方能接受的时间，让修复不变成追问。',
        'If a loved one needs a pause, agree on a return time so repair does not become repeated questioning.',
      ),
      text(
        '“我想把这件事讲清楚。你现在有余力，还是晚点再聊？”',
        '“I want to clarify this. Do you have energy now, or should we talk later?”',
      ),
      text('想及时说清，也确认双方有余力。', 'Clarify promptly and check capacity first.'),
    ),
    band(
      text(
        '你这次更靠近暂停后讨论：先稳定情绪或整理思路可能让表达更准确。暂停若没有时间说明，容易被理解成消失；给一个重新讨论的约定会更可靠。',
        'Your answers lean toward a pause to settle feelings or organize thoughts. An unexplained pause can look like disappearing; agree on returning to the discussion.',
      ),
      text(
        '需要暂时离开争论时，明确说出这是暂停，不是结束友谊。',
        'When leaving a discussion temporarily, make clear it is a pause rather than ending the friendship.',
      ),
      text(
        '约好再谈的时间，并在回来后回应原问题，避免把休息变成无限拖延。',
        'Agree on a return time and address the original issue afterward, rather than postponing indefinitely.',
      ),
      text(
        '“我现在需要缓一缓，不是想回避。半小时后我们再谈好吗？”',
        '“I need to settle, not avoid this. Can we return in half an hour?”',
      ),
      text('暂停有时间，修复有回程。', 'A pause with a return time.'),
    ),
  ),
  axis(
    'repair',
    text('先处理感受', 'Start with feelings'),
    text('先处理具体问题', 'Start with the concrete issue'),
    band(
      text(
        '你这次更靠近先处理感受：知道自己的体验被认真理解，可能让你更愿意讨论下一步。理解之后也要把具体约定落实，修复不只是一句安慰。',
        'Your answers lean toward feelings first. Being understood may make next steps easier to discuss. Follow understanding with a concrete agreement; repair needs more than comfort.',
      ),
      text(
        '先讲这件事带来的感受，再指出一项可以改变的行为，避免讨论停在谁更委屈。',
        'Name the feeling, then one behavior that can change, rather than competing over whose hurt is greater.',
      ),
      text(
        '把“你总是……”换成具体事件与需要，给对方一个能够回应的请求。',
        'Replace “You always…” with an event, need and request the other person can respond to.',
      ),
      text(
        '“刚才我感到被忽略。我希望下次先确认我们各自的安排。”',
        '“I felt overlooked earlier. Next time, can we confirm both schedules first?”',
      ),
      text('先说被影响的感受，再说可调整的事。', 'Name the feeling and one change to try.'),
    ),
    band(
      text(
        '你这次更靠近先处理具体问题：明确原因、责任或下一步可能帮助你恢复信任。对方也可能需要听到你理解这件事怎样影响了他，解决和理解可以同时发生。',
        'Your answers lean toward concrete issues first. Causes, responsibilities and next steps may rebuild trust. The other person may also need acknowledgment of the impact; understanding and solving can coexist.',
      ),
      text(
        '先确认事实，不急着判断动机；提出一个下一次可执行的小约定。',
        'Check facts without rushing to judge motives, and propose one workable agreement for next time.',
      ),
      text(
        '谈办法前复述对方的感受，再商量彼此各自负责什么，避免只剩任务分配。',
        'Reflect the feeling before planning responsibilities so repair is not merely task allocation.',
      ),
      text(
        '“我知道这让你失望。我们先确认发生了什么，再约定下次怎样做。”',
        '“I know this was disappointing. Let us clarify what happened and agree on next time.”',
      ),
      text('把问题讲具体，也把影响听完整。', 'Clarify the issue and hear the full impact.'),
    ),
  ),
]
function questions(rows) {
  return rows.map(([zh, en], i) => ({
    id: 'q' + (i + 1),
    axis: i % 2,
    reverse: Math.floor(i / 2) % 2 === 1,
    prompt: text(zh, en),
  }))
}
export const sceneTestsV1 = {
  chat: {
    id: 'chat',
    version: '1',
    title: text('聊天与回应', 'Chat and response'),
    description: text(
      '聊起心事时，你怎样开口，又怎样接住别人？',
      'How do you begin a conversation and respond to someone?',
    ),
    axes: chatAxes,
    questions: questions([
      [
        '和朋友讨论新想法时，我会先说出来，在交流中继续整理。',
        'When discussing an idea with a friend, I speak first and organize it through conversation.',
      ],
      [
        '亲近的人说自己很难受时，我会先确认他的心情。',
        'When someone close says they are upset, I first acknowledge their feelings.',
      ],
      [
        '表达重要意见前，我通常先把思路整理完整。',
        'Before giving an important opinion, I usually organize my thoughts fully.',
      ],
      [
        '朋友遇到麻烦时，我会先找一个可执行的办法。',
        'When a friend has trouble, I first look for a workable solution.',
      ],
      [
        '群聊出现开放问题时，我愿意用一个初步想法开启讨论。',
        'For an open question in a group chat, I am willing to begin with a tentative idea.',
      ],
      [
        '给朋友建议之前，我倾向先听他把感受讲完整。',
        'Before advising a friend, I tend to hear their feelings fully.',
      ],
      [
        '对方期待回复时，我更希望先想清楚，再给准确回答。',
        'When someone expects a reply, I prefer to think it through before answering accurately.',
      ],
      [
        '安慰朋友时，我更自然地提供资源或具体行动。',
        'When comforting a friend, resources or concrete action come more naturally to me.',
      ],
      [
        '面对面聊天时，我会顺着对方的话即时表达正在形成的想法。',
        'In conversation, I respond with thoughts still taking shape.',
      ],
      [
        '对方讲烦恼时，我会先说出我理解的难受，再讨论下一步。',
        'When someone shares a worry, I acknowledge the difficulty before discussing next steps.',
      ],
      [
        '遇到需要认真回应的话题，我喜欢先写下来或独自想一会儿。',
        'For a serious reply, I like to write or think alone first.',
      ],
      [
        '听到一个困扰时，我首先想知道可以改变哪一步。',
        'Hearing about a difficulty, I first wonder which step can be changed.',
      ],
    ]),
  },
  boundaries: {
    id: 'boundaries',
    version: '1',
    title: text('距离与边界', 'Distance and boundaries'),
    description: text(
      '联系多一点还是留点空间？怎样把自己的容量说清楚？',
      'More contact or more space? How do you communicate capacity?',
    ),
    axes: boundaryAxes,
    questions: questions([
      [
        '和重要的朋友保持经常的日常联系，会让我更安心。',
        'Frequent everyday contact with important friends reassures me.',
      ],
      [
        '答应帮忙前，我会直接说清自己能负责的范围。',
        'Before helping, I directly state what I can take responsibility for.',
      ],
      [
        '关系稳定时，我也需要较多各自活动、不必联系的时间。',
        'Even in a steady relationship, I need substantial independent time without contact.',
      ],
      [
        '安排让我不舒服时，我常先用小提示表达，而不是直接说明。',
        'When an arrangement feels uncomfortable, I often start with hints instead of a direct statement.',
      ],
      [
        '即使没有特别的事，我也喜欢和亲近的人常常交换近况。',
        'Even without a particular event, I enjoy frequent updates with someone close.',
      ],
      [
        '不想参加邀约时，我通常会明确告诉对方自己不能参加。',
        'When I do not want to join an invitation, I usually say directly that I cannot join.',
      ],
      [
        '一段时间不联系，只要约定稳定，我仍能自在地维持关系。',
        'With a steady agreement, I feel comfortable maintaining a relationship without frequent contact.',
      ],
      [
        '需要拒绝时，我更习惯先婉转试探，再慢慢把限制说出来。',
        'When declining, I tend to approach indirectly before gradually stating the limit.',
      ],
      [
        '忙碌的日子里，我仍希望和重要的人有简短的日常连接。',
        'Even on busy days, I like a brief everyday connection with important people.',
      ],
      [
        '别人提出超出我容量的请求时，我会直接说明自己的限制。',
        'When a request exceeds my capacity, I directly explain the limit.',
      ],
      [
        '我喜欢各自安排一部分生活，不需要经常同步每个细节。',
        'I like independently arranging parts of life without regularly sharing every detail.',
      ],
      [
        '关系中出现不舒服的事时，我常先改变参与方式，再解释原因。',
        'When something feels uncomfortable, I often change my participation before explaining why.',
      ],
    ]),
  },
  repair: {
    id: 'repair',
    version: '1',
    title: text('分歧与修复', 'Disagreement and repair'),
    description: text(
      '不同意之后，什么时候聊，又从哪里重新靠近？',
      'After disagreement, when do you talk and where do you begin repair?',
    ),
    axes: repairAxes,
    questions: questions([
      [
        '出现分歧后，我通常想尽快把彼此的意思说清楚。',
        'After disagreement, I usually want to clarify both perspectives promptly.',
      ],
      [
        '修复分歧时，我首先希望双方的感受被理解。',
        'In repairing a disagreement, I first want both people’s feelings understood.',
      ],
      [
        '有情绪时，我更希望先暂停，等整理好再讨论。',
        'When emotional, I prefer a pause before discussing after I have settled.',
      ],
      [
        '发生误会时，我首先想确认事实和具体原因。',
        'After a misunderstanding, I first want facts and concrete causes clarified.',
      ],
      [
        '在双方有余力时，我喜欢当天就开始讨论未解决的问题。',
        'When both have capacity, I like to begin discussing an unresolved issue the same day.',
      ],
      [
        '谈解决办法前，我更想说清这件事为什么让我在意。',
        'Before solutions, I want to explain why the event matters to me.',
      ],
      [
        '争论过后，留出一段各自冷静的时间通常更适合我。',
        'After an argument, a period to settle separately usually suits me better.',
      ],
      [
        '意见不一致时，明确下一次怎样做会让我更容易安心。',
        'When opinions differ, a clear next-time plan helps me feel reassured.',
      ],
      [
        '问题悬着时，我更愿意早点约一次谈话，而不是放到以后。',
        'When an issue hangs unresolved, I prefer to arrange a conversation soon.',
      ],
      [
        '对方先承认我的感受，会让我更愿意进入协商。',
        'Acknowledgment of my feelings helps me enter a negotiation.',
      ],
      [
        '重要分歧出现后，我倾向先独自梳理，再回来表达。',
        'After an important disagreement, I tend to organize my thoughts alone before returning.',
      ],
      [
        '修复关系时，我更希望先把责任与下一步行动约定清楚。',
        'In repairing a relationship, I prefer to clarify responsibilities and next actions first.',
      ],
    ]),
  },
}
