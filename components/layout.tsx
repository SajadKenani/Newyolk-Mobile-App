import type { DrawerContentComponentProps } from "@react-navigation/drawer"
import { StyleSheet, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import { useDrawerContent } from "@/hooks/useDrawerContent"
import { DrawerContentScrollView } from "@react-navigation/drawer"
import type { ImageSourcePropType } from "react-native"
import CustomLowerDrawerItem from "./drawer/custom-lower-drawer-item"
import { NavigationItems } from "./drawer/farm-menu-items"
import { LanguageDialog } from "./drawer/language-dialog"
import { SignOutDialog } from "./drawer/sign-out-dialog"
import ProfileSection from "./drawer/profile-selection"
import SectionHeader from "./drawer/section-header"
import SkeletalDrawer from "./skeleton/skeletal-drawer"
import { Image } from "react-native"

export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const {
    t,
    user,
    farmingInfo,
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
  } = useDrawerContent(props)
  const COLORS = useThemeColors()

  if (!user || !farmingInfo) return <SkeletalDrawer {...props} />

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
  const NewyolkIcon: ImageSourcePropType = require("@/assets/icons/adaptive-icon.png")

  return (
    <View style={[styles.container, { backgroundColor: "#111723" }]}>
      <LinearGradient colors={["#182235", "#111723", "#17141F"]} start={{ x: 0, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.backgroundGradient} />
      <View pointerEvents="none" style={[styles.topGlow, { backgroundColor: COLORS.primary[500] + "16" }]} />
      <View pointerEvents="none" style={[styles.bottomGlow, { backgroundColor: COLORS.white + "07" }]} />

      <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.brandCard, { borderColor: COLORS.white + "10", backgroundColor: "rgba(19, 28, 43, 0.92)" }]}>
          <LinearGradient colors={[COLORS.primary[500] + "14", "transparent"]} start={{ x: 0.08, y: 0 }} end={{ x: 1, y: 1 }} style={styles.brandSheen} />
          <View style={[styles.brandGlow, { backgroundColor: COLORS.primary[500] + "1A" }]} />
          <View style={[styles.brandInnerRing, { borderColor: COLORS.white + "05" }]} />

          <View style={styles.logoPlate}>
            <View style={[styles.logoBadge]}>
              <Image source={NewyolkIcon} style={styles.logo} />
            </View>
            <View style={styles.brandCopy}>
              <View style={[styles.brandAccent, { backgroundColor: COLORS.primary[500] }]} />
              <Text style={[styles.brandEyebrow, { color: COLORS.primary[300] }]}>NEWYOLK</Text>
              <Text style={[styles.brandTitle, { color: COLORS.white }]}>Farm Menu</Text>
              <Text style={[styles.brandSubtitle, { color: COLORS.zinc[400] }]}>Control panel</Text>
            </View>
          </View>
        </View>

        <View style={[styles.menuSection, { borderColor: COLORS.white + "0C", backgroundColor: "rgba(17, 24, 38, 0.9)" }]}>
          <SectionHeader title={t.Header.menu} />
          {NavigationItems().map((item) => (
            <CustomLowerDrawerItem
              key={`nav-${item.id}`}
              icon={item.icon}
              label={item.label}
              isActive={(activeRoute ?? "/farm") === item.route}
              onPress={() => handleRoutePressing(item)}
            />
          ))}
        </View>

        <View style={styles.actionSection}>
          <CustomLowerDrawerItem icon="logout" label={t.Header.buttons.signOut} onPress={handleSignOut} isDestructive={true} />
        </View>

        <View style={styles.footer}>
          <View style={[styles.versionPill, { borderColor: COLORS.white + "0A", backgroundColor: COLORS.white + "04" }]}>
            <Text style={[styles.versionText, { color: COLORS.zinc[500] }]}>NewYolk v1.0.0</Text>
          </View>
        </View>
      </DrawerContentScrollView>

      <LanguageDialog
        visible={languageVisible}
        onDismiss={() => setLanguageVisible(false)}
        selectedLang={selectedLang}
        onSelectLang={setSelectedLang}
        onApply={handleLanguageChange}
        t={t}
      />
      <SignOutDialog visible={signOutVisible} onDismiss={() => setSignOutVisible(false)} onConfirm={handleConfirmSignOut} t={t} />
      <ProfileSection user={user} farmingInfo={farmingInfo} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 18,
    paddingBottom: 12,
  },
  topGlow: {
    position: "absolute",
    top: -44,
    right: -28,
    width: 180,
    height: 180,
    borderRadius: 999,
  },
  bottomGlow: {
    position: "absolute",
    bottom: 120,
    left: -56,
    width: 180,
    height: 180,
    borderRadius: 999,
  },
  brandGlow: {
    position: "absolute",
    top: -42,
    right: -22,
    width: 148,
    height: 148,
    borderRadius: 999,
  },
  brandCard: {
    overflow: "hidden",
    borderRadius: 30,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 52,
    marginBottom: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: "relative",
  },
  brandSheen: {
    ...StyleSheet.absoluteFillObject,
  },
  brandInnerRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 29,
    borderWidth: 1,
    margin: 1,
  },
  logoPlate: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: 1,
    position: "relative",
  },
  logoBadge: {
    width: 86,
    height: 86,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 86,
    height: 86,
  },
  brandCopy: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    position: "relative",
    paddingLeft: 14,
  },
  brandAccent: {
    position: "absolute",
    left: 0,
    top: 8,
    bottom: 8,
    width: 4,
    borderRadius: 999,
  },
  brandEyebrow: {
    fontSize: 11,
    letterSpacing: 2.8,
    textTransform: "uppercase",
    marginBottom: 5,
    textAlign: "left",
  },
  brandTitle: {
    fontSize: 16,
    lineHeight: 28,
    textAlign: "left",
  },
  brandSubtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "left",
  },
  menuSection: {
    marginHorizontal: 8,
    borderRadius: 28,
    borderWidth: 1,
    paddingTop: 6,
    paddingBottom: 10,
    overflow: "hidden",
  },
  actionSection: {
    marginTop: 12,
    marginBottom: 8,
  },
  footer: {
    marginTop: "auto",
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  versionPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
  },
})
