import type { TextStyle, ViewStyle } from "react-native"
import { useMemo } from "react"
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native"
import { useThemeColors } from "@/config/colors"

import Text from "./text"

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success"
type ButtonSize = "sm" | "md" | "lg" | "xl"

interface ButtonProps extends React.ComponentPropsWithoutRef<typeof TouchableOpacity> {
  label: string
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const buttonSizes: Record<ButtonSize, ViewStyle> = {
  sm: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  md: {
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  lg: {
    height: 52,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  xl: {
    height: 60,
    paddingHorizontal: 40,
    borderRadius: 14,
  },
}

const buttonTextSizes: Record<ButtonSize, TextStyle> = {
  sm: { fontSize: 13 },
  md: { fontSize: 15 },
  lg: { fontSize: 16 },
  xl: { fontSize: 18 },
}

function Button({ label, variant = "primary", size = "md", leftIcon, rightIcon, fullWidth = false, style, disabled, ...props }: ButtonProps) {
  const COLORS = useThemeColors()

  const buttonVariants: Record<ButtonVariant, ViewStyle> = useMemo(
    () => ({
      primary: Platform.select({
        ios: {
          backgroundColor: COLORS.primary[600],
        },
        android: {
          backgroundColor: COLORS.primary[600],
          elevation: 6,
        },
        default: {
          backgroundColor: COLORS.primary[600],
        },
      }),
      secondary: Platform.select({
        ios: {
          backgroundColor: COLORS.slate[900],
        },
        android: {
          backgroundColor: COLORS.slate[900],
          elevation: 4,
        },
        default: {
          backgroundColor: COLORS.slate[900],
        },
      }),
      outline: {
        backgroundColor: COLORS.zinc[900], // subtle dark background
        borderWidth: 2,
        borderColor: COLORS.violet[950], // Tailwind violet-950
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 10,
        shadowColor: COLORS.violet[950],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
      },
      ghost: {
        backgroundColor: COLORS.zinc[100],
      },
      destructive: Platform.select({
        ios: {
          backgroundColor: COLORS.danger[600],
        },
        android: {
          backgroundColor: COLORS.danger[600],
          elevation: 6,
        },
        default: {
          backgroundColor: COLORS.danger[600],
        },
      }),
      success: Platform.select({
        ios: {
          backgroundColor: COLORS.success[600],
        },
        android: {
          backgroundColor: COLORS.success[600],
          elevation: 6,
        },
        default: {
          backgroundColor: COLORS.success[600],
        },
      }),
    }),
    [COLORS],
  )

  const buttonTextColors: Record<ButtonVariant, TextStyle> = useMemo(
    () => ({
      primary: { color: COLORS.white },
      secondary: { color: COLORS.white },
      outline: { color: COLORS.white, letterSpacing: 1 },
      ghost: { color: COLORS.zinc[700] },
      destructive: { color: COLORS.white },
      success: { color: COLORS.white },
    }),
    [COLORS],
  )

  return (
    <TouchableOpacity
      style={[styles.base, buttonVariants[variant], buttonSizes[size], fullWidth && styles.fullWidth, disabled && styles.disabled, style]}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}
    >
      <View style={styles.content}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <Text style={[styles.text, buttonTextColors[variant], buttonTextSizes[size], disabled && styles.disabledText]}>{label}</Text>
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 12,
    minHeight: 36,
    minWidth: 64,
    marginVertical: 4,
    marginHorizontal: 2,
    transitionDuration: "150ms",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    textAlign: "center",
    letterSpacing: 0.5,
  },
  iconLeft: {
    marginRight: 4,
  },
  iconRight: {
    marginLeft: 4,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    opacity: 0.6,
  },
})

export { Button }
export type { ButtonProps, ButtonVariant, ButtonSize }
