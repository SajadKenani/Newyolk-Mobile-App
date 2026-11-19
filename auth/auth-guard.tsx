import { useEffect } from "react"
import type { PropsWithChildren } from "react"
import { useRouter, useSegments } from "expo-router"
import { ExpoRoutes } from "@/config/routes"
import { authClient } from "./client"

const AuthGuard = ({ children }: PropsWithChildren) => {
  const { data: session, isPending } = authClient.useSession()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (isPending) return

    const inAuthGroup = segments[0] === "auth"

    if (!session && !inAuthGroup) {
      router.replace(ExpoRoutes.auth.signIn)
      return
    }

    if (session && inAuthGroup) {
      router.replace(ExpoRoutes.main)
    }
  }, [isPending, router, segments, session])

  return <>{children}</>
}

export default AuthGuard
