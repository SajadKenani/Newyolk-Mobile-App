/* eslint-disable @typescript-eslint/no-require-imports */
import type { ImageSourcePropType } from "react-native"

const GIFT_IMAGE = require("@/assets/images/asset/gift/gift.gif") as ImageSourcePropType
const PACK_STARTER_IMAGE = require("@/assets/images/asset/pack/Starter.png") as ImageSourcePropType
const PACK_STANDARD_IMAGE = require("@/assets/images/asset/pack/Standard.png") as ImageSourcePropType
const PACK_ADVANCED_IMAGE = require("@/assets/images/asset/pack/Advanced.png") as ImageSourcePropType
const PACK_PREMIUM_IMAGE = require("@/assets/images/asset/pack/Premium.png") as ImageSourcePropType
const PACK_ELITE_IMAGE = require("@/assets/images/asset/pack/Elite.png") as ImageSourcePropType
const PACK_ULTIMATE_IMAGE = require("@/assets/images/asset/pack/Ultimate.png") as ImageSourcePropType

const IMAGE_SERVER_BASE_URL = process.env.EXPO_PUBLIC_IMAGE_SERVER_URL?.trim().replace(/\/$/, "")

const PACK_IMAGE_BY_NAME: Record<string, ImageSourcePropType> = {
  starter: PACK_STARTER_IMAGE,
  standard: PACK_STANDARD_IMAGE,
  advanced: PACK_ADVANCED_IMAGE,
  premium: PACK_PREMIUM_IMAGE,
  elite: PACK_ELITE_IMAGE,
  ultimate: PACK_ULTIMATE_IMAGE,
}

