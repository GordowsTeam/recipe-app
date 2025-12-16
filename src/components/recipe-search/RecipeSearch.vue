<template>
  <div class="q-pa-md">

    <!-- HOME SECTIONS (unchanged) -->
    <div v-if="recipes.length === 0" class="home-sections">
      <!-- ⭐ Recipes of the day (MODIFIED SECTION) -->
      <div class="editorial-container">

        <!-- LEFT: Big feature recipe -->
        <div class="editorial-feature">
          <img
            src="https://s3.amazonaws.com/static.realcaliforniamilk.com/media/recipes_2/fettuccine-alfredo-with-creme-fraiche.jpg"
            class="feature-img"
            alt="Creamy Fettuccine Alfredo"
          />

          <div class="feature-meta">
            <div class="feature-title">Creamy Fettuccine Alfredo</div>
          </div>
        </div>

        <!-- RIGHT: Latest recipes -->
        <div class="editorial-latest">
          <div class="latest-title">The Latest</div>

          <div
            class="latest-item"
            v-for="n in 5"
            :key="'latest-' + n"
          >
            <img
              src="https://s3.amazonaws.com/static.realcaliforniamilk.com/media/recipes_2/fettuccine-alfredo-with-creme-fraiche.jpg"
              class="latest-thumb"
              alt="thumb"
            />

            <div class="latest-info">
              <div class="latest-category">IN THE KITCHEN · 1 HOUR AGO</div>
              <div class="latest-name">Fettuccine Alfredo Variation {{ n }}</div>
            </div>
          </div>
        </div>

      </div>
      <!-- END MODIFIED SECTION -->

      <!-- SECTION: Your recipes -->
      <div class="q-mt-lg">
        <div class="section-title">🧑‍🍳 Your recipes</div>
        <div class="section-scroll">
          <q-card v-for="n in 4" :key="'mine-' + n" class="section-card">
            <q-card-section class="text-center">
              <q-icon name="book" size="32px" class="q-mb-sm" />
              My Recipe {{ n }}
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- SECTION: Favorites -->
      <div class="q-mt-lg">
        <div class="section-title">❤️ Favorite recipes</div>
        <div class="section-scroll">
          <q-card v-for="n in 6" :key="'fav-' + n" class="section-card">
            <q-card-section class="text-center">
              <q-icon name="favorite" size="32px" class="q-mb-sm" />
              Favorite {{ n }}
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- SECTION: Top rated -->
      <div class="q-mt-lg">
        <div class="section-title">🔝 Top rated</div>
        <div class="section-scroll">
          <q-card v-for="n in 5" :key="'top-' + n" class="section-card">
            <q-card-section class="text-center">
              <q-icon name="star_rate" size="32px" class="q-mb-sm" />
              Rated {{ n }}
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Notify } from 'quasar'
import RecipeList from './RecipeList.vue'
import type { Recipe } from 'src/interfaces/RecipeResponse'

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

const recipes = ref<Recipe[]>([])
const loading = ref(false)

let searchMode: 'recipe' | 'ingredient' = 'recipe'
let searchText = ''
let ingredientList: Ingredient[] = []

/* -------------------------
        API
--------------------------*/

const getRecipes = async (): Promise<void> => {
  loading.value = true

  try {
    const url = import.meta.env.VITE_API_URL
    const token = localStorage.getItem('id_token')

    const ingredients =
      searchMode === 'ingredient'
        ? ingredientList.map(i => i.name)
        : [searchText.trim()]

    const response = await fetch(`${url}/api/recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ingredients })
    })

    if (!response.ok) {
      throw new Error('Failed to fetch recipes')
    }

    recipes.value = (await response.json()) as Recipe[]
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

/* image: fixed sensible size, responsive */
.feature-img {
  width: 100%;
  max-width: 420px;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
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

.latest-thumb {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  object-fit: cover;
}

.latest-info {
  flex: 1;
}

.latest-category {
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