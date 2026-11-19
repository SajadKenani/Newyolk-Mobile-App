import { authClient } from "@/auth/client"
import { api } from "@/config/react-provider"

// ---------------------------------------------------------------------------
// All values are resolved hex strings â€” safe for React Native, Expo
// LinearGradient, canvas APIs, and any other context that can't parse
// CSS custom properties.
//
// Primary palette uses the gold/amber brand color from globals.css
// (--primary: oklch(0.7501 0.1501 85.1456) â†’ #cc8a29 family).
// Both Iraq and Romania realms share the same gold primary.
// ---------------------------------------------------------------------------

// Gold primary scale â€” derived from --color-gold / --color-gold-dark / --color-amber
const GOLD_PRIMARY = {
  50: "#fef9e7",
  100: "#fdf3cf",
  200: "#fbe89f",
  300: "#f9dc6f",
  400: "#f7d040",
  500: "#cc8a29", // --color-gold-dark  (main brand gold)
  600: "#b87a24",
  700: "#9e681e",
  800: "#835618",
  900: "#664311",
  950: "#3d2709",
} as const

const SHARED = {
  white: "#ffffff",
  offWhite: "#fdfff5",
  black: "#000000",
  transparent: "transparent",

  primary: GOLD_PRIMARY,

  slate: {
    400: "#aab7b8", // --color-concrete-400
    500: "#95a5a6", // --color-concrete-500
    900: "#1b2631", // --color-wet-asphalt-900
    950: "#17202a", // --color-midnight-blue-900
  },

  amber: {
    400: "#fbbf24",
    500: "#f59e0b",
    yellow500: "#eab308",
  },

  emerald: {
    400: "#58d68d", // --color-emerald-400
    500: "#2ecc71", // --color-emerald-500
  },

  success: {
    50: "#e9f7ef", // --color-nephritis-50
    100: "#d4efdf",
    200: "#a9dfbf",
    300: "#7dcea0",
    400: "#52be80",
    500: "#27ae60", // --color-nephritis-500
    600: "#229954",
    700: "#1e8449",
    800: "#196f3d",
    900: "#145a32",
  },

  warning: {
    50: "#fef9e7", // --color-sunflower-50
    100: "#fcf3cf",
    200: "#f9e79f",
    300: "#f7dc6f",
    400: "#f4d03f",
    500: "#f1c40f", // --color-sunflower-500
    600: "#d4ac0d",
    700: "#b7950b",
    800: "#9a7d0a",
    900: "#7d6608",
  },

  danger: {
    50: "#fdedec", // --color-alizarin-50
    100: "#fadbd8",
    200: "#f5b7b1",
    300: "#f1948a",
    400: "#ec7063",
    500: "#e74c3c", // --color-alizarin-500
    600: "#cb4335",
    700: "#b03a2e",
    800: "#943126",
    900: "#78281f",
  },

  zinc: {
    50: "#fdfefe", // --color-clouds-50
    100: "#fbfcfc",
    200: "#e5e7e9", // --color-silver-200
    300: "#d7dbdd",
    400: "#cacfd2",
    500: "#95a5a6", // --color-concrete-500
    600: "#707b7c", // --color-asbestos-600
    700: "#34495e", // --color-wet-asphalt-500
    800: "#283747",
    900: "#2c3e50", // --color-midnight-blue-500
    950: "#17202a",
  },

  violet: {
    400: "#af7ac5", // --color-amethyst-400
    500: "#9b59b6", // --color-amethyst-500
    950: "#4a235a", // --color-wisteria-900
  },
} as const

// ---------------------------------------------------------------------------
// Both realms share the gold theme â€” only kept separate in case
// per-realm overrides are needed again in the future.
// ---------------------------------------------------------------------------
const IRAQ_COLORS = { ...SHARED } as const
const ROMANIA_COLORS = { ...SHARED } as const

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ThemeColors = typeof SHARED

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export const useThemeColors = (): ThemeColors => {
  const { data: session, isPending } = authClient.useSession()

  const user = api.user.me.useQuery(undefined, {
    enabled: !!session && !isPending,
  })
  const realm = user.data?.sessionRealm ?? "Romania"

  return realm === "Iraq" ? IRAQ_COLORS : ROMANIA_COLORS
}

// ---------------------------------------------------------------------------
// Static fallback (for non-hook contexts)
// ---------------------------------------------------------------------------
export const COLORS = SHARED
