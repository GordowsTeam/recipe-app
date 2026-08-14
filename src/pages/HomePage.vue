<template>
  <q-page class="q-pa-md">
    <!-- SIN CONEXIÓN -->
    <q-banner v-if="!isOnline" class="bg-warning text-white q-mb-md" dense rounded>
      <template #avatar>
        <q-icon name="wifi_off" />
      </template>
      Sin conexión. Estás viendo la última información disponible.
    </q-banner>

    <!-- LOADING -->
    <div v-if="isLoading" class="column items-center q-py-xl">
      <q-spinner color="primary" size="40px" />
      <div class="text-body2 text-grey-7 q-mt-sm">Cargando tu día...</div>
    </div>

    <!-- ERROR -->
    <div v-else-if="isError" class="column items-center q-py-xl">
      <q-icon name="error_outline" color="negative" size="40px" />
      <div class="text-body1 q-mt-sm">No pudimos cargar tu home</div>
      <div class="text-body2 text-grey-7 q-mb-md">Revisa tu conexión e intenta de nuevo</div>
      <q-btn outline no-caps color="primary" label="Reintentar" @click="refetch()" />
    </div>

    <!-- ÉXITO -->
    <template v-else-if="data">
      <!-- HEADER / SALUDO -->
      <div class="text-h5 q-mb-md">{{ greeting }}, {{ data.user.name }}</div>

      <!-- ALERTAS -->
      <div v-if="data.alerts.length" class="row q-col-gutter-md q-mb-md">
        <div v-for="alert in data.alerts" :key="alert.id" class="col-12 col-sm-6">
          <AlertBanner
            :type="alert.type"
            :title="alert.title"
            :subtitle="alert.subtitle"
            :progress="alert.progress"
          />
        </div>
      </div>

      <!-- HOY -->
      <div class="text-subtitle1 text-weight-medium q-mb-sm">Hoy</div>
      <div v-if="data.meals.length" class="row q-col-gutter-md q-mb-md">
        <div v-for="meal in data.meals" :key="meal.id" class="col-12 col-sm-4">
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
      <div v-else class="text-body2 text-grey-6 q-mb-md">
        Aún no has planeado nada para hoy.
      </div>

      <!-- CASA -->
      <div class="text-subtitle1 text-weight-medium q-mb-sm">Casa</div>
      <div v-if="data.houseMembers.length" class="row q-col-gutter-md">
        <div v-for="member in data.houseMembers" :key="member.id" class="col-12 col-sm-6">
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
import { useHomeData } from 'src/composables/useHomeData'

defineOptions({ name: 'HomePage' })

const { data, isLoading, isError, refetch } = useHomeData()

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

const greeting = computed(() => {
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
