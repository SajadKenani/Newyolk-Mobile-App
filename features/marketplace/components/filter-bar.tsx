import { useEffect, useRef } from "react"
import { Animated, Modal, StyleSheet, TouchableOpacity, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { formatNumber } from "@/utils/format"
import { Check, ChevronsUpDown, ListFilter } from "lucide-react-native"

interface FilterOption {
  label: string
  value: string
}

interface FilterBarProps {
  listingCount: number
  selectedFilter: FilterOption
  filterOptions: FilterOption[]
  isFilterOpen: boolean
  isFetching: boolean
  listedLabel: string
  onFilterPress: () => void
  onFilterSelect: (filter: FilterOption) => void
}

export const FilterBar = ({
  listingCount,
  selectedFilter,
  filterOptions,
  isFilterOpen,
  isFetching,
  listedLabel,
  onFilterPress,
  onFilterSelect,
}: FilterBarProps) => {
  const COLORS = useThemeColors()
  const { t } = useSafeTranslation
  const pulseAnim = useRef(new Animated.Value(1))
  const rotateAnim = useRef(new Animated.Value(0))

  useEffect(() => {
    if (isFetching) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim.current, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim.current, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    } else {
      pulseAnim.current.setValue(1)
    }
  }, [isFetching])

  useEffect(() => {
    Animated.timing(rotateAnim.current, {
      toValue: isFilterOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [isFilterOpen])

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.bar,
          {
            borderColor: COLORS.zinc[800],
          },
        ]}
      >
        {/* Left side - Count */}
        <View style={styles.leftSide}>
          <ListFilter size={18} color={COLORS.zinc[500]} strokeWidth={2.5} />
          <View>
            <Text style={[styles.listedLabel, { color: COLORS.zinc[500] }]}>{listedLabel}</Text>
            <Text style={[styles.listingCount, { color: COLORS.white }]}>{formatNumber(listingCount)}</Text>
          </View>
        </View>

        {/* Right side - Filter dropdown */}
        <TouchableOpacity
          onPress={onFilterPress}
          style={[
            styles.filterButton,
            {
              shadowColor: COLORS.primary[500],
            },
          ]}
          disabled={isFetching}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[COLORS.primary[600], COLORS.primary[700]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradientPill, isFetching && styles.fetchingOpacity]}
          >
            <Text style={styles.filterLabel} numberOfLines={1}>
              {selectedFilter.label}
            </Text>
            <ChevronsUpDown size={18} color="white" strokeWidth={3} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal transparent visible={isFilterOpen} animationType="fade" onRequestClose={onFilterPress}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onFilterPress}>
          <View
            style={[
              styles.modalCard,
              {
                shadowColor: COLORS.primary[500],
              },
            ]}
          >
            {/* Header */}
            <View
              style={[
                styles.modalHeader,
                {
                  borderBottomColor: COLORS.zinc[800],
                },
              ]}
            >
              <Text style={styles.modalTitle}>{t.Marketplace.sortBy}</Text>
            </View>

            {/* Options */}
            <View>
              {filterOptions.map((filter) => {
                const isSelected = filter.value === selectedFilter.value
                return (
                  <TouchableOpacity
                    key={filter.value}
                    onPress={() => {
                      onFilterSelect(filter)
                      onFilterPress()
                    }}
                    style={[
                      styles.optionTouchable,
                      {
                        shadowColor: isSelected ? COLORS.primary[500] : "transparent",
                        elevation: isSelected ? 4 : 0,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    {isSelected ? (
                      <LinearGradient
                        colors={[COLORS.primary[500], COLORS.primary[600], COLORS.primary[700]]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.optionRow}
                      >
                        <View style={styles.optionLeft}>
                          <View style={styles.dotWhite} />
                          <Text style={styles.optionLabelSelected}>{filter.label}</Text>
                        </View>
                        <View style={styles.checkCircle}>
                          <Check size={16} color="white" strokeWidth={3} />
                        </View>
                      </LinearGradient>
                    ) : (
                      <View style={[styles.optionRow]}>
                        <View style={styles.optionLeft}>
                          <View style={[styles.dotColored]} />
                          <Text style={[styles.optionLabelUnselected, { color: COLORS.zinc[400] }]}>{filter.label}</Text>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 14,
    height: 76,
    width: "100%",
    zIndex: 999,
  },
  bar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    borderWidth: 1,
    height: 70,
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  listedLabel: {
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  listingCount: {
    fontSize: 20,
    marginTop: 2,
  },
  filterButton: {
    overflow: "hidden",
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  fetchingOpacity: {
    opacity: 0.6,
  },
  filterLabel: {
    fontSize: 14,
    color: "#ffffff",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    maxWidth: 384, // max-w-sm
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    // shadowOffset: { width: 0, height: 20 },
    // shadowOpacity: 0.3,
    // shadowRadius: 40,
    // elevation: 20,
  },
  modalHeader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    color: "#ffffff",
  },
  optionTouchable: {
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderRadius: 20
  },
  optionRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dotWhite: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
  },
  dotColored: {
    height: 8,
    width: 8,
    borderRadius: 4,
  },
  optionLabelSelected: {
    fontSize: 16,
    color: "#ffffff",
  },
  optionLabelUnselected: {
    fontSize: 16,
  },
  checkCircle: {
    height: 24,
    width: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
})
