import type Decimal from "decimal.js"
import { useEffect, useState } from "react"
import { Animated } from "react-native"

import Text from "../native/text"

const AnimatedCounter: React.FC<{
  value: Decimal | number
  prefix?: string
  suffix?: string
  duration?: number
  color?: string // New prop for custom color
  textSize?: string // New prop for text size
}> = ({
  value,
  prefix = "",
  suffix = "",
  duration = 1500,
  color,
  textSize = "text-2xl", // Default size
}) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const numValue = parseFloat(value.toString().replace(/[^0-9.]/g, ""))
    const animatedValue = new Animated.Value(0)

    Animated.timing(animatedValue, {
      toValue: numValue,
      duration,
      useNativeDriver: false,
    }).start()

    const listener = animatedValue.addListener(({ value }) => setDisplayValue(value))
    return () => animatedValue.removeListener(listener)
  }, [value, duration])

  const formatNumber = (num: number) => {
    if (num % 1 === 0) return num.toFixed(0)

    return num.toFixed(2)
  }

  return (
    <Text className={`${textSize} ${color ? "" : "text-white"}`} style={color ? { color } : undefined}>
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </Text>
  )
}

export default AnimatedCounter
