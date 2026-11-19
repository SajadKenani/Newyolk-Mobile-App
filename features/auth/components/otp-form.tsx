import type { T } from "@/messages/types"
import type React from "react"
import { Pressable, View } from "react-native"
import { OtpInput } from "react-native-otp-entry"
import Text from "@/components/native/text"

interface OtpFormProps {
  verifyOtp: (token: string) => void
  error: string
  isLoading: boolean
  resendCooldown: number
  resetForm: () => void
  goBackToEmailInput: () => void
  t: T
  fromSignUp?: boolean
}

export const OtpForm: React.FC<OtpFormProps> = ({ verifyOtp, error, isLoading, resendCooldown, resetForm, goBackToEmailInput, t, fromSignUp }) => {
  return (
    <View style={styles.container}>
      {/* OTP Input */}
      <View>
        <OtpInput
          numberOfDigits={6}
          onTextChange={(text) => verifyOtp(text)}
          theme={{
            containerStyle: {
              justifyContent: "center",
              gap: 10,
            },
            pinCodeContainerStyle: {
              backgroundColor: "#18181b",
              borderColor: "#a855f7",
              borderWidth: 2,
              borderRadius: 18,
              width: 52,
              height: 60,
              shadowColor: "#a855f7",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
            },
            focusedPinCodeContainerStyle: {
              borderColor: "#ec4899",
              borderWidth: 3,
              backgroundColor: "#23272f",
            },
            pinCodeTextStyle: {
              color: "#FFFFFF",
              fontSize: 22,
              letterSpacing: 2,
            },
          }}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {/* Resend section */}
      <View style={styles.resendRow}>
        <Text style={styles.resendLabel}>{t.Auth.didntReceive}</Text>
        <Pressable onPress={resetForm} disabled={isLoading || resendCooldown > 0}>
          <Text style={[styles.resendButton, { color: "#a855f7" }]}>
            {resendCooldown > 0 ? t.Auth.resendIn.replace("{seconds}", resendCooldown.toString()) : t.Auth.resend}
          </Text>
        </Pressable>
      </View>

      {!fromSignUp && (
        <View style={styles.changeEmailRow}>
          <Pressable onPress={goBackToEmailInput} disabled={isLoading} style={styles.changeEmailButton}>
            <Text style={styles.changeEmailText}>← {t.Auth.changeEmail}</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    gap: 24, // gap-6
  },
  errorText: {
    marginTop: 12, // mt-3
    fontSize: 16, // text-base
    color: "#f87171", // text-red-400
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8, // gap-2
    paddingTop: 4, // pt-1
  },
  resendLabel: {
    marginTop: 16, // mt-4
    fontSize: 14, // text-sm
    color: "#94a3b8", // text-slate-400
  },
  resendButton: {
    marginTop: 16, // mt-4
    fontSize: 14, // text-sm
    // color set dynamically
  },
  changeEmailRow: {
    marginTop: 16, // mt-4
    paddingTop: 4, // pt-1
    flexDirection: "row",
    justifyContent: "center",
  },
  changeEmailButton: {
    paddingHorizontal: 16, // px-4
    paddingVertical: 8, // py-2
  },
  changeEmailText: {
    fontSize: 14, // text-sm
    color: "#a855f7", // text-purple-400
  },
})
