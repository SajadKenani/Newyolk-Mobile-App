import { StyleSheet } from "react-native"
import type { useThemeColors } from "@/config/colors"

type ThemeColors = ReturnType<typeof useThemeColors>

// ─── Withdraw ────────────────────────────────────────────────────────────────

export const createWithdrawStyles = (C: ThemeColors) =>
  StyleSheet.create({
    container: { gap: 16 },
    centered: { paddingVertical: 32, alignItems: "center", justifyContent: "center" },
    emptyText: { color: C.zinc[500], fontSize: 14 },

    // Badge
    badge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
    badgeText: { fontSize: 11, textTransform: "capitalize" },

    // Card
    card: {
      backgroundColor: "rgba(8, 12, 20, 0.92)",
      borderRadius: 24,
      padding: 18,
      borderWidth: 1,
      borderColor: C.white + "0E",
    },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
    dateText: { fontSize: 12, color: C.zinc[500], flex: 1, marginRight: 8 },
    cardGrid: { flexDirection: "row", gap: 12, marginBottom: 8 },
    cardGridItem: { flex: 1, gap: 2 },
    labelText: { fontSize: 12, color: C.zinc[500] },
    valueText: { fontSize: 14, color: C.white },
    currencyText: { fontSize: 12, color: C.zinc[500] },
    commissionText: { fontSize: 12, color: C.zinc[500], marginTop: 4 },
    separator: { height: 8 },

    // Table
    table: { borderWidth: 1, borderColor: C.white + "0A", borderRadius: 16, overflow: "hidden", minWidth: "100%", backgroundColor: "rgba(255,255,255,0.03)" },
    tableRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: C.zinc[800] },
    tableRowAlt: { backgroundColor: C.black },
    tableHeaderRow: { backgroundColor: C.black },
    tableCell: { paddingHorizontal: 8, minWidth: 80 },
    tableHeaderText: { fontSize: 12, color: C.zinc[500], textTransform: "uppercase", letterSpacing: 0.5 },
    tableCellText: { fontSize: 13, color: C.white },
    textRight: { textAlign: "right" },

    // Pagination
    pagination: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 4 },
    paginationInfo: { fontSize: 13, color: C.zinc[500], marginBottom: 160 },
    paginationButtons: { flexDirection: "row", gap: 8, marginBottom: 160 },
    paginationBtn: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 12,
      backgroundColor: C.white + "06",
      borderWidth: 1,
      borderColor: C.white + "0A",
    },
    paginationBtnDisabled: { opacity: 0.4 },
    paginationBtnText: { fontSize: 13, color: C.white },
    paginationBtnTextDisabled: { color: C.zinc[500] },
  })

// ─── Marketplace ─────────────────────────────────────────────────────────────

