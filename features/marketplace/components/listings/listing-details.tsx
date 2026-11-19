import React from "react"
import { Image, Modal, ScrollView, TouchableOpacity, View, type ImageSourcePropType } from "react-native"
import { ProgressBar } from "react-native-paper"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import type { FarmingScheduleMobile } from "@/features/assets/types/farming-schedule"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { formatCurrency, formatNumber } from "@/utils/format"
import { formatDistanceToNowStrict } from "date-fns"
import Decimal from "decimal.js"
import { Layers, X } from "lucide-react-native"

import type { RouterOutputs } from "@newyolk/api"

type ListingItem = RouterOutputs["listing"]["infiniteFilteredListingsByName"]["items"][number]
type ListingAsset = NonNullable<ListingItem["hen"] | ListingItem["cattle"]>

const getSchedule = (value: unknown): FarmingScheduleMobile | null => (Array.isArray(value) ? (value as FarmingScheduleMobile) : null)

const getTotalTimeunit = (schedule: FarmingScheduleMobile | null) =>
  schedule?.reduce((accumulator, frame) => accumulator.add(new Decimal(frame.timeunit)), new Decimal(0)) ?? new Decimal(0)

const calculateRemainingDays = ({ item }: { item: ListingAsset }): string => {
  if (!item) return "0"
  const dateNow = Date.now()
  let scheduleStartTime: Decimal = new Decimal(0)
  let scheduleFrames: FarmingScheduleMobile | null = null

  if (item.isFarming && item.farmingSince) {
    scheduleStartTime = new Decimal(item.farmingSince.getTime())
    scheduleFrames =
      item.state === "cattle"
        ? getSchedule(item.farmingCondition.cattleCreditedSchedule)
        : item.state === "rooster"
          ? getSchedule(item.farmingCondition.roosterSchedule)
          : getSchedule(item.farmingCondition.schedule)
  } else if (item.isGrowing && item.growingSince) {
    scheduleStartTime = new Decimal(item.growingSince.getTime())
    scheduleFrames =
      item.state === "heifer"
        ? getSchedule(item.farmingCondition.cattleGrowthSchedule)
        : item.state === "cockerel"
          ? getSchedule(item.farmingCondition.roosterGrowthSchedule)
          : getSchedule(item.farmingCondition.growthSchedule)
  } else if (item.isHatching && item.hatchingSince) {
    const incubationStartTime = new Decimal(item.hatchingSince.getTime())

    if (incubationStartTime.add(new Decimal(Number(item.farmingCondition.hatchingTimeInMs))).greaterThan(new Decimal(dateNow))) {
      return formatDistanceToNowStrict(incubationStartTime.add(new Decimal(Number(item.farmingCondition.hatchingTimeInMs))).toNumber(), {
        unit: "day",
        roundingMethod: "round",
      })
    } else {
      return ""
    }
  } else if (item.state === "hatchingEgg") {
    return ""
  } else {
    scheduleStartTime = new Decimal(item.createdAt.getTime())
    scheduleFrames = item.state === "cattle" ? getSchedule(item.farmingCondition.cattleCreditedSchedule) : getSchedule(item.farmingCondition.schedule)
  }

  const totalTimeunit = getTotalTimeunit(scheduleFrames)

  const age = formatDistanceToNowStrict(scheduleStartTime.add(totalTimeunit).toNumber(), {
    unit: "day",
    roundingMethod: "round",
  })

  return age
}

const calculateDailyRewards = ({ item }: { item: ListingAsset }): string => {
  const oneDayInMiliseconds = new Decimal(86400000)
  const dateNowDecimal = new Decimal(Date.now())

  if (!item?.farmingSince || item.state === "rooster" || item.state === "bull") return "0"

  const farmingSinceTime = new Decimal(item.farmingSince.getTime())
  const endTime = dateNowDecimal

  const schedule = item.state === "cattle" ? getSchedule(item.farmingCondition.cattleCreditedSchedule) : getSchedule(item.farmingCondition.schedule)
  const creditedSchedule = getSchedule(item.creditedSchedule)

  if (!schedule || !creditedSchedule) return "0"

  let dailyRewardsYieldPer = new Decimal(0)

  let hasBeenFarmingTime = endTime.sub(farmingSinceTime)
  let markerTime = farmingSinceTime

  for (let i = 0; i < schedule.length; i++) {
    const frame = schedule[i]
    if (!frame) continue

    const creditedItem = creditedSchedule[i]
    const earnedPerFrame = new Decimal(creditedItem?.earned ?? 0)

    hasBeenFarmingTime = hasBeenFarmingTime.sub(new Decimal(frame.timeunit))

    if (earnedPerFrame.equals(frame.reward)) {
      markerTime = markerTime.add(new Decimal(frame.timeunit))
      continue
    }

    if (hasBeenFarmingTime.greaterThan(0)) {
      markerTime = markerTime.add(new Decimal(frame.timeunit))
    } else {
      dailyRewardsYieldPer = dailyRewardsYieldPer.add(oneDayInMiliseconds.mul(new Decimal(frame.reward)).div(new Decimal(frame.timeunit)))
      break
    }
  }

  return formatNumber(dailyRewardsYieldPer)
}

