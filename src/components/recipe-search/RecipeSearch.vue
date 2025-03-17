<template>
  <recipe-search-form @send-ingredient="addIngredient"></recipe-search-form>
  <recipe-search-ingredients-table
    :ingredientes="listaIngredientes"
    @send-delete-ingredient="removeIngredient"
  ></recipe-search-ingredients-table>
  <q-btn label="Obtener Recetas" color="secondary" class="q-mt-md" @click="getRecipe" />
  <recipe-list v-if="recipes.length" :recipes="recipes"></recipe-list>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Notify } from 'quasar'
import type { Ingredient } from './RecipeSearchForm.vue'
import RecipeSearchForm from './RecipeSearchForm.vue'
import RecipeSearchIngredientsTable from './RecipeSearchIngredientsTable.vue'
import type { Recipe } from '../../interfaces/RecipeResponse'
import RecipeList from './RecipeList.vue'

const listaIngredientes = ref<Ingredient[]>([])
const apiResponse = ref<object | null>()
const recipes = ref<Recipe[]>([])

const addIngredient = (ingredient: Ingredient) => {
  listaIngredientes.value.push(ingredient)
  console.log(listaIngredientes.value.map((item) => item.name))
}

const removeIngredient = (name: string) => {
  listaIngredientes.value = listaIngredientes.value.filter((item) => item.name !== name)
  Notify.create({ type: 'info', message: 'Ingrediente eliminado' })
}

const getRecipe = async () => {
  try {
    const url = 'https://localhost:56548'
    const endpoint = 'api/recipe'
    const request = { ingredients: listaIngredientes.value.map((item) => item.name) }
    const response = await fetch(`${url}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },

      body: JSON.stringify(request),
    })
    if (!response.ok) {
      throw new Error('Error al obtener datos')
    }
    const data = await response.json()
    apiResponse.value = data
    recipes.value = data || [] // Assuming the API returns a 'recipes' field
    
    console.log(apiResponse)
  } catch (error) {
    console.error(error)
  }
}
</script>
