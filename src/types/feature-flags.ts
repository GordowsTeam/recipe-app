// Shape de un flag en TEST — tiene control de mock
export interface TestFlag {
  enabled: boolean
  useMock: boolean
}

// Shape de un flag en STAGING/PROD — solo visible o no
export type EnvFlag = boolean

// Páginas completas (menú + ruta). Son booleanas en los tres ambientes: una
// página no trae datos propios, el mock/API se decide en sus secciones.
export type PageKey =
  | 'home'
  | 'inventory'
  | 'recipes'
  | 'week'
  | 'shopping'
  | 'profile'
  | 'myRecipes'
  | 'favorites'
  | 'uploadRecipe'
  | 'settings'

export type PageFlags = Record<PageKey, boolean>

// Shapes completos por ambiente
export interface TestFlags {
  pages: PageFlags
  home: {
    welcomeMessage: TestFlag
    alerts: TestFlag
    mealSlots: TestFlag
    houseMembers: TestFlag
    clickableMealSlot: TestFlag
    moodSelector: TestFlag
    ingredientConflict: TestFlag
    preCookChecklist: TestFlag
    nightReminder: TestFlag
  }
  inventory: {
    base: TestFlag
    reservations: TestFlag
    approximateQuantity: TestFlag
  }
  recipes: {
    detail: TestFlag
    conditionalSteps: TestFlag
    aiGeneration: TestFlag
  }
  calendar: TestFlag
  shopping: TestFlag
}

export interface EnvFlags {
  pages: PageFlags
  home: {
    welcomeMessage: EnvFlag
    alerts: EnvFlag
    mealSlots: EnvFlag
    houseMembers: EnvFlag
    clickableMealSlot: EnvFlag
    moodSelector: EnvFlag
    ingredientConflict: EnvFlag
    preCookChecklist: EnvFlag
    nightReminder: EnvFlag
  }
  inventory: {
    base: EnvFlag
    reservations: EnvFlag
    approximateQuantity: EnvFlag
  }
  recipes: {
    detail: EnvFlag
    conditionalSteps: EnvFlag
    aiGeneration: EnvFlag
  }
  calendar: EnvFlag
  shopping: EnvFlag
}

// Grupos de features (todo menos `pages`). Cada uno se liga a una página en
// src/config/navigation.ts → featureSectionPage.
export type FeatureSection = Exclude<keyof TestFlags, 'pages'>

export type AppFlags = TestFlags | EnvFlags
export type Env = 'test' | 'staging' | 'production'
