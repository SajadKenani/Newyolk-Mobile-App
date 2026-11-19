import { useMemo } from "react"
import { StyleSheet, View } from "react-native"
import { useThemeColors } from "@/config/colors"
import { useAssetCard } from "@/features/farm/hooks/useAssetCard"
import { formatNumber } from "@/utils/format"
import { LinearGradient } from "expo-linear-gradient"

import type { AssetCardProps } from "../types/interface"
import Text from "@/components/native/text"
import { AssetIcon, ChartSection, getAssetColors } from "./utils/helpers"

const assetTitleKeyMap = {
  yolk: "YolkPage.yolkTitle",
  corn: "YolkPage.cornTitle",
  milk: "YolkPage.milkTitle",
  hay: "YolkPage.hayTitle",
} as const

const AssetCard = ({ farmingInfo, type }: AssetCardProps) => {
  const { t, isRTL, assetData, rate, chartData, formatRate } = useAssetCard({ farmingInfo, type })
  const COLORS = useThemeColors()
  const { textColorMap } = useMemo(() => getAssetColors(COLORS), [COLORS])

  const rowDirection = isRTL ? "row-reverse" : "row"
  const textAlign = isRTL ? "right" : "left"
  const accentColor = textColorMap[type as keyof typeof textColorMap] || COLORS.primary[400]
  const titleKey = assetTitleKeyMap[type as keyof typeof assetTitleKeyMap] ?? assetTitleKeyMap.yolk
  const formattedAmount = formatNumber(assetData.amount)
  const formattedUsdValue = formatNumber(assetData.valueInUsd)
  const formattedRate = formatRate(rate)
  const assetLabel = t(titleKey).toUpperCase()

  return (
    <View style={[localStyles.card, { backgroundColor: "rgba(8, 12, 20, 0.84)", borderColor: COLORS.primary[950] }]}>
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <LinearGradient
          colors={[COLORS.white + "03", COLORS.black + "18", "transparent"]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <LinearGradient colors={[COLORS.primary[500] + "16", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={localStyles.cardTint} />
        <View style={[localStyles.cardGlow, { backgroundColor: COLORS.primary[400] + "18" }]} />
        <View style={[localStyles.innerBorder, { borderColor: COLORS.white + "05" }]} />
      </View>

      <View style={localStyles.content}>
        <View style={[localStyles.headerRow, { flexDirection: rowDirection }]}>
          <View style={localStyles.rateBlock}>
            <Text style={[localStyles.rateValue, { color: accentColor, textAlign }]}>${formattedRate}</Text>
          </View>

          <View style={[localStyles.assetMeta, { flexDirection: rowDirection }]}>
            <Text numberOfLines={1} style={[localStyles.assetLabel, { color: COLORS.zinc[400], textAlign }]}>
              {assetLabel}
            </Text>
            <View >
              <AssetIcon type={type} />
            </View>
          </View>
        </View>

        <View style={localStyles.chartBlock}>
          <ChartSection chartData={chartData} type={type} height={96} />
        </View>

        <View style={[localStyles.footerRow, { flexDirection: rowDirection }]}>
          <Text numberOfLines={1} style={[localStyles.footerUsd, { color: COLORS.zinc[500], textAlign }]}>
            ${formattedUsdValue}
          </Text>
          <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.34} style={[localStyles.footerAmount, { color: COLORS.white, textAlign }]}>
            {formattedAmount}
          </Text>
        </View>
      </View>
    </View>
  )
}

const localStyles = StyleSheet.create({
  card: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 22,
    borderWidth: 1,
    minHeight: 172,
  },
  cardTint: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 88,
  },
  cardGlow: {
    position: "absolute",
    top: -24,
    right: -14,
    width: 110,
    height: 110,
    borderRadius: 999,
    opacity: 0.26,
  },
  innerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderRadius: 22,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  rateBlock: {
    maxWidth: "44%",
  },
  rateValue: {
    fontSize: 13,
    lineHeight: 16,
  },
  assetMeta: {
    alignItems: "center",
    gap: 8,
    maxWidth: "56%",
  },
  assetLabel: {
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1.6,
  },
  assetIconShell: {
    width: 30,
    height: 30,
    // borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  chartBlock: {
    marginBottom: 10,
    minHeight: 98,
    justifyContent: "center",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 10,
  },
  footerUsd: {
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  footerAmount: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
  },
})

export default AssetCard
