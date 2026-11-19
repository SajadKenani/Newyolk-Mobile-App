import type { BetterAuthSession } from "@/components/types/interface"
import { useMemo } from "react"
import { View } from "react-native"
import { Skeleton } from "@/components/helpers/skeleton"
import { useThemeColors } from "@/config/colors"
import { createStyles } from "../store/styles"

const SkeletalLevelCard: React.FC<{
  level?: { tier?: string }
  index?: number
  session?: BetterAuthSession | null
}> = () => {
  const COLORS = useThemeColors()
  const styles = useMemo(() => createStyles(COLORS), [COLORS])

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <View style={styles.badgesContainer}>
              <Skeleton colorMode="dark" height={22} radius={999} style={{ width: 82 }} />
            </View>
            <Skeleton colorMode="dark" height={24} radius={10} style={{ width: "58%" }} />
            <Skeleton colorMode="dark" height={14} radius={6} style={{ width: "72%", marginTop: 10 }} />
          </View>

          <View style={styles.pricePanel}>
            <Skeleton colorMode="dark" height={28} radius={10} style={{ width: 98 }} />
          </View>
        </View>
        <Skeleton colorMode="dark" height={44} radius={18} style={{ width: "100%", marginBottom: 22, marginTop: 20 }} />
      </View>
    </View>
  )
}

export default SkeletalLevelCard
