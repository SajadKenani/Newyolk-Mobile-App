import type { useThemeColors } from "@/config/colors"
import { StyleSheet } from "react-native"

export const eggStatStyles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
    alignSelf: "flex-start",
  },
  row: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    gap: 4,
    paddingVertical: 0,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  pillLabel: {
    fontSize: 11,
  },
  pillValue: {
    fontSize: 11,
  },
  pillDot: {
    fontSize: 11,
    opacity: 0.6,
  },
})
export const eggGridStyles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },

  filterDeck: {
    gap: 12,
    marginBottom: 18,
    // paddingTop: 4,
  },
  filterEyebrow: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#71717a",
  },
  tabList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tabTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#111216",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  tabTriggerActive: {
    backgroundColor: "#191b22",
    borderColor: "rgba(250,204,21,0.38)",
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  tabTriggerText: {
    fontSize: 12,
    color: "#a1a1aa",
    letterSpacing: 0.3,
  },
  tabTriggerTextActive: {
    color: "#fef3c7",
  },
  tabCountBadge: {
    minWidth: 28,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
  },
  tabCountBadgeActive: {
    backgroundColor: "rgba(250,204,21,0.18)",
  },
  tabCountText: {
    fontSize: 11,
    color: "#d4d4d8",
  },
  tabCountTextActive: {
    color: "#fde68a",
  },

  tabContent: {
    marginTop: 0,
  },

  gridContent: {
    gap: 8,
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 18,
  },
  cardWrapper: {
    paddingHorizontal: 6,
  },

  // ── Empty States ─────────────────────────────────────────
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 16,
    fontSize: 18,
    color: "#6b7280", // muted-foreground
    textAlign: "center",
  },
  ctaButton: {
    backgroundColor: "#111827", // primary
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  ctaButtonText: {
    color: "#ffffff", // primary-foreground
    fontSize: 14,
  },
  emptyTabContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyTabText: {
    fontSize: 14,
    color: "#6b7280", // muted-foreground
  },
})
export const eggBulkActionStyles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(8,10,16,0.96)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  selectedInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  mutedText: {
    fontSize: 11,
    color: "#d4d4d8",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  closeButtonDisabled: {
    opacity: 0.4,
  },
  closeIcon: {
    fontSize: 14,
    color: "#9ca3af",
    lineHeight: 14,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    flexShrink: 0,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minWidth: 110,
    minHeight: 48,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 6,
  },
  buttonStart: {
    backgroundColor: "#0f2b1f",
    borderColor: "rgba(74,222,128,0.28)",
    shadowColor: "#16a34a",
  },
  buttonFinish: {
    backgroundColor: "#0f203c",
    borderColor: "rgba(96,165,250,0.28)",
    shadowColor: "#2563eb",
  },
  buttonDisabled: {
    opacity: 0.42,
  },
  buttonText: {
    fontSize: 11,
    letterSpacing: 0.9,
    textTransform: "uppercase",
  },
  buttonTextStart: {
    color: "#dcfce7",
  },
  buttonTextFinish: {
    color: "#dbeafe",
  },
  buttonTextDisabled: {
    color: "#d1d5db",
  },
  spinner: {
    marginRight: 6,
  },
})
export const eggBreedStyles = StyleSheet.create({
  // Card
  card: {
    aspectRatio: 2 / 4,
    minHeight: 280,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#0b0c10",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: "#818cf8",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },
  cardIncubating: {
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 8,
  },
  cardReady: {
    shadowColor: "#60a5fa",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 10,
  },

  // Ready pulse overlay
  readyBorderOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#eab308",
    zIndex: 10,
  },

  imageFrame: {
    ...StyleSheet.absoluteFillObject,
  },

  // Image
  image: {
    width: "100%",
    height: "100%",
  },
  imageScrim: {
    backgroundColor: "rgba(8,10,16,0.22)",
  },

  // Checkbox
  checkboxContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#9ca3af",
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  checkboxTick: {
    color: "#fff",
    fontSize: 12,
    lineHeight: 14,
  },

  // Badge
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    borderWidth: 1,
  },
  badgeIdle: {
    backgroundColor: "rgba(34,197,94,0.2)",
    borderColor: "rgba(34,197,94,0.3)",
  },
  badgeIncubating: {
    backgroundColor: "rgba(245,158,11,0.2)",
    borderColor: "rgba(245,158,11,0.3)",
  },
  badgeReady: {
    backgroundColor: "rgba(59,130,246,0.2)",
    borderColor: "rgba(59,130,246,0.3)",
  },
  badgeText: {
    fontSize: 11,
    letterSpacing: 0.4,
  },
  badgeTextIdle: { color: "#4ade80" },
  badgeTextIncubating: { color: "#fbbf24" },
  badgeTextReady: { color: "#60a5fa" },

  // Bottom overlay
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(7,8,12,0.94)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    gap: 10,
  },

  contentTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  titleEyebrow: {
    fontSize: 10,
    lineHeight: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "#94a3b8",
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    lineHeight: 22,
  },
  numIdBadge: {
    borderRadius: 9999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  numId: {
    color: "#ffffff",
    fontSize: 12,
    lineHeight: 14,
  },
  summaryPill: {
    borderRadius: 9999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignSelf: "flex-start",
    maxWidth: "100%",
  },
  summaryPillIdle: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderColor: "rgba(34,197,94,0.24)",
  },
  summaryPillIncubating: {
    backgroundColor: "rgba(245,158,11,0.12)",
    borderColor: "rgba(245,158,11,0.24)",
  },
  summaryPillReady: {
    backgroundColor: "rgba(59,130,246,0.14)",
    borderColor: "rgba(59,130,246,0.24)",
  },
  summaryPillText: {
    fontSize: 11,
    lineHeight: 14,
  },
  summaryPillTextIdle: {
    color: "#86efac",
  },
  summaryPillTextIncubating: {
    color: "#fcd34d",
  },
  summaryPillTextReady: {
    color: "#93c5fd",
  },

  // Progress
  progressSection: {
    gap: 6,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  progressLabel: {
    fontSize: 11,
    color: "#9ca3af",
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#6366f1",
  },
  progressPercentOverlay: {
    position: "absolute",
    top: 0,
    right: 8,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  progressPercent: {
    fontSize: 9,
    color: "#ffffff",
  },

  // Action button
  actionButton: {
    marginTop: 2,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  actionButtonIdle: {
    backgroundColor: "#1f8f56",
    borderColor: "rgba(110,231,183,0.28)",
  },
  actionButtonReady: {
    backgroundColor: "#2563eb",
    borderColor: "rgba(147,197,253,0.28)",
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 13,
    letterSpacing: 0.2,
  },
})
export const bulkActionStyles = StyleSheet.create({
  bar: {
    // backgroundColor: "rgba(8,10,16,0.96)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  inner: {
    gap: 10,
  },
  innerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 4,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  labelRowTablet: {
    justifyContent: "flex-start",
    flex: 0,
  },
  label: {
    fontSize: 11,
    color: "#d4d4d8",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  labelTablet: {
    fontSize: 13,
  },
  deselectBtn: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minWidth: 110,
    minHeight: 48,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 6,
  },
  btnStart: {
    backgroundColor: "#0f2b1f",
    borderColor: "rgba(74,222,128,0.28)",
    shadowColor: "#16a34a",
  },
  btnFinish: {
    backgroundColor: "#0f203c",
    borderColor: "rgba(96,165,250,0.28)",
    shadowColor: "#2563eb",
  },
  btnFlex: {
    flex: 1,
  },
  btnText: {
    fontSize: 11,
    letterSpacing: 0.9,
    textTransform: "uppercase",
  },
  btnTextStart: {
    color: "#dcfce7",
  },
  btnTextFinish: {
    color: "#dbeafe",
  },
  spinner: {
    marginRight: 6,
  },
  disabled: {
    opacity: 0.42,
  },
})
export const roosterBreedStyles = StyleSheet.create({
  card: {
    aspectRatio: 2 / 3,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderColor: "transparent",
  },
  cardSelected: {
    borderColor: "#6366f1",
  },

  // Ready pulse overlay
  readyBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#eab308",
    zIndex: 10,
  },

  // Image
  image: {
    width: "100%",
    height: "100%",
  },

  // Checkbox
  checkboxContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#9ca3af",
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  checkboxTick: {
    color: "#fff",
    fontSize: 12,
    lineHeight: 14,
  },

  // Badge
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
  },

  // Bottom overlay
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    padding: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  numId: {
    color: "#ffffff",
    fontSize: 14,
  },
  mutedText: {
    fontSize: 11,
    color: "#9ca3af",
  },

  // Progress
  progressSection: {
    marginTop: 8,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#6366f1",
  },
  progressPercentOverlay: {
    alignItems: "center",
    justifyContent: "center",
  },
  progressPercent: {
    fontSize: 9,
    color: "#ffffff",
  },
  readyLabel: {
    fontSize: 11,
    color: "#93c5fd",
  },

  // Action button
  actionButton: {
    marginTop: 8,
    backgroundColor: "#374151",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 13,
  },
})
export const roosterGridStyles = (COLORS: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    container: {
      marginTop: 14,
    },

    // Tab bar
    tabBar: {
      flexDirection: "row",
      alignSelf: "flex-start",
      backgroundColor: COLORS.black,
      borderRadius: 18,
      padding: 4,
      gap: 6,
    },
    tabItem: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 14,
    },
    tabItemActive: {
      backgroundColor: COLORS.white,
    },
    tabLabel: {
      fontSize: 12,
      color: COLORS.zinc[500],
      letterSpacing: 0.5,
    },
    tabLabelActive: {
      color: COLORS.black,
    },

    // Grid
    listContent: {
      paddingTop: 14,
      paddingBottom: 8,
    },
    columnWrapper: {
      gap: 12,
      marginBottom: 12,
    },
    cardWrapper: {
      flex: 1,
      minWidth: 0,
    },
    cardWrapperSingle: {
      width: "100%",
    },

    // Global empty state
    emptyGlobal: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 64,
      gap: 16,
    },
    emptyGlobalText: {
      fontSize: 16,
      color: "#6b7280",
      textAlign: "center",
    },
    ctaButton: {
      backgroundColor: COLORS.primary[900],
      borderRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    ctaButtonText: {
      color: "#ffffff",
      fontSize: 14,
    },

    // Per-tab empty state
    emptyTab: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 48,
    },
    emptyTabText: {
      fontSize: 13,
      color: "#6b7280",
    },
  })
