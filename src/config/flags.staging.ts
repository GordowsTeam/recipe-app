import type { EnvFlags } from 'src/types/feature-flags'

// Sin mocks. Solo features aprobados por QA.
export const stagingFlags: EnvFlags = {
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
    welcomeMessage: true, // ✅ aprobado
    alerts: false, // 🚧 en desarrollo
    mealSlots: true, // ✅ aprobado
    houseMembers: false, // 🚧 en desarrollo
    clickableMealSlot: false, // 🚧 en desarrollo
    moodSelector: false, // 🚧 en desarrollo
    ingredientConflict: false, // 🚧 pendiente
    preCookChecklist: false, // 🚧 pendiente
    nightReminder: false, // 🚧 pendiente
  },
  inventory: {
    base: true, // ✅ aprobado
    reservations: false, // 🚧 pendiente
    approximateQuantity: false, // 🚧 pendiente
  },
  recipes: {
    detail: true, // ✅ aprobado
    conditionalSteps: false, // 🚧 pendiente
    aiGeneration: false, // 🚧 pendiente
  },
  calendar: false,
  shopping: false,
}
