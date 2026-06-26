<template>
  <div class="column full-height">
    <q-list padding class="col">
      <q-item
        v-for="item in navItems"
        :key="item.route"
        clickable
        v-ripple
        :active="isActive(item.route)"
        active-class="text-primary bg-blue-1"
        class="rounded-borders q-mb-xs"
        @click="navigate(item.route)"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" />
        </q-item-section>
        <q-item-section>{{ item.label }}</q-item-section>
      </q-item>
    </q-list>

    <q-separator />
    <div class="q-pa-md row items-center q-gutter-sm no-wrap">
      <q-avatar color="primary" text-color="white" size="36px">S</q-avatar>
      <div class="col ellipsis">
        <div class="text-subtitle2">Sofía</div>
        <div class="text-caption text-grey-6">Plan gratuito</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navItems = [
  { label: 'Inicio', icon: 'home', route: '/' },
  { label: 'Home', icon: 'home', route: '/home-new' },
  { label: 'Inventario', icon: 'inventory_2', route: '/inventory' },
  { label: 'Recetas', icon: 'menu_book', route: '/recipes' },
  { label: 'Semana', icon: 'calendar_today', route: '/week' },
  { label: 'Compras', icon: 'shopping_cart', route: '/shopping' }
]

const isActive = (itemRoute: string) => route.path === itemRoute

const navigate = (path: string) => {
  router.push(path).catch(() => {})
}
</script>
