/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_USER_URL: string
  readonly VITE_API_BOARD_URL: string
  readonly VITE_API_RECRUIT_URL: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_GOOGLE_CLIENT_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
