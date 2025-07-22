<template>
    <div class="recipe-detail">
        <q-btn
      flat
      dense
      icon="arrow_back"
      label="Return"
      class="q-mb-md"
      @click="goBack"
    />
      <q-card v-if="recipe">
        <q-img v-if="recipe.images && recipe.images.length > 0" :src="recipe.images.find(image => image.main)?.url"
          alt="Recipe Image"
          class="q-mb-md reduced-img col clickable-img"
        />
        <!-- GENERAL INFO -->
        <q-card-section>
          <div class="text-h5">{{ recipe.name }}</div>
          <div class="text-subtitle2 q-mt-sm">Calories: {{ recipe.calories }}</div>
          <div class="text-subtitle2">Total Time: {{ recipe.totalTime }} minutes</div>
          <q-markdown class="q-mt-md">Description</q-markdown>
        </q-card-section>
        <q-card-section>
            <div class="text-h6 q-mt-md">Cuisine Types</div>
            <ul class="cuisine-types-list">
              <li v-for="(cuisine, index) in recipe.cuisinTypes" :key="index" class="cuisine-type-item">
                <span>{{ cuisine }}</span>
              </li>
              </ul>
        </q-card-section>
        <!-- INGREDIENTS -->
        <q-card-section>
        <div class="text-h6 q-mt-md">Ingredients</div>
        <ul class="ingredients-list">
          <li v-for="(ingredient, index) in recipe.ingredients" :key="index" class="ingredient-item">
            <span>{{ ingredient.text }}</span>
          </li>
        </ul>
      </q-card-section>
      <!-- DIRECTIONS -->
        <q-card-section>
        <div class="text-h6 q-mt-md">Directions</div>
        <div v-for="(direction, index) in recipe.directions" :key="index" class="direction-step q-mt-sm">
          <div class="text-subtitle2">Step {{ index + 1 }}:</div>
          <q-img
            v-if="direction.image"
            :src="direction.image"
            alt="Step Image"
            class="q-mt-sm reduced-img"
          />
          <div class="q-mt-sm">{{ direction.instructionText }}</div>
        </div>
      </q-card-section>
      </q-card>
      <q-card v-else>
        <q-card-section>
          <div class="text-h6">Loading recipe details...</div>
        </q-card-section>
      </q-card>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import type { Recipe } from '../../interfaces/RecipeResponse'
  
  const route = useRoute()
  const router = useRouter()
  const recipe = ref<Recipe | null>(null)
  
  const getRecipe = async () => {
        try {
            const recipeId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id

            const url = import.meta.env.VITE_API_URL
            const endpoint = 'api/recipe/'+recipeId+'?recipeSourceType=3'
            const token = localStorage.getItem('id_token')

            const response = await fetch(`${url}/${endpoint}`, {
            method: 'GET',
            headers: 
            {
                'Content-Type': 'application/json', 
                Accept: 'application/json',
                Authorization: `Bearer ${token}`, 
            }
            })

            if (!response.ok) {
                throw new Error('Error al obtener datos')
            }
            
            const data = await response.json()
            recipe.value = data
            console.log(recipe.value)
        } catch (error) {
            console.error(error)
        }
 }
 const goBack = () => {
  router.back()
}

  onMounted(async () => {
    await getRecipe()
  })
  </script>
  
  <style scoped>
  .recipe-detail {
    max-width: 600px;
    margin: 0 auto;
    padding: 16px;
  }
  </style>