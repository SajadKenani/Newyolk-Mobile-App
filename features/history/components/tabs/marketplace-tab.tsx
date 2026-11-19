import { useState } from "react"
import { View } from "react-native"

import type { RouterOutputs } from "@newyolk/api"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { api } from "@/config/react-provider"
import { createMarketplaceStyles } from "../utils/style"
import { ContentPanel, SubTabSelect } from "../utils/helpers"
import type { SubTab } from "../utils/types"
import { useThemeColors } from "@/config/colors"

export const MarketplaceTab = ({
  initialMarketplaceSold,
  initialMarketplacePurchased,
}: {
  initialMarketplaceSold: RouterOutputs["history"]["marketplaceSold"]
  initialMarketplacePurchased: RouterOutputs["history"]["marketplacePurchased"]
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("sold")
  const [soldCursor, setSoldCursor] = useState<number | undefined>(undefined)
  const [purchasedCursor, setPurchasedCursor] = useState<number | undefined>(undefined)
  const { t } = useSafeTranslation

  const C = useThemeColors()
  const styles = createMarketplaceStyles(C)

  const { data: soldData, isLoading: soldLoading } = api.history.marketplaceSold.useQuery(
    { cursor: soldCursor, limit: 20 },
    {
      enabled: activeSubTab === "sold",
      initialData: soldCursor === undefined && activeSubTab === "sold" ? initialMarketplaceSold : undefined,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  )

  const { data: purchasedData, isLoading: purchasedLoading } = api.history.marketplacePurchased.useQuery(
    { cursor: purchasedCursor, limit: 20 },
    {
      enabled: activeSubTab === "purchased",
      initialData: purchasedCursor === undefined && activeSubTab === "purchased" ? initialMarketplacePurchased : undefined,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  )

  const subTabOptions: { value: SubTab; label: string }[] = [
    { value: "sold", label: t("AccountHistory.marketplace.tabs.sold") },
    { value: "purchased", label: t("AccountHistory.marketplace.tabs.purchased") },
  ]

  return (
    <View style={styles.container}>
      <SubTabSelect value={activeSubTab} options={subTabOptions} onChange={setActiveSubTab} />

      {/* Active panel */}
      {activeSubTab === "sold" ? (
        <ContentPanel
          data={soldData}
          isLoading={soldLoading}
          cursor={soldCursor}
          handlePrevious={() => setSoldCursor(undefined)}
          handleNext={() => {
            if (soldData?.nextCursor) setSoldCursor(soldData.nextCursor)
          }}
        />
      ) : (
        <ContentPanel
          data={purchasedData}
          isLoading={purchasedLoading}
          cursor={purchasedCursor}
          handlePrevious={() => setPurchasedCursor(undefined)}
          handleNext={() => {
            if (purchasedData?.nextCursor) setPurchasedCursor(purchasedData.nextCursor)
          }}
        />
      )}
    </View>
  )
}
