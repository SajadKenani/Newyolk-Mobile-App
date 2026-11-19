import { StyleSheet } from "react-native"
import { AMBER, EMERALD, MUTED, WHITE } from "./types"

export const liveStockStyles = StyleSheet.create({
  container: {
    position: "relative",
    borderRadius: 28,
    borderWidth: 1,
    overflow: "hidden",
    backgroundColor: "rgba(8, 12, 20, 0.84)",
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  panelGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  panelGlow: {
    position: "absolute",
    top: -34,
    right: -20,
    width: 150,
    height: 150,
    borderRadius: 999,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 14,
    gap: 4,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  mainContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    gap: 12,
  },
  section: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 14,
  },
  animalList: {
    gap: 10,
  },
  animalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emoji: {
    fontSize: 22,
  },
  count: {
    fontSize: 18,
  },
  animalLabel: {
    fontSize: 13,
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 30,
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 0,
  },
})

export const yieldStyles = StyleSheet.create({
  container: {
    position: "relative",
    borderRadius: 28,
    borderWidth: 1,
    overflow: "hidden",
    backgroundColor: "rgba(8, 12, 20, 0.84)",
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  panelGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  panelGlow: {
    position: "absolute",
    top: -34,
    right: -20,
    width: 150,
    height: 150,
    borderRadius: 999,
  },
  headerBlock: {
    gap: 4,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 6,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  rowSpaced: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  sectionGapTop: {
    marginTop: 14,
  },
  valueLeft: {
    flex: 1,
    fontSize: 18,
    textAlign: "left",
  },
  valueRight: {
    flex: 1,
    fontSize: 18,
    textAlign: "right",
  },
  divider: {
    height: 1,
    marginVertical: 18,
    marginHorizontal: 24,
  },
  rentRow: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  progressTrack: {
    height: 12,
    borderRadius: 8,
    marginHorizontal: 24,
    marginBottom: 24,
    overflow: "hidden",
  },
  progressFill: {
    height: 12,
    borderRadius: 8,
  },
})

export const actionCenterStyles = StyleSheet.create({
  container: {
    position: "relative",
    borderRadius: 28,
    borderWidth: 1,
    overflow: "hidden",
    backgroundColor: "rgba(8, 12, 20, 0.84)",
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  panelGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  panelGlow: {
    position: "absolute",
    top: -34,
    right: -20,
    width: 150,
    height: 150,
    borderRadius: 999,
  },
  headerBlock: {
    gap: 4,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 6,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    color: WHITE,
  },
  subtitle: {
    fontSize: 14,
    color: MUTED,
    lineHeight: 20,
    marginBottom: 12,
  },
  mainContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 12,
    gap: 12,
  },
  column: {
    flex: 1,
    alignItems: "flex-start",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  columnRight: {
    alignItems: "flex-end",
  },
  rewardsLabel: {
    fontSize: 14,
    color: AMBER,
    marginBottom: 2,
  },
  foodLabel: {
    fontSize: 14,
    color: EMERALD,
    marginBottom: 2,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  value: {
    fontSize: 20,
    marginRight: 4,
  },
  emoji: {
    fontSize: 20,
    marginRight: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 30,
    marginTop: 8,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 0,
  },
})

export const assetCardStyles = StyleSheet.create({
  container: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "rgba(8, 12, 20, 0.84)",
  },
  topSheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 88,
  },
  accentOrb: {
    position: "absolute",
    top: -22,
    right: -10,
    width: 88,
    height: 88,
    borderRadius: 999,
  },
  edgeOrb: {
    position: "absolute",
    bottom: -26,
    left: -18,
    width: 86,
    height: 86,
    borderRadius: 999,
  },
  innerRing: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderRadius: 22,
  },
  glowOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
  },
  header: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.025)",
  },
  headerRow: {
    justifyContent: "space-between",
  },
  headerLeft: {
    alignItems: "flex-start",
    gap: 10,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: {
    flex: 1,
  },
  assetEyebrow: {
    fontSize: 9,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  assetTitle: {
    fontSize: 18,
    lineHeight: 21,
  },
  assetSubtitle: {
    fontSize: 13,
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.012)",
  },
  balanceSection: {
    gap: 12,
  },
  balanceSurface: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
  },
  balanceLabelRow: {
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 10,
    textTransform: "uppercase",
  },
  balanceValues: {
    gap: 8,
  },
  amountRow: {
    alignItems: "baseline",
    minHeight: 36,
  },
  amount: {
    fontSize: 28,
    lineHeight: 30,
    flexShrink: 1,
  },
  metaRow: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  usdBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
    maxWidth: "64%",
  },
  usdValue: {
    fontSize: 11,
  },
  chartShell: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 6,
    overflow: "hidden",
  },
  chartHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  chartLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  sparkBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  sparkDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
  },
  sparkText: {
    fontSize: 10,
  },
  overlay: {},
})

export const giftTermsStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    rowGap: 16,
  },
  section: {
    marginBottom: 8,
  },
  headerBlock: {
    rowGap: 8,
  },
  title: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  bulletsLTR: {
    paddingLeft: 16,
  },
  bulletsRTL: {
    paddingRight: 16,
  },
  bulletText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
    color: "#FFFFFF",
  },
  acceptRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    columnGap: 8,
  },
  acceptTextBlock: {
    rowGap: 6,
    flex: 1,
  },
  acceptTitle: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  acceptSubtitle: {
    fontSize: 13,
    color: "#FFFFFF",
  },
  buttonLabel: {
    fontSize: 15,
    color: "#FFFFFF",
  },
})

export const giftCarouselStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  page: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    borderRadius: 24,
    borderWidth: 1,
    resizeMode: "cover",
  },
  caption: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  captionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  tryAgain: {
    marginTop: 8,
  },
  openButton: {
    marginTop: 8,
    alignSelf: "stretch",
  },
})