export const createMarketplaceStyles = (C: ThemeColors) =>
  StyleSheet.create({
    container: { gap: 16 },
    centered: { paddingVertical: 32, alignItems: "center", justifyContent: "center" },
    emptyText: { color: C.zinc[500], fontSize: 14 },

    // Select
    selectTrigger: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: C.white + "0A",
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: C.white + "05",
    },
    selectTriggerText: { fontSize: 14, color: C.white },
    selectChevron: { fontSize: 12, color: C.zinc[500] },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.88)", justifyContent: "flex-end" },
    modalSheet: {
      backgroundColor: "rgba(8, 12, 20, 0.98)",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: 1,
      borderColor: C.white + "0A",
      paddingVertical: 8,
      paddingBottom: 24,
    },
    modalOption: { paddingVertical: 14, paddingHorizontal: 20 },
    modalOptionActive: { backgroundColor: C.black },
    modalOptionText: { fontSize: 15, color: C.white },
    modalOptionTextActive: {},

    // Tab Bar
    tabBar: { flexDirection: "row", borderRadius: 16, overflow: "hidden", backgroundColor: C.white + "05", borderWidth: 1, borderColor: C.white + "0A" },
    tabBarItem: { flex: 1, paddingVertical: 12, alignItems: "center" },
    tabBarItemActive: { backgroundColor: C.primary[500] + "16" },
    tabBarItemText: { fontSize: 14, color: C.zinc[500] },
    tabBarItemTextActive: { color: C.white },

    panelContainer: { gap: 16 },

    // Card
    card: { backgroundColor: "rgba(8, 12, 20, 0.92)", borderRadius: 24, padding: 18, gap: 12, borderWidth: 1, borderColor: C.white + "0E" },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    cardHeaderLeft: { flex: 1, marginRight: 12, gap: 4 },
    itemName: { fontSize: 15, color: C.white, textTransform: "capitalize" },
    dateText: { fontSize: 12, color: C.zinc[500] },
    usdValue: { fontSize: 16, color: C.white },
    cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    labelText: { fontSize: 13, color: C.zinc[500] },
    priceText: { fontSize: 13, color: C.white },
    currencyText: { fontSize: 12, color: C.zinc[500] },
    separator: { height: 8 },

    // Table
    table: { borderWidth: 1, borderColor: C.white + "0A", borderRadius: 16, overflow: "hidden", minWidth: "100%", backgroundColor: "rgba(255,255,255,0.03)" },
    tableRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: C.zinc[800] },
    tableRowAlt: { backgroundColor: C.black },
    tableHeaderRow: { backgroundColor: C.black },
    tableCell: { paddingHorizontal: 8, minWidth: 80 },
    tableHeaderText: { fontSize: 12, color: C.zinc[500], textTransform: "uppercase", letterSpacing: 0.5 },
    tableCellText: { fontSize: 13, color: C.white },
    textRight: { textAlign: "right" },
    capitalize: { textTransform: "capitalize" },
    uppercase: { textTransform: "uppercase" },

    // Pagination
    pagination: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 4 },
    paginationInfo: { fontSize: 13, color: C.zinc[500], marginBottom: 160 },
    paginationButtons: { flexDirection: "row", gap: 8, marginBottom: 160 },
    paginationBtn: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 12,
      backgroundColor: C.white + "06",
      borderWidth: 1,
      borderColor: C.white + "0A",
    },
    paginationBtnDisabled: { opacity: 0.4 },
    paginationBtnText: { fontSize: 13, color: C.white },
    paginationBtnTextDisabled: { color: C.zinc[500] },
  })

// ─── Feeding ──────────────────────────────────────────────────────────────────

export const createFeedingStyles = (C: ThemeColors) =>
  StyleSheet.create({
    container: { gap: 16 },
    centered: { paddingVertical: 32, alignItems: "center", justifyContent: "center" },
    emptyText: { color: C.zinc[500], fontSize: 14 },

    // Card
    card: { backgroundColor: "rgba(8, 12, 20, 0.92)", borderRadius: 24, padding: 18, gap: 12, borderWidth: 1, borderColor: C.white + "0E" },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    cardHeaderLeft: { flex: 1, marginRight: 12, gap: 4 },
    modelText: { fontSize: 14, color: C.white, textTransform: "capitalize" },
    dateText: { fontSize: 12, color: C.zinc[500] },
    cardHeaderRight: { alignItems: "flex-end", gap: 2 },
    netUsdAmount: { fontSize: 18, color: C.primary[500] },
    netUsdLabel: { fontSize: 11, color: C.zinc[500] },

    // Stat Chips
    chipRow: { flexDirection: "row", gap: 6 },
    chip: {
      flex: 1,
      backgroundColor: C.white + "05",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: C.white + "08",
      paddingVertical: 6,
      paddingHorizontal: 4,
      alignItems: "center",
      gap: 2,
    },
    chipLabel: { fontSize: 10, color: C.zinc[500] },
    chipValue: { fontSize: 13, color: C.white },
    separator: { height: 8 },

    // Table
    table: { borderWidth: 1, borderColor: C.white + "0A", borderRadius: 16, overflow: "hidden", minWidth: "100%", backgroundColor: "rgba(255,255,255,0.03)" },
    tableRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: C.zinc[800] },
    tableRowAlt: { backgroundColor: C.black },
    tableHeaderRow: { backgroundColor: C.black },
    tableCell: { paddingHorizontal: 8, minWidth: 80 },
    tableHeaderText: { fontSize: 12, color: C.zinc[500], textTransform: "uppercase", letterSpacing: 0.5 },
    tableCellText: { fontSize: 13, color: C.white },
    textRight: { textAlign: "right" },
    capitalize: { textTransform: "capitalize" },

    // Pagination
    pagination: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 4 },
    paginationInfo: { fontSize: 13, color: C.zinc[500], marginBottom: 160 },
    paginationButtons: { flexDirection: "row", gap: 8, marginBottom: 160 },
    paginationBtn: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 12,
      backgroundColor: C.white + "06",
      borderWidth: 1,
      borderColor: C.white + "0A",
    },
    paginationBtnDisabled: { opacity: 0.4 },
    paginationBtnText: { fontSize: 13, color: C.white },
    paginationBtnTextDisabled: { color: C.zinc[500] },
  })

