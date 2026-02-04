<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white text-dark">
      <q-toolbar class="items-start">

        <!-- MENU BUTTON -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          class="q-mr-sm"
        />

        <!-- LEFT BLOCK: LOGO + SEARCH -->
        <div class="row items-center no-wrap q-gutter-md">

          <!-- LOGO / BRAND -->
          <q-toolbar-title class="text-primary text-weight-bold">
            NUMA
          </q-toolbar-title>

          <!-- SEARCH + CHIPS -->
          <div class="search-wrapper">

            <!-- SEARCH BAR -->
            <q-input
              outlined
              dense
              v-model="searchText"
              :label="searchMode === 'ingredient' ? 'Add ingredient' : 'Search recipe'"
              @keyup.enter="searchMode === 'ingredient' ? addIngredient() : triggerSearch()"
            >
              <template #prepend>
                <q-btn-dropdown flat dense round icon="more_vert">
                  <q-list bordered separator>
                    <q-item clickable v-close-popup @click="searchMode = 'recipe'">
                      <q-item-section avatar>
                        <q-icon name="restaurant_menu" />
                      </q-item-section>
                      <q-item-section>By Recipe</q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="searchMode = 'ingredient'">
                      <q-item-section avatar>
                        <q-icon name="spa" />
                      </q-item-section>
                      <q-item-section>By Ingredient</q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </template>

              <template #append>
                <q-btn
                  v-if="searchMode === 'ingredient'"
                  dense
                  flat
                  round
                  icon="add"
                  color="primary"
                  @click="addIngredient"
                />
                <q-btn
                  dense
                  flat
                  round
                  icon="search"
                  color="secondary"
                  @click="triggerSearch"
                />
              </template>
            </q-input>

            <!-- INGREDIENT CHIPS -->
            <div
              v-if="searchMode === 'ingredient' && ingredientList.length"
              class="ingredients-row"
            >
              <q-chip
                v-for="i in ingredientList"
                :key="i.name"
                removable
                color="grey-3"
                text-color="black"
                @remove="removeIngredient(i.name)"
              >
                {{ i.name }}
              </q-chip>
            </div>
          </div>
        </div>

        <!-- SPACER -->
        <q-space />

        <!-- NAV OPTIONS -->
        <div v-if="isAuthenticated" class="row items-center q-gutter-sm">
          <q-btn flat round icon="favorite" @click="goTo('favorites')" />
          <q-btn flat round icon="restaurant_menu" @click="goTo('my-recipes')" />
          <q-btn flat round icon="upload" @click="goTo('upload-recipe')" />

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

        <q-btn
          v-else
          label="Login"
          color="primary"
          flat
          @click="goTo('login')"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          Navigation
        </q-item-label>
        <q-item clickable v-ripple @click="goTo('home')">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
            <q-item-label caption>Browse recipes</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goTo('favorites')" v-if="isAuthenticated">
          <q-item-section avatar>
            <q-icon name="favorite" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Favorites</q-item-label>
            <q-item-label caption>Your saved recipes</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goTo('my-recipes')" v-if="isAuthenticated">
          <q-item-section avatar>
            <q-icon name="restaurant_menu" />
          </q-item-section>
          <q-item-section>
            <q-item-label>My Recipes</q-item-label>
            <q-item-label caption>Your recipes</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goTo('upload-recipe')" v-if="isAuthenticated">
          <q-item-section avatar>
            <q-icon name="upload" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Upload Recipe</q-item-label>
            <q-item-label caption>Share your recipe</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item-label header class="text-grey-8" v-if="isAuthenticated">
          Account
        </q-item-label>
        <q-item clickable v-ripple @click="goTo('profile')" v-if="isAuthenticated">
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Profile</q-item-label>
            <q-item-label caption>View your profile</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goTo('settings')" v-if="isAuthenticated">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Settings</q-item-label>
            <q-item-label caption>App settings</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced v-if="isAuthenticated" />
        <q-item clickable v-ripple @click="logout" v-if="isAuthenticated">
          <q-item-section avatar>
            <q-icon name="logout" color="red" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-red">Logout</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goTo('login')" v-if="!isAuthenticated">
          <q-item-section avatar>
            <q-icon name="login" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Login</q-item-label>
            <q-item-label caption>Sign in to your account</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive :include="['MySearchPage']">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { parseJwt, logout, refreshTokens } from 'boot/cognito'
import { useRecipeFavorites } from 'src/composables/useRecipeFavorites'

interface Ingredient {
  name: string
}

interface SearchEventDetail {
  searchMode: 'recipe' | 'ingredient'
  searchText: string
  ingredientList: Ingredient[]
}

const route = useRoute()
const router = useRouter()
watch(() => route.path, () => {
  token.value = localStorage.getItem('id_token')
}, { immediate: false })
const goTo = (routeName: string) => {
  router.push({ name: routeName }).catch(() => {})
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

/* DRAWER STATE */
const leftDrawerOpen = ref(false)

/* SEARCH STATE */
const searchMode = ref<'recipe' | 'ingredient'>('recipe')
const searchText = ref('')
const ingredientList = ref<Ingredient[]>([])

const addIngredient = () => {
  if (!searchText.value.trim()) return
  ingredientList.value.push({ name: searchText.value.trim() })
  searchText.value = ''
  Notify.create({ type: 'positive', message: 'Ingredient added' })
}

const removeIngredient = (name: string) => {
  ingredientList.value = ingredientList.value.filter(i => i.name !== name)
  Notify.create({ type: 'info', message: 'Ingredient removed' })
}

const triggerSearch = () => {
  const detail: SearchEventDetail = {
    searchMode: searchMode.value,
    searchText: searchText.value,
    ingredientList: ingredientList.value
  }

  window.dispatchEvent(
    new CustomEvent<SearchEventDetail>('trigger-recipe-search', { detail })
  )
}

/* IDLE + REFRESH */
let idleTimeout: ReturnType<typeof setTimeout>
const IDLE_LIMIT = 15 * 60 * 1000

const resetIdleTimer = () => {
  clearTimeout(idleTimeout)
  idleTimeout = setTimeout(() => logout(), IDLE_LIMIT)
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

<style scoped>
.search-wrapper {
  width: 380px;
}

.ingredients-row {
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
