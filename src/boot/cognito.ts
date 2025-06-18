const domain = import.meta.env.VITE_AWS_COGNITO_DOMAIN
const clientId = import.meta.env.VITE_AWS_COGNITO_CLIENT_ID
const redirectUri = import.meta.env.VITE_AWS_COGNITO_REDIRECT_URI

export const login = (): void => {
  window.location.href =
    `${domain}/login?client_id=${clientId}&response_type=code&scope=email+openid&redirect_uri=${redirectUri}`
}

export const logout = (): void => {
  window.location.href =
    `${domain}/logout?client_id=${clientId}&logout_uri=${redirectUri}`
}

interface JwtPayload {
  sub: string
  email: string
  exp: number
  [key: string]: unknown
}

export const parseJwt = (token: string | null): JwtPayload | null => {
  try {
    if (!token) return null
    const base64 = token.split('.')[1]
    if (!base64) return null
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export async function refreshTokens(): Promise<{
  access_token: string
  id_token: string
  expires_in: number
  token_type: string
}> {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) {
    throw new Error('No refresh token found.')
  }

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token: refreshToken,
  })

  const res = await fetch(`${domain}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  if (!res.ok) {
    throw new Error(`Failed to refresh token: ${res.status}`)
  }

  const data = await res.json()

  // Save new tokens
  localStorage.setItem('id_token', data.id_token)
  localStorage.setItem('access_token', data.access_token)

  return data
}