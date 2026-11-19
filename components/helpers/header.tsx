import { useEffect } from "react"
import type { DrawerNavigationProp } from "@react-navigation/drawer"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import { useNavigation } from "expo-router"
import { useThemeColors } from "@/config/colors"
import { DrawerActions } from "@react-navigation/native"
import { ArrowLeft, Menu } from "lucide-react-native"
import type { ImageSourcePropType } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

import { useChromeVisibility } from "@/components/store/chrome-visibility-context"
import Text from "../native/text"
import { Image } from "react-native"

type DrawerParamList = Record<string, undefined>

interface Props {
  title?: string
  showBackButton?: boolean
  showMenuButton?: boolean
  transparent?: boolean
  back?: string
}

const ACTION_SIZE = 48

const Header = ({ title, showBackButton = false, showMenuButton, transparent = false }: Props) => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>()
  const COLORS = useThemeColors()
  const { isChromeVisible } = useChromeVisibility()
  const visibilityProgress = useSharedValue(isChromeVisible ? 1 : 0)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
  const NewyolkIcon: ImageSourcePropType = require("@/assets/icons/adaptive-icon.png")

  useEffect(() => {
    visibilityProgress.value = withTiming(isChromeVisible ? 1 : 0, {
      duration: isChromeVisible ? 220 : 180,
    })
  }, [isChromeVisible, visibilityProgress])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: visibilityProgress.value,
    transform: [{ translateY: -70 * (1 - visibilityProgress.value) }],
  }))

  return (
    <Animated.View
      pointerEvents={isChromeVisible ? "box-none" : "none"}
      style={[styles.header, transparent ? styles.headerTransparent : styles.headerSolid, animatedStyle]}
    >
      <View
        style={[
          styles.shell,
          {
            backgroundColor: transparent ? COLORS.black + "A8" : COLORS.zinc[950] + "F2",
            borderColor: COLORS.primary[500] + "24",
            shadowColor: COLORS.black,
          },
        ]}
      >
        <View
          style={[
            styles.glow,
            {
              backgroundColor: COLORS.primary[400] + "18",
              borderColor: COLORS.primary[400] + "30",
            },
          ]}
        />

        <View style={styles.row}>
          <View style={styles.sideSlot}>
            {showBackButton ? (
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  {
                    backgroundColor: COLORS.primary[500] + "14",
                    borderColor: COLORS.primary[400] + "2C",
                  },
                ]}
                onPress={() => navigation.goBack()}
              >
                <ArrowLeft size={22} color={COLORS.primary[300]} />
              </TouchableOpacity>
            ) : (
              <Image source={NewyolkIcon} style={styles.logo} />
            )}
          </View>

          <View style={styles.titleBlock}>
            <View style={[styles.accentRail, { backgroundColor: COLORS.primary[500] }]} />
            <View style={styles.titleContent}>
              <Text style={[styles.eyebrowText, { color: COLORS.primary[300] }]}>NEWYOLK</Text>
              <Text style={[styles.titleText, { color: COLORS.white }]} numberOfLines={1}>
                {title ?? "NewYolk"}
              </Text>
            </View>
          </View>

          <View style={styles.sideSlotRight}>
            {showMenuButton ? (
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  {
                    backgroundColor: COLORS.primary[500] + "14",
                    borderColor: COLORS.primary[400] + "2C",
                  },
                ]}
                onPress={() => {
                  try {
                    navigation.dispatch(DrawerActions.openDrawer())
                  } catch (error) {
                    console.error("Failed to open drawer: ", error)
                  }
                }}
              >
                <Menu size={22} color={COLORS.primary[300]} />
              </TouchableOpacity>
            ) : (
              <View style={styles.actionSpacer} />
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  )
}
export default Header

const styles = StyleSheet.create({
  header: {
    left: 0,
    right: 0,
    top: 0,
    marginTop: 48,
    position: "absolute",
    zIndex: 50,
    paddingHorizontal: 14,
    paddingVertical: 18,
  },
  headerTransparent: {
    backgroundColor: "transparent",
  },
  headerSolid: {
    backgroundColor: "transparent",
  },
  shell: {
    overflow: "hidden",
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 12,
  },
  glow: {
    position: "absolute",
    right: -36,
    top: -24,
    width: 140,
    height: 140,
    borderRadius: 999,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 10,
  },
  sideSlot: {
    width: ACTION_SIZE,
    alignItems: "flex-start",
  },
  sideSlotRight: {
    width: ACTION_SIZE,
    alignItems: "flex-end",
  },
  actionSpacer: {
    width: ACTION_SIZE,
    height: ACTION_SIZE,
  },
  iconButton: {
    height: ACTION_SIZE,
    width: ACTION_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    borderWidth: 1,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 4,
  },
  logo: {
    width: 60,
    height: 60,
  },
  accentRail: {
    width: 4,
    height: 32,
    borderRadius: 999,
    marginRight: 12,
  },
  titleContent: {
    flex: 1,
    minWidth: 0,
  },
  eyebrowText: {
    fontSize: 10,
    letterSpacing: 2.8,
    marginBottom: 3,
  },
  titleText: {
    fontSize: 22,
    letterSpacing: 0.4,
    lineHeight: 26,
  },
})
