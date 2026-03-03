<template>
  <q-page class="recipes-page">
    <div class="recipes-inner">
      <h1 class="page-title">Recetas</h1>

      <!-- Search bar -->
      <div class="search-bar-wrap">
        <q-input
          v-model="searchQuery"
          filled
          rounded
          dense
          placeholder="Nombre o ingredientes (separar con comas)"
          class="search-input"
          @keyup.enter="runSearch"
        >
          <template #append>
            <q-btn flat round dense icon="search" @click="runSearch" />
          </template>
        </q-input>
      </div>

      <!-- Search mode hint -->
      <p v-if="lastSearchQuery" class="search-hint">
        <template v-if="isIngredientSearch">
          Buscando por ingredientes.
        </template>
        <template v-else>
          Buscando por nombre de receta.
        </template>
      </p>

      <q-spinner v-if="loading" size="40px" color="primary" class="q-mt-lg" />
      <recipe-list v-else-if="recipes.length" :recipes="recipes" class="recipe-list-wrap" />
      <div v-else-if="lastSearchQuery && !loading" class="empty-state">
        <q-icon name="restaurant" size="48px" color="grey-6" />
        <p>No se encontraron recetas.</p>
      </div>
      <div v-else class="empty-state">
        <q-icon name="search" size="48px" color="grey-6" />
        <p>Escribe y busca por nombre o ingredientes.</p>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Recipe } from 'src/interfaces/RecipeResponse'
import RecipeList from 'src/components/recipe-search/RecipeList.vue'

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const lastSearchQuery = ref('')
const recipes = ref<Recipe[]>([])
const loading = ref(false)

// Detect: comma-separated → ingredient search; otherwise → recipe name search
const isIngredientSearch = computed(() => lastSearchQuery.value.includes(','))

// Sync query from route on load
watch(
  () => route.query.q,
  (q) => {
    if (q != null && typeof q === 'string') {
      searchQuery.value = q
      lastSearchQuery.value = q
      void runSearchFromQuery(q)
    }
  },
  { immediate: true }
)

function runSearch() {
  const q = searchQuery.value.trim()
  if (!q) return
  lastSearchQuery.value = q
  void router.replace({ path: '/recipes', query: { q } }).then(() => {
    return runSearchFromQuery(q)
  })
}

async function runSearchFromQuery(q: string) {
  loading.value = true
  recipes.value = []
  const trimmed = q.trim()
  if (!trimmed) {
    loading.value = false
    return
  }

  const isByIngredient = trimmed.includes(',')
  const ingredients = isByIngredient
    ? trimmed.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  try {
    const url = import.meta.env.VITE_API_URL
    const token = localStorage.getItem('id_token')

    if (isByIngredient && ingredients.length > 0) {
      const endpoint = 'api/recipe'
      const response = await fetch(`${url}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ingredients }),
      })
      if (!response.ok) throw new Error('Error al buscar')
      const data = await response.json()
      recipes.value = Array.isArray(data) ? data : []
    } else {
      // Recipe name search: assume GET api/recipe?search= or similar if available
      const nameQuery = isByIngredient ? '' : trimmed
      if (nameQuery) {
        const searchUrl = `${url}/api/recipe?search=${encodeURIComponent(nameQuery)}`
        const response = await fetch(searchUrl, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          recipes.value = Array.isArray(data) ? data : (data?.items ?? data?.recipes ?? [])
        }
        // If 404 or no endpoint, recipes stay []
      }
    }
  } catch (e) {
    console.error(e)
  }
  loading.value = false
}
</script>

<style scoped>
.recipes-page {
  background: #f8f8f8;
  min-height: 100%;
}

.body--dark .recipes-page {
  background: var(--q-dark-page, #121212);
}

.recipes-inner {
  max-width: 640px;
  margin: 0 auto;
  padding: 20px 16px;
}

.page-title {
  font-size: 1.35rem;
  font-weight: 600;
  margin: 0 0 16px;
  color: #333;
}

.body--dark .page-title {
  color: #eee;
}

.search-bar-wrap {
  margin-bottom: 12px;
}

.search-input {
  background: #fff;
}

.body--dark .search-input {
  background: var(--q-dark, #1d1d1d);
}

.search-hint {
  font-size: 0.8rem;
  color: #666;
  margin: 0 0 16px;
}

.recipe-list-wrap {
  margin-top: 16px;
}

.empty-state {
  text-align: center;
  padding: 48px 16px;
  color: #888;
  font-size: 0.9rem;
}

.empty-state p {
  margin: 12px 0 0;
}
</style>
