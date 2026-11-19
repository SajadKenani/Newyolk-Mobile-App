import { View, TouchableOpacity, ScrollView, StyleSheet } from "react-native"
import { FlatList } from "react-native"
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"
import { useLocalSearchParams } from "expo-router"
import { X, Egg, Flame, Dna, Sprout, Tag, Gavel, Check, CheckSquare, Square, ListFilter } from "lucide-react-native"
import type { LucideIcon } from "lucide-react-native"

import { AssetsCard } from "@/features/assets/components/assets-card"
import type { AssetName, ActionPillProps } from "@/features/assets/types/type"
import Text from "@/components/native/text"
import ErrorView from "@/components/helpers/error-event"
import { SkeletalAssetsCard } from "@/components/skeleton/skeletal-assets-card"
import { useThemeColors } from "@/config/colors"
import ListModal from "@/features/assets/components/list-modal"
import DelistModal from "@/features/assets/components/delist-modal"
import ActionPill from "@/features/assets/components/action-pill"
import { useAssetsActions } from "@/features/assets/hooks/useAssetsActions"
import type { ActionPillConfig } from "@/features/assets/hooks/useAssetsActions"
import { useSafeTranslation } from "@/hooks/safe-translation"

const PILL_ICON_MAP: Record<ActionPillConfig["id"], LucideIcon> = {
  incubate: Egg,
  hatch: Sprout,
  evolve: Dna,
  burn: Flame,
  startBreed: Dna,
  finishBreed: Check,
  list: Tag,
  delist: Gavel,
}

const pillConfigToProps = (config: ActionPillConfig): ActionPillProps => {
  const Icon = PILL_ICON_MAP[config.id]
  return {
    ...config,
    icon: Icon ? <Icon size={14} color="#fff" /> : undefined,
  }
}

interface AssetsModalScreenProps {
  name?: string
  onClose?: () => void
}

