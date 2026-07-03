<template>
  <q-page class="q-pa-md">
    <!-- HEADER / SALUDO -->
    <div class="text-h5 q-mb-md">{{ greeting }}, {{ user.name }}</div>

    <!-- ALERTAS -->
    <div v-if="alerts.length" class="row q-col-gutter-md q-mb-md">
      <div v-for="alert in alerts" :key="alert.id" class="col-12 col-sm-6">
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
    <div class="row q-col-gutter-md q-mb-md">
      <div v-for="meal in meals" :key="meal.id" class="col-12 col-sm-4">
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

    <!-- CASA -->
    <div class="text-subtitle1 text-weight-medium q-mb-sm">Casa</div>
    <div class="row q-col-gutter-md">
      <div v-for="member in houseMembers" :key="member.id" class="col-12 col-sm-6">
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
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Notify } from 'quasar'
import AlertBanner from 'src/components/common/AlertBanner.vue'
import MealSlotCard from 'src/components/common/MealSlotCard.vue'
import type { MealType } from 'src/components/common/MealSlotCard.vue'
import HouseMemberCard from 'src/components/common/HouseMemberCard.vue'
import { mockUser, mockAlerts, mockMeals, mockHouseMembers } from 'src/mocks/home.mock'

defineOptions({ name: 'HomePage' })

const user = mockUser
const alerts = mockAlerts
const meals = mockMeals
const houseMembers = mockHouseMembers

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
