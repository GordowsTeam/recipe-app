<template>
  <recipe-search-form @send-ingredient="addIngredient"></recipe-search-form>
  <recipe-search-ingredients-table
    :ingredientes="listaIngredientes"
    @send-delete-ingredient="removeIngredient"
  ></recipe-search-ingredients-table>
  <q-btn label="Obtener Recetas" color="secondary" class="q-mt-md" @click="getRecipe" :disabled="isButtonDisabled" />
  <q-spinner v-if="loading" size="50px" color="primary" class="q-mt-md" />
  <recipe-list v-if="recipes.length" :recipes="recipes"></recipe-list>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Notify, QSpinner } from 'quasar'
import type { Ingredient } from './RecipeSearchForm.vue'
import RecipeSearchForm from './RecipeSearchForm.vue'
import RecipeSearchIngredientsTable from './RecipeSearchIngredientsTable.vue'
import type { Recipe } from '../../interfaces/RecipeResponse'
import RecipeList from './RecipeList.vue'

const listaIngredientes = ref<Ingredient[]>([])
const apiResponse = ref<object | null>()
const recipes = ref<Recipe[]>([])
const loading = ref(false)
const isButtonDisabled = computed(() => listaIngredientes.value.length === 0)

const addIngredient = (ingredient: Ingredient) => {
  listaIngredientes.value.push(ingredient)
  console.log(listaIngredientes.value.map((item) => item.name))
}

const removeIngredient = (name: string) => {
  listaIngredientes.value = listaIngredientes.value.filter((item) => item.name !== name)
  Notify.create({ type: 'info', message: 'Ingrediente eliminado' })
}

const getRecipe = async () => {
  loading.value = true
  try {
    const url = import.meta.env.VITE_API_URL
    const endpoint = 'api/recipe'
    debugger
    const ingredients = listaIngredientes.value.map((item) => item.name)
    const request = { ingredients: ingredients }
    const token = localStorage.getItem('id_token')

    const response = await fetch(`${url}/${endpoint}`, {
      method: 'POST',
      headers: 
      {
         'Content-Type': 'application/json', 
         Accept: 'application/json',
         Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error('Error al obtener datos')
    }
    
    const data = await response.json()
    apiResponse.value = data
    recipes.value = data || []
    console.log(apiResponse)
  } catch (error) {
    console.error(error)
  }
  loading.value = false
}
</script>
