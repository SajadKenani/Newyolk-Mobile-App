import type { ImageSourcePropType } from "react-native"
import { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Svg, { Path } from "react-native-svg"
import { router } from "expo-router"
import { authClient } from "@/auth/client"
import { EmailForm } from "@/features/auth/components/email-form"
import Text from "@/components/native/text"
import { ExpoRoutes } from "@/config/routes"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { isValidEmail } from "@/utils/format"

interface SignInScreenProps {
  onSignInSuccess?: () => void
}

const OTP_LENGTH = 6
const PURPLE = "#a855f7"
const PURPLE_DIM = "#3f3f46"
const CARD_BG = "rgba(255,255,255,0.04)"
const BORDER = "rgba(255,255,255,0.1)"

const SignInScreen: React.FC<SignInScreenProps> = ({ onSignInSuccess }) => {
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<"email" | "otp">("email")
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)
  const [focusedOtpIndex, setFocusedOtpIndex] = useState<number | null>(null)
  const otpRefs = useRef<(TextInput | null)[]>([])

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
  const NewyolkIcon: ImageSourcePropType = require("@/assets/icons/adaptive-icon.png")

  const { t, currentLang } = useSafeTranslation

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendCooldown])

  const { data: session } = authClient.useSession()
  useEffect(() => {
    if (session) {
      onSignInSuccess?.()
      router.replace(ExpoRoutes.main)
    }
  }, [session, onSignInSuccess])

  const sendOtp = async () => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError(t("errors.emailRequired", "Email is required"))
      return
    }
    if (!isValidEmail(trimmedEmail)) {
      setError(t("errors.invalidEmail", "Please enter a valid email address"))
      return
    }
    setIsLoading(true)
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
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOtp = async () => {
    const otpCode = otp.join("")
    if (otpCode.length !== OTP_LENGTH) {
      setError(t("errors.otpIncomplete", "Please enter the full code"))
      return
    }
    setIsLoading(true)
    setError("")
    try {
      const { error: authError } = await authClient.signIn.emailOtp({
        email: email.trim(),
        otp: otpCode,
      })
      if (authError) {
        setError(authError.message ?? t("errors.invalidOtp", "Invalid or expired code. Please try again."))
        setOtp(Array(OTP_LENGTH).fill(""))
        otpRefs.current[0]?.focus()
        return
      }

      const refreshedSession = await authClient.getSession({
        query: { disableCookieCache: true },
      })

      authClient.$store.notify("$sessionSignal")

      if (refreshedSession.data) {
        onSignInSuccess?.()
        router.replace(ExpoRoutes.main)
        return
      }

      setError(t("errors.generic", "We signed you in, but your session did not refresh. Please try again."))
    } catch (err) {
      setError(t("errors.generic", "Something went wrong. Please try again."))
      console.error(err)
    } finally {
      setIsLoading(false)
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
      const focusIndex = Math.min(digits.length, OTP_LENGTH - 1)
      otpRefs.current[focusIndex]?.focus()
      if (digits.length === OTP_LENGTH) {
        setTimeout(() => {
          void verifyOtp()
        }, 100)
      }
      return
    }
    const digit = text.replace(/\D/g, "").slice(-1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    setError("")
    if (digit && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus()
    if (digit && index === OTP_LENGTH - 1 && newOtp.every((d) => d)) {
      setTimeout(() => {
        void verifyOtp()
      }, 100)
    }
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
    setError("")
    setResendCooldown(60)
    await sendOtp()
  }

  const goBackToEmail = () => {
    setStep("email")
    setError("")
    setResendCooldown(0)
    setOtp(Array(OTP_LENGTH).fill(""))
  }

  const signInWithGoogle = async () => {
    setIsGoogleLoading(true)
    setError("")
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: "/" })
    } catch (err) {
      setError(t("errors.generic", "Something went wrong. Please try again."))
      console.error(err)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const otpFilled = otp.join("").length === OTP_LENGTH

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Image source={NewyolkIcon} style={styles.logo} />
            <Text style={styles.heading}>{t.SignIn.title}</Text>
            <Text style={styles.subheading}>{step === "email" ? t.SignIn.description : t("SignIn.otpPrompt", "Enter the code we sent to your email")}</Text>
          </View>

          <View style={styles.card}>
            {step === "email" ? (
              <>
                <EmailForm email={email} setEmail={setEmail} isLoading={isLoading} error={error} setError={setError} onSubmit={sendOtp} />

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerLabel}>{t("SignIn.or", "or")}</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Pressable
                  onPress={signInWithGoogle}
                  disabled={isGoogleLoading}
                  style={({ pressed }) => [styles.googleBtn, pressed && styles.pressed, isGoogleLoading && styles.disabled]}
                >
                  {isGoogleLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Svg width={18} height={18} viewBox="0 0 24 24" style={styles.googleLogo}>
                        <Path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                          fill="#4285F4"
                        />
                        <Path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <Path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <Path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </Svg>
                      <Text style={styles.googleBtnText}>{t("SignIn.continueWithGoogle", "Continue with Google")}</Text>
                    </>
                  )}
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.otpInfo}>{t("SignIn.otpSentTo", "Code sent to")}</Text>
                <Text style={styles.otpEmail}>{email}</Text>

                <View style={styles.otpRow}>
                  {otp.map((digit, i) => (
                    <TextInput
                      key={i}
                      ref={(r) => {
                        otpRefs.current[i] = r
                      }}
                      style={[styles.otpBox, focusedOtpIndex === i && styles.otpBoxFocused, digit !== "" && styles.otpBoxFilled]}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, i)}
                      onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, i)}
                      onFocus={() => setFocusedOtpIndex(i)}
                      onBlur={() => setFocusedOtpIndex(null)}
                      keyboardType="number-pad"
                      maxLength={i === 0 ? OTP_LENGTH : 1}
                      selectTextOnFocus
                      editable={!isLoading}
                    />
                  ))}
                </View>

                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <Pressable
                  onPress={verifyOtp}
                  disabled={isLoading || !otpFilled}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    !otpFilled && styles.primaryBtnMuted,
                    pressed && otpFilled && styles.pressed,
                    isLoading && styles.disabled,
                  ]}
                >
                  {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.primaryBtnText}>{t("SignIn.verify", "Verify")}</Text>}
                </Pressable>

                <Pressable onPress={resendOtp} disabled={resendCooldown > 0} style={styles.textBtn}>
                  <Text style={[styles.textBtnLabel, resendCooldown > 0 && styles.textBtnMuted]}>
                    {resendCooldown > 0 ? `${t("SignIn.resendIn", "Resend in")} ${resendCooldown}s` : t("SignIn.resendCode", "Resend code")}
                  </Text>
                </Pressable>

                <Pressable onPress={goBackToEmail} style={styles.textBtn}>
                  <Text style={styles.textBtnMuted}>{t("SignIn.changeEmail", "Use a different email")}</Text>
                </Pressable>
              </>
            )}
          </View>

          <View style={styles.footer}>
            <View style={styles.footerDivider} />
            <View style={styles.footerRow}>
              {currentLang === "ar-ae" ? (
                <>
                  <Pressable onPress={() => router.navigate(ExpoRoutes.auth.signUp)}>
                    <Text style={styles.footerLink}>{t.Auth.createAccount}</Text>
                  </Pressable>
                  <Text style={styles.footerText}>{t.Auth.dontHaveAccount} </Text>
                </>
              ) : (
                <>
                  <Text style={styles.footerText}>{t.Auth.dontHaveAccount} </Text>
                  <Pressable onPress={() => router.navigate(ExpoRoutes.auth.signUp)}>
                    <Text style={styles.footerLink}>{t.Auth.createAccount}</Text>
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
  hero: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 160,
    height: 96,
    marginBottom: 20,
    borderRadius: 24,
  },
  heading: {
    fontSize: 28,
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
    color: "#a1a1aa",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
  card: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER,
  },
  dividerLabel: {
    fontSize: 13,
    color: "#52525b",
    marginHorizontal: 12,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  googleLogo: {
    marginRight: 10,
  },
  googleBtnText: {
    fontSize: 15,
    color: "#ffffff",
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
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.5,
  },
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

export default SignInScreen
