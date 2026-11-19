import type { z } from "zod"
import React from "react"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { api } from "@/config/react-provider"
import { farmWithdrawSchema } from "@/utils/types"
import { zodResolver } from "@hookform/resolvers/zod"
import Decimal from "decimal.js"
import { useForm } from "react-hook-form"

import type { FarmingInfoStrings } from "@newyolk/types"

export type FarmWithdrawValues = z.infer<typeof farmWithdrawSchema>

export const useWithdrawForm = (farmingInfo: FarmingInfoStrings | undefined, setIsRefetching?: (isRefetching: boolean) => void) => {
  const [errorText, setErrorText] = React.useState<string>("")
  const [successText, setSuccessText] = React.useState<string>("")
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { t } = useSafeTranslation
  const utils = api.useUtils()

  const farmWithdraw = api.farm.withdraw.useMutation({
    onSuccess: async (withdraw) => {
      console.log(
        `💸 Withdraw: ${new Decimal(withdraw.valueInUsd).toFixed(2).toString()}$ for ${new Decimal(withdraw.baseAmount).plus(new Decimal(withdraw.comission)).toString()} ${withdraw.baseCurrency.toUpperCase()} 🥚`,
      )
      setErrorText("")
      setIsSubmitting(false)

      if (setIsRefetching) {
        setIsRefetching(true)
      }

      try {
        console.log("🔄 Starting invalidate...")
        await utils.farm.invalidate()
        console.log("✅ Invalidate complete")
      } finally {
        console.log("🔄 Refetch complete")
      }

      const msg = typeof t === "function" ? t("Header.withdraw.form.success") : "Withdraw submitted successfully"
      setSuccessText(msg)
      setTimeout(() => setSuccessText(""), 25000)
    },
    onError: (err) => {
      setErrorText(err?.message ?? "Error while processing withdraw")
      setIsSubmitting(false)
    },
  })

  const maxWithdraw = new Decimal(farmingInfo?.farm.balance.yolk.valueInUsd ?? 0).lessThanOrEqualTo(338)
    ? new Decimal(farmingInfo?.farm.balance.yolk.amount ?? 0).toNumber()
    : new Decimal(338).div(farmingInfo?.commodityRates.eggToUsd.exchangeRate ?? 1).toNumber()

  const form = useForm<FarmWithdrawValues>({
    resolver: zodResolver(farmWithdrawSchema),
    defaultValues: {
      payment_method: "cash_romania",
      yolkAmount: maxWithdraw.toString(),
      transactionDetails: "",
      checkbox: false,
    },
  })

  const paymentMethod = form.watch("payment_method")
  const checkboxChecked = form.watch("checkbox")
  const yolkAmountWatched = form.watch("yolkAmount")
  const commission = paymentMethod === "cash_iraq" || paymentMethod === "cash_romania" ? 0 : 2

  const onSubmit = (input: FarmWithdrawValues) => {
    if (!checkboxChecked || isSubmitting) return
    setErrorText("")
    setSuccessText("")
    setIsSubmitting(true)
    // Ensure required fields are present and not undefined
    farmWithdraw.mutate({
      payment_method: input.payment_method ?? "cash_romania",
      transactionDetails: input.transactionDetails ?? "",
      yolkAmount: new Decimal(input.yolkAmount).toString(),
    })
  }

  return {
    form,
    errorText,
    successText,
    isPaymentMethodOpen,
    setIsPaymentMethodOpen,
    farmWithdraw,
    maxWithdraw,
    paymentMethod,
    checkboxChecked,
    yolkAmountWatched,
    commission,
    onSubmit,
    isSubmitting,
  }
}
