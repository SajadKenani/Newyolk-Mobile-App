import { useEffect, useMemo, useRef } from "react"
import { View, Image, TouchableOpacity, Pressable, Animated, ActivityIndicator, StyleSheet } from "react-native"
import { useThemeColors } from "@/config/colors"
import Text from "@/components/native/text"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { getFarmAssetImageSource } from "@/utils/local-asset-image"
import type { EggBreedCardProps } from "../utils/types"
import { formatExpiryRemaining, formatTimeRemaining, getEggStatus, ProgressBar } from "../utils/helper"
import { eggBreedStyles } from "../utils/styles"

const createCardStyles = (COLORS: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    cardBase: {
      backgroundColor: COLORS.slate[950],
      borderColor: COLORS.zinc[700],
    },
    cardSelected: {
      borderColor: COLORS.primary[400],
      shadowColor: COLORS.primary[500],
    },
    cardIncubating: {
      shadowColor: COLORS.warning[500],
    },
    cardReady: {
      shadowColor: COLORS.primary[500],
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.18,
      shadowRadius: 22,
      elevation: 10,
    },
    imageFrame: {
      height: 252,
    },
    imageScrim: {
      backgroundColor: "rgba(8,10,16,0.22)",
    },
    contentTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 10,
    },
    titleBlock: {
      flex: 1,
      gap: 4,
    },
    titleEyebrow: {
      fontSize: 10,
      lineHeight: 12,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      color: COLORS.zinc[400],
    },
    title: {
      color: COLORS.offWhite,
      fontSize: 18,
      lineHeight: 22,
    },
    numIdBadge: {
      borderRadius: 9999,
      backgroundColor: COLORS.zinc[900],
      borderWidth: 1,
      borderColor: COLORS.zinc[700],
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    summaryPill: {
      borderRadius: 9999,
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 7,
      alignSelf: "flex-start",
      maxWidth: "100%",
    },
    summaryPillIdle: {
      backgroundColor: COLORS.success[900],
      borderColor: COLORS.success[700],
    },
    summaryPillIncubating: {
      backgroundColor: COLORS.warning[900],
      borderColor: COLORS.warning[700],
    },
    summaryPillReady: {
      backgroundColor: COLORS.primary[900],
      borderColor: COLORS.primary[700],
    },
    summaryPillText: {
      fontSize: 11,
      lineHeight: 14,
    },
    summaryPillTextIdle: {
      color: COLORS.success[300],
    },
    summaryPillTextIncubating: {
      color: COLORS.warning[300],
    },
    summaryPillTextReady: {
      color: COLORS.primary[300],
    },
    actionButtonIdle: {
      backgroundColor: COLORS.success[700],
      borderColor: COLORS.success[500],
    },
    actionButtonReady: {
      backgroundColor: COLORS.primary[700],
      borderColor: COLORS.primary[500],
    },
    badgeIdle: {
      backgroundColor: COLORS.success[900],
      borderColor: COLORS.success[700],
    },
    badgeIncubating: {
      backgroundColor: COLORS.warning[900],
      borderColor: COLORS.warning[700],
    },
    badgeReady: {
      backgroundColor: COLORS.primary[900],
      borderColor: COLORS.primary[700],
    },
    badgeTextIdle: {
      color: COLORS.success[300],
    },
    badgeTextIncubating: {
      color: COLORS.warning[300],
    },
    badgeTextReady: {
      color: COLORS.primary[300],
    },
    bottomOverlay: {
      backgroundColor: COLORS.black,
      borderTopColor: COLORS.zinc[700],
    },
    numIdText: {
      color: COLORS.offWhite,
    },
    readyLabel: {
      color: COLORS.primary[300],
    },
  })

