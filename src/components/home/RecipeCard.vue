<template>
  <div class="recipe-card" @click="$emit('click')">
    <div class="card-image-wrap">
      <q-img
        v-if="imageUrl"
        :src="imageUrl"
        ratio="1"
        class="card-image"
        alt=""
      />
      <div v-else class="card-image card-image-placeholder">
        <q-icon name="restaurant" size="32px" color="grey-5" />
      </div>
      <div class="card-overlay">
        <span class="card-name">{{ recipe.name }}</span>
        <span v-if="subtitle" class="card-subtitle">{{ subtitle }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Recipe } from 'src/interfaces/RecipeResponse'

const props = withDefaults(
  defineProps<{
    recipe: Recipe
    subtitle?: string
  }>(),
  { subtitle: '' }
)

defineEmits<{ click: [] }>()

const imageUrl = computed(() => {
  const imgs = props.recipe.images
  if (!imgs?.length) return ''
  const main = imgs.find((i) => i.main)
  return main?.url || imgs[0]?.url || ''
})
</script>

<style scoped>
.recipe-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  background: #fff;
}

.body--dark .recipe-card {
  background: var(--q-dark, #1d1d1d);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.recipe-card:active {
  transform: scale(0.98);
}

.card-image-wrap {
  position: relative;
  width: 100%;
}

.card-image {
  width: 100%;
  display: block;
}

.card-image-placeholder {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eee;
}

.body--dark .card-image-placeholder {
  background: rgba(255, 255, 255, 0.06);
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 10px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #fff;
}

.card-name {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.3;
}

.card-subtitle {
  display: block;
  font-size: 0.75rem;
  opacity: 0.9;
  margin-top: 2px;
}
</style>
