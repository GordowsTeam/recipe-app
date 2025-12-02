<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white text-dark">
      <q-toolbar>

        <!-- LOGO / BRAND -->
        <q-toolbar-title class="text-primary text-weight-bold">
          NUMA
        </q-toolbar-title>

        <!-- NAV OPTIONS (only if logged in) -->
        <div v-if="isAuthenticated" class="row items-center q-gutter-sm">

          <!-- Favorites -->
          <q-btn flat round icon="favorite" @click="goTo('favorites')" />

          <!-- My Recipes -->
          <q-btn flat round icon="restaurant_menu" @click="goTo('my-recipes')" />

          <!-- Upload Recipe -->
          <q-btn flat round icon="upload" @click="goTo('upload-recipe')" />

          <!-- Profile Menu -->
          <q-btn flat round icon="account_circle">
            <q-menu anchor="bottom right" self="top right">
              <q-list style="min-width: 150px">
                <q-item clickable @click="goTo('profile')">
                  <q-item-section>Perfil</q-item-section>
                </q-item>

                <q-item clickable @click="goTo('settings')">
                  <q-item-section>Configuración</q-item-section>
                </q-item>

                <q-separator />

                <q-item clickable @click="logout">
                  <q-item-section class="text-red">Cerrar sesión</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>

        <!-- LOGIN BUTTON (if not logged in) -->
        <q-btn
          v-else
          label="Login"
          color="primary"
          flat
          @click="goTo('login')"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { parseJwt, logout, refreshTokens } from 'boot/cognito'

const router = useRouter()

const goTo = (routeName: string) => {
  router.push({ name: routeName }).catch(() => {})
}

const token = ref<string | null>(localStorage.getItem('id_token'))

const isAuthenticated = computed(() => {
  if (!token.value) return false
  const user = parseJwt(token.value)
  return user?.exp && user.exp * 1000 > Date.now()
})

/* -------------------------
      IDLE LOGOUT LOGIC
--------------------------*/
let idleTimeout: ReturnType<typeof setTimeout>
const IDLE_LIMIT = 15 * 60 * 1000 // 15 min

const resetIdleTimer = () => {
  clearTimeout(idleTimeout)
  idleTimeout = setTimeout(() => {
    console.log('Idle timeout reached, logging out')
    localStorage.removeItem('id_token')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    logout()
  }, IDLE_LIMIT)
}

const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart']

/* -------------------------
     REFRESH TOKEN LOGIC
--------------------------*/
const checkAndRefreshToken = async () => {
  const idToken = localStorage.getItem('id_token')
  const payload = parseJwt(idToken)

  if (!payload?.exp) return

  const now = Math.floor(Date.now() / 1000)
  const expiresIn = payload.exp - now

  if (expiresIn < 300) { // 5 min
    try {
      await refreshTokens()
      token.value = localStorage.getItem('id_token')
    } catch (err) {
      console.error('Failed to refresh token:', err)
      logout()
    }
  }
}

/* -------------------------
          MOUNTING
--------------------------*/
onMounted(() => {
  // Keep token synced
  const tokenSyncInterval = setInterval(() => {
    token.value = localStorage.getItem('id_token')
  }, 2000)

  // Refresh token every 2 minutes
  const tokenRefreshInterval = setInterval(() => {
    checkAndRefreshToken().catch(err => console.error(err))
  }, 2 * 60 * 1000)

  // Idle logout
  activityEvents.forEach(e => window.addEventListener(e, resetIdleTimer))
  resetIdleTimer()

  // Cleanup
  onBeforeUnmount(() => {
    clearInterval(tokenSyncInterval)
    clearInterval(tokenRefreshInterval)
    activityEvents.forEach(e => window.removeEventListener(e, resetIdleTimer))
    clearTimeout(idleTimeout)
  })
})
</script>
