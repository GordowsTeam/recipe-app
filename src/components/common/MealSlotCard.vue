<template>
  <q-card
    flat
    bordered
    class="meal-slot"
    :class="[`meal-slot--${status}`]"
  >
    <q-card-section class="row items-center no-wrap q-pb-none">
      <q-icon :name="typeIcon" size="20px" class="q-mr-sm" :class="iconClass" />
      <div class="text-subtitle2 text-weight-medium">{{ typeLabel }}</div>
      <q-space />
      <q-badge v-if="status === 'planned'" :color="badgeColor" rounded>
        {{ badgeLabel }}
      </q-badge>
    </q-card-section>

    <q-card-section class="q-pt-sm">
      <!-- EMPTY -->
      <div v-if="status === 'empty'" class="column items-center q-py-md">
        <div class="text-body2 text-grey-6 q-mb-sm">Sin planear</div>
        <q-btn
          round
          outline
          color="grey-6"
          icon="add"
          size="sm"
          @click="$emit('add', type)"
        />
      </div>

      <!-- PLANNED -->
      <div v-else-if="status === 'planned' && recipe">
        <div class="text-body1 text-weight-medium">{{ recipe.name }}</div>
        <div v-if="recipe.readyLabel" class="text-caption text-grey-7 q-mt-xs">
          {{ recipe.readyLabel }}
        </div>
        <div v-if="members?.length" class="row q-gutter-xs q-mt-sm">
          <q-chip
            v-for="member in members"
            :key="member.initial"
            dense
            :color="member.color"
            text-color="white"
            class="q-pl-xs"
          >
            <q-avatar :color="member.color" text-color="white" size="20px">
              {{ member.initial }}
            </q-avatar>
            {{ member.name }} · {{ member.steps }} {{ member.steps === 1 ? 'paso' : 'pasos' }}
          </q-chip>
        </div>
      </div>

      <!-- RESCUE -->
      <div v-else-if="status === 'rescue'">
        <div class="text-body2 q-mb-sm">{{ rescueMessage }}</div>
        <q-btn
          outline
          no-caps
          dense
          color="warning"
          label="Ver sugerencias"
          @click="$emit('view-suggestions', type)"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert'
export type MealSlotStatus = 'empty' | 'planned' | 'rescue'

interface MealSlotMember {
  initial: string
  name: string
  steps: number
  color: 'info' | 'warning' | 'success'
}

interface MealSlotRecipe {
  name: string
  readyAt?: string
  readyLabel?: string
}

interface MealSlotCardProps {
  type: MealType
  status: MealSlotStatus
  recipe?: MealSlotRecipe | undefined
  members?: MealSlotMember[] | undefined
  rescueMessage?: string | undefined
}

const props = defineProps<MealSlotCardProps>()

defineEmits<{
  add: [type: MealType]
  'view-suggestions': [type: MealType]
}>()

const TYPE_META: Record<MealType, { label: string; icon: string }> = {
  breakfast: { label: 'Desayuno', icon: 'free_breakfast' },
  lunch: { label: 'Comida', icon: 'restaurant' },
  dinner: { label: 'Cena', icon: 'dinner_dining' },
  snack: { label: 'Colación', icon: 'fastfood' },
  dessert: { label: 'Postre', icon: 'icecream' },
}

const typeLabel = computed(() => TYPE_META[props.type].label)
const typeIcon = computed(() => TYPE_META[props.type].icon)
const iconClass = computed(() => (props.status === 'empty' ? 'text-grey-5' : 'text-grey-8'))

const allReady = computed(() => {
  if (!props.members?.length) return true
  return props.members.every((m) => m.color !== 'warning')
})
const badgeColor = computed(() => (allReady.value ? 'positive' : 'warning'))
const badgeLabel = computed(() => (allReady.value ? 'Listo' : 'Pendiente'))
</script>

<style scoped>
.meal-slot {
  min-height: 140px;
}

.meal-slot--empty {
  border-style: dashed;
  border-color: #bdbdbd;
  background: transparent;
}

.meal-slot--planned {
  border-style: solid;
  border-color: #e0e0e0;
}

.meal-slot--rescue {
  border-style: dashed;
  border-color: var(--q-warning);
  background: rgba(242, 192, 55, 0.08);
}
</style>
