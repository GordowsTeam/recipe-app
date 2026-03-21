<template>
  <q-page class="flex flex-center column q-gutter-md">
    <q-spinner size="48px" color="primary" />
    <div class="text-subtitle1">Redirecting to AWS Cognito...</div>
    <q-btn flat color="primary" label="Open login manually" @click="login" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { login } from 'boot/cognito'

onMounted(() => {
  void login()
})
</script>