import type { StyleProp, ViewStyle } from "react-native"

import type { RouterOutputs } from "@newyolk/api"
import type { Realm, Store } from "@newyolk/db/browser"

import type { DataProps } from "./type"

/** Session shape from Better Auth's useSession().data */
export interface BetterAuthSession {
  user: {
    id: string
    email: string
    name: string
    [key: string]: unknown
  }
  session: {
    id: string
    [key: string]: unknown
  }
}

// ============================================================================
// CORE DATA MODELS
// ============================================================================

export interface User {
  id: number
  name: string
  email: string
  image: string
  farm: string
  realm: string
  sessionRealm: string
}

// ============================================================================
// SHOP & PRICING
// ============================================================================

export interface TranslationItem {
  numId: string | number
  title?: string
  price?: string
  description?: string
}

export interface PricingData {
  discount: RouterOutputs["discount"]["getActive"]
  store: RouterOutputs["store"]["byNumIds"]
  farmInfo: RouterOutputs["farm"]["myFarmingInfo"] | undefined
  realm: Realm
  sessionRealm: Realm
}

// ============================================================================
// FORMS & VALIDATION
// ============================================================================

export type PaymentMethod = "tabadul" | "reinvestment"

export interface PaymentMethodOption {
  label: string
  value: PaymentMethod
  icon: string
}

export interface BooleanOption {
  label: string
  value: boolean
}

export interface FormData {
  item: string
  itemName: string
  itemLevelNumId: number
  itemAmount: number
  paymentMethod: PaymentMethod
  insurance: boolean
  isSelfDeposit: boolean
}

export interface FormErrors {
  paymentMethod?: string
  itemAmount?: string
}

export interface ValidationResult {
  errors: FormErrors
  isValid: boolean
}

export interface ErrorInfo {
  hasError: boolean
  message: string
}

// ============================================================================
// NAVIGATION & UI
// ============================================================================

export interface MenuItem {
  icon: string
  value?: number
  route: string
}

export interface NavigationItem {
  id: string
  icon: string
  label: string
  route: string
}

export interface CustomDrawerItemProps {
  icon: string
  label: string
  isActive?: boolean
  onPress?: () => void
  iconType?: "material-community" | "material"
  badge?: string | number
  isDestructive?: boolean
  value?: number
  compact?: boolean
}

export interface TabBarItemProps {
  focused: boolean
  label: string
  hasContainer?: boolean
  icon?: React.ReactNode
}

// ============================================================================
// LANGUAGE & LOCALIZATION
// ============================================================================

export type LanguageCode = "ar-ae" | "en-us" | "ro-ro"

export interface LanguageChoice {
  label: string
  code: LanguageCode
}

export interface LanguageOption {
  title: string
  message: string
  choices: LanguageChoice[]
}

// ============================================================================
// CHARTS & VISUALIZATION
// ============================================================================

export interface LineChartCompProps {
  width?: number
  height: number
  data: DataProps
  styleProps: StyleProp<ViewStyle>
  startColor: string
  endColor: string
  onPress?: (item: DataProps[number], index: number) => void
}

// ============================================================================
// GAME LEVELS & PROGRESSION
// ============================================================================

export interface NextLevelInfo {
  hensNeeded: number
  roostersNeeded: number
  nextLevel: RouterOutputs["store"]["byNumIds"][0]
}

export interface LevelCardProps {
  level: RouterOutputs["store"]["byNumIds"][0]
  isLocked: boolean
  isCurrentLevel: boolean
  isInGroup: boolean
  progress: number
  nextInfo?: NextLevelInfo | null
  handlePurchase: () => void
}

// ============================================================================
// DIALOGS & MODALS
// ============================================================================

export interface DialogDepositProps {
  setIsDialogOpen: (open: boolean) => void
  isDialogOpen: boolean
  level: Store
  highestLevel: RouterOutputs["store"]["byNumIds"][0]
  session: BetterAuthSession | null
  onSubmit?: (data: FormData) => void
  nextLevelInfo?: NextLevelInfo | null
  isLoading?: boolean
  disabled?: boolean
  initialDiscount?: RouterOutputs["discount"]["getActive"]
  specified?: Store[]
}
