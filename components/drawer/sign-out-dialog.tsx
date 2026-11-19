import type { useSafeTranslation } from "@/hooks/safe-translation"
import { useMemo } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Dialog, Portal } from "react-native-paper"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"

const SignOutDialog = ({
  visible,
  onDismiss,
  onConfirm,
  t,
}: {
  visible: boolean
  onDismiss: () => void
  onConfirm: () => void
  t: typeof useSafeTranslation.t
}) => {
  const COLORS = useThemeColors()

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
        //   marginTop: -50,

          position: "relative",
          overflow: "hidden",
          backgroundColor: "rgba(8, 12, 20, 0.98)",
        },
        sheen: {
          ...StyleSheet.absoluteFillObject,
        },
        orb: {
          position: "absolute",
          top: -28,
          right: -18,
          width: 132,
          height: 132,
          borderRadius: 999,
          backgroundColor: COLORS.danger[500] + "18",
        },
        innerRing: {
          ...StyleSheet.absoluteFillObject,
          borderRadius: 29,
          borderWidth: 1,
          borderColor: COLORS.white + "05",
          margin: 1,
        },
        content: {
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 24,
        },
        title: {
          color: COLORS.white,
          fontSize: 24,
          lineHeight: 28,
        },
        subtitle: {
          color: COLORS.zinc[400],
          fontSize: 14,
          lineHeight: 20,
          marginTop: 8,
        },
        riskCard: {
          marginTop: 18,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: COLORS.white + "08",
          backgroundColor: COLORS.white + "04",
          paddingHorizontal: 14,
          paddingVertical: 12,
          gap: 4,
        },
        riskEyebrow: {
          color: COLORS.danger[300],
          fontSize: 11,
          letterSpacing: 1.6,
          textTransform: "uppercase",
        },
        riskText: {
          color: COLORS.zinc[300],
          fontSize: 13,
          lineHeight: 18,
        },
        actions: {
          flexDirection: "row",
          gap: 10,
          marginTop: 20,
        },
        cancelButton: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: COLORS.white + "0C",
          backgroundColor: COLORS.white + "04",
          paddingVertical: 14,
        },
        cancelText: {
          color: COLORS.white,
          fontSize: 14,
        },
        confirmButton: {
          flex: 1,
          borderRadius: 16,
          overflow: "hidden",
        },
        confirmGradient: {
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 15,
        },
        confirmText: {
          color: COLORS.white,
          fontSize: 14,
        },
      }),
    [COLORS],
  )

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <View style={styles.panel}>
          <LinearGradient colors={[COLORS.danger[500] + "10", "transparent"]} start={{ x: 0.08, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sheen} />
          <View pointerEvents="none" style={styles.orb} />
          <View pointerEvents="none" style={styles.innerRing} />

          <View style={styles.content}>
            <Text style={styles.title}>{t.SignOut.title}</Text>
            <Text style={styles.subtitle}>{t.SignOut.description}</Text>

            <View style={styles.riskCard}>
              <Text style={styles.riskEyebrow}>{t.SignOut.button}</Text>
              <Text style={styles.riskText}>You will need to sign in again to access your farm, assets, and account tools.</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity activeOpacity={0.85} onPress={onDismiss} style={styles.cancelButton}>
                <Text style={styles.cancelText}>{t.SignOut.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.85} onPress={onConfirm} style={styles.confirmButton}>
                <LinearGradient colors={[COLORS.danger[500], COLORS.danger[600]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.confirmGradient}>
                  <Text style={styles.confirmText}>{t.SignOut.button}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Dialog>
    </Portal>
  )
}

export { SignOutDialog }
