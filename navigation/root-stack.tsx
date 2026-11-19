import { Stack } from "expo-router"
import AuthGuard from "@/auth/auth-guard"
import { ChromeVisibilityProvider } from "@/components/store/chrome-visibility-context"
import { useThemeColors } from "@/config/colors"
import CustomStatusBar from "@/components/custom-status-bar"

const RootStack = () => {
  const COLORS = useThemeColors()

  return (
    <AuthGuard>
      <ChromeVisibilityProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
            contentStyle: {
              backgroundColor: COLORS.zinc[950],
            },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/sign-in" />
          <Stack.Screen name="main" />
        </Stack>
        <CustomStatusBar variant="gradient" />
      </ChromeVisibilityProvider>
    </AuthGuard>
  )
}

export default RootStack
