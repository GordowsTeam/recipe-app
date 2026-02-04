<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Favorites</div>

    <q-banner v-if="error" class="bg-negative text-white q-mb-md rounded-borders">
      <template #avatar>
        <q-icon name="error" />
      </template>
      {{ error }}
      <template #action>
        <q-btn flat dense label="Retry" @click="loadFavorites" />
      </template>
    </q-banner>

    <div v-else-if="!isAuthenticated" class="text-body1 text-grey-7">
      Sign in to see your favorite recipes.
    </div>

    <template v-else>
      <q-spinner v-if="loading" size="48px" color="primary" class="q-mt-lg" />
      <template v-else>
        <div v-if="recipes.length === 0" class="text-body1 text-grey-7">
          You haven't added any favorites yet. Use the heart icon on a recipe to add it here.
        </div>
        <recipe-list v-else :recipes="recipes" />
      </template>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Recipe } from 'src/interfaces/RecipeResponse'
import { getFavorites } from 'src/api/recipe'
import { useRecipeFavorites } from 'src/composables/useRecipeFavorites'
import { parseJwt } from 'boot/cognito'
import RecipeList from 'src/components/recipe-search/RecipeList.vue'

const { applyToRecipe, fetchFavorites } = useRecipeFavorites()

const recipes = ref<Recipe[]>([])
const loading = ref(true)
const error = ref('')

const token = computed(() => localStorage.getItem('id_token'))
const isAuthenticated = computed(() => {
  const payload = parseJwt(token.value)
  return payload?.sub != null
})

const loadFavorites = async () => {
  if (!isAuthenticated.value) return
  loading.value = true
  error.value = ''
  try {
    const list = await getFavorites()
    list.forEach(applyToRecipe)
    recipes.value = list
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load favorites'
    error.value = msg
  } finally {
    loading.value = false
  }
}

// Used in template @favorite-toggled
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onFavoriteToggled = (_recipe: Recipe, isFavorite: boolean) => {
  if (!isFavorite) {
    recipes.value = recipes.value.filter((r) => r.id !== _recipe.id)
  }
}

onMounted(() => {
  void loadFavorites()
  void fetchFavorites()
})
</script>
