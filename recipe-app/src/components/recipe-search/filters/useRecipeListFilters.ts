import { ref, computed, type Ref } from 'vue'
import type { Recipe } from 'src/interfaces/RecipeResponse'

export interface RecipeListFilterState {
  nameQuery: Ref<string>
  caloriesMin: Ref<number | null>
  caloriesMax: Ref<number | null>
  timeMin: Ref<number | null>
  timeMax: Ref<number | null>
  hasActiveFilters: Ref<boolean>
  filterRecipes: (recipes: Recipe[]) => Recipe[]
  clearFilters: () => void
}

// Shared state so RecipeList and RecipeListFilters use the same filters
const nameQuery = ref('')
const caloriesMin = ref<number | null>(null)
const caloriesMax = ref<number | null>(null)
const timeMin = ref<number | null>(null)
const timeMax = ref<number | null>(null)

export function useRecipeListFilters(): RecipeListFilterState {

  const hasActiveFilters = computed(
    () =>
      (nameQuery.value?.trim() ?? '') !== '' ||
      caloriesMin.value != null ||
      caloriesMax.value != null ||
      timeMin.value != null ||
      timeMax.value != null
  )

  function filterRecipes(recipes: Recipe[]): Recipe[] {
    return recipes.filter((r) => {
      const name = (r.name ?? '').toLowerCase()
      const query = (nameQuery.value ?? '').trim().toLowerCase()
      if (query && !name.includes(query)) return false

      const cal = Number(r.calories) || 0
      if (caloriesMin.value != null && cal < caloriesMin.value) return false
      if (caloriesMax.value != null && cal > caloriesMax.value) return false

      const time = Number(r.totalTime) || 0
      if (timeMin.value != null && time < timeMin.value) return false
      if (timeMax.value != null && time > timeMax.value) return false

      return true
    })
  }

  function clearFilters(): void {
    nameQuery.value = ''
    caloriesMin.value = null
    caloriesMax.value = null
    timeMin.value = null
    timeMax.value = null
  }

  return {
    nameQuery,
    caloriesMin,
    caloriesMax,
    timeMin,
    timeMax,
    hasActiveFilters,
    filterRecipes,
    clearFilters
  }
}
