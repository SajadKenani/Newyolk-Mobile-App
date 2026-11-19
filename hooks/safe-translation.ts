import type { T as OriginalT } from "@/messages/types"
import { I18nManager } from "react-native"
import { getLocales } from "expo-localization"
import arAE from "@/messages/data/ar-ae.json"
import arIQ from "@/messages/data/ar-iq.json"
import enUS from "@/messages/data/en-us.json"
import roRO from "@/messages/data/ro-ro.json"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { I18n } from "i18n-js"

const translations: Record<SupportedLang, unknown> = {
  "ar-ae": arAE,
  "ar-iq": arIQ,
  "en-us": enUS,
  "ro-ro": roRO,
}

const i18nInstance = new I18n(translations)
const locales = getLocales()
const deviceLang = locales[0]?.languageCode as "en-us" | "ar-ae" | "ar-iq" | "ro-ro"
let currentLang: SupportedLang = ["en-us", "ar-ae", "ar-iq", "ro-ro"].includes(deviceLang) ? deviceLang : "en-us"
i18nInstance.locale = currentLang

AsyncStorage.getItem("@language")
  .then((storedLang) => {
    if (storedLang && ["en-us", "ar-ae", "ar-iq", "ro-ro"].includes(storedLang)) {
      currentLang = storedLang as SupportedLang
      i18nInstance.locale = currentLang
      try {
        I18nManager.forceRTL(false)
        I18nManager.allowRTL(false)
      } catch (error) {
        console.log("error: ", error)
      }
    }
  })
  .catch((error) => {
    console.log("error: ", error)
  })

export type SupportedLang = "en-us" | "ar-ae" | "ar-iq" | "ro-ro"

export type TranslationProxy = ((key: string, fallback?: string) => string) & OriginalT

export interface SafeTranslation {
  t: TranslationProxy
  changeLanguage: (lang: SupportedLang) => Promise<void>
  getCurrentLanguage: () => SupportedLang
  i18n: I18n
  currentLang: string
  isLoading: boolean
  subscribe: (callback: (lang: SupportedLang) => void) => () => void
  get: (path: string) => unknown
}

const listeners = new Set<(lang: SupportedLang) => void>()

let isLoading = false

export const useSafeTranslation: SafeTranslation = {
  t: new Proxy(((key: string, fallback?: string) => i18nInstance.t(key, { defaultValue: fallback ?? key })) as TranslationProxy, {
    get: (_target, prop: string | symbol) => {
      const rootSegments = [String(prop)]

      const isRecord = (val: unknown): val is Record<string, unknown> => typeof val === "object" && val !== null

      const getFromDict = (segments: string[]) => {
        let node: unknown = translations[currentLang]
        for (const s of segments) {
          if (isRecord(node) && s in node) {
            node = node[s]
          } else {
            return undefined
          }
        }
        return node
      }
      const makePathProxy = (segments: string[]) =>
        new Proxy(
          () => {
            ""
          },
          {
            apply: (_fnTarget, _thisArg, argArray: unknown[]) => {
              const key = segments.join(".")
              const arg = argArray?.[0]
              const params = typeof arg === "string" ? { currency: arg } : arg && isRecord(arg) ? arg : {}
              return String(i18nInstance.t(key, { defaultValue: key, ...params }))
            },
            get: (_inner, next: string | symbol) => {
              if (typeof next === "symbol") {
                return undefined
              }

              const nextSegments = [...segments, String(next)]
              const key = segments.join(".")
              const valueAtPath = getFromDict(segments)

              if (typeof valueAtPath === "string") {
                return String(i18nInstance.t(key, { defaultValue: key }))
              }

              const nextVal = getFromDict(nextSegments)

              if (typeof nextVal === "string") {
                if (String(next) === "amount") {
                  const callable = (...args: unknown[]) => {
                    const a0 = args?.[0]
                    const params = typeof a0 === "string" ? { currency: a0 } : a0 && isRecord(a0) ? a0 : {}
                    const leafKey = nextSegments.join(".")
                    return String(i18nInstance.t(leafKey, { defaultValue: leafKey, ...params }))
                  }
                  return new Proxy(callable, {
                    get: () => {
                      const leafKey = nextSegments.join(".")
                      return String(i18nInstance.t(leafKey, { defaultValue: leafKey }))
                    },
                  })
                }
                const leafKey = nextSegments.join(".")
                return String(i18nInstance.t(leafKey, { defaultValue: leafKey }))
              }

              return makePathProxy(nextSegments)
            },
          },
        )
      return makePathProxy(rootSegments)
    },
  }),
  changeLanguage: async (lang: SupportedLang) => {
    isLoading = true
    currentLang = lang
    i18nInstance.locale = lang

    try {
      I18nManager.forceRTL(false)
      I18nManager.allowRTL(false)
    } catch (error) {
      console.log("error: ", error)
    }

    listeners.forEach((callback) => callback(lang))
    await AsyncStorage.setItem("@language", lang)
    isLoading = false
  },
  getCurrentLanguage: (): SupportedLang => {
    return currentLang
  },
  get currentLang() {
    return currentLang
  },
  i18n: i18nInstance,
  get isLoading() {
    return isLoading
  },
  subscribe: (callback: (lang: SupportedLang) => void) => {
    listeners.add(callback)
    return () => listeners.delete(callback)
  },
  get: (path: string) => {
    const segments = path.split(".")
    const isRecord = (val: unknown): val is Record<string, unknown> => typeof val === "object" && val !== null
    let node: unknown = translations[currentLang]
    for (const s of segments) {
      if (isRecord(node) && s in node) {
        node = node[s]
      } else {
        return undefined
      }
    }
    return node
  },
}
