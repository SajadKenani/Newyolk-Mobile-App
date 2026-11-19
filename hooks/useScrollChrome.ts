import { useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { useChromeVisibility } from "@/components/store/chrome-visibility-context"

interface UseScrollChromeOptions {
  hideOnScroll?: boolean
}

const useScrollChrome = ({ hideOnScroll = true }: UseScrollChromeOptions = {}) => {
  const { reportScroll, showChrome } = useChromeVisibility()

  useFocusEffect(
    useCallback(() => {
      showChrome()

      return () => {
        showChrome()
      }
    }, [showChrome]),
  )

  const handleChromeScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!hideOnScroll) {
        showChrome()
        return
      }

      reportScroll(event.nativeEvent.contentOffset.y)
    },
    [hideOnScroll, reportScroll, showChrome],
  )

  return {
    handleChromeScroll,
    showChrome,
  }
}

export { useScrollChrome }
