import type React from "react"
import { Image, StyleSheet, View } from "react-native"
import { useMemo } from "react"
import Animated, { FadeInDown } from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { useThemeColors } from "@/config/colors"

import Text from "@/components/native/text"

interface AvatarPickerProps {
  avatar: string
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ avatar }) => {
  const COLORS = useThemeColors()
  const styles = useMemo(
    () =>
      StyleSheet.create({
        avatarSection: {
          alignItems: "center",
          justifyContent: "center",
        },
        avatarGradient: {
          width: 104,
          height: 104,
          borderRadius: 999,
          padding: 4,
        },
        avatarInner: {
          width: "100%",
          height: "100%",
          borderRadius: 999,
          backgroundColor: "rgba(8, 12, 20, 0.96)",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: COLORS.white + "08",
        },
        avatarImage: {
          width: "100%",
          height: "100%",
          borderRadius: 999,
        },
        avatarPlaceholder: {
          fontSize: 42,
          color: COLORS.zinc[500],
        },
      }),
    [COLORS],
  )

  return (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.avatarSection}>
      <LinearGradient colors={[COLORS.primary[500], COLORS.primary[600]]} style={styles.avatarGradient}>
        <View style={styles.avatarInner}>
          {avatar ? <Image source={{ uri: avatar }} style={styles.avatarImage} resizeMode="cover" /> : <Text style={styles.avatarPlaceholder}>👤</Text>}
        </View>
      </LinearGradient>
    </Animated.View>
  )
}
