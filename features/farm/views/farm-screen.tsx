import React from "react"
import { Redirect } from "expo-router"
import { skipToken } from "@tanstack/react-query"
import { ScrollView, StyleSheet, View, useWindowDimensions } from "react-native"
import type { LayoutChangeEvent } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Snackbar } from "react-native-paper"
import Animated, { FadeIn, FadeInDown, FadeInRight, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import type { RouterOutputs } from "@newyolk/api"
import type { ThemeColors } from "@/config/colors"
import { authClient } from "@/auth/client"
import CustomDrawerItem from "@/components/drawer/custom-drawer-item"
import { FarmMenuItems } from "@/components/drawer/farm-menu-items"
import ActionCenter from "@/features/farm/components/action-center"
import AssetCard from "@/features/farm/components/asset-card"
import Livestock from "@/features/farm/components/livestock"
import YieldPerformance from "@/features/farm/components/yield-performance"
import Header from "@/components/helpers/header"
import Text from "@/components/native/text"
import { AssetCard as SkeletalAssetCard } from "@/components/skeleton/skeletal-asset-card"
import { ExpoRoutes } from "@/config/routes"
import { useThemeColors } from "@/config/colors"
import { useFarmFeed } from "@/features/farm/hooks/useFarmFeed"
import { useFarmScreenLayout } from "@/features/farm/hooks/useFarmScreenLayout"
import { useFarmTimer } from "@/features/farm/hooks/useFarmTimer"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { useScrollChrome } from "@/hooks/useScrollChrome"
import { api } from "@/config/react-provider"

type FarmingInfo = RouterOutputs["farm"]["myFarmingInfo"]

const ScrollAnimatedFarmSection = ({
  children,
  isVisible,
  onLayout,
}: {
  children: React.ReactNode
  isVisible: boolean
  onLayout: (event: LayoutChangeEvent) => void
}) => {
  const progress = useSharedValue(0)

  React.useEffect(() => {
    progress.value = withTiming(isVisible ? 1 : 0, {
      duration: isVisible ? 520 : 180,
    })
  }, [isVisible, progress])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: 36 * (1 - progress.value) }, { scale: 0.96 + progress.value * 0.04 }],
  }))

  return (
    <Animated.View onLayout={onLayout} style={animatedStyle}>
      {children}
    </Animated.View>
  )
}

const FarmLoadingState = ({ farmingInfo }: { farmingInfo: FarmingInfo | undefined }) => {
  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.animatedView}>
      <View style={styles.loadingStack}>
        <SkeletalAssetCard farmingInfo={farmingInfo!} type={"yolk"} />
        <SkeletalAssetCard farmingInfo={farmingInfo!} type={"corn"} />
      </View>
    </Animated.View>
  )
}

// const FarmSpotlight = ({
//   colors,
//   title,
//   eyebrow,
//   description,
//   readyRewards,
//   foodNeeded,
//   rewardsLabel,
//   foodLabel,
//   statusLabel,
// }: {
//   colors: ThemeColors
//   title: string
//   eyebrow: string
//   description: string
//   readyRewards: number
//   foodNeeded: number
//   rewardsLabel: string
//   foodLabel: string
//   statusLabel: string
// }) => {
//   return (
//     <Animated.View entering={FadeInDown.duration(520)} style={styles.heroCard}>
//       <LinearGradient
//         colors={[colors.primary[500] + "2A", colors.black + "B5", colors.black]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.heroGradient}
//       />
//       <View pointerEvents="none" style={[styles.heroGlow, { backgroundColor: colors.primary[400] + "20" }]} />

//       <View style={styles.heroContent}>
//         <View style={styles.heroCopy}>
//           <Text style={[styles.heroEyebrow, { color: colors.primary[300] }]}>{eyebrow}</Text>
//           <Text style={[styles.heroTitle, { color: colors.white }]}>{title}</Text>
//           <Text style={[styles.heroDescription, { color: colors.zinc[300] }]}>{description}</Text>
//         </View>

//         <View style={styles.heroFooter}>
//           <View style={[styles.heroStatusPill, { backgroundColor: colors.white + "10", borderColor: colors.white + "12" }]}>
//             <View style={[styles.heroStatusDot, { backgroundColor: colors.primary[400] }]} />
//             <Text style={[styles.heroStatusText, { color: colors.white }]}>{statusLabel}</Text>
//           </View>

