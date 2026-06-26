# numa-frontend — Contexto técnico

> Lee primero `../CLAUDE.md` para contexto de producto, persona y reglas no negociables.
> Este archivo es solo técnico: stack, convenciones, estructura, comandos.

---

## Stack

- **Framework:** Quasar 2.x sobre Vue 3 (Composition API + `<script setup>`)
- **Estado UI:** Pinia
- **Data fetching y caché de servidor:** TanStack Query (Vue Query)
- **Lenguaje:** TypeScript con `strict: true`
- **Package manager:** yarn
- **Build:** Vite (vía Quasar CLI)
- **Mocking en dev:** MSW (Mock Service Worker)
- **Iconos:** Tabler Icons (`ti-*`)

**Restricción de stack:** no mezclar otras librerías de UI (Vuetify, PrimeVue, Tailwind). Quasar provee el sistema de diseño completo. Mezclar dos sistemas es fricción permanente.

---

## Comandos comunes

```bash
yarn dev          # arranca dev server con MSW activo
yarn build        # build de producción
yarn lint         # lint
yarn type-check   # verificación de tipos
yarn test         # tests (cuando existan)
```

---

## Estado de integración con la API

**Importante:** el backend existe pero **no se está integrando todavía** en el flujo de desarrollo. Todo corre contra mocks.

Reglas para mantenerlo limpio:

- Los componentes consumen `useQuery` / `useMutation` de TanStack Query como si la API real estuviera ahí.
- La capa de mocks usa **MSW**, que intercepta peticiones HTTP en dev. Los handlers viven en `src/mocks/handlers/`, las fixtures en `src/mocks/fixtures/`.
- Cuando llegue el momento de integrar un endpoint real, **no se toca el componente** — solo se apaga el handler de MSW correspondiente y se ajusta la base URL.
- Si al integrar la API real hay que modificar el componente, significa que el componente estaba acoplado al mock. Eso es bug, no feature.

---

## Convenciones de componentes

### Naming

- Archivos en `PascalCase.vue`.
- Prefijos por rol:
  - `Base*` para primitivas genéricas reutilizables (`BaseEmpty.vue`, `BaseError.vue`).
  - `App*` para layout y chrome global (`AppHeader.vue`, `AppSidebar.vue`).
  - Sin prefijo para componentes de dominio (`InventoryCard.vue`, `MealSlot.vue`, `RecipeStepTimeline.vue`).
- **El nombre refleja un concepto del usuario, no una entidad del backend.** Un `<MealSlot>` puede agrupar lo que en la API son 3 entidades. (Regla 19 del ContextoUX.)

### Estructura interna de un componente

Orden dentro de `<script setup lang="ts">`:

1. Imports
2. Props y emits (con tipos explícitos, sin `any`)
3. Composables y stores
4. Estado local (`ref`, `reactive`)
5. Queries de TanStack
6. Computed
7. Watchers
8. Funciones / handlers
9. Lifecycle hooks
10. `defineExpose` si aplica

### Los 5 estados son obligatorios

Cualquier componente que consume datos del servidor debe manejar explícitamente loading, vacío, error, sin conexión y éxito. Patrón:

```vue
<template>
  <BaseLoading v-if="query.isLoading.value" />
  <BaseError v-else-if="query.isError.value" :error="query.error.value" />
  <BaseOffline v-else-if="!isOnline" />
  <BaseEmpty v-else-if="!query.data.value?.length" />
  <div v-else>
    <!-- contenido -->
  </div>
</template>
```

"No se va a quedar vacío" no es un argumento — siempre hay un primer render y siempre hay una pérdida de red.

---

## Convenciones de stores Pinia

**Un store por dominio, no por pantalla.**

- ✅ `useInventoryStore`, `useMealPlanStore`, `useHouseStore`, `useRecipesStore`
- ❌ `useHomePageStore`, `useSidebarStore`

