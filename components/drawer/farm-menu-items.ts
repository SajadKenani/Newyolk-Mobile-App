import { ExpoRoutes } from "@/config/routes"
import { useSafeTranslation } from "@/hooks/safe-translation"

import type { RouterOutputs } from "@newyolk/api"

import type { MenuItem, NavigationItem } from "../types/interface"

const { t } = useSafeTranslation

export const FarmMenuItems = (farmingInfo: RouterOutputs["farm"]["myFarmingInfo"]["farm"]): MenuItem[] => [
  { icon: "🐔", value: farmingInfo.hens.isFarming.hens, route: t.Header.hens },
  { icon: "🥚", value: farmingInfo.hens.isGrowing.chicks, route: t.Header.chicks },
  { icon: "🐤", value: farmingInfo.hens.isFarming.roosters, route: t.Header.roosters },
  { icon: "🐣", value: farmingInfo.hens.isGrowing.cockerels, route: t.Header.cockerels },
  { icon: "🐄", value: farmingInfo.cattles.isFarming, route: t.Header.cattles },
  { icon: "🐮", value: farmingInfo.cattles.isGrowing.heifers, route: t.Header.heifers },
  { icon: "🐂", value: farmingInfo.cattles.isGrowing.bulls, route: t.Header.bulls },
]

export const NavigationItems = (): NavigationItem[] => [
  { id: "farm", icon: "home-city", label: t.Header.buttons.farmCenter, route: ExpoRoutes.mainTabs.farm },
  { id: "pricing", icon: "refresh", label: t.Header.buttons.pricing ?? "", route: ExpoRoutes.mainTabs.pricing },
  { id: "assets", icon: "view-list", label: t.Header.buttons.viewAssets, route: ExpoRoutes.mainTabs.assets },
  { id: "breeding", icon: "egg", label: t.Header.buttons.breeding, route: ExpoRoutes.drawer.breeding },
  { id: "marketplace", icon: "store", label: t.Header.buttons.marketplace, route: ExpoRoutes.drawer.marketplace },
  { id: "account", icon: "account-circle", label: t.Header.buttons.manageAccount, route: ExpoRoutes.drawer.account },
  { id: "withdraw", icon: "bank-transfer-out", label: t.Header.buttons.withdraw, route: ExpoRoutes.drawer.withdraw },
  { id: "history", icon: "history", label: t.Header.buttons.history, route: ExpoRoutes.drawer.history },
  { id: "language", icon: "translate", label: t.Header.buttons.language ?? "", route: ExpoRoutes.language },
]
