import type { AlertItem, HomeGreeting, HouseMember, MealSlot } from 'src/types/home.types'

// Un endpoint por sección del home: cada uno se prende/apaga y se pasa de
// mock a API por separado (ver src/config/flags.*.ts y home.handler.ts).
export const HOME_ENDPOINTS = {
  greeting: '/api/home/greeting',
  alerts: '/api/home/alerts',
  meals: '/api/home/meals',
  houseMembers: '/api/home/house-members',
} as const

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Error ${response.status} cargando ${url}`)
  // Sin backend, el dev server responde index.html con 200 a cualquier ruta
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error(`${url} no respondió JSON (¿endpoint aún no disponible?)`)
  }
  return response.json() as Promise<T>
}

export function fetchHomeGreeting(): Promise<HomeGreeting> {
  return getJson<HomeGreeting>(HOME_ENDPOINTS.greeting)
}

export function fetchHomeAlerts(): Promise<AlertItem[]> {
  return getJson<AlertItem[]>(HOME_ENDPOINTS.alerts)
}

export function fetchHomeMeals(): Promise<MealSlot[]> {
  return getJson<MealSlot[]>(HOME_ENDPOINTS.meals)
}

export function fetchHouseMembers(): Promise<HouseMember[]> {
  return getJson<HouseMember[]>(HOME_ENDPOINTS.houseMembers)
}
