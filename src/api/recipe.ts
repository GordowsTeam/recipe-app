import type { Recipe } from 'src/interfaces/RecipeResponse'

function normalizeImage(img: Record<string, unknown>): Recipe['images'][0] {
  const url = (img.Url ?? img.url ?? '') as string
  const main = typeof (img.Main ?? img.main) === 'boolean' ? (img.Main ?? img.main) as boolean : false
  return { url, main }
}

/** Normalize API response (PascalCase or camelCase) to frontend Recipe shape. */
function normalizeRecipe(r: Record<string, unknown>, defaults?: { isFavorite?: boolean; isSaved?: boolean }): Recipe {
  const id = (r.Id ?? r.id ?? '') as string
  const name = (r.Name ?? r.name ?? '') as string
  const rawImages = (r.Images ?? r.images ?? []) as Record<string, unknown>[]
  const images = Array.isArray(rawImages) ? rawImages.map(normalizeImage) : []
  const ingredients = (r.Ingredients ?? r.ingredients ?? []) as Recipe['ingredients']
  const missingIngredients = (r.MissingIngredients ?? r.missingIngredients ?? []) as string[]
  const calories = Number(r.Calories ?? r.calories ?? 0)
  const totalTime = Number(r.TotalTime ?? r.totalTime ?? 0)
  const cuisinTypes = (r.CuisinTypes ?? r.cuisinTypes ?? []) as string[]
  const mealTypes = (r.MealTypes ?? r.mealTypes ?? []) as string[]
  const directions = (r.Directions ?? r.directions ?? []) as Recipe['directions']
  const rawSource = r.RecipeSourceType ?? r.recipeSourceType
  const recipeSourceType =
    typeof rawSource === 'number' ? String(rawSource) : typeof rawSource === 'string' ? rawSource : '2'
  const description = (r.Description ?? r.description ?? '') as string
  const isSaved =
    typeof r.IsSaved === 'boolean'
      ? r.IsSaved
      : typeof r.isSaved === 'boolean'
        ? r.isSaved
        : (defaults?.isSaved ?? false)
  const isFavorite =
    typeof r.IsFavorite === 'boolean'
      ? r.IsFavorite
      : typeof r.isFavorite === 'boolean'
        ? r.isFavorite
        : (defaults?.isFavorite ?? true)
  return {
    id,
    name,
    images,
    ingredients,
    missingIngredients,
    calories,
    totalTime,
    cuisinTypes,
    mealTypes,
    directions,
    recipeSourceType,
    description,
    isSaved,
    isFavorite
  }
}

const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_URL
  if (!url) throw new Error('VITE_API_URL is not set')
  return url.replace(/\/$/, '').replace(/\/api\/?$/, '')
}

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('id_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

/** Headers including X-User-Id from JWT sub (for my-recipes endpoints). */
const getAuthHeadersWithUserId = (): Record<string, string> => {
  const headers = getAuthHeaders()
  const token = localStorage.getItem('id_token')
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1] ?? '')) as { sub?: string }
      if (payload.sub) headers['X-User-Id'] = payload.sub
    } catch {
      // ignore
    }
  }
  return headers
}

export interface GetRecipesParams {
  ingredients: string[]
}

/**
 * POST /api/recipe – search recipes by ingredients (or single recipe name).
 */
export async function getRecipes(params: GetRecipesParams): Promise<Recipe[]> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/recipe`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ingredients: params.ingredients })
  })
  if (!response.ok) {
    throw new Error('Failed to fetch recipes')
  }
  return (await response.json()) as Recipe[]
}

/**
 * GET /api/recipe/:id – fetch a single recipe by id.
 * @param recipeSourceType – optional; enum value as string (0–5) or name (Internal, UserCreated, …); defaults to 2 (Internal)
 */
export async function getRecipeById(recipeId: string, recipeSourceType?: string): Promise<Recipe> {
  const baseUrl = getBaseUrl()
  const url = new URL(`${baseUrl}/api/recipe/${encodeURIComponent(recipeId)}`)
  const sourceParam =
    recipeSourceType != null && String(recipeSourceType).trim() !== ''
      ? String(recipeSourceType).trim()
      : '2'
  url.searchParams.set('recipeSourceType', sourceParam)
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getAuthHeaders()
  })
  if (response.status === 404) {
    throw new Error('Recipe not found')
  }
  if (!response.ok) {
    throw new Error('Failed to load recipe')
  }
  return (await response.json()) as Recipe
}

/**
 * GET /api/recipe/latest?count=5 – fetch the latest recipes (by created date).
 * Returns list response shape (id, name, images, etc.); missing fields normalized to defaults.
 */
export async function getLatestRecipes(count = 5): Promise<Recipe[]> {
  const baseUrl = getBaseUrl()
  const url = new URL(`${baseUrl}/api/recipe/latest`)
  url.searchParams.set('count', String(count))
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getAuthHeaders()
  })
  if (!response.ok) {
    throw new Error('Failed to load latest recipes')
  }
  const raw = (await response.json()) as Record<string, unknown>[]
  return Array.isArray(raw) ? raw.map((r) => normalizeRecipe(r)) : []
}

/**
 * GET /api/recipe/my-recipes – fetch current user's saved recipes.
 */
export async function getMyRecipes(): Promise<Recipe[]> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/recipe/my-recipes`, {
    method: 'GET',
    headers: getAuthHeadersWithUserId()
  })
  if (!response.ok) {
    if (response.status === 401) throw new Error('Login required to view my recipes')
    throw new Error('Failed to load my recipes')
  }
  const raw = (await response.json()) as Record<string, unknown>[]
  return Array.isArray(raw) ? raw.map((r) => normalizeRecipe(r, { isSaved: true })) : []
}

