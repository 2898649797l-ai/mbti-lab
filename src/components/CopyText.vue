<template><div class="copy-control"><button class="secondary-button" @click="copy">{{ copied?$t('share.copied'):label }}</button><p v-if="failed" role="status" class="notice">{{ $t('share.copyFailed') }}</p><textarea v-if="failed" ref="fallback" readonly :value="value" :aria-label="$t('share.textLabel')" class="feature-input" /></div></template>
<script setup>
import {ref,nextTick,watch} from 'vue'
const props=defineProps({value:{type:String,required:true},label:{type:String,required:true}})
const copied=ref(false),failed=ref(false),fallback=ref(null)
watch(()=>props.value,()=>{copied.value=false;failed.value=false})
async function copy(){copied.value=false;failed.value=false;try{if(!navigator.clipboard?.writeText)throw new Error('unavailable');await navigator.clipboard.writeText(props.value);copied.value=true}catch{failed.value=true;await nextTick();fallback.value?.focus();fallback.value?.select()}}
</script>
