<template>
  <recipe-search-form @send-ingredient="addIngredient"></recipe-search-form>
  <recipe-search-ingredients-table
    :ingredientes="listaIngredientes"
    @send-delete-ingredient="removeIngredient"
  ></recipe-search-ingredients-table>
  <q-btn label="Obtener Recetas" color="secondary" class="q-mt-md" @click="getRecipe" />
  <q-card v-if="apiResponse" class="q-mt-md">
    <q-card-section>
      <q-markdown>{{ apiResponse }}</q-markdown>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Notify } from 'quasar'
import type { Ingredient } from './RecipeSearchForm.vue'
import RecipeSearchForm from './RecipeSearchForm.vue'
import RecipeSearchIngredientsTable from './RecipeSearchIngredientsTable.vue'

const listaIngredientes = ref<Ingredient[]>([])
const apiResponse = ref<object | null>()

const addIngredient = (ingredient: Ingredient) => {
  listaIngredientes.value.push(ingredient)
}

const removeIngredient = (name: string) => {
  listaIngredientes.value = listaIngredientes.value.filter((item) => item.name !== name)
  Notify.create({ type: 'info', message: 'Ingrediente eliminado' })
}

const getRecipe = async () => {
  try {
    const url = import.meta.env.VITE_API_URL
    const endpoint = 'test/api/recipe'
    debugger
    const ingredients = listaIngredientes.value.map((item) => item.name)
    const request = { ingredients: ingredients }
    const response = await fetch(`${url}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },

      body: JSON.stringify(request),
    })
    if (!response.ok) {
      throw new Error('Error al obtener datos')
    }
    apiResponse.value = await response.json()
    console.log(apiResponse)
  } catch (error) {
    console.error(error)
  }
}
</script>
