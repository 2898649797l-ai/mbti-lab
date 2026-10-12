<template><header class="page-header"><router-link to="/" class="text-button">{{ $t('types.backHome') }}</router-link><LangToggle/></header><main class="feature-main">
 <template v-if="snapshot"><SnapshotBody :snapshot="snapshot"/><router-link v-if="snapshot.m" :to="{path:'/compare',query:{friend:payload}}" class="primary-button">{{ $t('social.compareMe') }} →</router-link><router-link to="/profile" class="secondary-button">{{ $t('social.myProfile') }}</router-link></template>
 <section v-else class="feature-card"><h1>{{ $t('social.unavailable') }}</h1><p role="alert">{{ $t('social.errors.'+error) }}</p><router-link to="/" class="text-button">{{ $t('types.backHome') }}</router-link></section>
</main></template>
<script setup>
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import LangToggle from '../components/LangToggle.vue'
import SnapshotBody from '../components/SnapshotBody.vue'
import {decodeSnapshot,MAX_PROFILE_URL} from '../utils/profileSnapshot.js'
const route=useRoute(),payload=computed(()=>String(route.params.payload||''))
const parsed=computed(()=>{try{if(window.location.href.length>MAX_PROFILE_URL)throw {code:'tooLong'};return {snapshot:decodeSnapshot(payload.value)}}catch(e){return {error:e.code||'invalid'}}})
const snapshot=computed(()=>parsed.value.snapshot),error=computed(()=>parsed.value.error)
</script>
