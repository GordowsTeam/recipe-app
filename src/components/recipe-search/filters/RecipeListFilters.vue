<template>
  <div class="recipe-list-filters q-mb-md">
    <div class="filters-row">
      <q-input
        v-model="nameQuery"
        outlined
        dense
        clearable
        placeholder="Filtrar por nombre"
        class="filter-input filter-name"
        @keyup.enter.prevent
      >
        <template #prepend>
          <q-icon name="search" size="20px" />
        </template>
      </q-input>

      <q-input
        v-model.number="caloriesMin"
        outlined
        dense
        type="number"
        min="0"
        placeholder="Cal mín"
        class="filter-input filter-calories"
        clearable
      >
        <template #prepend>
          <q-icon name="whatshot" size="18px" />
        </template>
      </q-input>
      <span class="filter-sep">–</span>
      <q-input
        v-model.number="caloriesMax"
        outlined
        dense
        type="number"
        min="0"
        placeholder="Cal máx"
        class="filter-input filter-calories"
        clearable
      />

      <q-input
        v-model.number="timeMin"
        outlined
        dense
        type="number"
        min="0"
        placeholder="Min mín"
        class="filter-input filter-time"
        clearable
      >
        <template #prepend>
          <q-icon name="schedule" size="18px" />
        </template>
      </q-input>
      <span class="filter-sep">–</span>
      <q-input
        v-model.number="timeMax"
        outlined
        dense
        type="number"
        min="0"
        placeholder="Min máx"
        class="filter-input filter-time"
        clearable
      />

      <q-btn
        v-if="hasActiveFilters"
        flat
        dense
        label="Limpiar"
        icon="clear"
        color="grey"
        no-caps
        @click="clearFilters"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRecipeListFilters } from './useRecipeListFilters'

const {
  nameQuery,
  caloriesMin,
  caloriesMax,
  timeMin,
  timeMax,
  hasActiveFilters,
  clearFilters
} = useRecipeListFilters()
</script>

<style scoped>
.recipe-list-filters {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  padding: 12px 16px;
}

.filters-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.filter-input {
  min-width: 0;
}

.filter-name {
  flex: 1 1 200px;
  max-width: 240px;
}

.filter-calories,
.filter-time {
  width: 100px;
}

.filter-sep {
  color: #999;
  font-size: 14px;
}

@media (max-width: 600px) {
  .filter-name {
    flex: 1 1 100%;
    max-width: none;
  }
}
</style>
