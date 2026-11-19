import { useMemo } from "react"
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { useThemeColors } from "@/config/colors"
import { useAccountForm } from "@/features/account/hooks/useAccountForm"
import { useSafeTranslation } from "@/hooks/safe-translation"

import type { RouterOutputs } from "@newyolk/api"

import Text from "@/components/native/text"
import { AccountFormFields } from "./account-form-fields"
import { AvatarPicker } from "./avatar-picker"

const AccountForm = ({ me }: { me: RouterOutputs["user"]["me"] }) => {
  const { t } = useSafeTranslation
  const COLORS = useThemeColors()
  const { form, avatar, success, loading, onSubmit } = useAccountForm(me)
  const displayName = [me.firstName, me.lastName].filter(Boolean).join(" ").trim() || me.email || t.Header.buttons.manageAccount

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: COLORS.black,
        },
        contentContainer: {
          paddingTop: 160,
          paddingHorizontal: 16,
          paddingBottom: 48,
        },
        heroCard: {
          position: "relative",
          overflow: "hidden",
          borderRadius: 28,
          borderWidth: 1,
          borderColor: COLORS.white + "12",
          backgroundColor: "rgba(8, 12, 20, 0.92)",
          paddingHorizontal: 22,
          paddingTop: 22,
          paddingBottom: 20,
          marginBottom: 18,
        },
        heroSheen: {
          ...StyleSheet.absoluteFillObject,
        },
        heroOrb: {
          position: "absolute",
          top: -50,
          right: -30,
          width: 170,
          height: 170,
          borderRadius: 999,
          backgroundColor: COLORS.primary[500] + "20",
        },
        heroEdgeOrb: {
          position: "absolute",
          bottom: -46,
          left: -24,
          width: 130,
          height: 130,
          borderRadius: 999,
          backgroundColor: COLORS.white + "08",
        },
        heroInnerRing: {
          ...StyleSheet.absoluteFillObject,
          borderRadius: 27,
          borderWidth: 1,
          borderColor: COLORS.white + "06",
          margin: 1,
        },
        heroHeader: {
          flexDirection: "row",
          gap: 16,
          alignItems: "center",
        },
        heroCopy: {
          flex: 1,
          gap: 4,
        },
        heroEyebrow: {
          color: COLORS.primary[300],
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
        },
        heroTitle: {
          color: COLORS.white,
          fontSize: 28,
          lineHeight: 32,
        },
        heroSubtitle: {
          color: COLORS.zinc[300],
          fontSize: 14,
          lineHeight: 20,
        },
        locationBadge: {
          alignSelf: "flex-start",
          marginTop: 8,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: COLORS.primary[400] + "22",
          backgroundColor: COLORS.primary[400] + "12",
          paddingHorizontal: 10,
          paddingVertical: 6,
        },
        locationBadgeText: {
          color: COLORS.primary[200],
          fontSize: 12,
        },
        heroFactsRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
          marginTop: 18,
        },
        heroFactCard: {
          flexGrow: 1,
          flexBasis: "30%",
          minWidth: 92,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: COLORS.white + "08",
          backgroundColor: COLORS.white + "04",
          paddingHorizontal: 12,
          paddingVertical: 12,
          gap: 5,
        },
        heroFactLabel: {
          color: COLORS.zinc[500],
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: 1.2,
        },
        heroFactValue: {
          color: COLORS.white,
          fontSize: 13,
        },
        formContainer: {
          paddingBottom: 12,
        },
        successContainer: {
          borderRadius: 20,
          borderWidth: 1,
          borderColor: COLORS.success[500] + "2A",
          backgroundColor: COLORS.success[500] + "14",
          paddingHorizontal: 14,
          paddingVertical: 14,
          marginBottom: 14,
          alignItems: "center",
        },
        successText: {
          color: COLORS.success[200],
          textAlign: "center",
          fontSize: 14,
          letterSpacing: 0.4,
        },
        submitContainer: {
          marginTop: 4,
        },
        submitShell: {
          position: "relative",
          overflow: "hidden",
          borderRadius: 24,
          borderWidth: 1,
          borderColor: COLORS.white + "10",
          backgroundColor: "rgba(8, 12, 20, 0.9)",
          padding: 8,
        },
        submitSheen: {
          ...StyleSheet.absoluteFillObject,
        },
        submitOrb: {
          position: "absolute",
          top: -40,
          right: -18,
          width: 140,
          height: 140,
          borderRadius: 999,
          backgroundColor: COLORS.primary[500] + "16",
        },
        submitInnerRing: {
          ...StyleSheet.absoluteFillObject,
          borderRadius: 23,
          borderWidth: 1,
          borderColor: COLORS.white + "04",
          margin: 1,
        },
        submitTouchTarget: {
          position: "relative",
        },
        submitButton: {
          borderRadius: 18,
          paddingVertical: 18,
          alignItems: "center",
          backgroundColor: COLORS.primary[500],
        },
        submitButtonText: {
          color: COLORS.white,
          fontSize: 17,
          letterSpacing: 0.8,
        },
      }),
    [COLORS],
  )

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.heroCard}>
        <LinearGradient colors={[COLORS.primary[500] + "18", "transparent"]} start={{ x: 0.12, y: 0 }} end={{ x: 0.9, y: 0.9 }} style={styles.heroSheen} />
        <View pointerEvents="none" style={styles.heroOrb} />
        <View pointerEvents="none" style={styles.heroEdgeOrb} />
        <View pointerEvents="none" style={styles.heroInnerRing} />

        <View style={styles.heroHeader}>
          <AvatarPicker avatar={avatar} />
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>{t.Header.buttons.manageAccount}</Text>
            <Text style={styles.heroTitle}>{displayName}</Text>
            <Text style={styles.heroSubtitle}>{me.email ?? t.Auth.email}</Text>
        
          </View>
        </View>

      </View>

      <View style={styles.formContainer}>
        <AccountFormFields control={control} errors={errors} t={t} />
        {success ? (
          <Animated.View entering={FadeInDown} style={styles.successContainer}>
            <Text style={styles.successText}>{t.Common.success}</Text>
          </Animated.View>
        ) : null}
        <Animated.View style={styles.submitContainer} entering={FadeInDown.delay(700)}>
          <View style={styles.submitShell}>
            <LinearGradient colors={[COLORS.primary[500] + "12", "transparent"]} start={{ x: 0.08, y: 0 }} end={{ x: 1, y: 1 }} style={styles.submitSheen} />
            <View pointerEvents="none" style={styles.submitOrb} />
            <View pointerEvents="none" style={styles.submitInnerRing} />

            <TouchableOpacity
              onPress={handleSubmit((data) => {
                void onSubmit(data)
              })}
              activeOpacity={0.8}
              style={styles.submitTouchTarget}
            >
              <LinearGradient colors={[COLORS.primary[500], COLORS.primary[600]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.submitButton}>
                {loading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.submitButtonText}>{t.Settings.account.form.button}</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  )
}

export default AccountForm
