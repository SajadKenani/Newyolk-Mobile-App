import { StyleSheet, View } from "react-native"
import { Skeleton } from "@/components/helpers/skeleton"
import { useThemeColors } from "@/config/colors"

const SkeletalAssetsCard = () => {
  const COLORS = useThemeColors()
  const styles = StyleSheet.create({
    container: {
      width: "47%",
    },
    card: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 16,
      borderColor: COLORS.zinc[700],
    },
    badgeWrap: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 40,
      zIndex: 50,
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-start",
      alignSelf: "stretch",
    },
    imageArea: {
      position: "relative",
      width: "100%",
      overflow: "hidden",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      aspectRatio: 1,
    },
    footerOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      width: "100%",
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      overflow: "hidden",
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: COLORS.black + "26",
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.badgeWrap}>
          <Skeleton colorMode="dark" height={24} radius={6} style={{ width: 112, marginLeft: 8 }} />
        </View>

        <View style={styles.imageArea}>
          <Skeleton colorMode="dark" radius={0} height={180} style={{ width: "100%", height: "100%" }} />

          <View style={styles.footerOverlay}>
            <View>
              <Skeleton colorMode="dark" height={16} radius={6} style={{ width: 120, marginBottom: 6 }} />
              <Skeleton colorMode="dark" height={12} radius={6} style={{ width: 100 }} />
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export { SkeletalAssetsCard }