Los stores modelan el dominio del usuario, no la UI. Una pantalla puede usar 3 stores; un store puede alimentar 5 pantallas.

### Qué va en Pinia vs en TanStack Query

- **TanStack Query:** todo lo que viene del servidor (lectura, mutación, caché, invalidación). No replicar en Pinia.
- **Pinia:** estado de UI compartido que no viene del servidor — modo edición activo, filtros aplicados, selección actual, preferencias temporales.

Anti-patrón: usar Pinia como caché de datos del servidor. TanStack Query ya lo hace mejor, con menos código y con invalidación correcta.

---

## Estructura de carpetas

```
src/
├── assets/              ← imágenes, fuentes
├── boot/                ← inicialización Quasar (pinia, query, mocks, i18n)
├── components/
│   ├── base/            ← primitivas genéricas (BaseEmpty, BaseError, etc.)
│   ├── inventory/       ← componentes de dominio agrupados por concepto
│   ├── meals/
│   ├── recipes/
│   ├── house/
│   └── shared/          ← AppHeader, AppSidebar, AppLayout
├── composables/         ← lógica reutilizable (useDefrostETA, useIngredientStatus)
├── layouts/             ← MainLayout, AuthLayout
├── pages/               ← una por ruta
├── router/              ← definición de rutas
├── stores/              ← stores Pinia
├── queries/             ← useQuery / useMutation organizadas por dominio
├── mocks/
│   ├── browser.ts       ← setup MSW
│   ├── handlers/        ← interceptores HTTP por dominio
│   └── fixtures/        ← datos JSON
├── types/               ← tipos TypeScript del dominio
└── utils/               ← helpers puros (sin side effects)
```

---

## Responsive y plataforma

- **Mobile-first** para vistas operativas (cocinar, ejecutar tarea, registrar compra rápida). Sofía las usa con las manos ocupadas.
- **Desktop-first** para vistas analíticas (planeación semanal, gestión de inventario completa, configuración de casa).
- Usar siempre los breakpoints de Quasar: `$q.screen.gt.sm`, `$q.screen.lt.md`. **Nunca** `window.innerWidth` o media queries hardcoded en componentes — eso rompe SSR si se introduce más adelante.

---

## TypeScript

- `strict: true` siempre.
- Tipos del dominio en `src/types/`, alineados con los conceptos del usuario (`Ingredient`, `IngredientInstance`, `Recipe`, `MealPlan`, `House`, `HouseMember`).
- **Los tipos del frontend no replican el schema del backend.** Reflejan el modelo mental del usuario. Si el backend devuelve algo distinto, se transforma en la capa de queries — no se filtra al componente.

---

## Internacionalización

UI en español (es-MX). Vue I18n configurado, un solo idioma por ahora. **No hardcodear strings en componentes** — todo pasa por `t('clave.del.string')`. Esto importa porque la regla de "lenguaje del usuario" se respeta editando archivos de traducción, no buscando en componentes.

---

## Checklist antes de agregar un componente nuevo

Antes de escribir código, debe poder responderse:

1. ¿Qué dolor del usuario resuelve? (referencia explícita a una feature de `docs/Features.md`)
2. ¿Qué pantallas lo van a usar?
3. ¿Maneja los 5 estados (loading, vacío, éxito, error, sin conexión)?
4. ¿Su nombre refleja un concepto del usuario o una entidad del backend?

Si no se pueden responder las 4, falta diseño — se vuelve a `docs/` antes de codear.

---

## Notas operativas

- El `CLAUDE.md` raíz (`../CLAUDE.md`) tiene precedencia para decisiones de producto y conceptos del dominio.
- Este archivo se actualiza cuando cambia una convención técnica o se agrega una herramienta nueva al stack.
- Decisiones técnicas de peso (cambiar de Pinia a X, adoptar SSR, etc.) se registran en `../docs/decisions.md`, no en este archivo.