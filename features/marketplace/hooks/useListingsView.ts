import type { T } from "@/messages/types"
import { authClient } from "@/auth/client"
import { useCallback, useEffect, useMemo, useState } from "react"
import { getTranslationsAssets } from "@/messages/getTranslations"
import { api } from "@/config/react-provider"
import type { RouterOutputs } from "@/config/react-provider"
import Decimal from "decimal.js"
import { toast } from "react-toastify"

interface UseListingsViewProps {
  t: T
  initialCollection: RouterOutputs["collection"]["byName"]
  initialFilteredListings: RouterOutputs["listing"]["infiniteFilteredListingsByName"]
  initialSoldListings: RouterOutputs["listing"]["infiniteSoldListingsByName"]
  initialFloorItem: RouterOutputs["listing"]["floorItemByName"]
  setSweepValue: (value: number[]) => void
}

export const useListingsView = ({
  t,
  initialCollection,
  initialFilteredListings,
  initialSoldListings,
  initialFloorItem,
  setSweepValue,
}: UseListingsViewProps) => {
  const { data: session } = authClient.useSession()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [orderBy, setOrderBy] = useState<string>("price_asc")
  const [selectedFilter, setSelectedFilter] = useState({
    label: String(t.Marketplace.listingFilters[1]?.label),
    value: "price_asc",
  })
  const [selectedListings, setSelectedListings] = useState<string[]>([])
  const [selectedTab, setSelectedTab] = useState<"items" | "sales" | "activity">("items")

  const infiniteFilteredListingsByName = api.listing.infiniteFilteredListingsByName.useInfiniteQuery(
    {
      where: {
        active: true,
        hasSold: false,
        name: initialCollection.item,
      },
      orderBy: getTranslationsAssets().Marketplace.listingFilters.find((filter) => filter.value === orderBy)?.orderBy ?? {
        buyNowPrice: "asc",
      },
      limit: 50,
    },
    {
      initialData: {
        pages: [initialFilteredListings],
        pageParams: [null],
      },
      staleTime: 1000 * 60 * 1,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  const infiniteSoldListingsByName = api.listing.infiniteSoldListingsByName.useInfiniteQuery(
    {
      hasSold: true,
      name: initialCollection.item,
      limit: 50,
    },
    {
      initialData: {
        pages: [initialSoldListings],
        pageParams: [null],
      },
      staleTime: 1000 * 60 * 1,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!initialCollection.item,
    },
  )
  const floorItem = api.listing.floorItemByName.useQuery(
    { name: initialCollection.item },
    {
      initialData: initialFloorItem,
      refetchOnWindowFocus: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  )
  const listingsToShow = useMemo(() => infiniteFilteredListingsByName.data.pages.flatMap((page) => page.items), [infiniteFilteredListingsByName.data.pages])
  const soldListingsToShow = useMemo(() => infiniteSoldListingsByName.data.pages.flatMap((page) => page.items), [infiniteSoldListingsByName.data.pages])
  const selectedPurchasableListings = useMemo(
    () => listingsToShow.filter((listing) => selectedListings.includes(listing.id) && listing.sellerEmail !== session?.user.email),
    [listingsToShow, selectedListings, session?.user.email],
  )

  const totalPrice = useMemo(
    () => selectedPurchasableListings.reduce((acc, listing) => acc.add(new Decimal(listing.buyNowPrice)), new Decimal(0)).toNumber(),
    [selectedPurchasableListings],
  )

  const utils = api.useUtils()

  const buyNowListings = api.listing.buyNow.useMutation({
    onSuccess: async () => {
      await utils.listing.infiniteFilteredListingsByName.invalidate()
      await utils.listing.infiniteSoldListingsByName.invalidate()
      await utils.farm.myFarmingInfo.invalidate()
      setSelectedListings([])
    },
  })

  const handleLoadMore = useCallback(() => {
    if (selectedTab === "items" && !infiniteFilteredListingsByName.isFetchingNextPage && infiniteFilteredListingsByName.hasNextPage) {
      void infiniteFilteredListingsByName.fetchNextPage()
    } else if (selectedTab === "activity" && !infiniteSoldListingsByName.isFetchingNextPage && infiniteSoldListingsByName.hasNextPage) {
      void infiniteSoldListingsByName.fetchNextPage()
    }
  }, [selectedTab, infiniteFilteredListingsByName, infiniteSoldListingsByName])

  const handleRefresh = useCallback(async () => {
    if (selectedTab === "items") {
      await infiniteFilteredListingsByName.refetch()
    } else if (selectedTab === "activity") {
      await infiniteSoldListingsByName.refetch()
    }
    await floorItem.refetch()
  }, [selectedTab, infiniteFilteredListingsByName, infiniteSoldListingsByName, floorItem])

  const handleBuyNowSelectedListings = useCallback(async () => {
    if (!selectedPurchasableListings.length) return
    try {
      await toast.promise(
        buyNowListings.mutateAsync({
          listingIds: selectedPurchasableListings.map((listing) => listing.id),
        }),
        {
          pending: "Buying listings...",
          success: "Listings bought",
          error: "Error buying listings",
        },
      )
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
        console.error(error.message)
      }
    }
  }, [selectedPurchasableListings, buyNowListings])

  const handleBuyNowFloor = useCallback(async () => {
    if (!floorItem.data.id) return
    try {
      await toast.promise(buyNowListings.mutateAsync({ listingIds: [floorItem.data.id] }), {
        pending: "Buying listings...",
        success: "Listings bought",
        error: "Error buying listings",
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
        console.error(error.message)
      }
    }
  }, [floorItem.data.id, buyNowListings])

  useEffect(() => {
    if (selectedTab === "items") {
      void infiniteFilteredListingsByName.refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderBy, selectedTab])

  const handleFilterChange = (filter: typeof selectedFilter) => {
    setIsFilterOpen(false)
    setSelectedFilter(filter)
    setOrderBy(filter.value)
  }

  const handleSweepChange = (value: number[]) => {
    const desiredCount = Math.max(0, Number(value?.[0] ?? 0))
    const purchasable = listingsToShow.filter((l) => l.sellerEmail !== session?.user.email)
    const boundedCount = Math.min(desiredCount, purchasable.length)
    const targetIds = new Set(purchasable.slice(0, boundedCount).map((l) => l.id))

    setSelectedListings((prev) => {
      const nextSet = new Set(prev)
      purchasable.slice(0, boundedCount).forEach((item) => !nextSet.has(item.id) && nextSet.add(item.id))
      prev.forEach((id) => !targetIds.has(id) && nextSet.delete(id))
      return Array.from(nextSet)
    })

    setSweepValue([boundedCount])
  }

  const handleListingPress = useCallback(
    (listingId: string, isOwned: boolean) => {
      if (isOwned) return
      setSelectedListings((prev) => {
        const next = prev.includes(listingId) ? prev.filter((id) => id !== listingId) : [...prev, listingId]
        const nextCount = listingsToShow.filter((l) => next.includes(l.id) && l.sellerEmail !== session?.user.email).length
        setSweepValue([nextCount])
        return next
      })
    },
    [listingsToShow, session?.user, setSweepValue],
  )

  return {
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
  }
}
