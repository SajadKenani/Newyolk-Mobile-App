import { View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useThemeColors } from "@/config/colors"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { formatNumber } from "@/utils/format"
import { useNavigation } from "@react-navigation/native"

import type { FarmingInfoStrings } from "@newyolk/types"

import { Button } from "@/components/native/button"
import Text from "@/components/native/text"
import { liveStockStyles } from "./utils/styles"

const Livestock = ({ farmingInfo }: { farmingInfo: FarmingInfoStrings }) => {
  const { t } = useSafeTranslation
  const navigation = useNavigation()
  const COLORS = useThemeColors()

  const white = COLORS.offWhite
  const muted = COLORS.zinc[400]
  const amber = COLORS.amber.yellow500
  const emerald = COLORS.success[500]

  return (
    <View style={[liveStockStyles.container]}>
      <LinearGradient colors={[COLORS.primary[500] + "16", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={liveStockStyles.panelGradient} />
      <View pointerEvents="none" style={[liveStockStyles.panelGlow, { backgroundColor: COLORS.primary[400] + "18" }]} />

      <View style={liveStockStyles.header}>
        <Text style={[liveStockStyles.eyebrow, { color: COLORS.primary[300] }]}>{t.FarmPage.poultry}</Text>
        <Text style={[liveStockStyles.title, { color: white }]}>{t.FarmPage.currentPoultryStock}</Text>
        <Text style={[liveStockStyles.subtitle, { color: muted }]}>{t.FarmPage.farming}</Text>
      </View>

      <View style={liveStockStyles.mainContent}>
        <View style={liveStockStyles.section}>
          <View style={liveStockStyles.sectionHeader}>
            <Text style={[liveStockStyles.sectionLabel, { color: emerald }]}>{t.FarmPage.farming}</Text>
          </View>

          <View style={liveStockStyles.animalList}>
            <View style={liveStockStyles.animalRow}>
              <Text style={liveStockStyles.emoji}>🐔</Text>
              <Text style={[liveStockStyles.count, { color: white }]}>{formatNumber(farmingInfo.farm.hens.isFarming.hens)}</Text>
              <Text style={[liveStockStyles.animalLabel, { color: muted }]}>{t.FarmPage.hens}</Text>
            </View>
            <View style={liveStockStyles.animalRow}>
              <Text style={liveStockStyles.emoji}>🐓</Text>
              <Text style={[liveStockStyles.count, { color: white }]}>{formatNumber(farmingInfo.farm.hens.isFarming.roosters)}</Text>
              <Text style={[liveStockStyles.animalLabel, { color: muted }]}>{t.FarmPage.roosters}</Text>
            </View>
            <View style={liveStockStyles.animalRow}>
              <Text style={liveStockStyles.emoji}>🐄</Text>
              <Text style={[liveStockStyles.count, { color: white }]}>{formatNumber(farmingInfo.farm.cattles.isFarming)}</Text>
              <Text style={[liveStockStyles.animalLabel, { color: muted }]}>{t.FarmPage.cattles}</Text>
            </View>
          </View>
        </View>

        <View style={liveStockStyles.section}>
          <View style={liveStockStyles.sectionHeader}>
            <Text style={[liveStockStyles.sectionLabel, { color: amber }]}>{t.FarmPage.growing}</Text>
          </View>

          <View style={liveStockStyles.animalList}>
            <View style={liveStockStyles.animalRow}>
              <Text style={liveStockStyles.emoji}>🐤</Text>
              <Text style={[liveStockStyles.count, { color: white }]}>{formatNumber(farmingInfo.farm.hens.isGrowing.chicks)}</Text>
              <Text style={[liveStockStyles.animalLabel, { color: muted }]}>{t.FarmPage.chicks}</Text>
            </View>
            <View style={liveStockStyles.animalRow}>
              <Text style={liveStockStyles.emoji}>🐤</Text>
              <Text style={[liveStockStyles.count, { color: white }]}>{formatNumber(farmingInfo.farm.hens.isGrowing.cockerels)}</Text>
              <Text style={[liveStockStyles.animalLabel, { color: muted }]}>{t.FarmPage.cockerels}</Text>
            </View>
            <View style={liveStockStyles.animalRow}>
              <Text style={liveStockStyles.emoji}>🐮</Text>
              <Text style={[liveStockStyles.count, { color: white }]}>{formatNumber(farmingInfo.farm.cattles.isGrowing.heifers)}</Text>
              <Text style={[liveStockStyles.animalLabel, { color: muted }]}>{t.FarmPage.heifers}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={liveStockStyles.actions}>
        <Button
          label={t.Pricing.name}
          variant="primary"
          size="md"
          style={liveStockStyles.actionButton}
          onPress={() => navigation.navigate("pricing" as never)}
          fullWidth={false}
        />
        <Button
          label={t("Header.buttons.marketplace")}
          variant="primary"
          size="md"
          style={liveStockStyles.actionButton}
          onPress={() => navigation.getParent()?.navigate("marketplace" as never)}
          fullWidth={false}
        />
      </View>
    </View>
  )
}

export default Livestock
