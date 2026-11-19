import { StyleSheet, View } from "react-native"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { Activity } from "lucide-react-native"

export const ActivityBar = () => {
  const COLORS = useThemeColors()
  const { t, currentLang } = useSafeTranslation
  const isEn = currentLang === "en"

  const dots = (
    <View style={styles.dotsRow}>
      <View style={styles.dot} />
      <View style={[styles.dot, styles.dotMid]} />
      <View style={[styles.dot, styles.dotFaint]} />
    </View>
  )

  const content = (
    <View style={styles.contentRow}>
      <View style={[styles.iconBox, { backgroundColor: COLORS.primary[600] }]}>
        <Activity size={20} color="white" strokeWidth={2.5} />
      </View>
      <View>
        <Text style={[styles.subLabel, { color: COLORS.zinc[500] }]}>{t.Marketplace.recentSales}</Text>
        <Text style={styles.mainLabel}>{t.Marketplace.activityFeed}</Text>
      </View>
    </View>
  )

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: COLORS.zinc[900],
            borderColor: COLORS.zinc[800],
          },
        ]}
      >
        {isEn ? (
          <>
            {content}
            {dots}
          </>
        ) : (
          <>
            {dots}
            {content}
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 14,
    backgroundColor: "transparent",
    height: 70,
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
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    height: 40,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  subLabel: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    opacity: 0.9,
  },
  mainLabel: {
    fontSize: 18,
    color: "#ffffff",
    marginTop: 2,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 6,
    width: 6,
    backgroundColor: "#ffffff",
    borderRadius: 3,
  },
  dotMid: {
    opacity: 0.6,
  },
  dotFaint: {
    opacity: 0.3,
  },
})
