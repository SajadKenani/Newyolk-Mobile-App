import "react-native-gesture-handler"

import RootStack from "@/navigation/root-stack"
import { AppProviders } from "@/config/app-providers"
import { useAppFonts } from "@/hooks/use-app-fonts"

export const unstable_settings = {
  initialRouteName: "index",
}

const RootLayout = () => {
  const loaded = useAppFonts()

  if (!loaded) return null

  return (
    <AppProviders>
      <RootStack />
    </AppProviders>
  )
}

export default RootLayout
