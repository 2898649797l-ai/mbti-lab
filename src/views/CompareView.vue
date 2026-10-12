<template><header class="page-header"><router-link to="/" class="text-button">{{ $t('types.backHome') }}</router-link><LangToggle/></header><main class="feature-main">
 <h1>{{ $t('social.compareTitle') }}</h1><p class="feature-muted">{{ $t('social.compareIntro') }}</p>
 <section class="feature-card"><label class="feature-label">{{ $t('social.ownType') }}<select v-model="ownType" class="feature-input"><option value="">{{ $t('social.chooseType') }}</option><option v-for="type in codes" :key="type">{{ type }}</option></select></label>
 <label class="feature-label">{{ $t('social.friendType') }}<select v-model="friendType" @change="clearFriend" class="feature-input"><option value="">{{ $t('social.chooseType') }}</option><option v-for="type in codes" :key="type">{{ type }}</option></select></label>
 <label class="feature-label">{{ $t('social.friendLink') }}<textarea v-model="input" class="feature-input" rows="2" /></label><button class="secondary-button" @click="readFriend">{{ $t('social.readLink') }}</button>
 <p v-if="error" role="alert" class="notice">{{ $t('social.errors.'+error) }}</p>
 <p v-if="friendSnapshot" class="feature-muted">{{ $t('social.imported',{name:friendSnapshot.n||friendType}) }}</p>
 <label v-if="friendSnapshot?.m?.p&&ownResult&&ownType===ownResult.type" class="feature-check"><input v-model="ownNumbers" type="checkbox"/>{{ $t('social.useOwnNumbers') }}</label>
 <label class="feature-label">{{ $t('social.context') }}<select v-model="context" class="feature-input"><option value="friendship">{{ $t('social.friendship') }}</option><option value="close">{{ $t('social.close') }}</option></select></label></section>
 <template v-if="comparison"><section class="feature-card"><h2>{{ ownType }} × {{ friendType }}</h2><p>{{ $t('social.comparisonNote') }}</p><p>{{ comparison.hasNumbers?$t('social.numericNote'):$t('social.typeOnly') }}</p></section>
 <section class="feature-card"><h2>{{ $t('social.common') }}</h2><p>{{ commonText }}</p></section>
 <section v-for="d in comparison.dimensions" :key="d.key" class="feature-card"><h2>{{ d.key }} · {{ $t(d.near?'social.near':d.same?'social.sharedFocus':'social.differentFocus') }}</h2><p>{{ d.detail }}</p><p class="comparison-tip">{{ $t('social.tryTogether') }}：{{ d.advice }}</p><p v-if="comparison.hasNumbers" class="score-comparison">{{ $t('social.me') }} {{ d.letter }} {{ d.own }}% · {{ $t('social.friend') }} {{ d.letter }} {{ d.friend }}%</p></section>
 <section class="feature-card discussion"><h2>{{ $t('social.question') }}</h2><p>{{ comparison.question }}</p></section>
 <CopyText :value="caption" :label="$t('share.copyText')"/><PosterExporter :model="posterModel"/></template>
</main></template>
<script setup>
import {ref,computed,watch} from 'vue'
import {useRoute} from 'vue-router'
import {useI18n} from 'vue-i18n'
import LangToggle from '../components/LangToggle.vue'
import CopyText from '../components/CopyText.vue'
import PosterExporter from '../components/PosterExporter.vue'
import {types} from '../data/types.js'
import {useResultStore} from '../composables/useResultStore.js'
import {snapshotFromUrl,snapshotPercents,decodeSnapshot} from '../utils/profileSnapshot.js'
import {compareTypes} from '../utils/comparison.js'
import {APP_URL} from '../config.js'
const route=useRoute(),{t,locale}=useI18n(),codes=Object.keys(types),ownResult=useResultStore().peek()
const ownType=ref(ownResult?.type||''),friendType=ref(''),friendSnapshot=ref(null),input=ref(''),error=ref(''),context=ref('friendship'),ownNumbers=ref(false)
function importFriend(s){if(!s.m)throw {code:'noType'};friendSnapshot.value=s;friendType.value=s.m.t;ownNumbers.value=false;error.value=''}
function clearFriend(){friendSnapshot.value=null;ownNumbers.value=false;error.value='';input.value=''}
function readFriend(){try{importFriend(snapshotFromUrl(input.value))}catch(e){friendSnapshot.value=null;friendType.value='';ownNumbers.value=false;error.value=e.code||'invalid'}}
watch(()=>route.query.friend,(payload)=>{if(payload){try{importFriend(decodeSnapshot(String(payload)))}catch(e){error.value=e.code||'invalid'}}},{immediate:true})
watch(ownType,()=>{ownNumbers.value=false})
const comparison=computed(()=>compareTypes({type:ownType.value,percents:ownNumbers.value&&ownType.value===ownResult?.type?ownResult.percents:null},{type:friendType.value,percents:friendSnapshot.value?snapshotPercents(friendSnapshot.value):null},context.value,locale.value))
const commonText=computed(()=>{const shared=comparison.value.dimensions.filter(d=>d.same).map(d=>d.key).join('、');return shared?t('social.commonLetters',{shared}):t('social.noSharedLetters')})
const caption=computed(()=>`${ownType.value} × ${friendType.value}\n${t('social.pairTagline')}\n${comparison.value?.question||''}\n${APP_URL}`)
const posterModel=computed(()=>({kind:'pair',kicker:t('social.compareTitle'),title:`${ownType.value} × ${friendType.value}`,subtitle:t('social.pairTagline'),lines:[t('social.comparisonNote'),comparison.value.question],tags:[t('social.'+context.value)]}))
</script>
<style scoped>.comparison-tip{background:#f5f0ff;padding:14px;border-radius:14px}.score-comparison{color:var(--blue);font-size:14px}.discussion{background:#edf5dd}</style>
