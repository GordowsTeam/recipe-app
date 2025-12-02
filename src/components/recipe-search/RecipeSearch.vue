<template>
  <div class="q-pa-md">

    <!-- Barra de búsqueda unificada -->
    <div class="row items-center q-gutter-sm">

      <q-input
        outlined
        v-model="searchText"
        class="col"
        :label="modoBusqueda === 'ingrediente' ? 'Agregar ingrediente' : 'Buscar receta'"
        @keyup.enter="modoBusqueda === 'ingrediente' ? addIngredient() : getRecipe()"
      >

        <!-- PREPEND: Dropdown minimalista con iconos -->
        <template #prepend>
          <q-btn-dropdown
            flat
            dense
            round
            no-caps
            icon="more_vert"
            content-class="bg-white"
          >
            <q-list bordered separator>

              <q-item clickable v-close-popup @click="modoBusqueda = 'receta'">
                <q-item-section avatar>
                  <q-icon name="restaurant_menu" />
                </q-item-section>
                <q-item-section>Por Receta</q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="modoBusqueda = 'ingrediente'">
                <q-item-section avatar>
                  <q-icon name="spa" />
                </q-item-section>
                <q-item-section>Por Ingrediente</q-item-section>
              </q-item>

            </q-list>
          </q-btn-dropdown>
        </template>

        <!-- APPEND: Botones -->
        <template #append>

          <!-- Modo ingrediente: botón + -->
          <q-btn
            v-if="modoBusqueda === 'ingrediente'"
            dense flat round
            icon="add"
            color="primary"
            @click="addIngredient()"
          />

          <!-- Lupa para buscar -->
          <q-btn
            dense flat round
            icon="search"
            color="secondary"
            @click="getRecipe"
          />

        </template>

      </q-input>
    </div>

    <!-- Chips de ingredientes -->
    <div
      v-if="modoBusqueda === 'ingrediente' && listaIngredientes.length"
      class="q-mt-md row q-gutter-sm"
    >
      <q-chip
        v-for="i in listaIngredientes"
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

interface Ingredient {
  name: string
}

const modoBusqueda = ref<'receta' | 'ingrediente'>('receta')
const searchText = ref('')
const listaIngredientes = ref<Ingredient[]>([])

const recipes = ref([])
const loading = ref(false)

const addIngredient = () => {
  if (!searchText.value.trim()) return

  listaIngredientes.value.push({ name: searchText.value.trim() })
  searchText.value = ''

  Notify.create({ type: 'positive', message: 'Ingrediente agregado' })
}

const removeIngredient = (name: string) => {
  listaIngredientes.value = listaIngredientes.value.filter(i => i.name !== name)
  Notify.create({ type: 'info', message: 'Ingrediente eliminado' })
}

const getRecipe = async () => {
  loading.value = true

  try {
    const url = import.meta.env.VITE_API_URL
    const endpoint = 'api/recipe'
    const token = localStorage.getItem('id_token')

    const ingredients =
      modoBusqueda.value === 'ingrediente'
        ? listaIngredientes.value.map(i => i.name)
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
    Notify.create({ type: 'negative', message: 'Error al obtener recetas' })
  }

  loading.value = false
}
</script>
