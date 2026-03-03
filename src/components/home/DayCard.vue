<template>
  <div class="day-card" @click="$emit('click')">
    <div class="day-name">{{ day.dayName }}</div>
    <div class="day-meals">
      <div class="meal-row">
        <span class="meal-label">Breakfast</span>
        <span class="meal-value">{{ day.breakfast || '—' }}</span>
      </div>
      <div class="meal-row">
        <span class="meal-label">Lunch</span>
        <span class="meal-value">{{ day.lunch || '—' }}</span>
      </div>
      <div class="meal-row">
        <span class="meal-label">Dinner</span>
        <span class="meal-value">{{ day.dinner || '—' }}</span>
      </div>
    </div>
    <div v-if="day.hasSnacks" class="snack-indicator">
      <q-icon name="free_breakfast" size="14px" />
      <span>Snacks</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  day: {
    date: string
    dayName: string
    breakfast?: string
    lunch?: string
    dinner?: string
    hasSnacks?: boolean
  }
}>()

defineEmits<{ click: [] }>()
</script>

<style scoped>
.day-card {
  border-radius: 12px;
  padding: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  min-height: 120px;
  display: flex;
  flex-direction: column;
}

.body--dark .day-card {
  background: var(--q-dark, #1d1d1d);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.day-card:active {
  transform: scale(0.98);
}

.day-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--q-primary);
  margin-bottom: 8px;
}

.day-meals {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meal-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #666;
}

.body--dark .meal-row {
  color: #aaa;
}

.meal-label {
  flex-shrink: 0;
  margin-right: 6px;
}

.meal-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70px;
}

.snack-indicator {
  margin-top: 6px;
  font-size: 0.65rem;
  color: #888;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