export const statBarstyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 8,
    paddingVertical: 4,
  },
  tabList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 0,
    height: 32,
  },
  pillIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  pillLabel: {
    fontSize: 12,
  },
  pillValue: {
    fontSize: 12,
  },
  pillDot: {
    fontSize: 12,
    opacity: 0.6,
  },
})
export const breedingStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 160,
    paddingHorizontal: 16,
    // paddingBottom: 16,
    backgroundColor: "#000000",
    gap: 1,
  },
  heroCard: {
    borderRadius: 28,
    padding: 20,
    backgroundColor: "#09090b",
    gap: 16,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: 14,
  },
  heroCopy: {
    flex: 1,
    gap: 6,
  },
  heroEyebrow: {
    fontSize: 11,
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 1.8,
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 34,
    color: "#ffffff",
  },
  heroDescription: {
    fontSize: 14,
    color: "#a1a1aa",
  },
  heroStatCard: {
    minWidth: 108,
    borderRadius: 22,
    backgroundColor: "#000000",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    gap: 8,
  },
  heroStatValue: {
    fontSize: 30,
    lineHeight: 34,
    color: "#ffffff",
  },
  heroStatLabel: {
    fontSize: 12,
    color: "#a1a1aa",
  },
  contentShell: {
    flex: 1,
    borderWidth: 1,
    overflow: "hidden",
  },
  contentHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.12)",
  },
  contentHeaderCopy: {
    flex: 1,
    gap: 4,
  },
  contentEyebrow: {
    fontSize: 11,
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  contentTitle: {
    fontSize: 22,
    color: "#ffffff",
  },
  contentDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: "#a1a1aa",
  },
  contentCountBadge: {
    minWidth: 88,
    borderRadius: 20,
    backgroundColor: "#121318",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "flex-start",
    gap: 2,
  },
  contentCountValue: {
    fontSize: 24,
    lineHeight: 28,
    color: "#ffffff",
  },
  contentCountLabel: {
    fontSize: 11,
    lineHeight: 15,
    color: "#a1a1aa",
  },
  metricRow: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 14,
    paddingBottom: 4,
  },
  metricCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "#111216",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  metricCardWarm: {
    backgroundColor: "rgba(251,191,36,0.12)",
    borderColor: "rgba(251,191,36,0.24)",
  },
  metricCardCool: {
    backgroundColor: "rgba(96,165,250,0.12)",
    borderColor: "rgba(96,165,250,0.24)",
  },
  metricLabel: {
    fontSize: 11,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  metricValue: {
    fontSize: 22,
    lineHeight: 26,
    color: "#ffffff",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    marginTop: 16,
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabItemActive: {
    borderBottomColor: "#6366f1",
  },
  tabLabel: {
    fontSize: 13,
    color: "#9ca3af",
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: "#ffffff",
  },
  tabPane: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 14,
    paddingBottom: 24,
    gap: 12,
  },
  panelSurface: {
    borderRadius: 22,
    backgroundColor: "#101116",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  gridSurface: {
    borderRadius: 24,
    backgroundColor: "#0c0d11",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
})
