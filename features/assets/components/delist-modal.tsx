import { View, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from "react-native"
import Animated, { FadeInUp } from "react-native-reanimated"
import Decimal from "decimal.js"
import { useSafeTranslation } from "@/hooks/safe-translation"

import Text from "@/components/native/text"

import { X, Gavel } from "lucide-react-native"
import { modalStyles } from "./style"
import type { DelistModalProps } from "../types/type"

const DelistModal = ({ visible, onClose, delistableItems, collectionName = "", isPending, onDelist }: DelistModalProps) => {
  const { currentLang, t } = useSafeTranslation
  const totalValue = delistableItems.reduce((acc, item) => acc + (item.listings[0] ? new Decimal(item.listings[0].buyNowPrice).toNumber() : 0), 0)
  const formatCurrency = (value: number) => value.toLocaleString(currentLang, { style: "currency", currency: "USD" })

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <View style={modalStyles.modalOverlay}>
        <Animated.View entering={FadeInUp.duration(280)} style={modalStyles.modalSheet}>
          <View style={modalStyles.modalHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Gavel size={17} color="#e5e7eb" />
              <Text style={modalStyles.modalTitle}>
                {t("Assets.marketplace.delist")} {t("Assets.marketplace.items")}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={modalStyles.mutedText}>
                {delistableItems.length} {delistableItems.length === 1 ? t("Assets.marketplace.item") : t("Assets.marketplace.items")}
              </Text>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[modalStyles.mutedText, { paddingHorizontal: 20, paddingVertical: 12, fontSize: 13 }]}>{t("Assets.marketplace.delistDescription")}</Text>

          <ScrollView style={{ maxHeight: 220 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }} showsVerticalScrollIndicator={false}>
            {delistableItems.map((item, index) => (
              <View key={item.id + index + "delist"} style={modalStyles.listItemRow}>
                <Text style={modalStyles.listItemName} numberOfLines={1}>
                  {collectionName} #{item.numId}
                </Text>
                <Text style={modalStyles.proceedsText}>{item.listings[0] ? formatCurrency(new Decimal(item.listings[0].buyNowPrice).toNumber()) : "--"}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={modalStyles.summaryRow}>
            <View>
              <Text style={modalStyles.summaryLabel}>{t("Assets.marketplace.totalListedValue")}</Text>
              <Text style={modalStyles.summaryValue}>{formatCurrency(totalValue)}</Text>
            </View>
          </View>

          <View style={modalStyles.modalFooter}>
            <TouchableOpacity
              onPress={onDelist}
              disabled={delistableItems.length === 0 || isPending}
              activeOpacity={0.8}
              style={[modalStyles.modalDestructiveBtn, { opacity: delistableItems.length === 0 || isPending ? 0.45 : 1 }]}
            >
              {isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={modalStyles.modalBtnText}>
                  {t("Assets.marketplace.delist")} {delistableItems.length}{" "}
                  {delistableItems.length === 1 ? t("Assets.marketplace.item") : t("Assets.marketplace.items")}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={modalStyles.modalOutlineBtn} activeOpacity={0.7}>
              <Text style={modalStyles.modalOutlineBtnText}>{t("Assets.marketplace.cancel")}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

export default DelistModal
