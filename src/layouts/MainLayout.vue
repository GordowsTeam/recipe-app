<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      v-if="$q.screen.gt.sm"
      :model-value="true"
      :width="200"
      show-if-above
      bordered
      persistent
    >
      <SidebarNav :user="sidebarUser" @logout="handleLogout" />
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive :include="['MySearchPage', 'HomePage']">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>

    <q-footer v-if="$q.screen.lt.md" bordered class="bg-white">
      <q-tabs
        indicator-color="primary"
        active-color="primary"
        inactive-color="grey-7"
        dense
      >
        <q-route-tab
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          :icon="item.icon"
          :label="item.label"
        />
        <q-tab icon="account_circle" label="Cuenta">
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
              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section class="text-red">Cerrar sesión</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-tab>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { clearPkceVerifier, logout as cognitoLogout, parseJwt, refreshTokens } from 'boot/cognito'
import { useRecipeFavorites } from 'src/composables/useRecipeFavorites'
import SidebarNav from 'src/components/common/SidebarNav.vue'
import { mockUser } from 'src/mocks/home.mock'

const router = useRouter()

const navItems = [
  { name: 'home', label: 'Inicio', icon: 'home' },
  { name: 'inventory', label: 'Inventario', icon: 'kitchen' },
  { name: 'recipes', label: 'Recetas', icon: 'menu_book' },
  { name: 'week', label: 'Semana', icon: 'calendar_month' },
  { name: 'shopping', label: 'Compras', icon: 'shopping_cart' },
]

// Placeholder hasta integrar el usuario real de la casa (ver docs/Numa_Features_Context.md)
const sidebarUser = mockUser

const clearAuthTokens = (): void => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('id_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('expires_at')
  clearPkceVerifier()
  token.value = null
}

const handleLogout = (): void => {
  clearAuthTokens()
  void router.replace('/login')
  cognitoLogout()
}

/* AUTH */
const token = ref<string | null>(localStorage.getItem('id_token'))
const isAuthenticated = computed(() => {
  if (!token.value) return false
  const user = parseJwt(token.value)
  return user?.exp && user.exp * 1000 > Date.now()
})

const { fetchFavorites } = useRecipeFavorites()
watch(
  isAuthenticated,
  (auth) => {
    if (auth) void fetchFavorites()
  },
  { immediate: true }
)

/* IDLE + REFRESH */
let idleTimeout: ReturnType<typeof setTimeout>
const IDLE_LIMIT = 15 * 60 * 1000

const resetIdleTimer = () => {
  clearTimeout(idleTimeout)
  idleTimeout = setTimeout(() => handleLogout(), IDLE_LIMIT)
}

const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart']

const checkAndRefreshToken = async (): Promise<void> => {
  const payload = parseJwt(localStorage.getItem('id_token'))
  if (!payload?.exp) return

  if (payload.exp - Math.floor(Date.now() / 1000) < 300) {
    await refreshTokens()
    token.value = localStorage.getItem('id_token')
  }
}

onMounted(() => {
  activityEvents.forEach(e => window.addEventListener(e, resetIdleTimer))
  resetIdleTimer()

  setInterval(() => {
    void checkAndRefreshToken()
  }, 2 * 60 * 1000)
})

onBeforeUnmount(() => {
  activityEvents.forEach(e => window.removeEventListener(e, resetIdleTimer))
})
</script>
