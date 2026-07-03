/// <reference types="vite/client" />

declare namespace ImportMeta {
  interface Env {
    VITE_API_URL: string
    VITE_AWS_COGNITO_DOMAIN: string
    VITE_AWS_COGNITO_CLIENT_ID: string
    VITE_AWS_COGNITO_REDIRECT_URI: string
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined
    VUE_ROUTER_BASE: string | undefined
    API_URL: string
  }
}
