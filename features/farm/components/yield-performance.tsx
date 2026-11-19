import { View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { formatNumber } from "@/utils/format"
import Decimal from "decimal.js"

import type { FarmingInfoStrings } from "@newyolk/types"

import Text from "@/components/native/text"
import { yieldStyles } from "./utils/styles"

const YieldPerformance = ({ farmingInfo }: { farmingInfo: FarmingInfoStrings }) => {
  const { t } = useSafeTranslation
  const COLORS = useThemeColors()

  const violet = COLORS.primary[500]
  const amber = COLORS.amber.yellow500
  const white = COLORS.offWhite
  const emerald = COLORS.success[500]
  const muted = COLORS.zinc[400]
  const border = COLORS.zinc[800]
  const progressBg = COLORS.primary[500]

  const rentRemaining = new Decimal(farmingInfo.foodAndRewards.hens.remainingRent).toNumber()
  const rentProgress = `${Math.max(0, Math.min(100, rentRemaining))}%` as const

  return (
    <View style={[yieldStyles.container, { borderColor: COLORS.primary[950] }]}>
      <LinearGradient colors={[COLORS.primary[500] + "16", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={yieldStyles.panelGradient} />
      <View pointerEvents="none" style={[yieldStyles.panelGlow, { backgroundColor: COLORS.primary[400] + "18" }]} />

      <View style={yieldStyles.headerBlock}>
        <Text style={[yieldStyles.eyebrow, { color: COLORS.primary[300] }]}>{t.FarmPage.dailyYield}</Text>
        <Text style={[yieldStyles.title, { color: white }]}>{t.FarmPage.rewards}</Text>
        <Text style={[yieldStyles.subtitle, { color: muted }]}>{t.FarmPage.rentRemaining}</Text>
      </View>

      <View style={yieldStyles.rowSpaced}>
        <Text style={{ color: muted }}>{t.FarmPage.daily}</Text>
      </View>

      <View style={yieldStyles.rowSpaced}>
        <Text style={[yieldStyles.valueLeft, { color: violet }]}>{formatNumber(farmingInfo.foodAndRewards.hens.dailyRewards)} 🥚</Text>
        <Text style={[yieldStyles.valueRight, { color: amber }]}>{formatNumber(farmingInfo.foodAndRewards.hens.dailyFood)} 🌽</Text>
      </View>

      <View style={yieldStyles.rowSpaced}>
        <Text style={[yieldStyles.valueLeft, { color: white }]}>{formatNumber(farmingInfo.foodAndRewards.cattles.dailyRewards)} 🥛</Text>
        <Text style={[yieldStyles.valueRight, { color: emerald }]}>{formatNumber(farmingInfo.foodAndRewards.cattles.dailyFood)} 🌾</Text>
      </View>

      <View style={[yieldStyles.rowSpaced, yieldStyles.sectionGapTop]}>
        <Text style={{ color: muted }}>{t.FarmPage.rewards}</Text>
      </View>

      <View style={yieldStyles.rowSpaced}>
        <Text style={[yieldStyles.valueLeft, { color: violet }]}>{formatNumber(farmingInfo.farm.hens.totalRewardsEarned.amount)} 🥚</Text>
        <Text style={[yieldStyles.valueRight, { color: amber }]}>{formatNumber(farmingInfo.farm.hens.totalFoodPayed.amount)} 🌽</Text>
      </View>

      <View style={yieldStyles.rowSpaced}>
        <Text style={[yieldStyles.valueLeft, { color: white }]}>{formatNumber(farmingInfo.farm.cattles.totalRewardsEarned.amount)} 🥛</Text>
        <Text style={[yieldStyles.valueRight, { color: emerald }]}>{formatNumber(farmingInfo.farm.cattles.totalFoodPayed.amount)} 🌾</Text>
      </View>

      <View style={[yieldStyles.divider, { backgroundColor: border }]} />

      <View style={[yieldStyles.rowSpaced, yieldStyles.rentRow]}>
        <Text style={{ color: muted }}>{t.FarmPage.rentRemaining}</Text>
        <Text style={{ color: white }}>{new Decimal(rentRemaining).toFixed(2)}%</Text>
      </View>

      <View style={[yieldStyles.progressTrack, { backgroundColor: COLORS.zinc[800] }]}>
        <View style={[yieldStyles.progressFill, { backgroundColor: progressBg, width: rentProgress }]} />
      </View>
    </View>
  )
}

export default YieldPerformance
