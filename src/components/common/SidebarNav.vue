<template>
  <div class="column full-height no-wrap">
    <div class="q-pa-md">
      <div class="text-primary text-weight-bold text-h6">NUMA</div>
    </div>

    <q-list class="col">
      <q-item
        v-for="item in navItems"
        :key="item.name"
        clickable
        v-ripple
        :to="{ name: item.name }"
        :active="route.name === item.name"
        active-class="text-primary bg-blue-1"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" />
        </q-item-section>
        <q-item-section>{{ item.label }}</q-item-section>
      </q-item>
    </q-list>

    <q-separator />

    <q-item clickable v-ripple class="q-py-md">
      <q-item-section avatar>
        <q-avatar color="primary" text-color="white" size="32px">
          {{ user.initial }}
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ user.name }}</q-item-label>
        <q-item-label caption>{{ planLabel }}</q-item-label>
      </q-item-section>

      <q-menu anchor="top end" self="bottom end">
        <q-list style="min-width: 180px">
          <q-item clickable v-close-popup :to="{ name: 'profile' }">
            <q-item-section>Perfil</q-item-section>
          </q-item>
          <q-item clickable v-close-popup :to="{ name: 'my-recipes' }">
            <q-item-section>Mis recetas</q-item-section>
          </q-item>
          <q-item clickable v-close-popup :to="{ name: 'favorites' }">
            <q-item-section>Favoritos</q-item-section>
          </q-item>
          <q-item clickable v-close-popup :to="{ name: 'upload-recipe' }">
            <q-item-section>Subir receta</q-item-section>
          </q-item>
          <q-item clickable v-close-popup :to="{ name: 'settings' }">
            <q-item-section>Configuración</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-close-popup @click="$emit('logout')">
            <q-item-section class="text-red">Cerrar sesión</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-item>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface SidebarNavUser {
  name: string
  initial: string
  plan: 'free' | 'pro' | 'family'
}

const props = defineProps<{ user: SidebarNavUser }>()

defineEmits<{ logout: [] }>()

const route = useRoute()

const navItems = [
  { name: 'home', label: 'Inicio', icon: 'home' },
  { name: 'inventory', label: 'Inventario', icon: 'kitchen' },
  { name: 'recipes', label: 'Recetas', icon: 'menu_book' },
  { name: 'week', label: 'Semana', icon: 'calendar_month' },
  { name: 'shopping', label: 'Compras', icon: 'shopping_cart' },
]

const PLAN_LABEL: Record<SidebarNavUser['plan'], string> = {
  free: 'Plan Free',
  pro: 'Plan Pro',
  family: 'Plan Family',
}

const planLabel = computed(() => PLAN_LABEL[props.user.plan])
</script>
