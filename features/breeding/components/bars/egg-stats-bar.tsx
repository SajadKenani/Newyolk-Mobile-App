import { useSafeTranslation } from "@/hooks/safe-translation"
import Decimal from "decimal.js"
import { CheckCircle, Circle, Clock, Coins, Timer, Users, Wallet } from "lucide-react-native"
import { ScrollView, View } from "react-native"
import { PILL_COLORS } from "../utils/types"
import type { EggStatsBarProps, PillProps } from "../utils/types"
import { eggStatStyles } from "../utils/styles"
import { formatDuration } from "../utils/helper"
import Text from "@/components/native/text"

const CompactPill = ({
  icon,
  label,
  value,
  suffix,
  extra,
  color = "default",
}: {
  icon: React.ReactNode
  label: string
  value: string
  suffix?: string
  extra?: string
  color?: PillProps["color"]
}) => {
  const palette = PILL_COLORS[color ?? "default"]

  return (
    <View style={[eggStatStyles.pill, { backgroundColor: palette.bg, borderColor: palette.border }]}>
      <View style={eggStatStyles.pillIcon}>{icon}</View>
      <Text style={[eggStatStyles.pillLabel, { color: palette.text }]} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[eggStatStyles.pillValue, { color: palette.value }]} numberOfLines={1}>
        {value}
      </Text>
      {suffix ? (
        <Text style={[eggStatStyles.pillLabel, { color: palette.text }]} numberOfLines={1}>
          {suffix}
        </Text>
      ) : null}
      {extra ? (
        <>
          <Text style={[eggStatStyles.pillDot, { color: palette.text }]}>·</Text>
          <Text style={[eggStatStyles.pillLabel, { color: palette.text }]} numberOfLines={1}>
            {extra}
          </Text>
        </>
      ) : null}
    </View>
  )
}

const EggStatsBar = ({ stats, totalEggs, yolkBalance, hatchingPriceInYolk, hatchingDuration }: EggStatsBarProps) => {
  const price = new Decimal(hatchingPriceInYolk)
  const affordableIncubations = price.gt(0) ? Math.floor(new Decimal(yolkBalance).div(price).toNumber()) : 0

  const walletColor: PillProps["color"] = affordableIncubations >= stats.idle ? "green" : affordableIncubations > 0 ? "amber" : "red"

  const durationMs = Number(hatchingDuration)
  const iconSize = 12
  const mutedColor = "#9ca3af"
  const { t } = useSafeTranslation
  return (
    <ScrollView style={eggStatStyles.scroll} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={eggStatStyles.row}>
      <CompactPill icon={<Users size={iconSize} color={mutedColor} />} label={t.Breeding.egg.totalEggs} value={String(totalEggs)} color="default" />
      <CompactPill icon={<Circle size={iconSize} color="#4ade80" />} label={t.Breeding.egg.idle} value={String(stats.idle)} color="green" />
      <CompactPill icon={<Timer size={iconSize} color="#fbbf24" />} label={t.Breeding.egg.incubating} value={String(stats.incubating)} color="amber" />
      <CompactPill icon={<CheckCircle size={iconSize} color="#60a5fa" />} label={t.Breeding.egg.ready} value={String(stats.ready)} color="blue" />
      <CompactPill
        icon={<Coins size={iconSize} color={mutedColor} />}
        label={t.Breeding.egg.incubationCost}
        value={hatchingPriceInYolk}
        suffix="YOLK"
        color="default"
      />
      <CompactPill
        icon={<Clock size={iconSize} color={mutedColor} />}
        label={t.Breeding.egg.incubationDuration}
        value={formatDuration(durationMs)}
        color="default"
      />
      <CompactPill
        icon={<Wallet size={iconSize} color={PILL_COLORS[walletColor].text} />}
        label={t.Breeding.egg.yolkBalance}
        value={new Decimal(yolkBalance).toFixed(0)}
        extra={t.Breeding.egg.canIncubate.replace("{count}", String(affordableIncubations))}
        color={walletColor}
      />
    </ScrollView>
  )
}

export default EggStatsBar
