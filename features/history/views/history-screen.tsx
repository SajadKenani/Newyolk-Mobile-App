import { useState } from "react"
import { Modal, Pressable, ScrollView, TouchableOpacity, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Header from "@/components/helpers/header"
import { LoadingSpinner } from "@/components/helpers/loading"
import { BonusesTab } from "@/features/history/components/tabs/bonuses-tab"
import { DepositsTab } from "@/features/history/components/tabs/deposits-tab"
import { FeedingTab } from "@/features/history/components/tabs/feeding-tab"
import { MarketplaceTab } from "@/features/history/components/tabs/marketplace-tab"
import { TransactionsTab } from "@/features/history/components/tabs/transactions-tab"
import { WithdrawalsTab } from "@/features/history/components/tabs/withdrawals-tab"
import { createHistoryStyles } from "@/features/history/components/utils/style"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { useScrollChrome } from "@/hooks/useScrollChrome"
import { api } from "@/config/react-provider"

type HistoryTab = "deposits" | "bonuses" | "withdrawals" | "feeding" | "transactions" | "marketplace"

const HistoryScreen = () => {
  const initialDeposits = api.history.deposits.useQuery({ limit: 20 })
  const initialBonuses = api.history.bonuses.useQuery({ limit: 20 })
  const initialWithdrawals = api.history.withdrawals.useQuery({ limit: 20 })
  const initialFeedingLedger = api.history.feedingLedger.useQuery({ limit: 20 })
  const initialTransactionLedger = api.history.transactionLedger.useQuery({ limit: 20 })
  const initialMarketplaceSold = api.history.marketplaceSold.useQuery({ limit: 20 })
  const initialMarketplacePurchased = api.history.marketplacePurchased.useQuery({ limit: 20 })

  const [activeTab, setActiveTab] = useState<HistoryTab>("deposits")
  const [isTabSelectOpen, setIsTabSelectOpen] = useState(false)

  const C = useThemeColors()
  const styles = createHistoryStyles(C)
  const { handleChromeScroll } = useScrollChrome({ hideOnScroll: false })

  const { t } = useSafeTranslation
  const tabOptions = [
    { value: "deposits", label: t("AccountHistory.tabs.deposits") },
    { value: "bonuses", label: t("AccountHistory.tabs.bonuses") },
    { value: "withdrawals", label: t("AccountHistory.tabs.withdrawals") },
    { value: "feeding", label: t("AccountHistory.tabs.feeding") },
    { value: "transactions", label: t("AccountHistory.tabs.transactions") },
    { value: "marketplace", label: t("AccountHistory.tabs.marketplace") },
  ] as const satisfies readonly { value: HistoryTab; label: string }[]

  if (
    !initialDeposits.data ||
    !initialBonuses.data ||
    !initialWithdrawals.data ||
    !initialFeedingLedger.data ||
    !initialTransactionLedger.data ||
    !initialMarketplaceSold.data ||
    !initialMarketplacePurchased.data
  ) {
    return <LoadingSpinner />
  }

  const renderTab = () => {
    switch (activeTab) {
      case "deposits":
        return <DepositsTab initialData={initialDeposits.data} />
      case "bonuses":
        return <BonusesTab initialData={initialBonuses.data} />
      case "withdrawals":
        return <WithdrawalsTab initialData={initialWithdrawals.data} />
      case "feeding":
        return <FeedingTab initialData={initialFeedingLedger.data} />
      case "transactions":
        return <TransactionsTab initialData={initialTransactionLedger.data} />
      case "marketplace":
        return <MarketplaceTab initialMarketplaceSold={initialMarketplaceSold.data} initialMarketplacePurchased={initialMarketplacePurchased.data} />
      default:
        return null
    }
  }

  const activeTabLabel = tabOptions.find((tab) => tab.value === activeTab)?.label ?? t("AccountHistory.title")

  return (
    <>
      <Header title={t("AccountHistory.title")} transparent={true} showMenuButton={true} />
      <View style={styles.container}>
        <View style={styles.contentShell}>
          {/* <View style={styles.contentHeader}>
            <Text style={styles.contentEyebrow}>{t("AccountHistory.title")}</Text>
            <Text style={styles.contentTitle}>{activeTabLabel}</Text>
          </View> */}

          <ScrollView
            style={styles.tabContent}
            contentContainerStyle={styles.tabContentInner}
            showsVerticalScrollIndicator={false}
            onScroll={handleChromeScroll}
            scrollEventThrottle={16}
          >
            {renderTab()}
          </ScrollView>
        </View>

        <View style={styles.heroCard}>
          <LinearGradient colors={[C.primary[500] + "18", "transparent"]} start={{ x: 0.08, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroSheen} />
          {/* <View pointerEvents="none" style={styles.heroOrb} />
          <View pointerEvents="none" style={styles.heroEdgeOrb} />
          <View pointerEvents="none" style={styles.heroInnerRing} />

          <Text style={styles.heroEyebrow}>{t("AccountHistory.title")}</Text>
          <Text style={styles.heroTitle}>{activeTabLabel}</Text>
          <Text style={styles.heroDescription}>{t("AccountHistory.title")}</Text> */}

          <TouchableOpacity style={styles.selectTrigger} onPress={() => setIsTabSelectOpen(true)} activeOpacity={0.8}>
            <Text style={styles.selectTriggerText}>{activeTabLabel}</Text>
          </TouchableOpacity>

          <Modal transparent visible={isTabSelectOpen} animationType="fade" onRequestClose={() => setIsTabSelectOpen(false)}>
            <Pressable style={styles.modalOverlay} onPress={() => setIsTabSelectOpen(false)}>
              <View style={styles.modalSheet}>
                {tabOptions.map((tab) => (
                  <TouchableOpacity
                    key={tab.value}
                    style={[styles.modalOption, tab.value === activeTab && styles.modalOptionActive]}
                    onPress={() => {
                      setActiveTab(tab.value)
                      setIsTabSelectOpen(false)
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.modalOptionText, tab.value === activeTab && styles.modalOptionTextActive]}>{tab.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Pressable>
          </Modal>
        </View>
      </View>
    </>
  )
}

export default HistoryScreen
