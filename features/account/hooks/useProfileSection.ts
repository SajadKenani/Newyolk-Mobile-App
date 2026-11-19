import React, { useEffect, useState } from "react"
import { useGlobalLoading } from "@/components/global-loading-context"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { api } from "@/config/react-provider"
import type { RouterOutputs } from "@/config/react-provider"
import Decimal from "decimal.js"

import type { Realm } from "@newyolk/db/browser"

export const useProfileSection = (farmingInfo: RouterOutputs["farm"]["myFarmingInfo"] | undefined) => {
  const getInitials = (email: string): string => email.split("@")[0]?.substring(0, 2).toUpperCase() ?? "U"
  const [_, startTransition] = React.useTransition()
  const [, setLanguageVersion] = useState(0)
  const { isLoading, setIsLoading } = useGlobalLoading()
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [selected, setSelected] = useState<string>("")
  const { t } = useSafeTranslation

  useEffect(() => {
    return useSafeTranslation.subscribe(() => {
      setLanguageVersion((currentVersion) => currentVersion + 1)
    })
  }, [])

  const calculateTotalBalance = (): number => {
    if (!farmingInfo?.farm.balance) return 0
    const { usd, yolk, milk, corn, hay } = farmingInfo.farm.balance
    return new Decimal(usd)
      .add(new Decimal(yolk.valueInUsd))
      .add(new Decimal(milk.valueInUsd))
      .add(new Decimal(corn.valueInUsd))
      .add(new Decimal(hay.valueInUsd))
      .toNumber()
  }

  const utils = api.useUtils()
  const selectFarmByRealm = api.user.selectFarmByRealm.useMutation({
    onSuccess: async () => {
      await utils.invalidate()
    },
  })

  const handleRealmChange = (realm: Realm): void => {
    startTransition(async () => {
      try {
        await selectFarmByRealm.mutateAsync({ realm })
      } catch (error) {
        console.error("Error selecting realm", error)
      } finally {
        setIsLoading(false)
      }
    })
  }

  const handleSelect = (option: string): void => {
    setIsVisible(false)
    setIsLoading(true)
    setSelected(option)
    handleRealmChange(option as Realm)
  }

  return {
    t,
    isLoading,
    isVisible,
    setIsVisible,
    selected,
    getInitials,
    calculateTotalBalance,
    handleSelect,
  }
}
