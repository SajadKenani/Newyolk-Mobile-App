import type { NavigationItem } from "@/components/types/interface"
import { authClient } from "@/auth/client"
import { DrawerScreenNames, ExpoRoutes, MainTabScreenNames } from "@/config/routes"
import { api } from "@/config/react-provider"
import type { RouterOutputs } from "@/config/react-provider"
import type { DrawerContentComponentProps, DrawerNavigationProp } from "@react-navigation/drawer"
import { useCallback, useEffect, useState } from "react"
import { router } from "expo-router"
import { useSafeTranslation } from "@/hooks/safe-translation"

interface DrawerRoutes {
  [key: string]: object | undefined
  home: { screen?: "farm" | "pricing" | "assets" }
  marketplace: undefined
  account: undefined
  withdraw: undefined
}

export const useDrawerContent = (props: DrawerContentComponentProps) => {
  const drawerNav = props.navigation as unknown as DrawerNavigationProp<DrawerRoutes>
  const fallbackRoute = ExpoRoutes.mainTabs.farm

  const goTo = (route: string) => {
    const raw = route.trim()
    const clean = raw.startsWith("/") ? raw.slice(1) : raw

    // Map path-like and named routes to Drawer + nested Tab destinations
    switch (clean) {
      // Tabs inside Drawer 'home'
      case MainTabScreenNames.farm:
        drawerNav.navigate(DrawerScreenNames.home, { screen: MainTabScreenNames.farm })
        return
      case MainTabScreenNames.pricing:
        drawerNav.navigate(DrawerScreenNames.home, { screen: MainTabScreenNames.pricing })
        return
      case MainTabScreenNames.assets:
        drawerNav.navigate(DrawerScreenNames.home, { screen: MainTabScreenNames.assets })
        return
      // Tabs via '/main/*' paths
      case ExpoRoutes.mainTabs.farm.slice(1):
        drawerNav.navigate(DrawerScreenNames.home, { screen: MainTabScreenNames.farm })
        return
      case ExpoRoutes.mainTabs.pricing.slice(1):
        drawerNav.navigate(DrawerScreenNames.home, { screen: MainTabScreenNames.pricing })
        return
      case ExpoRoutes.mainTabs.assets.slice(1):
        drawerNav.navigate(DrawerScreenNames.home, { screen: MainTabScreenNames.assets })
        return
      case ExpoRoutes.main.slice(1):
        drawerNav.navigate(DrawerScreenNames.home, { screen: MainTabScreenNames.farm })
        return

      // Drawer-level pages (path and named)
      case "pages/marketplace":
      case DrawerScreenNames.marketplace:
        drawerNav.navigate(DrawerScreenNames.marketplace)
        return
      case "pages/account":
      case DrawerScreenNames.account:
        drawerNav.navigate(DrawerScreenNames.account)
        return
      case "pages/withdraw":
      case DrawerScreenNames.withdraw:
        drawerNav.navigate(DrawerScreenNames.withdraw)
        return
      case "pages/breeding":
      case DrawerScreenNames.breeding:
        drawerNav.navigate(DrawerScreenNames.breeding)
        return
      case "pages/history":
      case DrawerScreenNames.history:
        drawerNav.navigate(DrawerScreenNames.history)
        return
      // Unknown â†’ fallback to farm tab
      default:
        drawerNav.navigate(DrawerScreenNames.home, { screen: MainTabScreenNames.farm })
        return
    }
  }

  const { data: session } = authClient.useSession()
  const { t, changeLanguage } = useSafeTranslation
  const [currentLang, setCurrentLang] = useState(useSafeTranslation.getCurrentLanguage())

  const [activeRoute, setActiveRoute] = useState<string>(fallbackRoute)
  const [languageVisible, setLanguageVisible] = useState(false)
  const [selectedLang, setSelectedLang] = useState<string>(currentLang)
  const [signOutVisible, setSignOutVisible] = useState(false)

  useEffect(() => {
    return useSafeTranslation.subscribe((lang) => {
      setCurrentLang(lang)
      setSelectedLang((previousLang) => (previousLang === currentLang ? lang : previousLang))
    })
  }, [currentLang])

  const me = api.user.me.useQuery(undefined, {
    enabled: !!session?.user?.id,
    retry: false,
  })
  const user = me.data

  const farmingInfo = api.farm.myFarmingInfo.useQuery(undefined, {
    enabled: !!session?.user?.id,
    initialData: undefined as RouterOutputs["farm"]["myFarmingInfo"] | undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  const resolveActiveRoute = useCallback((): string => {
    const drawerState = props.state
    const current = drawerState.routes[drawerState.index]
    if (!current) return fallbackRoute

    if (current.name === DrawerScreenNames.home) {
      const nestedUnknown = (current as unknown as { state?: unknown }).state
      const isRecord = (val: unknown): val is Record<string, unknown> => typeof val === "object" && val !== null
      const isNavState = (val: unknown): val is { index: number; routes: { name: string }[] } => {
        if (!isRecord(val)) return false
        const idx = (val as { index?: unknown }).index
        const routes = (val as { routes?: unknown }).routes
        return typeof idx === "number" && Array.isArray(routes) && routes.every((r) => isRecord(r) && typeof (r as { name?: unknown }).name === "string")
      }
      if (isNavState(nestedUnknown)) {
        const child = nestedUnknown.routes[nestedUnknown.index]
        const nested = child?.name
        if (nested === MainTabScreenNames.farm) return ExpoRoutes.mainTabs.farm
        if (nested === MainTabScreenNames.pricing) return ExpoRoutes.mainTabs.pricing
        if (nested === MainTabScreenNames.assets) return ExpoRoutes.mainTabs.assets
        if (nested === DrawerScreenNames.breeding) return ExpoRoutes.drawer.breeding
      }
      return fallbackRoute
    }

    if (current.name === DrawerScreenNames.marketplace) return ExpoRoutes.drawer.marketplace
    if (current.name === DrawerScreenNames.account) return ExpoRoutes.drawer.account
    if (current.name === DrawerScreenNames.withdraw) return ExpoRoutes.drawer.withdraw
    if (current.name === DrawerScreenNames.breeding) return ExpoRoutes.drawer.breeding
    if (current.name === DrawerScreenNames.history) return ExpoRoutes.drawer.history

    return fallbackRoute
  }, [fallbackRoute, props.state])

  useEffect(() => {
    setActiveRoute(resolveActiveRoute())
  }, [resolveActiveRoute])

  const handleSignOut = (): void => {
    setSignOutVisible(true)
  }

  const handleConfirmSignOut = () => {
    void (async () => {
      try {
        await authClient.signOut()
        setSignOutVisible(false)
        router.reload()
      } catch (error) {
        console.error("Sign out error:", error)
      }
    })()
  }

  const handleRoutePressing = (item: NavigationItem): void => {
    if (item.route === ExpoRoutes.language) {
      setSelectedLang(currentLang)
      setLanguageVisible(true)
    } else {
      goTo(item.route)
      setActiveRoute(item.route)
      props.navigation.closeDrawer()
    }
  }
  const handleLanguageChange = () => {
    if (selectedLang && selectedLang !== currentLang) void changeLanguage(selectedLang as "en-us" | "ar-ae" | "ar-iq" | "ro-ro")
    router.setParams({})
    setLanguageVisible(false)
    props.navigation.closeDrawer()
  }

  return {
    t,
    currentLang,
    user,
    farmingInfo: farmingInfo.data,
    activeRoute,
    languageVisible,
    setLanguageVisible,
    signOutVisible,
    setSignOutVisible,
    selectedLang,
    setSelectedLang,
    handleSignOut,
    handleConfirmSignOut,
    handleRoutePressing,
    handleLanguageChange,
  }
}
