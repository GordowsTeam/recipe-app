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