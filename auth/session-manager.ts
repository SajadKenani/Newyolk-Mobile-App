import { Platform } from "react-native"

import { authClient } from "./client"

let refreshPromise: Promise<void> | null = null

export async function getValidSession() {
  if (Platform.OS === "web") return null
  const session = await authClient.getSession()

  if (!session?.data) return null

  const expiresAt = new Date(session.data.session.expiresAt).getTime()
  const now = Date.now()
  const fiveMinutes = 5 * 60 * 1000

  if (expiresAt - now < fiveMinutes) {
    refreshPromise ??= authClient
      .getSession({ query: { disableCookieCache: true } })
      .then(() => {
        refreshPromise = null
      })
      .catch(() => {
        refreshPromise = null
      })
    await refreshPromise
  }

  return authClient.getCookie()
}
