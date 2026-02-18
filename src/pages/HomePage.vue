<template>
  <q-page class="page-container home-page">
    <div class="home-content">
      <h5 class="home-title">Bienvenido a NUMA</h5>
      <p class="home-subtitle">Tu app de recetas</p>
      <q-separator class="q-my-md" />
      <p class="home-description">
        Explora recetas, guarda tus favoritas y busca por ingredientes.
        Usa el menú para ir a <router-link to="/my-search" class="link">Buscar recetas</router-link>.
      </p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
//
</script>

<style scoped>
.home-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.home-content {
  text-align: center;
  max-width: 480px;
}

.home-title {
  margin: 0;
  font-weight: 600;
}

.home-subtitle {
  margin: 0.5rem 0 0;
  opacity: 0.85;
}

.home-description {
  margin: 0;
  line-height: 1.6;
  opacity: 0.9;
}

.link {
  color: var(--q-primary);
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}
</style>
