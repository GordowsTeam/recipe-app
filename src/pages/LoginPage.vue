<template>
  <q-page class="flex flex-center column q-gutter-md">
    <q-spinner size="48px" color="primary" />
    <div class="text-subtitle1">Redirigiendo a AWS Cognito...</div>
    <q-btn flat color="primary" label="Abrir inicio de sesión manualmente" @click="login" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { login } from 'boot/cognito'

onMounted(() => {
  void login()
})
</script>