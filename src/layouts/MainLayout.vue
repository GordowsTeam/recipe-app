<template>
  <q-layout view="lHh Lpr lFf" :class="primaryColorClass">
    <q-header elevated>
      <q-toolbar>
        <!-- NUMA como botón que abre menú (solo si está autenticado) -->
        <template v-if="isAuthenticated">
          <div class="numa-menu-wrapper">
            <q-btn
              ref="numaTriggerRef"
              flat
              no-caps
              class="numa-brand-btn"
              padding="sm"
            >
              <span class="text-weight-bold">NUMA</span>
              <q-icon name="expand_more" size="xs" class="q-ml-xs" />
            </q-btn>
            <q-menu
              v-model="menuNuma"
              :target="numaTriggerEl"
              anchor="bottom left"
              self="top left"
              :offset="[0, 8]"
              class="numa-menu"
            >
            <q-list style="min-width: 220px">
              <q-item clickable v-close-popup @click="goToProfile">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>Perfil</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="configOpen = true">
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>
                <q-item-section>Configuración</q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" size="xs" />
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar>
                  <q-icon name="logout" color="primary" />
                </q-item-section>
                <q-item-section>Cerrar sesión</q-item-section>
              </q-item>
            </q-list>
            </q-menu>
          </div>
        </template>
        <q-toolbar-title v-else> NUMA </q-toolbar-title>
        <!-- Tabs superior: solo en web (no móvil) -->
        <q-tabs
          v-if="isAuthenticated && !isMobile"
          v-model="tab"
          inline-label
          class="main-nav-tabs"
          align="left"
        >
          <q-route-tab to="/" name="home" label="Inicio" icon="home" />
          <q-route-tab to="/my-search" name="my-search" label="Buscar" icon="search" />
        </q-tabs>
        <q-space />
        <!-- Logout solo en móvil (en web está dentro del menú NUMA) -->
        <q-btn
          v-if="isAuthenticated && isMobile"
          label="Salir"
          color="primary"
          @click="logout"
          flat
        />
      </q-toolbar>
    </q-header>

    <!-- Diálogo de configuración (tema + color) -->
    <q-dialog v-model="configOpen" position="standard">
      <q-card class="config-card">
        <q-card-section class="row items-center q-pb-none">
          <h6 class="q-ma-none">Configuración</h6>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <div class="config-section">
            <div class="text-subtitle2 q-mb-sm">Tema</div>
            <q-option-group
              v-model="themeMode"
              :options="themeOptions"
              color="primary"
              inline
              @update:model-value="applyTheme"
            />
          </div>
          <q-separator class="q-my-md" />
          <div class="config-section">
            <div class="text-subtitle2 q-mb-sm">Color primario</div>
            <div class="color-options row q-gutter-sm">
              <q-btn
                v-for="opt in colorOptions"
                :key="opt.value"
                round
                :color="opt.value"
                size="md"
                :outline="primaryColor !== opt.value"
                :flat="primaryColor !== opt.value"
                @click="applyPrimaryColor(opt.value)"
              >
                <q-tooltip>{{ opt.label }}</q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Menú inferior: solo en móvil (Android/web móvil) -->
    <q-footer v-if="isAuthenticated && isMobile" elevated class="main-footer">
      <q-tabs
        v-model="tab"
        dense
        class="main-nav-tabs bottom-tabs"
        active-color="primary"
        indicator-color="primary"
      >
        <q-route-tab to="/" name="home" label="Inicio" icon="home" />
        <q-route-tab to="/my-search" name="my-search" label="Buscar" icon="search" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { parseJwt, logout, refreshTokens } from 'boot/cognito'
import { onMounted, onBeforeUnmount } from 'vue'

const $q = useQuasar()
const route = useRoute()

const navTabNames = ['home', 'my-search'] as const
const isMobile = computed(() => $q.platform?.is?.mobile ?? false)
const tab = ref<string>(
  navTabNames.includes(route.name as string) ? (route.name as string) : 'home'
)
watch(
  () => route.name,
  (name) => {
    tab.value = navTabNames.includes(name as string) ? (name as string) : 'home'
  }
)

const token = ref<string | null>(localStorage.getItem('id_token'))

