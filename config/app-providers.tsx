import type { ReactNode } from "react"
import { Fragment } from "react"
import { useEffect, useState } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { MD3DarkTheme, Provider as PaperProvider } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { DarkTheme, ThemeProvider } from "@react-navigation/native"
import { GlobalLoadingProvider } from "@/components/global-loading-context"
import { TRPCProvider } from "@/config/react-provider"
import { useSafeTranslation } from "@/hooks/safe-translation"

const AppProviders = ({ children }: { children: ReactNode }) => {
  const [languageVersion, setLanguageVersion] = useState(0)

  useEffect(() => {
    return useSafeTranslation.subscribe(() => {
      setLanguageVersion((currentVersion) => currentVersion + 1)
    })
  }, [])

  return (
    <TRPCProvider>
      <GlobalLoadingProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <PaperProvider theme={MD3DarkTheme}>
              <ThemeProvider value={DarkTheme}>{languageVersion >= 0 ? <Fragment key={languageVersion}>{children}</Fragment> : null}</ThemeProvider>
            </PaperProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </GlobalLoadingProvider>
    </TRPCProvider>
  )
}

export { AppProviders }
