import { Redirect } from "expo-router"
import { authClient } from "@/auth/client"
import { ExpoRoutes } from "@/config/routes"

import "react-native-gesture-handler"

import { LoadingSpinner } from "@/components/helpers/loading"

const HomePage = () => {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return <LoadingSpinner />
  if (session) return <Redirect href={ExpoRoutes.main} />

  return <Redirect href={ExpoRoutes.auth.signIn} />
}

export default HomePage