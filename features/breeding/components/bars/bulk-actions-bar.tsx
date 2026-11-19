import { View, TouchableOpacity, useWindowDimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { X } from "lucide-react-native"
import { useSafeTranslation } from "@/hooks/safe-translation"
import type { BulkActionsBarProps } from "../utils/types"
import { bulkActionStyles } from "../utils/styles"
import { SecondaryButton } from "../utils/helper"
import Text from "@/components/native/text"

const BulkActionsBar = ({
  idleCount,
  readyCount,
  selectedCount,
  selectedIdleCount,
  selectedReadyCount,
  onStartAllIdle,
  onFinishAllReady,
  onBulkStartSelected,
  onBulkFinishSelected,
  onDeselectAll,
  isStarting,
  isFinishing,
}: BulkActionsBarProps) => {
  const isMutating = isStarting || isFinishing
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const isTablet = width >= 768
  const { t } = useSafeTranslation

  const hasSelection = selectedCount > 0

  return (
    <View style={[bulkActionStyles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={[bulkActionStyles.inner, isTablet && bulkActionStyles.innerRow]}>
        {/* Left — selection label + deselect */}
        <View style={[bulkActionStyles.labelRow, isTablet && bulkActionStyles.labelRowTablet]}>
          <Text style={[bulkActionStyles.label, isTablet && bulkActionStyles.labelTablet]}>
            {hasSelection ? t.Breeding.selected.replace("{count}", String(selectedCount)) : t.Breeding.selected.replace("{count}", "0")}
          </Text>

          {hasSelection && (
            <TouchableOpacity
              onPress={onDeselectAll}
              disabled={isMutating}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={[bulkActionStyles.deselectBtn, isMutating && bulkActionStyles.disabled]}
            >
              <X size={16} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Right — action buttons */}
        <View style={bulkActionStyles.actions}>
          <SecondaryButton
            onPress={hasSelection ? onBulkStartSelected : onStartAllIdle}
            disabled={isMutating || (hasSelection ? selectedIdleCount === 0 : idleCount === 0)}
            loading={isStarting}
            flex
            variant="start"
          >
            {hasSelection
              ? t.Breeding.bulkStartSelected.replace("{count}", String(selectedIdleCount))
              : t.Breeding.startAllIdle.replace("{count}", String(idleCount))}
          </SecondaryButton>

          <SecondaryButton
            onPress={hasSelection ? onBulkFinishSelected : onFinishAllReady}
            disabled={isMutating || (hasSelection ? selectedReadyCount === 0 : readyCount === 0)}
            loading={isFinishing}
            flex
            variant="finish"
          >
            {hasSelection
              ? t.Breeding.bulkFinishSelected.replace("{count}", String(selectedReadyCount))
              : t.Breeding.finishAllReady.replace("{count}", String(readyCount))}
          </SecondaryButton>
        </View>
      </View>
    </View>
  )
}

export default BulkActionsBar
