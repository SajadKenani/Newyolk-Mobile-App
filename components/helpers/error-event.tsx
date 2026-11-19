import { StyleSheet, TouchableOpacity, View } from "react-native"
import Text from "@/components/native/text"

// Error component with dark theme
const ErrorView: React.FC<{ error: unknown; onRetry: () => void }> = ({ error, onRetry }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Failed to load pricing information</Text>
    <Text style={styles.message}>{String(error)}</Text>
    {onRetry && (
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryLabel}>Retry</Text>
      </TouchableOpacity>
    )}
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#111827",
  },
  title: {
    marginBottom: 8,
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
    color: "#f87171",
  },
  message: {
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: "#9ca3af",
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#2563eb",
  },
  retryLabel: {
    fontSize: 16,
    lineHeight: 20,
    color: "#ffffff",
  },
})

export default ErrorView
