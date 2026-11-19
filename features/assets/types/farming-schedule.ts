import type Decimal from "decimal.js"

export interface FarmingScheduleFrame {
  earned?: Decimal.Value
  fed?: Decimal.Value
  food: Decimal.Value
  reward: Decimal.Value
  timeunit: Decimal.Value
  earnedValueInUsd?: string
  fedValueInUsd?: string
}

export type FarmingScheduleMobile = FarmingScheduleFrame[]