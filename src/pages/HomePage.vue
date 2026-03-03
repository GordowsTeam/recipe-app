<template>
  <q-page class="home-page">
    <div class="home-inner">
      <!-- Greeting -->
      <h1 class="greeting">{{ greeting }}, {{ userName }}</h1>

      <!-- Search -->
      <form class="search-form" @submit.prevent="onSearchSubmit">
        <q-input
          v-model="searchInput"
          filled
          rounded
          dense
          placeholder="Search recipe name or ingredients (separate ingredients with commas)"
          class="search-input"
          bg-color="white"
        >
          <template #prepend>
            <q-icon name="search" size="sm" />
          </template>
        </q-input>
      </form>

      <!-- Your Next Meal -->
      <section class="home-section">
        <h2 class="section-title">Your Next Meal</h2>
        <div v-if="nextMealRecipe" class="next-meal-single">
          <recipe-card
            :recipe="nextMealRecipe"
            :subtitle="nextMealSubtitle"
            class="next-meal-card"
            @click="goToRecipe(nextMealRecipe)"
          />
        </div>
        <div v-else class="next-meal-carousel">
          <div class="carousel-scroll">
            <recipe-card
              v-for="s in suggestedRecipes"
              :key="s.id"
              :recipe="s"
              :subtitle="s.subtitle"
              class="carousel-card"
              @click="goToRecipe(s)"
            />
          </div>
        </div>
      </section>

      <!-- This Week -->
      <section class="home-section">
        <h2 class="section-title">This Week</h2>
        <div class="week-carousel">
          <div class="carousel-scroll week-scroll">
            <day-card
              v-for="day in weekDays"
              :key="day.date"
              :day="day"
              class="week-card"
              @click="goToPlannerDay(day.date)"
            />
          </div>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import RecipeCard from 'src/components/home/RecipeCard.vue'
import DayCard from 'src/components/home/DayCard.vue'
import type { Recipe } from 'src/interfaces/RecipeResponse'

const router = useRouter()
const userName = 'Adrian'
const searchInput = ref('')

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 18) return 'Good Afternoon'
  return 'Good Evening'
})

// Next meal: one selected or 3 suggested
const NEXT_MEAL_KEY = 'numa_next_meal'
const nextMealRecipe = ref<Recipe | null>(null)

function loadNextMeal() {
  try {
    const raw = localStorage.getItem(NEXT_MEAL_KEY)
    if (raw) nextMealRecipe.value = JSON.parse(raw) as Recipe
  } catch {
    nextMealRecipe.value = null
  }
}
loadNextMeal()

const nextMealSubtitle = computed(() => {
  const r = nextMealRecipe.value
  if (!r?.totalTime) return ''
  return `Ready in ${r.totalTime} min`
})

// Suggested recipes (placeholder data when no next meal selected)
const suggestedRecipes = ref<Array<Recipe & { subtitle?: string }>>([
  {
    id: 'suggest-1',
    name: 'Pasta with tomato',
    images: [],
    ingredients: [],
    missingIngredients: [],
    calories: 0,
    totalTime: 20,
    cuisinTypes: [],
    mealTypes: [],
    directions: [],
    recipeSourceType: '',
    subtitle: 'Ready in 20 min'
  },
  {
    id: 'suggest-2',
    name: 'Grilled chicken salad',
    images: [],
    ingredients: [],
    missingIngredients: [],
    calories: 0,
    totalTime: 25,
    cuisinTypes: [],
    mealTypes: [],
    directions: [],
    recipeSourceType: '',
    subtitle: 'Ready in 25 min'
  },
  {
    id: 'suggest-3',
    name: 'Vegetable stir-fry',
    images: [],
    ingredients: [],
    missingIngredients: [],
    calories: 0,
    totalTime: 15,
    cuisinTypes: [],
    mealTypes: [],
    directions: [],
    recipeSourceType: '',
    subtitle: 'Ready in 15 min'
  }
])

// This week: 7 days
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const weekDays = computed(() => {
  const today = new Date()
  const out: Array<{ date: string; dayName: string; breakfast?: string; lunch?: string; dinner?: string; hasSnacks?: boolean }> = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const iso = d.toISOString().slice(0, 10)
    out.push({
      date: iso,
      dayName: dayNames[d.getDay()],
      breakfast: '—',
      lunch: '—',
      dinner: '—',
      hasSnacks: false
    })
  }
  return out
})

function onSearchSubmit() {
  const q = searchInput.value?.trim()
  if (!q) return
  void router.push({ path: '/recipes', query: { q } })
}

function goToRecipe(recipe: Recipe) {
  void router.push({
    name: 'recipe-detail',
    params: { id: recipe.id, sourceTypeId: recipe.recipeSourceType || '' }
  })
}

function goToPlannerDay(date: string) {
  void router.push({ name: 'planner-day', params: { date } })
}
</script>

<style scoped>
.home-page {
  background: #f8f8f8;
  min-height: 100%;
  padding-bottom: 24px;
}

.body--dark .home-page {
  background: var(--q-dark-page, #121212);
}

.home-inner {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px;
}

.greeting {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0 0 24px;
  color: #333;
  line-height: 1.3;
}

.body--dark .greeting {
  color: #eee;
}

.search-form {
  margin-bottom: 28px;
}

.search-input {
  border-radius: 12px;
}

.body--dark .search-input :deep(.q-field__control) {
  background: var(--q-dark, #1d1d1d);
}

.search-input :deep(.q-field__control) {
  border-radius: 12px;
}

.home-section {
  margin-bottom: 28px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 12px;
  color: #333;
}

.body--dark .section-title {
  color: #e0e0e0;
}

.next-meal-single {
  max-width: 320px;
}

.next-meal-card {
  cursor: pointer;
}

.next-meal-carousel,
.week-carousel {
  overflow: hidden;
}

.carousel-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.carousel-scroll::-webkit-scrollbar {
  height: 6px;
}

.carousel-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.carousel-card,
.week-card {
  flex: 0 0 auto;
  scroll-snap-align: start;
}

.carousel-card {
  width: 200px;
}

.week-scroll .week-card {
  width: 140px;
}
</style>
