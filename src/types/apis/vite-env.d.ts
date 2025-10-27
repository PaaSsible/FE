/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_USER_URL: string
  readonly VITE_API_BOARD_URL: string
  readonly VITE_API_RECRUIT_URL: string
  readonly VITE_API_CHAT_URL: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_GOOGLE_CLIENT_SECRET: string
  readonly VITE_REDIRECT_DEVELOP_URL: string
  readonly VITE_REDIRECT_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
