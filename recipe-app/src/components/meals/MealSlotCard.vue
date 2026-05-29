<template>
  <q-card flat :class="cardClass">
    <!-- empty -->
    <template v-if="status === 'empty'">
      <q-card-section class="column items-center q-py-lg text-center">
        <q-icon :name="icon" size="32px" color="grey-5" />
        <div class="text-subtitle2 text-grey-6 q-mt-xs">{{ label }}</div>
        <q-btn flat round icon="add" color="primary" size="sm" class="q-mt-sm" />
      </q-card-section>
    </template>

    <!-- planned -->
    <template v-else-if="status === 'planned'">
      <q-card-section>
        <div class="row items-center justify-between q-mb-xs">
          <span class="text-caption text-grey-6">{{ label }}</span>
          <q-badge v-if="recipe?.readyLabel" color="positive" :label="recipe.readyLabel" />
        </div>
        <div class="text-subtitle1 text-weight-medium">{{ recipe?.name }}</div>
        <div v-if="members?.length" class="q-mt-sm row q-gutter-xs">
          <q-chip
            v-for="m in members"
            :key="m.initial"
            dense
            :color="m.color"
            text-color="white"
            size="sm"
          >
            {{ m.initial }} · {{ m.name }} · {{ m.steps }} paso{{ m.steps !== 1 ? 's' : '' }}
          </q-chip>
        </div>
      </q-card-section>
    </template>

    <!-- rescue -->
    <template v-else-if="status === 'rescue'">
      <q-card-section>
        <div class="row items-center q-gutter-xs q-mb-xs">
          <q-icon name="warning" color="warning" size="16px" />
          <span class="text-caption text-warning text-weight-medium">{{ label }}</span>
        </div>
        <div class="text-body2 text-grey-8">{{ rescueMessage }}</div>
        <q-btn flat dense color="warning" no-caps label="Ver sugerencias" class="q-mt-sm q-pl-none" />
      </q-card-section>
    </template>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert'
type MealStatus = 'empty' | 'planned' | 'rescue'

interface MealMember {
  initial: string
  name: string
  steps: number
  color: 'info' | 'warning' | 'success'
}

interface RecipeInfo {
  name: string
  readyAt?: string
  readyLabel?: string
}

const props = defineProps<{
  type: MealType
  status: MealStatus
  recipe?: RecipeInfo
  members?: MealMember[]
  rescueMessage?: string
}>()

const typeLabel: Record<MealType, string> = {
  breakfast: 'Desayuno',
  lunch: 'Comida',
  dinner: 'Cena',
  snack: 'Colación',
  dessert: 'Postre'
}

const typeIcon: Record<MealType, string> = {
  breakfast: 'free_breakfast',
  lunch: 'restaurant',
  dinner: 'dinner_dining',
  snack: 'local_cafe',
  dessert: 'cake'
}

const label = computed(() => typeLabel[props.type])
const icon = computed(() => typeIcon[props.type])
const cardClass = computed(() => ({
  'meal-slot-empty': props.status === 'empty',
  'meal-slot-planned': props.status === 'planned',
  'meal-slot-rescue': props.status === 'rescue'
}))
</script>

<style scoped>
.meal-slot-empty {
  border: 1px dashed rgba(0, 0, 0, 0.24);
  border-radius: 8px;
  min-height: 120px;
}
.meal-slot-planned {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  background: #fafafa;
}
.meal-slot-rescue {
  border: 1px dashed var(--q-warning);
  border-radius: 8px;
  background: rgba(255, 152, 0, 0.08);
}
</style>
