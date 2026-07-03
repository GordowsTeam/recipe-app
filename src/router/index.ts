import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';

interface JwtPayload {
  exp?: number
}

const clearAuthTokens = (): void => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('id_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('expires_at')
}

const hasValidSession = (): boolean => {
  const token = localStorage.getItem('id_token')
  if (!token) return false

  try {
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) {
      clearAuthTokens()
      return false
    }
    const payload = JSON.parse(atob(payloadBase64)) as JwtPayload
    if (!payload.exp) {
      clearAuthTokens()
      return false
    }

    const nowInSeconds = Math.floor(Date.now() / 1000)
    const isValid = payload.exp > nowInSeconds
    if (!isValid) clearAuthTokens()
    return isValid
  } catch {
    clearAuthTokens()
    return false
  }
}

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE ?? '/'),
  });

  Router.beforeEach((to, from, next) => {
    const isAuthenticated = hasValidSession()
    if (to.path === '/auth/callback') {
      next()
    } else if (to.path === '/login' && isAuthenticated) {
      next('/')
    } else if (to.path !== '/login' && !isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  })

  return Router;
});
