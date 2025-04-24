<template>
    <q-page class="flex flex-center">
      <q-card class="q-pa-xl text-center">
        <q-icon name="lock" size="64px" class="q-mb-md text-primary" />
        <div class="text-h6 q-mb-md">Login to your account</div>
        <q-btn label="Login with AWS Cognito" color="primary" @click="login" />
      </q-card>
    </q-page>
  </template>
  
  <script setup lang="ts">
  import { login } from 'boot/cognito'
  </script>
  