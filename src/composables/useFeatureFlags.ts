import type {
  AppFlags,
  Env,
  FeatureSection,
  PageKey,
  TestFlag,
  TestFlags,
} from 'src/types/feature-flags'
import { testFlags } from 'src/config/flags.testing'
import { stagingFlags } from 'src/config/flags.staging'
import { productionFlags } from 'src/config/flags.production'

const env: Env = import.meta.env.VITE_ENV ?? 'production'

// Key de localStorage donde el DevPanel guarda los overrides (solo test)
export const TEST_OVERRIDES_KEY = 'numa-test-overrides'

export function useFeatureFlags(): AppFlags {
  switch (env) {
    case 'test':
      return readTestFlags()
    case 'staging':
      return stagingFlags
    case 'production':
    default:
      return productionFlags
  }
}

// Helper: determina si un feature debe usar datos mock
// Solo retorna true en test y cuando el flag lo indica
export function useMock(flag: TestFlag | boolean): boolean {
  if (env !== 'test') return false
  if (typeof flag === 'boolean') return false
  return flag.useMock
}

// Helper: determina si un feature está habilitado
// Acepta ambos shapes (TestFlag o boolean)
export function isEnabled(flag: TestFlag | boolean): boolean {
  if (typeof flag === 'boolean') return flag
  return flag.enabled
}

export function isTestEnv(): boolean {
  return env === 'test'
}

// Página completa (menú + ruta) habilitada en el ambiente actual
export function isPageEnabled(page: PageKey): boolean {
  return useFeatureFlags().pages[page]
}

// Lista plana de los flags de test: { section, feature, flag }.
// `feature` es null en las secciones que son un flag único (calendar, shopping).
export interface TestFlagEntry {
  section: FeatureSection
  feature: string | null
  flag: TestFlag
}

export function listTestFlags(flags: TestFlags): TestFlagEntry[] {
  const sections = (Object.keys(flags) as (keyof TestFlags)[]).filter(
    (section): section is FeatureSection => section !== 'pages',
  )
  return sections.flatMap((section): TestFlagEntry[] => {
    const value: TestFlag | Record<string, TestFlag> = flags[section]
    if (isTestFlag(value)) return [{ section, feature: null, flag: value }]
    return Object.entries(value).map(([feature, flag]) => ({ section, feature, flag }))
  })
}

export function anyMockActive(flags: TestFlags): boolean {
  return listTestFlags(flags).some(({ flag }) => flag.useMock)
}

function isTestFlag(value: unknown): value is TestFlag {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Partial<TestFlag>).enabled === 'boolean' &&
    typeof (value as Partial<TestFlag>).useMock === 'boolean'
  )
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : undefined
}

// Los overrides se mezclan flag por flag sobre testFlags (no por sección):
// si después se agrega un feature nuevo a flags.testing.ts, un override viejo
// guardado en localStorage no lo borra. Claves desconocidas se ignoran.
function readTestFlags(): TestFlags {
  const flags = structuredClone(testFlags)
  try {
    const raw = localStorage.getItem(TEST_OVERRIDES_KEY)
    if (!raw) return flags
    const source = asRecord(JSON.parse(raw))
    if (!source) return flags

    const pagesOverride = asRecord(source.pages)
    for (const page of Object.keys(flags.pages) as PageKey[]) {
      const override = pagesOverride?.[page]
      if (typeof override === 'boolean') flags.pages[page] = override
    }

    for (const { section, feature, flag } of listTestFlags(flags)) {
      const override = feature === null ? source[section] : asRecord(source[section])?.[feature]
      if (isTestFlag(override)) {
        flag.enabled = override.enabled
        flag.useMock = override.useMock
      }
    }
  } catch {
    /* ignorar: overrides corruptos o localStorage no disponible */
  }
  return flags
}
