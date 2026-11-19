import { useMemo, useState } from "react"
import { View, TouchableOpacity, FlatList, useWindowDimensions } from "react-native"

import { Egg } from "lucide-react-native"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { useRouter } from "expo-router"
import type { EggGridProps, EggStatus, TabValue } from "./utils/types"
import { getTabLabels, TAB_KEYS } from "./utils/types"
import { eggGridStyles } from "./utils/styles"
import { getEggStatus } from "./utils/helper"
import EggBreedCard from "./cards/egg-breed-card"
import Text from "@/components/native/text"

const EggGrid = ({
  allItems,
  hatchingTimeInMs,
  hatchingEggExpiryInMs,
  now,
  onStartIncubation,
  onFinishHatching,
  loadingIds,
  selectedItems,
  onToggleSelect,
}: EggGridProps) => {
  type EggTabValue = Extract<TabValue, "all" | "idle" | "incubating" | "ready">

  const [activeTab, setActiveTab] = useState<TabValue>("all")
  const { width } = useWindowDimensions()
  const { t } = useSafeTranslation
  const router = useRouter()

  const tabLabels = getTabLabels(t)
  const numColumns = width >= 1280 ? 4 : width >= 900 ? 3 : 2
  const emptyStateLabels: Record<EggTabValue, string> = {
    all: t.Breeding.egg.noEggs,
    idle: t.Breeding.egg.emptyIdle,
    incubating: t.Breeding.egg.emptyIncubating,
    ready: t.Breeding.egg.emptyReady,
  }
  const tabCounts: Record<EggTabValue, number> = useMemo(
    () => ({
      all: allItems.length,
      idle: allItems.filter((item) => getEggStatus(item, hatchingTimeInMs, now) === "idle").length,
      incubating: allItems.filter((item) => getEggStatus(item, hatchingTimeInMs, now) === "incubating").length,
      ready: allItems.filter((item) => getEggStatus(item, hatchingTimeInMs, now) === "ready").length,
    }),
    [allItems, hatchingTimeInMs, now],
  )

  const filteredItems = useMemo(() => {
    const items =
      activeTab === "all"
        ? allItems
        : allItems.filter((item) => {
            const status = getEggStatus(item, hatchingTimeInMs, now)
            return status === activeTab
          })

    const statusOrder: Record<EggStatus, number> = { ready: 0, incubating: 1, idle: 2 }

    return [...items].sort((a, b) => {
      const sa = getEggStatus(a, hatchingTimeInMs, now)
      const sb = getEggStatus(b, hatchingTimeInMs, now)
      return statusOrder[sa] - statusOrder[sb]
    })
  }, [allItems, activeTab, now, hatchingTimeInMs])

  if (allItems.length === 0) {
    return (
      <View style={eggGridStyles.emptyContainer}>
        <Egg size={64} color="#9ca3af" />
        <Text style={eggGridStyles.emptyText}>{t.Breeding.egg.noEggs}</Text>
        <TouchableOpacity style={eggGridStyles.ctaButton} onPress={() => router.navigate("/")}>
          <Text style={eggGridStyles.ctaButtonText}>{t.Breeding.egg.noEggsCta}</Text>
        </TouchableOpacity>
      </View>
    )
  }
  const showEmpty = filteredItems.length === 0 && activeTab !== "all"

  return (
    <View style={eggGridStyles.container}>
      <View style={eggGridStyles.filterDeck}>
        {/* <Text style={eggGridStyles.filterEyebrow}>{t.Breeding.tabEggs}</Text> */}
        <View style={eggGridStyles.tabList}>
          {TAB_KEYS.map((tab) => {
            const isActive = activeTab === tab
            return (
              <TouchableOpacity
                key={tab}
                style={[eggGridStyles.tabTrigger, isActive && eggGridStyles.tabTriggerActive]}
                onPress={() => setActiveTab(tab)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <Text style={[eggGridStyles.tabTriggerText, isActive && eggGridStyles.tabTriggerTextActive]}>{tabLabels[tab]}</Text>
                <View style={[eggGridStyles.tabCountBadge, isActive && eggGridStyles.tabCountBadgeActive]}>
                  <Text style={[eggGridStyles.tabCountText, isActive && eggGridStyles.tabCountTextActive]}>{tabCounts[tab as EggTabValue]}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      <View style={eggGridStyles.tabContent}>
        {showEmpty ? (
          <View style={eggGridStyles.emptyTabContainer}>
            <Text style={eggGridStyles.emptyTabText}>{emptyStateLabels[activeTab as EggTabValue]}</Text>
          </View>
        ) : (
          <FlatList
            key={numColumns}
            data={filteredItems}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            scrollEnabled={false}
            columnWrapperStyle={numColumns > 1 ? eggGridStyles.gridRow : undefined}
            contentContainerStyle={eggGridStyles.gridContent}
            renderItem={({ item }) => (
              <View style={[eggGridStyles.cardWrapper, { width: `${100 / numColumns}%` }]}>
                <EggBreedCard
                  item={item}
                  hatchingTimeInMs={hatchingTimeInMs}
                  hatchingEggExpiryInMs={hatchingEggExpiryInMs}
                  now={now}
                  onStartIncubation={onStartIncubation}
                  onFinishHatching={onFinishHatching}
                  isLoading={loadingIds?.has(item.id)}
                  isSelected={selectedItems?.includes(item.id)}
                  onToggleSelect={onToggleSelect}
                />
              </View>
            )}
          />
        )}
      </View>
    </View>
  )
}

export default EggGrid
