<template>
  <q-page class="q-pa-md">
    <!-- SIN CONEXIÓN -->
    <q-banner v-if="!isOnline" class="bg-warning text-white q-mb-md" dense rounded>
      <template #avatar>
        <q-icon name="wifi_off" />
      </template>
      Sin conexión. Estás viendo la última información disponible.
    </q-banner>

    <!-- Cada sección tiene su endpoint, su flag y sus propios estados
         (cargando / error / vacío / éxito); una falla no tumba a las demás. -->

    <!-- SALUDO · GET /api/home/greeting -->
    <template v-if="showGreeting">
      <q-skeleton
        v-if="greeting.isLoading.value"
        type="text"
        width="260px"
        height="40px"
        class="q-mb-md"
      />
      <div v-else class="q-mb-md">
        <div class="text-h5">
          {{ greetingText
          }}<template v-if="greeting.data.value">, {{ greeting.data.value.user.name }}</template>
        </div>
        <div v-if="greeting.isError.value" class="text-caption text-grey-7">
          No pudimos cargar tus datos ·
          <a href="#" class="text-primary" @click.prevent="greeting.refetch()">Reintentar</a>
        </div>
      </div>
    </template>

    <!-- AVISOS · GET /api/home/alerts -->
    <template v-if="showAlerts">
      <div v-if="alerts.isLoading.value" class="row q-col-gutter-md q-mb-md">
        <div v-for="n in 2" :key="n" class="col-12 col-sm-6">
          <q-skeleton height="72px" />
        </div>
      </div>
      <SectionError
        v-else-if="alerts.isError.value"
        message="No pudimos cargar tus avisos"
        class="q-mb-md"
        @retry="alerts.refetch()"
      />
      <div v-else-if="alerts.data.value?.length" class="row q-col-gutter-md q-mb-md">
        <div v-for="alert in alerts.data.value" :key="alert.id" class="col-12 col-sm-6">
          <AlertBanner
            :type="alert.type"
            :title="alert.title"
            :subtitle="alert.subtitle"
            :progress="alert.progress"
          />
        </div>
      </div>
      <!-- VACÍO: sin avisos no se muestra nada que distraiga -->
    </template>

    <!-- HOY · GET /api/home/meals -->
    <template v-if="showMeals">
      <div class="text-subtitle1 text-weight-medium q-mb-sm">Hoy</div>
      <div v-if="meals.isLoading.value" class="row q-col-gutter-md q-mb-md">
        <div v-for="n in 3" :key="n" class="col-12 col-sm-4">
          <q-skeleton height="140px" />
        </div>
      </div>
      <SectionError
        v-else-if="meals.isError.value"
        message="No pudimos cargar las comidas de hoy"
        class="q-mb-md"
        @retry="meals.refetch()"
      />
      <div v-else-if="meals.data.value?.length" class="row q-col-gutter-md q-mb-md">
        <div v-for="meal in meals.data.value" :key="meal.id" class="col-12 col-sm-4">
          <MealSlotCard
            :type="meal.type"
            :status="meal.status"
            :recipe="meal.recipe"
            :members="meal.members"
            :rescue-message="meal.rescueMessage"
            @add="onAddMeal"
            @view-suggestions="onViewSuggestions"
          />
        </div>
      </div>
      <!-- VACÍO -->
      <div v-else class="text-body2 text-grey-6 q-mb-md">Aún no has planeado nada para hoy.</div>
    </template>

    <!-- CASA · GET /api/home/house-members -->
    <template v-if="showHouseMembers">
      <div class="text-subtitle1 text-weight-medium q-mb-sm">Casa</div>
      <div v-if="houseMembers.isLoading.value" class="row q-col-gutter-md">
        <div v-for="n in 2" :key="n" class="col-12 col-sm-6">
          <q-skeleton height="72px" />
        </div>
      </div>
      <SectionError
        v-else-if="houseMembers.isError.value"
        message="No pudimos cargar a tu casa"
        @retry="houseMembers.refetch()"
      />
      <div v-else-if="houseMembers.data.value?.length" class="row q-col-gutter-md">
        <div v-for="member in houseMembers.data.value" :key="member.id" class="col-12 col-sm-6">
          <HouseMemberCard
            :name="member.name"
            :initial="member.initial"
            :role="member.role"
            :is-current-user="member.isCurrentUser"
            :task="member.task"
            :task-status="member.taskStatus"
            :color="member.color"
          />
        </div>
      </div>
      <!-- VACÍO -->
      <div v-else class="text-body2 text-grey-6">Todavía no hay nadie más en tu casa.</div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { Notify } from 'quasar'
import AlertBanner from 'src/components/common/AlertBanner.vue'
import MealSlotCard from 'src/components/common/MealSlotCard.vue'
import type { MealType } from 'src/components/common/MealSlotCard.vue'
import HouseMemberCard from 'src/components/common/HouseMemberCard.vue'
import SectionError from 'src/components/common/SectionError.vue'
import {
  useHomeAlerts,
  useHomeGreeting,
  useHomeMeals,
  useHouseMembers,
} from 'src/composables/useHomeData'
import { isEnabled, useFeatureFlags } from 'src/composables/useFeatureFlags'

defineOptions({ name: 'HomePage' })

const flags = useFeatureFlags()
const showGreeting = isEnabled(flags.home.welcomeMessage)
const showAlerts = isEnabled(flags.home.alerts)
const showMeals = isEnabled(flags.home.mealSlots)
const showHouseMembers = isEnabled(flags.home.houseMembers)

const greeting = useHomeGreeting()
const alerts = useHomeAlerts()
const meals = useHomeMeals()
const houseMembers = useHouseMembers()

const isOnline = ref(navigator.onLine)
const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}
onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})
onBeforeUnmount(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})

const greetingText = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
})

const onAddMeal = (type: MealType) => {
  Notify.create({ type: 'info', message: `Planear ${type} — próximamente` })
}

const onViewSuggestions = (type: MealType) => {
  Notify.create({ type: 'info', message: `Sugerencias para ${type} — próximamente` })
}
</script>
