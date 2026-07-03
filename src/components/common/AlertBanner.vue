<template>
  <q-card flat bordered class="alert-banner" :class="`alert-banner--${type}`">
    <q-card-section class="row items-center no-wrap q-gutter-sm">
      <q-icon :name="icon" size="24px" :color="iconColor" />
      <div class="col">
        <div class="text-body2 text-weight-medium">{{ title }}</div>
        <div class="text-caption text-grey-7">{{ subtitle }}</div>
        <q-linear-progress
          v-if="type === 'info' && progress !== undefined"
          :value="progress / 100"
          color="info"
          class="q-mt-sm"
          rounded
          size="6px"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface AlertBannerProps {
  type: 'warning' | 'info'
  title: string
  subtitle: string
  progress?: number | undefined
}

const props = defineProps<AlertBannerProps>()

const icon = computed(() => (props.type === 'warning' ? 'warning' : 'schedule'))
const iconColor = computed(() => (props.type === 'warning' ? 'warning' : 'info'))
</script>

<style scoped>
.alert-banner--warning {
  border-color: var(--q-warning);
  background: rgba(242, 192, 55, 0.08);
}

.alert-banner--info {
  border-color: var(--q-info);
  background: rgba(49, 204, 236, 0.08);
}
</style>
