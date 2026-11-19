import { StyleSheet } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

import Text from "@/components/native/text"

export const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null
  return (
    <Animated.View entering={FadeInDown} style={styles.errorContainer}>
      <Text style={styles.errorText}>{message}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderWidth: 1,
    borderColor: "#7f1d1d",
    borderRadius: 14,
    padding: 13,
    marginBottom: 12,
  },
  errorText: {
    color: "#fca5a5",
    textAlign: "center",
    fontSize: 15,
  },
})
