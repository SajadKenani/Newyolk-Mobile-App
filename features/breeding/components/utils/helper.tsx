import { Animated, TouchableOpacity, View } from "react-native"
import { PILL_COLORS, TABS } from "./types"
import type { BreedingStatus, EggBreedItem, EggStatus, PillProps, RoosterTab, SecondaryButtonProps, TabValue } from "./types"
import Text from "@/components/native/text"
import { useEffect, useMemo, useRef } from "react"
import { bulkActionStyles, eggBreedStyles, eggBulkActionStyles, roosterGridStyles, statBarstyles } from "./styles"
import { ActivityIndicator } from "react-native-paper"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { useThemeColors } from "@/config/colors"

export const formatDuration = (ms: number): string => {
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h`
  return `${minutes}m`
}

export const Pill = ({ icon, label, value, suffix, extra, color = "default" }: PillProps) => {
  const c = PILL_COLORS[color]
  return (
    <View style={[statBarstyles.pill, { backgroundColor: c.bg, borderColor: c.border }]}>
      <View style={statBarstyles.pillIcon}>{icon}</View>
      <Text style={[statBarstyles.pillLabel, { color: c.text }]}>{label}</Text>
      <Text style={[statBarstyles.pillValue, { color: c.value }]}>{value}</Text>
      {suffix ? <Text style={[statBarstyles.pillLabel, { color: c.text }]}>{suffix}</Text> : null}
      {extra ? (
        <>
          <Text style={[statBarstyles.pillDot, { color: c.text }]}>·</Text>
          <Text style={[statBarstyles.pillLabel, { color: c.text }]}>{extra}</Text>
        </>
      ) : null}
    </View>
  )
}

export const getStatusFromNow = (item: { isBreeding: boolean; breedingSince: Date | null }, breedingTimeInMs: string, now: number) => {
  if (!item.isBreeding || !item.breedingSince) return "idle"
  const elapsed = now - new Date(item.breedingSince).getTime()
  return elapsed >= Number(breedingTimeInMs) ? "ready" : "breeding"
}

export const TabBar = ({ active, onChange }: { active: TabValue; onChange: (v: RoosterTab) => void }) => {
  const COLORS = useThemeColors()
  const roosterGrid = useMemo(() => roosterGridStyles(COLORS), [COLORS])
  const { t } = useSafeTranslation
  return (
    <View style={roosterGrid.tabBar}>
      {TABS.map(({ value, labelKey }) => (
        <TouchableOpacity key={value} style={[roosterGrid.tabItem, active === value && roosterGrid.tabItemActive]} onPress={() => onChange(value)}>
          <Text style={[roosterGrid.tabLabel, active === value && roosterGrid.tabLabelActive]}>
            {t("Breeding." + (labelKey === "eggs" ? "tabEggs" : "tabRoosters"))}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export const getEggStatus = (item: Pick<EggBreedItem, "state" | "hatchingSince">, hatchingTimeInMs: string, now: number): EggStatus => {
  if (item.state === "hatchingEgg") return "idle"
  if (item.state === "incubatingEgg" && item.hatchingSince) {
    const elapsed = now - new Date(item.hatchingSince).getTime()
    return elapsed >= Number(hatchingTimeInMs) ? "ready" : "incubating"
  }
  return "idle"
}

export const formatExpiryRemaining = (ms: number): string => {
  if (ms <= 0) return "0h"
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h`
  const minutes = Math.floor((ms % 3600000) / 60000)
  return `${minutes}m`
}

export const formatTimeRemaining = (ms: number): string => {
  if (ms <= 0) return "0m"
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export const ProgressBar = ({ value, pulse = false }: { value: number; pulse?: boolean }) => {
  const opacity = useRef(new Animated.Value(1))

  useEffect(() => {
    if (!pulse) {
      opacity.current.setValue(1)
      return
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, { toValue: 0.3, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity.current, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [pulse])

  const clamped = Math.min(100, Math.max(0, value))

  return (
    // eslint-disable-next-line react-hooks/refs
    <Animated.View style={[eggBreedStyles.progressTrack, { opacity: pulse ? opacity.current : new Animated.Value(1) }]}>
      <View style={[eggBreedStyles.progressFill, { width: `${clamped}%` }]} />
    </Animated.View>
  )
}

export const Checkbox = ({ checked, onPress }: { checked?: boolean; onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[eggBreedStyles.checkbox, checked && eggBreedStyles.checkboxChecked]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {checked && <Text style={eggBreedStyles.checkboxTick}>✓</Text>}
    </TouchableOpacity>
  )
}

export const ActionButton = ({
  label,
  onPress,
  disabled,
  loading,
  variant = "start",
}: {
  label: string
  onPress: () => void
  disabled: boolean
  loading: boolean
  variant?: "start" | "finish"
}) => {
  return (
    <TouchableOpacity
      style={[
        eggBulkActionStyles.button,
        variant === "start" ? eggBulkActionStyles.buttonStart : eggBulkActionStyles.buttonFinish,
        disabled && eggBulkActionStyles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {loading && <ActivityIndicator size="small" color={variant === "start" ? "#d1fae5" : "#dbeafe"} style={eggBulkActionStyles.spinner} />}
      <Text
        style={[
          eggBulkActionStyles.buttonText,
          variant === "start" ? eggBulkActionStyles.buttonTextStart : eggBulkActionStyles.buttonTextFinish,
          disabled && eggBulkActionStyles.buttonTextDisabled,
        ]}
        numberOfLines={1}
      >
        {label.toUpperCase()}
      </Text>
    </TouchableOpacity>
  )
}

export const SecondaryButton = ({ children, onPress, disabled, loading, flex, variant = "start" }: SecondaryButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        bulkActionStyles.btn,
        variant === "start" ? bulkActionStyles.btnStart : bulkActionStyles.btnFinish,
        flex && bulkActionStyles.btnFlex,
        disabled && bulkActionStyles.disabled,
      ]}
      activeOpacity={0.7}
    >
      {loading && <ActivityIndicator size="small" color={variant === "start" ? "#d1fae5" : "#dbeafe"} style={bulkActionStyles.spinner} />}
      <Text style={[bulkActionStyles.btnText, variant === "start" ? bulkActionStyles.btnTextStart : bulkActionStyles.btnTextFinish]} numberOfLines={1}>
        {children.toUpperCase()}
      </Text>
    </TouchableOpacity>
  )
}
export const getBreedingStatus = (item: { isBreeding: boolean; breedingSince: Date | null }, breedingTimeInMs: string): BreedingStatus => {
  if (!item.isBreeding || !item.breedingSince) return "idle"
  const elapsed = Date.now() - new Date(item.breedingSince).getTime()
  return elapsed >= Number(breedingTimeInMs) ? "ready" : "breeding"
}
