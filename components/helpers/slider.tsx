import React, { useMemo, useRef } from "react"
import { StyleSheet, View } from "react-native"
import { useThemeColors } from "@/config/colors"
import RNCSlider from "@react-native-community/slider"

interface SliderProps {
  value?: number[]
  onValueChange?: (value: number[]) => void
  min?: number
  allPurchasableItems?: unknown[]
  step?: number
  disabled?: boolean
  max?: number
}

const Slider = React.forwardRef<View, SliderProps>(
  ({ value = [0], onValueChange, min = 0, allPurchasableItems = [], step = 1, disabled = false, max }, ref) => {
    const COLORS = useThemeColors()
    const rafRef = useRef<number | null>(null)
    const lastEmittedRef = useRef<number>(value?.[0] ?? min)

    const effectiveMax = useMemo(
      () => (typeof max === "number" ? max : Array.isArray(allPurchasableItems) ? allPurchasableItems.length : 100),
      [max, allPurchasableItems],
    )
    const displayValue = value?.[0] ?? min

    return (
      <View ref={ref} style={[styles.container, disabled && styles.disabled]}>
        <RNCSlider
          style={styles.nativeSlider}
          value={displayValue}
          minimumValue={min}
          maximumValue={effectiveMax}
          step={step}
          disabled={disabled}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.zinc[700]}
          thumbTintColor={COLORS.primary[500]}
          onValueChange={(val: number) => {
            // Throttle with rAF and emit only on change
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            rafRef.current = requestAnimationFrame(() => {
              if (lastEmittedRef.current !== val) {
                lastEmittedRef.current = val
                onValueChange?.([val])
              }
            })
          }}
          onSlidingComplete={(val: number) => {
            if (lastEmittedRef.current !== val) {
              lastEmittedRef.current = val
              onValueChange?.([val])
            }
          }}
        />
      </View>
    )
  },
)
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 60,
  },
  nativeSlider: {
    width: "100%",
    height: 40,
  },
  disabled: {
    opacity: 0.5,
  },
  thumbDisabled: {
    opacity: 0.5,
  },
})

Slider.displayName = "Slider"

export { Slider }
