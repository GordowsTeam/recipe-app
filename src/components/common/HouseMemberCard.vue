<template>
  <q-card flat bordered class="house-member">
    <q-card-section class="row items-center no-wrap q-gutter-sm">
      <q-avatar :color="color" text-color="white" size="36px">
        {{ initial }}
      </q-avatar>
      <div class="col">
        <div class="row items-center q-gutter-xs">
          <span class="text-body2 text-weight-medium">{{ name }}</span>
          <q-badge v-if="isCurrentUser" color="grey-5" rounded>Tú</q-badge>
          <q-badge v-if="role === 'owner'" color="grey-5" outline>Owner</q-badge>
        </div>
        <div v-if="task" class="row items-center q-gutter-xs text-caption text-grey-7">
          <q-icon :name="statusIcon" size="14px" :color="statusIconColor" />
          <span>{{ task }}</span>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface HouseMemberCardProps {
  name: string
  initial: string
  role: 'owner' | 'member' | 'guest'
  isCurrentUser: boolean
  task?: string | undefined
  taskStatus?: 'active' | 'pending' | 'done' | undefined
  color: 'info' | 'warning' | 'success'
}

const props = defineProps<HouseMemberCardProps>()

const STATUS_ICON: Record<NonNullable<HouseMemberCardProps['taskStatus']>, string> = {
  active: 'play_circle',
  pending: 'schedule',
  done: 'check_circle',
}

const statusIcon = computed(() => STATUS_ICON[props.taskStatus ?? 'pending'])
const statusIconColor = computed(() => {
  if (props.taskStatus === 'done') return 'positive'
  if (props.taskStatus === 'active') return 'info'
  return 'grey-6'
})
</script>
