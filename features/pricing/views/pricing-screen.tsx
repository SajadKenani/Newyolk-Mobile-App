import { useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeIn } from "react-native-reanimated"
import Header from "@/components/helpers/header"
import SkeletalLevelCard from "@/components/skeleton/skeletal-level-card"
import PricingList from "@/components/store/pricing-list"
import { authClient } from "@/auth/client"
import { useThemeColors } from "@/config/colors"
import { usePricingData } from "@/features/pricing/hooks/usePricingData"
import { useScrollChrome } from "@/hooks/useScrollChrome"
import { useSafeTranslation } from "@/hooks/safe-translation"

const PricingScreen = () => {
  const { store, isLoading, localeExchangeRate } = usePricingData()
  const { data: session } = authClient.useSession()
  const { t } = useSafeTranslation
  const COLORS = useThemeColors()
  const { handleChromeScroll } = useScrollChrome()
  const [scrollY, setScrollY] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)

  return (
    <View style={[styles.screen, { backgroundColor: COLORS.black }]} onLayout={(event) => setViewportHeight(event.nativeEvent.layout.height)}>
      <View pointerEvents="none" style={[styles.backgroundLayer, { backgroundColor: COLORS.black }]}>
        <LinearGradient colors={[COLORS.amber[400] + "18", "transparent"]} start={{ x: 0.15, y: 0 }} end={{ x: 0.8, y: 1 }} style={styles.goldTopGlow} />
        <LinearGradient colors={[COLORS.amber.yellow500 + "10", "transparent"]} start={{ x: 1, y: 0.2 }} end={{ x: 0, y: 1 }} style={styles.goldSideGlow} />
        <View style={[styles.goldOrb, { backgroundColor: COLORS.amber[400] + "10" }]} />
      </View>

      <Header title={t.Pricing.title} transparent showMenuButton />
      {isLoading ? (
        <Animated.View style={styles.loadingContainer}>
          {/* <View
            style={[
              styles.loadingHero,
              {
                backgroundColor: COLORS.black + "F0",
                borderColor: COLORS.zinc[800] + "CC",
              },
            ]}
          >
            <View style={[styles.heroGlow, { backgroundColor: COLORS.zinc[800] + "30" }]} />
            <View style={styles.skeletonWrapper}>
              <Skeleton colorMode="dark" height={12} radius={999} style={{ width: 88, marginBottom: 16 }} />
              <Skeleton colorMode="dark" height={28} radius={10} style={{ width: 200 }} />
              <Skeleton colorMode="dark" height={14} radius={6} style={{ width: 240, marginTop: 14 }} />
            </View>
          </View> */}

          <View style={styles.loadingCards}>
            <SkeletalLevelCard />
            <SkeletalLevelCard />
            <SkeletalLevelCard />
          </View>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeIn.duration(600)} style={styles.animatedContainer}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
            onScroll={(event) => {
              handleChromeScroll(event)
              setScrollY(event.nativeEvent.contentOffset.y)
            }}
          >
            {store && localeExchangeRate && (
              <View style={styles.listBlock}>
                <PricingList
                  store={store}
                  session={session ?? null}
                  localeExchangeRate={localeExchangeRate}
                  scrollY={scrollY}
                  viewportHeight={viewportHeight}
                />
              </View>
            )}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  goldTopGlow: {
    position: "absolute",
    top: -40,
    left: -20,
    right: 60,
    height: 240,
    borderBottomLeftRadius: 160,
    borderBottomRightRadius: 220,
  },
  goldSideGlow: {
    position: "absolute",
    top: 260,
    right: -80,
    width: 220,
    height: 320,
    borderRadius: 220,
  },
  goldOrb: {
    position: "absolute",
    top: 180,
    right: -18,
    width: 120,
    height: 120,
    borderRadius: 999,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundFrame: {
    position: "absolute",
    top: 96,
    left: 14,
    right: 14,
    bottom: 0,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  backgroundBand: {
    position: "absolute",
    top: 156,
    left: -26,
    right: 22,
    height: 220,
    borderRadius: 40,
    borderWidth: 1,
    transform: [{ rotate: "-7deg" }],
  },
  backgroundBandSecondary: {
    top: 430,
    left: 34,
    right: -30,
    height: 280,
    transform: [{ rotate: "8deg" }],
  },
  topGlow: {
    position: "absolute",
    top: -44,
    left: -18,
    right: 44,
    height: 250,
    borderBottomLeftRadius: 160,
    borderBottomRightRadius: 220,
  },
  sideGlow: {
    position: "absolute",
    top: 260,
    right: -70,
    width: 220,
    height: 340,
    borderRadius: 240,
  },
  centerMist: {
    position: "absolute",
    top: 132,
    left: 20,
    right: 20,
    height: 460,
    borderRadius: 36,
  },
  ambientOrb: {
    position: "absolute",
    borderRadius: 999,
  },
  ambientOrbPrimary: {
    top: 152,
    right: -18,
    width: 140,
    height: 140,
  },
  ambientOrbAccent: {
    left: -52,
    top: 520,
    width: 170,
    height: 170,
  },
  bottomVignette: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 280,
  },
  loadingContainer: {
    flex: 1,
    paddingTop: 138,
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  loadingHero: {
    overflow: "hidden",
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 22,
    paddingVertical: 24,
    marginBottom: 18,
  },
  heroGlow: {
    position: "absolute",
    width: 132,
    height: 132,
    borderRadius: 999,
    right: -26,
    top: -12,
  },
  skeletonWrapper: {
    zIndex: 1,
  },
  loadingCards: {
    gap: 14,
    marginTop: 40,
  },
  animatedContainer: {
    flex: 1,
    marginTop: 40,
    backgroundColor: "transparent",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    paddingTop: 136,
    paddingBottom: 240,
    paddingHorizontal: 18,
    gap: 20,
  },
  listBlock: {
    gap: 16,
  },
})

export default PricingScreen
