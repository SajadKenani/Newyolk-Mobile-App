import type { AssetCardProps } from "@/features/farm/types/interface"
import { useMemo } from "react"
import { useSafeTranslation } from "@/hooks/safe-translation"

type ChartKey = "egg" | "corn" | "milk" | "hay"
type AssetType = "yolk" | "corn" | "milk" | "hay"
type CommodityRateKey = "eggToUsd" | "cornToUsd" | "milkToUsd" | "hayToUsd"

const normalizeChartData = (data: { date: Date; value: number }[]) => {
  const dedupedData = data.reduce(
    (points, item) => {
      const nextValue = Number(item.value)
      const previousPoint = points[points.length - 1]

      if (previousPoint && previousPoint.value === nextValue) {
        points[points.length - 1] = {
          ...previousPoint,
          date: new Date(item.date),
        }
        return points
      }

      points.push({
        date: new Date(item.date),
        value: nextValue,
      })
      return points
    },
    [] as { date: Date; value: number }[],
  )

  return (dedupedData.length > 1 ? dedupedData : data.map((item) => ({ date: new Date(item.date), value: Number(item.value) }))).slice(-31)
}

export const useAssetCard = ({ farmingInfo, type }: AssetCardProps) => {
  const { t, currentLang } = useSafeTranslation
  const isRTL = currentLang === "ar-ae"

  const assetKey = type as AssetType
  const assetData = farmingInfo.farm.balance[assetKey]

  const commodityRateKey: CommodityRateKey = (assetKey === "yolk" ? "eggToUsd" : `${assetKey}ToUsd`) as CommodityRateKey
  const rate = farmingInfo.commodityRates[commodityRateKey].exchangeRate

  const chartKey: ChartKey = type === "yolk" ? "egg" : (type as ChartKey)
  const chartData = useMemo(() => {
    const data = farmingInfo.dailyCharts[chartKey]
    if (!data) return []
    const formattedData = normalizeChartData([...data]).map((item) => {
      const date = item.date
      const label = `${date.getMonth() + 1}/${date.getDate()}`
      return {
        value: item.value,
        label: label,
        dataPointText: item.value.toFixed(4),
      }
    })
    return formattedData
  }, [farmingInfo.dailyCharts, chartKey])

  const formatRate = (value: unknown) => {
    const num = Number(value)
    if (isNaN(num)) return "N/A"
    if (num >= 1) return num.toFixed(2)
    return num.toFixed(4)
  }

  return {
    t,
    isRTL,
    assetData,
    rate,
    chartData,
    formatRate,
  }
}
