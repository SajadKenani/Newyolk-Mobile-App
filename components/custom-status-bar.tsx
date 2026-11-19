import { View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import { useThemeColors } from "@/config/colors"

interface CustomStatusBarProps {
  variant?: "default" | "gradient" | "transparent"
  style?: "light" | "dark" | "auto"
}

export default function CustomStatusBar({ variant = "gradient", style = "dark" }: CustomStatusBarProps) {
  const COLORS = useThemeColors()

  if (variant === "transparent") return <ExpoStatusBar style={style} />

  if (variant === "gradient") {
    return (
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 100, overflow: "hidden" }}>
        {/* <ExpoStatusBar style={style} /> */}
        <View style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

        <LinearGradient
          colors={[COLORS.primary[500] + "14", COLORS.primary[400] + "0D", COLORS.primary[600] + "0F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0 }}
        />

        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 0.5,
          }}
        />
      </View>
    )
  }
}
