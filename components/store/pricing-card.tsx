import { useEffect, useMemo, useRef } from "react"
import { ActivityIndicator, Animated, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"
import arAE from "@/messages/data/ar-ae.json"
import arIQ from "@/messages/data/ar-iq.json"
import enUS from "@/messages/data/en-us.json"
import roRO from "@/messages/data/ro-ro.json"
import Decimal from "decimal.js"

import type { RouterOutputs } from "@newyolk/api"
import type { PaymentMethod } from "@newyolk/db/browser"

import Text from "../native/text"
import { createStyles } from "./styles"

const pricingMessagesByLang = {
  "ar-ae": arAE,
  "ar-iq": arIQ,
  "en-us": enUS,
  "ro-ro": roRO,
} as const

const getNestedString = (source: unknown, path: string) => {
  const segments = path.split(".")
  let current: unknown = source

  for (const segment of segments) {
    if (typeof current !== "object" || current === null || !(segment in current)) {
      return undefined
    }

    current = (current as Record<string, unknown>)[segment]
  }

  return typeof current === "string" ? current : undefined
}

const PricingCard: React.FC<{
  item: RouterOutputs["store"]["byNumIds"][0]
  itemIndex: number
  isOpen: boolean
  isRTL: boolean
  discountedUnit: number
  discountedTotal: string
  inputAmount: number | undefined
  isInsured: boolean | undefined
  selectedPaymentMethod: PaymentMethod
  isBuying: boolean
  onExpandToggle: () => void
  onInputChange: (index: number, value: number) => void
  onInsuranceToggle: () => void
  onPaymentMethodChange: (method: PaymentMethod) => void
  onBuyPress: () => void
  inputAmounts: number[]
  localeExchangeRate: RouterOutputs["exchangeRate"]["byLocale"]
  shouldAnimateIn: boolean
}> = ({
  item,
  itemIndex,
  isOpen,
  isRTL,
  discountedUnit,
  discountedTotal,
  inputAmount,
  isInsured,
  selectedPaymentMethod,
  isBuying,
  onExpandToggle: _onExpandToggle,
  onInputChange,
  onInsuranceToggle,
  onPaymentMethodChange,
  onBuyPress,
  inputAmounts,
  localeExchangeRate,
  shouldAnimateIn,
}) => {
  const animatedHeight = useRef(new Animated.Value(0)).current
  const animatedOpacity = useRef(new Animated.Value(0)).current
  const entranceOpacity = useRef(new Animated.Value(0)).current
  const entranceTranslateY = useRef(new Animated.Value(22)).current
  const entranceScale = useRef(new Animated.Value(0.985)).current
  const glowPulse = useRef(new Animated.Value(0.92)).current
  const tabadulScale = useRef(new Animated.Value(1)).current
  const reinvestmentScale = useRef(new Animated.Value(1)).current
  const insuranceScale = useRef(new Animated.Value(1)).current
  const buyButtonScale = useRef(new Animated.Value(1)).current
  // const _expandButtonScale = useRef(new Animated.Value(1)).current
  const expandRotation = useRef(new Animated.Value(isOpen ? 1 : 0)).current
  const hasAnimatedIn = useRef(false)
  const { getCurrentLanguage } = useSafeTranslation
  const COLORS = useThemeColors()
  const styles = useMemo(() => createStyles(COLORS), [COLORS])
  const textAlign = isRTL ? "right" : "left"
  const currentLanguage = getCurrentLanguage()
  const locale = currentLanguage === "ar-ae" ? "ar-iq" : currentLanguage
  const localeMessages = pricingMessagesByLang[currentLanguage] ?? enUS
  const pricingRealmKey = item.realm === "Romania" ? "romania" : "iraq"
  const translationItemKey = item.realm === "Romania" ? String(item.numId) : String(Math.max(Number(item.numId) - 101, 1))
  const getLocalizedText = (path: string, fallback = "") => getNestedString(localeMessages, path) ?? fallback
  const getPackText = (field: "name" | "description" | "features") => {
    const pricingValue = getLocalizedText(`Pricing.${pricingRealmKey}.${translationItemKey}.${field}`)

    if (pricingValue) {
      return pricingValue
    }

    const storeValue = getLocalizedText(`Store.items.${pricingRealmKey}.${translationItemKey}.${field}`)

    if (storeValue) {
      return storeValue
    }

    return ""
  }
  // const packageHighlightLabel = getLocalizedText("Pricing.packageHighlight", "Package Highlight")
  const notAvailableLabel = getLocalizedText("Pricing.notAvailable", "Not Available")
  const cardLabel = getLocalizedText("Store.card", "Card")
  const reinvestLabel = getLocalizedText("Store.reinvest", "Reinvest")
  const addInsuranceLabel = getLocalizedText("Store.addInsurance", "Add Insurance")
  const insuredLabel = getLocalizedText("Store.insured", "Insured")
  const buyLabel = getLocalizedText("Pricing.buy", "Purchase")
  const inactiveLabel = getLocalizedText("Pricing.inactive", "Inactive")
  const processingLabel = getLocalizedText("Pricing.buttons.processing", "Processing...")
  const featureStr = getPackText("features")
  const features = featureStr
    ? featureStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : []
  const featurePreview = features.slice(1, 2)
  const packageName = getPackText("name")
  const packageDescription = getPackText("description")
  const localizedUnitPrice = new Decimal(discountedUnit).mul(localeExchangeRate.exchangeRate).toNumber().toLocaleString(locale, {
    style: "currency",
    currency: localeExchangeRate.targetCurrency,
  })
  const insuranceTotal = new Decimal(item.amount)
    .mul(item.insuranceInUsd)
    .mul(inputAmounts[itemIndex] ?? 1)
    .mul(localeExchangeRate.exchangeRate)
    .toNumber()
    .toLocaleString(locale, {
      style: "currency",
      currency: localeExchangeRate.targetCurrency,
    })

  const animatePressScale = (value: Animated.Value, toValue: number) => {
    Animated.spring(value, {
      toValue,
      tension: 220,
      friction: 18,
      useNativeDriver: true,
    }).start()
  }

  // const _expandIconRotation = expandRotation.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ["0deg", "45deg"],
  // })

  // const _detailTranslateY = animatedHeight.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [-10, 0],
  // })

  const pricePanelTranslateX = entranceTranslateY.interpolate({
    inputRange: [0, 22],
    outputRange: [0, isRTL ? -10 : 10],
  })

  const headerCopyTranslateX = entranceTranslateY.interpolate({
    inputRange: [0, 22],
    outputRange: [0, isRTL ? 8 : -8],
  })

  useEffect(() => {
    if (!shouldAnimateIn || hasAnimatedIn.current) return

    hasAnimatedIn.current = true

    const entranceAnimation = Animated.parallel([
      Animated.timing(entranceOpacity, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.spring(entranceTranslateY, {
        toValue: 0,
        tension: 72,
        friction: 11,
        useNativeDriver: true,
      }),
      Animated.spring(entranceScale, {
        toValue: 1,
        tension: 90,
        friction: 12,
        useNativeDriver: true,
      }),
    ])

    entranceAnimation.start()

    return () => {
      entranceAnimation.stop()
    }
  }, [entranceOpacity, entranceScale, entranceTranslateY, shouldAnimateIn])

  useEffect(() => {
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1.06,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.92,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]),
    )

    glowAnimation.start()

    return () => {
      glowAnimation.stop()
    }
  }, [glowPulse])

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.spring(expandRotation, {
          toValue: 1,
          tension: 140,
          friction: 14,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.spring(expandRotation, {
          toValue: 0,
          tension: 140,
          friction: 14,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isOpen, animatedHeight, animatedOpacity, expandRotation])

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: entranceOpacity,
          transform: [{ translateY: entranceTranslateY }, { scale: entranceScale }],
        },
      ]}
    >
      <LinearGradient
        colors={[COLORS.black + "FC", COLORS.zinc[950] + "F4", COLORS.slate[950] + "EE"]}
        start={{ x: isRTL ? 1 : 0, y: 0 }}
        end={{ x: isRTL ? 0 : 1, y: 1 }}
        style={styles.gradientBackground}
      />
      <Animated.View style={{ transform: [{ scale: glowPulse }], opacity: entranceOpacity.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) }}>
        <LinearGradient
          colors={[COLORS.amber[400] + "20", COLORS.amber.yellow500 + "08", "transparent"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0.25, y: 0.8 }}
          style={styles.glowBackground}
        />
      </Animated.View>
      <View style={styles.cardContent}>
        <View style={[styles.header, isRTL && styles.headerRTL]}>
          <Animated.View style={[styles.headerCopy, { transform: [{ translateX: headerCopyTranslateX }] }]}>
            <View style={[styles.badgesContainer, isRTL && styles.badgesContainerRTL]}>
              {/* {itemIndex === 0 && !item.isSoldOut && item.active && (
                <View style={styles.badgeLead}>
                  <Text style={styles.badgeTextLead}>{packageHighlightLabel}</Text>
                </View>
              )} */}
              {item.isSoldOut && (
                <View style={styles.badgeSoldOut}>
                  <Text style={styles.badgeTextSoldOut}>{notAvailableLabel}</Text>
                </View>
              )}
              {!item.isSoldOut && !item.active && (
                <View style={styles.badgeInactive}>
                  <Text style={styles.badgeTextInactive}>{inactiveLabel}</Text>
                </View>
              )}
            </View>

            <Text style={[styles.itemName, { textAlign }]}>{packageName}</Text>
            <Text style={[styles.metaText, { textAlign }]}>{packageDescription}</Text>

            {featurePreview.length > 0 && (
              <View style={[styles.featurePreviewRow, isRTL && styles.featurePreviewRowRTL]}>
                {featurePreview.map((feature) => (
                  <View key={`${item.id ?? item.numId}-${feature}`} style={styles.featurePreviewPill}>
                    <Text style={styles.featurePreviewText}>{feature}</Text>
                  </View>
                ))}
              </View>
            )}
          </Animated.View>

          <Animated.View style={[styles.pricePanel, isRTL && styles.pricePanelRTL, { transform: [{ translateX: pricePanelTranslateX }] }]}>
            <Text style={styles.priceText}>{localizedUnitPrice}</Text>
          </Animated.View>
        </View>

        <View style={[styles.paymentSection, isRTL && styles.paymentSectionRTL]}>
          <Animated.View style={[styles.paymentChipWrapper, { transform: [{ scale: tabadulScale }] }]}>
            <TouchableOpacity
              style={[styles.paymentChip, selectedPaymentMethod === "tabadul" && styles.paymentChipSelected]}
              onPress={() => onPaymentMethodChange("tabadul" as PaymentMethod)}
              disabled={isBuying}
              onPressIn={() => animatePressScale(tabadulScale, 0.97)}
              onPressOut={() => animatePressScale(tabadulScale, 1)}
              activeOpacity={0.92}
            >
              <Text style={[styles.paymentChipText, selectedPaymentMethod === "tabadul" && styles.paymentChipTextSelected]}>{cardLabel}</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[styles.paymentChipWrapper, { transform: [{ scale: reinvestmentScale }] }]}>
            <TouchableOpacity
              style={[styles.paymentChip, selectedPaymentMethod === "reinvestment" && styles.paymentChipSelected]}
              onPress={() => onPaymentMethodChange("reinvestment" as PaymentMethod)}
              disabled={isBuying}
              onPressIn={() => animatePressScale(reinvestmentScale, 0.97)}
              onPressOut={() => animatePressScale(reinvestmentScale, 1)}
              activeOpacity={0.92}
            >
              <Text style={[styles.paymentChipText, selectedPaymentMethod === "reinvestment" && styles.paymentChipTextSelected]}>{reinvestLabel}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => {
                if (inputAmount) if (inputAmount > 1) onInputChange(itemIndex, inputAmount - 1)
              }}
              disabled={isBuying}
              activeOpacity={0.7}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <TextInput
              value={String(inputAmount)}
              onChangeText={(txt) => !Number.isNaN(parseInt(txt, 10)) && onInputChange(itemIndex, parseInt(txt, 10))}
              keyboardType="number-pad"
              mode="outlined"
              editable={!isBuying}
              style={styles.quantityInput}
              outlineStyle={styles.quantityInputOutline}
              theme={{
                colors: {
                  text: COLORS.zinc[50],
                  placeholder: COLORS.zinc[400],
                  primary: COLORS.primary[500],
                  background: COLORS.zinc[950],
                },
              }}
            />
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => {
                if (inputAmount) onInputChange(itemIndex, inputAmount + 1)
              }}
              disabled={isBuying}
              activeOpacity={0.7}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <Animated.View style={{ transform: [{ scale: insuranceScale }] }}>
            <TouchableOpacity
              style={[styles.insuranceButton, isInsured && styles.insuranceButtonActive]}
              onPress={onInsuranceToggle}
              disabled={isBuying}
              onPressIn={() => animatePressScale(insuranceScale, 0.985)}
              onPressOut={() => animatePressScale(insuranceScale, 1)}
              activeOpacity={0.92}
            >
              <View style={styles.insuranceContent}>
                <Text style={[styles.insuranceTitle, isInsured && styles.insuranceTitleActive]}>{isInsured ? insuredLabel : addInsuranceLabel}</Text>
                <Text style={[styles.insuranceValue, isInsured && styles.insuranceValueActive]}>{insuranceTotal}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Animated.View style={{ transform: [{ scale: buyButtonScale }] }}>
          <TouchableOpacity
            style={[styles.buyButton, isBuying && styles.buyButtonDisabled]}
            onPress={onBuyPress}
            disabled={isBuying}
            onPressIn={() => animatePressScale(buyButtonScale, 0.985)}
            onPressOut={() => animatePressScale(buyButtonScale, 1)}
            activeOpacity={0.96}
          >
            <LinearGradient
              colors={[COLORS.amber.yellow500, COLORS.amber[400], COLORS.amber[500]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buyButtonGradient}
            >
              {isBuying ? (
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <ActivityIndicator color={COLORS.black} size="small" />
                  <Text style={styles.buyButtonText}>{processingLabel}</Text>
                </View>
              ) : (
                <Text style={styles.buyButtonText}>
                  {buyLabel} • {discountedTotal}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* <View style={styles.expandableSection}>
          <Animated.View style={{ transform: [{ scale: expandButtonScale }] }}>
            <TouchableOpacity
              style={styles.expandButton}
              onPress={onExpandToggle}
              onPressIn={() => animatePressScale(expandButtonScale, 0.99)}
              onPressOut={() => animatePressScale(expandButtonScale, 1)}
              activeOpacity={0.9}
            >
              <Text style={styles.expandButtonText}>{packageHighlightLabel}</Text>
              <Animated.Text style={[styles.expandIcon, { transform: [{ rotate: expandIconRotation }] }]}>+</Animated.Text>
            </TouchableOpacity>
          </Animated.View>

          {isOpen && (
            <Animated.View
              style={[
                styles.expandedContent,
                {
                  maxHeight: animatedHeight.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 500],
                  }),
                  opacity: animatedOpacity,
                  transform: [{ translateY: detailTranslateY }],
                },
              ]}
            >
              <View style={styles.detailSection}>
                <View style={styles.bonusListContainer}>
                  {features.map((feature, idx) => (
                    <View key={`${item.id ?? item.numId}-feature-${idx}`} style={[styles.bonusItem, idx === features.length - 1 && styles.bonusItemLast]}>
                      <View style={styles.bonusIconContainer}>
                        <View style={styles.bonusIcon} />
                      </View>
                      <View style={styles.bonusContent}>
                        <Text style={styles.bonusItemText}>{feature}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </Animated.View>
          )}
        </View> */}
      </View>
    </Animated.View>
  )
}

export default PricingCard
