import type { RouteRecordRaw } from 'vue-router'
import LoginPage from 'pages/LoginPage.vue'
import AuthCallback from 'pages/AuthCallback.vue'
import RecipeDetail from 'components/recipe-search/RecipeDetail.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MySearchPage.vue') },
      { path: 'my-search', name: 'my-search', component: () => import('pages/MySearchPage.vue') },
      { path: 'login', component: LoginPage },
      { path: 'auth/callback', component: AuthCallback },
      { path: 'recipe-detail/:id', name: 'recipe-detail', component: RecipeDetail }
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
