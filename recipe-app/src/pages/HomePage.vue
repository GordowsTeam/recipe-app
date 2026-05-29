<template>
  <q-page padding>
    <!-- Saludo -->
    <div class="q-mb-lg">
      <div class="text-h5 text-weight-medium">{{ greeting }}, Sofía</div>
      <div class="text-caption text-grey-6 q-mt-xs">{{ today }}</div>
    </div>

    <!-- Alertas -->
    <section class="q-mb-xl">
      <div class="text-subtitle1 text-weight-medium q-mb-sm">Alertas</div>
      <div class="row q-col-gutter-md">
        <div v-for="alert in alerts" :key="alert.id" class="col-6">
          <AlertBanner
            :type="alert.type"
            :title="alert.title"
            :subtitle="alert.subtitle"
            :progress="alert.progress"
          />
        </div>
      </div>
    </section>

    <!-- Hoy -->
    <section class="q-mb-xl">
      <div class="text-subtitle1 text-weight-medium q-mb-sm">Hoy</div>
      <div class="row q-col-gutter-md">
        <div v-for="meal in meals" :key="meal.id" class="col-4">
          <MealSlotCard
            :type="meal.type"
            :status="meal.status"
            :recipe="meal.recipe"
            :members="meal.members"
            :rescue-message="meal.rescueMessage"
          />
        </div>
      </div>
    </section>

    <!-- Casa -->
    <section>
      <div class="text-subtitle1 text-weight-medium q-mb-sm">Casa</div>
      <div class="row q-col-gutter-md">
        <div v-for="member in houseMembers" :key="member.id" class="col-6">
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
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MealSlotCard from 'src/components/meals/MealSlotCard.vue'
import AlertBanner from 'src/components/base/AlertBanner.vue'
import HouseMemberCard from 'src/components/house/HouseMemberCard.vue'
import { mockAlerts, mockMeals, mockHouseMembers } from 'src/mocks/home.mock'

const alerts = mockAlerts
const meals = mockMeals
const houseMembers = mockHouseMembers

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
})

const today = computed(() =>
  new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
)
</script>
