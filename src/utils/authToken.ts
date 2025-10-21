export type AuthUser = {
  id: string
  role: string
  agreedToTerms: boolean
}

export type StoredAuthSession = {
  accessToken: string
  expiresAt: number
  user: AuthUser | null
}

export type RawAuthSession = {
  accessToken: string
  expiresAt: number
}

const AUTH_SESSION_STORAGE_KEY = 'paassible:auth'

const isBrowserEnv = typeof window !== 'undefined'

const decodeAccessToken = (accessToken: string): AuthUser | null => {
  if (!isBrowserEnv) {
    return null
  }

  const [, payload] = accessToken.split('.')

  if (!payload) {
    return null
  }

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
    const decoded = atob(padded)
    const parsed = JSON.parse(decoded) as Partial<AuthUser> & {
      sub?: string
    }

    if (
      typeof parsed.sub === 'string' &&
      typeof parsed.role === 'string' &&
      typeof parsed.agreedToTerms === 'boolean'
    ) {
      return {
        id: parsed.sub,
        role: parsed.role,
        agreedToTerms: parsed.agreedToTerms,
      }
    }
  } catch (error) {
    console.warn('Failed to decode access token payload', error)
  }

  return null
}

const persistSession = (session: StoredAuthSession): void => {
  if (!isBrowserEnv) {
    return
  }

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
}

const readSession = (): StoredAuthSession | null => {
  if (!isBrowserEnv) {
    return null
  }

  const rawValue = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    const parsed = JSON.parse(rawValue) as StoredAuthSession
    if (typeof parsed.accessToken === 'string' && typeof parsed.expiresAt === 'number') {
      return {
        accessToken: parsed.accessToken,
        expiresAt: parsed.expiresAt,
        user: parsed.user ?? null,
      }
    }
  } catch (error) {
    console.warn('Failed to parse auth session from storage', error)
  }

  void window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
  return null
}

export const clearAuthSession = (): void => {
  if (!isBrowserEnv) {
    return
  }

  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
}

export const setAuthSession = (session: RawAuthSession): void => {
  const user = decodeAccessToken(session.accessToken)
  persistSession({
    ...session,
    user,
  })
}

export const getAuthSession = (): StoredAuthSession | null => {
  const session = readSession()

  if (!session) {
    return null
  }

  if (session.expiresAt <= Date.now()) {
    clearAuthSession()
    return null
  }

  return session
}

export const getAccessToken = (): string | null => {
  const session = getAuthSession()
  return session?.accessToken ?? null
}

export const getAuthUser = (): AuthUser | null => {
  const session = getAuthSession()
  return session?.user ?? null
}
