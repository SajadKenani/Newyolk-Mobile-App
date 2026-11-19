import type { ImageSourcePropType } from "react-native"
import type * as z from "zod"
import { useEffect, useRef, useState, useTransition } from "react"
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"
import { TRPCError } from "@trpc/server"
import { authClient } from "@/auth/client"
import { SignUpForm } from "@/features/auth/components/sign-up-form"
import Text from "@/components/native/text"
import { ExpoRoutes } from "@/config/routes"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { api } from "@/config/react-provider"
import { isValidEmail } from "@/utils/format"

import type { signupSchema } from "@newyolk/validators"

type SignupFormValues = z.infer<typeof signupSchema>

interface SignUpScreenProps {
  onSignUpSuccess?: () => void
}

const OTP_LENGTH = 6
const PURPLE = "#a855f7"
const PURPLE_DIM = "#3f3f46"
const CARD_BG = "rgba(255,255,255,0.04)"
const BORDER = "rgba(255,255,255,0.1)"

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUpSuccess }) => {
  const { t, currentLang } = useSafeTranslation
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
  const NewyolkIcon: ImageSourcePropType = require("@/assets/icons/adaptive-icon.png")

  const [userData, setUserData] = useState<SignupFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "",
    countryName: "",
  })
  const [errorMessages, setErrorMessages] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "",
    countryName: "",
  })
  const [error, setError] = useState<string>("")
  const [isLoading, startTransition] = useTransition()
  const [step, setStep] = useState<"form" | "otp">("form")
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [resendCooldown, setResendCooldown] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const otpRefs = useRef<(TextInput | null)[]>([])

  const isRtl = currentLang === "ar-ae"

  const validateForm = () => {
    const errors = { firstName: "", lastName: "", email: "", phone: "", countryCode: "", countryName: "" }
    if (!userData.firstName?.trim()) errors.firstName = t("errors.firstNameRequired", "First name is required")
    if (!userData.lastName?.trim()) errors.lastName = t("errors.lastNameRequired", "Last name is required")
    const email = userData.email?.trim() ?? ""
    if (!email) errors.email = t("errors.emailRequired", "Email is required")
    else if (!isValidEmail(email)) errors.email = t("errors.invalidEmail", "Please enter a valid email address")
    if (!userData.phone?.trim()) errors.phone = t("errors.phoneRequired", "Phone number is required")
    if (!userData.countryName?.trim()) errors.countryName = t("errors.countryRequired", "Country is required")
    if (!userData.countryCode?.trim()) errors.countryCode = t("errors.countryCodeRequired", "Country code is required")
    setErrorMessages(errors)
    return Object.values(errors).every((v) => !v)
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (resendCooldown > 0) {
      interval = setInterval(() => setResendCooldown((prev) => prev - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [resendCooldown])

  const { data: session } = authClient.useSession()
  useEffect(() => {
    if (session) {
      onSignUpSuccess?.()
      router.replace(ExpoRoutes.main)
    }
  }, [session, onSignUpSuccess])

  const sendOtp = async () => {
    const trimmedEmail = userData.email.trim()
    setError("")
    try {
      const { error: authError } = await authClient.emailOtp.sendVerificationOtp({
        email: trimmedEmail,
        type: "sign-in",
      })
      if (authError) {
        setError(authError.message ?? t("errors.generic", "Something went wrong. Please try again."))
      } else {
        setStep("otp")
        setResendCooldown(60)
        setOtp(Array(OTP_LENGTH).fill(""))
        setTimeout(() => otpRefs.current[0]?.focus(), 300)
      }
    } catch (err) {
      setError(t("errors.generic", "Something went wrong. Please try again."))
      console.error("Sign up send OTP error:", err)
    }
  }

  const verifyOtp = async () => {
    const otpCode = otp.join("")
    if (otpCode.length !== OTP_LENGTH) {
      setError(t("errors.otpIncomplete", "Please enter the full code"))
      return
    }
    setIsVerifying(true)
    setError("")
    try {
      const { error: authError } = await authClient.signIn.emailOtp({
        email: userData.email.trim(),
        otp: otpCode,
      })
      if (authError) {
        setError(authError.message ?? t("errors.invalidOtp", "Invalid or expired code. Please try again."))
        setOtp(Array(OTP_LENGTH).fill(""))
        otpRefs.current[0]?.focus()
      }
    } catch (err) {
      setError(t("errors.generic", "Something went wrong. Please try again."))
      console.error("Sign up verify OTP error:", err)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1 && index === 0) {
      const digits = text.replace(/\D/g, "").slice(0, OTP_LENGTH).split("")
      const newOtp = [...otp]
      digits.forEach((d, i) => {
        newOtp[i] = d
      })
      setOtp(newOtp)
      otpRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus()
      if (digits.length === OTP_LENGTH) setTimeout(() => void verifyOtp(), 100)
      return
    }
    const digit = text.replace(/\D/g, "").slice(-1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    setError("")
    if (digit && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus()
    if (digit && index === OTP_LENGTH - 1 && newOtp.every(Boolean)) setTimeout(() => void verifyOtp(), 100)
  }

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp]
      newOtp[index - 1] = ""
      setOtp(newOtp)
      otpRefs.current[index - 1]?.focus()
    }
  }

  const resendOtp = async () => {
    if (resendCooldown > 0) return
    setResendCooldown(60)
    await sendOtp()
  }

  const onSubmit = () => {
    if (!validateForm()) return
    const prepared: SignupFormValues = {
      ...userData,
      email: userData.email.toLowerCase(),
      phone: userData.countryCode.trim() + userData.phone.trim(),
    }
    setError("")
    startTransition(async () => {
      try {
        await signUp.mutateAsync(prepared)
      } catch (mutationError) {
        if (mutationError instanceof Error || mutationError instanceof TRPCError) {
          setError(mutationError.message)
        }
      }
    })
  }

  const signUp = api.user.signUp.useMutation({
    onSuccess: async () => {
      await sendOtp()
    },
  })

  const otpFilled = otp.every(Boolean)

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {step === "form" && (
            <View style={[styles.formHeader, isRtl && styles.formHeaderRtl]}>
              <View style={styles.logoWrap}>
                <Image source={NewyolkIcon} style={styles.logo} resizeMode="contain" />
              </View>
              <View style={styles.formHeadingWrap}>
                <Text style={[styles.heading, isRtl && styles.textRight]}>{t("SignIn.signUpWelcome", "Welcome to NewYolk!")}</Text>
                <Text style={[styles.subheading, isRtl && styles.textRight]}>{t("SignIn.signUpSubtitle", "Invest in real farms - Earn Daily Income.")}</Text>
              </View>
            </View>
          )}

          {step === "otp" && (
            <View style={styles.hero}>
              <Image source={NewyolkIcon} style={styles.heroLogo} />
              <Text style={styles.heading}>{t.Auth.signUp}</Text>
              <Text style={styles.subheading}>{t("SignIn.otpPrompt", "Enter the code we sent to your email")}</Text>
            </View>
          )}

          <View style={styles.card}>
            {step === "form" ? (
              <SignUpForm
                userData={userData}
                setUserData={setUserData}
                isLoading={isLoading}
                errorMessage={errorMessages}
                setError={setErrorMessages}
                onSubmit={onSubmit}
                error={error}
              />
            ) : (
              <>
                <Text style={styles.otpInfo}>{t("SignIn.otpSentTo", "Code sent to")}</Text>
                <Text style={styles.otpEmail}>{userData.email}</Text>

                <View style={styles.otpRow}>
                  {otp.map((digit, i) => (
                    <TextInput
                      key={i}
                      ref={(r) => {
                        otpRefs.current[i] = r
                      }}
                      style={[styles.otpBox, focusedIndex === i && styles.otpBoxFocused, digit !== "" && styles.otpBoxFilled]}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, i)}
                      onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, i)}
                      onFocus={() => setFocusedIndex(i)}
                      onBlur={() => setFocusedIndex(null)}
                      keyboardType="number-pad"
                      maxLength={i === 0 ? OTP_LENGTH : 1}
                      selectTextOnFocus
                      editable={!isVerifying}
                    />
                  ))}
                </View>

                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <Pressable
                  onPress={verifyOtp}
                  disabled={isVerifying || !otpFilled}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    !otpFilled && styles.primaryBtnMuted,
                    pressed && otpFilled && styles.pressed,
                    isVerifying && styles.disabled,
                  ]}
                >
                  {isVerifying ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.primaryBtnText}>{t("SignIn.verify", "Verify")}</Text>}
                </Pressable>

                <Pressable onPress={resendOtp} disabled={resendCooldown > 0} style={styles.textBtn}>
                  <Text style={[styles.textBtnLabel, resendCooldown > 0 && styles.textBtnMuted]}>
                    {resendCooldown > 0 ? `${t("SignIn.resendIn", "Resend in")} ${resendCooldown}s` : t("SignIn.resendCode", "Resend code")}
                  </Text>
                </Pressable>

                <Pressable onPress={() => setStep("form")} style={styles.textBtn}>
                  <Text style={styles.textBtnMuted}>{t("SignIn.changeEmail", "Use a different email")}</Text>
                </Pressable>
              </>
            )}
          </View>

          <View style={styles.footer}>
            <View style={styles.footerDivider} />
            <View style={styles.footerRow}>
              {isRtl ? (
                <>
                  <Pressable onPress={() => router.navigate(ExpoRoutes.auth.signIn)}>
                    <Text style={styles.footerLink}>{t.Auth.signIn}</Text>
                  </Pressable>
                  <Text style={styles.footerText}> {t.Auth.alreadyHaveAccount}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.footerText}>{t.Auth.alreadyHaveAccount} </Text>
                  <Pressable onPress={() => router.navigate(ExpoRoutes.auth.signIn)}>
                    <Text style={styles.footerLink}>{t.Auth.signIn}</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#18181b",
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  formHeaderRtl: {
    flexDirection: "row-reverse",
  },
  logoWrap: {
    width: 96,
    height: 96,
    borderRadius: 24,
    overflow: "hidden",
    marginRight: 16,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  formHeadingWrap: {
    flex: 1,
  },
  hero: {
    alignItems: "center",
    marginBottom: 32,
  },
  heroLogo: {
    width: 96,
    height: 96,
    borderRadius: 24,
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    color: "#ffffff",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
    color: "#a1a1aa",
    lineHeight: 22,
    maxWidth: 280,
  },
  textRight: {
    textAlign: "right",
  },
  card: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  primaryBtn: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primaryBtnMuted: {
    backgroundColor: PURPLE_DIM,
  },
  primaryBtnText: {
    fontSize: 15,
    color: "#ffffff",
  },
  textBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  textBtnLabel: {
    fontSize: 14,
    color: PURPLE,
  },
  textBtnMuted: {
    fontSize: 14,
    color: "#71717a",
  },
  otpInfo: {
    fontSize: 14,
    color: "#a1a1aa",
    textAlign: "center",
    marginBottom: 4,
  },
  otpEmail: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  otpBox: {
    width: 44,
    height: 52,
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: "rgba(0,0,0,0.3)",
    color: "#ffffff",
    fontSize: 22,
    textAlign: "center",
  },
  otpBoxFocused: {
    borderColor: PURPLE,
    backgroundColor: "rgba(168,85,247,0.08)",
  },
  otpBoxFilled: {
    borderColor: "rgba(168,85,247,0.4)",
  },
  errorText: {
    fontSize: 13,
    color: "#f87171",
    textAlign: "center",
    marginBottom: 8,
  },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.5 },
  footer: {
    alignItems: "center",
  },
  footerDivider: {
    width: "60%",
    height: 1,
    backgroundColor: BORDER,
    marginBottom: 20,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#71717a",
  },
  footerLink: {
    fontSize: 14,
    color: PURPLE,
  },
})

export default SignUpScreen
