<template>
  <div class="dev-panel">
    <q-btn
      round
      unelevated
      color="dark"
      class="dev-panel__fab"
      aria-label="Abrir panel de desarrollo"
      @click="open = true"
    >
      <i class="ti ti-settings dev-panel__icon" />
      <q-badge v-if="hasOverrides" floating color="warning" rounded />
    </q-btn>

    <q-dialog v-model="open" position="right" full-height>
      <q-card class="dev-panel__card column no-wrap">
        <q-card-section class="row items-center q-pb-sm">
          <i class="ti ti-flask dev-panel__icon q-mr-sm" />
          <div class="text-subtitle1 text-weight-medium">Panel de desarrollo · test</div>
          <q-space />
          <q-btn flat round dense aria-label="Cerrar" @click="open = false">
            <i class="ti ti-x dev-panel__icon" />
          </q-btn>
        </q-card-section>

        <q-card-section class="q-pt-none text-caption text-grey-7">
          <template v-if="hasOverrides">
            Hay overrides guardados en este navegador sobre <code>flags.testing.ts</code>.
          </template>
          <template v-else>Usando los valores de <code>flags.testing.ts</code>.</template>
        </q-card-section>

        <q-separator />

        <q-card-section class="col scroll q-px-none">
          <!-- Agrupado por vista: cada página con su check y, desplegados, sus features -->
          <q-list dense>
            <template v-for="block in blocks" :key="block.title">
              <q-item-label header class="text-overline q-pb-xs">{{ block.title }}</q-item-label>

              <template v-for="group in block.groups" :key="group.key">
                <q-expansion-item
                  v-if="group.entries.length"
                  dense
                  :default-opened="group.page !== null && group.page === currentPage"
                >
                  <template #header>
                    <q-item-section>
                      <!-- @click.stop: marcar la página no abre/cierra el grupo -->
                      <div v-if="group.page" @click.stop>
                        <q-checkbox v-model="draft.pages[group.page]" :label="group.label" dense />
                      </div>
                      <div v-else class="text-body2">{{ group.label }}</div>
                    </q-item-section>
                    <q-item-section side class="text-caption">
                      {{ summary(group.entries) }}
                    </q-item-section>
                  </template>

                  <div class="q-pl-lg q-pr-md q-pb-sm">
                    <div
                      v-if="group.page && !draft.pages[group.page]"
                      class="text-caption text-warning q-pb-xs"
                    >
                      Página apagada: estos features no se ven aunque estén activos.
                    </div>
                    <!-- Una fila por feature: prendido/apagado + de dónde vienen sus datos -->
                    <div
                      v-for="entry in group.entries"
                      :key="entryKey(entry)"
                      class="row items-center no-wrap q-py-xs"
                    >
                      <q-checkbox
                        v-model="entry.flag.enabled"
                        :label="entry.feature ?? sectionLabels[entry.section]"
                        dense
                        class="col"
                      />
                      <q-btn-toggle
                        v-model="entry.flag.useMock"
                        :options="dataSourceOptions"
                        :disable="!entry.flag.enabled"
                        dense
                        unelevated
                        no-caps
                        size="sm"
                        toggle-color="primary"
                      />
                    </div>
                  </div>
                </q-expansion-item>

                <!-- Página sin features: solo su check -->
                <q-item v-else-if="group.page">
                  <q-item-section>
                    <q-checkbox v-model="draft.pages[group.page]" :label="group.label" dense />
                  </q-item-section>
                  <q-item-section side class="text-caption">Sin features</q-item-section>
                </q-item>
              </template>
            </template>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions align="between" class="q-pa-md">
          <q-btn flat no-caps color="negative" @click="reset">
            <i class="ti ti-restore dev-panel__icon q-mr-xs" />
            Reset
          </q-btn>
          <q-btn unelevated no-caps color="primary" :disable="!isDirty" @click="apply">
            <i class="ti ti-refresh dev-panel__icon q-mr-xs" />
            Aplicar y recargar
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { FeatureSection, PageKey, TestFlags } from 'src/types/feature-flags'
import {
  TEST_OVERRIDES_KEY,
  listTestFlags,
  useFeatureFlags,
  type TestFlagEntry,
} from 'src/composables/useFeatureFlags'
import {
  accountNavItems,
  featureSectionPage,
  mainNavItems,
  pageForRoute,
  type NavItem,
} from 'src/config/navigation'

