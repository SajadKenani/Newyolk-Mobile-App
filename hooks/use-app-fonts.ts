import { useEffect } from "react"
import { useFonts } from "expo-font"
import { SplashScreen } from "expo-router"

SplashScreen.preventAutoHideAsync().catch(console.error)

export const useAppFonts = () => {
  const [loaded, error] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
    Sora: require("../assets/fonts/Sora-Regular.ttf"),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
    tajawal: require("../assets/fonts/Tajawal-Regular.ttf"),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
    sourcecodepro: require("../assets/fonts/SourceCodePro-Regular.ttf"),
  })

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(console.error)
    }
  }, [loaded])

  return loaded
}
