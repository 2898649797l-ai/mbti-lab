<template><DetailedResult :type="type" :percents="percents"><template #action><slot name="action" /></template></DetailedResult></template>
<script setup>
import DetailedResult from './DetailedResult.vue'
defineProps({type:String,percents:Object})
</script>
