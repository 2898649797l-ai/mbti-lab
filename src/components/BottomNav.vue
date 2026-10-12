<template>
  <nav class="bottom-nav" :aria-label="$t('ux.navigation')">
    <router-link to="/" :aria-current="route.path === '/' ? 'page' : undefined">{{ $t('ux.test') }}</router-link>
    <router-link to="/explore" :aria-current="exploring ? 'page' : undefined">{{ $t('ux.explore') }}</router-link>
    <router-link to="/me" :aria-current="route.path === '/me' ? 'page' : undefined">{{ $t('ux.results') }}</router-link>
  </nav>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const exploring = computed(() => ['/explore', '/types', '/compare', '/profile'].includes(route.path))
</script>
