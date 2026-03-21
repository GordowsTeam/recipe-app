import type { RouteRecordRaw } from 'vue-router'
import LoginPage from 'pages/LoginPage.vue'
import AuthCallback from 'pages/AuthCallback.vue'
import RecipeDetail from 'components/recipe-search/RecipeDetail.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/my-search' },
      { path: 'my-search', name: 'home', component: () => import('pages/MySearchPage.vue') },
      { path: 'login', name: 'login', component: LoginPage },
      { path: 'auth/callback', component: AuthCallback },
      { path: 'recipe-detail/:id', name: 'recipe-detail', component: RecipeDetail },
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
        meta: { title: 'Upload Recipe', message: 'Share your own recipe with the community.' }
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/ComingSoon.vue'),
        meta: { title: 'Profile', message: 'Manage your profile and preferences.' }
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('pages/ComingSoon.vue'),
        meta: { title: 'Settings', message: 'App settings and preferences.' }
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
