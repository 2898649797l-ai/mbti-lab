<template><header class="page-header"><router-link to="/" class="text-button">{{ $t('types.backHome') }}</router-link><LangToggle/></header><main class="feature-main">
 <h1>{{ $t('social.myProfile') }}</h1><p class="feature-muted">{{ $t('social.buildIntro') }}</p>
 <section class="feature-card"><label class="feature-label">{{ $t('social.nickname') }}<input v-model="name" class="feature-input" maxlength="40" autocomplete="off" /></label><p class="feature-muted">{{ Array.from(name.trim()).length }} / 20</p>
  <label v-if="result" class="feature-check"><input v-model="includeType" type="checkbox"/>{{ $t('social.includeType') }} · {{ result.type }}</label>
  <label v-if="result&&includeType" class="feature-check"><input v-model="includePercents" type="checkbox"/>{{ $t('social.includePercents') }}</label>
  <slot name="scene-selections" />
  <p class="feature-muted">{{ $t('social.privacyWarning') }}</p>
 </section>
 <p v-if="visibleError" role="alert" class="notice">{{ $t('social.errors.'+visibleError) }}</p>
 <p v-if="!result" class="notice">{{ $t('social.noResult') }}</p>
 <template v-if="draft"><h2 class="preview-heading">{{ $t('social.visiblePreview') }}</h2><SnapshotBody :snapshot="draft"/>
 <button class="primary-button" @click="generate">{{ $t('social.createLink') }}</button></template>
 <section v-if="link" class="feature-card"><h2>{{ $t('social.readyLink') }}</h2><p class="feature-muted">{{ $t('social.linkFixed') }}</p><CopyText :value="link" :label="$t('share.copyLink')"/><router-link :to="'/p/'+encodeSnapshot(published)" class="text-button">{{ $t('social.openProfile') }} →</router-link></section>
 <PosterExporter v-if="draft&&draft.m" :model="posterModel" :snapshot-url="link"/>
</main></template>
<script setup>
import {ref,computed,watch} from 'vue'
import {useI18n} from 'vue-i18n'
import LangToggle from '../components/LangToggle.vue'
import SnapshotBody from '../components/SnapshotBody.vue'
import CopyText from '../components/CopyText.vue'
import PosterExporter from '../components/PosterExporter.vue'
import {useResultStore} from '../composables/useResultStore.js'
import {createSnapshot,profileUrl,snapshotProfile,encodeSnapshot} from '../utils/profileSnapshot.js'
const {locale,t}=useI18n(),result=ref(useResultStore().peek()),name=ref(''),includeType=ref(true),includePercents=ref(false),published=ref(null),link=ref(''),error=ref('')
const draftState=computed(()=>{try{return {snapshot:createSnapshot({result:includeType.value?result.value:null,name:name.value,includePercents:includePercents.value})}}catch(e){return {error:e.code||'invalid'}}})
const draft=computed(()=>draftState.value.snapshot),visibleError=computed(()=>error.value||draftState.value.error)
watch([name,includeType,includePercents],()=>{link.value='';published.value=null;error.value=''})
function generate(){try{const value=createSnapshot({result:includeType.value?result.value:null,name:name.value,includePercents:includePercents.value});link.value=profileUrl(value);published.value=value;error.value=''}catch(e){error.value=e.code||'invalid'}}
const posterModel=computed(()=>{const p=snapshotProfile(draft.value,locale.value);return {kind:'personal',kicker:t('report.manual'),title:draft.value.m.t+' · '+p.nickname,subtitle:draft.value.n||p.summary,lines:p.report.quirks,tags:p.tags}})
</script>
