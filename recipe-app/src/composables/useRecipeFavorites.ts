import { ref, watch } from 'vue'
import type { Recipe } from 'src/interfaces/RecipeResponse'
import { getFavorites, addFavorite, removeFavorite } from 'src/api/recipe'

const STORAGE_FAVORITES = 'recipe-app-favorites'
const STORAGE_SAVED = 'recipe-app-saved'

function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as string[]
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

function saveSet(key: string, set: Set<string>): void {
  localStorage.setItem(key, JSON.stringify([...set]))
}

const favoritesSet = ref(loadSet(STORAGE_FAVORITES))
const savedSet = ref(loadSet(STORAGE_SAVED))

watch(
  favoritesSet,
  (val) => saveSet(STORAGE_FAVORITES, val),
  { deep: true }
)
watch(
  savedSet,
  (val) => saveSet(STORAGE_SAVED, val),
  { deep: true }
)

export function useRecipeFavorites() {
  const isFavorite = (recipe: Recipe): boolean =>
    favoritesSet.value.has(recipe.id)

  const isSaved = (recipe: Recipe): boolean => savedSet.value.has(recipe.id)

  const setFavorite = (recipe: Recipe, value: boolean): void => {
    const next = new Set(favoritesSet.value)
    if (value) next.add(recipe.id)
    else next.delete(recipe.id)
    favoritesSet.value = next
  }

  const setSaved = (recipe: Recipe, value: boolean): void => {
    const next = new Set(savedSet.value)
    if (value) next.add(recipe.id)
    else next.delete(recipe.id)
    savedSet.value = next
  }

  /** Sync favorites from API (when logged in). */
  const fetchFavorites = async (): Promise<void> => {
    const token = localStorage.getItem('id_token')
    if (!token) return
    try {
      const list = await getFavorites()
      const ids = new Set(list.map((r) => r.id))
      favoritesSet.value = ids
    } catch {
      // Keep current local state on failure (e.g. network)
    }
  }

  /** Toggle favorite: updates local state and syncs to API when logged in. */
  const toggleFavorite = async (recipe: Recipe): Promise<boolean> => {
    const next = !isFavorite(recipe)
    setFavorite(recipe, next)
    recipe.isFavorite = next
    const sourceType = recipe.recipeSourceType != null && recipe.recipeSourceType !== '' ? String(recipe.recipeSourceType) : '2'
    try {
      if (next) await addFavorite(recipe.id, sourceType)
      else await removeFavorite(recipe.id)
    } catch (e) {
      setFavorite(recipe, !next)
      recipe.isFavorite = !next
      throw e
    }
    return next
  }

  const toggleSaved = (recipe: Recipe): boolean => {
    const next = !isSaved(recipe)
    setSaved(recipe, next)
    recipe.isSaved = next
    return next
  }

  /** Apply persisted favorite/saved state onto a recipe (for display). */
  const applyToRecipe = (recipe: Recipe): void => {
    recipe.isFavorite = isFavorite(recipe)
    recipe.isSaved = isSaved(recipe)
  }

  return {
    isFavorite,
    isSaved,
    setFavorite,
    setSaved,
    toggleFavorite,
    toggleSaved,
    applyToRecipe,
    fetchFavorites
  }
}
