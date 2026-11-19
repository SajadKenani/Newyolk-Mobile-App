import { useThemeColors } from "@/config/colors"
import Decimal from "decimal.js"
import { useState, useEffect } from "react"
import { View, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator } from "react-native"
import { Check, ChevronDown, Minus, Plus, Tag, X } from "lucide-react-native"
import Text from "@/components/native/text"
import Animated, { FadeInUp } from "react-native-reanimated"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { modalStyles } from "./style"
import type { Duration, ListModalProps } from "../types/type"

const isDurationRecord = (value: unknown): value is { label: string; value: string } => {
  if (!value || typeof value !== "object") return false

  const candidate = value as { label?: unknown; value?: unknown }
  return typeof candidate.label === "string" && typeof candidate.value === "string"
}

const ListModal = ({ visible, onClose, listableItems, floorPrice, collectionName = "", isPending, onList }: ListModalProps) => {
  const COLORS = useThemeColors()
  const { currentLang, get, t } = useSafeTranslation
  const [prices, setPrices] = useState<string[]>(() => listableItems.map(() => ""))
  const [autoAdjust, setAutoAdjust] = useState(false)
  const durations = (() => {
    const rawDurations = get("Assets.marketplace.durations")

    if (Array.isArray(rawDurations)) {
      return rawDurations
        .map((duration) => (isDurationRecord(duration) ? { label: duration.label, value: Number(duration.value) } : null))
        .filter((duration): duration is Duration => duration !== null)
    }

    if (rawDurations && typeof rawDurations === "object") {
      return Object.values(rawDurations)
        .map((duration) => (isDurationRecord(duration) ? { label: duration.label, value: Number(duration.value) } : null))
        .filter((duration): duration is Duration => duration !== null)
    }

    return []
  })()
  const [selectedDurationValue, setSelectedDurationValue] = useState(15552000000)
  const [durationOpen, setDurationOpen] = useState(false)
  const [priceForAll, setPriceForAll] = useState("")
  const selectedDuration = durations.find((duration) => duration.value === selectedDurationValue) ?? durations[durations.length - 1]
  const formatCurrency = (value: number) => value.toLocaleString(currentLang, { style: "currency", currency: "USD" })

  useEffect(() => {
    setPrices(listableItems.map(() => ""))
  }, [listableItems, listableItems.length])

  const fee = 0.08
  const totalProceeds = prices.reduce((acc, p) => {
    const n = parseFloat(p)
    return acc + (isNaN(n) ? 0 : n * (1 - fee))
  }, 0)

  const setAll = (value: string) => {
    setPriceForAll(value)
    const n = parseFloat(value)
    if (!isNaN(n)) {
      setPrices(listableItems.map(() => (autoAdjust ? (n / 0.92).toFixed(4) : n.toFixed(4))))
    }
  }

  const setFloorForAll = () => {
    if (!floorPrice) return
    const fp = new Decimal(floorPrice)
    const adjusted = autoAdjust ? fp.div(0.92) : fp
    const str = adjusted.toNumber().toFixed(4)
    setPriceForAll(str)
    setPrices(listableItems.map(() => str))
  }

  const handleList = async () => {
    const parsed = prices.map((p) => parseFloat(p) || 0)
    await onList({ prices: parsed, duration: selectedDuration?.value ?? 15552000000, autoAdjust })
  }

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <View style={modalStyles.modalOverlay}>
        <Animated.View entering={FadeInUp.duration(280)} style={modalStyles.modalSheet}>
          {/* Header */}
          <View style={modalStyles.modalHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Tag size={17} color="#e5e7eb" />
              <Text style={modalStyles.modalTitle}>{t("Assets.marketplace.listItems")}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <TouchableOpacity onPress={() => setAutoAdjust((v) => !v)} style={modalStyles.toggleRow} activeOpacity={0.7}>
                <Text style={modalStyles.toggleLabel}>{t("Assets.marketplace.autoAdjustForFees")}</Text>
                <View style={[modalStyles.toggleTrack, { backgroundColor: autoAdjust ? COLORS.primary[500] : "#2a2a2a" }]}>
                  <View style={[modalStyles.toggleThumb, { transform: [{ translateX: autoAdjust ? 16 : 2 }] }]} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Live floor + set-all row */}
          <View style={modalStyles.modalRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={modalStyles.liveIndicator} />
              <Text style={modalStyles.liveLabel}>{t("Assets.marketplace.liveFloor")}</Text>
              <Text style={modalStyles.floorValue}>{floorPrice ? formatCurrency(new Decimal(floorPrice).toNumber()) : "--"}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={modalStyles.mutedText}>{t("Assets.marketplace.setAllTo")}</Text>
              <TouchableOpacity onPress={setFloorForAll} style={modalStyles.outlineBtn} activeOpacity={0.7}>
                <Text style={modalStyles.outlineBtnText}>{t("Assets.marketplace.floor")}</Text>
              </TouchableOpacity>
              <TextInput
                value={priceForAll}
                onChangeText={setAll}
                placeholder="0.00"
                placeholderTextColor="#4b5563"
                keyboardType="decimal-pad"
                style={modalStyles.priceInput}
              />
            </View>
          </View>

          {/* Column headers */}
          <View style={[modalStyles.listItemRow, { paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#1f1f1f" }]}>
            <Text style={[modalStyles.mutedText, { flex: 1 }]}>
              {listableItems.length} {listableItems.length === 1 ? t("Assets.marketplace.item") : t("Assets.marketplace.items")}
            </Text>
            <Text style={[modalStyles.mutedText, { width: 72, textAlign: "right" }]}>{t("Assets.marketplace.proceeds")}</Text>
            <View style={{ width: 118 }} />
          </View>

          {/* Item rows */}
          <ScrollView style={{ maxHeight: 190 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 4 }} showsVerticalScrollIndicator={false}>
            {listableItems.map((item, index) => (
              <View key={item.id + index} style={modalStyles.listItemRow}>
                <Text style={modalStyles.listItemName} numberOfLines={1}>
                  {collectionName} #{item.numId}
                </Text>
                <Text style={modalStyles.proceedsText}>{formatCurrency(new Decimal(parseFloat(prices[index] ?? "0") || 0).mul(0.92).toNumber())}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <TouchableOpacity
                    style={modalStyles.stepBtn}
                    onPress={() => {
                      const n = parseFloat(prices[index] ?? "0") || 0
                      const updated = [...prices]
                      updated[index] = Math.max(0, n - 1).toFixed(4)
                      setPrices(updated)
                    }}
                  >
                    <Minus size={11} color="#e5e7eb" />
                  </TouchableOpacity>
                  <TextInput
                    value={prices[index]}
                    onChangeText={(v) => {
                      const updated = [...prices]
                      if (!isNaN(new Decimal(v || "0").toNumber())) {
                        updated[index] = autoAdjust ? new Decimal(v || "0").div(0.92).toFixed(4) : v
                      } else {
                        updated[index] = v
                      }
                      setPrices(updated)
                    }}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="#4b5563"
                    style={[modalStyles.priceInput, { width: 78 }]}
                  />
                  <TouchableOpacity
                    style={modalStyles.stepBtn}
                    onPress={() => {
                      const n = parseFloat(prices[index] ?? "0") || 0
                      const updated = [...prices]
                      updated[index] = (n + 1).toFixed(4)
                      setPrices(updated)
                    }}
                  >
                    <Plus size={11} color="#e5e7eb" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Fee + proceeds summary */}
          <View style={modalStyles.summaryRow}>
            <View>
              <Text style={modalStyles.summaryLabel}>{t("Assets.marketplace.marketplaceFee")}</Text>
              <Text style={modalStyles.summaryValue}>8%</Text>
            </View>
            <View>
              <Text style={[modalStyles.summaryLabel, { textAlign: "right" }]}>{t("Assets.marketplace.totalEstProceeds")}</Text>
              <Text style={[modalStyles.summaryValue, { textAlign: "right" }]}>{formatCurrency(totalProceeds)}</Text>
            </View>
          </View>

          {/* Duration */}
          <View style={modalStyles.durationRow}>
            <View>
              <Text style={modalStyles.mutedText}>{t("Assets.marketplace.expires")}</Text>
              <Text style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}>
                {new Date(Date.now() + (selectedDuration?.value ?? 15552000000)).toLocaleDateString(currentLang, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Text style={modalStyles.mutedText}>{t("Assets.marketplace.duration")}</Text>
              <TouchableOpacity onPress={() => setDurationOpen((v) => !v)} style={modalStyles.durationBtn} activeOpacity={0.7}>
                <Text style={{ color: "#e5e7eb", fontSize: 13 }}>{selectedDuration?.label ?? ""}</Text>
                <ChevronDown size={13} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          {durationOpen && (
            <View style={modalStyles.durationDropdown}>
              {durations.map((d) => (
                <TouchableOpacity
                  key={d.value}
                  style={modalStyles.durationOption}
                  onPress={() => {
                    setSelectedDurationValue(d.value)
                    setDurationOpen(false)
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: "#e5e7eb", fontSize: 13 }}>{d.label}</Text>
                  {d.value === selectedDurationValue && <Check size={13} color={COLORS.primary[500]} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Footer */}
          <View style={modalStyles.modalFooter}>
            <TouchableOpacity
              onPress={handleList}
              disabled={listableItems.length === 0 || isPending}
              activeOpacity={0.8}
              style={[
                modalStyles.modalPrimaryBtn,
                {
                  backgroundColor: COLORS.primary[500],
                  opacity: listableItems.length === 0 || isPending ? 0.45 : 1,
                },
              ]}
            >
              {isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={modalStyles.modalBtnText}>
                  {t("Assets.marketplace.list")} {listableItems.length}{" "}
                  {listableItems.length === 1 ? t("Assets.marketplace.item") : t("Assets.marketplace.items")}
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

export default ListModal
