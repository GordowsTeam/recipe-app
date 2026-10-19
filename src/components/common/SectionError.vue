<template>
  <q-card flat bordered class="section-error">
    <q-card-section class="row items-center no-wrap q-gutter-sm">
      <q-icon name="error_outline" color="negative" size="24px" />
      <div class="col text-body2">{{ message }}</div>
      <q-btn flat dense no-caps color="primary" label="Reintentar" @click="$emit('retry')" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
// Error de una sola sección del home: el resto de la página sigue funcionando.
interface SectionErrorProps {
  message: string
}

defineProps<SectionErrorProps>()
defineEmits<{ retry: [] }>()
</script>
