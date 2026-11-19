import React from "react"
import { Pressable, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { formatCurrency } from "@/utils/format"
import { formatTimeAgoShort } from "@/utils/time"
import { Clock } from "lucide-react-native"

import type { RouterOutputs } from "@newyolk/api"

export const MarketplaceActivityItem = React.memo(({ listing }: { listing: RouterOutputs["listing"]["infiniteSoldListingsByName"]["items"][0] }) => {
  const { t } = useSafeTranslation
  const COLORS = useThemeColors()
  const timeLabel = `${formatTimeAgoShort(listing.settledAt ?? listing.createdAt, t)}`

  return (
    <View style={{ marginHorizontal: 14, marginBottom: 8 }}>
      <Pressable
        key={listing.id}
        style={({ pressed }) => ({
          borderRadius: 20,
          overflow: "hidden",
          transform: [{ scale: pressed ? 0.97 : 1 }],
          backgroundColor: COLORS.zinc[900],
        })}
      >
        <View
          style={{
            borderWidth: 1,
            backgroundColor: COLORS.zinc[900],
            borderRadius: 20,
            padding: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            {/* Left Section - Item Name & Time */}
            <View style={{ flex: 1, minWidth: 0, gap: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "flex-start", gap: 8 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 17,
                    color: COLORS.white,
                    letterSpacing: 0.3,
                    flex: 1,
                    textAlign: "left",
                    marginLeft: 10,
                  }}
                >
                  {listing.item}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginLeft: 10 }}>
                <Clock size={12} color={COLORS.zinc[500]} strokeWidth={2} />
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 11,
                    color: COLORS.zinc[500],
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                  }}
                >
                  {timeLabel}
                </Text>
              </View>
            </View>

            {/* Right Section - Price with Arrow */}
            <View style={{ alignItems: "flex-end", gap: 6 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <LinearGradient
                  colors={[COLORS.primary[500], COLORS.primary[600]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 12,
                    shadowColor: COLORS.primary[500],
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.4,
                    shadowRadius: 6,
                    elevation: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: COLORS.white,
                      letterSpacing: -0.5,
                    }}
                  >
                    {formatCurrency(listing.buyNowPrice, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </Text>
                </LinearGradient>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  )
})

MarketplaceActivityItem.displayName = "MarketplaceActivityItem"
