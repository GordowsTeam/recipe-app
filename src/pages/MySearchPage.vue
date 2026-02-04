<template>
  <q-page class="page-container">
    <q-separator />
    <div class="q-pa-md">
      <recipe-search></recipe-search>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import RecipeSearch from 'src/components/recipe-search/RecipeSearch.vue'

defineOptions({ name: 'MySearchPage' })
</script>

<style scoped>
.page-container {
  padding: 24px;
}
</style>
