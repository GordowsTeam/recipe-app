<template>
  <q-page class="page-container">
    <h6>Buscar Recetas</h6>
    <q-separator />
    <div class="q-pa-md">
      <recipe-search></recipe-search>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import RecipeSearch from 'src/components/recipe-search/RecipeSearch.vue'
</script>

<style scoped>
.page-container {
  padding: 24px;
}
</style>