// ─── Deposit ──────────────────────────────────────────────────────────────────

export const createDepositStyles = (C: ThemeColors) =>
  StyleSheet.create({
    container: { gap: 16 },
    centered: { paddingVertical: 32, alignItems: "center", justifyContent: "center" },
    emptyText: { color: C.zinc[500], fontSize: 14 },

    // Badge
    badge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
    badgeText: { fontSize: 11, textTransform: "capitalize" },

    // Card
    card: {
      paddingHorizontal: 18,
      paddingVertical: 18,
      gap: 12,
      backgroundColor: "rgba(8, 12, 20, 0.92)",
      borderRadius: 24,
      borderWidth: 1,
      borderColor: C.white + "0E",
    },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    cardHeaderLeft: { flex: 1, marginRight: 12, gap: 4 },
    itemName: { fontSize: 14, color: C.white, textTransform: "capitalize" },
    dateText: { fontSize: 12, color: C.zinc[500] },
    cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    itemAmount: { fontSize: 24, color: C.white },
    valueText: { fontSize: 18, color: C.primary[500] },
    separator: { height: 8 },

    // Table
    table: { borderWidth: 1, borderColor: C.white + "0A", borderRadius: 16, overflow: "hidden", minWidth: "100%", backgroundColor: "rgba(255,255,255,0.03)" },
    tableRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: C.zinc[800] },
    tableRowAlt: { backgroundColor: C.black },
    tableHeaderRow: { backgroundColor: C.black },
    tableCell: { paddingHorizontal: 8, minWidth: 80 },
    tableHeaderText: { fontSize: 12, color: C.zinc[500], textTransform: "uppercase", letterSpacing: 0.5 },
    tableCellText: { fontSize: 13, color: C.white },
    textRight: { textAlign: "right" },
    capitalize: { textTransform: "capitalize" },

    // Pagination
    pagination: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", bottom: 0, paddingTop: 4 },
    paginationInfo: { fontSize: 13, color: C.zinc[500], marginBottom: 160 },
    paginationButtons: { flexDirection: "row", gap: 8 },
    paginationBtn: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 12,
      backgroundColor: C.white + "06",
      borderWidth: 1,
      borderColor: C.white + "0A",
      marginBottom: 160,
    },
    paginationBtnDisabled: { opacity: 0.4 },
    paginationBtnText: { fontSize: 13, color: C.white },
    paginationBtnTextDisabled: { color: C.zinc[500] },
  })

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export const createTabsStyles = (C: ThemeColors) =>
  StyleSheet.create({
    list: { flexDirection: "row", backgroundColor: C.black, padding: 4, borderRadius: 8 },
    trigger: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
    activeTrigger: { backgroundColor: C.white },
    triggerText: { fontSize: 14, color: C.zinc[500] },
    activeText: { color: C.black },
    content: { marginTop: 10 },
  })

// ─── Transactions ─────────────────────────────────────────────────────────────

