const domain = import.meta.env.VITE_AWS_COGNITO_DOMAIN
const clientId = import.meta.env.VITE_AWS_COGNITO_CLIENT_ID
const redirectUri = import.meta.env.VITE_AWS_COGNITO_REDIRECT_URI
const pkceVerifierKey = 'pkce_code_verifier'

const randomString = (length: number): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const values = new Uint8Array(length)
  crypto.getRandomValues(values)
  return Array.from(values, (v) => charset[v % charset.length]).join('')
}

const toBase64Url = (bytes: Uint8Array): string => {
  const base64 = btoa(String.fromCharCode(...bytes))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

const sha256 = async (value: string): Promise<string> => {
  const data = new TextEncoder().encode(value)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return toBase64Url(new Uint8Array(hash))
}

export const login = async (): Promise<void> => {
  const verifier = randomString(96)
  const challenge = await sha256(verifier)
  sessionStorage.setItem(pkceVerifierKey, verifier)

  const loginUrl =
    `${domain}/login?client_id=${clientId}&response_type=code&scope=email+openid&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge_method=S256&code_challenge=${encodeURIComponent(challenge)}`

  window.location.href = loginUrl
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

export const getPkceVerifier = (): string | null => {
  return sessionStorage.getItem(pkceVerifierKey)
}

export const clearPkceVerifier = (): void => {
  sessionStorage.removeItem(pkceVerifierKey)
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