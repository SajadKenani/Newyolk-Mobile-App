import type { BetterAuthSession } from "@/components/types/interface"
import { useEffect, useMemo, useRef, useState } from "react"
import { Alert, Linking, View } from "react-native"
import * as WebBrowser from "expo-web-browser"
import { WebBrowserResultType } from "expo-web-browser"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { api } from "@/config/react-provider"
import type { RouterOutputs } from "@/config/react-provider"
import Decimal from "decimal.js"

import type { PaymentMethod } from "@newyolk/db/browser"

import PricingCard from "./pricing-card"
import { createStyles } from "./styles"

const PricingList: React.FC<{
  store: RouterOutputs["store"]["byNumIds"]
  session: BetterAuthSession | null
  localeExchangeRate: RouterOutputs["exchangeRate"]["byLocale"]
  scrollY: number
  viewportHeight: number
}> = ({ store, session, localeExchangeRate, scrollY, viewportHeight }) => {
  const { currentLang, t } = useSafeTranslation
  const isRTL = useMemo(() => currentLang === "ar" || currentLang === "ar-ae", [currentLang])
  const COLORS = useThemeColors()
  const styles = useMemo(() => createStyles(COLORS), [COLORS])

  const [inputAmounts, setInputAmounts] = useState<number[]>(Array(store.length).fill(1))
  const [isInsured, setIsInsured] = useState<boolean[]>(Array(store.length).fill(false))
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod[]>(Array(store.length).fill("tabadul" as PaymentMethod))
  const [pendingPurchaseIndex, setPendingPurchaseIndex] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({})
  const cardLayouts = useRef<Record<string, { y: number; height: number }>>({})
  const utils = api.useUtils()
  const activeDiscount = api.discount.getActive.useQuery()
  const discount = activeDiscount.data
  const { getCurrentLanguage } = useSafeTranslation

  const payment = api.checkout.payment.useMutation()

  const openPaymentGateway = async (url: string) => {
    try {
      const result = await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        controlsColor: COLORS.primary[500],
        toolbarColor: COLORS.zinc[900],
      })

      if (result.type === WebBrowserResultType.CANCEL || result.type === WebBrowserResultType.DISMISS) {
        console.log("Payment gateway was closed")
      }
    } catch (error) {
      console.error("Error opening payment gateway:", error)
      await Linking.openURL(url)
    }
  }

  const applyDiscount = ({ price }: { price: Decimal }): Decimal => {
    let factor = new Decimal(1)
    if (discount) {
      factor = new Decimal(1).minus(new Decimal(discount.value).div(100))
    }
    return price.mul(factor)
  }

  const handleBuyItem = async (itemIndex: number, storeItem: RouterOutputs["store"]["byNumIds"][0]) => {
    if (!session?.user.id) return Alert.alert("You must be logged in to make a purchase")

    if (pendingPurchaseIndex !== null) {
      return
    }

    try {
      const itemAmount = inputAmounts[itemIndex]
      const paymentMethod = selectedPaymentMethod[itemIndex]
      const insurance = isInsured[itemIndex] ? true : false

      if (!itemAmount) {
        Alert.alert("Please enter a valid amount")
        return
      }

      if (!paymentMethod) {
        Alert.alert("Please select a payment method")
        return
      }

      setPendingPurchaseIndex(itemIndex)

      const response = await payment.mutateAsync({
        itemStoreNumId: storeItem.numId,
        itemAmount,
        isInsured: insurance,
        discountId: discount?.id,
        paymentMethod,
      })

      if (response && response.length > 0) {
        await openPaymentGateway(response)
      } else {
        await utils.farm.invalidate()
        await utils.hen.invalidate()

        if (paymentMethod === "reinvestment") {
          Alert.alert(
            t("Pricing.reinvestmentSuccessTitle", "Success"),
            t("Pricing.reinvestmentSuccessMessage", "Your reinvestment was completed successfully."),
          )
        }
      }

      if (discount) {
        await utils.discount.invalidate()
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error)

        if (selectedPaymentMethod[itemIndex] === "reinvestment") {
          Alert.alert(t("Pricing.reinvestmentFailureTitle", "Failed"), error.message)
        } else {
          Alert.alert("Error", error.message)
        }
      }
    } finally {
      setPendingPurchaseIndex(null)
    }
  }

  const handleInputChange = (itemIndex: number, value: number): void => {
    setInputAmounts((prev) => {
      const next = [...prev]
      next[itemIndex] = value
      return next
    })
  }

  const getItemKey = (item: RouterOutputs["store"]["byNumIds"][0]) => item.id ?? `${item.numId}`

  useEffect(() => {
    if (viewportHeight <= 0) return

    const keysToReveal = Object.entries(cardLayouts.current)
      .filter(([key, layout]) => {
        if (revealedCards[key]) return false

        const triggerOffset = Math.min(layout.height * 0.35, 160)
        const viewportTop = scrollY
        const viewportBottom = scrollY + viewportHeight

        return layout.y < viewportBottom - triggerOffset && layout.y + layout.height > viewportTop + 24
      })
      .map(([key]) => key)

    if (keysToReveal.length === 0) return

    setRevealedCards((prev) => {
      const next = { ...prev }
      for (const key of keysToReveal) {
        next[key] = true
      }
      return next
    })
  }, [scrollY, viewportHeight, revealedCards])

  return (
    <View style={styles.container}>
      {store
        .sort((a, b) => a.numId - b.numId)
        .map((item, itemIndex) => {
          const unitPrice = new Decimal(item.price).div(item.amount)
          const itemKey = getItemKey(item)
          const discountedTotal = applyDiscount({ price: new Decimal(item.price) })
            .add(new Decimal(item.amount).mul(new Decimal(item.insuranceInUsd)).mul(isInsured[itemIndex] ? 1 : 0))
            .mul(inputAmounts[itemIndex] ?? 1)
            .mul(localeExchangeRate.exchangeRate)
            .toNumber()
            .toLocaleString(getCurrentLanguage() === "ar-ae" ? "ar-iq" : getCurrentLanguage(), {
              style: "currency",
              currency: localeExchangeRate.targetCurrency,
            })

          const isOpen = expanded === item.id
          return (
            <View
              key={itemKey}
              onLayout={(event) => {
                const { y, height } = event.nativeEvent.layout
                cardLayouts.current[itemKey] = { y, height }

                if (viewportHeight <= 0 || revealedCards[itemKey]) return

                const triggerOffset = Math.min(height * 0.35, 160)
                if (y < scrollY + viewportHeight - triggerOffset) {
                  setRevealedCards((prev) => ({
                    ...prev,
                    [itemKey]: true,
                  }))
                }
              }}
            >
              <PricingCard
                item={item}
                itemIndex={itemIndex}
                isOpen={isOpen}
                isRTL={isRTL}
                discountedUnit={applyDiscount({ price: unitPrice }).toNumber()}
                discountedTotal={discountedTotal}
                inputAmount={inputAmounts[itemIndex]}
                isInsured={isInsured[itemIndex]}
                selectedPaymentMethod={selectedPaymentMethod[itemIndex] ?? "tabadul"}
                isBuying={pendingPurchaseIndex === itemIndex}
                onExpandToggle={() => setExpanded(isOpen ? null : item.id)}
                onInputChange={handleInputChange}
                onInsuranceToggle={() => {
                  setIsInsured((prev) => {
                    const next = [...prev]
                    next[itemIndex] = !next[itemIndex]
                    return next
                  })
                }}
                onPaymentMethodChange={(method: PaymentMethod) => {
                  setSelectedPaymentMethod((prev) => {
                    const next = [...prev]
                    next[itemIndex] = method
                    return next
                  })
                }}
                onBuyPress={() => handleBuyItem(itemIndex, item)}
                inputAmounts={inputAmounts}
                localeExchangeRate={localeExchangeRate}
                shouldAnimateIn={Boolean(revealedCards[itemKey])}
              />
            </View>
          )
        })}
    </View>
  )
}

export default PricingList
