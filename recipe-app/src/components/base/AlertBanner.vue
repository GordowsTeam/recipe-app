<template>
  <q-card flat :class="cardClass">
    <q-card-section>
      <div class="row items-start q-gutter-sm no-wrap">
        <q-icon :name="iconName" :color="iconColor" size="20px" class="q-mt-xs" />
        <div class="col">
          <div class="text-body2 text-weight-medium">{{ title }}</div>
          <div class="text-caption text-grey-7 q-mt-xs">{{ subtitle }}</div>
          <q-linear-progress
            v-if="type === 'info' && progress !== undefined"
            :value="progress / 100"
            color="info"
            rounded
            class="q-mt-sm"
            style="height: 6px"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type: 'warning' | 'info'
  title: string
  subtitle: string
  progress?: number
}>()

const iconName = computed(() => props.type === 'warning' ? 'warning' : 'info')
const iconColor = computed(() => props.type === 'warning' ? 'warning' : 'info')
const cardClass = computed(() => props.type === 'warning' ? 'alert-warning' : 'alert-info')
</script>

<style scoped>
.alert-warning {
  border: 1px solid rgba(255, 152, 0, 0.4);
  border-radius: 8px;
  background: rgba(255, 152, 0, 0.08);
}
.alert-info {
  border: 1px solid rgba(33, 150, 243, 0.3);
  border-radius: 8px;
  background: rgba(33, 150, 243, 0.06);
}
</style>
