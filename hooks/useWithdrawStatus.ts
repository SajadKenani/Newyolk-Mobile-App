import { useEffect } from "react"
import { authClient } from "@/auth"
import { api } from "@/config/react-provider"

import type { FarmingInfoStrings } from "@newyolk/types"

import type { FarmWithdrawValues } from "@/features/withdraw/hooks/useWithdrawForm"

export const useWithdrawStatus = (setIsRefetching?: (isRefetching: boolean) => void) => {
  const { data: session } = authClient.useSession()
  const farmingInfo = api.farm.myFarmingInfo.useQuery(undefined, {
    enabled: !!session?.user?.id,
    initialData: undefined as FarmingInfoStrings | undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  useEffect(() => {
    if (setIsRefetching) {
      setIsRefetching(farmingInfo.isLoading || farmingInfo.isFetching)
    }
  }, [farmingInfo.isLoading, farmingInfo.isFetching, setIsRefetching])

  const paymentMethodsWithdraw: { label: string; value: NonNullable<FarmWithdrawValues["payment_method"]> }[] = []

  const isFibAvailable = farmingInfo.data?.farm.withdrawsUser.latestFib === null || farmingInfo.data?.farm.withdrawsUser.latestFib.status === "completed"
  const isCashAvailable = farmingInfo.data?.farm.withdrawsUser.latestCash === null || farmingInfo.data?.farm.withdrawsUser.latestCash.status === "completed"

  const areBothPending =
    farmingInfo.data?.farm.withdrawsUser.latestFib?.status === "pendingApproval" &&
    farmingInfo.data?.farm.withdrawsUser.latestCash?.status === "pendingApproval"

  const areBothCompleted =
    farmingInfo.data?.farm.withdrawsUser.latestFib?.status === "completed" && farmingInfo.data?.farm.withdrawsUser.latestCash?.status === "completed"

  if (isFibAvailable) paymentMethodsWithdraw.push({ label: "FIB", value: "fib" })
  if (isCashAvailable) paymentMethodsWithdraw.push({ label: "Cash Iraq", value: "cash_iraq" }, { label: "Cash Romania", value: "cash_romania" })

  return {
    farmingInfo,
    paymentMethodsWithdraw,
    areBothPending,
    areBothCompleted,
  }
}
