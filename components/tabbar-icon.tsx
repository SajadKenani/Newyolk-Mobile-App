import { View, StyleSheet } from "react-native"

import type { TabBarItemProps } from "./types/interface"
import Text from "./native/text"

const TabBarIcon: React.FC<TabBarItemProps> = ({ focused, label }) => {
  return focused ? (
    <View style={[styles.container]}>
      <Text style={[styles.label, styles.labelFocused]}>{label}</Text>
      <View style={styles.underline} />
    </View>
  ) : (
    <View style={[styles.container]}>
      <Text style={[styles.label, styles.labelUnfocused]}>{label}</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: "System", // Replace with your primary-medium font if available
    fontSize: 14,
  },
  labelFocused: {
    color: "#eab308", // Tailwind yellow-600
  },
  labelUnfocused: {
    color: "#4b5563", // Tailwind gray-600
  },
  underline: {
    marginTop: 4,
    width: 16,
    height: 1,
    backgroundColor: "#eab308", // Tailwind yellow-600
  },
})
export default TabBarIcon
