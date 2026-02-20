<template>
  <div class="q-pa-md">

    <!-- HOME SECTIONS (unchanged) -->
    <div v-if="recipes.length === 0" class="home-sections">
      <!-- ⭐ Recipes of the day (MODIFIED SECTION) -->
      <div class="editorial-container">

        <!-- LEFT: Big feature recipe (from API) -->
        <div v-if="loadingTopRated" class="editorial-feature">
          <q-skeleton class="feature-img" />
          <q-skeleton type="text" class="q-mt-sm" style="max-width: 80%" />
        </div>
        <div v-else-if="featureRecipe" class="editorial-feature">
          <div class="feature-img-wrapper">
            <img
              v-if="mainImageUrl(featureRecipe)"
              :src="mainImageUrl(featureRecipe)"
              class="feature-img"
              alt=""
            />
            <div v-else class="feature-img feature-img-placeholder">
              <q-icon name="restaurant" size="48px" />
            </div>
            <q-btn
              round
              unelevated
              color="primary"
              icon="open_in_new"
              class="feature-details-btn"
              aria-label="View recipe details"
              @click.stop="goToRecipe(featureRecipe)"
            />
          </div>
          <div class="feature-meta">
            <div class="feature-title">{{ featureRecipe.name }}</div>
            <div class="feature-subtitle">{{ featureRecipe.totalTime }} min · {{ featureRecipe.calories }} cal</div>
          </div>
        </div>
        <div v-else class="editorial-feature">
          <div class="feature-img feature-img-placeholder">
            <q-icon name="restaurant" size="48px" />
          </div>
          <div class="feature-meta">
            <div class="feature-title text-grey-7">No recipe to show yet</div>
          </div>
        </div>

        <!-- RIGHT: Latest recipes (from API) -->
        <div class="editorial-latest">
          <div class="latest-title">The Latest</div>
          <div v-if="loadingTopRated">
            <div v-for="i in 5" :key="'latest-skel-' + i" class="latest-item">
              <q-skeleton type="QAvatar" size="80px" class="latest-thumb" />
              <div class="latest-info">
                <q-skeleton type="text" width="60%" />
                <q-skeleton type="text" width="90%" class="q-mt-xs" />
              </div>
            </div>
          </div>
          <template v-else>
            <div
              v-for="r in latestRecipes"
              :key="'latest-' + r.id"
              class="latest-item latest-item-clickable"
              @click="selectAsFeature(r)"
            >
              <img
                v-if="mainImageUrl(r)"
                :src="mainImageUrl(r)"
                class="latest-thumb"
                alt=""
              />
              <div v-else class="latest-thumb latest-thumb-placeholder">
                <q-icon name="restaurant" size="24px" />
              </div>
              <div class="latest-info">
                <div class="latest-category">{{ r.totalTime }} MIN · {{ r.calories }} CAL</div>
                <div class="latest-name">{{ r.name }}</div>
              </div>
            </div>
          </template>
        </div>

      </div>
      <!-- END MODIFIED SECTION -->

      <!-- SECTION: Your recipes -->
      <div class="q-mt-lg">
        <div class="section-title">🧑‍🍳 Your recipes</div>
        <div v-if="loadingMyRecipes" class="section-scroll">
          <q-skeleton v-for="i in 4" :key="'my-skel-' + i" class="section-card section-card-skeleton" />
        </div>
        <div v-else-if="!isAuthenticated" class="section-placeholder">
          Sign in to see your recipes.
        </div>
        <div v-else-if="myRecipes.length === 0" class="section-placeholder">
          You haven't added any recipes yet.
        </div>
        <div v-else class="section-scroll">
          <q-card
            v-for="r in myRecipes"
            :key="'my-' + r.id"
            class="section-card section-card-recipe"
            @click="goToRecipe(r)"
          >
            <q-img
              v-if="r.images?.length"
              :src="r.images.find(img => img.main)?.url"
              class="section-card-img"
              ratio="1"
            />
            <div v-else class="section-card-img section-card-img-placeholder">
              <q-icon name="restaurant" size="32px" />
            </div>
            <q-card-section class="section-card-body">
              <div class="section-card-name">{{ r.name }}</div>
              <div class="section-card-meta">{{ r.totalTime }} min · {{ r.calories }} cal</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- SECTION: Favorites -->
      <div class="q-mt-lg">
        <div class="section-title">❤️ Favorite recipes</div>
        <div v-if="loadingFavorites" class="section-scroll">
          <q-skeleton v-for="i in 4" :key="'fav-skel-' + i" class="section-card section-card-skeleton" />
        </div>
        <div v-else-if="!isAuthenticated" class="section-placeholder">
          Sign in to see your favorites.
        </div>
        <div v-else-if="favoritesRecipes.length === 0" class="section-placeholder">
          No favorites yet. Use the heart icon on a recipe to add it here.
        </div>
        <div v-else class="section-scroll">
          <q-card
            v-for="r in favoritesRecipes"
            :key="'fav-' + r.id"
            class="section-card section-card-recipe"
            @click="goToRecipe(r)"
          >
            <q-img
              v-if="r.images?.length"
              :src="r.images.find(img => img.main)?.url"
              class="section-card-img"
              ratio="1"
            />
            <div v-else class="section-card-img section-card-img-placeholder">
              <q-icon name="favorite" size="32px" />
            </div>
            <q-card-section class="section-card-body">
              <div class="section-card-name">{{ r.name }}</div>
              <div class="section-card-meta">{{ r.totalTime }} min · {{ r.calories }} cal</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- SECTION: Top rated -->
      <div class="q-mt-lg">
        <div class="section-title">🔝 Top rated</div>
        <div v-if="loadingTopRated" class="section-scroll">
          <q-skeleton v-for="i in 4" :key="'top-skel-' + i" class="section-card section-card-skeleton" />
        </div>
        <div v-else-if="topRatedRecipes.length === 0" class="section-placeholder">
          No recipes to show yet.
        </div>
        <div v-else class="section-scroll">
          <q-card
            v-for="r in topRatedRecipes"
            :key="'top-' + r.id"
            class="section-card section-card-recipe"
            @click="goToRecipe(r)"
          >
            <q-img
              v-if="r.images?.length"
              :src="r.images.find(img => img.main)?.url"
              class="section-card-img"
              ratio="1"
            />
            <div v-else class="section-card-img section-card-img-placeholder">
              <q-icon name="star_rate" size="32px" />
            </div>
            <q-card-section class="section-card-body">
              <div class="section-card-name">{{ r.name }}</div>
              <div class="section-card-meta">{{ r.totalTime }} min · {{ r.calories }} cal</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <q-spinner v-if="loading" size="50px" color="primary" class="q-mt-md" />

    <recipe-list
      v-if="recipes.length"
      :recipes="recipes"
      class="q-mt-lg"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import RecipeList from './RecipeList.vue'
