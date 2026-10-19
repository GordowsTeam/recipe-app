import type { FeatureSection, PageKey } from 'src/types/feature-flags'

// Única fuente de los menús (sidebar en desktop, tabs + menú de cuenta en móvil).
// Cada entrada se liga a su flag de página en `flags.*.ts` → `pages`.
export interface NavItem {
  page: PageKey
  routeName: string
  label: string
  icon: string
}

// Navegación principal (sidebar / tabs inferiores)
export const mainNavItems: NavItem[] = [
  { page: 'home', routeName: 'home', label: 'Inicio', icon: 'home' },
  { page: 'inventory', routeName: 'inventory', label: 'Inventario', icon: 'kitchen' },
  { page: 'recipes', routeName: 'recipes', label: 'Recetas', icon: 'menu_book' },
  { page: 'week', routeName: 'week', label: 'Semana', icon: 'calendar_month' },
  { page: 'shopping', routeName: 'shopping', label: 'Compras', icon: 'shopping_cart' },
]

// Menú de cuenta (avatar en sidebar / tab "Cuenta" en móvil)
export const accountNavItems: NavItem[] = [
  { page: 'profile', routeName: 'profile', label: 'Perfil', icon: 'person' },
  { page: 'myRecipes', routeName: 'my-recipes', label: 'Mis recetas', icon: 'restaurant' },
  { page: 'favorites', routeName: 'favorites', label: 'Favoritos', icon: 'favorite' },
  { page: 'uploadRecipe', routeName: 'upload-recipe', label: 'Subir receta', icon: 'upload' },
  { page: 'settings', routeName: 'settings', label: 'Configuración', icon: 'settings' },
]

// Rutas que pertenecen a una página sin estar en el menú
const extraRoutePages: Record<string, PageKey> = {
  'recipe-detail': 'recipes',
}

// Página a la que pertenece una ruta; undefined = ruta sin flag (login, callback, 404…)
export function pageForRoute(routeName: string): PageKey | undefined {
  return (
    [...mainNavItems, ...accountNavItems].find((item) => item.routeName === routeName)?.page ??
    extraRoutePages[routeName]
  )
}

// A qué página pertenece cada grupo de features (para ordenar el DevPanel por vista).
// null = funcionalidad sin vista propia: se agrupa aparte. Al agregar un grupo nuevo
// en TestFlags, TypeScript exige declararlo aquí.
export const featureSectionPage: Record<FeatureSection, PageKey | null> = {
  home: 'home',
  inventory: 'inventory',
  recipes: 'recipes',
  calendar: 'week',
  shopping: 'shopping',
}
