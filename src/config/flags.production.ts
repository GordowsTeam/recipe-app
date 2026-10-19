import type { EnvFlags } from 'src/types/feature-flags'

// Sin mocks. Solo lo que está completamente listo y aprobado.
export const productionFlags: EnvFlags = {
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
    welcomeMessage: true, // ✅ en producción
    alerts: false,
    mealSlots: true, // ✅ en producción
    houseMembers: false,
    clickableMealSlot: false,
    moodSelector: false,
    ingredientConflict: false,
    preCookChecklist: false,
    nightReminder: false,
  },
  inventory: {
    base: true, // ✅ en producción
    reservations: false,
    approximateQuantity: false,
  },
  recipes: {
    detail: true, // ✅ en producción
    conditionalSteps: false,
    aiGeneration: false,
  },
  calendar: false,
  shopping: false,
}
