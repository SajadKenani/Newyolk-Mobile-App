import { Pressable, StyleSheet, View } from "react-native"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"

import type { CustomDrawerItemProps } from "../types/interface"
import { styles } from "../types/style"

const CustomDrawerItem = ({ icon, label, value, onPress, compact = false }: CustomDrawerItemProps) => {
  const COLORS = useThemeColors()

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.itemContainer,
        componentStyles.container,
        compact && componentStyles.compactContainer,
        {
          backgroundColor: compact ? "transparent" : COLORS.zinc[950] + "CC",
          borderColor: compact ? "transparent" : COLORS.white + "0A",
          shadowColor: compact ? "transparent" : COLORS.black,
        },
      ]}
    >
      <View style={[styles.itemInner, componentStyles.inner, compact && componentStyles.compactInner]}>
        <View style={[componentStyles.copyBlock, compact && componentStyles.compactCopyBlock]}>
          <View
            style={[
              componentStyles.iconBadge,
              compact && componentStyles.compactIconBadge,
              { backgroundColor: COLORS.primary[500] + "18", borderColor: COLORS.primary[400] + "24" },
            ]}
          >
            <Text style={[componentStyles.iconText, compact && componentStyles.compactIconText]}>{icon}</Text>
          </View>
          <Text style={[componentStyles.label, compact && componentStyles.compactLabel, { color: COLORS.zinc[300] }]} numberOfLines={compact ? 1 : 2}>
            {label}
          </Text>
        </View>

        {typeof value === "number" && (
          <View
            style={[
              styles.valueContainer,
              componentStyles.valueContainer,
              compact && componentStyles.compactValueContainer,
              { backgroundColor: COLORS.white + "08" },
            ]}
          >
            <Text style={[componentStyles.value, compact && componentStyles.compactValue, { color: COLORS.white }]}>{value.toLocaleString()}</Text>
          </View>
        )}
      </View>
    </Pressable>
  )
}

export default CustomDrawerItem

const componentStyles = StyleSheet.create({
  container: {
    width: 136,
    marginHorizontal: 0,
    marginBottom: 0,
    borderWidth: 1,
    borderRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
  },
  compactContainer: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 0,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  inner: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    minHeight: 140,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  compactInner: {
    minHeight: 76,
    paddingHorizontal: 6,
    paddingVertical: 6,
    alignItems: "center",
  },
  copyBlock: {
    alignItems: "flex-start",
    gap: 12,
    width: "100%",
  },
  compactCopyBlock: {
    gap: 5,
    alignItems: "center",
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  compactIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
  },
  iconText: {
    fontSize: 24,
    textAlign: "center",
  },
  compactIconText: {
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
  },
  compactLabel: {
    fontSize: 10,
    lineHeight: 11,
    textAlign: "center",
  },
  valueContainer: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  compactValueContainer: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignSelf: "center",
  },
  value: {
    fontSize: 12,
  },
  compactValue: {
    fontSize: 9,
    textAlign: "center",
  },
})
