import { http, HttpResponse } from 'msw'
import type { Recipe, RecipeIngredient, RecipeDirection } from 'src/interfaces/RecipeResponse'

// Fuente de verdad de los datos simulados de "Mis recetas".
// Se consume desde MyRecipesPage.vue vía src/api/recipe.ts mientras
// no exista integración real con el backend para este flujo.
export const mockMyRecipes: Recipe[] = [
  {
    id: 'recipe-1',
    name: 'Enchiladas poblanas',
    images: [{ url: 'https://picsum.photos/seed/enchiladas/400/300', main: true }],
    ingredients: [
      {
        text: '4 tortillas de maíz',
        quantity: 4,
        measure: 'pieza',
        weight: 120,
        food: 'tortilla de maíz',
        foodCategory: 0,
        foodCategoryId: '',
        image: '',
      },
      {
        text: '200g de pechuga de pollo cocida',
        quantity: 200,
        measure: 'g',
        weight: 200,
        food: 'pollo',
        foodCategory: 0,
        foodCategoryId: '',
        image: '',
      },
    ],
    missingIngredients: [],
    calories: 420,
    totalTime: 35,
    cuisinTypes: ['Mexicana'],
    mealTypes: ['Comida'],
    directions: [
      { step: '1', image: '', instructionText: 'Cuece y deshebra el pollo.' },
      { step: '2', image: '', instructionText: 'Prepara la salsa poblana y baña las tortillas rellenas.' },
    ],
    recipeSourceType: '5',
    description: 'Clásico casero con salsa poblana.',
    isSaved: true,
    isFavorite: false,
  },
  {
    id: 'recipe-2',
    name: 'Ensalada de jícama y pepino',
    images: [{ url: 'https://picsum.photos/seed/jicama/400/300', main: true }],
    ingredients: [
      {
        text: '1 jícama mediana',
        quantity: 1,
        measure: 'pieza',
        weight: 300,
        food: 'jícama',
        foodCategory: 0,
        foodCategoryId: '',
        image: '',
      },
    ],
    missingIngredients: [],
    calories: 90,
    totalTime: 15,
    cuisinTypes: ['Mexicana'],
    mealTypes: ['Botana', 'Comida'],
    directions: [{ step: '1', image: '', instructionText: 'Corta la jícama y el pepino en bastones y mezcla con limón y chile.' }],
    recipeSourceType: '2',
    description: 'Fresca y rápida, ideal para acompañar.',
    isSaved: true,
    isFavorite: true,
  },
]

// Estado mutable en memoria: permite que altas/bajas persistan mientras
// dura la sesión de desarrollo (se reinicia al recargar la página).
let myRecipes: Recipe[] = [...mockMyRecipes]

interface CreateRecipeBody {
  name: string
  description?: string
  ingredients?: string[]
  directions?: string[]
  totalTime?: number
  calories?: number
}

function toIngredient(text: string): RecipeIngredient {
  return { text, quantity: 0, measure: '', weight: 0, food: text, foodCategory: 0, foodCategoryId: '', image: '' }
}

function toDirection(instructionText: string, index: number): RecipeDirection {
  return { step: String(index + 1), image: '', instructionText }
}

// Nota: src/api/recipe.ts arma sus URLs con VITE_API_URL (otro origen que
// la SPA), por eso los handlers usan wildcard `*` en vez de rutas relativas
// como hace /api/home.
export const recipeHandlers = [
  // GET /api/recipe/my-recipes
  http.get('*/api/recipe/my-recipes', () => HttpResponse.json(myRecipes)),

  // DELETE /api/recipe/my-recipes/:recipeId
  http.delete('*/api/recipe/my-recipes/:recipeId', ({ params }) => {
    const { recipeId } = params
    myRecipes = myRecipes.filter((r) => r.id !== recipeId)
    return new HttpResponse(null, { status: 204 })
  }),

  // POST /api/recipe/my-recipes/create
  http.post('*/api/recipe/my-recipes/create', async ({ request }) => {
    const body = (await request.json()) as CreateRecipeBody
    const newRecipe: Recipe = {
      id: `recipe-${Date.now()}`,
      name: body.name,
      images: [],
      ingredients: (body.ingredients ?? []).map(toIngredient),
      missingIngredients: [],
      calories: body.calories ?? 0,
      totalTime: body.totalTime ?? 0,
      cuisinTypes: [],
      mealTypes: [],
      directions: (body.directions ?? []).map(toDirection),
      recipeSourceType: '5',
      description: body.description ?? '',
      isSaved: true,
      isFavorite: false,
    }
    myRecipes = [newRecipe, ...myRecipes]
    return HttpResponse.json(newRecipe, { status: 201 })
  }),
]
