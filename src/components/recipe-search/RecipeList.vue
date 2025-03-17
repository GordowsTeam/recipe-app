<template>
    <div>
      <div class="q-gutter-md">
        <q-card v-for="recipe in paginatedRecipes" :key="recipe.name" class="q-mb-md">
            <q-img v-if="recipe.images && recipe.images.length > 0" :src="recipe.images.find(image => image.main)?.url" alt="Recipe Image" class="q-mb-md reduced-img" >
            <div class="absolute-bottom">
          <div class="text-h6">{{ recipe.name }}</div>
        </div>
        </q-img>
        <q-card-section>
            <div class="text-h6">{{ recipe.name }}</div>
            <div>{{ recipe.calories }} calories</div>
            <div>Total Time: {{ recipe.totalTime }} minutes</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="View" @click="viewRecipe(recipe.name)" />
          </q-card-actions>
        </q-card>
      </div>
      <q-pagination v-model="currentPage" :max="totalPages" boundary-numbers class="q-mt-md"/>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { defineProps } from 'vue'
  import type { Recipe } from '../../interfaces/RecipeResponse'
  
  const props = defineProps<{
    recipes: Recipe[]
  }>()
  
  const currentPage = ref(1)
  const itemsPerPage = 5
  
  const totalPages = computed(() => Math.ceil(props.recipes.length / itemsPerPage))
  
  const paginatedRecipes = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return props.recipes.slice(start, end)
  })
  
  const viewRecipe = (name: string) => {
    console.log(`Viewing recipe with name: ${name}`)
  }
  </script>
  
  <style scoped>
.q-card {
  width: 100%;
  max-width: 100%;
}

.reduced-img {
  width: 100%;
  height: 400px; /* Adjust the height as needed */
  object-fit: cover;
}
  </style>