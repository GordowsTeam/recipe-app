# Recipe App – Maqueta UX (Astro)

Maqueta estática del sitio **NUMA** (recipe-app) para trabajar la experiencia de usuario (UX). Misma estructura y flujos que la app real (Vue + Quasar), pero implementada con **Astro**, HTML, CSS y JavaScript.

## Objetivo

Tener un prototipo ligero para:
- Probar cambios de diseño y navegación
- Validar flujos con usuarios sin depender del backend
- Iterar rápido en UX antes de llevarlo al proyecto Vue/Quasar

## Estructura

- **Layout**: Header con logo NUMA, barra de búsqueda (por receta / por ingrediente), drawer lateral y navegación (favoritos, mis recetas, subir receta, perfil).
- **Páginas**: Home, Login, Favorites, My Recipes, Upload Recipe, Profile, Settings, detalle de receta y 404.
- **Datos**: Recetas de ejemplo en `src/data/recipes.ts` (sin API).

## Cómo usar

```bash
# Instalar dependencias
npm install

# Desarrollo (puerto por defecto 4321)
npm run dev

# Build estático
npm run build

# Vista previa del build
npm run preview
```

## Tecnologías

- [Astro](https://astro.build/) (HTML/CSS/JS, sin framework en el front)
- Fuente Roboto y Material Symbols (iconos)
- CSS global en `src/styles/global.css`

## Relación con el proyecto real

Este proyecto **no** reemplaza la app Vue/Quasar. Es una copia de la estructura y pantallas para usarla como maqueta: cuando los flujos y el diseño estén validados aquí, se pueden trasladar al repo `recipe-app`.
