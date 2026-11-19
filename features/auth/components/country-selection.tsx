import type * as z from "zod"
import { useEffect, useMemo, useState } from "react"
import { ScrollView, TextInput, TouchableOpacity, View, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Dialog, Portal, RadioButton } from "react-native-paper"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"

import type { signupSchema } from "@newyolk/validators"

import Text from "@/components/native/text"
import { COUNTRIES } from "./countries"

type Country = (typeof COUNTRIES)[number]

type SignupFormValues = z.infer<typeof signupSchema>

interface CountrySelectionProps {
  countryDialogVisible: boolean
  filteredCountries: Country[]
  setCountryDialogVisible: (visible: boolean) => void
  countryQuery: string
  setCountryQuery: (query: string) => void
  userData: SignupFormValues
  setUserData: (userData: SignupFormValues) => void
  errorMessage: SignupFormValues
  setError: (error: SignupFormValues) => void
}

const CountrySelection: React.FC<CountrySelectionProps> = ({
  countryDialogVisible,
  filteredCountries,
  setCountryDialogVisible,
  countryQuery,
  setCountryQuery,
  userData,
  setUserData,
  errorMessage,
  setError,
}) => {
  const { currentLang, t } = useSafeTranslation
  const COLORS = useThemeColors()
  const [selectedCountryIso, setSelectedCountryIso] = useState("")

  useEffect(() => {
    if (!countryDialogVisible) return

    const selectedCountry = COUNTRIES.find((country) => {
      const countryName = currentLang === "ar-ae" ? country.nameAr : country.name
      return countryName === userData.countryName || country.dialCode === userData.countryCode
    })

    setSelectedCountryIso(selectedCountry?.iso2 ?? "")
  }, [countryDialogVisible, currentLang, userData.countryCode, userData.countryName])

  const styles = useMemo(
    () =>
      StyleSheet.create({
        dialog: {
          borderRadius: 30,
          overflow: "hidden",
          backgroundColor: "rgba(8, 12, 20, 0.98)",
          borderWidth: 1,
          borderColor: COLORS.white + "10",
        },
        panel: {
          position: "relative",
          overflow: "hidden",
          backgroundColor: "rgba(8, 12, 20, 0.98)",
        },
        panelSheen: {
          ...StyleSheet.absoluteFillObject,
        },
        orb: {
          position: "absolute",
          top: -36,
          right: -18,
          width: 132,
          height: 132,
          borderRadius: 999,
          backgroundColor: COLORS.primary[500] + "18",
        },
        innerRing: {
          ...StyleSheet.absoluteFillObject,
          borderRadius: 29,
          borderWidth: 1,
          borderColor: COLORS.white + "05",
          margin: 1,
        },
        titleWrap: {
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 0,
        },
        title: {
          color: COLORS.white,
          fontSize: 24,
          lineHeight: 28,
        },
        content: {
          paddingHorizontal: 24,
          paddingTop: 14,
          paddingBottom: 8,
        },
        inputContainer: {
          marginBottom: 14,
        },
        textInput: {
          borderColor: COLORS.white + "0C",
          backgroundColor: COLORS.white + "04",
          paddingHorizontal: 16,
          paddingVertical: 14,
          color: COLORS.white,
          width: "100%",
          borderRadius: 18,
          borderWidth: 1,
          fontSize: 16,
        },
        optionsScroll: {
          maxHeight: 360,
        },
        optionsGroup: {
          gap: 12,
        },
        optionCard: {
          position: "relative",
          overflow: "hidden",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: COLORS.white + "0C",
          backgroundColor: COLORS.white + "04",
          paddingHorizontal: 16,
          paddingVertical: 15,
        },
        optionCardActive: {
          borderColor: COLORS.primary[400] + "44",
          backgroundColor: COLORS.primary[500] + "10",
        },
        optionRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        },
        radioWrap: {
          width: 42,
          height: 42,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.white + "06",
          borderWidth: 1,
          borderColor: COLORS.white + "08",
        },
        optionCopy: {
          flex: 1,
        },
        countryText: {
          color: COLORS.white,
          fontSize: 16,
        },
        countryMeta: {
          color: COLORS.zinc[400],
          fontSize: 13,
          marginTop: 4,
        },
        optionBadge: {
          minWidth: 56,
          paddingHorizontal: 10,
          paddingVertical: 7,
          borderRadius: 999,
          alignItems: "center",
          backgroundColor: COLORS.white + "06",
          borderWidth: 1,
          borderColor: COLORS.white + "08",
        },
        optionBadgeActive: {
          backgroundColor: COLORS.primary[500] + "18",
          borderColor: COLORS.primary[400] + "30",
        },
        optionBadgeText: {
          color: COLORS.zinc[300],
          fontSize: 11,
          letterSpacing: 0.8,
        },
        optionBadgeTextActive: {
          color: COLORS.primary[200],
        },
        actions: {
          flexDirection: "row",
          gap: 10,
          paddingHorizontal: 24,
          paddingTop: 6,
          paddingBottom: 24,
        },
        secondaryAction: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: COLORS.white + "0C",
          backgroundColor: COLORS.white + "04",
          paddingVertical: 14,
        },
        secondaryActionText: {
          color: COLORS.white,
          fontSize: 14,
        },
        primaryAction: {
          flex: 1,
          borderRadius: 16,
          overflow: "hidden",
        },
        primaryGradient: {
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 15,
        },
        primaryActionText: {
          color: COLORS.white,
          fontSize: 14,
        },
      }),
    [COLORS],
  )

  const handleApplyCountry = () => {
    const found = COUNTRIES.find((country) => country.iso2 === selectedCountryIso)

    if (found) {
      setUserData({
        ...userData,
        countryName: currentLang === "ar-ae" ? found.nameAr : found.name,
        countryCode: found.dialCode,
      })
      setError({
        ...errorMessage,
        countryName: "",
        countryCode: "",
      })
    }

    setCountryDialogVisible(false)
  }

  return (
    <Portal>
      <Dialog visible={countryDialogVisible} onDismiss={() => setCountryDialogVisible(false)} style={styles.dialog}>
        <View style={styles.panel}>
          <LinearGradient colors={[COLORS.primary[500] + "12", "transparent"]} start={{ x: 0.08, y: 0 }} end={{ x: 1, y: 1 }} style={styles.panelSheen} />
          <View pointerEvents="none" style={styles.orb} />
          <View pointerEvents="none" style={styles.innerRing} />

          <View style={styles.titleWrap}>
            <Text style={styles.title}>{t.Auth.selectYourCountry}</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder={currentLang === "ar-ae" ? "ابحث" : currentLang === "ro-ro" ? "Caută" : "Search"}
                placeholderTextColor="#71717a"
                value={countryQuery}
                onChangeText={setCountryQuery}
                autoCapitalize="none"
              />
            </View>

            <ScrollView style={styles.optionsScroll} contentContainerStyle={styles.optionsGroup} showsVerticalScrollIndicator={false}>
              <RadioButton.Group value={selectedCountryIso} onValueChange={setSelectedCountryIso}>
                {filteredCountries.map((country) => {
                  const localizedName = currentLang === "ar-ae" ? country.nameAr : country.name
                  const isActive = selectedCountryIso === country.iso2

                  return (
                    <TouchableOpacity
                      key={country.iso2}
                      activeOpacity={0.85}
                      style={[styles.optionCard, isActive && styles.optionCardActive]}
                      onPress={() => setSelectedCountryIso(country.iso2)}
                    >
                      <View style={styles.optionRow}>
                        <View style={styles.radioWrap}>
                          <RadioButton value={country.iso2} />
                        </View>
                        <View style={styles.optionCopy}>
                          <Text style={styles.countryText}>{localizedName}</Text>
                          <Text style={styles.countryMeta}>{country.dialCode}</Text>
                        </View>
                        <View style={[styles.optionBadge, isActive && styles.optionBadgeActive]}>
                          <Text style={[styles.optionBadgeText, isActive && styles.optionBadgeTextActive]}>{country.iso2}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </RadioButton.Group>
            </ScrollView>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => setCountryDialogVisible(false)} style={styles.secondaryAction}>
              <Text style={styles.secondaryActionText}>{currentLang === "ar-ae" ? "إلغاء" : currentLang === "ro-ro" ? "Anulează" : "Cancel"}</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.85} onPress={handleApplyCountry} style={styles.primaryAction}>
              <LinearGradient colors={[COLORS.primary[500], COLORS.amber[500]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.primaryGradient}>
                <Text style={styles.primaryActionText}>{t.Header.buttons.continue}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog>
    </Portal>
  )
}

export default CountrySelection
