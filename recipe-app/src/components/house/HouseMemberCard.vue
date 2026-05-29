<template>
  <q-card flat bordered class="house-member-card">
    <q-card-section class="row items-center q-gutter-md no-wrap">
      <q-avatar :color="color" text-color="white" size="40px">{{ initial }}</q-avatar>
      <div class="col">
        <div class="row items-center q-gutter-xs">
          <span class="text-subtitle2">{{ name }}</span>
          <q-badge v-if="isCurrentUser" color="grey-3" text-color="grey-7" label="Tú" dense />
        </div>
        <div class="text-caption text-grey-7">{{ task }}</div>
      </div>
      <q-icon :name="statusIcon" :color="statusColor" size="20px" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  initial: string
  role: 'owner' | 'member' | 'guest'
  isCurrentUser: boolean
  task: string
  taskStatus: string
  color: string
}>()

const statusIcon = computed(() => {
  if (props.taskStatus === 'active') return 'play_circle'
  if (props.taskStatus === 'done') return 'check_circle'
  return 'schedule'
})

const statusColor = computed(() => {
  if (props.taskStatus === 'active') return 'positive'
  if (props.taskStatus === 'done') return 'positive'
  return 'grey-5'
})
</script>

<style scoped>
.house-member-card {
  border-radius: 8px;
}
</style>
