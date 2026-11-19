import { Pressable, View } from "react-native"
import { Icon } from "react-native-paper"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"

import type { CustomDrawerItemProps } from "../types/interface"
import { styles } from "../types/style"

const CustomLowerDrawerItem = ({ icon, label, isActive = false, onPress, badge, isDestructive = false }: CustomDrawerItemProps) => {
  const COLORS = useThemeColors()
  const renderIcon = () => <Icon source={icon} size={20} color={isActive ? COLORS.white : isDestructive ? COLORS.danger[500] : COLORS.zinc[500]} />

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.itemContainer,
        {
          backgroundColor: isActive ? COLORS.primary[500] + "16" : isDestructive ? COLORS.danger[500] + "12" : COLORS.white + "03",
          borderWidth: 1,
          borderColor: isActive ? COLORS.primary[400] + "30" : isDestructive ? COLORS.danger[500] + "24" : COLORS.white + "06",
          opacity: pressed ? 0.86 : 1,
        },
      ]}
    >
      <View style={styles.itemInner}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isActive ? COLORS.primary[500] + "22" : isDestructive ? COLORS.danger[500] + "12" : COLORS.white + "05",
                borderColor: isActive ? COLORS.primary[400] + "22" : isDestructive ? COLORS.danger[500] + "20" : COLORS.white + "08",
              },
            ]}
          >
            {renderIcon()}
          </View>
          <Text
            style={{
              fontSize: 15,
              color: isActive ? COLORS.white : isDestructive ? COLORS.danger[300] : COLORS.zinc[300],
            }}
          >
            {label}
          </Text>
        </View>

        {badge && (
          <View
            style={{
              minWidth: 20,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              backgroundColor: COLORS.danger[600],
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}
          >
            <Text style={{ fontSize: 12, color: COLORS.white }}>{badge}</Text>
          </View>
        )}
        {isActive && <View style={[styles.activeIndicator, { backgroundColor: COLORS.primary[200] }]} />}
      </View>
    </Pressable>
  )
}

export default CustomLowerDrawerItem
