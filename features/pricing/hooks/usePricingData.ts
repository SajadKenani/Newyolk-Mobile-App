import type { FarmInfo } from "@/features/pricing/types"
import type { StoreItemTranslation } from "@/messages/types"
import { authClient } from "@/auth/client"
import { api } from "@/config/react-provider"
import type { RouterOutputs } from "@/config/react-provider"

import type { Realm } from "@newyolk/db"

import { useSafeTranslation } from "@/hooks/safe-translation"

const hasCommodityRates = (farmInfo: FarmInfo | undefined): boolean => Boolean(farmInfo?.commodityRates?.cornToUsd?.realm)
const determineRealm = (farmInfo: RouterOutputs["farm"]["myFarmingInfo"] | undefined): Realm =>
  farmInfo && hasCommodityRates(farmInfo) ? (farmInfo.commodityRates.cornToUsd.realm === "Romania" ? "Romania" : "Iraq") : "Romania"

export const usePricingData = () => {
  const { get, getCurrentLanguage } = useSafeTranslation

  const { data: session, isPending } = authClient.useSession()

  const user = api.user.me.useQuery(undefined, {
    enabled: !!session && !isPending,
  })
  const { data: farmInfo, isLoading: isFarmLoading } = api.farm.myFarmingInfo.useQuery(undefined, {
    enabled: !!user,
  })

  const activeDiscount = api.discount.getActive.useQuery()
  const discount = activeDiscount.data

  const { data: localeExchangeRate }: { data: RouterOutputs["exchangeRate"]["byLocale"] | undefined } = api.exchangeRate.byLocale.useQuery({
    locale: getCurrentLanguage() === "ar-ae" ? "ar-iq" : getCurrentLanguage(),
  })

  const realm = determineRealm(farmInfo)
  const raw = get(`Store.items.${realm === "Romania" ? "romania" : "iraq"}`)
  let tPricing: StoreItemTranslation[] = []
  if (Array.isArray(raw)) {
    tPricing = raw as StoreItemTranslation[]
  } else if (raw && typeof raw === "object") {
    const dict = raw as Record<string, StoreItemTranslation>
    tPricing = Object.values(dict)
  }

  const numIds = tPricing.map(({ numId }) => Number(numId))
  const { data: store, isLoading: isStoreLoading } = api.store.byNumIds.useQuery(numIds)

  return {
    isLoading: isFarmLoading || isStoreLoading,
    store: store ?? [],
    sessionRealm: realm,
    localeExchangeRate,
    discount,
  }
}
