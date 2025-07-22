<template>
    <div class="recipe-detail">
      <q-card v-if="recipe">
        <q-img
          v-if="recipe.images && recipe.images.length > 0"
          :src="recipe.images.find(image => image.main)?.url"
          alt="Recipe Image"
          class="q-mb-md reduced-img col clickable-img"
        >
          <div class="absolute-bottom">
            <div class="text-h6">{{ recipe.name }}</div>
          </div>
        </q-img>
        <q-card-section>
          <div class="text-h5">{{ recipe.name }}</div>
          <div class="text-subtitle2 q-mt-sm">Calories: {{ recipe.calories }}</div>
          <div class="text-subtitle2">Total Time: {{ recipe.totalTime }} minutes</div>
          <q-markdown class="q-mt-md">Description</q-markdown>
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
  import { useRoute } from 'vue-router'
  import type { Recipe } from '../../interfaces/RecipeResponse'
  
  const route = useRoute()
  const recipe = ref<Recipe | null>(null)
  
  // Fetch the recipe details based on the route parameter
  const fetchRecipe = () => {
    const recipeId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
    if (!recipeId) {
      console.error('Recipe ID is undefined')
      return
    }
    console.log(`Fetching recipe details for ID: ${recipeId}`)
    // Replace this with an actual API call to fetch recipe details
    recipe.value ={
  id: "1",
  name: "Spaghetti Bolognese",
  images: [
    { url: "https://via.placeholder.com/300", main: true },
    { url: "https://via.placeholder.com/300/secondary", main: false },
  ],
  ingredients: [
    {
      text: "200g spaghetti",
      quantity: 200,
      measure: "g",
      weight: 200,
      food: "spaghetti",
      foodCategory: 1,
      foodCategoryId: "1",
      image: "https://via.placeholder.com/100/spaghetti",
    },
    {
      text: "100g minced beef",
      quantity: 100,
      measure: "g",
      weight: 100,
      food: "minced beef",
      foodCategory: 2,
      foodCategoryId: "2",
      image: "https://via.placeholder.com/100/beef",
    },
    {
      text: "50g tomato sauce",
      quantity: 50,
      measure: "g",
      weight: 50,
      food: "tomato sauce",
      foodCategory: 3,
      foodCategoryId: "3",
      image: "https://via.placeholder.com/100/tomato",
    },
  ],
  missingIngredients: ["Parmesan cheese"],
  calories: 450,
  totalTime: 30,
  cuisinTypes: ["Italian"],
  mealTypes: ["Lunch", "Dinner"],
  directions: [
    {
      step: "1",
      image: "https://via.placeholder.com/100/step1",
      instructionText: "Boil the spaghetti in salted water for 10 minutes.",
    },
    {
      step: "2",
      image: "https://via.placeholder.com/100/step2",
      instructionText: "Cook the minced beef in a pan until browned.",
    },
    {
      step: "3",
      image: "https://via.placeholder.com/100/step3",
      instructionText: "Add the tomato sauce to the beef and simmer for 10 minutes.",
    },
    {
      step: "4",
      image: "https://via.placeholder.com/100/step4",
      instructionText: "Serve the sauce over the spaghetti and enjoy!",
    },
  ],
};
  }
  
  // Call fetchRecipe inside onMounted and await it
  onMounted(() => {
    fetchRecipe()
  })
  </script>
  
  <style scoped>
  .recipe-detail {
    max-width: 600px;
    margin: 0 auto;
    padding: 16px;
  }
  </style>