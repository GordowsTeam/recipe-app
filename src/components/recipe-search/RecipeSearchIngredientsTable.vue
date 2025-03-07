<template>
  <!-- Tabla de ingredientes -->
  <q-table class="q-mt-md" :rows="ingredientes" :columns="columnas" row-key="name" dense>
    <template v-slot:body-cell-acciones="props">
      <q-td>
        <q-btn
          flat
          dense
          icon="delete"
          color="red"
          @click="sendDeleteIngredient(props.row.ingrediente)"
        >
          <q-tooltip>Eliminar</q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts" setup>
import type { Ingredient } from './RecipeSearchForm.vue'

interface columns {
  name: string
  label: string
  align?: 'left' | 'center' | 'right'
  field: string
}
// Definir columnas de la tabla
const columnas: columns[] = [
  { name: 'ingrediente', label: 'Ingrediente', align: 'left', field: 'name' },
  { name: 'cantidad', label: 'Cantidad', align: 'center', field: 'quantity' },
  { name: 'unidad', label: 'Unidad', align: 'center', field: 'unit' },
  { name: 'acciones', label: 'Acciones', align: 'center', field: 'acciones' },
]

defineProps<{ ingredientes: Ingredient[] }>()
const emit = defineEmits(['send-delete-ingredient'])
// Función para eliminar ingredientes
const sendDeleteIngredient = (ingredient: Ingredient) => {
  emit('send-delete-ingredient', ingredient.name)
}
</script>
