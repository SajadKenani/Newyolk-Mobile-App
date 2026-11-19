import { Image, Pressable, TouchableOpacity, View, StyleSheet } from "react-native"
import { BlurView } from "expo-blur"
import { Link } from "expo-router"
import { useSafeTranslation } from "@/hooks/safe-translation"
import type { RouterOutputs } from "@newyolk/api"
import Text from "@/components/native/text"
import { useThemeColors } from "@/config/colors"
import { Check, Info } from "lucide-react-native"
import { getFarmAssetImageSource } from "@/utils/local-asset-image"

type Item = RouterOutputs["collection"]["infiniteItemsByName"]["items"][number]

const ASSET_HREFS = {
  hen: "/assets/hen/",
  egg: "/assets/egg/",
  cattle: "/assets/cattle/",
  incubatingEgg: "/assets/incubatingEgg/",
  cockerel: "/assets/cockerel/",
  bull: "/assets/bull/",
  heifer: "/assets/heifer/",
} as const

const isHen = (item: Item) => item.href === ASSET_HREFS.hen
const isEgg = (item: Item) => item.href === ASSET_HREFS.egg
const isCattle = (item: Item) => item.href === ASSET_HREFS.cattle
const isIncubatingEgg = (item: Item) => item.href === ASSET_HREFS.incubatingEgg
const isCockerel = (item: Item) => item.href === ASSET_HREFS.cockerel
const isBull = (item: Item) => item.href === ASSET_HREFS.bull
const isHeifer = (item: Item) => item.href === ASSET_HREFS.heifer

const FARMING_ASSET_CHECK = (item: Item) => isHen(item) || isCattle(item) || isCockerel(item) || isBull(item) || isHeifer(item)

const HATCHING_ASSET_CHECK = (item: Item) => isEgg(item) || isIncubatingEgg(item)

const getImageSource = (item: Item) => getFarmAssetImageSource({ href: item.href, state: item.state, numId: item.numId })

interface Props {
  item: Item
  handleAssetPress: (id: string) => void
  selectedAssets: string[]
}

const AssetsCard = ({ item, handleAssetPress, selectedAssets }: Props) => {
  const { t } = useSafeTranslation
  const COLORS = useThemeColors()

  const now = new Date()
  const isInsured = !!item.insuranceValidUntil && item.insuranceValidUntil > now
  const isFarmingAsset = FARMING_ASSET_CHECK(item)
  const isHatchingAsset = HATCHING_ASSET_CHECK(item)
  const isSelected = selectedAssets.includes(item.id)
  const imageSource = getImageSource(item)

  return (
    <Pressable onPress={() => handleAssetPress(item.id)} style={[styles.card, isSelected && styles.cardSelected]}>
      {/* State badge */}
      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.state.replace("Egg", "")}</Text>
        </View>
      </View>

      {/* Info button */}
      <Link href={`${item.href}:${item.numId.toString()}`} asChild>
        <TouchableOpacity style={styles.infoButton} activeOpacity={0.7}>
          <View style={[styles.iconCircle, { backgroundColor: COLORS.primary[500] }]}>
            <Info size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </Link>

      {/* Select / deselect button */}
      <TouchableOpacity onPress={() => handleAssetPress(item.id)} style={styles.selectButton} activeOpacity={0.7}>
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: isSelected ? COLORS.primary[500] : "rgba(255,255,255,0.15)",
              borderWidth: isSelected ? 0 : 1.5,
              borderColor: "rgba(255,255,255,0.5)",
            },
          ]}
        >
          {isSelected ? <Check size={16} color="#FFFFFF" /> : <View style={styles.iconPlaceholder} />}
        </View>
      </TouchableOpacity>

      {/* Image + overlay */}
      <View style={styles.imageWrapper}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        <BlurView intensity={33} style={styles.blurOverlay} tint="dark">
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            {isFarmingAsset && (
              <Text style={[styles.statusText, item.isFarming ? styles.green : styles.red]}>
                {item.isFarming ? t.Assets.card.farming : t.Assets.card.notFarming}
              </Text>
            )}
            {isHatchingAsset && (
              <Text style={[styles.statusText, item.isHatching ? styles.green : styles.red]}>
                {item.isHatching ? t.Assets.card.hatching : t.Assets.card.notHatching}
              </Text>
            )}
          </View>
          <View>
            <Text style={styles.insuredLabel}>{t.Assets.card.insured}</Text>
            <Text style={[styles.insuredValue, isInsured ? styles.green : styles.red]}>{isInsured ? t.Assets.card.yes : t.Assets.card.no}</Text>
          </View>
        </BlurView>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#374151", // gray-700
    height: "100%",
    width: "47%",
  },
  cardSelected: {
    borderColor: "#ffffff",
  },
  badgeRow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 50,
    height: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  badge: {
    width: 112,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#374151", // gray-700
    backgroundColor: "transparent",
    padding: 2,
  },
  badgeText: {
    textAlign: "center",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 4,
    color: "#ffffff",
  },
  infoButton: {
    position: "absolute",
    top: 7,
    left: 7,
    zIndex: 9999,
    elevation: 10,
  },
  selectButton: {
    position: "absolute",
    top: 7,
    right: 7,
    zIndex: 9999,
    elevation: 10,
  },
  iconCircle: {
    borderRadius: 999,
    padding: 8,
  },
  iconPlaceholder: {
    width: 16,
    height: 16,
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 156,
    overflow: "hidden",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  blurOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  itemName: {
    fontSize: 18,
    color: "#ffffff",
  },
  statusText: {
    fontSize: 12,
  },
  insuredLabel: {
    textAlign: "right",
    fontSize: 14,
    color: "#ffffff",
  },
  insuredValue: {
    textAlign: "right",
    fontSize: 14,
  },
  green: {
    color: "#22c55e",
  },
  red: {
    color: "#ef4444",
  },
})

export { AssetsCard }