export const createTransactionsStyles = (C: ThemeColors) =>
  StyleSheet.create({
    container: { gap: 16 },
    centered: { paddingVertical: 32, alignItems: "center", justifyContent: "center" },
    emptyText: { color: C.zinc[500], fontSize: 14 },

    // Card
    card: { backgroundColor: "rgba(8, 12, 20, 0.92)", borderRadius: 24, padding: 18, borderWidth: 1, borderColor: C.white + "0E" },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
    cardHeaderLeft: { flex: 1, marginRight: 12, gap: 4 },
    typeBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: C.white + "06",
      borderWidth: 1,
      borderColor: C.white + "08",
      marginBottom: 4,
    },
    typeBadgeText: { fontSize: 11, color: C.white, textTransform: "capitalize" },
    dateText: { fontSize: 12, color: C.zinc[500] },
    usdAmount: { fontSize: 18, color: C.white },

    // Commodity Chips
    chipRow: { flexDirection: "row", gap: 6 },
    chip: {
      flex: 1,
      backgroundColor: C.white + "05",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: C.white + "08",
      paddingVertical: 6,
      paddingHorizontal: 4,
      alignItems: "center",
      gap: 2,
    },
    chipLabel: { fontSize: 10, color: C.zinc[500] },
    chipValue: { fontSize: 13, color: C.white },
    separator: { height: 8 },

    // Table
    table: { borderWidth: 1, borderColor: C.white + "0A", borderRadius: 16, overflow: "hidden", minWidth: "100%", backgroundColor: "rgba(255,255,255,0.03)" },
    tableRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: C.zinc[800] },
    tableRowAlt: { backgroundColor: C.black },
    tableHeaderRow: { backgroundColor: C.black },
    tableCell: { paddingHorizontal: 8, minWidth: 80 },
    tableHeaderText: { fontSize: 12, color: C.zinc[500], textTransform: "uppercase", letterSpacing: 0.5 },
    tableCellText: { fontSize: 13, color: C.white },
    textRight: { textAlign: "right" },
    capitalize: { textTransform: "capitalize" },

    // Pagination
    pagination: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 4 },
    paginationInfo: { fontSize: 13, color: C.zinc[500], marginBottom: 160 },
    paginationButtons: { flexDirection: "row", gap: 8, marginBottom: 160 },
    paginationBtn: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 12,
      backgroundColor: C.white + "06",
      borderWidth: 1,
      borderColor: C.white + "0A",
    },
    paginationBtnDisabled: { opacity: 0.4 },
    paginationBtnText: { fontSize: 13, color: C.white },
    paginationBtnTextDisabled: { color: C.zinc[500] },
  })

// ─── Bonuses ──────────────────────────────────────────────────────────────────

export const createBonusesStyles = (C: ThemeColors) =>
  StyleSheet.create({
    container: { gap: 16 },
    centered: { paddingVertical: 32, alignItems: "center", justifyContent: "center" },
    emptyText: { color: C.zinc[500], fontSize: 14 },

    // Badge
    badge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
    badgeText: { fontSize: 11, textTransform: "capitalize" },

    // Card
    card: { backgroundColor: "rgba(8, 12, 20, 0.92)", borderRadius: 24, padding: 18, gap: 12, borderWidth: 1, borderColor: C.white + "0E" },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    cardHeaderLeft: { flex: 1, marginRight: 12, gap: 4 },
    itemName: { fontSize: 14, color: C.white, textTransform: "capitalize" },
    dateText: { fontSize: 12, color: C.zinc[500] },
    cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    amountText: { fontSize: 24, color: C.white },
    valueText: { fontSize: 18, color: C.primary[500] },
    separator: { height: 8 },

    // Table
    table: { borderWidth: 1, borderColor: C.white + "0A", borderRadius: 16, overflow: "hidden", minWidth: "100%", backgroundColor: "rgba(255,255,255,0.03)" },
    tableRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: C.zinc[800] },
    tableRowAlt: { backgroundColor: C.black },
    tableHeaderRow: { backgroundColor: C.black },
    tableCell: { paddingHorizontal: 8, minWidth: 80 },
    tableHeaderText: { fontSize: 12, color: C.zinc[500], textTransform: "uppercase", letterSpacing: 0.5 },
    tableCellText: { fontSize: 13, color: C.white },
    textRight: { textAlign: "right" },
    capitalize: { textTransform: "capitalize" },

    // Pagination
    pagination: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 4 },
    paginationInfo: { fontSize: 13, color: C.zinc[500], marginBottom: 160 },
    paginationButtons: { flexDirection: "row", gap: 8, marginBottom: 160 },
    paginationBtn: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 12,
      backgroundColor: C.white + "06",
      borderWidth: 1,
      borderColor: C.white + "0A",
    },
    paginationBtnDisabled: { opacity: 0.4 },
    paginationBtnText: { fontSize: 13, color: C.white },
    paginationBtnTextDisabled: { color: C.zinc[500] },
  })

