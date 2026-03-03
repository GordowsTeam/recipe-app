import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const STORAGE_THEME = 'numa_theme'
const STORAGE_COLOR = 'numa_primary_color'

export type ThemeMode = 'light' | 'dark' | 'auto'

// Shared state so MainLayout and Settings stay in sync
const themeMode = ref<ThemeMode>(
  (localStorage.getItem(STORAGE_THEME) as ThemeMode) || 'auto'
)
const primaryColor = ref<string>(localStorage.getItem(STORAGE_COLOR) || 'primary')

export function useAppTheme() {
  const $q = useQuasar()

  const primaryColorClass = computed(() => `primary-${primaryColor.value}`)

  const themeOptions = [
    { label: 'Claro', value: 'light' as ThemeMode },
    { label: 'Oscuro', value: 'dark' as ThemeMode },
    { label: 'Sistema', value: 'auto' as ThemeMode }
  ]

  const colorOptions = [
    { value: 'primary', label: 'Azul' },
    { value: 'teal', label: 'Verde azulado' },
    { value: 'green', label: 'Verde' },
    { value: 'purple', label: 'Morado' }
  ] as const

  function applyTheme(mode: ThemeMode) {
    themeMode.value = mode
    localStorage.setItem(STORAGE_THEME, mode)
    const isDark =
      mode === 'dark' ||
      (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    $q.dark?.set(isDark)
  }

  function applyPrimaryColor(color: string) {
    primaryColor.value = color
    localStorage.setItem(STORAGE_COLOR, color)
  }

  return {
    themeMode,
    themeOptions,
    colorOptions,
    primaryColor,
    primaryColorClass,
    applyTheme,
    applyPrimaryColor
  }
}
