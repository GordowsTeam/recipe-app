<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="text-center">
      <q-icon name="construction" size="64px" color="primary" class="q-mb-md" />
      <div class="text-h5 q-mb-sm">{{ title }}</div>
      <div class="text-body2 text-grey-7 q-mb-lg">{{ message }}</div>
      <q-btn
        unelevated
        color="primary"
        :to="{ name: 'home' }"
        label="Volver al inicio"
        no-caps
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

function metaString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback
}

const title = computed<string>(() => metaString(route.meta?.title, 'Próximamente'))
const message = computed<string>(() => metaString(route.meta?.message, 'Esta sección aún no está disponible.'))
</script>
