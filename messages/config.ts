export const locales = ["en-us", "ar-iq", "ar-ae", "ro-ro"] as const
export const defaultLocale = "en-us"
export const localePrefix = "as-needed"

export type Locale = (typeof locales)[number]
