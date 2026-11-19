import type { useThemeColors } from "@/config/colors"
import type { useListingsView } from "@/features/marketplace/hooks/useListingsView"
import type { T } from "@/messages/types"
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { LoadingSpinner } from "@/components/helpers/loading"
import Text from "@/components/native/text"
import { formatCurrency } from "@/utils/format"
import { Sparkles, TrendingUp } from "lucide-react-native"

type COLORS = ReturnType<typeof useThemeColors>

interface ListingsControlsProps {
  t: T
  COLORS: COLORS
  selectedTab: "items" | "sales" | "activity"
  selectedPurchasableListings: ReturnType<typeof useListingsView>["selectedPurchasableListings"]
  floorItem: ReturnType<typeof useListingsView>["floorItem"]
  buyNowListings: ReturnType<typeof useListingsView>["buyNowListings"]
  totalPrice: number
  handleBuyNowSelectedListings: () => void
  handleBuyNowFloor: () => void
}

export const ListingsControls = ({
  t,
  COLORS,
  selectedTab,
  selectedPurchasableListings,
  floorItem,
  buyNowListings,
  totalPrice,
  handleBuyNowSelectedListings,
  handleBuyNowFloor,
}: ListingsControlsProps) => {
  const hasSelection = selectedPurchasableListings.length > 0
  const styles = StyleSheet.create({
    container: {
      bottom: 20,
      left: 0,
      right: 0,
      gap: 12,
      marginBottom: 0,
      paddingHorizontal: 14,
    },
    touchable: {
      borderRadius: 24,
      overflow: "hidden",
      shadowColor: hasSelection ? COLORS.primary[500] : COLORS.zinc[500],
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 12,
      minHeight: 76,
    },
    gradient: {
      minHeight: 76,
      justifyContent: "center",
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    loadingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      columnGap: 12,
    },
    contentRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    leftColumn: {
      flex: 1,
    },
    metaRow: {
      marginBottom: 4,
      flexDirection: "row",
      alignItems: "center",
      columnGap: 8,
    },
    metaText: {
      fontSize: 12,
      letterSpacing: 1.5,
      color: COLORS.white,
      textTransform: "uppercase",
      opacity: 0.9,
    },
    descriptionText: {
      fontSize: 14,
      color: COLORS.white,
      textAlign: "left",
      opacity: 0.95,
    },
    rightColumn: {
      alignItems: "flex-end",
    },
    totalLabel: {
      marginBottom: 4,
      fontSize: 12,
      letterSpacing: 1.5,
      color: COLORS.white,
      textTransform: "uppercase",
      opacity: 0.9,
    },
    totalValue: {
      fontSize: 24,
      color: COLORS.white,
      letterSpacing: -0.5,
    },
    selectionOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255,255,255,0.1)",
    },
  })

  return (
    <View style={styles.container}>
      {selectedTab === "items" && (
        <TouchableOpacity
          onPress={selectedPurchasableListings.length > 0 ? handleBuyNowSelectedListings : handleBuyNowFloor}
          activeOpacity={0.8}
          style={styles.touchable}
        >
          <LinearGradient
            colors={
              selectedPurchasableListings.length > 0 ? [COLORS.primary[400], COLORS.primary[500], COLORS.primary[600]] : [COLORS.zinc[800], COLORS.zinc[900]]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            {buyNowListings.isPending ? (
              <View style={styles.loadingRow}>
                <LoadingSpinner />
              </View>
            ) : (
              <View style={styles.contentRow}>
                <View style={styles.leftColumn}>
                  <View style={styles.metaRow}>
                    {selectedPurchasableListings.length > 0 ? (
                      <Sparkles size={14} color="white" strokeWidth={2} />
                    ) : (
                      <TrendingUp size={14} color="white" strokeWidth={2} />
                    )}
                    <Text style={styles.metaText}>{selectedPurchasableListings.length > 0 ? t.Marketplace.selected : t.Marketplace.floor}</Text>
                  </View>
                  <Text style={styles.descriptionText}>
                    {selectedPurchasableListings.length > 0
                      ? `${selectedPurchasableListings.length} ${selectedPurchasableListings.length === 1 ? t.Marketplace.item : t.Marketplace.items}`
                      : t.Marketplace.buyFloor}
                  </Text>
                </View>
                <View style={styles.rightColumn}>
                  <Text style={styles.totalLabel}>{t.Marketplace.total}</Text>
                  <Text style={styles.totalValue}>
                    {selectedPurchasableListings.length > 0
                      ? formatCurrency(totalPrice, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                      : floorItem.data.buyNowPrice
                        ? formatCurrency(floorItem.data.buyNowPrice, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                        : "--"}
                  </Text>
                </View>
              </View>
            )}

            {selectedPurchasableListings.length > 0 && <Animated.View style={styles.selectionOverlay} />}
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  )
}
