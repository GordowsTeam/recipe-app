import type { TestFlags } from 'src/types/feature-flags'

// Nombre `flags.testing.ts` (no `flags.test.ts`): Vitest trata *.test.ts como suite.
//
// Control total: cada feature tiene `enabled` y `useMock`.
// - enabled: true  → se muestra en la UI
// - useMock: true  → los datos vienen del mock, no de la API real
// - useMock: false → conectado a la API real (cuando el back ya está listo)
export const testFlags: TestFlags = {
  // Páginas (menú + ruta): solo prendido/apagado
  pages: {
    home: true,
    inventory: true,
    recipes: true,
    week: true,
    shopping: true,
    profile: true,
    myRecipes: true,
    favorites: true,
    uploadRecipe: true,
    settings: true,
  },
  home: {
    welcomeMessage: { enabled: true, useMock: true }, // GET /api/home/greeting
    alerts: { enabled: true, useMock: true }, // GET /api/home/alerts
    mealSlots: { enabled: true, useMock: true }, // GET /api/home/meals
    houseMembers: { enabled: true, useMock: true }, // GET /api/home/house-members
    clickableMealSlot: { enabled: true, useMock: true }, // en desarrollo
    moodSelector: { enabled: true, useMock: true }, // en desarrollo
    ingredientConflict: { enabled: false, useMock: true }, // pendiente
    preCookChecklist: { enabled: false, useMock: true }, // pendiente
    nightReminder: { enabled: false, useMock: true }, // pendiente
  },
  inventory: {
    base: { enabled: true, useMock: false }, // listo
    reservations: { enabled: false, useMock: true }, // pendiente
    approximateQuantity: { enabled: false, useMock: true }, // pendiente
  },
  recipes: {
    detail: { enabled: true, useMock: false }, // listo
    conditionalSteps: { enabled: false, useMock: true }, // pendiente
    aiGeneration: { enabled: false, useMock: true }, // pendiente
  },
  calendar: { enabled: false, useMock: true },
  shopping: { enabled: false, useMock: true },
}