const calculateDailyFood = ({ item }: { item: ListingAsset }): string => {
  const oneDayInMiliseconds = new Decimal(86400000)
  const dateNowDecimal = new Decimal(Date.now())

  if (item?.state === "rooster") return "2"
  if (!item?.growingSince || item.state === "bull") return "0"

  const growingSinceTime = new Decimal(item.growingSince.getTime())
  const endTime = dateNowDecimal

  const schedule =
    item.state === "heifer"
      ? getSchedule(item.farmingCondition.cattleGrowthSchedule)
      : item.state === "cockerel"
        ? getSchedule(item.farmingCondition.roosterGrowthSchedule)
        : getSchedule(item.farmingCondition.growthSchedule)
  const creditedSchedule = getSchedule(item.growthSchedule)

  if (!schedule || !creditedSchedule) return "0"

  let dailyFoodYieldPer = new Decimal(0)

  let hasBeenGrowingTime = endTime.sub(growingSinceTime)
  let markerTime = growingSinceTime

  for (let i = 0; i < schedule.length; i++) {
    const frame = schedule[i]
    if (!frame) continue

    const creditedItem = creditedSchedule[i]
    const fedPerFrame = new Decimal(creditedItem?.fed ?? 0)

    hasBeenGrowingTime = hasBeenGrowingTime.sub(new Decimal(frame.timeunit))

    if (fedPerFrame.equals(frame.food)) {
      markerTime = markerTime.add(new Decimal(frame.timeunit))
      continue
    }

    if (hasBeenGrowingTime.greaterThan(0)) {
      markerTime = markerTime.add(new Decimal(frame.timeunit))
    } else {
      dailyFoodYieldPer = dailyFoodYieldPer.add(oneDayInMiliseconds.mul(new Decimal(frame.food)).div(new Decimal(frame.timeunit)))
      break
    }
  }

  return formatNumber(dailyFoodYieldPer)
}

const getIncubationProgressPercentage = ({ hatchingSince, hatchingTimeInMs }: { hatchingSince: Date | undefined | null; hatchingTimeInMs: Decimal }) => {
  if (hatchingSince === null || hatchingSince === undefined) {
    return 0
  }

  const now = new Date()
  const timeDifference = now.getTime() - new Date(hatchingSince).getTime()

  return new Decimal(timeDifference).lessThan(hatchingTimeInMs) ? new Decimal(timeDifference).div(hatchingTimeInMs).mul(100).toNumber() : 100
}

const calculateRemainingFood = ({ item }: { item: ListingAsset }) => {
  if (!item.growingSince) return "0"

  const creditedSchedule = getSchedule(item.growthSchedule)

  if (!creditedSchedule) return "0"

  let remainingGrowthFood = new Decimal(0)

  const totalToFeed = creditedSchedule.reduce((acc, frame) => acc.add(new Decimal(frame.food)), new Decimal(0))
  const totalFed = creditedSchedule.reduce((acc, frame) => acc.add(new Decimal(frame.fed ?? "")), new Decimal(0))

  remainingGrowthFood = new Decimal(totalToFeed).sub(totalFed)

  return formatNumber(remainingGrowthFood)
}

