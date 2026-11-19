import { View, TouchableOpacity, ActivityIndicator } from "react-native"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"

import { modalStyles } from "./style"
import type { ActionPillProps } from "../types/type"

const ActionPill = ({ label, icon, count, onPress, disabled, loading = false, variant = "primary" }: ActionPillProps) => {
  const COLORS = useThemeColors()
  const bg = variant === "danger" ? "#7f1d1d" : variant === "secondary" ? "#1a1a1a" : COLORS.primary[500]
  const borderColor = variant === "danger" ? "#991b1b" : variant === "secondary" ? "#2a2a2a" : "transparent"

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[modalStyles.pill, { backgroundColor: bg, borderColor, opacity: disabled || loading ? 0.45 : 1 }]}
    >
      {loading ? <ActivityIndicator size={14} color="#fff" /> : icon}
      <Text style={modalStyles.pillLabel}>{label}</Text>
      <View style={modalStyles.pillBadge}>
        <Text style={modalStyles.pillBadgeText}>{count}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default ActionPill
