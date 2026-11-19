import { Pressable, TouchableOpacity, View } from "react-native"
import type { BadgeVariant, BonusItem, DepositItem, FeedingItem, LedgerItem, ListingItem, SubTab, WithdrawalItem } from "./types"
import { getStatusVariant, colors, formatDecimal, formatAmount, formatItem, formatType } from "./types"
import Text from "@/components/native/text"
import { createBonusesStyles, createDepositStyles, createFeedingStyles, createMarketplaceStyles, createTransactionsStyles, createWithdrawStyles } from "./style"
import Decimal from "decimal.js"
import { format } from "date-fns"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { useState } from "react"
import { FlatList } from "react-native"
import { ActivityIndicator } from "react-native"
import { Modal } from "react-native"
import { useThemeColors } from "@/config/colors"

export const Badge = ({ variant = "outline", label }: { variant?: BadgeVariant; label: string }) => {
  const scheme = colors.badge[variant]
  const C = useThemeColors()
  const styles = createBonusesStyles(C)
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: scheme.bg,
          borderColor: variant === "outline" ? colors.border : "transparent",
          borderWidth: variant === "outline" ? 1 : 0,
        },
      ]}
    >
      <Text style={[styles.badgeText, { color: scheme.text }]}>{label}</Text>
    </View>
  )
}

export const BonusCard = ({ item }: { item: BonusItem }) => {
  const C = useThemeColors()
  const styles = createBonusesStyles(C)
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.itemName}>{item.item}</Text>
          <Text style={styles.dateText}>{format(new Date(item.createdAt), "PPp")}</Text>
        </View>
        <Badge variant={getStatusVariant(item.status)} label={item.status} />
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.amountText}>{new Decimal(item.amount.toString()).toFixed(2)}</Text>
        <Text style={styles.valueText}>${new Decimal(item.valueInUsd.toString()).toFixed(2)}</Text>
      </View>
    </View>
  )
}

export const DepositCard = ({ item }: { item: DepositItem }) => {
  const C = useThemeColors()
  const styles = createDepositStyles(C)
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.itemName}>{item.item}</Text>
          <Text style={styles.dateText}>{format(new Date(item.createdAt), "PPp")}</Text>
        </View>
        <Badge variant={getStatusVariant(item.status)} label={item.status} />
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.itemAmount}>{item.itemAmount}x</Text>
        <Text style={styles.valueText}>${new Decimal(item.valueInUsd.toString()).toFixed(2)}</Text>
      </View>
    </View>
  )
}

export const StatChip = ({ label, value }: { label: string; value: string }) => {
  const C = useThemeColors()
  const styles = createFeedingStyles(C)
  return (
    <View style={styles.chip}>
      <Text style={styles.chipLabel}>{label}</Text>
      <Text style={styles.chipValue}>{value}</Text>
    </View>
  )
}

export const FeedingCard = ({ item }: { item: FeedingItem }) => {
  const { t } = useSafeTranslation

  const C = useThemeColors()
  const styles = createFeedingStyles(C)
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.modelText}>{item.model}</Text>
          <Text style={styles.dateText}>{format(new Date(item.createdAt), "PPp")}</Text>
        </View>
        <View style={styles.cardHeaderRight}>
          <Text style={styles.netUsdAmount}>${formatDecimal(item.netUsd)}</Text>
          <Text style={styles.netUsdLabel}>{t("AccountHistory.feeding.table.netUsd")}</Text>
        </View>
      </View>

      <View style={styles.chipRow}>
        <StatChip label={t("AccountHistory.feeding.table.food")} value={formatDecimal(item.food)} />
        <StatChip label={t("AccountHistory.feeding.table.reward")} value={formatDecimal(item.reward)} />
        <StatChip label={t("AccountHistory.feeding.table.netReward")} value={formatDecimal(item.netReward)} />
      </View>
    </View>
  )
}

export const SubTabSelect = ({ value, options, onChange }: { value: SubTab; options: { value: SubTab; label: string }[]; onChange: (v: SubTab) => void }) => {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)

  const C = useThemeColors()
  const styles = createMarketplaceStyles(C)
  return (
    <>
      <TouchableOpacity style={styles.selectTrigger} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <Text style={styles.selectTriggerText}>{selected?.label ?? value}</Text>
        <Text style={styles.selectChevron}>▾</Text>
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <View style={styles.modalSheet}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.modalOption, opt.value === value && styles.modalOptionActive]}
                onPress={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalOptionText, opt.value === value && styles.modalOptionTextActive]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

