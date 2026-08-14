import { defineBoot } from '#q-app/wrappers'

// Intercepta las peticiones a /api/* con datos simulados mientras no exista
// el endpoint real (ver docs/numa-home-design.md). Solo corre en desarrollo;
// apagar un endpoint es solo comentar su handler en src/mocks/handlers.
export default defineBoot(async () => {
  if (!import.meta.env.DEV) return

  const { worker } = await import('src/mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass', // peticiones sin handler pasan a la red real
    serviceWorker: {
      // build.publicPath sirve la app (y public/) bajo /spa/, no en la raíz
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  })
})
