<template>
  <q-page class="q-pa-md profile-page">
    <div class="text-h5 q-mb-md">Profile</div>

    <div v-if="!isAuthenticated" class="text-body1 text-grey-7 q-mb-md">
      Sign in to view your profile.
      <q-btn flat color="primary" label="Login" class="q-ml-sm" @click="goLogin" />
    </div>

    <template v-else>
      <q-banner v-if="error" class="bg-negative text-white q-mb-md rounded-borders">
        <template #avatar>
          <q-icon name="error" />
        </template>
        {{ error }}
        <template #action>
          <q-btn flat dense label="Retry" @click="loadProfile" />
        </template>
      </q-banner>

      <q-spinner v-else-if="loading" size="48px" color="primary" class="q-mt-lg" />

      <template v-else-if="user">
        <q-card flat bordered class="q-mb-lg">
          <q-card-section class="row items-center q-gutter-md">
            <q-avatar size="72px" color="primary" text-color="white" class="text-h5">
              {{ avatarLetter }}
            </q-avatar>
            <div>
              <div class="text-h6">{{ displayLabel }}</div>
              <div class="text-body2 text-grey-7">{{ user.email || '—' }}</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-list bordered separator class="rounded-borders">
            <q-item>
              <q-item-section>
                <q-item-label caption>Account ID</q-item-label>
                <q-item-label>{{ user.id }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="tokenPayload?.sub">
              <q-item-section>
                <q-item-label caption>Cognito subject</q-item-label>
                <q-item-label class="text-wrap">{{ tokenPayload.sub }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="cognitoUsernameFromToken">
              <q-item-section>
                <q-item-label caption>Cognito username</q-item-label>
                <q-item-label class="text-wrap">{{ cognitoUsernameFromToken }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Member since</q-item-label>
                <q-item-label>{{ formatDateTime(user.createdDateTime) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Last updated</q-item-label>
                <q-item-label>{{ formatDateTime(user.updatedDateTime) }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1 q-mb-sm">Display name</div>
            <div class="row q-col-gutter-sm items-end">
              <div class="col-12 col-sm-8">
                <q-input
                  v-model="displayNameEdit"
                  outlined
                  dense
                  label="How your name appears in the app"
                  maxlength="120"
                  :disable="saving"
                />
              </div>
              <div class="col-12 col-sm-auto">
                <q-btn
                  color="primary"
                  label="Save"
                  :loading="saving"
                  :disable="!displayNameDirty"
                  @click="saveDisplayName"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </template>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { parseJwt } from 'boot/cognito'
import { getUserInfo, upsertUserMe, type UserResponse } from 'src/api/user'

const router = useRouter()

const token = ref<string | null>(localStorage.getItem('id_token'))
const user = ref<UserResponse | null>(null)
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const displayNameEdit = ref('')

const isAuthenticated = computed(() => {
  if (!token.value) return false
  const payload = parseJwt(token.value)
  return Boolean(payload?.exp && payload.exp * 1000 > Date.now())
})

const tokenPayload = computed(() => parseJwt(token.value))

const cognitoUsernameFromToken = computed(() => {
  const v = tokenPayload.value?.['cognito:username']
  return typeof v === 'string' ? v : ''
})

const displayLabel = computed(() => {
  if (user.value?.displayName?.trim()) return user.value.displayName.trim()
  if (user.value?.email) return user.value.email
  return 'Your profile'
})

const avatarLetter = computed(() => {
  const name = displayLabel.value
  const ch = name.trim().charAt(0)
  return ch ? ch.toUpperCase() : '?'
})

const displayNameDirty = computed(() => {
  const current = user.value?.displayName?.trim() ?? ''
  return displayNameEdit.value.trim() !== current
})

function formatDateTime(iso?: string): string {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(iso)
    )
  } catch {
    return iso
  }
}

const goLogin = () => {
  void router.push({ name: 'login' })
}

const loadProfile = async () => {
  if (!isAuthenticated.value) {
    loading.value = false
    return
  }
  loading.value = true
  error.value = ''
  try {
    const u = await getUserInfo()
    user.value = u
    displayNameEdit.value = u.displayName?.trim() ?? ''
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load profile'
    error.value = msg
    user.value = null
  } finally {
    loading.value = false
  }
}

const saveDisplayName = async () => {
  if (!user.value) return
  saving.value = true
  try {
    const updated = await upsertUserMe({
      displayName: displayNameEdit.value.trim()
    })
    user.value = updated
    displayNameEdit.value = updated.displayName?.trim() ?? ''
    Notify.create({ type: 'positive', message: 'Profile saved' })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to save'
    Notify.create({ type: 'negative', message: msg })
  } finally {
    saving.value = false
  }
}

watch(
  () => router.currentRoute.value.fullPath,
  () => {
    token.value = localStorage.getItem('id_token')
  }
)

onMounted(() => {
  token.value = localStorage.getItem('id_token')
  void loadProfile()
})
</script>

<style scoped>
.profile-page {
  max-width: 640px;
}
.text-wrap {
  word-break: break-all;
}
</style>
