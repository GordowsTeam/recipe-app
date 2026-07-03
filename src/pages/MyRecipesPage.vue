<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5">Mis recetas</div>
      <q-btn
        v-if="isAuthenticated"
        unelevated
        color="primary"
        icon="add"
        label="Crear nueva receta"
        no-caps
        @click="showCreateDialog = true"
      />
    </div>

    <q-banner v-if="error" class="bg-negative text-white q-mb-md rounded-borders">
      <template #avatar>
        <q-icon name="error" />
      </template>
      {{ error }}
      <template #action>
        <q-btn flat dense label="Reintentar" @click="loadMyRecipes" />
      </template>
    </q-banner>

    <div v-else-if="!isAuthenticated" class="text-body1 text-grey-7">
      Inicia sesión para ver y gestionar tus recetas.
    </div>

    <template v-else>
      <q-spinner v-if="loading" size="48px" color="primary" class="q-mt-lg" />
      <template v-else>
        <div v-if="recipes.length === 0" class="text-body1 text-grey-7">
          Aún no has añadido recetas. Crea una nueva o búscala y añádela desde la página de detalle.
        </div>
        <recipe-list
          v-else
          :recipes="recipes"
          show-remove-from-my-recipes
          @remove-from-my-recipes="onRemoveFromMyRecipes"
        />
      </template>
    </template>

    <!-- Create recipe dialog -->
    <q-dialog v-model="showCreateDialog" persistent>
      <q-card class="create-dialog-card">
        <q-card-section>
          <div class="text-h6">Crear nueva receta</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md" @submit="onCreateRecipe">
            <q-input
              v-model="createForm.name"
              outlined
              label="Nombre de la receta *"
              :rules="[(v) => !!v?.trim() || 'El nombre es obligatorio']"
              lazy-rules
            />
            <q-input
              v-model="createForm.description"
              outlined
              type="textarea"
              label="Descripción (opcional)"
              rows="2"
            />
            <div>
              <div class="text-subtitle2 q-mb-xs">Ingredientes (uno por línea)</div>
              <q-input
                v-model="createForm.ingredientsText"
                outlined
                type="textarea"
                placeholder="p. ej. 2 tazas de harina&#10;1 taza de azúcar"
                rows="4"
              />
            </div>
            <div>
              <div class="text-subtitle2 q-mb-xs">Instrucciones (un paso por línea)</div>
              <q-input
                v-model="createForm.directionsText"
                outlined
                type="textarea"
                placeholder="p. ej. Mezcla los ingredientes secos&#10;Hornea a 180 °C durante 30 min"
                rows="4"
              />
            </div>
            <div class="row q-gutter-md">
              <q-input
                v-model.number="createForm.totalTime"
                outlined
                type="number"
                label="Tiempo total (min)"
                min="0"
                style="max-width: 140px"
              />
              <q-input
                v-model.number="createForm.calories"
                outlined
                type="number"
                label="Calorías"
                min="0"
                style="max-width: 140px"
              />
            </div>
            <q-card-actions align="right" class="q-pt-md">
              <q-btn flat label="Cancelar" color="grey" v-close-popup />
              <q-btn unelevated type="submit" color="primary" label="Crear" :loading="creating" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Notify } from 'quasar'
import type { Recipe } from 'src/interfaces/RecipeResponse'
import { getMyRecipes, removeMyRecipe, createMyRecipe, type CreateUserRecipeRequest } from 'src/api/recipe'
import { useRecipeFavorites } from 'src/composables/useRecipeFavorites'
import { useRecipeListFilters } from 'src/components/recipe-search/filters/useRecipeListFilters'
import { parseJwt } from 'boot/cognito'
import RecipeList from 'src/components/recipe-search/RecipeList.vue'

const { applyToRecipe } = useRecipeFavorites()
const { clearFilters } = useRecipeListFilters()

const recipes = ref<Recipe[]>([])
const loading = ref(true)
const error = ref('')
const showCreateDialog = ref(false)
const creating = ref(false)

const createForm = ref({
  name: '',
  description: '',
  ingredientsText: '',
  directionsText: '',
  totalTime: 0,
  calories: 0
})

const token = computed(() => localStorage.getItem('id_token'))
const isAuthenticated = computed(() => {
  const payload = parseJwt(token.value)
  return payload?.sub != null
})

const loadMyRecipes = async () => {
  if (!isAuthenticated.value) return
  loading.value = true
  error.value = ''
  try {
    const list = await getMyRecipes()
    list.forEach(applyToRecipe)
    recipes.value = list
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'No se pudieron cargar mis recetas'
    error.value = msg
  } finally {
    loading.value = false
  }
}

const onRemoveFromMyRecipes = async (recipe: Recipe) => {
  try {
    await removeMyRecipe(recipe.id)
    recipes.value = recipes.value.filter((r) => r.id !== recipe.id)
    Notify.create({ type: 'positive', message: 'Eliminado de mis recetas' })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'No se pudo eliminar la receta'
    Notify.create({ type: 'negative', message: msg })
  }
}

const onCreateRecipe = async () => {
  const name = createForm.value.name?.trim()
  if (!name) {
    Notify.create({ type: 'negative', message: 'El nombre de la receta es obligatorio' })
    return
  }
  const ingredients = createForm.value.ingredientsText
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
  const directions = createForm.value.directionsText
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  const desc = createForm.value.description?.trim()
  const request: CreateUserRecipeRequest = {
    name,
    ...(desc ? { description: desc } : {}),
    ingredients,
    directions,
    totalTime: createForm.value.totalTime ?? 0,
    calories: createForm.value.calories ?? 0
  }

  creating.value = true
  try {
    const created = await createMyRecipe(request)
    applyToRecipe(created)
    recipes.value = [created, ...recipes.value]
    showCreateDialog.value = false
    createForm.value = {
      name: '',
      description: '',
      ingredientsText: '',
      directionsText: '',
      totalTime: 0,
      calories: 0
    }
    Notify.create({ type: 'positive', message: 'Receta creada' })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'No se pudo crear la receta'
    Notify.create({ type: 'negative', message: msg })
  } finally {
    creating.value = false
  }
}

onMounted(() => {
  clearFilters()
  if (isAuthenticated.value) void loadMyRecipes()
  else loading.value = false
})
</script>

<style scoped>
.create-dialog-card {
  min-width: 400px;
  max-width: 560px;
}
</style>
