import { useMemo } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { formatTimeAgoChart } from "@/utils/time"
import Decimal from "decimal.js"
import { TrendingUp } from "lucide-react-native"

import type { RouterOutputs } from "@newyolk/api"

const SalesChart = ({ data }: { data: RouterOutputs["listing"]["infiniteSoldListingsByName"]["items"] }) => {
  const COLORS = useThemeColors()
  const { t } = useSafeTranslation
  const styles = useMemo(
    () =>
      StyleSheet.create({
        emptyContainer: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 80,
        },
        emptyIconWrap: {
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: COLORS.primary[900],
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        },
        emptyIconText: {
          fontSize: 40,
          color: COLORS.primary[400],
        },
        emptyText: {
          fontSize: 18,
          textAlign: "center",
          color: COLORS.primary[400],
        },
        scrollView: {
          paddingTop: 30,
        },
        scrollContent: {
          paddingHorizontal: 16,
          paddingBottom: 40,
        },
        bottomSpacer: {
          height: 40,
        },
      }),
    [COLORS],
  )

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.settledAt ?? a.createdAt).getTime()
      const dateB = new Date(b.settledAt ?? b.createdAt).getTime()
      return dateB - dateA // Most recent first
    })
  }, [data])

  const maxPrice = useMemo(() => {
    if (sortedData.length === 0) return 0
    return Math.max(...sortedData.map((item) => new Decimal(item.buyNowPrice).toNumber()))
  }, [sortedData])

  const avgPrice = useMemo(() => {
    if (sortedData.length === 0) return 0
    const sum = sortedData.reduce((acc, item) => acc + new Decimal(item.buyNowPrice).toNumber(), 0)
    return sum / sortedData.length
  }, [sortedData])

  if (sortedData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconWrap}>
          <Text style={styles.emptyIconText}>📊</Text>
        </View>
        <Text style={styles.emptyText}>{t.Marketplace.noSales}</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Chart Header Stats */}
      <View
        style={{
          backgroundColor: COLORS.zinc[900],
          borderRadius: 20,
          padding: 20,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: COLORS.zinc[800],
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: COLORS.zinc[500], fontSize: 11, marginBottom: 6, letterSpacing: 1, textAlign: "left" }}>{t.Marketplace.peak}</Text>
            <Text style={{ color: COLORS.white, fontSize: 22, letterSpacing: -0.5, textAlign: "left" }}>${maxPrice.toFixed(2)}</Text>
          </View>
          <View
            style={{
              width: 1,
              height: 36,
              backgroundColor: COLORS.zinc[800],
            }}
          />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ color: COLORS.zinc[500], fontSize: 11, marginBottom: 6, letterSpacing: 1 }}>{t.Marketplace.average}</Text>
            <Text style={{ color: COLORS.primary[400], fontSize: 18, letterSpacing: -0.5 }}>${avgPrice.toFixed(2)}</Text>
          </View>
          <View
            style={{
              width: 1,
              height: 36,
              backgroundColor: COLORS.zinc[800],
            }}
          />
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={{ color: COLORS.zinc[500], fontSize: 11, marginBottom: 6, letterSpacing: 1 }}>{t.Marketplace.volume}</Text>
            <Text style={{ color: COLORS.white, fontSize: 18 }}>{sortedData.length}</Text>
          </View>
        </View>
      </View>

      {/* Chart Grid Background */}
      <View
        style={{
          backgroundColor: COLORS.zinc[900],
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: COLORS.zinc[800],
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        {/* X-Axis Scale */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 16,
            paddingLeft: 70,
            paddingRight: 4,
          }}
        >
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ alignItems: "center" }}>
              <View style={{ width: 1, height: 4, backgroundColor: COLORS.zinc[700], marginBottom: 4 }} />
              <Text style={{ color: COLORS.zinc[600], fontSize: 8 }}>$0</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <View style={{ width: 1, height: 4, backgroundColor: COLORS.zinc[700], marginBottom: 4 }} />
              <Text style={{ color: COLORS.zinc[600], fontSize: 8 }}>${(maxPrice * 0.5).toFixed(0)}</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <View style={{ width: 1, height: 4, backgroundColor: COLORS.zinc[700], marginBottom: 4 }} />
              <Text style={{ color: COLORS.zinc[500], fontSize: 9 }}>${maxPrice.toFixed(0)}</Text>
            </View>
          </View>
        </View>

        {/* Chart Bars */}
        {sortedData.map((item, idx) => {
          const price = new Decimal(item.buyNowPrice).toNumber()
          const widthPercent = maxPrice > 0 ? (price / maxPrice) * 100 : 20
          const isRecent = idx === 0
          const isAboveAvg = price > avgPrice

          return (
            <View key={item.id} style={{ marginBottom: idx === sortedData.length - 1 ? 0 : 14 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                {/* Y-Axis Label */}
                <View style={{ width: 60, flexDirection: "row", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                  {isRecent && (
                    <View
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 9,
                        backgroundColor: COLORS.primary[500],
                        alignItems: "center",
                        justifyContent: "center",
                        shadowColor: COLORS.primary[500],
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.8,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                    >
                      <TrendingUp size={10} color={COLORS.white} strokeWidth={3.5} />
                    </View>
                  )}
                  <Text
                    style={{
                      color: isRecent ? COLORS.primary[400] : COLORS.zinc[500],
                      fontSize: 9,

                      textAlign: "right",
                      letterSpacing: 0.2,
                    }}
                    numberOfLines={1}
                  >
                    {formatTimeAgoChart(new Date(item.settledAt ?? item.createdAt))}
                  </Text>
                </View>

                {/* Bar Container */}
                <View style={{ flex: 1, position: "relative" }}>
                  {/* Grid Background */}
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    {[1, 2, 3, 4].map((i) => (
                      <View
                        key={i}
                        style={{
                          width: 1,
                          height: "100%",
                          backgroundColor: COLORS.zinc[800],
                          opacity: 0.2,
                        }}
                      />
                    ))}
                  </View>

                  {/* Average Indicator */}
                  {avgPrice > 0 && Math.abs(widthPercent - (avgPrice / maxPrice) * 100) < 5 && (
                    <View
                      style={{
                        position: "absolute",
                        left: `${(avgPrice / maxPrice) * 100}%`,
                        top: -6,
                        transform: [{ translateX: -15 }],
                        backgroundColor: COLORS.primary[500],
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                        zIndex: 10,
                      }}
                    >
                      <Text style={{ color: COLORS.white, fontSize: 7 }}>AVG</Text>
                    </View>
                  )}

                  {/* Bar Track */}
                  <View
                    style={{
                      height: 40,
                      backgroundColor: COLORS.zinc[900],
                      borderRadius: 10,
                      overflow: "visible",
                      borderWidth: 1,
                      borderColor: COLORS.zinc[800],
                    }}
                  >
                    {/* Average Line Overlay */}
                    {avgPrice > 0 && (
                      <View
                        style={{
                          position: "absolute",
                          left: `${(avgPrice / maxPrice) * 100}%`,
                          top: -2,
                          bottom: -2,
                          width: 2,
                          backgroundColor: COLORS.primary[400],
                          opacity: 0.3,
                          zIndex: 2,
                          borderRadius: 1,
                        }}
                      />
                    )}

                    {/* Bar Fill */}
                    <View
                      style={{
                        width: `${widthPercent}%`,
                        height: "100%",
                        borderRadius: 9,
                        overflow: "hidden",
                      }}
                    >
                      <LinearGradient
                        colors={
                          isRecent
                            ? [COLORS.primary[400], COLORS.primary[500], COLORS.primary[600]]
                            : isAboveAvg
                              ? [COLORS.primary[500], COLORS.primary[600], COLORS.primary[700]]
                              : [COLORS.zinc[600], COLORS.zinc[700], COLORS.zinc[800]]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          width: "100%",
                          height: "100%",
                          justifyContent: "center",
                          paddingHorizontal: 10,
                        }}
                      >
                        {widthPercent > 30 && (
                          <Text
                            style={{
                              color: COLORS.white,
                              fontSize: 13,

                              textAlign: "right",
                              textShadowColor: "rgba(0, 0, 0, 0.3)",
                              textShadowOffset: { width: 0, height: 1 },
                              textShadowRadius: 2,
                              letterSpacing: -0.3,
                            }}
                          >
                            ${price.toFixed(2)}
                          </Text>
                        )}
                      </LinearGradient>
                    </View>
                  </View>

                  {/* External Price Label */}
                  {widthPercent <= 30 && (
                    <View
                      style={{
                        position: "absolute",
                        left: `${Math.min(widthPercent + 2, 95)}%`,
                        top: 0,
                        bottom: 0,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: isRecent ? COLORS.primary[300] : COLORS.zinc[400],
                          fontSize: 12,

                          letterSpacing: -0.3,
                        }}
                      >
                        ${price.toFixed(2)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )
        })}
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  )
}

export default SalesChart
