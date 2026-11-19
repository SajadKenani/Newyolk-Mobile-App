export const useActionCenter = (feedMyFarm: { isPending: boolean }, remainingTimeHen: number, remainingTimeCattle: number) => {
  const henDisabled = feedMyFarm.isPending || remainingTimeHen > 0
  const cattleDisabled = feedMyFarm.isPending || remainingTimeCattle > 0

  const formatRemainingTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
      .toString()
      .padStart(2, "0")
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
      .toString()
      .padStart(2, "0")
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
      .toString()
      .padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
  }

  return {
    henDisabled,
    cattleDisabled,
    formatRemainingTime,
  }
}
