<template>
    <div class="q-gutter-md">
      <q-card v-for="recipe in recipes" :key="recipe.name" class="q-mb-md">
        <q-img v-if="recipe.images && recipe.images.length > 0" :src="recipe.images.find(image => image.main)?.url" alt="Recipe Image" class="q-mb-md full-width" />
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
  </template>
  
  <script lang="ts" setup>
  import { defineProps } from 'vue'
  import type { Recipe } from '../../interfaces/RecipeResponse'
  
  const { recipes } = defineProps<{
  recipes: Recipe[]
}>()
  
  const viewRecipe = (name: string) => {
    console.log(`Viewing recipe with name: ${name}`)
  }
  </script>
  
<style scoped>
  .q-card {
    width: 100%;
    max-width: 100%;
  }

.q-img {
    width: 100%;
    height: auto;
    object-fit: cover;
}
</style>