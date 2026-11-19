import { useEffect, useState } from "react"

import type { FarmingInfoStrings } from "@newyolk/types"

export const useFarmTimer = (farmingInfo: FarmingInfoStrings | undefined) => {
  const TWELVE_HOURS_IN_MS = 12 * 60 * 60 * 1000

  const lastFedHen = farmingInfo?.farm.hensLastFedAt ?? new Date(new Date().getTime() - TWELVE_HOURS_IN_MS * 2)
  const timeDiffHen = new Date().getTime() - new Date(lastFedHen).getTime()
  const initialRemainingTimeHen = TWELVE_HOURS_IN_MS - timeDiffHen

  const lastFedCattle = farmingInfo?.farm.cattlesLastFedAt ?? new Date(new Date().getTime() - TWELVE_HOURS_IN_MS * 2)
  const timeDiffCattle = new Date().getTime() - new Date(lastFedCattle).getTime()
  const initialRemainingTimeCattle = TWELVE_HOURS_IN_MS - timeDiffCattle

  const [remainingTimeHen, setRemainingTimeHen] = useState(initialRemainingTimeHen)
  const [remainingTimeCattle, setRemainingTimeCattle] = useState(initialRemainingTimeCattle)

  useEffect(() => {
    setRemainingTimeHen(initialRemainingTimeHen)
    setRemainingTimeCattle(initialRemainingTimeCattle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmingInfo?.farm.hensLastFedAt, farmingInfo?.farm.cattlesLastFedAt])

  useEffect(() => {
    const intervalHen = setInterval(() => {
      setRemainingTimeHen((prevTime) => prevTime - 1000)
    }, 1000)

    return () => clearInterval(intervalHen)
  }, [])

  useEffect(() => {
    const intervalCattle = setInterval(() => {
      setRemainingTimeCattle((prevTime) => prevTime - 1000)
    }, 1000)

    return () => clearInterval(intervalCattle)
  }, [])

  return { remainingTimeHen, remainingTimeCattle }
}
