import { StyleSheet, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Button } from "@/components/native/button"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import { useActionCenter } from "@/features/farm/hooks/useActionCenter"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { formatNumber } from "@/utils/format"

import type { FarmingInfoStrings } from "@newyolk/types"

import { actionCenterStyles } from "./utils/styles"
import { AMBER, EMERALD, VIOLET, WHITE } from "./utils/types"

const TOTAL_FEED_CYCLE_MS = 12 * 60 * 60 * 1000

const ActionCenter = ({
  farmingInfo,
  handleFeed,
  feedMyFarm,
  remainingTimeHen,
  remainingTimeCattle,
}: {
  farmingInfo: FarmingInfoStrings
  handleFeed: ({ model }: { model: "hen" | "cattle" | "all" }) => void
  feedMyFarm: { isPending: boolean }
  remainingTimeHen: number
  remainingTimeCattle: number
}) => {
  const { henDisabled, cattleDisabled, formatRemainingTime } = useActionCenter(feedMyFarm, remainingTimeHen, remainingTimeCattle)
  const COLORS = useThemeColors()
  const { t } = useSafeTranslation

  const operations = [
    {
      key: "hen",
      label: t.FarmPage.hens,
      icon: "🐔",
      availableRewards: farmingInfo.foodAndRewards.hens.availableRewards,
      neededFood: farmingInfo.foodAndRewards.hens.owedFood,
      remainingTime: remainingTimeHen,
      primaryColor: AMBER,
      secondaryColor: VIOLET,
      disabled: henDisabled,
      onPress: () => {
        if (!henDisabled) handleFeed({ model: "hen" })
      },
      buttonLabel: remainingTimeHen > 0 ? formatRemainingTime(remainingTimeHen) : t("Header.buttons.feedNow") + " 🐔",
    },
    {
      key: "cattle",
      label: t.FarmPage.cattles,
      icon: "🐄",
      availableRewards: farmingInfo.foodAndRewards.cattles.availableRewards,
      neededFood: farmingInfo.foodAndRewards.cattles.owedFood,
      remainingTime: remainingTimeCattle,
      primaryColor: EMERALD,
      secondaryColor: WHITE,
      disabled: cattleDisabled,
      onPress: () => {
        if (!cattleDisabled) handleFeed({ model: "cattle" })
      },
      buttonLabel: remainingTimeCattle > 0 ? formatRemainingTime(remainingTimeCattle) : t("Header.buttons.feedNow") + " 🐄",
    },
  ]

  return (
    <View style={[actionCenterStyles.container, { borderColor: COLORS.primary[950] }]} className="bg-slate-900/80">
      <LinearGradient colors={[COLORS.primary[500] + "16", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
      <View pointerEvents="none" style={[actionCenterStyles.panelGlow, { backgroundColor: COLORS.primary[400] + "18" }]} />

      <View style={localStyles.headerBlock}>
        <Text style={[actionCenterStyles.eyebrow, localStyles.headerEyebrow, { color: COLORS.primary[300] }]}>{t.FarmPage.actionCenter}</Text>
        <Text style={localStyles.headerTitle}>{t.FarmPage.rewardsAvailable}</Text>
      </View>

      <View style={localStyles.rowsBlock}>
        {operations.map((operation) => {
          const progress = Math.min(1, Math.max(0, 1 - operation.remainingTime / TOTAL_FEED_CYCLE_MS))

          return (
            <View key={operation.key} style={localStyles.operationRow}>
              <View style={localStyles.operationLeft}>
                <Text style={[localStyles.timerText, { color: COLORS.zinc[400] }]}>{formatRemainingTime(Math.max(operation.remainingTime, 0))}</Text>
                <View style={localStyles.metricInline}>
                  <Text style={[localStyles.metricSymbol, { color: operation.primaryColor }]}>✦</Text>
                  <Text style={[localStyles.primaryValue, { color: operation.primaryColor }]}>{formatNumber(operation.availableRewards)}</Text>
                </View>
              </View>

              <View style={localStyles.operationRight}>
                <Text style={[localStyles.operationLabel, { color: COLORS.white }]}>{operation.label}</Text>
                <View style={localStyles.metricInlineRight}>
                  <Text style={[localStyles.secondaryValue, { color: operation.secondaryColor }]}>{formatNumber(operation.neededFood)}</Text>
                  <Text style={[localStyles.secondarySymbol, { color: operation.secondaryColor }]}>◌</Text>
                </View>
              </View>

              <View style={[localStyles.iconRing, { borderColor: COLORS.primary[500] + "7A" }]}>
                <Text style={localStyles.iconText}>{operation.icon}</Text>
              </View>

              <View style={[localStyles.progressTrack, { backgroundColor: COLORS.white + "08" }]}>
                <LinearGradient
                  colors={[COLORS.primary[500] + "CC", COLORS.primary[700] + "90"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[localStyles.progressFill, { width: `${progress * 100}%` }]}
                />
              </View>
            </View>
          )
        })}
      </View>

      <View style={actionCenterStyles.actions}>
        {operations.map((operation) => (
          <Button
            key={operation.key}
            label={operation.buttonLabel}
            variant="primary"
            size="md"
            style={actionCenterStyles.actionButton}
            onPress={operation.onPress}
            fullWidth={false}
            disabled={operation.disabled}
          />
        ))}
      </View>
    </View>
  )
}

const localStyles = StyleSheet.create({
  headerBlock: {
    gap: 4,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 14,
    alignItems: "flex-end",
  },
  headerEyebrow: {
    textAlign: "right",
  },
  headerTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: WHITE,
    textAlign: "right",
  },
  rowsBlock: {
    paddingHorizontal: 24,
    gap: 18,
  },
  operationRow: {
    position: "relative",
    minHeight: 92,
    paddingRight: 64,
  },
  operationLeft: {
    alignItems: "flex-start",
    gap: 8,
  },
  operationRight: {
    position: "absolute",
    top: 0,
    right: 64,
    alignItems: "flex-end",
    gap: 8,
  },
  timerText: {
    fontSize: 18,
    lineHeight: 22,
  },
  operationLabel: {
    fontSize: 18,
    lineHeight: 22,
  },
  metricInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metricInlineRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metricSymbol: {
    fontSize: 16,
    lineHeight: 18,
  },
  secondarySymbol: {
    fontSize: 14,
    lineHeight: 16,
  },
  primaryValue: {
    fontSize: 28,
    lineHeight: 32,
  },
  secondaryValue: {
    fontSize: 22,
    lineHeight: 26,
  },
  iconRing: {
    position: "absolute",
    top: 2,
    right: 0,
    width: 48,
    height: 48,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  iconText: {
    fontSize: 24,
  },
  progressTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
})

export default ActionCenter
