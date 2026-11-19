export const ExpoRoutes = {
  index: "/",
  main: "/main",
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
  },
  mainTabs: {
    farm: "/main/farm",
    pricing: "/main/pricing",
    assets: "/main/assets",
  },
  drawer: {
    marketplace: "/marketplace",
    account: "/account",
    withdraw: "/withdraw",
    breeding: "/breeding",
    history: "/history",
  },
  language: "language",
} as const

export const MainTabScreenNames = {
  farm: "farm",
  pricing: "pricing",
  assets: "assets",
} as const

export const DrawerScreenNames = {
  home: "home",
  marketplace: "marketplace",
  account: "account",
  withdraw: "withdraw",
  breeding: "breeding",
  history: "history",
} as const
