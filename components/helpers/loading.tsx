import { ActivityIndicator, View, StyleSheet } from "react-native"
import { useThemeColors } from "@/config/colors"

export const LoadingSpinner = () => {
  const COLORS = useThemeColors()
  return (
    <View style={[styles.overlay]}>
      <ActivityIndicator size="large" color={COLORS.primary[500]} />
    </View>
  )
}
const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "#000",
    position: "absolute",
    zIndex: 50,
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
  },
})
