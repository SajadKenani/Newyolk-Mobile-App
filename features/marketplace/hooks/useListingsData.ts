import { useLocalSearchParams } from "expo-router"
import { getTranslationsAssets } from "@/messages/getTranslations"
import { api } from "@/config/react-provider"

import type { CattleState, HenState } from "@newyolk/db/browser"

export const useListingsData = (propsCollectionName?: string) => {
  const { collectionName: paramsCollectionName, orderBy: paramsOrderBy } = useLocalSearchParams<{ collectionName?: string; orderBy?: string }>()
  const collectionName = propsCollectionName ?? paramsCollectionName
  const decodedCollectionName = decodeURIComponent(collectionName ?? "").replace(/\/$/, "") as HenState | CattleState
  const orderByFilter = getTranslationsAssets().Marketplace.listingFilters.find((filter) => filter.value === paramsOrderBy)

  const initialCollection = api.collection.byName.useQuery(
    { name: decodedCollectionName, isTrading: true },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  )

  const initialFilteredListings = api.listing.infiniteFilteredListingsByName.useQuery({
    where: {
      active: true,
      hasSold: false,
      name: decodedCollectionName,
    },
    orderBy: orderByFilter?.orderBy ?? {
      buyNowPrice: "asc",
    },
    limit: 100,
    direction: "forward",
  })

  const initialSoldListings = api.listing.infiniteSoldListingsByName.useQuery({
    name: decodedCollectionName,
    hasSold: true,
    limit: 50,
    direction: "forward",
  })

  const initialFloorItem = api.listing.floorItemByName.useQuery({
    name: decodedCollectionName,
  })

  return {
    initialCollection,
    initialFilteredListings,
    initialSoldListings,
    initialFloorItem,
  }
}
