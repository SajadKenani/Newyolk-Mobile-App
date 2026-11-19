import type { COLORS as STATIC_COLORS } from "@/config/colors"
import { useMemo } from "react"
import { View } from "react-native"
import { useThemeColors } from "@/config/colors"

import LineChartComp from "@/components/charts/area-chart"
import Text from "@/components/native/text"
import { StyleSheet } from "react-native"

export const getAssetColors = (COLORS: typeof STATIC_COLORS) => ({
  textColorMap: {
    yolk: COLORS.violet[400], // violet-400
    corn: COLORS.amber[400], // amber-400
    milk: COLORS.zinc[400], // zinc-400
    hay: COLORS.emerald[400], // emerald-400
  },
  dividerColorMap: {
    yolk: COLORS.violet[400] + "33", // violet-400/20
    corn: COLORS.amber[400] + "33", // amber-400/20
    milk: COLORS.zinc[400] + "33", // zinc-400/20
    hay: COLORS.emerald[400] + "33", // emerald-400/20
  },
  priceTagBgMap: {
    yolk: COLORS.violet[400] + "1A", // 10%
    corn: COLORS.amber[400] + "1A",
    milk: COLORS.zinc[400] + "1A",
    hay: COLORS.emerald[400] + "1A",
  },
  priceTagTextMap: {
    yolk: COLORS.violet[400],
    corn: COLORS.amber[400],
    milk: COLORS.zinc[400],
    hay: COLORS.emerald[400],
  },
  priceTagBorderMap: {
    yolk: COLORS.violet[400] + "33",
    corn: COLORS.amber[400] + "33",
    milk: COLORS.zinc[400] + "33",
    hay: COLORS.emerald[400] + "33",
  },
  cardGlowMap: {
    yolk: COLORS.violet[400] + "18",
    corn: COLORS.amber[400] + "16",
    milk: COLORS.white + "10",
    hay: COLORS.emerald[400] + "16",
  },
  cardTintMap: {
    yolk: COLORS.violet[950] + "20",
    corn: COLORS.primary[950] + "20",
    milk: COLORS.zinc[700] + "20",
    hay: COLORS.emerald[500] + "20",
  },
  cardEdgeMap: {
    yolk: COLORS.violet[400] + "10",
    corn: COLORS.amber[400] + "10",
    milk: COLORS.white + "08",
    hay: COLORS.emerald[400] + "10",
  },
  chartStartMap: {
    yolk: COLORS.violet[400] + "E6",
    corn: COLORS.amber[400] + "E6",
    milk: COLORS.white + "E6",
    hay: COLORS.emerald[400] + "E6",
  },
  chartEndMap: {
    yolk: COLORS.violet[400] + "0D",
    corn: COLORS.amber[400] + "0D",
    milk: COLORS.white + "0D",
    hay: COLORS.emerald[400] + "0D",
  },
})

export const AssetIcon = ({ type }: { type: string }) => {
  const iconConfig = {
    yolk: { emoji: "🥚", bg: "bg-violet-500", glow: "shadow-violet-500/40" },
    corn: { emoji: "🌽", bg: "bg-amber-500", glow: "shadow-amber-500/40" },
    milk: { emoji: "🥛", bg: "bg-zinc-500", glow: "shadow-zinc-500/40" },
    hay: { emoji: "🌾", bg: "bg-emerald-500", glow: "shadow-emerald-500/40" },
  }

  const config = iconConfig[type as keyof typeof iconConfig]

  return (
    <View style={iconStyles.container}>
      <Text style={iconStyles.emoji}>{config.emoji}</Text>
    </View>
  )
}
const iconStyles = StyleSheet.create({
  container: {
    position: "relative", // relative
    alignItems: "center", // items-center
    justifyContent: "center", // justify-center
    borderRadius: 18, // rounded-2xl
  },
  emoji: {
    fontSize: 22,
  },
})
export const PriceTag = ({ rate, type, formatRate }: { rate: number; type: string; formatRate: (value: unknown) => string }) => {
  const COLORS = useThemeColors()
  const { priceTagBgMap, priceTagTextMap, priceTagBorderMap } = useMemo(() => getAssetColors(COLORS), [COLORS])

  const bgColor = priceTagBgMap[type as keyof typeof priceTagBgMap] || COLORS.violet[400] + "1A"
  const textColor = priceTagTextMap[type as keyof typeof priceTagTextMap] || COLORS.violet[400]
  const borderColor = priceTagBorderMap[type as keyof typeof priceTagBorderMap] || COLORS.violet[400]

  return (
    <View
      style={[
        helperStyles.priceTag,
        {
          backgroundColor: bgColor,
          borderColor,
          shadowColor: borderColor,
        },
      ]}
    >
      <View style={helperStyles.priceTagRow}>
        <Text style={[helperStyles.priceTagText, { color: textColor }]}>$</Text>
        <Text style={[helperStyles.priceTagText, { color: textColor }]}>{formatRate(rate)}</Text>
      </View>
    </View>
  )
}

export const ChartSection = ({ chartData = [], type = "yolk", height = 72 }: { chartData?: { value: number }[]; type?: string; height?: number }) => {
  const COLORS = useThemeColors()
  const { chartStartMap, chartEndMap } = useMemo(() => getAssetColors(COLORS), [COLORS])

  if (!chartData.length) return null

  const startColor = chartStartMap[type as keyof typeof chartStartMap] || COLORS.primary[400] + "E6"
  const endColor = chartEndMap[type as keyof typeof chartEndMap] || COLORS.primary[400] + "0D"

  return (
    <View style={helperStyles.chartSection}>
      <LineChartComp
        data={chartData}
        height={height}
        startColor={startColor}
        endColor={endColor}
        styleProps={{ borderRadius: 10, overflow: "hidden", marginBottom: 0 }}
      />
    </View>
  )
}

const helperStyles = StyleSheet.create({
  priceTag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginBottom: 0,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  priceTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  priceTagText: {
    fontSize: 11,
  },
  chartSection: {
    borderRadius: 12,
  },
})
