import { Image, ScrollView, StyleSheet, View } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { ProgressBar } from "react-native-paper"
import { addDays, format } from "date-fns"
import { Decimal } from "decimal.js"

import { authClient } from "@/auth/client"
import Header from "@/components/helpers/header"
import Text from "@/components/native/text"
import type { FarmingScheduleMobile } from "@/features/assets/types/farming-schedule"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { api } from "@/config/react-provider"
import type { RouterOutputs } from "@/config/react-provider"
import { formatNumber } from "@/utils/format"
import { getFarmAssetImageSource } from "@/utils/local-asset-image"

type BirdAsset = NonNullable<RouterOutputs["hen"]["byNumId"]>

interface BirdDetailScreenProps {
  primaryState: "hen" | "cockerel"
  imageFolder: "/hens/" | "/cockerel/"
}

const getSchedule = (value: unknown): FarmingScheduleMobile | null => (Array.isArray(value) ? (value as FarmingScheduleMobile) : null)

const getTotalDuration = (schedule: FarmingScheduleMobile | null) =>
  schedule?.reduce((accumulator, frame) => accumulator.add(new Decimal(frame.timeunit)), new Decimal(0)) ?? new Decimal(0)

const getDailyScheduleValue = ({
  anchorDate,
  schedule,
  creditedSchedule,
  creditedKey,
  targetKey,
}: {
  anchorDate: Date | null | undefined
  schedule: FarmingScheduleMobile | null | undefined
  creditedSchedule: FarmingScheduleMobile | null | undefined
  creditedKey: "earned" | "fed"
  targetKey: "reward" | "food"
}) => {
  if (!anchorDate || !schedule || !creditedSchedule) return 0

  const oneDayInMiliseconds = new Decimal(86400000)
  let remainingTime = new Decimal(Date.now()).sub(new Decimal(anchorDate.getTime()))

  for (let index = 0; index < schedule.length; index++) {
    const frame = schedule[index]
    if (!frame) continue

    const creditedFrame = creditedSchedule[index]
    const completedValue = new Decimal(creditedFrame?.[creditedKey] ?? 0)
    const targetValue = new Decimal(frame[targetKey])

    remainingTime = remainingTime.sub(new Decimal(frame.timeunit))

    if (completedValue.equals(targetValue)) {
      continue
    }

    if (remainingTime.greaterThan(0)) {
      continue
    }

    return oneDayInMiliseconds.mul(targetValue).div(new Decimal(frame.timeunit)).toNumber()
  }

  return 0
}

const getRemainingRentProgress = (asset: BirdAsset) => {
  if (!asset.rentValidUntil) return 0

  const oneYearInMiliseconds = new Decimal(31536000000)
  const rentValidUntil = new Decimal(new Date(asset.rentValidUntil).getTime())
  const currentTime = new Decimal(Date.now())

  return Math.max(0, Math.min(1, rentValidUntil.sub(currentTime).div(oneYearInMiliseconds).toNumber()))
}

const getGrowthProgress = (asset: BirdAsset) => {
  const growthSchedule = getSchedule(asset.growthSchedule)

  if (!asset.isGrowing || !asset.finishedHatchingAt || !growthSchedule) return 0

  const elapsed = new Decimal(Date.now() - new Date(asset.finishedHatchingAt).getTime())
  const totalDuration = getTotalDuration(growthSchedule)

  if (totalDuration.isZero()) return 0

  return Math.max(0, Math.min(1, elapsed.div(totalDuration).toNumber()))
}

const getGrowthEndDate = (asset: BirdAsset) => {
  const growthSchedule = getSchedule(asset.growthSchedule)

  if (!asset.finishedHatchingAt || !growthSchedule) return null

  const growthDays = getTotalDuration(growthSchedule).div(86400000).toNumber()

  return addDays(asset.finishedHatchingAt, growthDays)
}

const getBirdImageSource = (asset: BirdAsset, primaryState: BirdDetailScreenProps["primaryState"], _imageFolder: BirdDetailScreenProps["imageFolder"]) =>
  getFarmAssetImageSource({
    href: asset.href,
    state: asset.state === primaryState ? primaryState : asset.state,
    numId: asset.numId,
  })

