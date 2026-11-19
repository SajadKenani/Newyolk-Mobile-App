import type { COLORS as STATIC_COLORS } from "@/config/colors"
import { useMemo } from "react"
import { StyleSheet, View } from "react-native"
import { Skeleton } from "@/components/helpers/skeleton"
import { useThemeColors } from "@/config/colors"
import type { AssetCardProps } from "@/features/farm/types/interface"

const getAssetColors = (COLORS: typeof STATIC_COLORS) => ({
  textColorMap: {
    yolk: COLORS.violet[400],
    corn: COLORS.amber[400],
    milk: COLORS.zinc[400],
    hay: COLORS.emerald[400],
  },
  dividerColorMap: {
    yolk: COLORS.violet[400] + "33",
    corn: COLORS.amber[400] + "33",
    milk: COLORS.zinc[400] + "33",
    hay: COLORS.emerald[400] + "33",
  },
  priceTagBgMap: {
    yolk: COLORS.violet[400] + "1A",
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
})

const AssetIcon = () => <Skeleton colorMode="dark" radius={16} height={56} style={{ width: 56 }} />

const PriceTag = () => <Skeleton colorMode="dark" radius={16} height={36} style={{ width: 96 }} />

const ChartSection = () => (
  <View style={styles.chartContainer}>
    <View style={styles.chartInner}>
      <Skeleton colorMode="dark" radius={16} height={180} />
    </View>
  </View>
)

export const AssetCard = ({ farmingInfo: _ignored, type }: AssetCardProps) => {
  const COLORS = useThemeColors()
  const { dividerColorMap } = useMemo(() => getAssetColors(COLORS), [COLORS])

  return (
    <View style={[styles.card]}>
      {/* Subtle glow overlay */}
      <View style={[styles.glowOverlay]} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: COLORS.zinc[800] + "4D" }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <AssetIcon />
            <View style={styles.titleGroup}>
              <Skeleton colorMode="dark" height={18} radius={8} style={{ width: 140 }} />
              <Skeleton colorMode="dark" height={14} radius={8} style={{ width: 100 }} />
            </View>
          </View>
          <PriceTag />
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.statsGroup}>
          <Skeleton colorMode="dark" height={12} radius={6} style={{ width: 96 }} />
          <View style={styles.statsValues}>
            <Skeleton colorMode="dark" height={28} radius={8} style={{ width: 180 }} />
            <Skeleton colorMode="dark" height={18} radius={8} style={{ width: 120 }} />
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: dividerColorMap[type as keyof typeof dividerColorMap] }]} />

        <ChartSection />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
  glowOverlay: {
    borderRadius: 32,
  },
  header: {
    paddingHorizontal: 32,
    paddingVertical: 32,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  titleGroup: {
    gap: 4,
  },
  body: {
    padding: 32,
    gap: 32,
  },
  statsGroup: {
    gap: 16,
  },
  statsValues: {
    gap: 10,
    marginVertical: 4,
  },
  divider: {
    height: 1,
    width: "100%",
  },
  chartContainer: {
    width: "100%",
    borderRadius: 16,
  },
  chartInner: {
    width: "100%",
    paddingVertical: 10,
  },
})
