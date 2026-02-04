import type { Recipe } from 'src/interfaces/RecipeResponse'

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
  return (await response.json()) as Recipe[]
}

/**
 * POST /api/recipe/my-recipes – add a recipe to current user's list.
 */
export async function addMyRecipe(recipeId: string, recipeSourceType: string): Promise<void> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/recipe/my-recipes`, {
    method: 'POST',
    headers: getAuthHeadersWithUserId(),
    body: JSON.stringify({ recipeId, recipeSourceType })
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
  return (await response.json()) as Recipe[]
}

/**
 * POST /api/recipe/favorites – add a recipe to current user's favorites.
 */
export async function addFavorite(recipeId: string, recipeSourceType: string): Promise<void> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/recipe/favorites`, {
    method: 'POST',
    headers: getAuthHeadersWithUserId(),
    body: JSON.stringify({ recipeId, recipeSourceType })
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
