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

    <q-spinner v-if="loading" size="48px" color="primary" class="q-mt-lg fixed-center" />
    <q-banner v-else-if="error" class="bg-negative text-white q-mb-md rounded-borders">
      <template #avatar>
        <q-icon name="error" />
      </template>
      {{ error }}
      <template #action>
        <q-btn flat dense label="Retry" @click="loadRecipe" />
      </template>
    </q-banner>

    <q-card v-else-if="recipe">
      <q-img
        v-if="recipe.images?.length"
        :src="recipe.images.find((img) => img.main)?.url"
        alt="Recipe"
        class="recipe-detail-img q-mb-md"
        ratio="16/9"
      />
      <q-card-section>
        <div class="row items-center justify-between q-mb-sm">
          <div class="text-h5">{{ recipe.name }}</div>
          <div class="row q-gutter-xs">
            <q-btn
              flat
              round
              :color="recipe.isFavorite ? 'red' : 'grey'"
              :icon="recipe.isFavorite ? 'favorite' : 'favorite_border'"
              @click="toggleFavorite(recipe)"
            />
            <q-btn
              flat
              round
              :color="recipe.isSaved ? 'accent' : 'grey'"
              :icon="recipe.isSaved ? 'bookmark' : 'bookmark_border'"
              @click="toggleSaved(recipe)"
            />
            <q-btn flat round color="primary" icon="share" @click="shareRecipe" />
            <q-btn
              flat
              round
              :color="inMyRecipes ? 'positive' : 'grey'"
              :icon="inMyRecipes ? 'bookmark' : 'bookmark_add'"
              :loading="addingToMyRecipes"
              @click="toggleMyRecipe"
            />
          </div>
        </div>
        <div class="text-subtitle2 text-grey-7">Calories: {{ recipe.calories }} · {{ recipe.totalTime }} min</div>
        <p v-if="recipe.description" class="q-mt-md recipe-description">{{ recipe.description }}</p>
      </q-card-section>
      <q-card-section v-if="recipe.cuisinTypes?.length">
        <div class="text-h6 q-mb-sm">Cuisine Types</div>
        <ul class="cuisine-types-list">
          <li v-for="(cuisine, idx) in recipe.cuisinTypes" :key="idx" class="cuisine-type-item">{{ cuisine }}</li>
        </ul>
      </q-card-section>
      <q-card-section>
        <div class="text-h6 q-mb-sm">Ingredients</div>
        <ul class="ingredients-list">
          <li v-for="(ingredient, idx) in recipe.ingredients" :key="idx" class="ingredient-item">{{ ingredient.text }}</li>
        </ul>
      </q-card-section>
      <q-card-section v-if="recipe.directions?.length">
        <div class="text-h6 q-mb-sm">Directions</div>
        <div v-for="(direction, idx) in recipe.directions" :key="idx" class="direction-step q-mt-md">
          <div class="text-subtitle2 text-weight-medium">Step {{ idx + 1 }}</div>
          <q-img
            v-if="direction.image"
            :src="direction.image"
            alt="Step"
            class="q-mt-sm reduced-img rounded-borders"
            style="max-height: 200px; object-fit: cover;"
          />
          <div class="q-mt-sm">{{ direction.instructionText }}</div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Notify } from 'quasar'
import type { Recipe } from '../../interfaces/RecipeResponse'
import { getRecipeById, addMyRecipe, removeMyRecipe } from 'src/api/recipe'
import { useRecipeFavorites } from 'src/composables/useRecipeFavorites'

const route = useRoute()
const router = useRouter()
const { toggleFavorite, toggleSaved, applyToRecipe } = useRecipeFavorites()

// Used in template @click
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onToggleFavorite = async () => {
  if (!recipe.value) return
  try {
    await toggleFavorite(recipe.value)
    Notify.create({ type: 'positive', message: recipe.value.isFavorite ? 'Added to favorites' : 'Removed from favorites' })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to update favorite'
    Notify.create({ type: 'negative', message: msg })
  }
}

const recipe = ref<Recipe | null>(null)
const loading = ref(true)
const error = ref('')
const addingToMyRecipes = ref(false)
const inMyRecipes = ref(false)

const recipeId = (): string | undefined => {
  const id = route.params.id
  return Array.isArray(id) ? id[0] : (id as string)
}

const sourceTypeId = (): string | undefined => {
  const st = route.query.sourceTypeId
  if (st == null) return undefined
  const value = Array.isArray(st) ? st[0] : st
  return typeof value === 'string' ? value : undefined
}

const loadRecipe = async () => {
  const id = recipeId()
  if (!id) return
  recipe.value = null
  loading.value = true
  error.value = ''
  try {
    const sourceType = sourceTypeId()
    const data = await getRecipeById(id, sourceType)
    applyToRecipe(data)
    recipe.value = data
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Could not load this recipe.'
    error.value = msg === 'Recipe not found' ? 'Recipe not found.' : 'Could not load this recipe. Check your connection and try again.'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const shareRecipe = () => {
  if (!recipe.value) return
  if (navigator.share) {
    void navigator
      .share({
        title: recipe.value.name,
        url: window.location.href
      })
      .catch((err) => console.error('Share failed:', err))
  }
}

const toggleMyRecipe = async () => {
  if (!recipe.value) return
  addingToMyRecipes.value = true
  try {
    if (inMyRecipes.value) {
      await removeMyRecipe(recipe.value.id)
      inMyRecipes.value = false
      Notify.create({ type: 'positive', message: 'Removed from my recipes' })
    } else {
      await addMyRecipe(recipe.value.id, recipe.value.recipeSourceType)
      inMyRecipes.value = true
      Notify.create({ type: 'positive', message: 'Added to my recipes' })
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to update my recipes'
    Notify.create({ type: 'negative', message: msg })
  } finally {
    addingToMyRecipes.value = false
  }
}

watch(
  () => [route.params.id, route.query.sourceTypeId],
  loadRecipe,
  { immediate: false }
)
onMounted(loadRecipe)
</script>

<style scoped>
.recipe-detail {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
}
.recipe-detail-img {
  border-radius: 12px;
  overflow: hidden;
}
.reduced-img {
  max-height: 200px;
  object-fit: cover;
}
.recipe-description {
  color: var(--q-dark);
  line-height: 1.5;
}
.cuisine-types-list,
.ingredients-list {
  margin: 0;
  padding-left: 1.25rem;
}
.cuisine-type-item,
.ingredient-item {
  margin-bottom: 4px;
}
.direction-step {
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.direction-step:last-child {
  border-bottom: none;
}
</style>