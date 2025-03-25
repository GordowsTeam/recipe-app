<template>
    <div>
      <div class="recipe-list">
        <q-card v-for="recipe in paginatedRecipes" :key="recipe.name" class="recipe-card q-mb-md">
            <q-card-section horizontal @click="viewRecipe(recipe.name)">
                <q-img v-if="recipe.images && recipe.images.length > 0" :src="recipe.images.find(image => image.main)?.url" alt="Recipe Image" class="q-mb-md reduced-img col clickable-img" >
                    <div class="absolute-bottom">
                        <div class="text-h6">{{ recipe.name }}</div>
                    </div>
                </q-img>
                <q-card-actions vertical class="justify-around">
                    <q-btn flat round color="red" icon="favorite" />
                    <q-btn flat round color="accent" icon="bookmark" />
                    <q-btn flat round color="primary" icon="share" />
                </q-card-actions>
            </q-card-section>
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
  const itemsPerPage = 6
  
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
.recipe-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* Adjust the gap between cards as needed */
  padding: 16px;
  justify-content: center;
}

.recipe-card {
  flex: 1 1 calc(33.333% - 16px); /* Adjust the width of the cards */
  box-sizing: border-box;
}

.q-card {
  width: 100%;
  max-width: 100%;
}

.reduced-img {
  width: 300px;
  height: 300px; /* Adjust the height as needed */
  object-fit: cover;
}

.clickable-img {
  cursor: pointer; /* Change cursor to pointer on hover */
}

/* Media queries for responsiveness */
@media (max-width: 768px) {
  .recipe-card {
    flex: 1 1 calc(100% - 16px); /* 1 card per row for small screens (cellphones) */
  }
}
  </style>