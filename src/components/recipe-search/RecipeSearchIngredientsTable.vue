<template>
  <!-- Tabla de ingredientes -->
  <div class="ingredients-chips">
    <q-chip
      v-for="(ingredient, index) in ingredientes"
      :key="index"
      removable
      color="grey-2"
      text-color="black"
      class="q-ma-xs"
      @remove="sendDeleteIngredient(ingredient.name)"
    >
      {{ ingredient.name }}
    </q-chip>
    </div>
</template>

<script lang="ts" setup>
import type { Ingredient } from './RecipeSearchForm.vue'

// Definir columnas de la tabla
defineProps<{ ingredientes: Ingredient[] }>()
const emit = defineEmits(['send-delete-ingredient'])

// Función para eliminar ingredientes
const sendDeleteIngredient = (ingredientName: string) => {
  emit('send-delete-ingredient', ingredientName)
}
</script>
