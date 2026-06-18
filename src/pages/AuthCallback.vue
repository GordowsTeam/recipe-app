<template>
  <q-page class="flex flex-center">
    <q-spinner size="50px" color="primary" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { clearPkceVerifier, getPkceVerifier, parseJwt } from 'boot/cognito'

const router = useRouter()
const route = useRoute()

const domain = import.meta.env.VITE_AWS_COGNITO_DOMAIN
const clientId = import.meta.env.VITE_AWS_COGNITO_CLIENT_ID
const redirectUri = import.meta.env.VITE_AWS_COGNITO_REDIRECT_URI

onMounted(async () => {
  const code = route.query.code as string
  const codeVerifier = getPkceVerifier()
  if (!code) {
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('expires_at')
    clearPkceVerifier()
    await router.replace('/login')
    return
  }

  const data = new URLSearchParams()
  data.append('grant_type', 'authorization_code')
  data.append('client_id', clientId)
  data.append('code', code)
  data.append('redirect_uri', redirectUri)
  if (codeVerifier) {
    data.append('code_verifier', codeVerifier)
  }

  try {
    const response = await axios.post(
      `${domain}/oauth2/token`,
      data,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )
    
    const { access_token, id_token, refresh_token, expires_in } = response.data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('id_token', id_token)
    localStorage.setItem('refresh_token', refresh_token)
    localStorage.setItem('expires_at', (Date.now() + expires_in * 1000).toString())
    const user = parseJwt(id_token)
    if (user) {
      console.log('[Cognito] Signed in — user from id_token:', user)
    } else {
      console.warn('[Cognito] Signed in but id_token could not be parsed')
    }
    clearPkceVerifier()
    await router.replace('/my-search')
  } catch (err) {
    console.error('Auth error:', err)
    clearPkceVerifier()
    await router.replace('/login')
  }
})
</script>