/**
 * POST /api/recipe/my-recipes – add a recipe to current user's list.
 * recipeSourceType: 0=None, 1=Mock, 2=Internal, 3=Edamame, 4=Spoonacular, 5=UserCreated.
 */
export async function addMyRecipe(recipeId: string, recipeSourceType: string | number): Promise<void> {
  const baseUrl = getBaseUrl()
  const sourceType = typeof recipeSourceType === 'number' ? recipeSourceType : parseInt(String(recipeSourceType), 10) || 2
  const response = await fetch(`${baseUrl}/api/recipe/my-recipes`, {
    method: 'POST',
    headers: getAuthHeadersWithUserId(),
    body: JSON.stringify({ recipeId, recipeSourceType: sourceType })
  })
  if (!response.ok) {
    if (response.status === 401) throw new Error('Login required to add recipes')
    throw new Error('Failed to add recipe')
  }
}

/**
 * DELETE /api/recipe/my-recipes/:recipeId – remove a recipe from current user's list.
 */
export async function removeMyRecipe(recipeId: string): Promise<void> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/recipe/my-recipes/${encodeURIComponent(recipeId)}`, {
    method: 'DELETE',
    headers: getAuthHeadersWithUserId()
  })
  if (!response.ok) {
    if (response.status === 401) throw new Error('Login required')
    throw new Error('Failed to remove recipe')
  }
}

/**
 * GET /api/recipe/favorites – fetch current user's favorite recipes.
 */
export async function getFavorites(): Promise<Recipe[]> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/recipe/favorites`, {
    method: 'GET',
    headers: getAuthHeadersWithUserId()
  })
  if (!response.ok) {
    if (response.status === 401) throw new Error('Login required to view favorites')
    throw new Error('Failed to load favorites')
  }
  const raw = (await response.json()) as Record<string, unknown>[]
  return Array.isArray(raw) ? raw.map((r) => normalizeRecipe(r, { isFavorite: true })) : []
}

/**
 * POST /api/recipe/favorites – add a recipe to current user's favorites.
 * recipeSourceType: 0=None, 1=Mock, 2=Internal, 3=Edamame, 4=Spoonacular, 5=UserCreated.
 */
export async function addFavorite(recipeId: string, recipeSourceType: string | number): Promise<void> {
  const baseUrl = getBaseUrl()
  const sourceType = typeof recipeSourceType === 'number' ? recipeSourceType : parseInt(String(recipeSourceType), 10) || 2
  const response = await fetch(`${baseUrl}/api/recipe/favorites`, {
    method: 'POST',
    headers: getAuthHeadersWithUserId(),
    body: JSON.stringify({ recipeId, recipeSourceType: sourceType })
  })
  if (!response.ok) {
    if (response.status === 401) throw new Error('Login required to add favorites')
    throw new Error('Failed to add favorite')
  }
}

/**
 * DELETE /api/recipe/favorites/:recipeId – remove a recipe from current user's favorites.
 */
export async function removeFavorite(recipeId: string): Promise<void> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/recipe/favorites/${encodeURIComponent(recipeId)}`, {
    method: 'DELETE',
    headers: getAuthHeadersWithUserId()
  })
  if (!response.ok) {
    if (response.status === 401) throw new Error('Login required')
    throw new Error('Failed to remove favorite')
  }
}

export interface CreateUserRecipeRequest {
  name: string
  description?: string
  ingredients: string[]
  directions: string[]
  totalTime: number
  calories: number
}

/**
 * POST /api/recipe/my-recipes/create – create a new recipe (user-created).
 */
export async function createMyRecipe(request: CreateUserRecipeRequest): Promise<Recipe> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/recipe/my-recipes/create`, {
    method: 'POST',
    headers: getAuthHeadersWithUserId(),
    body: JSON.stringify({
      name: request.name,
      description: request.description ?? '',
      ingredients: request.ingredients ?? [],
      directions: request.directions ?? [],
      totalTime: request.totalTime ?? 0,
      calories: request.calories ?? 0
    })
  })
  if (!response.ok) {
    if (response.status === 401) throw new Error('Login required to create recipes')
    if (response.status === 400) throw new Error('Invalid recipe. Name is required.')
    throw new Error('Failed to create recipe')
  }
  return (await response.json()) as Recipe
}
