export const TOKEN_KEYS = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',
} as const

/** Сохраняет токены: localStorage если persistent=true, sessionStorage если false */
export function saveTokens(
  accessToken: string,
  refreshToken: string,
  persistent: boolean,
): void {
  const storage = persistent ? localStorage : sessionStorage
  storage.setItem(TOKEN_KEYS.ACCESS, accessToken)
  storage.setItem(TOKEN_KEYS.REFRESH, refreshToken)
}

/** Удаляет токены из обоих хранилищ */
export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEYS.ACCESS)
  localStorage.removeItem(TOKEN_KEYS.REFRESH)
  sessionStorage.removeItem(TOKEN_KEYS.ACCESS)
  sessionStorage.removeItem(TOKEN_KEYS.REFRESH)
}

export function getAccessToken(): string | null {
  return (
    localStorage.getItem(TOKEN_KEYS.ACCESS) ||
    sessionStorage.getItem(TOKEN_KEYS.ACCESS)
  )
}

export function getRefreshToken(): string | null {
  return (
    localStorage.getItem(TOKEN_KEYS.REFRESH) ||
    sessionStorage.getItem(TOKEN_KEYS.REFRESH)
  )
}
