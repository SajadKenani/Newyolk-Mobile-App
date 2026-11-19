import type { useThemeColors } from "@/config/colors"
import { memo, useCallback, useMemo, useState } from "react"
import { Animated, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import Text from "@/components/native/text"
import { Check, ChevronUp } from "lucide-react-native"

type ThemeColors = ReturnType<typeof useThemeColors>

interface DraggableSheetProps {
  COLORS: ThemeColors
  tabs: { key: string; label: string }[]
  selectedTab: string
  setSelectedTab: (tab: string) => void
  insetsBottom: number
}

export const DraggableSheet = memo<DraggableSheetProps>(
  ({ COLORS, tabs, selectedTab, setSelectedTab, insetsBottom }) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const styles = useMemo(() => createStyles(COLORS), [COLORS])

    const chevronRotation = isSheetOpen ? "180deg" : "0deg"

    const openSheet = () => setIsSheetOpen(true)
    const closeSheet = useCallback(() => setIsSheetOpen(false), [])

    const handleSelectTab = useCallback(
      (tab: string) => {
        setSelectedTab(tab)
        closeSheet()
      },
      [closeSheet, setSelectedTab],
    )

    return (
      <>
        {!isSheetOpen && (
          <TouchableOpacity onPress={openSheet} activeOpacity={0.8} style={styles.closedHandle}>
            <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
              <ChevronUp size={24} color={COLORS.white} strokeWidth={3} />
            </Animated.View>
          </TouchableOpacity>
        )}

        <Modal visible={isSheetOpen} animationType="slide" transparent onRequestClose={closeSheet}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={closeSheet}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>

            <View style={[styles.sheet, { paddingBottom: Math.max(insetsBottom, 16) + 20 }]}>
              <TouchableOpacity onPress={closeSheet} style={styles.handleArea} activeOpacity={0.8}>
                <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
                  <ChevronUp size={24} color={COLORS.white} strokeWidth={3} />
                </Animated.View>
              </TouchableOpacity>

              <View style={styles.dragIndicator} />

              <View style={{ paddingBottom: Math.max(insetsBottom, 8) + 20 }}>
                {tabs.map((tab) => {
                  const isSelected = selectedTab === tab.key
                  return (
                    <TouchableOpacity key={tab.key} onPress={() => handleSelectTab(tab.key)} style={styles.listItem}>
                      <Text style={isSelected ? styles.listItemTextSelected : styles.listItemText}>{tab.label}</Text>
                      {isSelected && (
                        <View style={styles.checkContainer}>
                          <Check size={16} color={COLORS.white} />
                        </View>
                      )}
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </View>
        </Modal>
      </>
    )
  },
  (prevProps, nextProps) =>
    prevProps.selectedTab === nextProps.selectedTab &&
    prevProps.tabs === nextProps.tabs &&
    prevProps.insetsBottom === nextProps.insetsBottom &&
    prevProps.COLORS === nextProps.COLORS,
)

const createStyles = (COLORS: ThemeColors) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "transparent",
    },
    modalOverlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    closedHandle: {
      position: "absolute",
      alignSelf: "center",
      width: "100%",
      height: 56,
      borderTopWidth: 1,
      borderColor: COLORS.zinc[800],
      backgroundColor: "black",
      alignItems: "center",
      justifyContent: "center",
      elevation: 6,
      borderRadius: 100,
      zIndex: 10,
      bottom: 0,
    },
    sheet: {
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      backgroundColor: COLORS.zinc[950],
      borderWidth: 1.5,
      borderColor: COLORS.zinc[800],
      paddingTop: 8,
      paddingHorizontal: 0,
    },
    handleArea: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 16,
      paddingBottom: 16,
      backgroundColor: "transparent",
    },
    dragIndicator: {
      alignItems: "center",
      paddingBottom: 24,
    },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 24,
      marginHorizontal: 16,
      marginVertical: 4,
      borderRadius: 16,
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: COLORS.zinc[800],
    },
    listItemSelected: {
      backgroundColor: COLORS.primary[500] + "20",
      borderColor: COLORS.primary[500],
    },
    listItemText: {
      fontSize: 16,
      color: COLORS.white,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    listItemTextSelected: {
      fontSize: 16,
      color: COLORS.primary[400],
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    checkContainer: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: COLORS.primary[500],
      alignItems: "center",
      justifyContent: "center",
    },
  })

interface DraggableSheetWrapperProps {
  COLORS: ThemeColors
  tabs: { key: string; label: string }[]
  selectedTab: string
  setSelectedTab: (tab: string) => void
  insetsBottom: number
}

export const DraggableSheetWrapper = memo<DraggableSheetWrapperProps>((props) => <DraggableSheet {...props} />)
