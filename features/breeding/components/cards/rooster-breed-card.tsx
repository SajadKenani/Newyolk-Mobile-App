import { useEffect, useRef } from "react"
import { Animated, ActivityIndicator, Image, Pressable, TouchableOpacity, View } from "react-native"
import Text from "@/components/native/text"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { getFarmAssetImageSource } from "@/utils/local-asset-image"
import { BADGE_STYLES } from "../utils/types"
import type { BreedingStatus, RoosterBreedCardProps } from "../utils/types"
import { roosterBreedStyles } from "../utils/styles"
import { Checkbox, formatTimeRemaining, ProgressBar } from "../utils/helper"

const RoosterBreedCard = ({ item, breedingTimeInMs, now, onStartBreed, onFinishBreed, isLoading, isSelected, onToggleSelect }: RoosterBreedCardProps) => {
  const { t } = useSafeTranslation

  const status: BreedingStatus = (() => {
    if (!item.isBreeding || !item.breedingSince) return "idle"
    const elapsed = now - new Date(item.breedingSince).getTime()
    return elapsed >= Number(breedingTimeInMs) ? "ready" : "breeding"
  })()

  const breedingTimeMs = Number(breedingTimeInMs)
  const elapsed = item.breedingSince ? now - new Date(item.breedingSince).getTime() : 0
  const progressValue = status === "breeding" ? Math.min(100, (elapsed / breedingTimeMs) * 100) : status === "ready" ? 100 : 0
  const msRemaining = breedingTimeMs - elapsed

  const pulseOpacity = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (status !== "ready") {
      pulseOpacity.setValue(0)
      return
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseOpacity, { toValue: 0.2, duration: 800, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [status, pulseOpacity])

  const badge = BADGE_STYLES[status]
  const statusLabel = status === "idle" ? t.Breeding.idle : status === "breeding" ? t.Breeding.breeding : t.Breeding.ready

  return (
    <Pressable style={[roosterBreedStyles.card, isSelected && roosterBreedStyles.cardSelected]} onPress={() => onToggleSelect?.(item.id)}>
      {status === "ready" && <Animated.View pointerEvents="none" style={[roosterBreedStyles.readyBorder, { opacity: pulseOpacity }]} />}

      {onToggleSelect && (
        <View style={roosterBreedStyles.checkboxContainer}>
          <Checkbox checked={isSelected} onPress={() => onToggleSelect(item.id)} />
        </View>
      )}

      <Image
        source={getFarmAssetImageSource({ state: item.state, numId: item.numId })}
        style={roosterBreedStyles.image}
        resizeMode="cover"
        accessibilityLabel={item.name + " image"}
      />

      <View style={[roosterBreedStyles.badge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
        <Text style={[roosterBreedStyles.badgeText, { color: badge.text }]}>{statusLabel}</Text>
      </View>

      <View style={roosterBreedStyles.bottomOverlay}>
        <View style={roosterBreedStyles.row}>
          <Text style={roosterBreedStyles.numId}>#{item.numId}</Text>
          <Text style={roosterBreedStyles.mutedText}>
            {t.Breeding.breedingsCounter.replace("{current}", String(item.breedingsCounter)).replace("{max}", "540")}
          </Text>
        </View>

        {status === "breeding" && (
          <View style={roosterBreedStyles.progressSection}>
            <View style={roosterBreedStyles.progressLabelRow}>
              <Text style={roosterBreedStyles.mutedText}>{t.Breeding.breeding}</Text>
              <Text style={roosterBreedStyles.mutedText}>{formatTimeRemaining(msRemaining)}</Text>
            </View>
            <View>
              <ProgressBar value={progressValue} />
              <View style={roosterBreedStyles.progressPercentOverlay} pointerEvents="none">
                <Text style={roosterBreedStyles.progressPercent}>{Math.round(progressValue)}%</Text>
              </View>
            </View>
          </View>
        )}

        {status === "ready" && (
          <View style={roosterBreedStyles.progressSection}>
            <View style={roosterBreedStyles.progressLabelRow}>
              <Text style={roosterBreedStyles.readyLabel}>{t.Breeding.readyToCollect}</Text>
            </View>
            <View>
              <ProgressBar value={100} pulse />
              <View style={roosterBreedStyles.progressPercentOverlay} pointerEvents="none">
                <Text style={roosterBreedStyles.progressPercent}>100%</Text>
              </View>
            </View>
          </View>
        )}

        {status === "idle" && (
          <View style={roosterBreedStyles.progressSection}>
            <View style={roosterBreedStyles.progressLabelRow}>
              <Text style={roosterBreedStyles.mutedText}>{t.Breeding.idle}</Text>
            </View>
            <ProgressBar value={0} />
          </View>
        )}

        {status === "idle" && onStartBreed && (
          <TouchableOpacity
            style={[roosterBreedStyles.actionButton, isLoading && roosterBreedStyles.actionButtonDisabled]}
            disabled={isLoading}
            onPress={() => onStartBreed(item.id)}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={roosterBreedStyles.actionButtonText}>{t.Breeding.startBreedButton}</Text>
            )}
          </TouchableOpacity>
        )}

        {status === "ready" && onFinishBreed && (
          <TouchableOpacity
            style={[roosterBreedStyles.actionButton, isLoading && roosterBreedStyles.actionButtonDisabled]}
            disabled={isLoading}
            onPress={() => onFinishBreed(item.id)}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={roosterBreedStyles.actionButtonText}>{t.Breeding.finishBreedButton}</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  )
}

export default RoosterBreedCard
