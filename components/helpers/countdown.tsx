import React from "react"
import { StyleSheet, View } from "react-native"

import Text from "../native/text"

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000
const TWENTY_ONE_DAYS_IN_MS = 21 * 24 * 60 * 60 * 1000

export const getDailyTimeDifference = (dailyGiftClaimedAt: Date | undefined | null) => {
  if (dailyGiftClaimedAt === null || dailyGiftClaimedAt === undefined) return 0

  const now = new Date()
  const timeDifference = now.getTime() - new Date(dailyGiftClaimedAt).getTime()

  return timeDifference < ONE_DAY_IN_MS ? ONE_DAY_IN_MS - timeDifference : 0
}

export const getIncubationTimeDifference = (hatchingSince: Date | undefined | null) => {
  if (hatchingSince === null || hatchingSince === undefined) return 0

  const now = new Date()
  const timeDifference = now.getTime() - new Date(hatchingSince).getTime()

  return timeDifference < TWENTY_ONE_DAYS_IN_MS ? TWENTY_ONE_DAYS_IN_MS - timeDifference : 0
}

const Countdown = ({ initialTimeRemaining }: { initialTimeRemaining: number }) => {
  const [timeRemaining, setTimeRemaining] = React.useState(initialTimeRemaining)

  const [countDownTime, setCountDownTime] = React.useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  })

  React.useEffect(() => {
    if (timeRemaining === 0) return

    const countdown = setInterval(() => {
      setTimeRemaining((prevTimeRemaining) => {
        if (prevTimeRemaining <= 1000) {
          clearInterval(countdown)
          return 0
        } else return prevTimeRemaining - 1000
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [timeRemaining])

  React.useEffect(() => {
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

    setCountDownTime({
      days: days < 10 ? "0" + days : days.toString(),
      hours: hours < 10 ? "0" + hours : hours.toString(),
      minutes: minutes < 10 ? "0" + minutes : minutes.toString(),
      seconds: seconds < 10 ? "0" + seconds : seconds.toString(),
    })
  }, [timeRemaining])

  React.useEffect(() => setTimeRemaining(initialTimeRemaining), [initialTimeRemaining])

  const countdownItems = [
    {
      value: countDownTime.days,
      singular: "day",
      plural: "days",
    },
    {
      value: countDownTime.hours,
      singular: "hour",
      plural: "hours",
    },
    {
      value: countDownTime.minutes,
      singular: "minute",
      plural: "minutes",
    },
    {
      value: countDownTime.seconds,
      singular: "second",
      plural: "seconds",
    },
  ]

  return (
    <View style={styles.container}>
      {countdownItems.map((item) => (
        <View key={item.singular} style={styles.column}>
          <View style={styles.valueBox}>
            <Text style={styles.valueText}>{item.value}</Text>
          </View>
          <Text style={styles.labelText}>{item.value === "01" ? item.singular : item.plural}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
  },
  column: {
    alignItems: "center",
    gap: 8,
  },
  valueBox: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#27272a",
    minWidth: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  valueText: {
    fontSize: 20,
    lineHeight: 24,
    color: "#ffffff",
  },
  labelText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#9ca3af",
    textTransform: "capitalize",
  },
})

export { Countdown }