import type { Recipe } from 'src/interfaces/RecipeResponse'
import { getRecipes as getRecipesApi, getMyRecipes, getFavorites, getLatestRecipes } from 'src/api/recipe'
import { useRecipeFavorites } from 'src/composables/useRecipeFavorites'
import { parseJwt } from 'boot/cognito'

/* -------------------------
        TYPES
--------------------------*/

interface Ingredient {
  name: string
}

interface SearchEventDetail {
  searchMode: 'recipe' | 'ingredient'
  searchText: string
  ingredientList: Ingredient[]
}

/* -------------------------
        STATE
--------------------------*/

const router = useRouter()
const recipes = ref<Recipe[]>([])
const loading = ref(false)

const myRecipes = ref<Recipe[]>([])
const favoritesRecipes = ref<Recipe[]>([])
const topRatedRecipes = ref<Recipe[]>([])
const featureRecipe = ref<Recipe | null>(null)
const latestRecipes = ref<Recipe[]>([])
const loadingMyRecipes = ref(false)
const loadingFavorites = ref(false)
const loadingTopRated = ref(false)

const token = computed(() => localStorage.getItem('id_token'))
const isAuthenticated = computed(() => {
  const payload = parseJwt(token.value)
  return payload?.sub != null
})

let searchMode: 'recipe' | 'ingredient' = 'recipe'
let searchText = ''
let ingredientList: Ingredient[] = []

/* -------------------------
        API
--------------------------*/

const { applyToRecipe } = useRecipeFavorites()

const loadSectionRecipes = async (): Promise<void> => {
  if (isAuthenticated.value) {
    loadingMyRecipes.value = true
    loadingFavorites.value = true
    try {
      const [my, fav] = await Promise.all([getMyRecipes(), getFavorites()])
      my.forEach(applyToRecipe)
      fav.forEach(applyToRecipe)
      myRecipes.value = my
      favoritesRecipes.value = fav
    } catch {
      // ignore; sections stay empty
    } finally {
      loadingMyRecipes.value = false
      loadingFavorites.value = false
    }
  }

  loadingTopRated.value = true
  try {
    const [list, latest] = await Promise.all([
      getRecipesApi({ ingredients: ['recipe'] }),
      getLatestRecipes(5)
    ])
    list.forEach(applyToRecipe)
    latest.forEach(applyToRecipe)
    latestRecipes.value = latest
    featureRecipe.value = latest[0] ?? null
    topRatedRecipes.value = list.slice(0, 10)
  } catch {
    featureRecipe.value = null
    latestRecipes.value = []
    topRatedRecipes.value = []
  } finally {
    loadingTopRated.value = false
  }
}

const mainImageUrl = (recipe: Recipe): string =>
  recipe.images?.find(img => img.main)?.url ?? recipe.images?.[0]?.url ?? ''

/** Set a recipe as the big feature recipe (used when clicking a latest recipe). */
const selectAsFeature = (recipe: Recipe) => {
  featureRecipe.value = recipe
}

