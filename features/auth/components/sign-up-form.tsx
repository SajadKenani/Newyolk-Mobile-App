import type * as z from "zod"
import { useMemo } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import Svg, { Path } from "react-native-svg"
import { LinearGradient } from "expo-linear-gradient"
import Text from "@/components/native/text"
import { useSafeTranslation } from "@/hooks/safe-translation"

import type { signupSchema } from "@newyolk/validators"

import { LoadingSpinner } from "@/components/helpers/loading"
import RenderFloatingLabelInput from "./input-render"

type SignupFormValues = z.infer<typeof signupSchema>

interface SignUpFormProps {
  userData: SignupFormValues
  setUserData: (userData: SignupFormValues) => void
  isLoading: boolean
  errorMessage: SignupFormValues
  setError: (error: SignupFormValues) => void
  onSubmit: () => void
  error: string | null
}

const PURPLE = "#a855f7"

const SignUpForm: React.FC<SignUpFormProps> = ({ userData, setUserData, isLoading, errorMessage, setError, onSubmit, error }) => {
  const { t, currentLang } = useSafeTranslation
  const isRtl = currentLang === "ar-ae"

  const isFormValid = useMemo(() => {
    return (
      !!userData.firstName?.trim() &&
      !!userData.lastName?.trim() &&
      !!userData.email?.trim() &&
      !!userData.phone?.trim() &&
      !!userData.countryCode?.trim() &&
      !!userData.countryName?.trim()
    )
  }, [userData])

  return (
    <View>
      {/* Name row */}
      <View style={[styles.nameRow, isRtl && styles.nameRowRtl]}>
        {isRtl ? (
          <>
            {RenderFloatingLabelInput("lastName", t.Auth.lastName, userData, setUserData, setError, errorMessage, isLoading, onSubmit, false, {
              autoComplete: "name-family",
              width: "49%",
            })}
            {RenderFloatingLabelInput("firstName", t.Auth.firstName, userData, setUserData, setError, errorMessage, isLoading, onSubmit, false, {
              autoComplete: "name-given",
              width: "49%",
            })}
          </>
        ) : (
          <>
            {RenderFloatingLabelInput("firstName", t.Auth.firstName, userData, setUserData, setError, errorMessage, isLoading, onSubmit, false, {
              autoComplete: "name-given",
              width: "49%",
            })}
            {RenderFloatingLabelInput("lastName", t.Auth.lastName, userData, setUserData, setError, errorMessage, isLoading, onSubmit, false, {
              autoComplete: "name-family",
              width: "49%",
            })}
          </>
        )}
      </View>

      {/* Email */}
      <View style={styles.fieldWrap}>
        {RenderFloatingLabelInput("email", t.Auth.email, userData, setUserData, setError, errorMessage, isLoading, onSubmit, false, {
          keyboardType: "email-address",
          autoComplete: "email",
        })}
      </View>

      {/* Phone */}
      <View style={styles.fieldWrap}>
        {RenderFloatingLabelInput("phone", t.Auth.phoneNumber, userData, setUserData, setError, errorMessage, isLoading, onSubmit, false, {
          keyboardType: "phone-pad",
          autoComplete: "tel",
        })}
      </View>

      {/* Country */}
      <View style={styles.fieldWrap}>
        {RenderFloatingLabelInput("countryName", t.Auth.country, userData, setUserData, setError, errorMessage, isLoading, onSubmit, true)}
      </View>

      {/* Form-level error */}
      {!!error && <Text style={styles.errorText}>{error}</Text>}

      {/* Continue button */}
      <Pressable
        onPress={onSubmit}
        disabled={!isFormValid || isLoading}
        style={({ pressed }) => [styles.submitBtn, (!isFormValid || isLoading) && styles.submitBtnDisabled, pressed && isFormValid && styles.pressed]}
      >
        <LinearGradient
          colors={isFormValid ? [PURPLE, "#ec4899"] : ["#3f3f46", "#3f3f46"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.submitGradient}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Text style={styles.submitText}>{t.Header.buttons.continue}</Text>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ marginLeft: 8 }}>
                <Path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </>
          )}
        </LinearGradient>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  nameRowRtl: {
    flexDirection: "row-reverse",
  },
  fieldWrap: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 13,
    color: "#f87171",
    marginBottom: 8,
    marginLeft: 2,
  },

  // Submit button
  submitBtn: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 14,
    marginBottom: 8,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  submitText: {
    fontSize: 15,
    color: "#ffffff",
  },

  // Shared
  pressed: {
    opacity: 0.75,
  },
})

export { SignUpForm }
