import type { T } from "@/messages/types"
import type { RouterOutputs } from "@newyolk/api"
import { useState } from "react"
import { FlatList, RefreshControl, ScrollView, View, TouchableOpacity } from "react-native"
import { LoadingSpinner } from "@/components/helpers/loading"
import { MarketplaceActivityItem } from "@/features/marketplace/components/activity-item"
import { FilterBar } from "@/features/marketplace/components/filter-bar"
import { MarketplaceListingCard } from "@/features/marketplace/components/listing-card"
import Text from "@/components/native/text"
import { getTranslationsAssets } from "@/messages/getTranslations"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react-native"
import SalesChart from "@/components/charts/sales-chart"
import { useListingsView } from "@/features/marketplace/hooks/useListingsView"
import { useThemeColors } from "@/config/colors"
import { ListingsControls } from "./listings-controls"
import { SalesBar } from "../sales-bar"
import { ActivityBar } from "../activity-bar"
import { DraggableSheetWrapper as DraggableSheet } from "@/components/sheets/draggable-sheet"
import { Slider } from "@/components/helpers/slider"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { api } from "@/config/react-provider"

const ListingsView = ({
  t,
  initialCollection,
  initialFilteredListings,
  initialSoldListings,
  initialFloorItem,
  initialEgg,
  initialCorn,
  initialMilk,
  initialHay,
}: {
  t: T
  initialCollection: RouterOutputs["collection"]["byName"]
  initialFilteredListings: RouterOutputs["listing"]["infiniteFilteredListingsByName"]
  initialSoldListings: RouterOutputs["listing"]["infiniteSoldListingsByName"]
  initialFloorItem: RouterOutputs["listing"]["floorItemByName"]
  initialEgg?: RouterOutputs["commodityRate"]["sourceToTarget"]
  initialCorn?: RouterOutputs["commodityRate"]["sourceToTarget"]
  initialMilk?: RouterOutputs["commodityRate"]["sourceToTarget"]
  initialHay?: RouterOutputs["commodityRate"]["sourceToTarget"]
}) => {
  const [sweepValue, setSweepValue] = useState([0])
  const {
    session,
    isFilterOpen,
    setIsFilterOpen,
    selectedFilter,
    selectedListings,
    selectedTab,
    setSelectedTab,
    infiniteFilteredListingsByName,
    infiniteSoldListingsByName,
    floorItem,
    listingsToShow,
    soldListingsToShow,
    selectedPurchasableListings,
    totalPrice,
    buyNowListings,
    handleLoadMore,
    handleRefresh,
    handleBuyNowSelectedListings,
    handleBuyNowFloor,
    handleFilterChange,
    handleListingPress,
    handleSweepChange,
  } = useListingsView({
    t,
    initialCollection,
    initialFilteredListings,
    initialSoldListings,
    initialFloorItem,
    setSweepValue,
  })

  const COLORS = useThemeColors()
  const insets = useSafeAreaInsets()

  const [isPriceIndicatorVisible, setIsPriceIndicatorVisible] = useState(true)
  const allPurchasableItems = listingsToShow.filter((listing) => listing.sellerEmail !== session?.user.email)

  const tabs = [
    { key: "items", label: t.Marketplace.items },
    { key: "sales", label: t.Marketplace.sales },
    { key: "activity", label: t.Marketplace.activity },
  ]

  const renderListingCard = ({ item }: { item: (typeof listingsToShow)[0] }) => {
    const isSelected = selectedListings.includes(item.id)
    const isOwned = item.sellerEmail === session?.user.email

    return <MarketplaceListingCard listing={item} isSelected={isSelected} isOwned={isOwned} onPress={() => handleListingPress(item.id, isOwned)} />
  }
  const filterBarParams = {
    listingCount: listingsToShow.length,
    selectedFilter,
    filterOptions: getTranslationsAssets().Marketplace.listingFilters,
    isFilterOpen,
    isFetching: infiniteFilteredListingsByName.isFetching,
    listedLabel: t.Marketplace.listed,
    onFilterPress: () => setIsFilterOpen(!isFilterOpen),
    onFilterSelect: handleFilterChange,
  }

  const handleSetSelectedTab = (tab: string) => setSelectedTab(tab as "items" | "sales" | "activity")

  const eggToUsd = api.commodityRate.sourceToTarget.useQuery(
    {
      sourceCommodity: "EGG",
      targetCurrency: "USD",
    },
    {
      initialData: initialEgg,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )

  const cornToUsd = api.commodityRate.sourceToTarget.useQuery(
    {
      sourceCommodity: "CORN",
      targetCurrency: "USD",
    },
    {
      initialData: initialCorn,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )

  const milkToUsd = api.commodityRate.sourceToTarget.useQuery(
    {
      sourceCommodity: "MILK",
      targetCurrency: "USD",
    },
    {
      initialData: initialMilk,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )

  const hayToUsd = api.commodityRate.sourceToTarget.useQuery(
    {
      sourceCommodity: "HAY",
      targetCurrency: "USD",
    },
    {
      initialData: initialHay,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      {selectedTab === "items" && <FilterBar {...filterBarParams} />}
      {selectedTab === "sales" && <SalesBar />}
      {selectedTab === "activity" && <ActivityBar />}

      {isPriceIndicatorVisible ? (
        <View
          style={{
            position: "absolute",
            right: 0,
            top: "40%",
            transform: [{ translateY: -100 }],
            zIndex: 10,
            backgroundColor: COLORS.zinc[900],
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            borderWidth: 1,
            borderRightWidth: 0,
            borderColor: COLORS.zinc[800],
            paddingVertical: 12,
            paddingLeft: 10,
            paddingRight: 8,
            gap: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => setIsPriceIndicatorVisible(false)}
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              marginVertical: -4,
              borderRadius: 999,
              backgroundColor: COLORS.zinc[800],
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <ChevronRight size={16} color={COLORS.primary[400]} />
          </TouchableOpacity>

          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={{ fontSize: 16 }}>{eggToUsd.data?.emoji}</Text>
            <Text
              style={{
                fontSize: 10,
                color: COLORS.primary[400],
              }}
            >
              ${eggToUsd.data?.exchangeRate}
            </Text>
          </View>

          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={{ fontSize: 16 }}>{cornToUsd.data?.emoji}</Text>
            <Text
              style={{
                fontSize: 10,
                color: COLORS.primary[400],
              }}
            >
              ${cornToUsd.data?.exchangeRate}
            </Text>
          </View>

          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={{ fontSize: 16 }}>{milkToUsd.data?.emoji}</Text>
            <Text
              style={{
                fontSize: 10,
                color: COLORS.primary[400],
              }}
            >
              ${milkToUsd.data?.exchangeRate}
            </Text>
          </View>

          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={{ fontSize: 16 }}>{hayToUsd.data?.emoji}</Text>
            <Text
              style={{
                fontSize: 10,
                color: COLORS.primary[400],
              }}
            >
              ${hayToUsd.data?.exchangeRate}
            </Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setIsPriceIndicatorVisible(true)}
          style={{
            position: "absolute",
            right: 0,
            top: "40%",
            transform: [{ translateY: -18 }],
            zIndex: 10,
            backgroundColor: COLORS.zinc[900],
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            borderWidth: 1,
            borderRightWidth: 0,
            borderColor: COLORS.zinc[800],
            width: 28,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <ChevronLeft size={16} color={COLORS.success[500]} />
        </TouchableOpacity>
      )}

      <View style={{ flex: 1 }}>
        {selectedTab === "items" && (
          <FlatList
            data={listingsToShow}
            numColumns={2}
            keyExtractor={(item: { id: string }) => item.id}
            renderItem={renderListingCard}
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 8, paddingTop: 12, paddingBottom: 80 }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            refreshControl={
              <RefreshControl
                refreshing={infiniteFilteredListingsByName.isRefetching}
                onRefresh={handleRefresh}
                tintColor={COLORS.primary[500]}
                colors={[COLORS.primary[500]]}
              />
            }
            ListFooterComponent={infiniteFilteredListingsByName.isFetchingNextPage ? <LoadingSpinner /> : null}
            ListEmptyComponent={
              !infiniteFilteredListingsByName.isFetching ? (
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 96 }}>
                  <Clock size={48} color={COLORS.zinc[600]} />
                  <Text style={{ marginTop: 16, fontSize: 16, color: COLORS.zinc[500] }}>{t.Marketplace.noItems}</Text>
                </View>
              ) : null
            }
          />
        )}

        {selectedTab === "sales" && <SalesChart data={soldListingsToShow} />}

        {selectedTab === "activity" && (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, paddingTop: 25 }}
            refreshControl={
              <RefreshControl
                refreshing={infiniteSoldListingsByName.isRefetching}
                onRefresh={handleRefresh}
                tintColor={COLORS.success[500]}
                colors={[COLORS.success[500]]}
              />
            }
            onScroll={({ nativeEvent }) =>
              nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - 100 && handleLoadMore()
            }
            scrollEventThrottle={400}
          >
            {soldListingsToShow.map((listing, index) => (
              <MarketplaceActivityItem key={`${listing.id}-${index}`} listing={listing} />
            ))}
          </ScrollView>
        )}
      </View>
      {selectedTab === "items" && allPurchasableItems.length > 0 && (
        <>
          <ListingsControls
            t={t}
            COLORS={COLORS}
            selectedTab={selectedTab}
            selectedPurchasableListings={selectedPurchasableListings}
            floorItem={floorItem}
            buyNowListings={buyNowListings}
            totalPrice={totalPrice}
            handleBuyNowSelectedListings={handleBuyNowSelectedListings}
            handleBuyNowFloor={handleBuyNowFloor}
          />
          <>
            <Slider value={sweepValue} allPurchasableItems={allPurchasableItems} step={1} onValueChange={handleSweepChange} />
            <View style={{ marginBottom: 80 }} />
          </>
        </>
      )}
      <DraggableSheet COLORS={COLORS} tabs={tabs} selectedTab={selectedTab} setSelectedTab={handleSetSelectedTab} insetsBottom={insets.bottom} />
    </View>
  )
}

export default ListingsView