// Solo se monta con VITE_ENV=test (ver MainLayout.vue). Edita una copia de los
// flags vigentes (testFlags + overrides) y la persiste en localStorage.
const current = useFeatureFlags() as TestFlags
const currentSnapshot = JSON.stringify(current)

const open = ref(false)
const draft = ref<TestFlags>(structuredClone(current))
const hasOverrides = readHasOverrides()

// Nombre de cada grupo de features (fila de los flags únicos como calendar/shopping
// y título de las funcionalidades sin vista)
const sectionLabels: Record<FeatureSection, string> = {
  home: 'Inicio',
  inventory: 'Inventario',
  recipes: 'Recetas',
  calendar: 'Calendario',
  shopping: 'Compras',
}

const dataSourceOptions = [
  { label: 'Mock', value: true },
  { label: 'API', value: false },
]

// Página en la que está el usuario: su grupo aparece desplegado al abrir el panel
const route = useRoute()
const currentPage = typeof route.name === 'string' ? pageForRoute(route.name) : undefined

interface PanelGroup {
  key: string
  label: string
  page: PageKey | null
  entries: TestFlagEntry[]
}

interface PanelBlock {
  title: string
  groups: PanelGroup[]
}

const entries = computed(() => listTestFlags(draft.value))

function pageGroup(item: NavItem): PanelGroup {
  return {
    key: item.page,
    label: item.label,
    page: item.page,
    entries: entries.value.filter((entry) => featureSectionPage[entry.section] === item.page),
  }
}

const blocks = computed<PanelBlock[]>(() => {
  const orphanSections = (Object.keys(featureSectionPage) as FeatureSection[]).filter(
    (section) => featureSectionPage[section] === null,
  )
  return [
    { title: 'Menú principal', groups: mainNavItems.map(pageGroup) },
    { title: 'Cuenta', groups: accountNavItems.map(pageGroup) },
    {
      title: 'Funcionalidades sin vista',
      groups: orphanSections.map((section) => ({
        key: section,
        label: sectionLabels[section],
        page: null,
        entries: entries.value.filter((entry) => entry.section === section),
      })),
    },
  ].filter((block) => block.groups.length > 0)
})

// "3/7 activos · 1 en API" — estado del grupo sin tener que desplegarlo
function summary(groupEntries: TestFlagEntry[]): string {
  const active = groupEntries.filter((entry) => entry.flag.enabled)
  const onApi = active.filter((entry) => !entry.flag.useMock).length
  const base = `${active.length}/${groupEntries.length} activos`
  return onApi > 0 ? `${base} · ${onApi} en API` : base
}

const isDirty = computed(() => JSON.stringify(draft.value) !== currentSnapshot)

function entryKey(entry: TestFlagEntry): string {
  return entry.feature === null ? entry.section : `${entry.section}.${entry.feature}`
}

function readHasOverrides(): boolean {
  try {
    return localStorage.getItem(TEST_OVERRIDES_KEY) !== null
  } catch {
    return false
  }
}

function apply(): void {
  try {
    localStorage.setItem(TEST_OVERRIDES_KEY, JSON.stringify(draft.value))
  } catch {
    /* sin localStorage no hay overrides; se recarga con testFlags */
  }
  window.location.reload()
}

function reset(): void {
  try {
    localStorage.removeItem(TEST_OVERRIDES_KEY)
  } catch {
    /* nada que borrar */
  }
  window.location.reload()
}
</script>

<style scoped>
.dev-panel__fab {
  position: fixed;
  right: 16px;
  bottom: 88px; /* sobre el q-footer de navegación en móvil */
  z-index: 3000;
  width: 44px;
  height: 44px;
}

.dev-panel__icon {
  font-size: 20px;
  line-height: 1;
}

.dev-panel__card {
  width: 360px;
  max-width: 100vw;
}
</style>
