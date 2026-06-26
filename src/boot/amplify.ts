// import { boot } from 'quasar/wrappers';
// import { Amplify } from 'aws-amplify';

// const domain = import.meta.env.VITE_AWS_COGNITO_DOMAIN
// const clientId = import.meta.env.VITE_AWS_COGNITO_CLIENT_ID
// const redirectUri = import.meta.env.VITE_AWS_COGNITO_REDIRECT_URI
// const redirectUriAPK = import.meta.env.VITE_AWS_COGNITO_REDIRECT_URI_APK

// // export const login = (): void => {
// //   window.location.href =
// //     `${domain}/login?client_id=${clientId}&response_type=code&scope=email+openid&redirect_uri=${redirectUri}`
// // }

// // export const logout = (): void => {
// //   window.location.href =
// //     `${domain}/logout?client_id=${clientId}&logout_uri=${getRedirectUri()}`
// // }

// interface JwtPayload {
//   sub: string
//   email: string
//   exp: number
//   [key: string]: unknown
// }

// export const parseJwt = (token: string | null): JwtPayload | null => {
//   try {
//     if (!token) return null
//     const base64 = token.split('.')[1]
//     if (!base64) return null
//     return JSON.parse(atob(base64))
//   } catch {
//     return null
//   }
// }

// export const getRedirectUri = (): string => {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   // const isCapacitor = !!(window as any).Capacitor || false
//   const isCapacitor = typeof (window as any).Capacitor !== 'undefined';

//   return isCapacitor ? redirectUriAPK : redirectUri
// }

// export async function refreshTokens(): Promise<{
//   access_token: string
//   id_token: string
//   expires_in: number
//   token_type: string
// }> {
//   const refreshToken = localStorage.getItem('refresh_token')
//   if (!refreshToken) {
//     throw new Error('No refresh token found.')
//   }

//   const body = new URLSearchParams({
//     grant_type: 'refresh_token',
//     client_id: clientId,
//     refresh_token: refreshToken,
//   })

//   const res = await fetch(`${domain}/oauth2/token`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: body.toString(),
//   })

//   if (!res.ok) {
//     throw new Error(`Failed to refresh token: ${res.status}`)
//   }

//   const data = await res.json()

//   // Save new tokens
//   localStorage.setItem('id_token', data.id_token)
//   localStorage.setItem('access_token', data.access_token)

//   return data
// }

// export default boot(() => {
//   Amplify.configure({
//     Auth: {
//       // >>> CONFIGURACIÓN DE USER POOL (Reemplaza los valores) <<<
//       region: 'TU_REGION_DE_AWS',             // ej: 'us-east-1'
//       userPoolId: 'TU_USER_POOL_ID',           
//       userPoolWebClientId: 'TU_APP_CLIENT_ID', 

//       // identityPoolId: 'TU_IDENTITY_POOL_ID', // Opcional, solo si usas Identity Pools (roles)
      
//       // >>> CONFIGURACIÓN DE HOSTED UI (OAuth) <<<
//       oauth: {
//         domain: `${domain}`, // El dominio de tu UI Hosted
//         scope: ['email', 'openid'],
        
//         // Aquí usamos la URL seleccionada condicionalmente
//         redirectSignIn: redirectUri,
//         redirectSignOut: redirectUri,
//         responseType: 'code' // o 'token', según tu configuración de Cognito
//       }
//     }
//   });
// });
