<template>
  <q-page class="settings-page">
    <div class="settings-inner">
      <h1 class="settings-title">Ajustes</h1>

      <section class="settings-section">
        <q-list class="settings-list" bordered>
          <q-item clickable @click="goToProfile" class="settings-item">
            <q-item-section avatar>
              <q-icon name="person" size="sm" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="settings-label">Perfil</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" size="xs" />
            </q-item-section>
          </q-item>
          <q-item clickable class="settings-item" @click="configExpanded = !configExpanded">
            <q-item-section avatar>
              <q-icon name="settings" size="sm" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="settings-label">Configuración</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon :name="configExpanded ? 'expand_less' : 'expand_more'" size="xs" />
            </q-item-section>
          </q-item>
          <q-slide-transition>
            <div v-show="configExpanded" class="config-block">
              <div class="config-row">
                <span class="config-label">Tema</span>
                <q-option-group
                  v-model="themeMode"
                  :options="themeOptions"
                  color="primary"
                  inline
                  dense
                  @update:model-value="applyTheme"
                />
              </div>
              <div class="config-row">
                <span class="config-label">Color</span>
                <div class="color-dots">
                  <button
                    v-for="opt in colorOptions"
                    :key="opt.value"
                    type="button"
                    class="color-dot"
                    :class="{ active: primaryColor === opt.value }"
                    :style="{ background: colorHex(opt.value) }"
                    :title="opt.label"
                    @click="applyPrimaryColor(opt.value)"
                  />
                </div>
              </div>
            </div>
          </q-slide-transition>
          <q-separator />
          <q-item clickable @click="doLogout" class="settings-item settings-item-logout">
            <q-item-section avatar>
              <q-icon name="logout" size="sm" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="settings-label">Cerrar sesión</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </section>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { logout } from 'boot/cognito'
import { useAppTheme } from 'src/composables/useAppTheme'

const $q = useQuasar()
const {
  themeMode,
  themeOptions,
  colorOptions,
  primaryColor,
  applyTheme,
  applyPrimaryColor
} = useAppTheme()

const configExpanded = ref(false)

const colorHex: Record<string, string> = {
  primary: '#1976d2',
  teal: '#26a69a',
  green: '#21ba45',
  purple: '#9c27b0'
}

function goToProfile() {
  $q.notify?.({ message: 'Perfil (próximamente)', color: 'primary', icon: 'person' })
}

function doLogout() {
  localStorage.removeItem('id_token')
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  logout()
}
</script>

<style scoped>
.settings-page {
  background: #f8f8f8;
  min-height: 100%;
}

.body--dark .settings-page {
  background: var(--q-dark-page, #121212);
}

.settings-inner {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px;
}

.settings-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 20px;
  color: #333;
}

.body--dark .settings-title {
  color: #eee;
}

.settings-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.body--dark .settings-section {
  background: var(--q-dark, #1d1d1d);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.settings-list {
  padding: 0;
}

.settings-list :deep(.q-item) {
  min-height: 48px;
}

.settings-label {
  font-size: 0.875rem;
  font-weight: 500;
}

.settings-item-logout .settings-label {
  color: var(--q-primary);
}

.config-block {
  padding: 12px 16px 16px 56px;
  background: rgba(0, 0, 0, 0.02);
}

.body--dark .config-block {
  background: rgba(255, 255, 255, 0.04);
}

.config-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.config-row:last-child {
  margin-bottom: 0;
}

.config-label {
  font-size: 0.75rem;
  color: #666;
}

.body--dark .config-label {
  color: #aaa;
}

.color-dots {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.color-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
  transition: transform 0.15s, box-shadow 0.15s;
}

.color-dot:hover {
  transform: scale(1.08);
}

.color-dot.active {
  border-color: #333;
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px #333;
}

.body--dark .color-dot.active {
  border-color: #fff;
  box-shadow: 0 0 0 2px var(--q-dark), 0 0 0 4px #fff;
}
</style>
