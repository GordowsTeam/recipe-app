import { http, HttpResponse, passthrough, type JsonBodyType } from 'msw'
import type { TestFlag } from 'src/types/feature-flags'
import type { AlertItem, HomeGreeting, HouseMember, MealSlot } from 'src/types/home.types'
import { useFeatureFlags, useMock } from 'src/composables/useFeatureFlags'
import { HOME_ENDPOINTS } from 'src/services/home.service'

// Fuente de verdad de los datos simulados del home, uno por endpoint.
// MainLayout.vue reutiliza `mockHomeGreeting.user` como placeholder del usuario
// hasta que exista sesión/casa real (ver docs/Numa_Features_Context.md).
export const mockHomeGreeting: HomeGreeting = {
  user: { name: 'Cass', initial: 'S', plan: 'free' },
  date: 'Martes 8 de enero',
}

export const mockHomeAlerts: AlertItem[] = [
  {
    id: '1',
    type: 'warning',
    title: 'La jícama lleva 14 días',
    subtitle: 'Revísala antes de planear la cena',
  },
  {
    id: '2',
    type: 'info',
    title: 'Pollo descongelando · 62%',
    subtitle: 'Listo aprox. 2:00 pm',
    progress: 62,
  },
]

export const mockHomeMeals: MealSlot[] = [
  { id: 'breakfast', type: 'breakfast', status: 'empty' },
  {
    id: 'lunch',
    type: 'lunch',
    status: 'planned',
    recipe: {
      name: 'Enchiladas poblanas',
      readyAt: '2:00 pm',
      readyLabel: 'Lista a las 2pm',
    },
    members: [
      { initial: 'C', name: 'Cass', steps: 2, color: 'info' },
      { initial: 'A', name: 'Adrián', steps: 1, color: 'warning' },
    ],
  },
  {
    id: 'dinner',
    type: 'dinner',
    status: 'rescue',
    rescueMessage: 'La jícama podría usarse hoy',
  },
]

export const mockHouseMembers: HouseMember[] = [
  {
    id: '1',
    name: 'Cass',
    initial: 'S',
    role: 'owner',
    isCurrentUser: true,
    task: 'Cocinar pollo · 8am',
    taskStatus: 'active',
    color: 'info',
  },
  {
    id: '2',
    name: 'Adrián',
    initial: 'A',
    role: 'member',
    isCurrentUser: false,
    task: 'Tatemar chiles · 8am',
    taskStatus: 'pending',
    color: 'warning',
  },
]

// Cada handler responde con el mock solo si su flag tiene useMock: true.
// Con useMock: false la petición sigue a la red (API real) — si el endpoint
// todavía no existe, la sección muestra su estado de error.
type HomeFlagKey = 'welcomeMessage' | 'alerts' | 'mealSlots' | 'houseMembers'

function mockOrPassthrough<T extends JsonBodyType>(flagKey: HomeFlagKey, data: T) {
  return () => {
    const flag: TestFlag | boolean = useFeatureFlags().home[flagKey]
    return useMock(flag) ? HttpResponse.json(data) : passthrough()
  }
}

export const homeHandlers = [
  http.get(HOME_ENDPOINTS.greeting, mockOrPassthrough('welcomeMessage', mockHomeGreeting)),
  http.get(HOME_ENDPOINTS.alerts, mockOrPassthrough('alerts', mockHomeAlerts)),
  http.get(HOME_ENDPOINTS.meals, mockOrPassthrough('mealSlots', mockHomeMeals)),
  http.get(HOME_ENDPOINTS.houseMembers, mockOrPassthrough('houseMembers', mockHouseMembers)),
]
