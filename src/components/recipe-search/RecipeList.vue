<template>
  <div>
    <!-- Loader Skeleton -->
    <div v-if="loading" class="recipe-list">
      <q-skeleton
        v-for="i in 6"
        :key="i"
        type="rect"
        animation="wave"
        class="skeleton-card"
      />
    </div>

    <div v-else class="recipe-list">
      <q-card
        v-for="recipe in paginatedRecipes"
        :key="recipe.name"
        class="recipe-card q-mb-md"
        @click="viewRecipe(recipe)"
      >
        <div class="relative-position img-container">
          <q-img
            v-if="recipe.images?.length"
            :src="recipe.images.find(img => img.main)?.url"
            class="recipe-img"
          />

          <!-- NEW: Title Always Visible -->
          <div class="title-always-visible">
            {{ recipe.name }}
          </div>

          <!-- Hover Overlay -->
          <div class="overlay">
            <div class="overlay-content">
              <div class="text-caption ellipsis-3-lines">
                {{ recipe.description }}
              </div>
            </div>
          </div>

          <!-- Badges -->
          <div class="badge-container">
            <q-badge color="orange" transparent>
              <q-icon name="schedule" size="16px" class="q-mr-xs" />
              {{ recipe.totalTime }} min
            </q-badge>

            <q-badge color="blue" transparent>
              <q-icon name="whatshot" size="16px" class="q-mr-xs" />
              {{ recipe.calories }} cal
            </q-badge>
          </div>
        </div>

        <!-- Card Footer -->
        <q-card-actions align="around">
          <q-btn
            flat
            round
            :color="recipe.isFavorite ? 'red' : 'grey'"
            :icon="recipe.isFavorite ? 'favorite' : 'favorite_border'"
            @click.stop="onToggleFavorite(recipe)"
          />

          <q-btn
            flat
            round
            :color="recipe.isSaved ? 'accent' : 'grey'"
            :icon="recipe.isSaved ? 'bookmark' : 'bookmark_border'"
            @click.stop="toggleSaved(recipe)"
          />

          <q-btn
            flat
            round
            color="primary"
            icon="share"
            @click.stop="shareRecipe(recipe)"
          />
          <q-btn
            v-if="showRemoveFromMyRecipes"
            flat
            round
            color="negative"
            icon="remove_circle_outline"
            @click.stop="emitRemoveFromMyRecipes(recipe)"
          />
        </q-card-actions>
      </q-card>
    </div>

    <q-pagination
      v-model="currentPage"
      :max="totalPages"
      boundary-numbers
      class="q-mt-md"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import type { Recipe } from '../../interfaces/RecipeResponse'
import { useRecipeFavorites } from 'src/composables/useRecipeFavorites'

const props = withDefaults(
  defineProps<{ recipes: Recipe[]; showRemoveFromMyRecipes?: boolean }>(),
  { showRemoveFromMyRecipes: false }
)
const emit = defineEmits<{
  (e: 'remove-from-my-recipes', recipe: Recipe): void
  (e: 'favorite-toggled', recipe: Recipe, isFavorite: boolean): void
}>()
const router = useRouter()
const { toggleFavorite, toggleSaved } = useRecipeFavorites()

const onToggleFavorite = async (recipe: Recipe) => {
  try {
    const newState = await toggleFavorite(recipe)
    emit('favorite-toggled', recipe, newState)
    Notify.create({ type: 'positive', message: newState ? 'Added to favorites' : 'Removed from favorites' })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to update favorite'
    Notify.create({ type: 'negative', message: msg })
  }
}

const emitRemoveFromMyRecipes = (recipe: Recipe) => {
  emit('remove-from-my-recipes', recipe)
}

const currentPage = ref(1)
const itemsPerPage = 6
const loading = ref(false)

const totalPages = computed(() =>
  Math.ceil(props.recipes.length / itemsPerPage)
)

const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return props.recipes.slice(start, start + itemsPerPage)
})

const viewRecipe = (recipe: Recipe) => {
  const id = recipe.id ?? (recipe as { Id?: string }).Id
  if (!id) return
  const sourceTypeId = '2'
  void router.push({
    name: 'recipe-detail',
    params: { id },
    query: { sourceTypeId }
  })
}

const shareRecipe = (recipe: Recipe) => {
  if (navigator.share) {
    void navigator
      .share({
        title: recipe.name,
        url: window.location.href
      })
      .catch(err => {
        console.error('Share failed:', err)
      })
  }
}
</script>

<style scoped>
.recipe-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 18px;
  padding: 16px;
}

.img-container {
  height: 260px;
  overflow: hidden;
  border-radius: 12px;
  position: relative;
}

/* NEW: Always-visible title */
.title-always-visible {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px 12px;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);
  z-index: 5;
}

.recipe-img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recipe-card:hover .recipe-img {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.55), transparent);
  opacity: 0;
  transition: opacity 0.25s ease;
  display: flex;
  align-items: flex-end;
  padding-bottom: 40px;
}

.recipe-card:hover .overlay {
  opacity: 1;
}

.overlay-content {
  padding: 12px;
  color: white;
  z-index: 6;
}

.badge-container {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 7;
}

.skeleton-card {
  width: 300px;
  height: 260px;
  border-radius: 12px;
}

.ellipsis-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
