<template>
  <q-item clickable tag="a" @click="navigateTo">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

export interface EssentialLinkProps {
  title: string
  caption?: string
  link?: string
  icon?: string
}

const router = useRouter()
const props = withDefaults(defineProps<EssentialLinkProps>(), {
  title: '',
  caption: '',
  link: '',
  icon: '',
})
const navigateTo = () => {
  return props.link.startsWith('http')
    ? window.open(props.link, '_blank')
    : router.push({ name: props.link })
}
</script>
