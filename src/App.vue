<template>
  <RouterView />
  <footer class="site-footer">
    <p>{{ $t('app.privacy') }}</p>
    <p>{{ $t('app.disclaimer') }}</p>
    <a href="https://github.com/OctopusGarage/mbti-lab" target="_blank" rel="noopener noreferrer">{{ $t('app.credit') }}</a>
  </footer>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --cream: #fef9ec;
  --cream-border: #f0e0c0;
  --gold: #c09060;
  --ink: #3a2a1a;
  --ink-light: #8a6a4a;
  --blue: #2d3a8c;
  --blue-mid: #5c6bc0;
  --blue-light: #e0e4f5;
  --white: #ffffff;
  --bg: #f5f6fa;
  --radius: 16px;
  --shadow: 0 4px 24px rgba(0,0,0,0.08);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--ink);
  min-height: 100dvh;
}

.site-footer {
  padding: 20px 24px;
  text-align: center;
  font-size: 12px;
  line-height: 1.8;
  color: var(--ink-light);
}
.site-footer a { color: var(--blue-mid); }
</style>