const AssetsModalScreen = ({ name: providedName, onClose }: AssetsModalScreenProps = {}) => {
  const { t } = useSafeTranslation
  const params = useLocalSearchParams<{ name: string }>()
  const rawName = Array.isArray(params.name) ? (params.name as string[])[0] : params.name
  const name = (providedName ?? (rawName ? decodeURIComponent(rawName).trim() : "")) as AssetName

  const COLORS = useThemeColors()

  const {
    toShow,
    isLoading,
    selectedAssets,
    hasNextPage,
    isFetchingNextPage,
    collection,
    fetchMore,
    allAliveSelected,
    handleAssetPress,
    handleSelectAll,
    handleDeselectAll,
    handleSelectListed,
    handleList,
    handleDelist,
    listableItems,
    delistableItems,
    actionPillConfigs,
    toolbarVisible,
    showToolbar,
    floorPrice,
    listModalVisible,
    setListModalVisible,
    delistModalVisible,
    setDelistModalVisible,
    isPendingList,
    isPendingDelist,
    utils,
  } = useAssetsActions({ name })

  const hasSelection = selectedAssets.length > 0
  const listedItems = toShow.filter((item) => item.listings.length > 0)

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        {showToolbar ? (
          <View style={styles.toolbarContent}>
            <TouchableOpacity
              onPress={allAliveSelected ? handleDeselectAll : handleSelectAll}
              activeOpacity={0.7}
              style={[styles.pillButton, allAliveSelected ? styles.pillButtonActive : styles.pillButtonInactive]}
            >
              {allAliveSelected ? <CheckSquare size={14} color="#fff" /> : <Square size={14} color="#9ca3af" />}
              <Text style={[styles.pillButtonText, allAliveSelected ? styles.pillButtonTextActive : styles.pillButtonTextInactive]}>
                {allAliveSelected ? t("Breeding.deselectAll") : t("Breeding.selectAll")}
              </Text>
            </TouchableOpacity>

            {collection.data?.isTrading && (
              <TouchableOpacity
                onPress={handleSelectListed}
                activeOpacity={0.7}
                disabled={listedItems.length === 0}
                style={[styles.pillButton, styles.pillButtonInactive, listedItems.length === 0 ? styles.disabled : styles.enabled]}
              >
                <ListFilter size={14} color="#9ca3af" />
                <Text style={[styles.pillButtonText, styles.pillButtonTextInactive]}>{t("Assets.marketplace.listed")}</Text>
                <Gavel size={11} color={COLORS.primary[400]} />
              </TouchableOpacity>
            )}

            {hasSelection && (
              <TouchableOpacity onPress={handleDeselectAll} activeOpacity={0.7} style={styles.deselectButton}>
                <X size={13} color="#9ca3af" />
              </TouchableOpacity>
            )}

            {hasSelection && (
              <Text style={styles.selectedCount}>
                {selectedAssets.length} {t("Assets.marketplace.selected")}
              </Text>
            )}
          </View>
        ) : (
          <View />
        )}

        {onClose ? (
          <TouchableOpacity onPress={onClose} activeOpacity={0.8} style={styles.closeButton}>
            <X size={18} color="#d4d4d8" />
          </TouchableOpacity>
        ) : null}
      </View>

      {isLoading ? (
        <Animated.View style={styles.gridContainer}>
          <FlatList
            numColumns={2}
            data={Array.from({ length: 12 }, (_, index) => index.toString())}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.flatListContent}
            columnWrapperStyle={styles.columnWrapper}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            renderItem={() => <SkeletalAssetsCard />}
          />
        </Animated.View>
      ) : (
        <Animated.View entering={FadeIn.duration(500)} style={styles.gridContainer}>
          <FlatList
            data={toShow}
            numColumns={2}
            keyExtractor={(item) => item.id}
            onEndReached={() => hasNextPage && !isFetchingNextPage && fetchMore()}
            onEndReachedThreshold={0.3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.flatListContent, { paddingBottom: toolbarVisible ? 190 : 100, paddingTop: 12 }]}
            columnWrapperStyle={styles.columnWrapper}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{t("Assets.marketplace.noItems")}</Text>
              </View>
            }
            renderItem={({ item }) => {
              if (!item) return null

              try {
                return <AssetsCard item={item} handleAssetPress={handleAssetPress} selectedAssets={selectedAssets} />
              } catch (error: unknown) {
                return <ErrorView error={error} onRetry={() => utils.collection.infiniteItemsByName.invalidate()} />
              }
            }}
          />
        </Animated.View>
      )}

      {toolbarVisible && (
        <Animated.View entering={FadeInDown.duration(280).springify()} style={styles.actionToolbar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionScrollContent}>
            {actionPillConfigs.map((config) => (
              <ActionPill key={config.id} {...pillConfigToProps(config)} />
            ))}
          </ScrollView>
        </Animated.View>
      )}

      <ListModal
        visible={listModalVisible}
        onClose={() => setListModalVisible(false)}
        listableItems={listableItems}
        floorPrice={floorPrice}
        collectionName={collection.data?.name ?? ""}
        isPending={isPendingList}
        onList={handleList}
      />

      <DelistModal
        visible={delistModalVisible}
        onClose={() => setDelistModalVisible(false)}
        delistableItems={delistableItems}
        collectionName={collection.data?.name ?? ""}
        isPending={isPendingDelist}
        onDelist={handleDelist}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 10,
    backgroundColor: "#18181b",
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
    gap: 8,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: "#0a0a0a",
    gap: 10,
    marginTop: 20
  },
  toolbarContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#27272a",
    backgroundColor: "#18181b",
    alignItems: "center",
    justifyContent: "center",
  },
  pillButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillButtonActive: {
    backgroundColor: "#a855f7",
    borderColor: "transparent",
  },
  pillButtonInactive: {
    backgroundColor: "transparent",
    borderColor: "#3f3f46",
  },
  pillButtonText: {
    fontSize: 12,
  },
  pillButtonTextActive: {
    color: "#ffffff",
  },
  pillButtonTextInactive: {
    color: "#9ca3af",
  },
  disabled: {
    opacity: 0.4,
  },
  enabled: {
    opacity: 1,
  },
  deselectButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3f3f46",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCount: {
    fontSize: 12,
    color: "#9ca3af",
    marginLeft: 4,
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  flatListContent: {
    paddingBottom: 150,
    paddingTop: 16,
  },
  columnWrapper: {
    flex: 1,
    justifyContent: "space-around",
    marginBottom: 14,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 15,
    color: "#4b5563",
  },
  actionToolbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 12,
    backgroundColor: "#09090b",
    borderTopWidth: 1,
    borderTopColor: "#27272a",
  },
  actionScrollContent: {
    gap: 8,
    paddingHorizontal: 2,
  },
})

export default AssetsModalScreen
