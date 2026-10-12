<template><section class="feature-card poster-exporter">
 <h2>{{ $t('social.cardPreview') }}</h2><p class="feature-muted">{{ $t('social.beforeExport') }}</p>
 <div class="export-preview"><strong>{{ model.title }}</strong><p>{{ model.subtitle }}</p><p v-for="line in model.lines" :key="line">{{ line }}</p></div>
 <label class="feature-label">{{ $t('social.qrTarget') }}<select v-model="target" class="feature-input" :disabled="busy"><option value="home">{{ $t('social.homeQr') }}</option><option v-if="snapshotUrl" value="profile">{{ $t('social.profileQr') }}</option></select></label>
 <details><summary>{{ $t('social.actualTarget') }}</summary><p class="target-url">{{ qrTarget }}</p></details>
 <p v-if="target==='profile'" class="feature-muted">{{ $t('social.privacyWarning') }}</p>
 <button class="primary-button" :disabled="busy" @click="save">{{ $t(busy?'share.generating':'social.generateCard') }}</button>
 <p v-if="failed" role="alert" class="notice">{{ $t('share.exportError') }}</p>
 <div v-if="image" class="generated-preview"><img :src="image" :alt="model.title"/><p class="feature-muted">{{ $t('share.saveHint') }}</p><a class="secondary-button" :href="image" :download="'personality-'+model.kind+'.png'">{{ $t('share.saveImage') }}</a></div>
 <SocialPoster ref="poster" :model="model" :url="qrTarget" />
</section></template>
<script setup>
import {ref,computed,watch} from 'vue'
import {APP_URL} from '../config.js'
import SocialPoster from './SocialPoster.vue'
const props=defineProps({model:{type:Object,required:true},snapshotUrl:{type:String,default:''}})
const target=ref('home'),busy=ref(false),image=ref(''),failed=ref(false),poster=ref(null)
const qrTarget=computed(()=>target.value==='profile'&&props.snapshotUrl?props.snapshotUrl:APP_URL)
let revision=0
watch([()=>props.model,()=>props.snapshotUrl,target],()=>{revision++;image.value='';failed.value=false;if(!props.snapshotUrl)target.value='home'},{deep:true})
async function save(){if(busy.value)return;busy.value=true;failed.value=false;const rev=revision;try{const output=await poster.value.capture();if(rev===revision)image.value=output}catch{failed.value=true}finally{busy.value=false}}
</script>
<style scoped>
.export-preview{padding:18px;background:var(--blue-light);border-radius:18px;display:grid;gap:10px;margin:16px 0}.export-preview strong{font-size:22px}.target-url{font-size:12px;overflow-wrap:anywhere;padding:12px 0}.generated-preview{display:grid;gap:14px;margin-top:16px}.generated-preview img{width:100%;height:auto;border-radius:16px}.poster-exporter>button{margin-top:16px}summary{min-height:44px;cursor:pointer;padding:10px 0;color:var(--blue)}
</style>
