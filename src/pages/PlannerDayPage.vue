<template>
  <q-page class="planner-day-page">
    <div class="planner-day-inner">
      <h1 class="page-title">Día del planificador</h1>
      <p class="page-subtitle">{{ dateParam }}</p>
      <p class="placeholder-text">Vista detallada del día (próximamente).</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const dateParam = computed(() => route.params.date as string || '')
</script>

<style scoped>
.planner-day-page {
  background: #f8f8f8;
  min-height: 100%;
}

.body--dark .planner-day-page {
  background: var(--q-dark-page, #121212);
}

.planner-day-inner {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px;
}

.page-title {
  font-size: 1.35rem;
  font-weight: 600;
  margin: 0 0 8px;
  color: #333;
}

.body--dark .page-title {
  color: #eee;
}

.page-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 16px;
}

.placeholder-text {
  font-size: 0.875rem;
  color: #888;
}
</style>
