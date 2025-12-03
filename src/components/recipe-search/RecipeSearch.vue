<template>
  <div class="q-pa-md">

    <div class="row justify-center">
      <!-- Unified search bar -->
      <q-input
        outlined
        v-model="searchText"
        class="search-input"
        :label="searchMode === 'ingredient' ? 'Add ingredient' : 'Search recipe'"
        @keyup.enter="searchMode === 'ingredient' ? addIngredient() : getRecipes()"
      >

        <!-- PREPEND: Minimal dropdown -->
        <template #prepend>
          <q-btn-dropdown
            flat dense round no-caps
            icon="more_vert"
            content-class="bg-white"
          >
            <q-list bordered separator>

              <q-item clickable v-close-popup @click="searchMode = 'recipe'">
                <q-item-section avatar>
                  <q-icon name="restaurant_menu"/>
                </q-item-section>
                <q-item-section>By Recipe</q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="searchMode = 'ingredient'">
                <q-item-section avatar>
                  <q-icon name="spa"/>
                </q-item-section>
                <q-item-section>By Ingredient</q-item-section>
              </q-item>

            </q-list>
          </q-btn-dropdown>
        </template>

        <!-- APPEND -->
        <template #append>

          <!-- + button in ingredient mode -->
          <q-btn
            v-if="searchMode === 'ingredient'"
            dense flat round
            icon="add"
            color="primary"
            @click="addIngredient"
          />

          <!-- Search button -->
          <q-btn
            dense flat round
            icon="search"
            color="secondary"
            @click="getRecipes"
          />

        </template>

      </q-input>
    </div>

    <!-- Ingredient chips -->
    <div
      v-if="searchMode === 'ingredient' && ingredientList.length"
      class="ingredients-row"
    >
      <q-chip
        v-for="i in ingredientList"
        :key="i.name"
        removable
        color="grey-3"
        text-color="black"
        @remove="removeIngredient(i.name)"
      >
        {{ i.name }}
      </q-chip>
    </div>

    <q-spinner v-if="loading" size="50px" color="primary" class="q-mt-md" />

    <recipe-list v-if="recipes.length" :recipes="recipes" class="q-mt-lg" />

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Notify } from 'quasar'
import RecipeList from './RecipeList.vue'

interface Ingredient { name: string }

const searchMode = ref<'recipe' | 'ingredient'>('recipe')
const searchText = ref('')
const ingredientList = ref<Ingredient[]>([])

const recipes = ref([])
const loading = ref(false)

const addIngredient = () => {
  if (!searchText.value.trim()) return

  ingredientList.value.push({ name: searchText.value.trim() })
  searchText.value = ''
  Notify.create({ type: 'positive', message: 'Ingredient added' })
}

const removeIngredient = (name: string) => {
  ingredientList.value = ingredientList.value.filter(i => i.name !== name)
  Notify.create({ type: 'info', message: 'Ingredient removed' })
}

const getRecipes = async () => {
  loading.value = true

  try {
    const url = import.meta.env.VITE_API_URL
    const token = localStorage.getItem('id_token')
    const endpoint = 'api/recipe'

    const ingredients =
      searchMode.value === 'ingredient'
        ? ingredientList.value.map(i => i.name)
        : [searchText.value.trim()]

    const response = await fetch(`${url}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ingredients })
    })

    if (!response.ok) throw new Error()

    recipes.value = await response.json()
  } catch {
    Notify.create({ type: 'negative', message: 'Error fetching recipes' })
  }

  loading.value = false
}
</script>

<style scoped>
.search-input {
  max-width: 400px; /* Only the search bar is limited in width */
  width: 100%;
}

/* Chips aligned below the search bar */
.ingredients-row {
  max-width: 400px;
  margin: 8px auto 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
