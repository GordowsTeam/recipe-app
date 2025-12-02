<template>
  <div class="search-wrapper">

    <!-- Selección de modo -->
    <div class="mode-select">
      <q-select
        v-model="mode"
        :options="modeOptions"
        dense
        filled
        emit-value
        map-options
        class="mode-dropdown"
      />
    </div>

    <!-- ÚNICA BARRA DE BÚSQUEDA -->
    <div class="search-bar">

      <q-input
        dense
        filled
        v-model="text"
        :placeholder="mode === 'recipe' ? 'Buscar receta…' : 'Agregar ingrediente…'"
        class="search-input"
        input-class="text-black"
        @keyup.enter="handleAction"
      />

      <!-- Ícono dinámico -->
      <q-btn
        round
        unelevated
        color="primary"
        :icon="mode === 'recipe' ? 'search' : 'add'"
        @click="handleAction"
      />
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Notify } from 'quasar'

export interface Ingredient {
  name: string
  quantity: number
  unit: string
}

const emits = defineEmits<{
  search: [{ mode: string; keyword: string }]
  sendIngredient: [ingredient: Ingredient]
}>()

/* Estado */
const mode = ref<'ingredient' | 'recipe'>('ingredient')
const text = ref('')

const modeOptions = [
  { label: 'Por Ingrediente', value: 'ingredient' },
  { label: 'Por Receta', value: 'recipe' }
]

/* Acción dinámica según el modo */
const handleAction = () => {
  const value = text.value.trim()

  if (!value) {
    Notify.create({
      type: 'negative',
      message: mode.value === 'recipe'
        ? 'Escribe algo para buscar recetas.'
        : 'Escribe un ingrediente para agregar.',
    })
    return
  }

  if (mode.value === 'recipe') {
    emits('search', { mode: 'recipe', keyword: value })
  } else {
    emits('sendIngredient', {
      name: value,
      quantity: 0,
      unit: '',
    })
  }

  text.value = ''
}
</script>

<style scoped>
.search-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
}

/* Dropdown superior */
.mode-select {
  width: 200px;
}

.mode-dropdown {
  width: 100%;
}

/* Barra unificada */
.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 500px;
}

.search-input {
  flex: 1;
}
</style>