const normalizeToken = (value: string | null | undefined) =>
  (value ?? "")
    .replace(/[?#].*$/, "")
    .replace(/\\/g, "/")
    .toLowerCase()

const normalizeHenId = (value: number) => ((value % 1000) + 1000) % 1000

const getServerAssetSource = (path: string): ImageSourcePropType => {
  const normalizedPath = path.replace(/^\/+/, "")
  return { uri: `${IMAGE_SERVER_BASE_URL}/images/asset/${normalizedPath}` }
}

const extractHenIdFromToken = (value: string | null | undefined) => {
  const token = normalizeToken(value)
  const match = /(?:^|\/)hen\/(\d+)\.png(?:$|\s)/.exec(token)
  if (!match) return null
  const parsed = Number(match[1])
  return Number.isFinite(parsed) ? parsed : null
}

const getHenImage = (numId?: number | null, token?: string | null) => {
  const resolvedNumId = typeof numId === "number" ? numId : extractHenIdFromToken(token)
  if (typeof resolvedNumId !== "number") return getServerAssetSource("growth/hen.jpg")
  return getServerAssetSource(`hen/${normalizeHenId(resolvedNumId)}.png`)
}

const getStateImage = (state: string, numId?: number | null): ImageSourcePropType | null => {
  const normalizedState = normalizeToken(state)
  if (normalizedState === "hen") return getHenImage(numId)
  if (normalizedState === "rooster") return getServerAssetSource("rooster/rooster.jpg")
  if (normalizedState === "cattle") return getServerAssetSource("cattle/cattle.jpg")
  if (normalizedState === "bull") return getServerAssetSource("cattle/bull.jpg")
  if (normalizedState === "heifer") return getServerAssetSource("cattle/heifer.jpg")
  if (normalizedState === "holstein") return getServerAssetSource("cattle/holstein.jpg")
  if (normalizedState === "presale") return getServerAssetSource("cattle/presale.jpg")
  if (normalizedState === "hatchingegg") return getServerAssetSource("egg/hatchingEgg.jpg")
  if (normalizedState === "hatchingegg-1") return getServerAssetSource("egg/hatchingEgg-1.jpg")
  if (normalizedState === "incubatingegg") return getServerAssetSource("egg/incubatingEgg.jpg")
  if (normalizedState === "chick") return getServerAssetSource("growth/chick.jpg")
  if (normalizedState === "cockerel") return getServerAssetSource("growth/cockerel.jpg")
  if (normalizedState === "feathers") return getServerAssetSource("growth/feathers.jpg")
  if (normalizedState === "hatched") return getServerAssetSource("growth/hatched.jpg")
  if (normalizedState === "hatched-1") return getServerAssetSource("growth/hatched-1.jpg")
  return null
}

const getImageFromFarmStylePath = (value: string | null | undefined, numId?: number | null): ImageSourcePropType | null => {
  const token = normalizeToken(value)

  const henId = extractHenIdFromToken(token)
  if (henId != null) return getHenImage(henId, token)

  const eggMatch = /(?:^|\/)egg\/(hatchingegg(?:-1)?|incubatingegg)\.jpg(?:$|\s)/.exec(token)
  if (eggMatch?.[1]) return getStateImage(eggMatch[1], numId)

  const growthMatch = /(?:^|\/)growth\/(chick|cockerel|feathers|hatched(?:-1)?|hen)\.jpg(?:$|\s)/.exec(token)
  if (growthMatch?.[1]) return getStateImage(growthMatch[1], numId)

  const cattleMatch = /(?:^|\/)cattle\/(bull|cattle|heifer|holstein|presale)\.jpg(?:$|\s)/.exec(token)
  if (cattleMatch?.[1]) return getStateImage(cattleMatch[1], numId)

  if (token.includes("/rooster/rooster.jpg")) return getServerAssetSource("rooster/rooster.jpg")

  return null
}

export const getGiftImageSource = () => GIFT_IMAGE

export const getFarmAssetImageSource = ({
  href,
  state,
  numId,
}: {
  href?: string | null
  state?: string | null
  numId?: number | null
}): ImageSourcePropType => {
  const normalizedHref = normalizeToken(href)
  const normalizedState = normalizeToken(state)

  if (normalizedHref.includes("/assets/hen/") || normalizedState === "hen") return getHenImage(numId, normalizedHref)
  if (normalizedHref.includes("/assets/cockerel/") || normalizedState === "cockerel") return getServerAssetSource("growth/cockerel.jpg")
  if (normalizedHref.includes("/assets/rooster/") || normalizedState === "rooster") return getServerAssetSource("rooster/rooster.jpg")

  if (normalizedHref.includes("/assets/egg/") || normalizedHref.includes("/assets/incubatingegg/") || normalizedState.includes("egg")) {
    if (normalizedState === "incubatingegg") return getServerAssetSource("egg/incubatingEgg.jpg")
    if (normalizedState === "hatchingegg-1") return getServerAssetSource("egg/hatchingEgg-1.jpg")
    return getServerAssetSource("egg/hatchingEgg.jpg")
  }

  if (normalizedHref.includes("/assets/cattle/") || normalizedHref.includes("/assets/bull/") || normalizedHref.includes("/assets/heifer/")) {
    if (normalizedState === "bull" || normalizedHref.includes("bull")) return getServerAssetSource("cattle/bull.jpg")
    if (normalizedState === "heifer" || normalizedHref.includes("heifer")) return getServerAssetSource("cattle/heifer.jpg")
    if (normalizedState === "holstein" || normalizedHref.includes("holstein")) return getServerAssetSource("cattle/holstein.jpg")
    if (normalizedState === "presale" || normalizedHref.includes("presale")) return getServerAssetSource("cattle/presale.jpg")
    return getServerAssetSource("cattle/cattle.jpg")
  }

  const stateImage = getStateImage(normalizedState, numId)
  if (stateImage) return stateImage

  return getServerAssetSource("growth/hen.jpg")
}

export const getCollectionImageSource = ({
  href,
  image,
  item,
}: {
  href?: string | null
  image?: string | null
  item?: string | null
}): ImageSourcePropType | null => {
  const token = `${normalizeToken(href)} ${normalizeToken(image)} ${normalizeToken(item)}`
  const farmPathImage = getImageFromFarmStylePath(token)
  if (farmPathImage) return farmPathImage

  if (token.includes("gift")) return GIFT_IMAGE
  if (token.includes("pack")) {
    const packEntry = Object.entries(PACK_IMAGE_BY_NAME).find(([name]) => token.includes(name))
    return packEntry?.[1] ?? PACK_STARTER_IMAGE
  }

  if (token.includes("rooster")) return getServerAssetSource("rooster/rooster.jpg")

  if (token.includes("cattle") || token.includes("bull") || token.includes("heifer") || token.includes("holstein") || token.includes("presale")) {
    return getFarmAssetImageSource({
      href,
      state: token.includes("bull")
        ? "bull"
        : token.includes("heifer")
          ? "heifer"
          : token.includes("holstein")
            ? "holstein"
            : token.includes("presale")
              ? "presale"
              : "cattle",
    })
  }

  if (token.includes("egg")) {
    return token.includes("incubating") ? getServerAssetSource("egg/incubatingEgg.jpg") : getServerAssetSource("egg/hatchingEgg.jpg")
  }

  if (token.includes("cockerel")) return getServerAssetSource("growth/cockerel.jpg")
  if (token.includes("hen") || token.includes("chick") || token.includes("feathers") || token.includes("hatched")) {
    if (token.includes("chick")) return getServerAssetSource("growth/chick.jpg")
    if (token.includes("feathers")) return getServerAssetSource("growth/feathers.jpg")
    if (token.includes("hatched-1")) return getServerAssetSource("growth/hatched-1.jpg")
    if (token.includes("hatched")) return getServerAssetSource("growth/hatched.jpg")
    return getServerAssetSource("growth/hen.jpg")
  }

  return null
}

export const getMarketplaceImageSource = ({
  assetImage,
  href,
  state,
  numId,
}: {
  assetImage?: string | null
  href?: string | null
  state?: string | null
  numId?: number | null
}) => {
  const token = normalizeToken(assetImage)
  const farmPathImage = getImageFromFarmStylePath(token, numId)
  if (farmPathImage) return farmPathImage

  if (state) {
    const stateImage = getStateImage(state, numId)
    if (stateImage) return stateImage
  }

  if (token.includes("incubatingegg")) return getServerAssetSource("egg/incubatingEgg.jpg")
  if (token.includes("hatchingegg")) {
    return token.includes("-1") ? getServerAssetSource("egg/hatchingEgg-1.jpg") : getServerAssetSource("egg/hatchingEgg.jpg")
  }
  if (token.includes("/rooster/")) return getServerAssetSource("rooster/rooster.jpg")

  if (token.includes("/cattle/")) {
    if (token.includes("bull")) return getServerAssetSource("cattle/bull.jpg")
    if (token.includes("heifer")) return getServerAssetSource("cattle/heifer.jpg")
    if (token.includes("holstein")) return getServerAssetSource("cattle/holstein.jpg")
    if (token.includes("presale")) return getServerAssetSource("cattle/presale.jpg")
    return getServerAssetSource("cattle/cattle.jpg")
  }

  return getFarmAssetImageSource({ href, state, numId })
}
