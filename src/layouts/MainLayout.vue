<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> NUMA </q-toolbar-title>
        <q-btn v-if="isAuthenticated" label="Logout" color="primary" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { parseJwt, logout, refreshTokens } from 'boot/cognito'
import { onMounted, onBeforeUnmount } from 'vue'

const token = ref<string | null>(localStorage.getItem('id_token'))

const isAuthenticated = computed(() => {
  if (!token.value) return false
  const user = parseJwt(token.value)
  const exp = user?.exp
  return exp && exp * 1000 > Date.now()
})

// Idle logout logic
let idleTimeout: ReturnType<typeof setTimeout>
const IDLE_LIMIT = 15 * 60 * 1000 // 15 minutes
const resetIdleTimer = () => {
  clearTimeout(idleTimeout)
  idleTimeout = setTimeout(() => {
    console.log('Idle timeout reached, logging out')
    localStorage.removeItem('id_token')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    logout()
  }, IDLE_LIMIT)
}
const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart']

// Refresh token logic
const checkAndRefreshToken = async () => {
  const idToken = localStorage.getItem('id_token')
  const payload = parseJwt(idToken)
  
  console.log('Checking token expiration:', payload)

  if (!payload || !payload.exp) return

  const now = Math.floor(Date.now() / 1000)
  const expiresIn = payload.exp - now

  if (expiresIn < 300) { // if less than 5 min
    try {
      await refreshTokens()
      token.value = localStorage.getItem('id_token')
      console.log('Token refreshed!')
    } catch (err) {
      console.error('Failed to refresh token:', err)
      logout()
    }
  }
}

onMounted(() => {
  // Set the token on load
  token.value = localStorage.getItem('id_token')

  // Watch for token changes
  const tokenSyncInterval = setInterval(() => {
    token.value = localStorage.getItem('id_token')
  }, 2000)

   // Check and refresh every 2 minutes
   const tokenRefreshInterval = setInterval(() => {
    checkAndRefreshToken().catch(err => {
    console.error('Token refresh error:', err)
  })
  }, 2 * 60 * 1000)

 // Set up idle timeout
 activityEvents.forEach(e => window.addEventListener(e, resetIdleTimer))
  resetIdleTimer()

  // Clean up
  onBeforeUnmount(() => {
    clearInterval(tokenSyncInterval)
    clearInterval(tokenRefreshInterval)
    activityEvents.forEach(e => window.removeEventListener(e, resetIdleTimer))
    clearTimeout(idleTimeout)
  })
})



</script>