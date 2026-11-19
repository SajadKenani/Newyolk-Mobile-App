import { StyleSheet, View } from "react-native"
import { CheckCircle2Icon, ClockIcon } from "lucide-react-native"
import { useThemeColors } from "@/config/colors"
import Text from "@/components/native/text"
import { useSafeTranslation } from "@/hooks/safe-translation"

import type { WithdrawStatus } from "@newyolk/db/browser"

const WithdrawStatusTracker = ({ withdrawStatus }: { withdrawStatus: WithdrawStatus }) => {
  const COLORS = useThemeColors()
  const { t } = useSafeTranslation
  const isCompleted = withdrawStatus === "completed"

  return (
    <>
      {withdrawStatus === "completed" && (
        <View style={styles.container}>
          <View style={[styles.iconShell, { backgroundColor: COLORS.success[500] + "14", borderColor: COLORS.success[500] + "28" }]}>
            <CheckCircle2Icon color={COLORS.success[300]} size={72} />
          </View>
          <Text style={styles.title}>{t.Header.withdraw.dialog.completed}</Text>
          <Text style={styles.description}>{t.Header.withdraw.dialog.description}</Text>
        </View>
      )}
      {withdrawStatus === "pendingApproval" && (
        <View style={styles.container}>
          <View style={[styles.iconShell, { backgroundColor: COLORS.primary[500] + "14", borderColor: COLORS.primary[500] + "28" }]}>
            <ClockIcon color={COLORS.primary[300]} size={72} />
          </View>
          <Text style={styles.title}>{isCompleted ? t.Header.withdraw.dialog.completed : t.Header.withdraw.dialog.pending}</Text>
          <Text style={styles.description}>{t.Header.withdraw.dialog.description}</Text>
        </View>
      )}
    </>
  )
}

export default WithdrawStatusTracker

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 56,
    rowGap: 14,
  },
  iconShell: {
    width: 132,
    height: 132,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 24,
    lineHeight: 28,
  },
  description: {
    color: "#a1a1aa",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 24,
  },
})
