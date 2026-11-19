import { StyleSheet, View } from "react-native"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { TrendingUp } from "lucide-react-native"

export const SalesBar = () => {
  const { t, currentLang } = useSafeTranslation
  const COLORS = useThemeColors()
  const styles = StyleSheet.create({
    wrapper: {
      paddingHorizontal: 16,
      paddingTop: 14,
      height: 70,
      zIndex: 999,
      backgroundColor: "transparent",
    },
    container: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 16,
      backgroundColor: COLORS.zinc[900],
      borderWidth: 1,
      borderColor: COLORS.zinc[800],
    },
    sectionRow: {
      flexDirection: "row",
      alignItems: "center",
      columnGap: 12,
    },
    iconBox: {
      height: 40,
      width: 48,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      backgroundColor: COLORS.primary[600],
    },
    label: {
      fontSize: 12,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      opacity: 0.9,
      color: COLORS.zinc[500],
    },
    title: {
      fontSize: 18,
      color: COLORS.white,
      marginTop: 2,
    },
    dotsRow: {
      flexDirection: "row",
      alignItems: "center",
      columnGap: 6,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 999,
      backgroundColor: COLORS.white,
    },
    dotMedium: {
      opacity: 0.6,
    },
    dotLow: {
      opacity: 0.3,
    },
  })

  const dots = (
    <View style={styles.dotsRow}>
      <View style={styles.dot} />
      <View style={[styles.dot, styles.dotMedium]} />
      <View style={[styles.dot, styles.dotLow]} />
    </View>
  )

  const labelBlock = (
    <View>
      <Text style={styles.label}>{t.Marketplace.analytics}</Text>
      <Text style={styles.title}>{t.Marketplace.salesActivity}</Text>
    </View>
  )

  const iconBlock = (
    <View style={styles.iconBox}>
      <TrendingUp size={20} color="white" strokeWidth={2.5} />
    </View>
  )

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {currentLang === "en" ? (
          <>
            <View style={styles.sectionRow}>
              {iconBlock}
              {labelBlock}
            </View>

            {dots}
          </>
        ) : (
          <>
            {dots}

            <View style={styles.sectionRow}>
              {labelBlock}
              {iconBlock}
            </View>
          </>
        )}
      </View>
    </View>
  )
}
