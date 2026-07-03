import type { RouteRecordRaw } from 'vue-router'
import LoginPage from 'pages/LoginPage.vue'
import AuthCallback from 'pages/AuthCallback.vue'
import RecipeDetail from 'components/recipe-search/RecipeDetail.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/HomePage.vue') },
      { path: 'recipes', name: 'recipes', component: () => import('pages/MySearchPage.vue') },
      { path: 'login', name: 'login', component: LoginPage },
      { path: 'auth/callback', component: AuthCallback },
      { path: 'recipe-detail/:id', name: 'recipe-detail', component: RecipeDetail },
      {
        path: 'inventory',
        name: 'inventory',
        component: () => import('pages/ComingSoon.vue'),
        meta: { title: 'Inventario', message: 'El inventario activo de tu casa estará disponible pronto.' }
      },
      {
        path: 'week',
        name: 'week',
        component: () => import('pages/ComingSoon.vue'),
        meta: { title: 'Semana', message: 'La planeación semanal estará disponible pronto.' }
      },
      {
        path: 'shopping',
        name: 'shopping',
        component: () => import('pages/ComingSoon.vue'),
        meta: { title: 'Compras', message: 'La lista de compras estará disponible pronto.' }
      },
      {
        path: 'favorites',
        name: 'favorites',
        component: () => import('pages/FavoritesPage.vue')
      },
      {
        path: 'my-recipes',
        name: 'my-recipes',
        component: () => import('pages/MyRecipesPage.vue')
      },
      {
        path: 'upload-recipe',
        name: 'upload-recipe',
        component: () => import('pages/ComingSoon.vue'),
        meta: { title: 'Subir receta', message: 'Comparte tu receta con la comunidad.' }
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/ProfilePage.vue')
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('pages/ComingSoon.vue'),
        meta: { title: 'Configuración', message: 'Ajustes y preferencias de la aplicación.' }
      }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
