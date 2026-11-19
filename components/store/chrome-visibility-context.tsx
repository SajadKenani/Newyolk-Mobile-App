import type { ReactNode } from "react"
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"

interface ChromeVisibilityContextType {
  isChromeVisible: boolean
  showChrome: () => void
  hideChrome: () => void
  reportScroll: (offsetY: number) => void
}

const TOP_RESET_THRESHOLD = 4
const HIDE_START_THRESHOLD = 4
const HIDE_DELTA_THRESHOLD = 3
const SHOW_DELTA_THRESHOLD = 3

const ChromeVisibilityContext = createContext<ChromeVisibilityContextType | undefined>(undefined)

export const ChromeVisibilityProvider = ({ children }: { children: ReactNode }) => {
  const [isChromeVisible, setIsChromeVisible] = useState(true)
  const lastScrollYRef = useRef(0)

  const showChrome = useCallback(() => {
    lastScrollYRef.current = 0
    setIsChromeVisible(true)
  }, [])

  const hideChrome = useCallback(() => {
    setIsChromeVisible(false)
  }, [])

  const reportScroll = useCallback(
    (offsetY: number) => {
      const nextScrollY = Math.max(0, offsetY)

      if (nextScrollY <= TOP_RESET_THRESHOLD) {
        showChrome()
        return
      }

      const delta = nextScrollY - lastScrollYRef.current

      if (delta >= HIDE_DELTA_THRESHOLD && nextScrollY > HIDE_START_THRESHOLD) {
        hideChrome()
      } else if (delta <= -SHOW_DELTA_THRESHOLD) {
        setIsChromeVisible(true)
      }

      lastScrollYRef.current = nextScrollY
    },
    [hideChrome, showChrome],
  )

  const value = useMemo(
    () => ({
      isChromeVisible,
      showChrome,
      hideChrome,
      reportScroll,
    }),
    [hideChrome, isChromeVisible, reportScroll, showChrome],
  )

  return <ChromeVisibilityContext.Provider value={value}>{children}</ChromeVisibilityContext.Provider>
}

export const useChromeVisibility = () => {
  const context = useContext(ChromeVisibilityContext)

  if (!context) {
    throw new Error("useChromeVisibility must be used within a ChromeVisibilityProvider")
  }

  return context
}
