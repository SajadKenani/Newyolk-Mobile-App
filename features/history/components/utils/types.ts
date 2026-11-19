import type { RouterOutputs } from "@newyolk/api"
import Decimal from "decimal.js"

export type BonusItem = RouterOutputs["history"]["bonuses"]["items"][number]
export type BadgeVariant = "default" | "secondary" | "destructive" | "outline"
export type DepositItem = RouterOutputs["history"]["deposits"]["items"][number]
export type FeedingItem = RouterOutputs["history"]["feedingLedger"]["items"][number]
export type SoldItem = RouterOutputs["history"]["marketplaceSold"]["items"][number]
export type PurchasedItem = RouterOutputs["history"]["marketplacePurchased"]["items"][number]
export type ListingItem = SoldItem | PurchasedItem
export type SubTab = "sold" | "purchased"
export type LedgerItem = RouterOutputs["history"]["transactionLedger"]["items"][number]
export type WithdrawalItem = RouterOutputs["history"]["withdrawals"]["items"][number]

export const colors = {
    background: "#0b0f14",
    card: "#121821",
    border: "#1f2937",
    text: "#e5e7eb",
    muted: "#9ca3af",
    primary: "#60a5fa",

    badge: {
        default: { bg: "#60a5fa", text: "#0b0f14" },
        secondary: { bg: "#1f2937", text: "#e5e7eb" },
        destructive: { bg: "#7f1d1d", text: "#fecaca" },
        outline: { bg: "transparent", text: "#e5e7eb" },
    },
}

export const STATUS_VARIANTS: Record<string, BadgeVariant> = {
    completed: "default",
    approved: "default",
    pendingApproval: "secondary",
    rejected: "destructive",
    cancelled: "outline",
}

export const getStatusVariant = (status: string): BadgeVariant => STATUS_VARIANTS[status] ?? "outline"
export const formatDecimal = (value: { toString(): string }, decimals = 2) => new Decimal(value.toString()).toFixed(decimals)
export const formatItem = (item: string) => item.replace(/_/g, " ")
export const formatType = (type: string) => type.replace(/_/g, " ")
export const formatAmount = (value: { toString(): string }) => new Decimal(value.toString()).toFixed(2)
