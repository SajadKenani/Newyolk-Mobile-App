import { useMemo, useState } from "react"
import { TouchableOpacity, View, Image, StyleSheet } from "react-native"
// import { ArrowUpRight } from "lucide-react-native"

import AssetsModal from "@/features/assets/components/assets-modal"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"
import CollectionModal from "@/components/collections/collection-modal"
import { formatCurrency } from "@/utils/format"
import { getCollectionImageSource } from "@/utils/local-asset-image"

import type { RouterOutputs } from "@newyolk/api"

const CollectionCard = ({ item, from }: { item: RouterOutputs["collection"]["read"][0]; from: string }) => {
  const [marketplaceVisible, setMarketplaceVisible] = useState(false)
  const [assetsVisible, setAssetsVisible] = useState(false)

  const handlePress = () => (from === "marketplace" ? setMarketplaceVisible(true) : setAssetsVisible(true))
  const { t, currentLang } = useSafeTranslation
  const floorPrice =
    item.listings.length > 0
      ? formatCurrency(item.listings[0]?.buyNowPrice ?? "0", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : "--"

  const topBid =
    item.offers.length > 0
      ? formatCurrency(item.offers[0]?.price ?? "0", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : "--"

  const COLORS = useThemeColors()
  const isArabic = currentLang === "ar-ae"
  const textAlign = isArabic ? "right" : "left"
  const styles = useMemo(() => createStyles(COLORS), [COLORS])
  // const collectionLabel = item.item.replace(/[-_]/g, " ").trim().toUpperCase()
  const imageSource = useMemo(() => getCollectionImageSource({ href: item.href, image: item.image, item: item.item }), [item.href, item.image, item.item])

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
        <View style={styles.imageContainer}>
          {imageSource ? (
            <Image source={imageSource} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imageFallback}>
              <Text style={styles.imageFallbackEmoji}>{item.emoji}</Text>
            </View>
          )}
          <View style={styles.imageShade} />
          <View style={styles.heroGlow} />

          <View style={styles.imageContent}>
            <View style={[styles.topRow, isArabic && styles.topRowRTL]}>
              {/* <View style={styles.collectionPill}>
                <Text style={styles.collectionPillText} numberOfLines={1}>
                  {collectionLabel}
                </Text>
              </View> */}

              <View style={styles.badgeContainer}>
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
            </View>

            <View style={styles.heroFooter}>
              <View style={styles.heroCopy}>
                {/* <Text style={[styles.eyebrow, { textAlign }]}>{collectionLabel}</Text> */}
                <Text style={[styles.itemName, { textAlign }]} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>

              {/* <View style={styles.routeBadge}>
                <ArrowUpRight size={16} color={COLORS.zinc[100]} strokeWidth={2.2} />
              </View> */}
            </View>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={[styles.statsRow, isArabic && styles.statsRowRTL]}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel} numberOfLines={1}>{t.Marketplace.floorPrice}</Text>
              <View style={[styles.statValueRow, isArabic && styles.statValueRowRTL]}>
                {!isArabic && <View style={[styles.dot, { backgroundColor: COLORS.primary[500] }]} />}
                <Text style={[styles.statValue, { color: COLORS.primary[400] }]} numberOfLines={1}>
                  {floorPrice}
                </Text>
                {isArabic && <View style={[styles.dot, { backgroundColor: COLORS.primary[500] }]} />}
              </View>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>{t.Marketplace.topBid}</Text>
              <View style={[styles.statValueRow, isArabic && styles.statValueRowRTL]}>
                {!isArabic && <View style={[styles.dot, { backgroundColor: COLORS.primary[500] }]} />}
                <Text style={[styles.statValue, { color: COLORS.primary[400] }]} numberOfLines={1}>
                  {topBid}
                </Text>
                {isArabic && <View style={[styles.dot, { backgroundColor: COLORS.primary[500] }]} />}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <CollectionModal
        visible={marketplaceVisible}
        onClose={() => setMarketplaceVisible(false)}
        collectionName={item.href.startsWith("/") ? item.href.slice(1) : item.href}
        t={t}
      />

      <AssetsModal
        visible={assetsVisible}
        onClose={() => setAssetsVisible(false)}
        collectionName={item.href.startsWith("/") ? item.href.slice(1) : item.href}
      />
    </>
  )
}

const createStyles = (COLORS: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    card: {
      // marginBottom: 20,
      overflow: "hidden",
      borderRadius: 30,
      borderWidth: 1,
      borderColor: COLORS.zinc[800] + "E6",
      backgroundColor: COLORS.black,
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.28,
      shadowRadius: 24,
      elevation: 16,
    },
    imageContainer: {
      position: "relative",
      aspectRatio: 1.06,
      backgroundColor: COLORS.zinc[900],
      overflow: "hidden",
    },
    image: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
    },
    imageFallback: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.zinc[900],
    },
    imageFallbackEmoji: {
      fontSize: 56,
      opacity: 0.92,
    },
    imageShade: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.36)",
    },
    imageContent: {
      flex: 1,
      justifyContent: "space-between",
      padding: 18,
      zIndex: 2,
    },
    heroGlow: {
      position: "absolute",
      width: 180,
      height: 180,
      borderRadius: 999,
      right: -58,
      top: -42,
      backgroundColor: COLORS.primary[500] + "24",
    },
    topRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12,
    },
    topRowRTL: {
      flexDirection: "row-reverse",
    },
    collectionPill: {
      maxWidth: "72%",
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.zinc[700] + "A6",
      backgroundColor: COLORS.black + "B8",
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    collectionPillText: {
      fontSize: 10,
      textTransform: "uppercase",
      letterSpacing: 1.8,
      color: COLORS.zinc[300],
    },
    badgeContainer: {
      minWidth: 42,
      height: 42,
      borderRadius: "50%",
      borderWidth: 1,
      borderColor: COLORS.zinc[700] + "CC",
      backgroundColor: COLORS.black + "C7",
      alignItems: "center",
      justifyContent: "center",
    },
    emoji: {
      fontSize: 30,
    },
    heroFooter: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 12,
    },
    heroCopy: {
      flex: 1,
      gap: 8,
    },
    eyebrow: {
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: 1.8,
      color: COLORS.zinc[300],
    },
    itemName: {
      fontSize: 18,
      lineHeight: 28,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      color: COLORS.white,
    },
    routeBadge: {
      width: 42,
      height: 42,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.black + "C7",
      borderWidth: 1,
      borderColor: COLORS.zinc[700] + "B3",
    },
    cardBody: {
      backgroundColor: COLORS.black,
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 18,
    },
    statsRow: {
      flexDirection: "row",
      gap: 12,
    },
    statsRowRTL: {
      flexDirection: "row-reverse",
    },
    statCard: {
      flex: 1,
      borderRadius: 20,
      borderWidth: 1,
      // borderColor: COLORS.zinc[800],
      // backgroundColor: COLORS.zinc[950],
      // paddingHorizontal: 14,
      // paddingVertical: 13,
    },
    statLabel: {
      marginBottom: 8,
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      color: COLORS.zinc[500],
    },
    statValueRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    statValueRowRTL: {
      flexDirection: "row-reverse",
      justifyContent: "flex-end",
    },
    statValue: {
      flexShrink: 1,
      fontSize: 18,
      lineHeight: 22,
      color: COLORS.primary[400],
    },
    dot: {
      height: 8,
      width: 8,
      borderRadius: 4,
    },
  })

export default CollectionCard
