import type { FarmWithdrawValues } from "@/features/withdraw/hooks/useWithdrawForm"
import type { UseFormReturn } from "react-hook-form"
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { Check } from "lucide-react-native"

interface PaymentMethodModalProps {
  visible: boolean
  onClose: () => void
  paymentMethods: { label: string; value: NonNullable<FarmWithdrawValues["payment_method"]> }[]
  form: UseFormReturn<FarmWithdrawValues>
  paymentMethod: FarmWithdrawValues["payment_method"]
}

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ visible, onClose, paymentMethods, form, paymentMethod }) => {
  const COLORS = useThemeColors()
  const { t } = useSafeTranslation
  const styles = createStyles(COLORS)

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalCard}>
          <LinearGradient colors={[COLORS.primary[500] + "16", "transparent"]} start={{ x: 0.1, y: 0 }} end={{ x: 1, y: 1 }} style={styles.modalSheen} />
          <View pointerEvents="none" style={styles.modalInnerRing} />

          {/* Handle Bar */}
          <View style={styles.handleBar} />

          <View style={styles.modalHeader}>
            <Text style={styles.modalEyebrow}>{t.Header.withdraw.form.paymentMethod.label}</Text>
            <Text style={styles.modalTitle}>{t.Header.withdraw.form.paymentMethod.label}</Text>
          </View>

          {/* Options */}
          {paymentMethods.map((item) => {
            const isSelected = paymentMethod === item.value
            return (
              <TouchableOpacity
                key={item.value}
                style={[styles.listItem, isSelected && styles.listItemSelected]}
                onPress={() => {
                  form.setValue("payment_method", item.value, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
                  onClose()
                }}
              >
                <View style={styles.listItemContent}>
                  <Text style={[styles.listItemText, isSelected && styles.listItemTextSelected]}>{item.label}</Text>
                </View>
                {isSelected && (
                  <View style={styles.checkContainer}>
                    <Check size={16} color={COLORS.white} />
                  </View>
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const createStyles = (COLORS: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.6)",
    },
    modalCard: {
      position: "relative",
      overflow: "hidden",
      width: "100%",
      backgroundColor: "rgba(8, 12, 20, 0.96)",
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      borderWidth: 1,
      borderColor: COLORS.white + "0E",
      paddingTop: 8,
      paddingBottom: 32,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
    },
    modalSheen: {
      ...StyleSheet.absoluteFillObject,
    },
    modalInnerRing: {
      ...StyleSheet.absoluteFillObject,
      borderTopLeftRadius: 27,
      borderTopRightRadius: 27,
      borderWidth: 1,
      borderColor: COLORS.white + "05",
      margin: 1,
    },
    handleBar: {
      width: 40,
      height: 4,
      backgroundColor: COLORS.zinc[700],
      borderRadius: 2,
      alignSelf: "center",
      marginBottom: 18,
    },
    modalHeader: {
      paddingHorizontal: 20,
      marginBottom: 12,
      gap: 6,
    },
    modalEyebrow: {
      color: COLORS.primary[300],
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: 2,
      textAlign: "center",
    },
    modalTitle: {
      fontSize: 22,
      color: COLORS.white,
      textAlign: "center",
    },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 17,
      paddingHorizontal: 20,
      marginHorizontal: 16,
      marginVertical: 5,
      borderRadius: 18,
      backgroundColor: COLORS.white + "04",
      borderWidth: 1,
      borderColor: COLORS.white + "08",
    },
    listItemSelected: {
      backgroundColor: COLORS.primary[500] + "18",
      borderColor: COLORS.primary[500] + "55",
    },
    listItemContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    listItemText: {
      fontSize: 16,
      color: COLORS.white,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    listItemTextSelected: {
      color: COLORS.white,
    },
    checkContainer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: COLORS.primary[500],
      alignItems: "center",
      justifyContent: "center",
    },
  })