const BirdDetailScreen = ({ primaryState, imageFolder }: BirdDetailScreenProps) => {
  const { id } = useLocalSearchParams<{ id: string }>()
  if (!id) throw new Error("unreachable")

  const now = new Date()
  const { data: session } = authClient.useSession()
  const user = session?.user
  const { t } = useSafeTranslation

  const decodedId = decodeURIComponent(id).replace(/^:/, "")
  const byNumId = api.hen.byNumId.useQuery({ numId: decodedId }, { enabled: !!decodedId })
  const asset = byNumId.data

  if (!asset) return null

  const farmingSchedule = getSchedule(asset.farmingCondition.schedule)
  const creditedSchedule = getSchedule(asset.creditedSchedule)
  const growthConditionSchedule = getSchedule(asset.farmingCondition.growthSchedule)
  const growthSchedule = getSchedule(asset.growthSchedule)

  const growthEndDate = getGrowthEndDate(asset)
  const dailyRewardValue = getDailyScheduleValue({
    anchorDate: asset.farmingSince,
    schedule: farmingSchedule,
    creditedSchedule,
    creditedKey: "earned",
    targetKey: "reward",
  })
  const dailyFoodValue = getDailyScheduleValue({
    anchorDate: asset.growingSince,
    schedule: growthConditionSchedule,
    creditedSchedule: growthSchedule,
    creditedKey: "fed",
    targetKey: "food",
  })

  return (
    <>
      <Header showBackButton title={asset.name} transparent />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.root} contentContainerStyle={styles.contentContainer}>
        <View style={styles.container}>
          <Image source={getBirdImageSource(asset, primaryState, imageFolder)} style={styles.heroImage} resizeMode="cover" />

          <View style={styles.statusRowWrap}>
            <View style={styles.statusRow}>
              <View style={styles.statusPillLeft}>
                <Text style={styles.statusLabel}>{asset.state === primaryState ? t.Assets.hen.isFarming : t.Assets.hen.isGrowing}</Text>
                <Text style={styles.statusValue}>
                  {asset.state === primaryState ? (asset.isFarming ? t.Assets.hen.yes : t.Assets.hen.no) : asset.isGrowing ? t.Assets.hen.yes : t.Assets.hen.no}
                </Text>
              </View>
              <View style={styles.statusDivider} />
              <View style={styles.statusPillRight}>
                <Text style={styles.statusLabel}>{t.Assets.hen.isInsured}</Text>
                <Text style={styles.statusValue}>{asset.insuranceValidUntil && asset.insuranceValidUntil > now ? t.Assets.hen.yes : t.Assets.hen.no}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.headerRow}>
              <View style={styles.headerInfo}>
                <Text style={styles.assetName}>{asset.name}</Text>
                <Text style={styles.subtleText}>
                  {t.Assets.hen.ownedBy} {user?.email}
                </Text>
              </View>

              {asset.isFarming && (
                <View style={styles.metricBlock}>
                  <Text style={[styles.subtleText, styles.alignRight]}>{t.Assets.hen.rewards}</Text>
                  <Text style={[styles.metricValue, styles.alignRight]}>{formatNumber(asset.earnedRewards)} YOLK</Text>
                </View>
              )}

              {asset.isGrowing && (
                <View style={styles.metricBlock}>
                  <Text style={[styles.subtleText, styles.alignRight]}>{t.Assets.hen.food ?? "Food"}</Text>
                  <Text style={[styles.metricValue, styles.alignRight]}>{formatNumber(asset.payedFood)} CORN</Text>
                </View>
              )}
            </View>

            <Text style={styles.description}>{t.Assets.hen.description}</Text>
          </View>

          <View style={[styles.section, styles.detailsSection]}>
            <Text style={styles.sectionTitle}>{t.Assets.hen.farmingDetails}</Text>

            <View style={styles.infoStack}>
              {asset.isFarming && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t.Assets.hen.dailyProduction ?? "Daily Production"}</Text>
                  <Text style={[styles.infoLabel, styles.alignRight]}>{formatNumber(dailyRewardValue)} YOLK</Text>
                </View>
              )}

              {asset.isGrowing && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t.Assets.hen.dailyFood ?? "Daily Food"}</Text>
                  <Text style={[styles.infoLabel, styles.alignRight]}>{formatNumber(dailyFoodValue)} CORN</Text>
                </View>
              )}
            </View>

            <View style={styles.progressSection}>
              {asset.rentValidUntil && asset.farmingSince && (
                <View style={styles.progressBlock}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t.Assets.hen.rent}</Text>
                    <Text style={[styles.infoLabel, styles.alignRight]}>{t.Assets.hen.farmingSince}</Text>
                  </View>
                  <ProgressBar progress={getRemainingRentProgress(asset)} color="#22c55e" style={styles.progressBar} />
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{format(new Date(asset.rentValidUntil), "do MMMM yyyy")}</Text>
                    <Text style={[styles.infoLabel, styles.alignRight]}>{format(new Date(asset.farmingSince), "do MMMM yyyy")}</Text>
                  </View>
                </View>
              )}

              {asset.isGrowing && asset.finishedHatchingAt && (
                <View style={styles.progressBlock}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t.Assets.hen.growingSince}</Text>
                    <Text style={[styles.infoLabel, styles.alignRight]}>{t.Assets.hen.startFarming}</Text>
                  </View>
                  <ProgressBar progress={getGrowthProgress(asset)} color="#22c55e" style={styles.progressBar} />
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{format(new Date(asset.finishedHatchingAt), "do MMMM yyyy")}</Text>
                    <Text style={[styles.infoLabel, styles.alignRight]}>{growthEndDate ? format(growthEndDate, "do MMMM yyyy") : "-"}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View style={styles.scheduleSection}>
            {asset.isGrowing && asset.growthSchedule && <Text style={styles.scheduleTitle}>Growth schedule (v{asset.version})</Text>}

            {asset.isGrowing && growthSchedule && (
              <View style={styles.scheduleList}>
                {growthSchedule.map((frame, index) => (
                  <View style={styles.scheduleRow} key={index}>
                    <Text style={styles.scheduleLabel}>{new Decimal(frame.timeunit).div(86400000).toNumber()} days</Text>
                    <Text style={styles.scheduleValue}>{`${formatNumber(frame.fed ?? 0)} / ${formatNumber(frame.food)} CORN`}</Text>
                  </View>
                ))}
              </View>
            )}

            {asset.isFarming && asset.creditedSchedule && (
              <Text style={styles.scheduleTitle}>
                {t.Assets.hen.rewardSchedule} (v{asset.version})
              </Text>
            )}

            {asset.isFarming && creditedSchedule && (
              <View style={styles.scheduleList}>
                {creditedSchedule.map((frame, index) => (
                  <View style={styles.scheduleRow} key={index}>
                    <Text style={styles.scheduleLabel}>{new Decimal(frame.timeunit).div(86400000).toNumber()} days</Text>
                    <Text style={styles.scheduleValue}>{`${formatNumber(frame.earned ?? 0)} / ${formatNumber(frame.reward)} YOLK`}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  contentContainer: {
    paddingBottom: 40,
  },
  container: {
    width: "100%",
  },
  heroImage: {
    width: "100%",
    height: 400,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  statusRowWrap: {
    width: "100%",
    paddingHorizontal: 12,
    marginTop: 18,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 80,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.04)",
    overflow: "hidden",
  },
  statusPillLeft: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "rgba(91,33,182,0.14)",
  },
  statusPillRight: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "rgba(91,33,182,0.14)",
  },
  statusDivider: {
    width: 1,
    height: "52%",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  statusLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: "#a1a1aa",
  },
  statusValue: {
    fontSize: 20,
    lineHeight: 26,
    color: "#fafafa",
  },
  section: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 28,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  assetName: {
    fontSize: 26,
    lineHeight: 32,
    color: "#ffffff",
  },
  metricBlock: {
    alignItems: "flex-end",
    maxWidth: "42%",
  },
  subtleText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#a1a1aa",
  },
  metricValue: {
    fontSize: 13,
    lineHeight: 18,
    color: "#ffffff",
  },
  alignRight: {
    textAlign: "right",
  },
  description: {
    marginTop: 28,
    fontSize: 14,
    lineHeight: 22,
    color: "#a1a1aa",
  },
  detailsSection: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#ffffff",
  },
  infoStack: {
    marginTop: 12,
    gap: 6,
  },
  progressSection: {
    marginTop: 16,
    gap: 16,
  },
  progressBlock: {
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  infoLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: "#a1a1aa",
  },
  progressBar: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#18181b",
  },
  scheduleSection: {
    marginTop: 20,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  scheduleTitle: {
    marginTop: 16,
    marginBottom: 12,
    fontSize: 16,
    lineHeight: 22,
    color: "#ffffff",
  },
  scheduleList: {
    gap: 10,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  scheduleLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: "#a1a1aa",
  },
  scheduleValue: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: "#ffffff",
    textAlign: "right",
  },
})

export default BirdDetailScreen
