import type { TextInputProps, ViewStyle } from "react-native"
import type * as z from "zod"
import { useEffect, useMemo, useState } from "react"
import { Animated, Pressable, StyleSheet, TextInput, View } from "react-native"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { ChevronDown } from "lucide-react-native"

import type { signupSchema } from "@newyolk/validators"
import Text from "@/components/native/text"
import { COUNTRIES } from "./countries"
import CountrySelection from "./country-selection"

type SignupFormValues = z.infer<typeof signupSchema>

const PURPLE = "#a855f7"

const RenderFloatingLabelInput = (
  field: keyof SignupFormValues,
  label: string,
  userData: SignupFormValues,
  setUserData: (userData: SignupFormValues) => void,
  setError: (error: SignupFormValues) => void,
  errorMessage: SignupFormValues,
  isLoading: boolean,
  onSubmit: () => void,
  country: boolean,
  options: {
    keyboardType?: "default" | "email-address" | "phone-pad"
    autoComplete?: TextInputProps["autoComplete"]
    width?: ViewStyle["width"]
  } = {},
) => {
  const { keyboardType = "default", autoComplete, width = "100%" } = options
  const { t, currentLang } = useSafeTranslation
  const [isFocused, setIsFocused] = useState(false)
  const [labelAnim] = useState({
    firstName: new Animated.Value(userData.firstName ? 1 : 0),
    lastName: new Animated.Value(userData.lastName ? 1 : 0),
    email: new Animated.Value(userData.email ? 1 : 0),
    phone: new Animated.Value(userData.phone ? 1 : 0),
    countryCode: new Animated.Value(userData.countryCode ? 1 : 0),
    countryName: new Animated.Value(userData.countryName ? 1 : 0),
  })
  const [countryDialogVisible, setCountryDialogVisible] = useState(false)
  const [countryQuery, setCountryQuery] = useState("")

  const filteredCountries = useMemo(() => {
    const query = countryQuery.trim().toLowerCase()
    if (!query) return COUNTRIES
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(query) || c.dialCode.includes(query))
  }, [countryQuery])

  useEffect(() => {
    Object.entries(labelAnim).forEach(([key, anim]) => {
      Animated.timing(anim, {
        toValue: userData[key as keyof SignupFormValues] ? 1 : 0,
        duration: 180,
        useNativeDriver: false,
      }).start()
    })
  }, [userData, labelAnim])

  const isRtl = currentLang === "ar-ae"

  // Country dropdown
  if (country) {
    return (
      <>
        <View>
          <View style={styles.inputWrapper}>
            <Animated.Text
              style={[
                styles.floatingLabel,
                {
                  left: isRtl ? undefined : 16,
                  right: isRtl ? 16 : undefined,
                  textAlign: isRtl ? "right" : "left",
                  top: labelAnim.countryName.interpolate({
                    inputRange: [0, 1],
                    outputRange: [17, 6],
                  }),
                  fontSize: labelAnim.countryName.interpolate({
                    inputRange: [0, 1],
                    outputRange: [15, 11],
                  }),
                  color: labelAnim.countryName.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#52525b", PURPLE],
                  }),
                },
              ]}
              pointerEvents="none"
            >
              {t.Auth.selectYourCountry}
            </Animated.Text>
            <DropdownLike
              label={t.Auth.selectYourCountry}
              value={userData.countryName}
              onPress={() => {
                setCountryQuery("")
                setCountryDialogVisible(true)
              }}
            />
          </View>
          {!!errorMessage.countryName && <Text style={styles.errorText}>{errorMessage.countryName}</Text>}
        </View>

        <CountrySelection
          countryDialogVisible={countryDialogVisible}
          filteredCountries={filteredCountries}
          setCountryDialogVisible={setCountryDialogVisible}
          countryQuery={countryQuery}
          setCountryQuery={setCountryQuery}
          userData={userData}
          setUserData={setUserData}
          errorMessage={errorMessage}
          setError={setError}
        />
      </>
    )
  }

  // Regular text input
  const value = userData[field] ?? ""
  // const hasValue = !!value
  const hasFocus = isFocused

  return (
    <View style={{ width }}>
      <View style={[styles.inputWrapper, hasFocus && styles.inputWrapperFocused, !!errorMessage[field] && styles.inputWrapperError]}>
        <Animated.Text
          style={[
            styles.floatingLabel,
            {
              left: isRtl ? undefined : 16,
              right: isRtl ? 16 : undefined,
              textAlign: isRtl ? "right" : "left",
              top: labelAnim[field].interpolate({
                inputRange: [0, 1],
                outputRange: [17, 6],
              }),
              fontSize: labelAnim[field].interpolate({
                inputRange: [0, 1],
                outputRange: [15, 11],
              }),
              color: labelAnim[field].interpolate({
                inputRange: [0, 1],
                outputRange: ["#52525b", PURPLE],
              }),
            },
          ]}
          pointerEvents="none"
        >
          {label}
        </Animated.Text>
        <TextInput
          style={[styles.input, isRtl && styles.inputRtl]}
          value={value}
          returnKeyType="done"
          onChangeText={(text) => {
            setUserData({ ...userData, [field]: text })
            setError({ ...errorMessage, [field]: "" })
          }}
          onSubmitEditing={onSubmit}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoComplete={autoComplete}
          editable={!isLoading}
        />
      </View>
      {!!errorMessage[field] && <Text style={styles.errorText}>{errorMessage[field]}</Text>}
    </View>
  )
}

export default RenderFloatingLabelInput

// ── Dropdown trigger ──────────────────────────────────────────────────────────

const DropdownLike = ({ value, onPress }: { label: string; value: string; onPress: () => void }) => {
  const { currentLang } = useSafeTranslation
  const isRtl = currentLang === "ar-ae"

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.dropdown, pressed && styles.pressed]}>
      <View style={[styles.dropdownInner, isRtl && styles.dropdownInnerRtl]}>
        {isRtl ? (
          <>
            <ChevronDown size={20} color="#52525b" />
            <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>{value || ""}</Text>
          </>
        ) : (
          <>
            <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>{value || ""}</Text>
            <ChevronDown size={20} color="#52525b" />
          </>
        )}
      </View>
    </Pressable>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  inputWrapper: {
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    height: 64,
    justifyContent: "flex-end",
    marginBottom: 12,
    position: "relative",
  },
  inputWrapperFocused: {
    borderColor: "#a855f7",
    backgroundColor: "rgba(168,85,247,0.06)",
  },
  inputWrapperError: {
    borderColor: "#f87171",
  },
  floatingLabel: {
    position: "absolute",
    fontFamily: "tajawal",
    zIndex: 10,
    pointerEvents: "none",
  },
  input: {
    color: "#ffffff",
    fontSize: 16,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 10,
    fontFamily: "tajawal",
  },
  inputRtl: {
    textAlign: "right",
  },
  errorText: {
    fontSize: 13,
    color: "#f87171",
    marginTop: 4,
    marginLeft: 2,
  },

  // Dropdown
  dropdown: {
    minHeight: 60,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dropdownInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownInnerRtl: {
    flexDirection: "row-reverse",
  },
  dropdownText: {
    fontSize: 15,
    color: "#ffffff",
    fontFamily: "tajawal",
    flex: 1,
    marginTop: 14,
  },
  dropdownPlaceholder: {
    color: "#52525b",
  },

  // Shared
  pressed: {
    opacity: 0.75,
  },
})
