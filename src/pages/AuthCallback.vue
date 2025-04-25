<template>
  <q-page class="flex flex-center">
    <q-spinner size="50px" color="primary" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const domain = import.meta.env.VITE_AWS_COGNITO_DOMAIN
const clientId = import.meta.env.VITE_AWS_COGNITO_CLIENT_ID
const redirectUri = import.meta.env.VITE_AWS_COGNITO_REDIRECT_URI

onMounted(async () => {
  console.log('setting id token');
  const code = route.query.code as string
  if (!code) {
    await router.replace('/login')
    return
  }

  const data = new URLSearchParams()
  data.append('grant_type', 'authorization_code')
  data.append('client_id', clientId)
  data.append('code', code)
  data.append('redirect_uri', redirectUri)

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

    await router.replace('/')
  } catch (err) {
    console.error('Auth error:', err)
    await router.replace('/login')
  }
})
</script>
