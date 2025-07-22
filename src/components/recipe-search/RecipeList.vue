<template>
    <div>
      <div class="recipe-list">
        <q-card v-for="recipe in paginatedRecipes" :key="recipe.name" class="recipe-card q-mb-md">
            <q-card-section horizontal @click="viewRecipe(recipe)">
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
import { useRouter } from 'vue-router'
import type { Recipe } from '../../interfaces/RecipeResponse'

const router = useRouter()

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

const viewRecipe = async (recipe: Recipe) => {
  console.log('Viewing recipe:', recipe.name)
  console.log(recipe)
  try {
    await router.push({ name: 'recipe-detail', params: { id: recipe.id } })
  } catch (error) {
    console.error('Failed to navigate to recipe detail:', error)
  }
}
</script>

<style scoped>
.recipe-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
  justify-content: center;
}

.recipe-card {
  flex: 1 1 calc(33.333% - 16px);
  box-sizing: border-box;
  cursor: pointer;
  transition: transform 0.2s;
}

.recipe-card:hover {
  transform: translateY(-5px);
}

.q-card {
  width: 100%;
  max-width: 100%;
}

.reduced-img {
  width: 300px;
  height: 300px;
  object-fit: cover;
}

.clickable-img {
  cursor: pointer;
}

@media (max-width: 768px) {
  .recipe-card {
    flex: 1 1 calc(100% - 16px);
  }
}
</style>