export const TabBar = ({ value, options, onChange }: { value: SubTab; options: { value: SubTab; label: string }[]; onChange: (v: SubTab) => void }) => {
  const C = useThemeColors()
  const styles = createMarketplaceStyles(C)
  return (
    <View style={styles.tabBar}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.tabBarItem, opt.value === value && styles.tabBarItemActive]}
          onPress={() => onChange(opt.value)}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabBarItemText, opt.value === value && styles.tabBarItemTextActive]}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const ListingCard = ({ item }: { item: ListingItem }) => {
  const { t } = useSafeTranslation

  const C = useThemeColors()
  const styles = createMarketplaceStyles(C)
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.itemName}>{formatItem(item.item)}</Text>
          <Text style={styles.dateText}>{item.settledAt ? format(new Date(item.settledAt), "PPp") : "-"}</Text>
        </View>
        <Text style={styles.usdValue}>${formatDecimal(item.settledValueInUsd?.toString() ?? "")}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.labelText}>{t.History.marketplace.table.price}</Text>
        <Text style={styles.priceText}>
          {formatDecimal(item.settledPrice?.toString() ?? "")} <Text style={styles.currencyText}>{item.currency.toUpperCase()}</Text>
        </Text>
      </View>
    </View>
  )
}

export const ContentPanel = ({
  data,
  isLoading,
  cursor,
  handlePrevious,
  handleNext,
}: {
  data: { items: ListingItem[]; nextCursor?: number } | undefined
  isLoading: boolean
  cursor: number | undefined
  handlePrevious: () => void
  handleNext: () => void
}) => {
  const { t } = useSafeTranslation

  const C = useThemeColors()
  const styles = createMarketplaceStyles(C)
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (!data?.items.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>{t("AccountHistory.marketplace.empty")}</Text>
      </View>
    )
  }

  return (
    <View style={styles.panelContainer}>
      <FlatList
        data={data.items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ListingCard item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={false}
      />

      {/* Pagination */}
      <View style={styles.pagination}>
        <Text style={styles.paginationInfo}>
          {t("AccountHistory.pagination.showing") ?? "Showing"} {data.items.length}
        </Text>
        <View style={styles.paginationButtons}>
          <TouchableOpacity
            style={[styles.paginationBtn, !cursor && styles.paginationBtnDisabled]}
            onPress={handlePrevious}
            disabled={!cursor}
            activeOpacity={0.7}
          >
            <Text style={[styles.paginationBtnText, !cursor && styles.paginationBtnTextDisabled]}>{t("AccountHistory.pagination.previous") ?? "Previous"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paginationBtn, !data.nextCursor && styles.paginationBtnDisabled]}
            onPress={handleNext}
            disabled={!data.nextCursor}
            activeOpacity={0.7}
          >
            <Text style={[styles.paginationBtnText, !data.nextCursor && styles.paginationBtnTextDisabled]}>{t("History.pagination.next") ?? "Next"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const CommodityChip = ({ label, value }: { label: string; value: string }) => {
  const C = useThemeColors()
  const styles = createTransactionsStyles(C)

  return (
    <View style={styles.chip}>
      <Text style={styles.chipLabel}>{label}</Text>
      <Text style={styles.chipValue}>{value}</Text>
    </View>
  )
}

export const TransactionCard = ({ item }: { item: LedgerItem }) => {
  const { t } = useSafeTranslation
  const C = useThemeColors()
  const styles = createTransactionsStyles(C)
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{formatType(item.type)}</Text>
          </View>
          <Text style={styles.dateText}>{format(new Date(item.createdAt), "PPp")}</Text>
        </View>
        <Text style={styles.usdAmount}>${formatDecimal(item.usd)}</Text>
      </View>

      <View style={styles.chipRow}>
        <CommodityChip label={t("AccountHistory.transactions.table.egg")} value={formatDecimal(item.egg, 0)} />
        <CommodityChip label={t("AccountHistory.transactions.table.corn")} value={formatDecimal(item.corn, 0)} />
        <CommodityChip label={t("AccountHistory.transactions.table.milk")} value={formatDecimal(item.milk, 0)} />
        <CommodityChip label={t("AccountHistory.transactions.table.hay")} value={formatDecimal(item.hay, 0)} />
      </View>
    </View>
  )
}

export const WithdrawalCard = ({ item }: { item: WithdrawalItem }) => {
  const { t } = useSafeTranslation

  const C = useThemeColors()
  const styles = createWithdrawStyles(C)
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.dateText}>{format(new Date(item.createdAt), "PPp")}</Text>
        <Badge variant={getStatusVariant(item.status)} label={item.status} />
      </View>

      <View style={styles.cardGrid}>
        <View style={styles.cardGridItem}>
          <Text style={styles.labelText}>{t("AccountHistory.withdrawals.table.baseAmount")}</Text>
          <Text style={styles.valueText}>
            {formatAmount(item.baseAmount)} <Text style={styles.currencyText}>{item.baseCurrency.toUpperCase()}</Text>
          </Text>
        </View>
        <View style={styles.cardGridItem}>
          <Text style={styles.labelText}>{t("AccountHistory.withdrawals.table.withdrawAmount")}</Text>
          <Text style={styles.valueText}>
            {formatAmount(item.withdrawAmount)} <Text style={styles.currencyText}>{item.withdrawCurrency.toUpperCase()}</Text>
          </Text>
        </View>
      </View>

      <Text style={styles.commissionText}>
        {t("AccountHistory.withdrawals.table.commission")}: {formatAmount(item.comission)}
      </Text>
    </View>
  )
}
