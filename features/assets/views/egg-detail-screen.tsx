import * as React from "react"
import { Image, ScrollView, StyleSheet, View } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { authClient } from "@/auth/client"
import { Countdown } from "@/components/helpers/countdown"
import Header from "@/components/helpers/header"
import { Button } from "@/components/native/button"
import Text from "@/components/native/text"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { api } from "@/config/react-provider"
import { format } from "date-fns"
import { getFarmAssetImageSource } from "@/utils/local-asset-image"

const getIncubationTimeDifference = (hatchingSince: Date | undefined | null) => {
  if (hatchingSince === null || hatchingSince === undefined) {
    return 0
  }

  const TWENTY_ONE_DAYS_IN_MS = 21 * 24 * 60 * 60 * 1000

  const now = new Date()
  const timeDifference = now.getTime() - new Date(hatchingSince).getTime()

  return timeDifference < TWENTY_ONE_DAYS_IN_MS ? TWENTY_ONE_DAYS_IN_MS - timeDifference : 0
}

const EggDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  if (!id) throw new Error("unreachable")

  const now = new Date()
  const { data: session } = authClient.useSession()
  const user = session?.user
  const utils = api.useUtils()
  const decodedId = id ? decodeURIComponent(id) : ""

  const byNumId = api.egg.byNumId.useQuery({ numId: decodedId }, { enabled: !!decodedId })
  const egg = byNumId.data
  const [timeRemaining, setTimeRemaining] = React.useState(() => getIncubationTimeDifference(egg?.hatchingSince))

  const incubate = api.egg.incubate.useMutation({
    onSuccess: async () => {
      await utils.farm.invalidate()
      await utils.egg.invalidate()
    },
  })

  const hatch = api.egg.hatch.useMutation({
    onSuccess: async () => {
      await utils.farm.invalidate()
      await utils.egg.byNumId.invalidate()
      await utils.hen.byNumId.invalidate()
      router.back()
    },
  })

  const handleStartIncubation = async () => {
    if (!egg?.id) return
    try {
      await incubate.mutateAsync([
        {
          id: egg.id,
        },
      ])
    } catch (error) {
      console.error(error)
    }
  }

  const handleFinishIncubation = async () => {
    if (!egg?.id) return
    try {
      await hatch.mutateAsync([
        {
          id: egg.id,
        },
      ])
    } catch (error) {
      console.error(error)
    }
  }

  React.useEffect(() => {
    const eta = getIncubationTimeDifference(egg?.hatchingSince)
    setTimeRemaining(eta)
  }, [egg?.hatchingSince])

  const { t } = useSafeTranslation

  if (!egg) return null

  const eggTitle = `${
    egg.state
      .replace(/([A-Z])/g, " $1")
      .charAt(0)
      .toUpperCase() + egg.state.replace(/([A-Z])/g, " $1").slice(1)
  } #${egg.numId}`

  return (
    <>
      <Header showBackButton title={eggTitle} transparent />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.root} contentContainerStyle={styles.contentContainer}>
        <View style={styles.container}>
          <Image source={getFarmAssetImageSource({ href: egg.href, state: egg.state, numId: egg.numId })} style={styles.heroImage} resizeMode="cover" />

          <View style={styles.statusRowWrap}>
            <View style={styles.statusRow}>
              <View style={styles.statusPillLeft}>
                <Text style={styles.statusLabel}>{t.Assets.egg.isHatching}</Text>
                <Text style={styles.statusValue}>{egg.isHatching ? t.Assets.egg.yes : t.Assets.egg.no}</Text>
              </View>
              <View style={styles.statusDivider} />
              <View style={styles.statusPillRight}>
                <Text style={styles.statusLabel}>{t.Assets.egg.insured}</Text>
                <Text style={styles.statusValue}>{egg.insuranceValidUntil && egg.insuranceValidUntil > now ? t.Assets.egg.yes : t.Assets.egg.no}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.headerInfo}>
              <Text style={styles.assetName}>{eggTitle}</Text>
              <Text style={styles.subtleText}>
                {t.Assets.egg.ownedBy} {user?.email}
              </Text>
            </View>

            <Text style={styles.description}>{t.Assets.egg.description}</Text>
          </View>

          <View style={[styles.section, styles.detailsSection]}>
            <View style={styles.infoStack}>
              {egg.isFarming && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t.Assets.egg.rent}</Text>
                  <Text style={[styles.infoLabel, styles.alignRight]}>{t.Assets.egg.farmingSince}</Text>
                </View>
              )}

              {egg.rentValidUntil && egg.farmingSince && egg.isFarming && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{format(new Date(egg.rentValidUntil), "do MMMM yyyy")}</Text>
                  <Text style={[styles.infoLabel, styles.alignRight]}>{format(new Date(egg.farmingSince), "do MMMM yyyy")}</Text>
                </View>
              )}

              {timeRemaining > 0 && (
                <View style={styles.countdownWrap}>
                  <Countdown initialTimeRemaining={timeRemaining} />
                </View>
              )}

              {!egg.isHatching && (
                <View style={styles.actionWrap}>
                  <Button label="INCUBATE" onPress={handleStartIncubation} disabled={incubate.isPending} style={styles.actionButton} />
                </View>
              )}

              {timeRemaining === 0 && egg.isHatching && !egg.isFarming && (
                <View style={styles.actionWrap}>
                  <Button label="HATCH" onPress={handleFinishIncubation} disabled={hatch.isPending} style={styles.actionButton} />
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
  headerInfo: {
    gap: 4,
  },
  assetName: {
    fontSize: 26,
    lineHeight: 32,
    color: "#ffffff",
  },
  subtleText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#a1a1aa",
  },
  description: {
    marginTop: 28,
    fontSize: 14,
    lineHeight: 22,
    color: "#a1a1aa",
  },
  detailsSection: {
    marginTop: 12,
  },
  infoStack: {
    gap: 12,
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
  alignRight: {
    textAlign: "right",
  },
  countdownWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  actionWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 40,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
  },
})

export default EggDetailScreen
