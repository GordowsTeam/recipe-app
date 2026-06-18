const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_URL
  if (!url) throw new Error('VITE_API_URL is not set')
  return url.replace(/\/$/, '').replace(/\/api\/?$/, '')
}

const getAuthHeadersWithUserEmail = (): Record<string, string> => {
  const token = localStorage.getItem('id_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
    try {
      const payload = JSON.parse(atob(token.split('.')[1] ?? '')) as Record<string, unknown>
      const email = payload.email
      if (typeof email === 'string' && email) headers['X-User-Email'] = email
      const cognitoUsername = payload['cognito:username']
      if (typeof cognitoUsername === 'string' && cognitoUsername)
        headers['X-Cognito-Username'] = cognitoUsername
    } catch {
      // ignore
    }
  }
  return headers
}

export interface UserResponse {
  id: string
  email?: string
  displayName?: string
  createdDateTime?: string
  updatedDateTime?: string
}

export interface CreateOrUpdateUserRequest {
  email?: string
  displayName?: string
}

/**
 * GET /api/user/info – fetch profile, creating the DB row on first visit if needed.
 */
export async function getUserInfo(): Promise<UserResponse> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/user/info`, {
    method: 'GET',
    headers: getAuthHeadersWithUserEmail()
  })
  if (!response.ok) {
    if (response.status === 401) throw new Error('Login required')
    throw new Error('Failed to load profile')
  }
  return (await response.json()) as UserResponse
}

/**
 * GET /api/user/me – fetch current user profile (Cognito-linked in DB).
 */
export async function getUserMe(): Promise<UserResponse> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/user/me`, {
    method: 'GET',
    headers: getAuthHeadersWithUserEmail()
  })
  if (!response.ok) {
    if (response.status === 401) throw new Error('Login required')
    if (response.status === 404) throw new Error('User not found')
    throw new Error('Failed to load user')
  }
  const data = (await response.json()) as UserResponse
  return data
}

/**
 * PUT /api/user/me – create or update current user in DB (link Cognito user with app DB).
 * Call after login so the user is stored keyed by email with optional displayName.
 */
export async function upsertUserMe(request: CreateOrUpdateUserRequest): Promise<UserResponse> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/user/me`, {
    method: 'PUT',
    headers: getAuthHeadersWithUserEmail(),
    body: JSON.stringify({
      email: request.email ?? undefined,
      displayName: request.displayName ?? undefined
    })
  })
  if (!response.ok) {
    if (response.status === 401) throw new Error('Login required')
    throw new Error('Failed to save user')
  }
  return (await response.json()) as UserResponse
}

/** Request body for POST /api/user/favorites (same as recipe favorites). */
export interface AddFavoriteRequest {
  recipeId: string
  /** 0=None, 1=Mock, 2=Internal, 3=Edamame, 4=Spoonacular, 5=UserCreated */
  recipeSourceType: number
}

/**
 * POST /api/user/favorites – add a recipe to the current user's favorites.
 * Mirrors the Recipe API endpoint; use either this or recipe.addFavorite().
 */
export async function addUserFavorite(recipeId: string, recipeSourceType: number): Promise<void> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/user/favorites`, {
    method: 'POST',
    headers: getAuthHeadersWithUserEmail(),
    body: JSON.stringify({ recipeId, recipeSourceType })
  })
  if (!response.ok) {
    if (response.status === 401) throw new Error('Login required to add favorites')
    throw new Error('Failed to add favorite')
  }
}
