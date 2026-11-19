import { useEffect, useRef, useCallback, useState } from "react"
import type { AssetName } from "@/features/assets/types/type"
import { api } from "@/config/react-provider"
import Decimal from "decimal.js"
import type { CattleState, HenState } from "@newyolk/db"

const LIMIT = 20

export const useMyAssets = (name: AssetName) => {
  const sentinelRef = useRef(null)
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])

  // eslint-disable-next-line react-hooks/purity
  const dateNow = Date.now()

  const myItems = api.collection.infiniteItemsByName.useInfiniteQuery(
    { name: name, limit: LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  )

  const assets = myItems.data?.pages.flatMap((page) => page.items).filter((i) => i?.id) ?? []

  const selectedItems = assets.filter((item) => selectedAssets.includes(item.id))

  const hatchableItems = selectedItems.filter(
    (item) =>
      item.state === "incubatingEgg" &&
      item.isHatching &&
      item.hatchingSince &&
      new Decimal(item.hatchingSince.getTime()).lessThan(new Decimal(dateNow).sub(new Decimal(item.farmingCondition.hatchingTimeInMs))) &&
      item.listings.length === 0,
  )

  const incubatableItems = selectedItems.filter((item) => item.state === "hatchingEgg" && !item.isHatching && !item.hatchingSince && item.listings.length === 0)

  const listableItems = selectedItems
    .filter((item) => item.listings.length === 0)
    .filter((item) => item.isBreeding === false)
    .filter((item) => !item.rentValidUntil || new Date(item.rentValidUntil).getTime() > dateNow)

  const delistableItems = selectedItems.filter((item) => item.listings.length > 0)

  const evolvableItems = selectedItems.filter(
    (item) =>
      item.state === "cockerel" &&
      item.finishedHatchingAt &&
      new Decimal(item.finishedHatchingAt.getTime()).greaterThan(new Decimal(dateNow).sub(new Decimal(item.farmingCondition.cockerelEvolveDeadlineInMs))),
  )

  const breedableItems = selectedItems.filter(
    (item) =>
      (item.state === "rooster" || item.state === "hen") && !item.isBreeding && !item.breedingSince && !item.breedingWithId && item.listings.length === 0,
  )

  const finishBreedItems = selectedItems.filter(
    (item) =>
      (item.state === "rooster" || item.state === "hen") &&
      item.isBreeding &&
      item.breedingSince &&
      new Decimal(item.breedingSince.getTime()).lessThan(new Decimal(dateNow).sub(new Decimal(item.farmingCondition.breedingTimeInMs))) &&
      item.breedingWithId &&
      item.listings.length === 0,
  )

  const fetchMore = useCallback(async () => {
    if (myItems.hasNextPage && !myItems.isFetchingNextPage) await myItems.fetchNextPage()
  }, [myItems])

  const collection = api.collection.byName.useQuery(
    { name: name as HenState | CattleState },
    { enabled: !!name, refetchOnWindowFocus: false, refetchOnMount: false },
  )

  const floorItem = api.listing.floorItemByName.useQuery({ name: name as HenState | CattleState }, { enabled: !!name, refetchOnMount: false })

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(([entry]) => entry?.isIntersecting && void fetchMore(), { threshold: 0.1 })

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [fetchMore])

  const handleAssetPress = useCallback((assetId: string) => {
    setSelectedAssets((prev) => {
      const next = prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
      return next
    })
  }, [])
  return {
    assets,
    isLoading: myItems.isLoading,
    isError: myItems.isError,
    hasNextPage: myItems.hasNextPage,
    isFetchingNextPage: myItems.isFetchingNextPage,
    sentinelRef,
    handleAssetPress,
    selectedAssets,
    hatchableItems,
    incubatableItems,
    listableItems,
    delistableItems,
    evolvableItems,
    breedableItems,
    finishBreedItems,
    collection,
    floorItem,
    fetchMore,
  }
}
