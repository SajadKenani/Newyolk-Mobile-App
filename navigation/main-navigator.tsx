import { useWindowDimensions } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { Tags, TrendingUp, Wheat } from "lucide-react-native"

import { CustomDrawerContent } from "@/components/layout"
import { CustomTabBar, EnhancedTabBarIcon } from "@/components/tabs-layout"
import { DrawerScreenNames, MainTabScreenNames } from "@/config/routes"
import { useThemeColors } from "@/config/colors"
import { AccountScreen } from "@/features/account/views"
import { AssetsScreen } from "@/features/assets/views"
import { BreedingScreen } from "@/features/breeding/views"
import { FarmScreen } from "@/features/farm/views"
import HistoryScreen from "@/features/history/views/history-screen"
import { MarketplaceScreen } from "@/features/marketplace/views"
import { PricingScreen } from "@/features/pricing/views"
import { WithdrawScreen } from "@/features/withdraw/views"
import { useSafeTranslation } from "@/hooks/safe-translation"

const Drawer = createDrawerNavigator()
const Tabs = createBottomTabNavigator()

function HomeTabs() {
  const COLORS = useThemeColors()
  const { t } = useSafeTranslation

  return (
    <Tabs.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.zinc[900],
          borderTopWidth: 0,
          borderRadius: 24,
          marginHorizontal: 12,
          marginBottom: 16,
          height: 64,
          shadowColor: COLORS.black,
          shadowOpacity: 0.15,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -2 },
          elevation: 8,
        },
        tabBarActiveTintColor: COLORS.primary[500],
        tabBarInactiveTintColor: COLORS.zinc[300],
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name={MainTabScreenNames.farm}
        options={{
          title: "Farm",
          tabBarLabel: "",
          tabBarIcon: ({ focused, color, size }) => (
            <EnhancedTabBarIcon label={t.Navigation?.routes?.[5]?.title ?? "Farm"} focused={focused} icon={<Wheat />} color={color} size={size} />
          ),
        }}
        component={FarmScreen}
      />
      <Tabs.Screen
        name={MainTabScreenNames.pricing}
        options={{
          title: "Pricing",
          tabBarLabel: "",
          tabBarIcon: ({ focused, color, size }) => (
            <EnhancedTabBarIcon label={t.Navigation?.routes?.[2]?.title ?? "Pricing"} focused={focused} icon={<Tags />} color={color} size={size} />
          ),
        }}
        component={PricingScreen}
      />
      <Tabs.Screen
        name={MainTabScreenNames.assets}
        options={{
          title: "Assets",
          tabBarLabel: "",
          tabBarIcon: ({ focused, color, size }) => (
            <EnhancedTabBarIcon label={t.Navigation?.routes?.[6]?.title ?? "Assets"} focused={focused} icon={<TrendingUp />} color={color} size={size} />
          ),
        }}
        component={AssetsScreen}
      />
    </Tabs.Navigator>
  )
}

const MainNavigator = () => {
  const { width } = useWindowDimensions()

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "transparent",
          width: 300,
        },
        drawerType: "slide",
        swipeEnabled: true,
        swipeEdgeWidth: width,
        overlayColor: "rgba(0, 0, 0, 0.7)",
        drawerPosition: "left",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name={DrawerScreenNames.home} component={HomeTabs} options={{ title: "Home" }} />
      <Drawer.Screen name={DrawerScreenNames.account} component={AccountScreen} options={{ title: "Account" }} />
      <Drawer.Screen name={DrawerScreenNames.marketplace} component={MarketplaceScreen} options={{ title: "Marketplace" }} />
      <Drawer.Screen name={DrawerScreenNames.withdraw} component={WithdrawScreen} options={{ title: "Withdraw" }} />
      <Drawer.Screen name={DrawerScreenNames.breeding} component={BreedingScreen} options={{ title: "Breeding" }} />
      <Drawer.Screen name={DrawerScreenNames.history} component={HistoryScreen} options={{ title: "History" }} />
    </Drawer.Navigator>
  )
}

export default MainNavigator