const goToRecipe = (recipe: Recipe) => {
  const id = recipe.id ?? (recipe as { Id?: string }).Id
  if (!id) return
  const sourceTypeId = recipe.recipeSourceType != null && recipe.recipeSourceType !== '' ? String(recipe.recipeSourceType) : '2'
  void router.push({
    name: 'recipe-detail',
    params: { id },
    query: { sourceTypeId }
  })
}

const getRecipes = async (): Promise<void> => {
  loading.value = true

  try {
    const ingredients =
      searchMode === 'ingredient'
        ? ingredientList.map(i => i.name)
        : [searchText.trim()]

    const list = await getRecipesApi({ ingredients })
    list.forEach(applyToRecipe)
    recipes.value = list
  } catch {
    Notify.create({ type: 'negative', message: 'Error fetching recipes' })
  } finally {
    loading.value = false
  }
}

/* -------------------------
     EVENT BRIDGE
--------------------------*/

const handler = (event: Event) => {
  const customEvent = event as CustomEvent<SearchEventDetail>

  searchMode = customEvent.detail.searchMode
  searchText = customEvent.detail.searchText
  ingredientList = customEvent.detail.ingredientList

  void getRecipes()
}

onMounted(() => {
  window.addEventListener('trigger-recipe-search', handler)
  void loadSectionRecipes()
})

onBeforeUnmount(() => {
  window.removeEventListener('trigger-recipe-search', handler)
})
</script>
<style scoped>
.search-input {
  max-width: 400px;
  width: 100%;
}

.ingredients-row {
  max-width: 400px;
  margin: 8px auto 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* HOME SECTIONS */
.home-sections {
  margin-top: 30px;
}

.section-title {
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 8px;
}

.section-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.section-card {
  min-width: 140px;
  border-radius: 14px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}

.section-card-recipe {
  min-width: 160px;
  max-width: 180px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.section-card-recipe:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.section-card-img {
  height: 120px;
  object-fit: cover;
  border-radius: 14px 14px 0 0;
}
.section-card-img-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #999;
}

.section-card-body {
  padding: 10px 12px;
}
.section-card-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.section-card-meta {
  font-size: 12px;
  color: #777;
  margin-top: 4px;
}

.section-placeholder {
  padding: 24px 16px;
  color: #888;
  font-size: 14px;
  text-align: center;
}

.section-card-skeleton {
  min-width: 160px;
  height: 180px;
}

/* --- EDITORIAL SECTION (MODIFIED) --- */
.editorial-container {
  display: grid;
  grid-template-columns: 420px 360px; /* left 420px, right 360px */
  gap: 24px;                          /* reduce big empty space */
  max-width: 820px;                   /* center and limit overall width */
  margin: 28px auto;                  /* center horizontally on page */
  align-items: start;
}

.editorial-feature {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* align content to left within left column */
}

.feature-img-wrapper {
  position: relative;
  width: 100%;
  max-width: 420px;
}

/* image: fixed sensible size, responsive (same approach as latest list) */
.feature-img {
  width: 100%;
  max-width: 420px;
  height: auto;
  aspect-ratio: 4 / 3;
  border-radius: 12px;
  object-fit: cover;
  display: block;
}

.feature-details-btn {
  position: absolute;
  bottom: 12px;
  right: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.feature-img-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: #f0f0f0;
  color: #999;
}

/* small meta/title under the image, aligned left */
.feature-meta {
  margin-top: 12px;
  width: 100%;
}

.feature-title {
  margin-top: 6px;
  font-size: 24px;
  font-weight: 700;
}

.feature-subtitle {
  font-size: 14px;
  color: #777;
  margin-top: 4px;
}

/* RIGHT PANEL */
.editorial-latest {
  width: 100%;
  max-width: 360px;
}

.latest-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  border-bottom: 3px solid #d62828;
  padding-bottom: 4px;
}

.latest-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.latest-item-clickable {
  cursor: pointer;
  transition: background 0.15s ease;
  border-radius: 8px;
  margin-left: -4px;
  margin-right: -4px;
  padding: 4px;
}
.latest-item-clickable:hover {
  background: rgba(0, 0, 0, 0.04);
}

.latest-item-skeleton {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
}
.latest-item-skeleton .q-skeleton {
  border-radius: 6px;
}

.latest-thumb {
  width: 80px;
  height: 80px;
  min-width: 80px;
  border-radius: 6px;
  object-fit: cover;
}

.latest-thumb-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #999;
}

.latest-info {
  flex: 1;
  min-width: 0;
}

.latest-category,
.latest-meta {
  font-size: 11px;
  color: #777;
  font-weight: 600;
  text-transform: uppercase;
}

.latest-name {
  font-size: 14px;
  font-weight: 600;
  margin-top: 4px;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* RESPONSIVE: stack columns on smaller screens */
@media (max-width: 900px) {
  .editorial-container {
    grid-template-columns: 1fr;
    max-width: 100%;
    gap: 16px;
    margin: 18px auto;
  }

  .editorial-feature {
    align-items: center;
  }

  .feature-img {
    max-width: 360px;
  }

  .editorial-latest {
    max-width: 100%;
  }

  .feature-title {
    text-align: center;
    font-size: 20px;
  }
}
</style>