// ─── History ──────────────────────────────────────────────────────────────────

export const createHistoryStyles = (C: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 158,
      paddingHorizontal: 16,
      backgroundColor: C.black,
      gap: 16,
    },
    heroCard: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 30,
      padding: 20,
      marginBottom: 20,
      backgroundColor: "rgba(8, 12, 20, 0.94)",
      borderWidth: 1,
      borderColor: C.white + "10",
      gap: 12,
    },
    heroSheen: {
      ...StyleSheet.absoluteFillObject,
    },
    heroOrb: {
      position: "absolute",
      top: -38,
      right: -20,
      width: 152,
      height: 152,
      borderRadius: 999,
      backgroundColor: C.primary[500] + "18",
    },
    heroEdgeOrb: {
      position: "absolute",
      bottom: -32,
      left: -20,
      width: 112,
      height: 112,
      borderRadius: 999,
      backgroundColor: C.white + "07",
    },
    heroInnerRing: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 29,
      borderWidth: 1,
      borderColor: C.white + "05",
      margin: 1,
    },
    heroEyebrow: {
      color: C.primary[300],
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: 2,
    },
    heroBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: C.white,
    },
    heroBadgeText: {
      color: C.black,
      fontSize: 12,

      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    heroTitle: {
      color: C.white,
      fontSize: 28,
      lineHeight: 32,
    },
    heroDescription: {
      color: C.zinc[400],
      fontSize: 14,
      lineHeight: 20,
    },
    selectTrigger: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 18,
      borderWidth: 1,
      borderColor: C.white + "0A",
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: C.white + "05",
    },
    selectTriggerText: {
      color: C.white,
      fontSize: 15,
    },
    selectChevron: {
      color: C.primary[300],
      fontSize: 14,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.88)",
      justifyContent: "flex-end",
    },
    modalSheet: {
      backgroundColor: "rgba(8, 12, 20, 0.98)",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: 1,
      borderColor: C.white + "0A",
      paddingVertical: 8,
      paddingBottom: 24,
    },
    modalOption: {
      paddingVertical: 14,
      paddingHorizontal: 20,
    },
    modalOptionActive: {
      backgroundColor: C.black,
    },
    modalOptionText: {
      color: C.white,
      fontSize: 15,
    },
    modalOptionTextActive: {},
    tabRail: {
      marginHorizontal: -4,
      overflow: "hidden",
      display: "flex",
    },
    tabChip: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 18,
      backgroundColor: C.black,
    },
    tabChipActive: {
      backgroundColor: C.white,
    },
    tabChipText: {
      color: C.zinc[300],
      fontSize: 14,
    },
    tabChipTextActive: {
      color: C.black,
    },
    contentShell: {
      flex: 1,
      borderRadius: 30,
      paddingTop: 10,
      marginTop: 10,
      paddingHorizontal: 16,
      backgroundColor: "rgba(8, 12, 20, 0.92)",
      borderWidth: 1,
      borderColor: C.white + "0E",
      overflow: "hidden",
    },
    contentHeader: {
      gap: 4,
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: C.zinc[800],
    },
    contentEyebrow: {
      color: C.zinc[500],
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: 1.8,
    },
    contentTitle: {
      color: C.white,
      fontSize: 22,
    },
    tabContent: {
      flex: 1,
    },
    tabContentInner: {
      paddingTop: 16,
      paddingBottom: 24,
      overflow: "hidden",
    },
  })
