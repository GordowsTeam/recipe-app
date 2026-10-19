// Registro de todos los features del sistema.
// Cuando se agrega un feature nuevo, se declara aquí primero.
// El estado (enabled/useMock) se configura en cada archivo de flags.

export const featureRegistry = {
  pages: [
    'home',
    'inventory',
    'recipes',
    'week',
    'shopping',
    'profile',
    'myRecipes',
    'favorites',
    'uploadRecipe',
    'settings',
  ],
  home: [
    'welcomeMessage',
    'alerts',
    'mealSlots',
    'houseMembers',
    'clickableMealSlot',
    'moodSelector',
    'ingredientConflict',
    'preCookChecklist',
    'nightReminder',
  ],
  inventory: ['base', 'reservations', 'approximateQuantity'],
  recipes: ['detail', 'conditionalSteps', 'aiGeneration'],
  calendar: true,
  shopping: true,
} as const