// Menú NUMA y configuración
const menuNuma = ref(false)
const configOpen = ref(false)
const numaTriggerRef = ref<{ $el: HTMLElement } | null>(null)
const numaTriggerEl = computed(() => numaTriggerRef.value?.$el ?? false)

const STORAGE_THEME = 'numa_theme'
const STORAGE_COLOR = 'numa_primary_color'

type ThemeMode = 'light' | 'dark' | 'auto'
const themeMode = ref<ThemeMode>((localStorage.getItem(STORAGE_THEME) as ThemeMode) || 'auto')
const themeOptions = [
  { label: 'Claro', value: 'light' },
  { label: 'Oscuro', value: 'dark' },
  { label: 'Sistema', value: 'auto' }
]

const colorOptions = [
  { value: 'primary', label: 'Azul' },
  { value: 'teal', label: 'Verde azulado' },
  { value: 'green', label: 'Verde' },
  { value: 'purple', label: 'Morado' }
] as const
const primaryColor = ref<string>(localStorage.getItem(STORAGE_COLOR) || 'primary')
const primaryColorClass = computed(() => `primary-${primaryColor.value}`)

function applyTheme(mode: ThemeMode) {
  localStorage.setItem(STORAGE_THEME, mode)
  const isDark =
    mode === 'dark' || (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  $q.dark?.set(isDark)
}

function applyPrimaryColor(color: string) {
  primaryColor.value = color
  localStorage.setItem(STORAGE_COLOR, color)
}

function goToProfile() {
  // Futura ruta /perfil; por ahora no navegamos
  $q.notify?.({ message: 'Perfil (próximamente)', color: 'primary', icon: 'person' })
}

const isAuthenticated = computed(() => {
  if (!token.value) return false
  const user = parseJwt(token.value)
  const exp = user?.exp
  return exp && exp * 1000 > Date.now()
})

// Idle logout logic
let idleTimeout: ReturnType<typeof setTimeout>
const IDLE_LIMIT = 15 * 60 * 1000 // 15 minutes
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

// Refresh token logic
const checkAndRefreshToken = async () => {
  const idToken = localStorage.getItem('id_token')
  const payload = parseJwt(idToken)
  
  console.log('Checking token expiration:', payload)

  if (!payload || !payload.exp) return

  const now = Math.floor(Date.now() / 1000)
  const expiresIn = payload.exp - now

  if (expiresIn < 300) { // if less than 5 min
    try {
      await refreshTokens()
      token.value = localStorage.getItem('id_token')
      console.log('Token refreshed!')
    } catch (err) {
      console.error('Failed to refresh token:', err)
      logout()
    }
  }
}

onMounted(() => {
  applyTheme(themeMode.value)
  // Set the token on load
  token.value = localStorage.getItem('id_token')

  // Watch for token changes
  const tokenSyncInterval = setInterval(() => {
    token.value = localStorage.getItem('id_token')
  }, 2000)

   // Check and refresh every 2 minutes
   const tokenRefreshInterval = setInterval(() => {
    checkAndRefreshToken().catch(err => {
    console.error('Token refresh error:', err)
  })
  }, 2 * 60 * 1000)

 // Set up idle timeout
 activityEvents.forEach(e => window.addEventListener(e, resetIdleTimer))
  resetIdleTimer()

  // Clean up
  onBeforeUnmount(() => {
    clearInterval(tokenSyncInterval)
    clearInterval(tokenRefreshInterval)
    activityEvents.forEach(e => window.removeEventListener(e, resetIdleTimer))
    clearTimeout(idleTimeout)
  })
})
</script>

<style scoped>
.main-nav-tabs {
  min-height: 48px;
}

.main-nav-tabs :deep(.q-tab) {
  min-height: 48px;
}

.main-footer {
  background: var(--q-dark-page, #fff);
}

.main-footer.bottom-tabs :deep(.q-tabs__content) {
  justify-content: space-around;
}

.main-footer :deep(.q-tab) {
  flex: 1;
  max-width: none;
}

.numa-menu-wrapper {
  display: inline-flex;
}

.numa-brand-btn {
  font-size: 1.1rem;
}

.numa-menu .q-item {
  min-height: 40px;
}

.config-card {
  min-width: 320px;
}

.config-section .color-options .q-btn {
  width: 40px;
  height: 40px;
}
</style>