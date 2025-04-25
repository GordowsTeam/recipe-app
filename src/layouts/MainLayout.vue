<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> NUMA </q-toolbar-title>
        <q-btn v-if="!isAuthenticated" label="Login" color="primary" @click="login" />
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
import { login, parseJwt, logout } from 'boot/cognito'
  
const token = ref<string | null>(localStorage.getItem('id_token'))

const isAuthenticated = computed(() => {
  if (!token.value) return false
  const user = parseJwt(token.value)
  const exp = user?.exp
  return exp && exp * 1000 > Date.now()
})

</script>