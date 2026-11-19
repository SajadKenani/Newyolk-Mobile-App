import type { useSafeTranslation } from "@/hooks/safe-translation"
import { useEffect, useMemo, useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Dialog, Portal, RadioButton } from "react-native-paper"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation as safeTranslation } from "@/hooks/safe-translation"

interface LanguageDialogProps {
  visible: boolean
  onDismiss: () => void
  selectedLang: string
  onSelectLang: (lang: string) => void
  onApply: () => void
  t: typeof useSafeTranslation.t
}

export const LanguageDialog = ({ visible, onDismiss, selectedLang, onSelectLang, onApply, t }: LanguageDialogProps) => {
  const COLORS = useThemeColors()
  const [, setLanguageVersion] = useState(0)

  useEffect(() => {
    return safeTranslation.subscribe(() => {
      setLanguageVersion((currentVersion) => currentVersion + 1)
    })
  }, [])

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
          marginTop: -0,
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
        subtitle: {
          color: COLORS.zinc[400],
          fontSize: 13,
          lineHeight: 19,
          marginTop: 8,
        },
        content: {
          paddingHorizontal: 24,
          paddingTop: 14,
          paddingBottom: 8,
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
        optionTitle: {
          color: COLORS.white,
          fontSize: 16,
        },
        optionBadge: {
          minWidth: 48,
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

  const title = t("Language.changeTitle")
  const description = t("Language.changeMessage")
  const cancelLabel = t("Language.cancel")
  const applyLabel = t("Language.apply")
  const options = [
    { value: "en-us", title: "English", badge: "EN" },
    { value: "ar-ae", title: "العربية", badge: "AR" },
    { value: "ro-ro", title: "Română", badge: "RO" },
  ] as const

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <View style={styles.panel}>
          <LinearGradient colors={[COLORS.primary[500] + "12", "transparent"]} start={{ x: 0.08, y: 0 }} end={{ x: 1, y: 1 }} style={styles.panelSheen} />
          <View pointerEvents="none" style={styles.orb} />
          <View pointerEvents="none" style={styles.innerRing} />

          <View style={styles.titleWrap}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{description}</Text>
          </View>

          <View style={styles.content}>
            <RadioButton.Group onValueChange={onSelectLang} value={selectedLang}>
              <View style={styles.optionsGroup}>
                {options.map((option) => {
                  const isActive = selectedLang === option.value

                  return (
                    <TouchableOpacity
                      key={option.value}
                      activeOpacity={0.85}
                      onPress={() => onSelectLang(option.value)}
                      style={[styles.optionCard, isActive && styles.optionCardActive]}
                    >
                      <View style={styles.optionRow}>
                        <View style={styles.radioWrap}>
                          <RadioButton value={option.value} color={COLORS.primary[400]} uncheckedColor={COLORS.zinc[500]} />
                        </View>
                        <View style={styles.optionCopy}>
                          <Text style={styles.optionTitle}>{option.title}</Text>
                        </View>
                        <View style={[styles.optionBadge, isActive && styles.optionBadgeActive]}>
                          <Text style={[styles.optionBadgeText, isActive && styles.optionBadgeTextActive]}>{option.badge}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </RadioButton.Group>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity activeOpacity={0.85} onPress={onDismiss} style={styles.secondaryAction}>
              <Text style={styles.secondaryActionText}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85} onPress={onApply} style={styles.primaryAction}>
              <LinearGradient colors={[COLORS.primary[500], COLORS.primary[600]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.primaryGradient}>
                <Text style={styles.primaryActionText}>{applyLabel}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog>
    </Portal>
  )
}