export const ListingDetails = ({
  modalVisible,
  setModalVisible,
  imageSource,
  listing,
}: {
  modalVisible: boolean
  setModalVisible: (visible: boolean) => void
  imageSource: ImageSourcePropType | null
  listing: RouterOutputs["listing"]["infiniteFilteredListingsByName"]["items"][0]
}) => {
  const item = listing.hen ?? listing.cattle
  const [date] = React.useState(() => Date.now())
  const COLORS = useThemeColors()
  const { t } = useSafeTranslation
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
      <TouchableOpacity activeOpacity={1} onPress={() => setModalVisible(false)} style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()} style={{ flex: 1, justifyContent: "flex-end" }}>
          <View
            style={{
              backgroundColor: COLORS.zinc[950],
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              height: "85%",
              bottom: 0,
              borderTopWidth: 2,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: COLORS.zinc[800],
            }}
          >
            {/* Modal Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 24,
                paddingTop: 20,
                paddingBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.zinc[800],
              }}
            >
              <View>
                <Text style={{ fontSize: 24, color: "white", marginBottom: 4 }}>{t.Marketplace.assetDetails}</Text>
                <Text style={{ fontSize: 14, color: COLORS.zinc[400] }}>#{listing.assetNumId}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  padding: 8,
                  backgroundColor: COLORS.zinc[800],
                  borderRadius: 12,
                }}
                activeOpacity={0.7}
              >
                <X size={20} color={COLORS.zinc[400]} />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20 }} showsVerticalScrollIndicator={false}>
              {/* Image with Price Overlay */}
              <View style={{ marginBottom: 24, position: "relative" }}>
                {imageSource ? (
                  <Image
                    style={{
                      height: 240,
                      width: "100%",
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: COLORS.zinc[800],
                    }}
                    source={imageSource}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      height: 240,
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: COLORS.zinc[900],
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: COLORS.zinc[800],
                    }}
                  >
                    <Layers size={80} color={COLORS.zinc[700]} />
                  </View>
                )}

                {/* Price Badge */}
                <View
                  style={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    backgroundColor: COLORS.primary[500],
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 12,
                    shadowColor: COLORS.primary[500],
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.5,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  <Text style={{ fontSize: 20, color: "white" }}>
                    {formatCurrency(listing.buyNowPrice, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </Text>
                </View>
              </View>

              {item && (
                <>
                  {/* State Card */}
                  <View
                    style={{
                      backgroundColor: COLORS.zinc[900],
                      padding: 16,
                      borderRadius: 16,
                      marginBottom: 16,
                      borderWidth: 1,
                      borderColor: COLORS.zinc[800],
                    }}
                  >
                    <Text style={{ fontSize: 12, color: COLORS.zinc[500], marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                      {t.Marketplace.state}
                    </Text>
                    <Text style={{ fontSize: 18, color: "white", textTransform: "capitalize" }}>{item.state}</Text>
                  </View>

                  {/* Remaining Rewards/Food Card */}
                  <View
                    style={{
                      backgroundColor: COLORS.zinc[900],
                      padding: 16,
                      borderRadius: 16,
                      marginBottom: 16,
                      borderWidth: 1,
                      borderColor: COLORS.zinc[800],
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 12, color: COLORS.zinc[500], textTransform: "uppercase", letterSpacing: 1 }}>{t.Marketplace.remaining}</Text>
                    <Text style={{ fontSize: 18, color: COLORS.primary[400] }}>
                      {!item?.growingSince && formatNumber(new Decimal(item?.totalRewards ?? "0").minus(new Decimal(item?.earnedRewards ?? "0")))}
                      {!item?.growingSince && item?.rewardsCurrency === "yolk" ? " 🥚" : item?.rewardsCurrency === "milk" ? " 🥛" : ""}
                      {item?.growingSince && !item.farmingSince && calculateRemainingFood({ item }) + " 🌽"}
                    </Text>
                  </View>

                  {/* Farming Details */}
                  {item.farmingSince && (
                    <View
                      style={{
                        backgroundColor: COLORS.zinc[900],
                        padding: 20,
                        borderRadius: 16,
                        marginBottom: 16,
                        borderWidth: 1,
                        borderColor: COLORS.zinc[800],
                      }}
                    >
                      <Text style={{ fontSize: 16, color: "white", marginBottom: 16 }}>🌾 {t.Marketplace.farmingProcess}</Text>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 12,
                          paddingBottom: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: COLORS.zinc[800],
                        }}
                      >
                        <Text style={{ fontSize: 14, color: COLORS.zinc[400] }}>{t.Marketplace.dailyRewards}</Text>
                        <Text style={{ fontSize: 14, color: "white" }}>
                          {calculateDailyRewards({ item })}/{t.Marketplace.day}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 16,
                          paddingBottom: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: COLORS.zinc[800],
                        }}
                      >
                        <Text style={{ fontSize: 14, color: COLORS.zinc[400] }}>{t.Marketplace.timeRemaining}</Text>
                        <Text style={{ fontSize: 14, color: "white" }}>{calculateRemainingDays({ item })}</Text>
                      </View>

                      <View style={{ marginBottom: 12 }}>
                        <ProgressBar
                          progress={new Decimal(item.remainingProductionPercentage).div(100).toNumber()}
                          style={{ height: 12, borderRadius: 6 }}
                          color={COLORS.primary[500]}
                        />
                      </View>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 16,
                          color: COLORS.primary[400],
                        }}
                      >
                        {new Decimal(item.remainingProductionPercentage).toNumber().toFixed(1)}% {t.Marketplace.complete}
                      </Text>
                    </View>
                  )}

                  {/* Growing Details */}
                  {item.growingSince && !item.farmingSince && (
                    <View
                      style={{
                        backgroundColor: COLORS.zinc[900],
                        padding: 20,
                        borderRadius: 16,
                        marginBottom: 16,
                        borderWidth: 1,
                        borderColor: COLORS.zinc[800],
                      }}
                    >
                      <Text style={{ fontSize: 16, color: "white", marginBottom: 16 }}>🌱 {t.Marketplace.growthProgress}</Text>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 12,
                          paddingBottom: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: COLORS.zinc[800],
                        }}
                      >
                        <Text style={{ fontSize: 14, color: COLORS.zinc[400] }}>{t.Marketplace.dailyFood}</Text>
                        <Text style={{ fontSize: 14, color: "white" }}>
                          {calculateDailyFood({ item })}/{t.Marketplace.day}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 16,
                          paddingBottom: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: COLORS.zinc[800],
                        }}
                      >
                        <Text style={{ fontSize: 14, color: COLORS.zinc[400] }}>{t.Marketplace.timeRemaining}</Text>
                        <Text style={{ fontSize: 14, color: "white" }}>{calculateRemainingDays({ item })}</Text>
                      </View>

                      <View style={{ marginBottom: 12 }}>
                        <ProgressBar
                          progress={new Decimal(new Date(date).getTime() - new Date(item.growingSince).getTime())
                            .div(getTotalTimeunit(getSchedule(item.growthSchedule)))
                            .toNumber()}
                          style={{ height: 12, borderRadius: 6 }}
                          color={COLORS.primary[500]}
                        />
                      </View>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 16,
                          color: COLORS.primary[400],
                        }}
                      >
                        {new Decimal(new Date(date).getTime() - new Date(item.growingSince).getTime())
                          .div(getTotalTimeunit(getSchedule(item.growthSchedule)))
                          .mul(100)
                          .toNumber()
                          .toFixed(1)}
                        % {t.Marketplace.complete}
                      </Text>
                    </View>
                  )}

                  {/* Hatching Details */}
                  {(item.state === "hatchingEgg" || item.state === "incubatingEgg") && (
                    <View
                      style={{
                        backgroundColor: COLORS.zinc[900],
                        padding: 20,
                        borderRadius: 16,
                        marginBottom: 16,
                        borderWidth: 1,
                        borderColor: COLORS.zinc[800],
                      }}
                    >
                      <Text style={{ fontSize: 16, color: "white", marginBottom: 16 }}>🥚 {t.Marketplace.incubationProgress}</Text>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 12,
                          paddingBottom: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: COLORS.zinc[800],
                        }}
                      >
                        <Text style={{ fontSize: 14, color: COLORS.zinc[400] }}>{t.Marketplace.dailyFood}</Text>
                        <Text style={{ fontSize: 14, color: "white" }}>
                          {calculateDailyFood({ item })}/{t.Marketplace.day}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 16,
                          paddingBottom: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: COLORS.zinc[800],
                        }}
                      >
                        <Text style={{ fontSize: 14, color: COLORS.zinc[400] }}>{t.Marketplace.timeRemaining}</Text>
                        <Text style={{ fontSize: 14, color: "white" }}>{calculateRemainingDays({ item })}</Text>
                      </View>

                      <View style={{ marginBottom: 12 }}>
                        <ProgressBar
                          progress={
                            getIncubationProgressPercentage({
                              hatchingSince: item.hatchingSince,
                              hatchingTimeInMs: new Decimal(item.farmingCondition.hatchingTimeInMs),
                            }) / 100
                          }
                          style={{ height: 12, borderRadius: 6 }}
                          color={COLORS.primary[500]}
                        />
                      </View>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 16,
                          color: COLORS.primary[400],
                        }}
                      >
                        {getIncubationProgressPercentage({
                          hatchingSince: item.hatchingSince,
                          hatchingTimeInMs: new Decimal(item.farmingCondition.hatchingTimeInMs),
                        }).toFixed(1)}
                        % {t.Marketplace.complete}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )
}