//           <View style={styles.heroStatsRow}>
//             <View style={[styles.heroStatCard, { backgroundColor: colors.white + "08", borderColor: colors.white + "0D" }]}>
//               <Text style={[styles.heroStatLabel, { color: colors.zinc[400] }]}>{rewardsLabel}</Text>
//               <Text style={[styles.heroStatValue, { color: colors.white }]}>{formatNumber(readyRewards)}</Text>
//             </View>
//             <View style={[styles.heroStatCard, { backgroundColor: colors.white + "08", borderColor: colors.white + "0D" }]}>
//               <Text style={[styles.heroStatLabel, { color: colors.zinc[400] }]}>{foodLabel}</Text>
//               <Text style={[styles.heroStatValue, { color: colors.white }]}>{formatNumber(foodNeeded)}</Text>
//             </View>
//           </View>
//         </View>
//       </View>
//     </Animated.View>
//   )
// }

const FarmSummaryRail = ({
  farmingInfo,
  sliderRef,
  onSliderLayout,
  onSliderContentSizeChange,
}: {
  farmingInfo: FarmingInfo
  sliderRef: React.RefObject<ScrollView | null>
  onSliderLayout: (event: LayoutChangeEvent) => void
  onSliderContentSizeChange: (width: number) => void
}) => {
  return (
    <Animated.View entering={FadeInDown.duration(500)} style={styles.sliderContainer}>
      <ScrollView
        ref={sliderRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sliderContent}
        onLayout={onSliderLayout}
        onContentSizeChange={(width) => onSliderContentSizeChange(width)}
        scrollEventThrottle={16}
      >
        {FarmMenuItems(farmingInfo.farm).map((item, index) => (
          <Animated.View key={`farm-${item.route}`} entering={FadeInRight.duration(450).delay(index * 90)} style={styles.sliderItem}>
            <CustomDrawerItem compact icon={item.icon} label={item.route} value={item.value} />
          </Animated.View>
        ))}
      </ScrollView>
    </Animated.View>
  )
}

const FarmFeedSnackbar = ({
  colors,
  snackbarVisible,
  setSnackbarVisible,
  snackbarText,
}: {
  colors: ThemeColors
  snackbarVisible: boolean
  setSnackbarVisible: (visible: boolean) => void
  snackbarText: string
}) => {
  return (
    <Snackbar
      visible={snackbarVisible}
      onDismiss={() => setSnackbarVisible(false)}
      duration={3500}
      action={{
        label: "OK",
        onPress: () => setSnackbarVisible(false),
        labelStyle: { color: colors.primary[400] },
      }}
      style={[
        styles.snackbar,
        {
          backgroundColor: colors.zinc[900],
          borderColor: colors.primary[500] + "40",
          shadowColor: colors.primary[500],
        },
      ]}
      theme={{
        colors: {
          onSurface: colors.white,
          inverseOnSurface: colors.white,
        },
      }}
      wrapperStyle={{ paddingHorizontal: 0 }}
    >
      <View style={styles.snackbarContent}>
        <View style={[styles.snackbarDot, { backgroundColor: colors.primary[500] }]} />
        <Text style={styles.snackbarText}>{snackbarText}</Text>
      </View>
    </Snackbar>
  )
}

// const FarmFeedAll = ({
//   colors,
//   title,
//   description,
//   actionLabel,
//   onPress,
//   disabled,
// }: {
//   colors: ThemeColors
//   title: string
//   description: string
//   actionLabel: string
//   onPress: () => void
//   disabled: boolean
// }) => {
//   return (
//     <View style={[styles.feedAllCard, { borderColor: colors.white + "08", backgroundColor: colors.black + "B5" }]}>
//       <LinearGradient colors={[colors.primary[500] + "18", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.feedAllGlow} />
//       <View style={styles.feedAllCopy}>
//         <Text style={[styles.feedAllEyebrow, { color: colors.primary[300] }]}>{actionLabel}</Text>
//         <Text style={[styles.feedAllTitle, { color: colors.white }]}>{title}</Text>
//         <Text style={[styles.feedAllDescription, { color: colors.zinc[300] }]}>{description}</Text>
//       </View>
//       <Button label={actionLabel} variant="primary" size="md" onPress={onPress} fullWidth={false} disabled={disabled} style={styles.feedAllButton} />
//     </View>
//   )
// }

