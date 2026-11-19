import React from "react"
import { Image, TouchableOpacity, View, StyleSheet } from "react-native"
import { BlurView } from "expo-blur"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { formatCurrency } from "@/utils/format"
import { Check, Info, Layers } from "lucide-react-native"
import type { RouterOutputs } from "@newyolk/api"
import { Link } from "expo-router"
import { getMarketplaceImageSource } from "@/utils/local-asset-image"

interface ListingCardProps {
  listing: RouterOutputs["listing"]["infiniteFilteredListingsByName"]["items"][0]
  isSelected: boolean
  isOwned: boolean
  onPress: () => void
}

export const MarketplaceListingCard = React.memo(({ listing, isSelected, isOwned, onPress }: ListingCardProps) => {
  const { t } = useSafeTranslation

  const item = listing.hen ?? listing.cattle
  const imageSource = getMarketplaceImageSource({ assetImage: listing.assetImage, href: item?.href, state: item?.state, numId: item?.numId })
  const COLORS = useThemeColors()

  return (
    <>
      <TouchableOpacity onPress={onPress} style={styles.outerTouchable} activeOpacity={0.8} disabled={isOwned}>
        <View style={[styles.card, isOwned && styles.cardOwned]} pointerEvents="box-none">
          {/* Top Status Badge */}
          <View style={styles.badgeRow} pointerEvents="none">
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {isOwned ? t("Assets.marketplace.owned") : isSelected ? t("Assets.marketplace.selected") : t("Assets.marketplace.forSale")}
              </Text>
            </View>
          </View>

          {/* Image Container */}
          <View style={styles.imageWrapper} pointerEvents="box-none">
            {imageSource ? (
              <Image style={styles.image} source={imageSource} resizeMode="cover" />
            ) : (
              <View style={styles.imageFallback}>
                <Layers size={48} color="#52525B" />
              </View>
            )}

            {/* Selected Indicator */}
            {isSelected && (
              <TouchableOpacity style={styles.selectedIndicator} activeOpacity={0.7}>
                <View style={[styles.checkCircle, { backgroundColor: COLORS.primary[500] }]}>
                  <Check size={16} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            )}

            {/* Info Button */}
            {item && (
              <Link href={`${item.href}:${item.numId.toString()}`} asChild>
                <TouchableOpacity style={styles.infoButton} activeOpacity={0.7}>
                  <View style={[styles.iconCircle, { backgroundColor: COLORS.primary[500] }]}>
                    <Info size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </Link>
            )}

            {/* Bottom Info with Blur */}
            <BlurView intensity={33} style={styles.blurOverlay} tint="dark">
              <View>
                <Text style={styles.assetId}>#{listing.assetNumId}</Text>
                <Text style={styles.assetState}>{item?.state ?? "N/A"}</Text>
              </View>
              <View>
                <Text style={[styles.price, { color: COLORS.primary[400] }]}>
                  {formatCurrency(listing.buyNowPrice, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </Text>
              </View>
            </BlurView>
          </View>
        </View>
      </TouchableOpacity>
    </>
  )
})

MarketplaceListingCard.displayName = "MarketplaceListingCard"

const styles = StyleSheet.create({
  outerTouchable: {
    padding: 8,
    width: "50%",
  },
  iconCircle: {
    borderRadius: 999,
    padding: 8,
  },
  card: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#374151", // gray-700
  },
  cardOwned: {
    opacity: 0.5,
  },
  badgeRow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 40,
    zIndex: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  badge: {
    width: 112,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#374151", // gray-700
    backgroundColor: "transparent",
    padding: 2,
  },
  badgeText: {
    fontSize: 14,
    letterSpacing: 4,
    color: "#ffffff",
    textAlign: "center",
    textTransform: "uppercase",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 200,
    overflow: "hidden",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 0,
  },
  imageFallback: {
    height: 200,
    width: "100%",
    backgroundColor: "#27272a", // zinc-800
    alignItems: "center",
    justifyContent: "center",
  },
  selectedIndicator: {
    backgroundColor: "rgba(0,0,0,0.6)",
    position: "absolute",
    top: 7,
    right: 7,
    zIndex: 9999,
    elevation: 10,
    padding: 6,
    width: 37,
    height: 37,
    borderRadius: 999,
  },
  checkCircle: {
    position: "absolute",
    right: 8,
    top: 8,
    padding: 4,
    zIndex: 50,
    borderRadius: 999,
  },
  infoButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 9999,
    elevation: 10,
    padding: 8,
    borderRadius: 999,
  },
  blurOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  assetId: {
    fontSize: 16,
    color: "#ffffff",
  },
  assetState: {
    fontSize: 12,
    color: "#9ca3af", // gray-400
  },
  price: {
    fontSize: 18,
    textAlign: "right",
  },
})
