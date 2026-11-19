import React from "react"
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Header from "@/components/helpers/header"
import Text from "@/components/native/text"
import WithdrawStatusTracker from "@/features/withdraw/components/status-tracker"
import WithdrawForm from "@/features/withdraw/components/withdraw-form"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { useWithdrawStatus } from "@/features/withdraw/hooks/useWithdrawStatus"
import { useScrollChrome } from "@/hooks/useScrollChrome"

const WithdrawScreen = () => {
  const [isRefetching, setIsRefetching] = React.useState(false)
  const { farmingInfo, paymentMethodsWithdraw, areBothPending, areBothCompleted } = useWithdrawStatus(setIsRefetching)
  const { t } = useSafeTranslation
  const COLORS = useThemeColors()
  const { handleChromeScroll } = useScrollChrome({ hideOnScroll: false })

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
        },
        scrollView: {
          flex: 1,
          marginHorizontal: 8,
        },
        scrollContent: {
          paddingTop: 156,
          paddingHorizontal: 12,
          paddingBottom: 40,
        },
        heroCard: {
          position: "relative",
          overflow: "hidden",
          borderRadius: 30,
          borderWidth: 1,
          borderColor: COLORS.white + "12",
          backgroundColor: "rgba(8, 12, 20, 0.94)",
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
          top: -44,
          right: -28,
          width: 168,
          height: 168,
          borderRadius: 999,
          backgroundColor: COLORS.primary[500] + "1E",
        },
        heroEdgeOrb: {
          position: "absolute",
          bottom: -36,
          left: -26,
          width: 116,
          height: 116,
          borderRadius: 999,
          backgroundColor: COLORS.white + "08",
        },
        heroInnerRing: {
          ...StyleSheet.absoluteFillObject,
          borderRadius: 29,
          borderWidth: 1,
          borderColor: COLORS.white + "05",
          margin: 1,
        },
        heroEyebrow: {
          color: COLORS.primary[300],
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 10,
        },
        title: {
          fontSize: 28,
          lineHeight: 32,
          marginBottom: 10,
          color: COLORS.white,
        },
        description: {
          fontSize: 14,
          lineHeight: 21,
          color: COLORS.zinc[400],
        },
        statusCard: {
          position: "relative",
          marginTop: 2,
          borderRadius: 28,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: COLORS.white + "0E",
          backgroundColor: "rgba(8, 12, 20, 0.92)",
          padding: 16,
        },
        statusSheen: {
          ...StyleSheet.absoluteFillObject,
        },
        statusInnerRing: {
          ...StyleSheet.absoluteFillObject,
          borderRadius: 27,
          borderWidth: 1,
          borderColor: COLORS.white + "05",
          margin: 1,
        },
        overlay: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(0,0,0,0.9)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        },
        overlayCard: {
          borderRadius: 24,
          padding: 32,
          alignItems: "center",
          borderWidth: 1,
          borderColor: COLORS.white + "0E",
          backgroundColor: "rgba(8, 12, 20, 0.94)",
          rowGap: 16,
        },
        overlayText: {
          color: COLORS.white,
          fontSize: 16,
        },
      }),
    [COLORS],
  )

  return (
    <View style={styles.container}>
      <Header showBackButton={true} transparent showMenuButton={true} title={t.Header.withdraw.dialog.title} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleChromeScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.heroCard}>
          <LinearGradient colors={[COLORS.primary[500] + "18", "transparent"]} start={{ x: 0.08, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroSheen} />
          <View pointerEvents="none" style={styles.heroOrb} />
          <View pointerEvents="none" style={styles.heroEdgeOrb} />
          <View pointerEvents="none" style={styles.heroInnerRing} />

          <Text style={styles.heroEyebrow}>{t.Header.withdraw.form.button.submit}</Text>
          <Text style={styles.title}>{t.Header.withdraw.dialog.title}</Text>
          <Text style={styles.description}>
            {areBothPending ? t.Header.withdraw.dialog.pending : areBothCompleted ? t.Header.withdraw.dialog.completed : t.Header.withdraw.dialog.description}
          </Text>
        </View>

        {areBothPending ? (
          <View style={styles.statusCard}>
            <LinearGradient colors={[COLORS.primary[500] + "10", "transparent"]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.statusSheen} />
            <View pointerEvents="none" style={styles.statusInnerRing} />
            <WithdrawStatusTracker withdrawStatus={"pendingApproval"} />
          </View>
        ) : areBothCompleted ? (
          <View style={styles.statusCard}>
            <LinearGradient colors={[COLORS.primary[500] + "10", "transparent"]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.statusSheen} />
            <View pointerEvents="none" style={styles.statusInnerRing} />
            <WithdrawStatusTracker withdrawStatus={"completed"} />
          </View>
        ) : (
          <WithdrawForm farmingInfo={farmingInfo.data} paymentMethods={paymentMethodsWithdraw} onRefetchingChange={setIsRefetching} />
        )}
      </ScrollView>

      {isRefetching && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            <ActivityIndicator size="large" color={COLORS.primary[500]} />
            <Text style={styles.overlayText}>{t.Common.pending}</Text>
          </View>
        </View>
      )}
    </View>
  )
}

export default WithdrawScreen
