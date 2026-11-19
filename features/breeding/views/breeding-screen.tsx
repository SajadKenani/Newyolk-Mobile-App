import { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native"
import BulkActionsBar from "@/features/breeding/components/bars/bulk-actions-bar"
import EggBulkActionsBar from "@/features/breeding/components/bars/egg-bulk-actions-bar"
import StatsBar from "@/features/breeding/components/bars/stats-bar"
import EggGrid from "@/features/breeding/components/egg-grid"
import RoosterGrid from "@/features/breeding/components/rooster-grid"
import { TabBar } from "@/features/breeding/components/utils/helper"
import { breedingStyles } from "@/features/breeding/components/utils/styles"
import type { TabValue } from "@/features/breeding/components/utils/types"
import Header from "@/components/helpers/header"
import { LoadingSpinner } from "@/components/helpers/loading"
import Text from "@/components/native/text"
import { useEggBreeding } from "@/features/breeding/hooks/useEggBreeding"
import { useRoosterBreeding } from "@/features/breeding/hooks/useRoosterBreeding"
import { useScrollChrome } from "@/hooks/useScrollChrome"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { api } from "@/config/react-provider"

const pageStyles = StyleSheet.create({
  panelSurface: {
    borderRadius: 22,
    backgroundColor: "#101116",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  gridSurface: {
    borderRadius: 24,
    paddingHorizontal: 2,
  },
})

const BreedingScreen = () => {
  const [now, setNow] = useState(() => Date.now())
  const [activeTab, setActiveTab] = useState<TabValue>("roosters")
  const { t } = useSafeTranslation
  const { handleChromeScroll } = useScrollChrome({ hideOnScroll: false })

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const initialFarmingCondition = api.farmingCondition.getCurrent.useQuery()
  const initialYolkBalance = api.farm.myYolkBalance.useQuery()
  const yolkBalance = api.farm.myYolkBalance.useQuery(undefined, {
    initialData: initialYolkBalance.data,
  })
  const yolkData = yolkBalance.data ?? initialYolkBalance.data

  const farmingConditionReady = !!initialFarmingCondition.data
  const yolkReady = !!yolkData

  const rooster = useRoosterBreeding(now, initialFarmingCondition.data ?? null)
  const egg = useEggBreeding(now, initialFarmingCondition.data ?? null)

  const isRoostersTab = activeTab === "roosters"
  const heroTitle = isRoostersTab ? t("Breeding.tabRoosters") : t("Breeding.tabEggs")
  const heroCount = isRoostersTab ? rooster.allItems.length : egg.allEggItems.length
  const heroSummary = isRoostersTab
    ? `${rooster.stats.idle} ${t("Breeding.idle").toLowerCase()} 🐤 ${rooster.stats.ready} ${t("Breeding.ready").toLowerCase()}`
    : `${egg.eggStats.idle} ${t("Breeding.egg.idle").toLowerCase()} 🥚 ${egg.eggStats.ready} ${t("Breeding.egg.ready").toLowerCase()}`

  if (!initialFarmingCondition.data) return <LoadingSpinner />

  return (
    <>
      <Header showBackButton title={t("Breeding.breeding")} showMenuButton={true} transparent />
      <View style={breedingStyles.container}>
        <View style={breedingStyles.heroCard}>
          <View style={breedingStyles.heroTopRow}>
            <View style={breedingStyles.heroCopy}>
              <Text style={breedingStyles.heroTitle}>{heroTitle}</Text>
              <Text style={breedingStyles.heroDescription}>{heroSummary}</Text>
            </View>

            <View style={breedingStyles.heroStatCard}>
              <Text style={breedingStyles.heroStatValue}>{heroCount}</Text>
              <Text style={breedingStyles.heroStatLabel}>{heroTitle}</Text>
            </View>
          </View>

          <TabBar active={activeTab} onChange={setActiveTab} />
        </View>

        <View style={breedingStyles.contentShell}>
          {activeTab === "roosters" && (
            <View style={breedingStyles.tabPane}>
              <ScrollView
                style={breedingStyles.scroll}
                contentContainerStyle={breedingStyles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={handleChromeScroll}
                scrollEventThrottle={16}
              >
                {farmingConditionReady && yolkReady && (
                  <View style={pageStyles.panelSurface}>
                    <StatsBar
                      stats={rooster.stats}
                      totalRoosters={rooster.allItems.length}
                      yolkBalance={yolkData.yolk}
                      breedingPriceInYolk={initialFarmingCondition.data.breedingPriceInYolk.toString()}
                      breedingDuration={initialFarmingCondition.data.breedingTimeInMs.toString()}
                    />
                  </View>
                )}
                <View style={pageStyles.gridSurface}>
                  <RoosterGrid
                    allItems={rooster.allItems}
                    breedingTimeInMs={initialFarmingCondition.data?.breedingTimeInMs.toString() ?? ""}
                    now={now}
                    onStartBreed={rooster.handleStartBreed}
                    onFinishBreed={rooster.handleFinishBreed}
                    loadingIds={rooster.loadingIds}
                    selectedItems={rooster.selectedItems}
                    onToggleSelect={rooster.toggleSelect}
                  />
                </View>
              </ScrollView>

              <BulkActionsBar
                idleCount={rooster.idleItems.length}
                readyCount={rooster.readyItems.length}
                selectedCount={rooster.selectedItems.length}
                selectedIdleCount={rooster.selectedIdleIds.length}
                selectedReadyCount={rooster.selectedReadyIds.length}
                onStartAllIdle={rooster.handleStartAllIdle}
                onFinishAllReady={rooster.handleFinishAllReady}
                onBulkStartSelected={rooster.handleBulkStartSelected}
                onBulkFinishSelected={rooster.handleBulkFinishSelected}
                onDeselectAll={() => rooster.setSelectedItems([])}
                isStarting={rooster.startBreedMutation.isPending}
                isFinishing={rooster.finishBreedMutation.isPending}
              />
            </View>
          )}

          {activeTab === "eggs" && (
            <View style={breedingStyles.tabPane}>
              {egg.eggsLoading ? (
                <View style={breedingStyles.loadingContainer}>
                  <ActivityIndicator size="large" color="#6366f1" />
                </View>
              ) : (
                <>
                  <ScrollView
                    style={breedingStyles.scroll}
                    contentContainerStyle={breedingStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    onScroll={handleChromeScroll}
                    scrollEventThrottle={16}
                  >
                    <View style={pageStyles.gridSurface}>
                      <EggGrid
                        allItems={egg.allEggItems}
                        hatchingTimeInMs={egg.hatchingTimeInMs}
                        hatchingEggExpiryInMs={egg.hatchingEggExpiryInMs}
                        now={now}
                        onStartIncubation={egg.handleStartIncubation}
                        onFinishHatching={egg.handleFinishHatching}
                        loadingIds={egg.eggLoadingIds}
                        selectedItems={egg.selectedEggItems}
                        onToggleSelect={egg.toggleEggSelect}
                      />
                    </View>
                  </ScrollView>

                  <EggBulkActionsBar
                    idleCount={egg.idleEggItems.length}
                    readyCount={egg.readyEggItems.length}
                    selectedCount={egg.selectedEggItems.length}
                    selectedIdleCount={egg.selectedIdleEggIds.length}
                    selectedReadyCount={egg.selectedReadyEggIds.length}
                    onStartAllIdle={egg.handleStartAllIdleEggs}
                    onFinishAllReady={egg.handleFinishAllReadyEggs}
                    onBulkStartSelected={egg.handleBulkStartSelectedEggs}
                    onBulkFinishSelected={egg.handleBulkFinishSelectedEggs}
                    onDeselectAll={() => egg.setSelectedEggItems([])}
                    isStarting={egg.incubateMutation.isPending}
                    isFinishing={egg.hatchMutation.isPending}
                  />
                </>
              )}
            </View>
          )}
        </View>
      </View>
    </>
  )
}

export default BreedingScreen
