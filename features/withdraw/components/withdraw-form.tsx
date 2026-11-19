import type { FarmWithdrawValues } from "@/features/withdraw/hooks/useWithdrawForm"
import React from "react"
import { ActivityIndicator, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Checkbox } from "react-native-paper"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { useWithdrawForm } from "@/features/withdraw/hooks/useWithdrawForm"
import Decimal from "decimal.js"
import { ChevronsUpDown } from "lucide-react-native"
import { Controller } from "react-hook-form"

import type { FarmingInfoStrings } from "@newyolk/types"

import { PaymentMethodModal } from "./payment-method-modal"

const WithdrawForm = ({
  farmingInfo,
  paymentMethods,
  onRefetchingChange,
}: {
  farmingInfo: FarmingInfoStrings | undefined
  paymentMethods: {
    label: string
    value: NonNullable<FarmWithdrawValues["payment_method"]>
  }[]
  onRefetchingChange?: (isRefetching: boolean) => void
}) => {
  const { t, currentLang } = useSafeTranslation
  const COLORS = useThemeColors()

  const styles = React.useMemo(() => createStyles(COLORS, currentLang), [currentLang, COLORS])

  const {
    form,
    errorText,
    successText,
    isPaymentMethodOpen,
    setIsPaymentMethodOpen,
    maxWithdraw,
    paymentMethod,
    checkboxChecked,
    yolkAmountWatched,
    commission,
    onSubmit,
    isSubmitting,
  } = useWithdrawForm(farmingInfo, onRefetchingChange)

  const amountUsd = new Decimal(yolkAmountWatched ? yolkAmountWatched : 0)
    .mul(new Decimal(farmingInfo?.commodityRates.eggToUsd.exchangeRate ?? 0))
    .mul(new Decimal(commission ? 1 - commission / 100 : 1))

  const amountIqd = amountUsd.mul(1480)
  const isSubmitDisabled = !checkboxChecked || isSubmitting || !paymentMethod || !yolkAmountWatched || !form.watch("transactionDetails")

  return (
    <>
      <View>
        {/* Success banner */}
        {Boolean(successText) && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{successText}</Text>
          </View>
        )}

        {/* Error banner */}
        {Boolean(errorText) && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorText}</Text>
          </View>
        )}

        {/* Payment Method */}
        <View>
          <View style={styles.card}>
            <LinearGradient colors={[COLORS.primary[500] + "12", "transparent"]} start={{ x: 0.08, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardSheen} />
            <View pointerEvents="none" style={styles.cardInnerRing} />
            <Text style={styles.label}>{t.Header.withdraw.form.paymentMethod.label}</Text>
            <Pressable style={styles.selector} onPress={() => setIsPaymentMethodOpen(true)} android_ripple={{ color: COLORS.white + "20" }}>
              <Text style={[styles.selectorText, !paymentMethod && styles.placeholderText]}>
                {paymentMethods.find((item) => item.value === paymentMethod)?.label ?? "Select payment method"}
              </Text>
              <ChevronsUpDown size={20} color={COLORS.slate[400]} />
            </Pressable>
          </View>
          <PaymentMethodModal
            visible={isPaymentMethodOpen}
            onClose={() => setIsPaymentMethodOpen(false)}
            paymentMethods={paymentMethods}
            form={form}
            paymentMethod={paymentMethod}
          />
        </View>

        {/* Yolk Amount */}
        <View style={styles.sectionWrapTop}>
          <View style={styles.card}>
            <LinearGradient colors={[COLORS.primary[500] + "12", "transparent"]} start={{ x: 0.08, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardSheen} />
            <View pointerEvents="none" style={styles.cardInnerRing} />
            <View style={styles.labelRow}>
              <Text style={styles.label}>{t.Header.withdraw.form.yolkAmount.label}</Text>
              <Text style={styles.maxBadge}>Max: {maxWithdraw.toFixed(2)}</Text>
            </View>
            <Controller
              control={form.control}
              name="yolkAmount"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  value={String(value ?? "")}
                  onChangeText={(text) => {
                    if (text === "") return onChange("")
                    const dec = new Decimal(text)
                    if (dec.isNaN()) return onChange(value)
                    if (dec.lessThanOrEqualTo(0)) return onChange("1")
                    if (dec.greaterThan(maxWithdraw)) return onChange(maxWithdraw.toString())
                    return onChange(text)
                  }}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={COLORS.zinc[600]}
                  style={styles.input}
                />
              )}
            />
          </View>
        </View>

        {/* Transaction Details */}
        <View style={styles.sectionWrapTop}>
          <View style={styles.card}>
            <LinearGradient colors={[COLORS.primary[500] + "12", "transparent"]} start={{ x: 0.08, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardSheen} />
            <View pointerEvents="none" style={styles.cardInnerRing} />
            <Text style={styles.label}>{t.Header.withdraw.form.transactionDetails.label}</Text>
            <Controller
              control={form.control}
              name="transactionDetails"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  value={value ?? ""}
                  onChangeText={onChange}
                  placeholder={t.Header.withdraw.form.transactionDetails.placeholder}
                  placeholderTextColor={COLORS.zinc[600]}
                  style={[styles.input, styles.textarea]}
                  multiline
                  textAlignVertical="top"
                />
              )}
            />
          </View>
        </View>

        {/* Info + Totals */}
        <View style={styles.sectionWrapTop}>
          <View style={styles.card}>
            <LinearGradient colors={[COLORS.primary[500] + "12", "transparent"]} start={{ x: 0.08, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardSheen} />
            <View pointerEvents="none" style={styles.cardInnerRing} />
            <Text style={styles.label}>{t.Header.withdraw.form.summary.title}</Text>
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t.Header.withdraw.form.summary.commision}</Text>
                <Text style={styles.summaryValue}>{commission}%</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t.Header.withdraw.form.summary.amountIQD}</Text>
                <Text style={styles.summaryValueLarge}>
                  {amountIqd.toNumber().toLocaleString(currentLang, {
                    style: "currency",
                    currency: farmingInfo?.commodityRates.eggToUsd.targetCurrency ?? "USD",
                  })}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t.Header.withdraw.form.summary.amountUSD}</Text>
                <Text style={styles.summaryValueAccent}>
                  {amountUsd.toNumber().toLocaleString(currentLang, {
                    style: "currency",
                    currency: farmingInfo?.commodityRates.eggToUsd.targetCurrency ?? "USD",
                  })}
                </Text>
              </View>
            </View>
            <Text style={styles.infoText}>{t.Header.withdraw.form.info2}</Text>
          </View>
        </View>

        {/* Checkbox */}
        <View style={styles.sectionWrapTop}>
          <View style={styles.checkboxCard}>
            <LinearGradient colors={[COLORS.primary[500] + "10", "transparent"]} start={{ x: 0.08, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardSheen} />
            <View pointerEvents="none" style={styles.cardInnerRing} />
            <Controller
              control={form.control}
              name="checkbox"
              render={({ field: { value, onChange } }) => (
                <Pressable style={styles.checkboxRow} android_ripple={{ color: COLORS.white + "15" }}>
                  <Checkbox status={value ? "checked" : "unchecked"} onPress={() => onChange(!value)} color={COLORS.primary[600]} />
                  <Text style={styles.checkboxLabel}>{t.Header.withdraw.form.checkbox.label}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>

        {/* Success banner */}
        {Boolean(successText) && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{successText}</Text>
          </View>
        )}
        {/* Error banner */}
        {Boolean(errorText) && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorText}</Text>
          </View>
        )}

        {/* Submit */}
        <View style={styles.submitWrap}>
          <View style={styles.submitShell}>
            <LinearGradient colors={[COLORS.primary[500] + "12", "transparent"]} start={{ x: 0.08, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardSheen} />
            <View pointerEvents="none" style={styles.cardInnerRing} />
            <TouchableOpacity onPress={form.handleSubmit(onSubmit)} disabled={isSubmitDisabled} activeOpacity={0.85} style={styles.buttonTouchTarget}>
              <LinearGradient
                colors={isSubmitDisabled ? [COLORS.zinc[800], COLORS.zinc[800]] : [COLORS.primary[500], COLORS.primary[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                <View style={isSubmitting ? styles.rowGap : undefined}>
                  {isSubmitting ? <ActivityIndicator size="small" color={COLORS.white} /> : null}
                  <Text style={styles.submitText}>{t.Header.withdraw.form.button.submit}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  )
}

function createStyles(COLORS: ReturnType<typeof useThemeColors>, currentLang: string) {
  const c = {
    bg: COLORS.zinc[950],
    card: COLORS.zinc[900],
    border: COLORS.zinc[800],
    text: COLORS.white,
    muted: COLORS.zinc[400],
    label: COLORS.zinc[300],
    inputBg: COLORS.black,
    inputBorder: COLORS.zinc[800],
    errorBg: "rgba(127, 29, 29, 0.2)",
    errorBorder: COLORS.danger[500],
    errorText: COLORS.danger[400],
    successBg: "rgba(34, 197, 94, 0.12)",
    successBorder: COLORS.success[600],
    successText: COLORS.success[400],
    overlay: "rgba(0,0,0,0.6)",
    separator: COLORS.zinc[700],
    accent: COLORS.primary[500],
    placeholder: COLORS.zinc[500],
  }

  return StyleSheet.create({
    sectionWrapTop: { marginTop: 16 },
    card: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 24,
      paddingVertical: 20,
      paddingHorizontal: 18,
      borderWidth: 1,
      borderColor: COLORS.white + "0E",
      backgroundColor: "rgba(8, 12, 20, 0.9)",
    },
    checkboxCard: {
      position: "relative",
      borderColor: COLORS.white + "0E",
      borderWidth: 1,
      borderRadius: 24,
      backgroundColor: "rgba(8, 12, 20, 0.9)",
      overflow: "hidden",
      shadowColor: COLORS.black,
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    cardSheen: {
      ...StyleSheet.absoluteFillObject,
    },
    cardInnerRing: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 23,
      borderWidth: 1,
      borderColor: COLORS.white + "05",
      margin: 1,
    },
    label: {
      fontSize: 11,
      color: COLORS.zinc[400],
      marginBottom: 12,
      letterSpacing: 1.4,
      textTransform: "uppercase",
    },
    labelRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    maxBadge: {
      fontSize: 12,
      color: COLORS.primary[300],
      backgroundColor: COLORS.primary[500] + "14",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
    },
    selector: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderColor: COLORS.white + "0B",
      borderWidth: 1,
      borderRadius: 18,
      backgroundColor: COLORS.white + "05",
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    selectorText: {
      color: c.text,
      fontSize: 15,
    },
    placeholderText: {
      color: c.placeholder,
    },
    input: {
      borderColor: COLORS.white + "0B",
      borderWidth: 1,
      borderRadius: 18,
      backgroundColor: COLORS.white + "05",
      color: c.text,
      paddingHorizontal: 16,
      paddingVertical: 16,
      fontSize: 16,
      fontFamily: currentLang === "ar-ae" ? "tajawal" : undefined,
    },
    textarea: {
      height: 120,
      paddingTop: 14,
      fontFamily: currentLang === "ar-ae" ? "tajawal" : undefined,
    },
    summaryBox: {
      borderRadius: 18,
      padding: 16,
      marginTop: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: COLORS.white + "08",
      backgroundColor: COLORS.white + "04",
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
    },
    summaryLabel: {
      fontSize: 14,
      color: c.muted,
    },
    summaryValue: {
      fontSize: 14,
      color: c.text,
    },
    summaryValueLarge: {
      fontSize: 18,
      color: c.text,
    },
    summaryValueAccent: {
      fontSize: 22,
      color: COLORS.primary[300],
    },
    divider: {
      height: 1,
      backgroundColor: c.separator,
      marginVertical: 8,
    },
    infoText: {
      fontSize: 13,
      color: c.muted,
      lineHeight: 18,
    },
    checkboxRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 14,
    },
    checkboxLabel: {
      flex: 1,
      fontSize: 14,
      color: c.text,
      marginLeft: 8,
    },
    submitWrap: {
      marginTop: 24,
      marginBottom: 220,
    },
    submitShell: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.white + "0E",
      backgroundColor: "rgba(8, 12, 20, 0.92)",
      padding: 8,
    },
    buttonTouchTarget: {
      position: "relative",
    },
    button: {
      borderRadius: 18,
      paddingVertical: 18,
      alignItems: "center",
    },
    rowGap: {
      flexDirection: "row",
      alignItems: "center",
      columnGap: 10,
    },
    submitText: {
      color: "white",
      fontSize: 17,
      letterSpacing: 0.8,
    },
    errorBox: {
      marginBottom: 20,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.errorBorder,
      backgroundColor: c.errorBg,
      paddingHorizontal: 16,
      paddingVertical: 14,
      shadowColor: COLORS.black,
      shadowOpacity: 0.1,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    errorText: {
      color: c.errorText,
      fontSize: 14,
      lineHeight: 20,
    },
    successBox: {
      marginBottom: 20,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.successBorder,
      backgroundColor: c.successBg,
      paddingHorizontal: 13,
      paddingVertical: 13,
      shadowColor: COLORS.black,
      shadowOpacity: 0.1,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    successText: {
      color: c.successText,
      fontSize: 15,
      lineHeight: 20,
      textAlign: "center",
    },
  })
}

export default WithdrawForm
