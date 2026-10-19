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
          :key="item.routeName"
          :to="{ name: item.routeName }"
          :icon="item.icon"
          :label="item.label"
        />
        <q-tab icon="account_circle" label="Cuenta">
          <q-menu anchor="top end" self="bottom end">
            <q-list style="min-width: 180px">
              <q-item
                v-for="item in accountItems"
                :key="item.routeName"
                clickable
                v-close-popup
                :to="{ name: item.routeName }"
              >
                <q-item-section>{{ item.label }}</q-item-section>
              </q-item>
              <q-separator v-if="accountItems.length" />
              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section class="text-red">Cerrar sesión</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-tab>
      </q-tabs>
    </q-footer>

    <component :is="DevPanel" v-if="DevPanel" />
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { clearPkceVerifier, logout as cognitoLogout, parseJwt, refreshTokens } from 'boot/cognito'
import { useRecipeFavorites } from 'src/composables/useRecipeFavorites'
import SidebarNav from 'src/components/common/SidebarNav.vue'
import { accountNavItems, mainNavItems } from 'src/config/navigation'
import { isPageEnabled } from 'src/composables/useFeatureFlags'
import { mockHomeGreeting } from 'src/mocks/handlers/home.handler'

const router = useRouter()

// Panel de flags solo en test. La condición usa import.meta.env directamente
// para que Vite la resuelva en build y el chunk del DevPanel no exista en
// staging/producción.
const DevPanel =
  import.meta.env.VITE_ENV === 'test'
    ? defineAsyncComponent(() => import('src/components/dev/DevPanel.vue'))
    : null

// Solo las páginas habilitadas por feature flag (src/config/flags.*.ts → pages)
const navItems = mainNavItems.filter((item) => isPageEnabled(item.page))
const accountItems = accountNavItems.filter((item) => isPageEnabled(item.page))

// Placeholder hasta integrar el usuario real de la casa (ver docs/Numa_Features_Context.md)
const sidebarUser = mockHomeGreeting.user

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
