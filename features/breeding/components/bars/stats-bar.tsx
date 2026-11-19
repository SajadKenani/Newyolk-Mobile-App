import { useSafeTranslation } from "@/hooks/safe-translation"
// import Decimal from "decimal.js"
import {
  CheckCircle,
  Circle,
  // Clock,
  Coins,
  // Repeat,
  Timer,
  Users,
  // Wallet
} from "lucide-react-native"
import { View } from "react-native"
// import { PILL_COLORS } from "../utils/types"
import type {
  // ColorKey,
  StatsBarProps,
} from "../utils/types"
import { statBarstyles } from "../utils/styles"
import {
  // formatDuration,
  Pill,
} from "../utils/helper"

const StatsBar = ({
  stats,
  totalRoosters,
  // yolkBalance,
  breedingPriceInYolk,
  // breedingDuration
}: StatsBarProps) => {
  const { t } = useSafeTranslation
  // const price = new Decimal(breedingPriceInYolk)
  // const affordableBreeds = price.gt(0) ? Math.floor(new Decimal(yolkBalance).div(price).toNumber()) : 0
  // const walletColor: ColorKey = affordableBreeds >= stats.idle ? "green" : affordableBreeds > 0 ? "amber" : "red"
  // const durationMs = Number(breedingDuration)
  const iconSize = 16
  const mutedColor = "#9ca3af"

  return (
    <View style={statBarstyles.tabList}>
      <Pill icon={<Users size={iconSize} color={mutedColor} />} label={t.Breeding.totalRoosters} value={String(totalRoosters)} />
      <Pill icon={<Circle size={iconSize} color="#4ade80" />} label={t.Breeding.idle} value={String(stats.idle)} color="green" />
      <Pill icon={<Timer size={iconSize} color="#fbbf24" />} label={t.Breeding.breeding} value={String(stats.breeding)} color="amber" />
      <Pill icon={<CheckCircle size={iconSize} color="#60a5fa" />} label={t.Breeding.ready} value={String(stats.ready)} color="blue" />
      <Pill icon={<Coins size={iconSize} color={mutedColor} />} label={t.Breeding.breedingCost} value={breedingPriceInYolk} suffix="YOLK" />
      {/* 
      <Pill
        icon={<Clock size={iconSize} color={mutedColor} />}
        label={t.Breeding.breedingDuration}
        value={formatDuration(durationMs)}
      /> */}
      {/* 
      <Pill
        icon={<Wallet size={iconSize} color={PILL_COLORS[walletColor].text} />}
        label={t.Breeding.yolkBalance}
        value={new Decimal(yolkBalance).toFixed(0)}
        extra={t.Breeding.canBreed.replace("{count}", String(affordableBreeds))}
        color={walletColor}
      /> */}

      {/* <Pill
        icon={<Repeat size={iconSize} color={mutedColor} />}
        label={t.Breeding.totalBreeds}
        value={String(stats.totalBreeds)}
      /> */}
    </View>
  )
}

export default StatsBar