const FarmScreen = () => {
  const { t, isLoading } = useSafeTranslation
  const { data: session } = authClient.useSession()
  const { height: viewportHeight } = useWindowDimensions()

  const COLORS = useThemeColors()
  const mobileFarm = api.farm.myFarmingInfo.useQuery(session ? undefined : skipToken)
  const farmingInfo = mobileFarm.data

  const { handleFeed, feed, snackbarVisible, setSnackbarVisible, snackbarText } = useFarmFeed(t)
  const { remainingTimeHen, remainingTimeCattle } = useFarmTimer(farmingInfo)
  // const { formatRemainingTime } = useActionCenter({ isPending: feed.isPending }, remainingTimeHen, remainingTimeCattle)
  const { handleChromeScroll } = useScrollChrome()
  const { sliderRef, visibleSections, updateSectionPosition, onScroll, onSliderLayout, onSliderContentSizeChange } = useFarmScreenLayout({
    enabled: !!farmingInfo,
    viewportHeight,
  })

  // const nextFeedWindow = Math.min(Math.max(remainingTimeHen, 0), Math.max(remainingTimeCattle, 0))
  // const feedAllDisabled = feed.isPending || (remainingTimeHen > 0 && remainingTimeCattle > 0)
  // const feedAllLabel = feedAllDisabled && nextFeedWindow > 0 ? formatRemainingTime(nextFeedWindow) : t("Header.buttons.feedNow")
  // const readyRewards = Number(farmingInfo?.foodAndRewards.hens.availableRewards ?? 0) + Number(farmingInfo?.foodAndRewards.cattles.availableRewards ?? 0)
  // const foodNeeded = Number(farmingInfo?.foodAndRewards.hens.owedFood ?? 0) + Number(farmingInfo?.foodAndRewards.cattles.owedFood ?? 0)

  if (session === null || mobileFarm.error?.shape?.code) return <Redirect href={ExpoRoutes.auth.signIn} />

  return (
    <View style={[styles.screen, { backgroundColor: COLORS.black }]}>
      <View pointerEvents="none" style={styles.backgroundLayer}>
        <LinearGradient
          colors={[COLORS.zinc[950], COLORS.black, COLORS.black]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.backgroundGradient}
        />
        <LinearGradient colors={[COLORS.primary[500] + "24", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.topGlow} />
        <LinearGradient colors={[COLORS.primary[700] + "18", "transparent"]} start={{ x: 1, y: 0 }} end={{ x: 0.1, y: 1 }} style={styles.sideGlow} />
        <View style={[styles.backgroundOrb, styles.backgroundOrbPrimary, { backgroundColor: COLORS.primary[500] + "18" }]} />
        <View style={[styles.backgroundOrb, styles.backgroundOrbSlate, { backgroundColor: COLORS.zinc[700] + "14" }]} />
      </View>

      <Header title={t.Header.farm} showMenuButton transparent />
      {isLoading || !farmingInfo ? (
        <FarmLoadingState farmingInfo={farmingInfo} />
      ) : (
        <>
          <Animated.View entering={FadeIn.duration(600)} style={styles.animatedView}>
            <Animated.ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              onScroll={(event) => {
                handleChromeScroll(event)
                onScroll(event)
              }}
              scrollEventThrottle={16}
            >
              <View style={styles.assetListContainer}>
                {/* <FarmSpotlight
                  colors={COLORS}
                  title={t.Header.farm}
                  eyebrow={t.FarmPage.actionCenter}
                  description={t.FarmPage.farmOperations}
                  readyRewards={readyRewards}
                  foodNeeded={foodNeeded}
                  rewardsLabel={t.FarmPage.rewardsAvailable}
                  foodLabel={t.FarmPage.foodNeeded}
                  statusLabel={feedAllLabel}
                /> */}

                {/* <ScrollAnimatedFarmSection isVisible={visibleSections.action} onLayout={updateSectionPosition("feedAll")}>
                  <FarmFeedAll
                    colors={COLORS}
                    title={t("Header.buttons.feedNow")}
                    description={t.FarmPage.farmOperations}
                    actionLabel={feedAllLabel}
                    onPress={() => handleFeed({ model: "all" })}
                    disabled={feedAllDisabled}
                  />
                </ScrollAnimatedFarmSection> */}
                {/* 
                <FarmSpotlight
                  colors={COLORS}
                  title={t.Header.farm}
                  eyebrow={t.FarmPage.actionCenter}
                  description={t.FarmPage.farmOperations}
                  readyRewards={readyRewards}
                  foodNeeded={foodNeeded}
                  rewardsLabel={t.FarmPage.rewardsAvailable}
                  foodLabel={t.FarmPage.foodNeeded}
                  statusLabel={feedAllLabel}
                /> */}

                <View style={styles.assetGrid}>
                  <View style={styles.assetGridItem}>
                    <ScrollAnimatedFarmSection isVisible={visibleSections.yolk} onLayout={updateSectionPosition("yolk")}>
                      <AssetCard farmingInfo={farmingInfo} type={"yolk"} />
                    </ScrollAnimatedFarmSection>
                  </View>
                  <View style={styles.assetGridItem}>
                    <ScrollAnimatedFarmSection isVisible={visibleSections.corn} onLayout={updateSectionPosition("corn")}>
                      <AssetCard farmingInfo={farmingInfo} type={"corn"} />
                    </ScrollAnimatedFarmSection>
                  </View>
                  <View style={styles.assetGridItem}>
                    <ScrollAnimatedFarmSection isVisible={visibleSections.milk} onLayout={updateSectionPosition("milk")}>
                      <AssetCard farmingInfo={farmingInfo} type={"milk"} />
                    </ScrollAnimatedFarmSection>
                  </View>
                  <View style={styles.assetGridItem}>
                    <ScrollAnimatedFarmSection isVisible={visibleSections.hay} onLayout={updateSectionPosition("hay")}>
                      <AssetCard farmingInfo={farmingInfo} type={"hay"} />
                    </ScrollAnimatedFarmSection>
                  </View>
                </View>

                <ScrollAnimatedFarmSection isVisible={visibleSections.action} onLayout={updateSectionPosition("action")}>
                  <ActionCenter
                    farmingInfo={farmingInfo}
                    handleFeed={handleFeed}
                    feedMyFarm={{ isPending: feed.isPending }}
                    remainingTimeHen={remainingTimeHen}
                    remainingTimeCattle={remainingTimeCattle}
                  />
                </ScrollAnimatedFarmSection>

                <ScrollAnimatedFarmSection isVisible={visibleSections.yield} onLayout={updateSectionPosition("yield")}>
                  <YieldPerformance farmingInfo={farmingInfo} />
                </ScrollAnimatedFarmSection>
                <ScrollAnimatedFarmSection isVisible={visibleSections.livestock} onLayout={updateSectionPosition("livestock")}>
                  <Livestock farmingInfo={farmingInfo} />
                </ScrollAnimatedFarmSection>

                <ScrollAnimatedFarmSection isVisible={visibleSections.rail} onLayout={updateSectionPosition("rail")}>
                  <FarmSummaryRail
                    farmingInfo={farmingInfo}
                    sliderRef={sliderRef}
                    onSliderLayout={onSliderLayout}
                    onSliderContentSizeChange={onSliderContentSizeChange}
                  />
                </ScrollAnimatedFarmSection>
              </View>
            </Animated.ScrollView>
          </Animated.View>

          <FarmFeedSnackbar colors={COLORS} snackbarVisible={snackbarVisible} setSnackbarVisible={setSnackbarVisible} snackbarText={snackbarText} />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: "hidden",
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  topGlow: {
    position: "absolute",
    top: -72,
    left: -32,
    right: 56,
    height: 320,
    borderBottomRightRadius: 240,
    borderBottomLeftRadius: 120,
  },
  sideGlow: {
    position: "absolute",
    top: 260,
    right: -84,
    width: 280,
    height: 440,
    borderRadius: 260,
  },
  backgroundOrb: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.95,
  },
  backgroundOrbPrimary: {
    top: 132,
    right: -30,
    width: 180,
    height: 180,
  },
  backgroundOrbSlate: {
    top: 540,
    left: -74,
    width: 220,
    height: 220,
  },
  animatedView: {
    paddingHorizontal: 16,
    flex: 1,
  },
  loadingStack: {
    gap: 16,
    paddingTop: 184,
    paddingBottom: 48,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    paddingTop: 178,
    paddingBottom: 104,
  },
  assetListContainer: {
    gap: 16,
  },
  assetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  assetGridItem: {
    width: "48.2%",
  },
  heroCard: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    minHeight: 220,
    backgroundColor: "rgba(8, 12, 20, 0.9)",
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroGlow: {
    position: "absolute",
    top: -36,
    right: -24,
    width: 164,
    height: 164,
    borderRadius: 999,
  },
  heroContent: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingVertical: 22,
    gap: 22,
  },
  heroCopy: {
    gap: 8,
  },
  heroEyebrow: {
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 38,
  },
  heroDescription: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: "88%",
  },
  heroFooter: {
    gap: 14,
  },
  heroStatusPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heroStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  heroStatusText: {
    fontSize: 12,
  },
  heroStatsRow: {
    flexDirection: "row",
    gap: 12,
  },
  heroStatCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  heroStatLabel: {
    fontSize: 12,
  },
  heroStatValue: {
    fontSize: 22,
  },
  feedAllCard: {
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderRadius: 28,
    padding: 22,
    gap: 18,
  },
  feedAllGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  feedAllCopy: {
    gap: 6,
  },
  feedAllEyebrow: {
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: "uppercase",
  },
  feedAllTitle: {
    fontSize: 30,
    lineHeight: 34,
  },
  feedAllDescription: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: "92%",
  },
  feedAllButton: {
    alignSelf: "flex-start",
    minWidth: 152,
  },
  sliderContainer: {
    marginBottom: 6,
  },
  sliderContent: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingLeft: 2,
    paddingRight: 4,
  },
  sliderItem: {
    width: 68,
    marginRight: 0,
  },
  snackbar: {
    borderWidth: 1,
    bottom: 140,
    borderRadius: 16,
    marginHorizontal: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  snackbarContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  snackbarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  snackbarText: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
  },
})

export default FarmScreen
