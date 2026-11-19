import { Pressable, StyleSheet } from "react-native"
import { Card } from "react-native-paper"
import { useRouter } from "expo-router"
import { authClient } from "@/auth/client"
import { ExpoRoutes } from "@/config/routes"

import Text from "../native/text"

const SignOut = () => {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await authClient.signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      router.replace(ExpoRoutes.auth.signIn)
    }
  }

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Pressable onPress={handleSignOut} style={styles.button}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </Pressable>
      </Card.Content>
    </Card>
  )
}

export { SignOut }

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: "#2e1065", // violet-950
    borderRadius: 16,
    backgroundColor: "transparent",
    flex: 1,
    gap: 32,
  },
  cardContent: {
    gap: 32,
    flex: 1,
  },
  button: {
    backgroundColor: "#fff",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#f5f3ff", // fallback for primary-background, adjust as needed
    fontSize: 20,
    letterSpacing: 2,
    textTransform: "uppercase",
    flexWrap: "nowrap",
  },
})
