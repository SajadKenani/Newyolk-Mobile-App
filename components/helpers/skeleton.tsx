import type { ViewProps, ViewStyle } from "react-native"
import { memo, useEffect, useState } from "react"
import { Animated, Easing, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

export type SkeletonProps = ViewProps & {
  colorMode?: "light" | "dark"
  height?: number
  radius?: number | "round"
  speed?: number // animation duration in ms
  direction?: "ltr" | "rtl" // shimmer direction
  disabled?: boolean // render static block without shimmer
  baseColor?: string
  highlightColor?: string
  shimmerWidth?: number // gradient width; auto if undefined
}

const Skeleton: React.FC<SkeletonProps> = ({
  colorMode = "dark",
  height = 16,
  radius = 8,
  speed = 1200,
  direction = "ltr",
  disabled = false,
  baseColor,
  highlightColor,
  shimmerWidth,
  style,
  onLayout,
  ...rest
}) => {
  const [shimmer] = useState(() => new Animated.Value(0))
  const [containerWidth, setContainerWidth] = useState<number>(0)

  useEffect(() => {
    if (disabled) {
      shimmer.stopAnimation()
      return
    }
    shimmer.setValue(0)
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: speed,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    )
    loop.start()
    return () => loop.stop()
  }, [disabled, shimmer, speed])

  const resolvedBase = baseColor ?? (colorMode === "dark" ? "#1f2937" : "#e5e7eb") // zinc-800 or gray-200
  const resolvedHighlight = highlightColor ?? (colorMode === "dark" ? "#374151" : "#f3f4f6") // zinc-700 or gray-100

  const gradientWidth = shimmerWidth ?? Math.max(160, Math.floor(containerWidth * 0.5))
  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: direction === "rtl" ? [containerWidth, -gradientWidth] : [-gradientWidth, containerWidth],
  })

  const numericRadius: number = typeof radius === "number" ? radius : height ? height / 2 : 9999
  const containerStyle: ViewStyle = {
    height,
    borderRadius: numericRadius,
    overflow: "hidden",
    backgroundColor: resolvedBase,
  }

  return (
    <View
      style={[containerStyle, style]}
      onLayout={(e) => {
        setContainerWidth(e.nativeEvent.layout.width)
        onLayout?.(e)
      }}
      pointerEvents="none"
      {...rest}
    >
      {!disabled && (
        <Animated.View style={{ transform: [{ translateX }] }}>
          <LinearGradient
            colors={[resolvedHighlight + "00", resolvedHighlight + "90", resolvedHighlight + "00"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: gradientWidth, height: "100%" }}
          />
        </Animated.View>
      )}
    </View>
  )
}

export const MemoSkeleton = memo(Skeleton)
export { Skeleton }
export default Skeleton
