import { useMemo, useState } from "react"
import { View, TouchableOpacity, FlatList, useWindowDimensions } from "react-native"
import Text from "@/components/native/text"
import { Egg } from "lucide-react-native"

import { useSafeTranslation } from "@/hooks/safe-translation"
import { useRouter } from "expo-router"
import { STATUS_ORDER } from "./utils/types"
import type { BreedingStatus, RoosterGridProps } from "./utils/types"
import { getStatusFromNow } from "./utils/helper"
import { roosterGridStyles } from "./utils/styles"
import RoosterBreedCard from "./cards/rooster-breed-card"
import { useThemeColors } from "@/config/colors"

type RoosterTab = "roosters" | "eggs"

const RoosterGrid = ({ allItems, breedingTimeInMs, now, onStartBreed, onFinishBreed, loadingIds, selectedItems, onToggleSelect }: RoosterGridProps) => {
  const [activeTab] = useState<RoosterTab>("roosters")
  const { width } = useWindowDimensions()
  const { t } = useSafeTranslation
  const router = useRouter()
  const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2

  const COLORS = useThemeColors()
  const roosterGrid = useMemo(() => roosterGridStyles(COLORS), [COLORS])

  const filteredItems = useMemo(() => {
    let items = allItems
    if (activeTab === "eggs") {
      items = allItems.filter((item) => item.hasEgg === true)
    }
    return [...items].sort((a, b) => {
      const sa = getStatusFromNow(a, breedingTimeInMs, now) as BreedingStatus
      const sb = getStatusFromNow(b, breedingTimeInMs, now) as BreedingStatus
      return STATUS_ORDER[sa] - STATUS_ORDER[sb]
    })
  }, [allItems, activeTab, now, breedingTimeInMs])

  if (allItems.length === 0) {
    return (
      <View style={roosterGrid.emptyGlobal}>
        <Egg size={64} color="#6b7280" />
        <Text style={roosterGrid.emptyGlobalText}>{t.Breeding.noRoosters}</Text>
        <TouchableOpacity style={roosterGrid.ctaButton} onPress={() => router.navigate("/")}>
          <Text style={roosterGrid.ctaButtonText}>{t.Breeding.noRoostersCta}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const showTabEmpty = filteredItems.length === 0 && activeTab !== "roosters"
  return (
    <View style={roosterGrid.container}>
      {/* <TabBar active={activeTab} onChange={setActiveTab} /> */}

      {showTabEmpty ? (
        <View style={roosterGrid.emptyTab}>
          <Text style={roosterGrid.emptyTabText} />
        </View>
      ) : (
        <FlatList
          key={numColumns}
          data={filteredItems}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? roosterGrid.columnWrapper : undefined}
          contentContainerStyle={roosterGrid.listContent}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={roosterGrid.cardWrapper}>
              <RoosterBreedCard
                item={item}
                breedingTimeInMs={breedingTimeInMs}
                now={now}
                onStartBreed={onStartBreed}
                onFinishBreed={onFinishBreed}
                isLoading={loadingIds?.has(item.id)}
                isSelected={selectedItems?.includes(item.id)}
                onToggleSelect={onToggleSelect}
              />
            </View>
          )}
        />
      )}
    </View>
  )
}

export default RoosterGrid
