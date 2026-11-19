import { Image, ScrollView, StyleSheet, View } from "react-native"
import { ProgressBar } from "react-native-paper"
import { useLocalSearchParams } from "expo-router"
import { authClient } from "@/auth/client"
import Header from "@/components/helpers/header"
import Text from "@/components/native/text"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { api } from "@/config/react-provider"
import { format } from "date-fns"
import { Decimal } from "decimal.js"
import { getFarmAssetImageSource } from "@/utils/local-asset-image"

const CattleDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  if (!id) throw new Error("unreachable")

  const { data: session } = authClient.useSession()
  const user = session?.user

  const now = new Date()

  const decodedId = id ? decodeURIComponent(id) : ""
  const byNumId = api.cattle.byNumId.useQuery({ numId: decodedId }, { enabled: !!decodedId })
  const cattle = byNumId.data

  const calculateRemainingRent = (): number => {
    if (!cattle?.rentValidUntil) return 0
    const oneYearInMiliseconds = 31536000000

    const rentValidUntil = new Decimal(new Date(cattle.rentValidUntil).getTime())
    const currentTime = new Decimal(Date.now())

    const remainingRent = rentValidUntil.sub(currentTime).div(oneYearInMiliseconds).toNumber()

    return Math.max(0, Math.min(1, remainingRent))
  }

  const { t } = useSafeTranslation

  if (!cattle) return null

  return (
    <>
      <Header showBackButton title={cattle.name} transparent />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.root} contentContainerStyle={styles.contentContainer}>
        <View style={styles.container}>
          <Image
            source={getFarmAssetImageSource({ href: cattle.href, state: cattle.state, numId: cattle.numId })}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <View style={styles.statusRowWrap}>
            <View style={styles.statusRow}>
              <View style={styles.statusPillLeft}>
                <Text style={styles.statusLabel}>{t.Assets.hen.isFarming}</Text>
                <Text style={styles.statusValue}>{cattle.isFarming ? t.Assets.cattle.yes : t.Assets.cattle.no}</Text>
              </View>
              <View style={styles.statusDivider} />
              <View style={styles.statusPillRight}>
                <Text style={styles.statusLabel}>{t.Assets.hen.isInsured}</Text>
                <Text style={styles.statusValue}>
                  {cattle.insuranceValidUntil && cattle.insuranceValidUntil > now ? t.Assets.cattle.yes : t.Assets.cattle.no}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.headerRow}>
              <View style={styles.headerInfo}>
                <Text style={styles.cattleName}>{cattle.name}</Text>
                <Text style={styles.subtleText}>
                  {t.Assets.hen.ownedBy} {user?.email}
                </Text>
              </View>
              <View style={styles.rewardsBlock}>
                <Text style={[styles.subtleText, styles.alignRight]}>{t.Assets.hen.rewards}</Text>
                <Text style={[styles.rewardValue, styles.alignRight]}>{Number(cattle.earnedRewards.toString()).toFixed(2)} MILKIUM</Text>
              </View>
            </View>

            <View style={styles.detailsStack}>
              <View style={styles.detailsBlock}>
                <Text style={styles.metaText}>{t.Assets.cattle.initialReservation}</Text>
                <Text style={styles.metaText}>{t.Assets.cattle.descriptionPresale}</Text>
              </View>
              <View style={styles.detailsBlock}>
                <Text style={styles.metaText}>{t.Assets.cattle.gestationalAge}</Text>
                <Text style={styles.metaText}>{t.Assets.cattle.milkProduction}</Text>
                <Text style={styles.metaText}>{t.Assets.cattle.MILKIUM}</Text>
                <Text style={styles.metaText}>{t.Assets.cattle.expectedDateOfBirth}</Text>
                <Text style={styles.metaText}>{t.Assets.cattle.noOfBirth}</Text>
              </View>
              <Text style={styles.metaText}>{t.Assets.cattle.note}</Text>
            </View>
          </View>

          <View style={[styles.section, styles.farmingSection]}>
            {cattle.isFarming && (
              <View style={styles.farmingHeader}>
                <Text style={styles.sectionTitle}>{t.Assets.cattle.farmingDetails}</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t.Assets.cattle.dailyProduction}</Text>
                  <Text style={styles.infoLabel}>MILKIUM</Text>
                </View>
              </View>
            )}

            <View style={styles.rentBlock}>
              {cattle.isFarming && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t.Assets.cattle.rent}</Text>
                  <Text style={styles.infoLabel}>{t.Assets.cattle.farmingSince}</Text>
                </View>
              )}

              {cattle.isFarming && <ProgressBar progress={calculateRemainingRent()} color="#22c55e" style={styles.progressBar} />}

              {cattle.rentValidUntil && cattle.farmingSince && cattle.isFarming && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{format(new Date(cattle.rentValidUntil), "do MMMM yyyy")}</Text>
                  <Text style={styles.infoLabel}>{format(new Date(cattle.farmingSince), "do MMMM yyyy")}</Text>
                </View>
              )}
            </View>
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
    paddingBottom: 32,
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
  rewardsBlock: {
    alignItems: "flex-end",
    maxWidth: "42%",
  },
  cattleName: {
    fontSize: 26,
    lineHeight: 32,
    color: "#ffffff",
  },
  subtleText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#a1a1aa",
  },
  alignRight: {
    textAlign: "right",
  },
  rewardValue: {
    fontSize: 13,
    lineHeight: 18,
    color: "#ffffff",
  },
  detailsStack: {
    marginTop: 28,
    gap: 16,
  },
  detailsBlock: {
    gap: 2,
  },
  metaText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#a1a1aa",
  },
  farmingSection: {
    marginTop: 18,
  },
  farmingHeader: {
    marginBottom: 12,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#ffffff",
  },
  rentBlock: {
    gap: 6,
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
    marginVertical: 2,
  },
})

export default CattleDetailScreen
