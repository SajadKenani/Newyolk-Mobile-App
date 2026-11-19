import React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import Text from "@/components/native/text"
import { formatCurrency, formatNumber } from "@/utils/format"
import { Paintbrush } from "lucide-react-native"

import { LoadingSpinner } from "@/components/helpers/loading" 

interface ActionBarProps {
  mode: "selected" | "floor"
  selectedCount?: number
  selectedPrice?: number
  floorPrice?: string | null
  sweepValue: number
  sweepMax: number
  isPending: boolean
  isDisabled?: boolean
  buyLabel: string
  buyFloorLabel: string
  onBuyPress: () => void
}

export const MarketplaceActionBar = React.memo(
  ({
    mode,
    selectedCount = 0,
    selectedPrice = 0,
    floorPrice,
    sweepValue,
    sweepMax,
    isPending,
    isDisabled = false,
    buyLabel,
    buyFloorLabel,
    onBuyPress,
  }: ActionBarProps) => {
    const formatPrice = (price: number | string) => formatCurrency(price, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    const getButtonLabel = () => (mode === "selected" ? `${buyLabel} ${selectedCount} ${selectedCount === 1 ? "item" : "items"}` : buyFloorLabel)
    const getButtonPrice = () => (mode === "selected" ? formatPrice(selectedPrice) : floorPrice ? formatPrice(floorPrice) : "--")
    const isButtonDisabled = isPending || isDisabled

    return (
      <View style={styles.container}>
        <View style={styles.buttonWrap}>
          <TouchableOpacity
            onPress={onBuyPress}
            disabled={isButtonDisabled}
            style={[
              styles.button,
              mode === "selected" ? styles.selectedButton : styles.floorButton,
              mode === "selected" && styles.selectedButtonShadow,
              isButtonDisabled && styles.disabledButton,
            ]}
          >
            {isPending ? <LoadingSpinner /> : <Text style={styles.buttonLabel}>{getButtonLabel()}</Text>}
            <Text style={styles.buttonPrice}>{getButtonPrice()}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sliderRow}>
          <Paintbrush size={18} color="#c084fc" />
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: `${sweepMax > 0 ? (sweepValue / sweepMax) * 100 : 0}%` }]} />
          </View>
          <View style={styles.valueChip}>
            <Text style={styles.valueText}>{formatNumber(sweepValue)}</Text>
          </View>
        </View>
      </View>
    )
  },
)

MarketplaceActionBar.displayName = "MarketplaceActionBar"

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 2,
    borderTopColor: "#27272a",
    backgroundColor: "rgba(24,24,27,0.98)",
  },
  buttonWrap: {
    marginBottom: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  selectedButton: {
    backgroundColor: "#2563eb",
  },
  floorButton: {
    backgroundColor: "#27272a",
    borderWidth: 2,
    borderColor: "#3f3f46",
  },
  selectedButtonShadow: {
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonLabel: {
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#ffffff",
  },
  buttonPrice: {
    fontSize: 18,
    lineHeight: 22,
    color: "#ffffff",
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sliderTrack: {
    flex: 1,
    height: 12,
    overflow: "hidden",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#3f3f46",
    backgroundColor: "#27272a",
  },
  sliderFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#2563eb",
  },
  valueChip: {
    minWidth: 60,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3f3f46",
    backgroundColor: "#27272a",
  },
  valueText: {
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center",
    color: "#ffffff",
  },
})
