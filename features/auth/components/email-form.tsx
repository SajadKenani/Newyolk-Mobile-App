import type { SupportedLang } from "@/hooks/safe-translation"
import type React from "react"
import { useEffect, useState } from "react"
import { Animated, Pressable, StyleSheet, TextInput, View } from "react-native"
import Svg, { Path } from "react-native-svg"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { LoadingSpinner } from "@/components/helpers/loading"
import { LanguageDialog } from "@/components/drawer/language-dialog"
import Text from "@/components/native/text"
import { ExpoRoutes } from "@/config/routes"
import { useSafeTranslation } from "@/hooks/safe-translation"

interface EmailFormProps {
  email: string
  setEmail: (email: string) => void
  isLoading: boolean
  error: string
  setError: (error: string) => void
  onSubmit: () => void
}

export const EmailForm: React.FC<EmailFormProps> = ({ email, setEmail, isLoading, error, setError, onSubmit }) => {
  const [labelAnim] = useState(new Animated.Value(email ? 1 : 0))
  const [isFocused, setIsFocused] = useState(false)
  const [langDialogVisible, setLangDialogVisible] = useState(false)
  const [selectedLang, setSelectedLang] = useState(useSafeTranslation.currentLang)
  const { t, changeLanguage, currentLang } = useSafeTranslation

  const isRtl = currentLang === "ar-ae"

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: email || isFocused ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start()
  }, [email, isFocused, labelAnim])

  const labelTop = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [17, 6] })
  const labelSize = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 12] })
  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#52525b", "#a855f7"],
  })

  const handleApplyLanguage = () => {
    void changeLanguage(selectedLang as SupportedLang)
    setLangDialogVisible(false)
    router.navigate(ExpoRoutes.auth.signIn)
  }

  // const langLabel =
  //   currentLang === "en-us"
  //     ? "Change Language"
  //     : currentLang === "ar-ae"
  //     ? "تغيير اللغة"
  //     : currentLang === "ro-ro"
  //     ? "Schimbă limba"
  //     : "Change Language"

  return (
    <View>
      {/* Floating label email input */}
      <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused, !!error && styles.inputWrapperError]}>
        <Animated.Text
          style={[
            styles.floatingLabel,
            {
              top: labelTop,
              fontSize: labelSize,
              color: labelColor,
              right: isRtl ? 16 : undefined,
              left: isRtl ? undefined : 16,
              textAlign: isRtl ? "right" : "left",
            },
          ]}
          pointerEvents="none"
        >
          {t.SignIn.emailPlaceholder}
        </Animated.Text>

        <TextInput
          style={[styles.input, isRtl && styles.inputRtl]}
          onChangeText={(text) => {
            setEmail(text)
            setError("")
          }}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!isLoading}
          returnKeyType="done"
          onSubmitEditing={onSubmit}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="transparent"
        />
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      {/* Action row: lang icon + continue button */}
      <View style={styles.actionRow}>
        <Pressable
          onPress={() => {
            setSelectedLang(currentLang)
            setLangDialogVisible(true)
          }}
          style={({ pressed }) => [styles.langBtn, pressed && styles.pressed]}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Z" stroke="#a855f7" strokeWidth={1.5} />
            <Path d="M2 12h20" stroke="#a855f7" strokeWidth={1.5} strokeLinecap="round" />
            <Path d="M12 2c-2.5 2.8-4 6.3-4 10s1.5 7.2 4 10" stroke="#a855f7" strokeWidth={1.5} strokeLinecap="round" />
            <Path d="M12 2c2.5 2.8 4 6.3 4 10s-1.5 7.2-4 10" stroke="#a855f7" strokeWidth={1.5} strokeLinecap="round" />
          </Svg>
        </Pressable>

        <Pressable
          onPress={onSubmit}
          disabled={isLoading || !email.trim()}
          style={({ pressed }) => [styles.submitBtn, (isLoading || !email.trim()) && styles.submitBtnDisabled, pressed && styles.pressed]}
        >
          <LinearGradient
            colors={isLoading || !email.trim() ? ["#3f3f46", "#3f3f46"] : ["#a855f7", "#ec4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitGradient}
          >
            {isLoading ? (
              <View style={{ height: 50 }}>
                <LoadingSpinner />
              </View>
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

      <LanguageDialog
        visible={langDialogVisible}
        onDismiss={() => setLangDialogVisible(false)}
        selectedLang={selectedLang}
        onSelectLang={setSelectedLang}
        onApply={handleApplyLanguage}
        t={t}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  // Input
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
    marginBottom: 12,
    marginLeft: 4,
  },

  // Action row
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 4,
  },
  langBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(168,85,247,0.35)",
    backgroundColor: "rgba(168,85,247,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  // Submit button
  submitBtn: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
    height: 50,
  },
  submitBtnDisabled: {
    opacity: 0.45,
    height: 50,
  },
  submitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 14,
    height: 50,
  },
  submitText: {
    fontSize: 16,
    color: "#ffffff",
  },

  // Shared
  pressed: {
    opacity: 0.7,
    height: 50,
  },
})