const EggBreedCard = ({
  item,
  hatchingTimeInMs,
  hatchingEggExpiryInMs,
  now,
  onStartIncubation,
  onFinishHatching,
  isLoading,
  isSelected,
  onToggleSelect,
}: EggBreedCardProps) => {
  const COLORS = useThemeColors()
  const cardStyles = useMemo(() => createCardStyles(COLORS), [COLORS])
  const { t } = useSafeTranslation
  const status = getEggStatus(item, hatchingTimeInMs, now)

  const pulseOpacity = useRef(new Animated.Value(1)).current
  useEffect(() => {
    if (status !== "ready") {
      pulseOpacity.setValue(0)
      return
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseOpacity, { toValue: 0.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [status, pulseOpacity])

  const hatchingTimeMs = Number(hatchingTimeInMs)
  const elapsed = item.hatchingSince ? now - new Date(item.hatchingSince).getTime() : 0
  const progressValue = status === "incubating" ? Math.min(100, (elapsed / hatchingTimeMs) * 100) : status === "ready" ? 100 : 0
  const incubationMsRemaining = hatchingTimeMs - elapsed

  const expiresAt = new Date(item.createdAt).getTime() + Number(hatchingEggExpiryInMs)
  const expiryMsRemaining = expiresAt - now
  const daysRemaining = expiryMsRemaining / 86400000
  const expiryColor = daysRemaining > 5 ? COLORS.success[400] : daysRemaining > 2 ? COLORS.warning[400] : COLORS.danger[400]

  const imageSrc = getFarmAssetImageSource({ state: status === "idle" ? "hatchingEgg" : "incubatingEgg", numId: item.numId })
  const statusLabel = status === "idle" ? t.Breeding.egg.idle : status === "incubating" ? t.Breeding.egg.incubating : t.Breeding.egg.ready

  const detailLabel =
    status === "idle"
      ? expiryMsRemaining <= 0
        ? t.Breeding.egg.expired
        : t.Breeding.egg.expiresIn.replace("{time}", formatExpiryRemaining(expiryMsRemaining))
      : status === "incubating"
        ? t.Breeding.egg.timeRemaining.replace("{time}", formatTimeRemaining(Math.max(0, incubationMsRemaining)))
        : t.Breeding.egg.readyToHatch

  const badgeStyle = status === "idle" ? cardStyles.badgeIdle : status === "incubating" ? cardStyles.badgeIncubating : cardStyles.badgeReady
  const badgeTextStyle = status === "idle" ? cardStyles.badgeTextIdle : status === "incubating" ? cardStyles.badgeTextIncubating : cardStyles.badgeTextReady
  // const summaryPillStyle = status === "idle" ? cardStyles.summaryPillIdle : status === "incubating" ? cardStyles.summaryPillIncubating : cardStyles.summaryPillReady
  const summaryPillTextStyle =
    status === "idle" ? cardStyles.summaryPillTextIdle : status === "incubating" ? cardStyles.summaryPillTextIncubating : cardStyles.summaryPillTextReady
  const actionButtonStyle = status === "ready" ? cardStyles.actionButtonReady : cardStyles.actionButtonIdle

  return (
    <Pressable
      style={[
        eggBreedStyles.card,
        cardStyles.cardBase,
        isSelected && eggBreedStyles.cardSelected,
        isSelected && cardStyles.cardSelected,
        status === "incubating" && eggBreedStyles.cardIncubating,
        status === "incubating" && cardStyles.cardIncubating,
        status === "ready" && cardStyles.cardReady,
      ]}
      onPress={() => onToggleSelect?.(item.id)}
    >
      <View style={cardStyles.imageFrame}>
        <Image source={imageSrc} style={eggBreedStyles.image} resizeMode="cover" />
        <View style={cardStyles.imageScrim} pointerEvents="none" />
      </View>

      {status === "ready" && <Animated.View pointerEvents="none" style={[eggBreedStyles.readyBorderOverlay, { opacity: pulseOpacity }]} />}

      {/* {onToggleSelect && (
        <View style={eggBreedStyles.checkboxContainer}>
          <Checkbox checked={isSelected} onPress={() => onToggleSelect(item.id)} />
        </View>
      )} */}

      <View style={[eggBreedStyles.badge, badgeStyle]}>
        <Text style={[eggBreedStyles.badgeText, badgeTextStyle]}>{statusLabel}</Text>
      </View>

      <View style={[eggBreedStyles.bottomOverlay, cardStyles.bottomOverlay]}>
        <View style={cardStyles.contentTopRow}>
          <View style={cardStyles.titleBlock}>
            <Text style={cardStyles.title} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[cardStyles.summaryPillText, summaryPillTextStyle]} numberOfLines={1}>
              {detailLabel}
            </Text>
          </View>
        </View>

        {status === "idle" && (
          <View style={eggBreedStyles.progressSection}>
            <View style={eggBreedStyles.progressLabelRow}>
              {expiryMsRemaining > 0 && (
                <Text style={[eggBreedStyles.progressLabel, { color: expiryColor }]}>
                  {t.Breeding.egg.expiresIn.replace("{time}", formatExpiryRemaining(expiryMsRemaining))}
                </Text>
              )}
            </View>
            <ProgressBar value={0} />
          </View>
        )}

        {status === "incubating" && (
          <View style={eggBreedStyles.progressSection}>
            <View style={eggBreedStyles.progressLabelRow}>
              <Text style={eggBreedStyles.progressLabel}>{t.Breeding.egg.incubating}</Text>
              <Text style={eggBreedStyles.progressLabel}>{formatTimeRemaining(Math.max(0, incubationMsRemaining))}</Text>
            </View>
            <View>
              <ProgressBar value={progressValue} />
              <View style={eggBreedStyles.progressPercentOverlay} pointerEvents="none">
                <Text style={eggBreedStyles.progressPercent}>{Math.round(progressValue)}%</Text>
              </View>
            </View>
          </View>
        )}

        {status === "ready" && (
          <View style={eggBreedStyles.progressSection}>
            <View style={eggBreedStyles.progressLabelRow}>
              <Text style={[eggBreedStyles.progressLabel, cardStyles.readyLabel]}>{t.Breeding.egg.readyToHatch}</Text>
            </View>
            <View>
              <ProgressBar value={100} pulse />
              <View style={eggBreedStyles.progressPercentOverlay} pointerEvents="none">
                <Text style={eggBreedStyles.progressPercent}>100%</Text>
              </View>
            </View>
          </View>
        )}

        {status === "idle" && onStartIncubation && (
          <TouchableOpacity
            style={[eggBreedStyles.actionButton, actionButtonStyle, isLoading && eggBreedStyles.actionButtonDisabled]}
            disabled={isLoading}
            onPress={() => onStartIncubation(item.id)}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={eggBreedStyles.actionButtonText}>{t.Breeding.egg.startIncubationButton}</Text>
            )}
          </TouchableOpacity>
        )}

        {status === "ready" && onFinishHatching && (
          <TouchableOpacity
            style={[eggBreedStyles.actionButton, actionButtonStyle, isLoading && eggBreedStyles.actionButtonDisabled]}
            disabled={isLoading}
            onPress={() => onFinishHatching(item.id)}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={eggBreedStyles.actionButtonText}>{t.Breeding.egg.finishHatchingButton}</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  )
}

export default EggBreedCard
