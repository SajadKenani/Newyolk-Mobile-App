import { StyleSheet } from "react-native"

// ============================================================================
// DESIGN TOKENS
// ============================================================================

const SPACING = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
} as const

const RADIUS = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 40,
  full: 9999,
} as const

const SIZES = {
  icon: 36,
  dot: 8,
  statusIndicator: 16,
  profileImage: 80,
  modalWidth: 192,
} as const

// ============================================================================
// STYLES
// ============================================================================

export const styles = StyleSheet.create({
  // --------------------------------------------------------------------------
  // LIST ITEMS
  // --------------------------------------------------------------------------
  itemContainer: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.sm,
    borderRadius: 18,
    overflow: "hidden",
  },
  itemInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
  },
  iconContainer: {
    width: SIZES.icon,
    height: SIZES.icon,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    marginRight: 12,
    borderWidth: 1,
  },
  activeIndicator: {
    marginLeft: 10,
    height: 24,
    width: 4,
    borderRadius: RADIUS.sm,
  },

  // --------------------------------------------------------------------------
  // PROFILE
  // --------------------------------------------------------------------------
  profileImage: {
    width: SIZES.profileImage,
    height: SIZES.profileImage,
    borderRadius: SIZES.profileImage / 2,
  },
  profileBorder: {
    borderRadius: 42,
    borderWidth: 2,
    padding: 2,
  },
  statusIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: SIZES.statusIndicator,
    height: SIZES.statusIndicator,
    borderRadius: SIZES.statusIndicator / 2,
    borderWidth: 2,
  },

  // --------------------------------------------------------------------------
  // BUTTONS & BADGES
  // --------------------------------------------------------------------------
  realmButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  realmDot: {
    width: SIZES.dot,
    height: SIZES.dot,
    borderRadius: SIZES.dot / 2,
  },
  valueContainer: {
    borderRadius: RADIUS.md,
    paddingHorizontal: 10,
    paddingVertical: SPACING.xs,
  },

  // --------------------------------------------------------------------------
  // CARDS
  // --------------------------------------------------------------------------
  balanceCard: {
    width: "100%",
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.xl,
  },

  // --------------------------------------------------------------------------
  // MODALS
  // --------------------------------------------------------------------------
  modalContainer: {
    width: SIZES.modalWidth,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
  },
  modalOption: {
    borderBottomWidth: 1,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },

  // --------------------------------------------------------------------------
  // UTILITY
  // --------------------------------------------------------------------------
  divider: {
    marginHorizontal: SPACING.xl,
    marginVertical: SPACING.lg,
    height: 1,
  },
})
