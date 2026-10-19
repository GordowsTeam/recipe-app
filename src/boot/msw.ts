import { defineBoot } from '#q-app/wrappers'
import type { TestFlags } from 'src/types/feature-flags'
import { anyMockActive, isTestEnv, useFeatureFlags } from 'src/composables/useFeatureFlags'

// Intercepta las peticiones a /api/* con datos simulados mientras no exista
// el endpoint real (ver docs/numa-home-design.md). Solo corre con VITE_ENV=test
// y solo si algún feature tiene useMock: true (src/config/flags.testing.ts o
// los overrides del DevPanel). En staging/producción nunca arranca.
export default defineBoot(async () => {
  if (!isTestEnv()) return

  const flags = useFeatureFlags() as TestFlags
  if (!anyMockActive(flags)) return

  const { worker } = await import('src/mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass', // peticiones sin handler pasan a la red real
    serviceWorker: {
      // build.publicPath sirve la app (y public/) bajo /spa/, no en la raíz
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  })
})
