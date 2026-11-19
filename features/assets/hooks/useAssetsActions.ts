/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState, useMemo } from "react"
import Decimal from "decimal.js"
import { toast } from "react-toastify"

import type { AssetName } from "@/features/assets/types/type"
import { useMyAssets } from "@/features/assets/hooks/useMyAssets"
import { api } from "@/config/react-provider"
import { useSafeTranslation } from "@/hooks/safe-translation"


interface UseAssetsActionsParams {
  name: AssetName
}

interface ListPayload {
  prices: number[]
  duration: number
  autoAdjust: boolean
}

type AssetActionId = "incubate" | "hatch" | "evolve" | "burn" | "startBreed" | "finishBreed" | "list" | "delist"

export interface ActionPillConfig {
  id: AssetActionId
  label: string
  count: number
  disabled: boolean
  loading?: boolean
  variant?: "danger" | "secondary"
  onPress: () => void
}


export const useAssetsActions = ({ name }: UseAssetsActionsParams) => {
  const { t } = useSafeTranslation
  const [listModalVisible, setListModalVisible] = useState(false)
  const [delistModalVisible, setDelistModalVisible] = useState(false)

  const dateNow = Date.now()


  const { assets: toShow, isLoading, handleAssetPress, selectedAssets, hasNextPage, isFetchingNextPage, collection, floorItem, fetchMore } = useMyAssets(name)


  const selectedItems = useMemo(() => toShow.filter((item) => selectedAssets.includes(item.id)), [toShow, selectedAssets])

  const hatchableItems = useMemo(
    () =>
      selectedItems.filter(
        (item) =>
          item.state === "incubatingEgg" &&
          item.isHatching &&
          item.hatchingSince &&
          new Decimal(item.hatchingSince.getTime()).lessThan(new Decimal(dateNow).sub(new Decimal(item.farmingCondition.hatchingTimeInMs))) &&
          item.listings.length === 0,
      ),
    [selectedItems, dateNow],
  )

  const incubatableItems = useMemo(
    () => selectedItems.filter((item) => item.state === "hatchingEgg" && !item.isHatching && !item.hatchingSince && item.listings.length === 0),
    [selectedItems],
  )

  const listableItems = useMemo(
    () =>
      selectedItems
        .filter((item) => item.listings.length === 0)
        .filter((item) => item.isBreeding === false)
        .filter((item) => !item.rentValidUntil || new Date(item.rentValidUntil).getTime() > dateNow),
    [selectedItems, dateNow],
  )

  const delistableItems = useMemo(() => selectedItems.filter((item) => item.listings.length > 0), [selectedItems])

  const evolvableItems = useMemo(
    () =>
      selectedItems.filter(
        (item) =>
          item.state === "cockerel" &&
          item.finishedHatchingAt &&
          new Decimal(item.finishedHatchingAt.getTime()).greaterThan(new Decimal(dateNow).sub(new Decimal(item.farmingCondition.cockerelEvolveDeadlineInMs))),
      ),
    [selectedItems, dateNow],
  )

  const breedableItems = useMemo(
    () =>
      selectedItems.filter(
        (item) =>
          (item.state === "rooster" || item.state === "hen") && !item.isBreeding && !item.breedingSince && !item.breedingWithId && item.listings.length === 0,
      ),
    [selectedItems],
  )

  const finishBreedItems = useMemo(
    () =>
      selectedItems.filter(
        (item) =>
          (item.state === "rooster" || item.state === "hen") &&
          item.isBreeding &&
          item.breedingSince &&
          new Decimal(item.breedingSince.getTime()).lessThan(new Decimal(dateNow).sub(new Decimal(item.farmingCondition.breedingTimeInMs))) &&
          item.breedingWithId &&
          item.listings.length === 0,
      ),
    [selectedItems, dateNow],
  )


  const utils = api.useUtils()

  const invalidate = async () => {
    await utils.collection.infiniteItemsByName.invalidate()
    await utils.farm.myFarmingInfo.invalidate()
  }

  const list = api.listing.create.useMutation({ onSuccess: invalidate })
  const delist = api.listing.cancel.useMutation({ onSuccess: invalidate })
  const incubate = api.egg.incubate.useMutation({ onSuccess: invalidate })
  const hatch = api.egg.hatch.useMutation({ onSuccess: invalidate })
  const burn = api.hen.burn.useMutation({ onSuccess: invalidate })
  const evolveCockerels = api.hen.evolveCockerels.useMutation({ onSuccess: invalidate })
  const startBreedRooster = api.hen.startBreed.useMutation({ onSuccess: invalidate })
  const finishBreedRooster = api.hen.finishBreed.useMutation({ onSuccess: invalidate })


  const handleList = async ({ prices, duration }: ListPayload) => {
    if (!listableItems.length) return
    if (prices.includes(0)) {
      toast.error(t("Assets.marketplace.priceCannotBeZero"))
      return
    }
    try {
      await toast.promise(
        list.mutateAsync(
          listableItems.map((item, index) => ({
            assetId: item.id,
            assetNumId: item.numId,
            assetImage: item.image.includes("hen") ? item.image + (item.numId % 1000) + ".png" : item.image + item.state + ".jpg",
            duration,
            buyNowPrice: (prices[index] ?? 0).toString(),
            collectionItem: item.state,
            listingCurrency: "usd",
          })),
        ),
        {
          pending: t("Assets.marketplace.toasts.createListings.pending"),
          success: t("Assets.marketplace.toasts.createListings.success"),
          error: t("Assets.marketplace.toasts.createListings.error"),
        },
      )
    } catch (err) {
      if (err instanceof Error) toast.error(err.message)
    }
  }

  const handleDelist = async () => {
    if (!delistableItems.length) return
    try {
      await toast.promise(
        delist.mutateAsync({
          listingIds: delistableItems.map((item) => item.listings[0]?.id).filter((id): id is string => id !== undefined),
        }),
        {
          pending: t("Assets.marketplace.toasts.delist.pending"),
          success: t("Assets.marketplace.toasts.delist.success"),
          error: t("Assets.marketplace.toasts.delist.error"),
        },
      )
    } catch (err) {
      if (err instanceof Error) toast.error(err.message)
    }
  }

  const handleIncubate = async () => {
    if (!incubatableItems.length) return
    try {
      await toast.promise(incubate.mutateAsync(incubatableItems.map((item) => ({ id: item.id }))), {
        pending: t("Assets.egg.toasts.incubate.pending"),
        success: t("Assets.egg.toasts.incubate.success"),
        error: t("Assets.egg.toasts.incubate.error"),
      })
    } catch (err) {
      if (err instanceof Error) toast.error(err.message)
    }
  }

  const handleHatch = async () => {
    if (!hatchableItems.length) return
    try {
      await toast.promise(hatch.mutateAsync(hatchableItems.map((item) => ({ id: item.id }))), {
        pending: t("Assets.egg.toasts.hatch.pending"),
        success: t("Assets.egg.toasts.hatch.success"),
        error: t("Assets.egg.toasts.hatch.error"),
      })
    } catch (err) {
      if (err instanceof Error) toast.error(err.message)
    }
  }

  const handleBurn = async () => {
    if (!selectedAssets.length) return
    try {
      await toast.promise(burn.mutateAsync({ ids: selectedAssets }), {
        pending: t("Assets.hen.toasts.burn.pending"),
        success: t("Assets.hen.toasts.burn.success"),
        error: t("Assets.hen.toasts.burn.error"),
      })
    } catch (err) {
      if (err instanceof Error) toast.error(err.message)
    }
  }

  const handleEvolve = async () => {
    if (!evolvableItems.length) return
    try {
      await toast.promise(evolveCockerels.mutateAsync({ ids: evolvableItems.map((item) => item.id) }), {
        pending: t("Assets.hen.toasts.evolve.pending"),
        success: t("Assets.hen.toasts.evolve.success"),
        error: t("Assets.hen.toasts.evolve.error"),
      })
    } catch (err) {
      if (err instanceof Error) toast.error(err.message)
    }
  }

  const handleStartBreed = async () => {
    if (!breedableItems.length) return
    try {
      await toast.promise(startBreedRooster.mutateAsync({ roosterIds: breedableItems.map((item) => item.id) }), {
        pending: t("Assets.hen.toasts.startBreed.pending"),
        success: t("Assets.hen.toasts.startBreed.success"),
        error: t("Assets.hen.toasts.startBreed.error"),
      })
    } catch (err) {
      if (err instanceof Error) toast.error(err.message)
    }
  }

  const handleFinishBreed = async () => {
    if (!finishBreedItems.length) return
    try {
      await toast.promise(finishBreedRooster.mutateAsync({ roosterIds: finishBreedItems.map((item) => item.id) }), {
        pending: t("Assets.hen.toasts.finishBreed.pending"),
        success: t("Assets.hen.toasts.finishBreed.success"),
        error: t("Assets.hen.toasts.finishBreed.error"),
      })
    } catch (err) {
      if (err instanceof Error) toast.error(err.message)
    }
  }


  const aliveItems = useMemo(() => toShow.filter((item) => !item.isDead), [toShow])

  const allAliveSelected = aliveItems.length > 0 && selectedAssets.length === aliveItems.length

  const handleSelectAll = () =>
    aliveItems.forEach((item) => {
      if (!selectedAssets.includes(item.id)) handleAssetPress(item.id)
    })

  const handleDeselectAll = () => [...selectedAssets].forEach((id) => handleAssetPress(id))

  const handleSelectListed = () => {
    handleDeselectAll()
    toShow.filter((item) => item.listings.length > 0).forEach((item) => handleAssetPress(item.id))
  }


  const actionPillConfigs = useMemo<ActionPillConfig[]>(() => {
    const pills: ActionPillConfig[] = []
    const isTrading = collection.data?.isTrading

    if (name === "hatchingEgg") {
      pills.push({
        id: "incubate",
        label: t("Assets.egg.buttons.incubate"),
        count: incubatableItems.length,
        onPress: handleIncubate,
        disabled: incubatableItems.length === 0,
        loading: incubate.isPending,
      })
    }
    if (name === "incubatingEgg") {
      pills.push({
        id: "hatch",
        label: t("Assets.egg.buttons.hatch"),
        count: hatchableItems.length,
        onPress: handleHatch,
        disabled: hatchableItems.length === 0,
        loading: hatch.isPending,
      })
    }
    if (name === "cockerel") {
      pills.push({
        id: "evolve",
        label: t("Assets.hen.buttons.evolve"),
        count: evolvableItems.length,
        onPress: handleEvolve,
        disabled: evolvableItems.length === 0,
        loading: evolveCockerels.isPending,
      })
      pills.push({
        id: "burn",
        label: t("Assets.hen.buttons.burn"),
        count: selectedAssets.length,
        onPress: handleBurn,
        disabled: selectedAssets.length === 0,
        loading: burn.isPending,
        variant: "danger" as const,
      })
    }
    if (name === "rooster") {
      pills.push({
        id: "startBreed",
        label: t("Assets.hen.buttons.startBreed"),
        count: breedableItems.length,
        onPress: handleStartBreed,
        disabled: breedableItems.length === 0,
        loading: startBreedRooster.isPending,
      })
      pills.push({
        id: "finishBreed",
        label: t("Assets.hen.buttons.finishBreed"),
        count: finishBreedItems.length,
        onPress: handleFinishBreed,
        disabled: finishBreedItems.length === 0,
        loading: finishBreedRooster.isPending,
        variant: "secondary" as const,
      })
    }
    if (isTrading) {
      pills.push({
        id: "list",
        label: t("Assets.marketplace.list"),
        count: listableItems.length,
        onPress: () => setListModalVisible(true),
        disabled: listableItems.length === 0,
      })
      pills.push({
        id: "delist",
        label: t("Assets.marketplace.delist"),
        count: delistableItems.length,
        onPress: () => setDelistModalVisible(true),
        disabled: delistableItems.length === 0,
        loading: delist.isPending,
        variant: "secondary" as const,
      })
    }

    return pills
  }, [
    collection.data?.isTrading,
    name,
    incubatableItems.length,
    handleIncubate,
    incubate.isPending,
    hatchableItems.length,
    handleHatch,
    hatch.isPending,
    evolvableItems.length,
    handleEvolve,
    evolveCockerels.isPending,
    selectedAssets.length,
    handleBurn,
    burn.isPending,
    breedableItems.length,
    handleStartBreed,
    startBreedRooster.isPending,
    finishBreedItems.length,
    handleFinishBreed,
    finishBreedRooster.isPending,
    listableItems.length,
    delistableItems.length,
    delist.isPending,
    t,
  ])


  const showToolbar =
    (collection.data?.isTrading ?? name === "incubatingEgg") ||
    name === "hatchingEgg" ||
    name === "cockerel" ||
    name === "rooster" ||
    name === "cattle" ||
    name === "heifer"

  const toolbarVisible = !!showToolbar && actionPillConfigs.length > 0


  const floorPrice = floorItem.data?.buyNowPrice ? new Decimal(floorItem.data.buyNowPrice).toNumber() : undefined


  return {
    // data
    toShow,
    isLoading,
    selectedAssets,
    hasNextPage,
    isFetchingNextPage,
    collection,
    fetchMore,
    utils,

    // selection
    aliveItems,
    allAliveSelected,
    handleAssetPress,
    handleSelectAll,
    handleDeselectAll,
    handleSelectListed,

    // action handlers
    handleList,
    handleDelist,

    // derived buckets
    listableItems,
    delistableItems,

    // pill configs (no JSX â€” icons live in the component)
    actionPillConfigs,
    toolbarVisible,
    showToolbar,
    floorPrice,

    // modals
    listModalVisible,
    setListModalVisible,
    delistModalVisible,
    setDelistModalVisible,

    // mutation states
    isPendingList: list.isPending,
    isPendingDelist: delist.isPending,
  }
}
