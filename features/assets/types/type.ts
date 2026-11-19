import type { RouterOutputs } from "@newyolk/api"

export type AssetName =
  | "hen"
  | "rooster"
  | "hatched"
  | "hatchingEgg"
  | "incubatingEgg"
  | "cockerel"
  | "bull"
  | "heifer"
  | "cattle"
  | "retiredBull"
  | "retiredCattle"
  | "retiredCockerel"
  | "retiredRooster"
  | "retired"
  | "burned"

export interface Duration {
  label: string
  value: number
}

export type Item = RouterOutputs["collection"]["infiniteItemsByName"]["items"][number]

export const DEFAULT_DURATION: Duration = { label: "180 Days", value: 15552000000 }

export const DURATIONS: Duration[] = [
  { label: "1 Day", value: 86400000 },
  { label: "3 Days", value: 259200000 },
  { label: "7 Days", value: 604800000 },
  { label: "14 Days", value: 1209600000 },
  { label: "30 Days", value: 2592000000 },
  { label: "180 Days", value: 15552000000 },
]

export interface ListModalProps {
  visible: boolean
  onClose: () => void
  listableItems: Item[]
  floorPrice?: number | null
  collectionName?: string
  isPending: boolean
  onList: (params: { prices: number[]; duration: number; autoAdjust: boolean }) => Promise<void>
}

export type PillVariant = "primary" | "danger" | "secondary"

export interface ActionPillProps {
  label: string
  icon: React.ReactNode
  count: number
  onPress: () => void
  disabled: boolean
  loading?: boolean
  variant?: PillVariant
}

export interface DelistModalProps {
  visible: boolean
  onClose: () => void
  delistableItems: Item[]
  collectionName?: string
  isPending: boolean
  onDelist: () => Promise<void>
}
