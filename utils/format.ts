import Decimal from "decimal.js"

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
  CAD: "$",
  AUD: "$",
  JPY: "¥",
  IQD: "ع.د",
}

interface NumberFormatOptions {
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

interface CurrencyFormatOptions extends NumberFormatOptions {
  currency?: string
}

const getNumberParts = (value: Decimal.Value, options: NumberFormatOptions) => {
  const decimalValue = new Decimal(value ?? 0)
  const sign = decimalValue.isNegative() ? "-" : ""
  const absoluteValue = decimalValue.abs()
  const minimumFractionDigits = options.minimumFractionDigits ?? 0
  const maximumFractionDigits = options.maximumFractionDigits ?? minimumFractionDigits
  const digits = Math.max(minimumFractionDigits, maximumFractionDigits)
  const [integerPart, rawFraction = ""] = absoluteValue.toFixed(digits).split(".")
  let trimmedFraction = rawFraction
  while (trimmedFraction.length > minimumFractionDigits && trimmedFraction.endsWith("0")) {
    trimmedFraction = trimmedFraction.slice(0, -1)
  }
  const integerWithCommas = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  const formattedNumber = trimmedFraction.length > 0 ? `${integerWithCommas}.${trimmedFraction}` : integerWithCommas
  return { sign, formattedNumber }
}

export const formatNumber = (value: Decimal.Value, options?: NumberFormatOptions) => {
  const { sign, formattedNumber } = getNumberParts(value, {
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  })

  return `${sign}${formattedNumber}`
}

export const formatCurrency = (value: Decimal.Value, options?: CurrencyFormatOptions) => {
  const currencyKey = options?.currency?.toUpperCase() ?? ""
  const symbol = currencyKey ? (currencySymbols[currencyKey] ?? `${currencyKey} `) : ""
  const { sign, formattedNumber } = getNumberParts(value, {
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? options?.minimumFractionDigits ?? 0,
  })

  return `${sign}${symbol}${formattedNumber}`
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}
