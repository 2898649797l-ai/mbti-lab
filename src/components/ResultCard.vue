<template><DetailedResult ref="reader" :type="type" :percents="percents"><template #action><slot name="action" /></template></DetailedResult></template>
<script setup>
import {ref} from 'vue'
const reader=ref(null)
defineExpose({contents:()=>reader.value?.contents()})
import DetailedResult from './DetailedResult.vue'
defineProps({type:String,percents:Object})
</script>
