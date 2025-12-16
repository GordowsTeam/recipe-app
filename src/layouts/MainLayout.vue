<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white text-dark">
      <q-toolbar class="items-start">

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

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { parseJwt, logout, refreshTokens } from 'boot/cognito'

interface Ingredient {
  name: string
}

interface SearchEventDetail {
  searchMode: 'recipe' | 'ingredient'
  searchText: string
  ingredientList: Ingredient[]
}

const router = useRouter()
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
