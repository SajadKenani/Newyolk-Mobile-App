import { useState } from "react"
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native"

import type { RouterOutputs } from "@newyolk/api"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { api } from "@/config/react-provider"
import { createFeedingStyles } from "../utils/style"
import { colors } from "../utils/types"
import { FeedingCard } from "../utils/helpers"
import { useThemeColors } from "@/config/colors"

export const FeedingTab = ({ initialData }: { initialData: RouterOutputs["history"]["feedingLedger"] }) => {
  const [cursor, setCursor] = useState<number | undefined>(undefined)
  const { t } = useSafeTranslation

  const C = useThemeColors()
  const styles = createFeedingStyles(C)

  const { data, isLoading } = api.history.feedingLedger.useQuery(
    { cursor, limit: 20 },
    {
      initialData: cursor === undefined ? initialData : undefined,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  )

  const handleNextPage = () => data?.nextCursor && setCursor(data.nextCursor)
  const handlePreviousPage = () => setCursor(undefined)

  // ── Loading ──
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  // ── Empty ──
  if (!data?.items.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>{t.History.feeding.empty}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data.items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <FeedingCard item={item} />}
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
            onPress={handlePreviousPage}
            disabled={!cursor}
            activeOpacity={0.7}
          >
            <Text style={[styles.paginationBtnText, !cursor && styles.paginationBtnTextDisabled]}>{t("AccountHistory.pagination.previous") ?? "Previous"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paginationBtn, !data.nextCursor && styles.paginationBtnDisabled]}
            onPress={handleNextPage}
            disabled={!data.nextCursor}
            activeOpacity={0.7}
          >
            <Text style={[styles.paginationBtnText, !data.nextCursor && styles.paginationBtnTextDisabled]}>
              {t("AccountHistory.pagination.next") ?? "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
