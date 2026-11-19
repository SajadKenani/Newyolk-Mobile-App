export type TabValue = "all" | "idle" | "breeding" | "ready" | "incubating" | "roosters" | "eggs"
export type BreedingStatus = "idle" | "breeding" | "ready"
export type TabKey = "roosters" | "eggs"
export type EggStatus = "idle" | "incubating" | "ready"
export type ColorKey = keyof typeof PILL_COLORS
export type EmptyMessageKey = "emptyIdle" | "emptyIncubating" | "emptyReady" | "emptyBreeding" | "emptyAll" | "emptyRoosters" | "emptyEggs"
export type RoosterTab = "roosters" | "eggs"

export interface StatsBarProps {
  stats: { idle: number; breeding: number; ready: number; totalBreeds: number }
  totalRoosters: number
  yolkBalance: string
  breedingPriceInYolk: string
  breedingDuration: string
}
export interface RoosterGridProps {
  allItems: {
    hasEgg: boolean
    id: string
    isBreeding: boolean
    breedingSince: Date | null
    breedingsCounter: number
    image: string
    state: string
    numId: number
    name: string
  }[]
  breedingTimeInMs: string
  now: number
  onStartBreed?: (id: string) => void
  onFinishBreed?: (id: string) => void
  loadingIds?: Set<string>
  selectedItems?: string[]
  onToggleSelect?: (id: string) => void
  /** Called when the CTA button in the empty state is pressed */
  onNavigateToAssets?: () => void
}
export interface RoosterBreedCardProps {
  item: {
    id: string
    isBreeding: boolean
    breedingSince: Date | null
    breedingsCounter: number
    image: string
    state: string
    numId: number
    name: string
  }
  breedingTimeInMs: string
  now: number
  onStartBreed?: (id: string) => void
  onFinishBreed?: (id: string) => void
  isLoading?: boolean
  isSelected?: boolean
  onToggleSelect?: (id: string) => void
}
export interface EggStatsBarProps {
  stats: { idle: number; incubating: number; ready: number }
  totalEggs: number
  yolkBalance: string
  hatchingPriceInYolk: string
  hatchingDuration: string
}

export interface PillProps {
  icon: React.ReactNode
  label: string
  value: string
  suffix?: string
  extra?: string
  color?: ColorKey
}

export interface EggGridProps {
  allItems: {
    id: string
    state: string
    hatchingSince: Date | null
    isHatching: boolean
    createdAt: Date
    image: string
    numId: number
    name: string
  }[]
  hatchingTimeInMs: string
  hatchingEggExpiryInMs: string
  now: number
  onStartIncubation?: (id: string) => void
  onFinishHatching?: (id: string) => void
  loadingIds?: Set<string>
  selectedItems?: string[]
  onToggleSelect?: (id: string) => void
  /** Optional callback to navigate to the assets screen */
  onNavigateToAssets?: () => void
}
export interface EggBulkActionsBarProps {
  idleCount: number
  readyCount: number
  selectedCount: number
  selectedIdleCount: number
  selectedReadyCount: number
  onStartAllIdle: () => void
  onFinishAllReady: () => void
  onBulkStartSelected: () => void
  onBulkFinishSelected: () => void
  onDeselectAll: () => void
  isStarting: boolean
  isFinishing: boolean
}
export interface EggBreedItem {
  id: string
  state: string
  hatchingSince: Date | null
  isHatching: boolean
  createdAt: Date
  image: string
  numId: number
  name: string
}
export interface EggBreedCardProps {
  item: EggBreedItem
  hatchingTimeInMs: string
  hatchingEggExpiryInMs: string
  now: number
  onStartIncubation?: (id: string) => void
  onFinishHatching?: (id: string) => void
  isLoading?: boolean
  isSelected?: boolean
  onToggleSelect?: (id: string) => void
}
export interface SecondaryButtonProps {
  children: string
  onPress: () => void
  disabled?: boolean
  loading?: boolean
  flex?: boolean
  variant?: "start" | "finish"
}
export interface BulkActionsBarProps {
  idleCount: number
  readyCount: number
  selectedCount: number
  selectedIdleCount: number
  selectedReadyCount: number
  onStartAllIdle: () => void
  onFinishAllReady: () => void
  onBulkStartSelected: () => void
  onBulkFinishSelected: () => void
  onDeselectAll: () => void
  isStarting: boolean
  isFinishing: boolean
}

export const TAB_KEYS: TabValue[] = ["all", "idle", "incubating", "ready"]
export const STATUS_ORDER: Record<BreedingStatus, number> = { ready: 0, breeding: 1, idle: 2 }
export const TABS: { value: "roosters" | "eggs"; labelKey: "roosters" | "eggs" }[] = [
  { value: "roosters", labelKey: "roosters" },
  { value: "eggs", labelKey: "eggs" },
]
export const PILL_COLORS = {
  default: {
    bg: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.1)",
    text: "#9ca3af",
    value: "#ffffff",
  },
  green: {
    bg: "rgba(34,197,94,0.15)",
    border: "rgba(34,197,94,0.3)",
    text: "#4ade80",
    value: "#4ade80",
  },
  amber: {
    bg: "rgba(245,158,11,0.15)",
    border: "rgba(245,158,11,0.3)",
    text: "#fbbf24",
    value: "#fbbf24",
  },
  blue: {
    bg: "rgba(59,130,246,0.15)",
    border: "rgba(59,130,246,0.3)",
    text: "#60a5fa",
    value: "#60a5fa",
  },
  red: {
    bg: "rgba(239,68,68,0.15)",
    border: "rgba(239,68,68,0.3)",
    text: "#f87171",
    value: "#f87171",
  },
}
export const emptyTabMessages: Record<Exclude<TabValue, "all">, EmptyMessageKey> = {
  idle: "emptyIdle",
  incubating: "emptyIncubating",
  ready: "emptyReady",
  breeding: "emptyBreeding",
  roosters: "emptyRoosters",
  eggs: "emptyEggs",
}
import type { TranslationProxy } from "@/hooks/safe-translation"

// tabLabels is now a function to avoid calling hooks at module level
export const getTabLabels = (t: TranslationProxy): Record<TabValue, string> => ({
  all: t.Breeding.egg.tabAll,
  idle: t.Breeding.egg.tabIdle,
  incubating: t.Breeding.egg.tabIncubating,
  ready: t.Breeding.egg.tabReady,
  breeding: t.Breeding.tabAll,
  roosters: t.Breeding.tabRoosters,
  eggs: t.Breeding.tabEggs,
})
export const BADGE_STYLES: Record<BreedingStatus, { bg: string; border: string; text: string }> = {
  idle: { bg: "rgba(34,197,94,0.2)", border: "rgba(34,197,94,0.3)", text: "#4ade80" },
  breeding: { bg: "rgba(245,158,11,0.2)", border: "rgba(245,158,11,0.3)", text: "#fbbf24" },
  ready: { bg: "rgba(59,130,246,0.2)", border: "rgba(59,130,246,0.3)", text: "#60a5fa" },
}
