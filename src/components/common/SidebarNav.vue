<template>
  <div class="column full-height no-wrap">
    <div class="q-pa-md">
      <div class="text-primary text-weight-bold text-h6">NUMA</div>
    </div>

    <q-list class="col">
      <q-item
        v-for="item in navItems"
        :key="item.routeName"
        clickable
        v-ripple
        :to="{ name: item.routeName }"
        :active="route.name === item.routeName"
        active-class="text-primary bg-blue-1"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" />
        </q-item-section>
        <q-item-section>{{ item.label }}</q-item-section>
      </q-item>
    </q-list>

    <q-separator />

    <q-item clickable v-ripple class="q-py-md">
      <q-item-section avatar>
        <q-avatar color="primary" text-color="white" size="32px">
          {{ user.initial }}
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ user.name }}</q-item-label>
        <q-item-label caption>{{ planLabel }}</q-item-label>
      </q-item-section>

      <q-menu anchor="top end" self="bottom end">
        <q-list style="min-width: 180px">
          <q-item
            v-for="item in accountItems"
            :key="item.routeName"
            clickable
            v-close-popup
            :to="{ name: item.routeName }"
          >
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>
          <q-separator v-if="accountItems.length" />
          <q-item clickable v-close-popup @click="$emit('logout')">
            <q-item-section class="text-red">Cerrar sesión</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-item>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { accountNavItems, mainNavItems } from 'src/config/navigation'
import { isPageEnabled } from 'src/composables/useFeatureFlags'

interface SidebarNavUser {
  name: string
  initial: string
  plan: 'free' | 'pro' | 'family'
}

const props = defineProps<{ user: SidebarNavUser }>()

defineEmits<{ logout: [] }>()

const route = useRoute()

// Solo las páginas habilitadas por feature flag (src/config/flags.*.ts → pages)
const navItems = mainNavItems.filter((item) => isPageEnabled(item.page))
const accountItems = accountNavItems.filter((item) => isPageEnabled(item.page))

const PLAN_LABEL: Record<SidebarNavUser['plan'], string> = {
  free: 'Plan Free',
  pro: 'Plan Pro',
  family: 'Plan Family',
}

const planLabel = computed(() => PLAN_LABEL[props.user.plan])
</script>
