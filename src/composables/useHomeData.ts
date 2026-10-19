import { useQuery } from '@tanstack/vue-query'
import {
  fetchHomeAlerts,
  fetchHomeGreeting,
  fetchHomeMeals,
  fetchHouseMembers,
} from 'src/services/home.service'
import { isEnabled, useFeatureFlags } from 'src/composables/useFeatureFlags'

const STALE_TIME = 1000 * 60 * 2 // 2 minutos

// Una query por sección: cada una carga, falla y se reintenta por separado.
// Si el feature está apagado, la query no hace la petición (enabled: false).
export function useHomeGreeting() {
  return useQuery({
    queryKey: ['home', 'greeting'],
    queryFn: fetchHomeGreeting,
    staleTime: STALE_TIME,
    enabled: isEnabled(useFeatureFlags().home.welcomeMessage),
  })
}

export function useHomeAlerts() {
  return useQuery({
    queryKey: ['home', 'alerts'],
    queryFn: fetchHomeAlerts,
    staleTime: STALE_TIME,
    enabled: isEnabled(useFeatureFlags().home.alerts),
  })
}

export function useHomeMeals() {
  return useQuery({
    queryKey: ['home', 'meals'],
    queryFn: fetchHomeMeals,
    staleTime: STALE_TIME,
    enabled: isEnabled(useFeatureFlags().home.mealSlots),
  })
}

export function useHouseMembers() {
  return useQuery({
    queryKey: ['home', 'house-members'],
    queryFn: fetchHouseMembers,
    staleTime: STALE_TIME,
    enabled: isEnabled(useFeatureFlags().home.houseMembers),
  })
}
