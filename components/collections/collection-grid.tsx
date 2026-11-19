import type React from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import Animated, { FadeInUp } from "react-native-reanimated"

import { Skeleton } from "@/components/helpers/skeleton"
import { useScrollChrome } from "@/hooks/useScrollChrome"

import type { RouterOutputs } from "@newyolk/api"

type CollectionItem = RouterOutputs["collection"]["read"][number]

interface CollectionGridProps {
  collections: CollectionItem[] | undefined
  isPending: boolean
  renderCollectionCard: (item: CollectionItem, index: number) => React.ReactNode
  hideChromeOnScroll?: boolean
}

const CollectionGrid = ({ collections, isPending, renderCollectionCard, hideChromeOnScroll = true }: CollectionGridProps) => {
  const { handleChromeScroll } = useScrollChrome({ hideOnScroll: hideChromeOnScroll })

  if (isPending) {
    return (
      <ScrollView style={styles.scrollView} scrollEnabled={false} showsVerticalScrollIndicator={false}>
        <View style={styles.topSpacer} />
        <View style={styles.grid}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <View key={`collection-skel-${idx}`} style={styles.gridItem}>
              <View style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                  <Skeleton colorMode="dark" radius={0} height={200} style={styles.skeletonFull} />
                  <View style={styles.imageOverlay} />
                  <View style={styles.badgeContainer}>
                    <Skeleton colorMode="dark" height={28} radius={8} style={styles.badgeSkeleton} />
                  </View>
                </View>
                <View style={styles.cardBody}>
                  {/* <View style={styles.titleSkeletonWrapper}>
                    <Skeleton colorMode="dark" height={20} radius={6} style={styles.titleSkeleton} />
                  </View> */}
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <View style={styles.labelSkeletonWrapper}>
                        <Skeleton colorMode="dark" height={10} radius={6} style={styles.labelSkeletonPrimary} />
                      </View>
                      <View style={styles.statValueRow}>
                        <View style={styles.dot} />
                        <Skeleton colorMode="dark" height={16} radius={6} style={styles.valueSkeleton} />
                      </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                      {/* <View style={styles.labelSkeletonWrapper}>
                        <Skeleton colorMode="dark" height={10} radius={6} style={styles.labelSkeletonSecondary} />
                      </View> */}
                      {/* <View style={styles.statValueRow}>
                        <View style={styles.dot} />
                        <Skeleton colorMode="dark" height={16} radius={6} style={styles.valueSkeleton} />
                      </View> */}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    )
  }

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} onScroll={handleChromeScroll} scrollEventThrottle={16}>
      <View style={styles.topSpacer} />
      <View style={styles.grid}>
        {collections?.map((item, index) => (
          <Animated.View key={`collection-${index}`} style={styles.gridItem} entering={FadeInUp.duration(320).delay(index * 70)}>
            {renderCollectionCard(item, index)}
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#000000",
    paddingHorizontal: 18,
  },
  topSpacer: {
    marginTop: 180,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    marginBottom: 20,
  },
  cardContainer: {
    overflow: "hidden",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#27272a",
    backgroundColor: "#18181b",
  },
  imageContainer: {
    position: "relative",
    aspectRatio: 1,
    backgroundColor: "#3f3f46",
  },
  skeletonFull: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  badgeContainer: {
    position: "absolute",
    right: 16,
    top: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(24,24,27,0.9)",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeSkeleton: {
    width: 28,
  },
  cardBody: {
    backgroundColor: "#18181b",
    padding: 20,
  },
  titleSkeletonWrapper: {
    marginBottom: 16,
  },
  titleSkeleton: {
    width: 160,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  statItem: {
    flex: 1,
  },
  labelSkeletonWrapper: {
    marginBottom: 6,
  },
  labelSkeletonPrimary: {
    width: 100,
  },
  labelSkeletonSecondary: {
    width: 80,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  valueSkeleton: {
    width: 80,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#3f3f46",
  },
  divider: {
    height: 48,
    width: 1,
    backgroundColor: "#27272a",
  },
})

export default CollectionGrid
