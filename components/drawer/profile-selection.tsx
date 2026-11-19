import { useEffect, useMemo, useState } from "react"
import { Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import { useProfileSection } from "@/features/account/hooks/useProfileSection"
import { useSafeTranslation } from "@/hooks/safe-translation"
import { Check, ChevronDown } from "lucide-react-native"
import type { RouterOutputs } from "@/config/react-provider"

import { LoadingSpinner } from "../helpers/loading"
import { styles } from "../types/style"

const ProfileSection = ({ user, farmingInfo }: { user: RouterOutputs["user"]["me"]; farmingInfo: RouterOutputs["farm"]["myFarmingInfo"] | undefined }) => {
  const { t, isLoading, isVisible, setIsVisible, selected, getInitials, handleSelect } = useProfileSection(farmingInfo)
  const [, setLanguageVersion] = useState(0)

  useEffect(() => {
    return useSafeTranslation.subscribe(() => {
      setLanguageVersion((currentVersion) => currentVersion + 1)
    })
  }, [])

  const COLORS = useThemeColors()
  const drawerStyles = useMemo(() => createStyles(COLORS), [COLORS])
  const displayName = user.name ?? user.email.split("@")[0]
  const selectedRealmLabel = selected ? t(`Header.${selected}`) : t(`Header.${user.sessionRealm}`)

  if (isLoading) return <LoadingSpinner />

  return (
    <View style={drawerStyles.wrapper}>
      <View style={drawerStyles.card}>
        <LinearGradient colors={[COLORS.primary[500] + "14", "transparent"]} start={{ x: 0.1, y: 0 }} end={{ x: 1, y: 1 }} style={drawerStyles.cardSheen} />
        <View style={drawerStyles.glowPrimary} />
        <View style={drawerStyles.glowSecondary} />
        <View style={drawerStyles.cardInnerRing} />

        {/* <View style={drawerStyles.topBadgeRow}>
          <View style={drawerStyles.badgePill}>
            <Text style={drawerStyles.badgePillText}>{t.Header.buttons.manageAccount}</Text>
          </View>
          <View style={drawerStyles.realmIndicatorPill}>
            <View style={[drawerStyles.realmDot, { backgroundColor: user.sessionRealm === "Iraq" ? COLORS.success[500] : COLORS.primary[500] }]} />
            <Text style={drawerStyles.realmIndicatorText}>{selectedRealmLabel}</Text>
          </View>
        </View> */}

        <View style={drawerStyles.profileRow}>
          <View style={drawerStyles.copyBlock}>
            <Text style={drawerStyles.nameText}>{displayName}</Text>
            <Text style={drawerStyles.emailText} numberOfLines={1}>
              {user.email}
            </Text>

            <TouchableOpacity style={drawerStyles.realmButton} onPress={() => setIsVisible(true)} activeOpacity={0.88}>
              <View style={drawerStyles.realmButtonContent}>
                <View style={[drawerStyles.realmDot, { backgroundColor: user.sessionRealm === "Iraq" ? COLORS.success[500] : COLORS.primary[500] }]} />
                <Text style={drawerStyles.realmButtonText} numberOfLines={1}>
                  {selectedRealmLabel}
                </Text>
              </View>
              <ChevronDown color={COLORS.primary[300]} size={17} />
            </TouchableOpacity>
          </View>
          <View style={drawerStyles.avatarWrap}>
            <View style={[styles.profileBorder, drawerStyles.avatarBorder, { borderColor: COLORS.primary[500] + "55" }]}>
              {user.image ? (
                <Image source={{ uri: user.image }} style={styles.profileImage} resizeMode="cover" />
              ) : (
                <View style={[styles.profileImage, drawerStyles.avatarFallback, { backgroundColor: COLORS.zinc[800] }]}>
                  <Text style={drawerStyles.avatarFallbackText}>{getInitials(user.email || "U")}</Text>
                </View>
              )}
            </View>
            <View style={[drawerStyles.avatarStatus, { backgroundColor: user.sessionRealm === "Iraq" ? COLORS.success[500] : COLORS.primary[500] }]} />
          </View>
        </View>

        {/* <View style={drawerStyles.balancePanel}>
          <View style={drawerStyles.balanceIconWrap}>
            <CircleDollarSign size={18} color={COLORS.primary[300]} strokeWidth={2.2} />
          </View>
          <View style={drawerStyles.balanceCopy}>
            <Text style={drawerStyles.balanceLabel}>{t.Header.totalBalance}</Text>
            <Text style={drawerStyles.balanceValue}>{totalBalance}</Text>
          </View>
        </View> */}

        <Modal visible={isVisible} transparent animationType="slide" onRequestClose={() => setIsVisible(false)}>
          <TouchableOpacity style={drawerStyles.modalBackdrop} activeOpacity={1} onPress={() => setIsVisible(false)}>
            <View style={drawerStyles.modalSheet}>
              <LinearGradient
                colors={[COLORS.primary[500] + "12", "transparent"]}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={drawerStyles.modalSheen}
              />
              <View pointerEvents="none" style={drawerStyles.modalOrb} />
              <View pointerEvents="none" style={drawerStyles.modalInnerRing} />
              <View style={drawerStyles.modalHandle} />
              <View style={drawerStyles.modalHeader}>
                <Text style={drawerStyles.modalEyebrow}>NEWYOLK</Text>
                <Text style={drawerStyles.modalTitle}>{t.Header.selectRealm}</Text>
              </View>

              {(["Iraq", "Romania"] as const).map((option, index) => {
                const isCurrentRealm = user.sessionRealm === option
                return (
                  <TouchableOpacity
                    key={index}
                    disabled={isCurrentRealm}
                    style={[
                      drawerStyles.realmOption,
                      {
                        backgroundColor: isCurrentRealm ? COLORS.primary[500] + "18" : COLORS.zinc[950],
                        borderColor: isCurrentRealm ? COLORS.primary[500] + "66" : COLORS.zinc[800],
                        opacity: isCurrentRealm ? 0.7 : 1,
                      },
                    ]}
                    onPress={() => handleSelect(option)}
                    activeOpacity={0.9}
                  >
                    <View style={drawerStyles.realmOptionLeft}>
                      <View style={[drawerStyles.realmOptionDot, { backgroundColor: option === "Iraq" ? COLORS.success[500] : COLORS.primary[500] }]} />
                      <View>
                        <Text style={[drawerStyles.realmOptionTitle, { color: isCurrentRealm ? COLORS.primary[300] : COLORS.white }]}>
                          {t(`Header.${option}`)}
                        </Text>
                        <Text style={drawerStyles.realmOptionMeta}>{option.toUpperCase()}</Text>
                      </View>
                    </View>
                    {isCurrentRealm && (
                      <View style={drawerStyles.realmOptionCheck}>
                        <Check size={14} color={COLORS.white} strokeWidth={2.5} />
                      </View>
                    )}
                  </TouchableOpacity>
                )
              })}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  )
}

const createStyles = (COLORS: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    wrapper: {
      marginBottom: 24,
      paddingHorizontal: 16,
      paddingTop: 18,
    },
    card: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 28,
      borderWidth: 1,
      borderColor: COLORS.white + "10",
      backgroundColor: "rgba(18, 26, 40, 0.94)",
      paddingVertical: 18,
      paddingHorizontal: 18,
    },
    cardSheen: {
      ...StyleSheet.absoluteFillObject,
    },
    cardInnerRing: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 27,
      borderWidth: 1,
      borderColor: COLORS.white + "05",
      margin: 1,
    },
    glowPrimary: {
      position: "absolute",
      right: -30,
      top: -24,
      width: 148,
      height: 148,
      borderRadius: 999,
      backgroundColor: COLORS.primary[500] + "1A",
    },
    glowSecondary: {
      position: "absolute",
      left: -42,
      bottom: -48,
      width: 118,
      height: 118,
      borderRadius: 999,
      backgroundColor: COLORS.white + "07",
    },
    topBadgeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 18,
    },
    badgePill: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.primary[500] + "26",
      backgroundColor: COLORS.primary[500] + "10",
      paddingHorizontal: 11,
      paddingVertical: 7,
    },
    badgePillText: {
      fontSize: 10,
      textTransform: "uppercase",
      letterSpacing: 1.8,
      color: COLORS.primary[300],
    },
    realmIndicatorPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.white + "0A",
      backgroundColor: "rgba(255,255,255,0.05)",
      paddingHorizontal: 10,
      paddingVertical: 7,
    },
    realmIndicatorText: {
      fontSize: 11,
      color: COLORS.zinc[300],
    },
    realmDot: {
      width: 9,
      height: 9,
      borderRadius: 999,
    },
    profileRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 18,
    },
    avatarWrap: {
      position: "relative",
    },
    avatarBorder: {
      borderWidth: 2,
      padding: 4,
      backgroundColor: "rgba(9, 13, 21, 0.42)",
    },
    avatarFallback: {
      alignItems: "center",
      justifyContent: "center",
    },
    avatarFallbackText: {
      fontSize: 20,
      color: COLORS.white,
    },
    avatarStatus: {
      position: "absolute",
      right: 6,
      bottom: 6,
      width: 14,
      height: 14,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: COLORS.zinc[950],
    },
    copyBlock: {
      flex: 1,
      minWidth: 0,
    },
    nameText: {
      fontSize: 20,
      lineHeight: 24,
      color: COLORS.white,
      marginBottom: 4,
    },
    emailText: {
      fontSize: 12,
      lineHeight: 16,
      color: COLORS.zinc[500],
      marginBottom: 14,
    },
    realmButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.white + "0A",
      backgroundColor: "rgba(255,255,255,0.06)",
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    realmButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flexShrink: 1,
      paddingRight: 10,
    },
    realmButtonText: {
      fontSize: 14,
      color: COLORS.zinc[200],
    },
    balancePanel: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.zinc[800],
      backgroundColor: COLORS.black + "82",
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    balanceIconWrap: {
      width: 42,
      height: 42,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.primary[500] + "14",
      borderWidth: 1,
      borderColor: COLORS.primary[500] + "30",
    },
    balanceCopy: {
      flex: 1,
      minWidth: 0,
    },
    balanceLabel: {
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      color: COLORS.primary[300],
      marginBottom: 4,
    },
    balanceValue: {
      fontSize: 17,
      lineHeight: 21,
      color: COLORS.white,
    },
    modalBackdrop: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.72)",
    },
    modalSheet: {
      overflow: "hidden",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderWidth: 1,
      borderBottomWidth: 0,
      borderColor: COLORS.white + "10",
      backgroundColor: "rgba(18, 26, 40, 0.98)",
      paddingTop: 10,
      paddingBottom: 32,
      paddingHorizontal: 18,
      position: "relative",
    },
    modalSheen: {
      ...StyleSheet.absoluteFillObject,
    },
    modalOrb: {
      position: "absolute",
      top: -30,
      right: -20,
      width: 132,
      height: 132,
      borderRadius: 999,
      backgroundColor: COLORS.primary[500] + "16",
    },
    modalInnerRing: {
      ...StyleSheet.absoluteFillObject,
      borderTopLeftRadius: 29,
      borderTopRightRadius: 29,
      borderWidth: 1,
      borderColor: COLORS.white + "05",
      margin: 1,
    },
    modalHandle: {
      width: 42,
      height: 4,
      borderRadius: 999,
      alignSelf: "center",
      backgroundColor: COLORS.zinc[700],
      marginBottom: 18,
    },
    modalHeader: {
      alignItems: "center",
      marginBottom: 14,
    },
    modalEyebrow: {
      fontSize: 10,
      textTransform: "uppercase",
      letterSpacing: 2,
      color: COLORS.primary[300],
      marginBottom: 6,
    },
    modalTitle: {
      fontSize: 20,
      color: COLORS.white,
    },
    realmOption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 22,
      borderWidth: 1,
      paddingHorizontal: 18,
      paddingVertical: 16,
      marginTop: 10,
    },
    realmOptionLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    realmOptionDot: {
      width: 12,
      height: 12,
      borderRadius: 999,
    },
    realmOptionTitle: {
      fontSize: 16,
      marginBottom: 2,
    },
    realmOptionMeta: {
      fontSize: 10,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      color: COLORS.zinc[500],
    },
    realmOptionCheck: {
      width: 28,
      height: 28,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.primary[500],
    },
  })

export default ProfileSection
