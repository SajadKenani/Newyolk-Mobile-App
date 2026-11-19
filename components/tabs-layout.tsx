import type { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import React, { useEffect } from "react"
import { Pressable, View, StyleSheet, Dimensions } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated"
import { useThemeColors } from "@/config/colors"
import { useChromeVisibility } from "@/components/store/chrome-visibility-context"

interface EnhancedTabBarIconProps {
  label: string
  focused: boolean
  icon: React.ReactNode
  color: string
  size: number
}

import Text from "./native/text"

export const EnhancedTabBarIcon = ({ label, focused, icon, color, size }: EnhancedTabBarIconProps) => {
  const COLORS = useThemeColors()
  const focusedValue = useSharedValue(focused ? 1 : 0)
  useEffect(() => {
    focusedValue.value = focused ? 1 : 0
  }, [focused, focusedValue])

  const animatedIconStyle = useAnimatedStyle(() => {
    const isFocused = focusedValue.value
    return {
      transform: [
        { scale: withSpring(isFocused ? 1.1 : 1, { damping: 15, stiffness: 150 }) },
        { translateY: withSpring(isFocused ? -3 : 0, { damping: 12, stiffness: 100 }) },
      ],
    }
  })

  const animatedLabelStyle = useAnimatedStyle(() => {
    const isFocused = focusedValue.value
    return {
      opacity: withTiming(isFocused ? 1 : 0.7, { duration: 200 }),
      transform: [{ translateY: withSpring(isFocused ? -1 : 0, { damping: 12, stiffness: 100 }) }],
    }
  })

  const animatedShellStyle = useAnimatedStyle(() => {
    const isFocused = focusedValue.value
    return {
      transform: [{ scale: withSpring(isFocused ? 1.02 : 0.96, { damping: 16, stiffness: 170 }) }],
      opacity: withTiming(isFocused ? 1 : 0.82, { duration: 180 }),
    }
  })

  return (
    <View style={styles.iconContainer}>
      <Animated.View style={[styles.iconAnimated, animatedIconStyle]}>
        <Animated.View
          style={[
            styles.iconShell,
            animatedShellStyle,
            focused
              ? {
                  backgroundColor: COLORS.primary[500] + "26",
                  borderColor: COLORS.primary[300] + "40",
                  shadowColor: COLORS.primary[500],
                }
              : {
                  backgroundColor: COLORS.white + "04",
                  borderColor: COLORS.white + "08",
                },
          ]}
        >
          <View style={styles.iconInner}>
            {React.cloneElement(icon as React.ReactElement<{ color?: string; size?: number }>, {
              color: focused ? COLORS.white : color,
              size: focused ? size + 2 : size,
            })}
          </View>
        </Animated.View>
      </Animated.View>
      <Animated.View style={[styles.labelAnimated, animatedLabelStyle]}>
        <Text style={[styles.labelText, focused ? { color: COLORS.primary[200] } : { color: COLORS.zinc[400] }]}>{label}</Text>
      </Animated.View>
    </View>
  )
}

export const CustomTabBar = ({ state, descriptors, navigation }: Pick<BottomTabBarProps, "state" | "descriptors" | "navigation">) => {
  const COLORS = useThemeColors()
  const { isChromeVisible } = useChromeVisibility()
  const tabWidth = (Dimensions.get("window").width - 32) / state.routes.length

  // Animated pill position
  const pillTranslate = useSharedValue(state.index * tabWidth)
  const visibilityProgress = useSharedValue(isChromeVisible ? 1 : 0)
  useEffect(() => {
    pillTranslate.value = withSpring(state.index * tabWidth, { damping: 18, stiffness: 180 })
  }, [pillTranslate, state.index, tabWidth])

  useEffect(() => {
    visibilityProgress.value = withTiming(isChromeVisible ? 1 : 0, {
      duration: isChromeVisible ? 220 : 180,
    })
  }, [isChromeVisible, visibilityProgress])

  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillTranslate.value }],
    opacity: 0.15,
  }))

  const animatedTabBarStyle = useAnimatedStyle(() => ({
    opacity: visibilityProgress.value,
    transform: [{ translateY: 120 * (1 - visibilityProgress.value) }],
  }))

  return (
    <Animated.View pointerEvents={isChromeVisible ? "auto" : "none"} style={[styles.tabBarAbsolute, animatedTabBarStyle]}>
      <View style={[styles.tabBarContainer, styles.tabBarShadow, { borderColor: COLORS.primary[400] + "26" }]}>
        <View pointerEvents="none" style={[styles.tabBarTopGlow, { backgroundColor: COLORS.primary[400] + "26" }]} />
        <View pointerEvents="none" style={[styles.tabBarSideGlow, { backgroundColor: COLORS.primary[600] + "26" }]} />
        <View pointerEvents="none" style={[styles.tabBarEdgeLine, { backgroundColor: COLORS.primary[300] + "26" }]} />
        <Animated.View style={[styles.pill, { width: tabWidth - 12, left: 6 }, animatedPillStyle]} />
        <TabBarContent state={state} descriptors={descriptors} navigation={navigation} />
      </View>
      <View style={styles.bottomSafeArea} />
    </Animated.View>
  )
}

export const TabBarContent = ({ state, descriptors, navigation }: Pick<BottomTabBarProps, "state" | "descriptors" | "navigation">) => {
  const COLORS = useThemeColors()
  return (
    <View style={styles.tabBarContent}>
      {state.routes.map((route, index) => {
        const opts = descriptors[route.key]
        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name)
        }

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tabPressable}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={opts?.options.tabBarAccessibilityLabel}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            {opts?.options.tabBarIcon
              ? opts?.options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? COLORS.white : COLORS.zinc[500],
                  size: 24,
                })
              : null}
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconAnimated: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  iconShell: {
    minWidth: 50,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 4,
  },
  iconInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  labelAnimated: {
    marginTop: 5,
    zIndex: 2,
  },
  labelText: {
    fontSize: 11,
    letterSpacing: 0.6,
  },
  tabBarAbsolute: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
  },
  tabBarContainer: {
    marginBottom: 18,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    overflow: "hidden",
    backgroundColor: "rgba(11, 10, 8, 0.85)",
    position: "relative",
    minHeight: 84,
  },
  tabBarShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
    elevation: 18,
  },
  tabBarTopGlow: {
    position: "absolute",
    top: -28,
    left: 28,
    right: 90,
    height: 74,
    borderRadius: 999,
  },
  tabBarSideGlow: {
    position: "absolute",
    right: -18,
    top: 14,
    width: 92,
    height: 92,
    borderRadius: 999,
  },
  tabBarEdgeLine: {
    position: "absolute",
    left: 18,
    right: 18,
    top: 0,
    height: 1,
  },
  androidTabBarBg: {
    backgroundColor: "black",
    borderColor: "red",
  },
  pill: {
    position: "absolute",
    top: 8,
    bottom: 8,
    borderRadius: 22,
    zIndex: 1,
    backgroundColor: "rgba(214, 184, 68, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(232, 206, 102, 0.15)",
  },
  bottomSafeArea: {
    height: 32,
  },
  tabBarContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    zIndex: 2,
  },
  tabPressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    minHeight: 64,
  },
  inner: {
    marginHorizontal: 8,
    marginBottom: 16,
    paddingHorizontal: 32,
    paddingVertical: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    borderWidth: 1,
    // shadow
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.15,
    // shadowRadius: 8,
    // elevation: 6,
  },
})
