import React from "react"
import { I18nManager, Image, ScrollView, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { Button } from "react-native-paper"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { api } from "@/config/react-provider"
import { getGiftImageSource } from "@/utils/local-asset-image"

import { giftCarouselStyles } from "../utils/styles"

interface GiftOutcome {
  amount: number
  item: string
  text: string
  valueInYolk: string
  probability: number
  image: string
  href: string
}

type GiftOutcomes = GiftOutcome[]

const isGiftOutcome = (value: unknown): value is GiftOutcome => {
  if (typeof value !== "object" || value === null) return false

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.amount === "number" &&
    typeof candidate.item === "string" &&
    typeof candidate.text === "string" &&
    typeof candidate.valueInYolk === "string" &&
    typeof candidate.probability === "number" &&
    typeof candidate.image === "string" &&
    typeof candidate.href === "string"
  )
}

const GiftCarousel = () => {
  const { width } = useWindowDimensions()
  const PAGE_WIDTH = width - 140
  const { t } = useSafeTranslation
  const COLORS = useThemeColors()
  const isRTL = I18nManager.isRTL

  const [isRedeemed, setIsRedeemed] = React.useState(false)
  const [showTryAgain, setShowTryAgain] = React.useState(false)
  const scrollRef = React.useRef<ScrollView>(null)
  const indexRef = React.useRef(0)
  const rollTimer = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const utils = api.useUtils()
  const currentFarmingCondition = api.farmingCondition.getCurrent.useQuery()
  const outcomes = React.useMemo<GiftOutcomes>(() => {
    const rawFarmingCondition: unknown = currentFarmingCondition.data

    if (typeof rawFarmingCondition !== "object" || rawFarmingCondition === null || !("giftOutcomes" in rawFarmingCondition)) {
      return []
    }

    const { giftOutcomes } = rawFarmingCondition as { giftOutcomes?: unknown }
    if (!Array.isArray(giftOutcomes)) return []

    const outcomeList = giftOutcomes as unknown[]
    return outcomeList.filter(isGiftOutcome)
  }, [currentFarmingCondition.data])

  const createGift = api.gift.create.useMutation({
    onSuccess: async () => await utils.farm.myFarmingInfo.invalidate(),
  })

  const scrollToIndex = (idx: number) => {
    indexRef.current = idx
    scrollRef.current?.scrollTo({ x: idx * PAGE_WIDTH, animated: true })
  }

  const startRolling = () => {
    if (rollTimer.current) {
      clearInterval(rollTimer.current)
    }
    rollTimer.current = setInterval(() => {
      const next = (indexRef.current + 1) % Math.max(1, outcomes.length)
      scrollToIndex(next)
    }, 120)
  }

  const stopRolling = () => {
    if (rollTimer.current) {
      clearInterval(rollTimer.current)
      rollTimer.current = null
    }
  }

  React.useEffect(() => {
    return () => {
      if (rollTimer.current) {
        clearInterval(rollTimer.current)
        rollTimer.current = null
      }
    }
  }, [])

  const handleRedeem = async () => {
    if (createGift.isPending) return
    setShowTryAgain(false)
    setIsRedeemed(true)
    startRolling()

    const start = Date.now()
    try {
      const gift = await createGift.mutateAsync()
      const giftText = (() => {
        if (typeof gift === "object" && gift !== null && "text" in gift) {
          const maybeText = (gift as { text?: unknown }).text
          return typeof maybeText === "string" ? maybeText : undefined
        }
        return undefined
      })()
      const duration = Date.now() - start
      const delay = Math.max(2000 - duration, 0)
      setTimeout(() => {
        stopRolling()
        const outcomeIndex = giftText ? outcomes.findIndex((o) => o.text === giftText) : -1
        if (outcomeIndex >= 0) {
          scrollToIndex(outcomeIndex)
          setShowTryAgain(true)
        } else {
          scrollToIndex(0)
          setIsRedeemed(false)
        }
      }, delay)
    } catch (_e) {
      stopRolling()
      scrollToIndex(0)
      setIsRedeemed(false)
    }
  }

  return (
    <View style={[giftCarouselStyles.container, { height: isRedeemed ? 400 : 650 }]}>
      <ScrollView ref={scrollRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: "center" }}>
        {!isRedeemed && (
          <View style={[giftCarouselStyles.page, { width: PAGE_WIDTH }]}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleRedeem}>
              <Image
                source={getGiftImageSource()}
                style={[giftCarouselStyles.image, { width: PAGE_WIDTH - 48, height: PAGE_WIDTH - 48, borderColor: "#252134" }]}
              />
            </TouchableOpacity>
            <View style={giftCarouselStyles.caption}>
              <Text style={[giftCarouselStyles.captionText, { textAlign: isRTL ? "right" : "center", color: COLORS.white }]}>
                {String(t.Farm.gift.carousel.click)}
                {"\n"}
                {String(t.Farm.gift.carousel.description)}
              </Text>
            </View>
            {(() => {
              const elements: React.ReactNode[] = []
              const list = t.Farm.gift.carousel.uniqueOutcomes as unknown as readonly string[]
              for (let i = 1; i < 12; i++) {
                elements.push(
                  <Text key={i} style={[giftCarouselStyles.captionText, { textAlign: isRTL ? "right" : "center", color: COLORS.white }]}>
                    {list[i]}
                  </Text>,
                )
              }
              return elements
            })()}
          </View>
        )}
        {isRedeemed &&
          outcomes.map((_, idx) => {
            return (
              <View key={idx} style={[giftCarouselStyles.page, { width: PAGE_WIDTH }]}>
                <Image
                  source={getGiftImageSource()}
                  style={[giftCarouselStyles.image, { width: PAGE_WIDTH - 48, height: PAGE_WIDTH - 48, borderColor: "#252134" }]}
                />
              </View>
            )
          })}
      </ScrollView>

      {showTryAgain && (
        <Button mode="contained" onPress={handleRedeem} style={giftCarouselStyles.tryAgain}>
          <Text> {String(t.Farm.gift.carousel.tryAgain)}</Text>
        </Button>
      )}
      {!isRedeemed && (
        <Button mode="contained" onPress={handleRedeem} style={giftCarouselStyles.openButton}>
          <Text> {String(t.Farm.gift.carousel.openShort)}</Text>
        </Button>
      )}
    </View>
  )
}

export default GiftCarousel
