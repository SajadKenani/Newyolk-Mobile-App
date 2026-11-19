import { formatDistanceToNowStrict } from "date-fns"

export const formatTimeAgoShort = (date: Date, t: (key: string) => string): string => {
  const timestamp = new Date()
  const dateDiff = timestamp.getTime() - date.getTime()

  let unit: "second" | "minute" | "hour" | "day" | "month" | "year"
  let value = 0

  if (dateDiff < 60 * 1000) {
    unit = "second"
    value = Math.round(dateDiff / 1000)
  } else if (dateDiff < 60 * 60 * 1000) {
    unit = "minute"
    value = Math.round(dateDiff / (60 * 1000))
  } else if (dateDiff < 24 * 60 * 60 * 1000) {
    unit = "hour"
    value = Math.round(dateDiff / (60 * 60 * 1000))
  } else if (dateDiff < 30 * 24 * 60 * 60 * 1000) {
    unit = "day"
    value = Math.round(dateDiff / (24 * 60 * 60 * 1000))
  } else if (dateDiff < 365 * 24 * 60 * 60 * 1000) {
    unit = "month"
    value = Math.round(dateDiff / (30 * 24 * 60 * 60 * 1000))
  } else {
    unit = "year"
    value = Math.round(dateDiff / (365 * 24 * 60 * 60 * 1000))
  }

  return `${value} ${t(`Countdown.${unit}`)}`
}

export const formatTimeAgoChart = (date: Date) => {
  const timestamp = new Date()
  const dateDiff = timestamp.getTime() - date.getTime()

  let unit: "second" | "minute" | "hour" | "day" | "month" | "year"

  if (dateDiff < 60 * 1000) {
    unit = "second"
  } else if (dateDiff < 60 * 60 * 1000) {
    unit = "minute"
  } else if (dateDiff < 24 * 60 * 60 * 1000) {
    unit = "hour"
  } else if (dateDiff < 30 * 24 * 60 * 60 * 1000) {
    unit = "day"
  } else if (dateDiff < 365 * 24 * 60 * 60 * 1000) {
    unit = "month"
  } else {
    unit = "year"
  }

  return formatDistanceToNowStrict(date, {
    unit,
    roundingMethod: "round",
  })
    .split(" ")
    .map((part, index) => (index === 1 ? part.charAt(0) : part))
    .join("")
}
